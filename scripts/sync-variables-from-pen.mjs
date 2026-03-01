import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { syncOnce } from './sync-canvas-to-tokens.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const appPenPath = path.join(root, 'app.pen');
const canvasVarsPath = path.join(root, 'canvas.variables.json');

function normalizeCanvasSnapshot(appPenJson) {
  const snapshot = {
    variables: appPenJson.variables ?? {}
  };

  if (appPenJson.themes && typeof appPenJson.themes === 'object') {
    snapshot.themes = appPenJson.themes;
  }

  return snapshot;
}

function flattenVariables(variables) {
  const output = {};
  for (const [name, entry] of Object.entries(variables ?? {})) {
    output[name] = JSON.stringify(entry);
  }
  return output;
}

function diffVariableStats(previousSnapshot, nextSnapshot) {
  const previous = flattenVariables(previousSnapshot?.variables ?? {});
  const next = flattenVariables(nextSnapshot?.variables ?? {});

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

export function refreshCanvasVariablesFromPen() {
  if (!fs.existsSync(appPenPath)) {
    throw new Error('app.pen not found.');
  }

  const appPenRaw = fs.readFileSync(appPenPath, 'utf8');
  const appPenJson = JSON.parse(appPenRaw);
  const nextSnapshot = normalizeCanvasSnapshot(appPenJson);

  const previousSnapshot = fs.existsSync(canvasVarsPath)
    ? JSON.parse(fs.readFileSync(canvasVarsPath, 'utf8'))
    : { variables: {} };

  const stats = diffVariableStats(previousSnapshot, nextSnapshot);
  fs.writeFileSync(canvasVarsPath, `${JSON.stringify(nextSnapshot, null, 2)}\n`, 'utf8');

  console.log(
    `Canvas variables refreshed: total=${stats.total}, added=${stats.added}, updated=${stats.updated}, removed=${stats.removed}`
  );

  return stats;
}

function runOnce() {
  refreshCanvasVariablesFromPen();
  syncOnce();
}

function runWatchMode() {
  runOnce();
  console.log('Watching app.pen for variable changes ...');

  const debounce = { timer: null };
  const trigger = () => {
    if (debounce.timer) {
      clearTimeout(debounce.timer);
    }
    debounce.timer = setTimeout(() => {
      try {
        runOnce();
      } catch (error) {
        console.error(`Variable sync failed: ${error.message}`);
      }
    }, 250);
  };

  fs.watch(appPenPath, trigger);
}

const isMainModule = process.argv[1] === fileURLToPath(import.meta.url);

if (isMainModule) {
  if (process.argv.includes('--watch')) {
    runWatchMode();
  } else {
    runOnce();
  }
}
