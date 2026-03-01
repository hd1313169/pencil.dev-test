import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildTheme } from './build-theme.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const appPenPath = path.join(root, 'app.pen');
const canvasVarsPath = path.join(root, 'canvas.variables.json');
const tokensPath = path.join(root, 'tokens.json');

function toTokenPrimitive(entryType, rawValue) {
  if (entryType === 'number') {
    return `${rawValue}px`;
  }
  return rawValue;
}

function themeKeyFromObject(themeObject) {
  const entries = Object.entries(themeObject ?? {}).sort(([keyA], [keyB]) => keyA.localeCompare(keyB));
  if (entries.length === 0) {
    return 'default';
  }
  return entries.map(([axis, value]) => `${axis}=${value}`).join('|');
}

function buildTokenNodeFromVariableEntry(entry, themeRegistry) {
  const value = entry?.value;

  if (!Array.isArray(value)) {
    return { value: toTokenPrimitive(entry.type, value) };
  }

  let defaultValue;
  const themes = {};

  for (const variant of value) {
    const variantValue = toTokenPrimitive(entry.type, variant?.value);
    const themeObject = variant?.theme;

    if (!themeObject || Object.keys(themeObject).length === 0) {
      defaultValue = variantValue;
      continue;
    }

    const themeKey = themeKeyFromObject(themeObject);
    themes[themeKey] = variantValue;
    themeRegistry[themeKey] = themeObject;
  }

  if (defaultValue === undefined) {
    const firstThemeKey = Object.keys(themes)[0];
    defaultValue = firstThemeKey ? themes[firstThemeKey] : undefined;
  }

  if (Object.keys(themes).length === 0) {
    return { value: defaultValue };
  }

  return { value: defaultValue, themes };
}

function setNestedValue(target, keys, value) {
  let cursor = target;
  for (let index = 0; index < keys.length - 1; index += 1) {
    const key = keys[index];
    if (!cursor[key]) {
      cursor[key] = {};
    }
    cursor = cursor[key];
  }
  cursor[keys[keys.length - 1]] = value;
}

function buildTokensFromCanvasVariables(variables) {
  const result = {
    $schema: 'https://design-tokens.github.io/community-group/format/'
  };

  const themeRegistry = {
    default: {}
  };

  for (const [name, entry] of Object.entries(variables)) {
    const keys = name.split('.');
    const tokenNode = buildTokenNodeFromVariableEntry(entry, themeRegistry);
    setNestedValue(result, keys, tokenNode);
  }

  if (Object.keys(themeRegistry).length > 1) {
    result.$themes = themeRegistry;
  }

  return result;
}

function flattenTokenNodes(node, pathPrefix = '', output = {}) {
  if (!node || typeof node !== 'object') {
    return output;
  }

  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith('$')) {
      continue;
    }

    const currentPath = pathPrefix ? `${pathPrefix}.${key}` : key;
    const isTokenNode = value && typeof value === 'object' && Object.prototype.hasOwnProperty.call(value, 'value');

    if (isTokenNode) {
      output[currentPath] = JSON.stringify(value);
      continue;
    }

    flattenTokenNodes(value, currentPath, output);
  }

  return output;
}

function computeDiffStats(previousTokens, nextTokens) {
  const previous = flattenTokenNodes(previousTokens);
  const next = flattenTokenNodes(nextTokens);

  const previousKeys = new Set(Object.keys(previous));
  const nextKeys = new Set(Object.keys(next));

  let added = 0;
  let updated = 0;
  let removed = 0;

  for (const key of nextKeys) {
    if (!previousKeys.has(key)) {
      added += 1;
      continue;
    }
    if (previous[key] !== next[key]) {
      updated += 1;
    }
  }

  for (const key of previousKeys) {
    if (!nextKeys.has(key)) {
      removed += 1;
    }
  }

  return { added, updated, removed, total: nextKeys.size };
}

export function syncOnce() {
  if (!fs.existsSync(canvasVarsPath)) {
    console.log('Skip: canvas.variables.json not found.');
    return;
  }

  if (fs.existsSync(appPenPath)) {
    const appPenStat = fs.statSync(appPenPath);
    const canvasStat = fs.statSync(canvasVarsPath);
    if (appPenStat.mtimeMs > canvasStat.mtimeMs) {
      console.log('Warning: app.pen is newer than canvas.variables.json. Refresh canvas variable snapshot before syncing.');
    }
  }

  const raw = JSON.parse(fs.readFileSync(canvasVarsPath, 'utf8'));
  const variables = raw.variables ?? raw;
  const tokens = buildTokensFromCanvasVariables(variables);

  const previousTokens = fs.existsSync(tokensPath)
    ? JSON.parse(fs.readFileSync(tokensPath, 'utf8'))
    : { $schema: 'https://design-tokens.github.io/community-group/format/' };
  const stats = computeDiffStats(previousTokens, tokens);

  fs.writeFileSync(tokensPath, `${JSON.stringify(tokens, null, 2)}\n`, 'utf8');
  buildTheme();

  console.log('Synced: canvas.variables.json -> tokens.json -> tailwind.theme.extend.js');
  console.log(`Tokens: total=${stats.total}, added=${stats.added}, updated=${stats.updated}, removed=${stats.removed}`);
  console.log('Note: only variable changes are synced. Direct layer fill edits are not exported unless mapped into variables.');
}

export function watchMode() {
  syncOnce();
  console.log('Watching app.pen and canvas.variables.json ...');

  const debounce = { timer: null };
  const triggerSync = () => {
    if (debounce.timer) {
      clearTimeout(debounce.timer);
    }
    debounce.timer = setTimeout(() => {
      syncOnce();
    }, 250);
  };

  if (fs.existsSync(appPenPath)) {
    fs.watch(appPenPath, triggerSync);
  }
  fs.watch(path.dirname(canvasVarsPath), (eventType, filename) => {
    if (filename === 'canvas.variables.json') {
      triggerSync();
    }
  });
}

const isMainModule = process.argv[1] === fileURLToPath(import.meta.url);

if (isMainModule) {
  if (process.argv.includes('--watch')) {
    watchMode();
  } else {
    syncOnce();
  }
}
