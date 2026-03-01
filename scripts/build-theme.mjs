import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function getActiveTheme() {
  return process.env.TOKEN_THEME || 'default';
}

function tokenValue(tokens, tokenPath) {
  const segments = tokenPath.split('.');
  let cursor = tokens;
  for (const segment of segments) {
    cursor = cursor?.[segment];
    if (!cursor) {
      return undefined;
    }
  }
  if (cursor && typeof cursor === 'object' && 'value' in cursor) {
    const activeTheme = getActiveTheme();
    if (activeTheme !== 'default' && cursor.themes && Object.prototype.hasOwnProperty.call(cursor.themes, activeTheme)) {
      return cursor.themes[activeTheme];
    }
    return cursor.value;
  }
  return cursor;
}

function tokenValueAny(tokens, tokenPaths) {
  for (const tokenPath of tokenPaths) {
    const value = tokenValue(tokens, tokenPath);
    if (value !== undefined) {
      return value;
    }
  }
  return undefined;
}

export function buildTheme() {
  const tokensPath = path.join(root, 'tokens.json');
  const themePath = path.join(root, 'tailwind.theme.extend.js');
  const tokens = readJson(tokensPath);

  const extend = {
    colors: {
      brand: {
        navy: tokenValue(tokens, 'color.background.primary'),
        slate: tokenValue(tokens, 'color.background.secondary'),
        ink: tokenValue(tokens, 'color.background.tertiary')
      },
      surface: {
        card: tokenValue(tokens, 'color.surface.card'),
        input: tokenValue(tokens, 'color.surface.input')
      },
      text: {
        primaryOnDark: tokenValue(tokens, 'color.text.primaryOnDark'),
        secondaryOnDark: tokenValue(tokens, 'color.text.secondaryOnDark'),
        mutedOnDark: tokenValue(tokens, 'color.text.mutedOnDark'),
        primaryOnLight: tokenValue(tokens, 'color.text.primaryOnLight'),
        secondaryOnLight: tokenValue(tokens, 'color.text.secondaryOnLight'),
        label: tokenValue(tokens, 'color.text.label')
      },
      border: {
        card: tokenValue(tokens, 'color.border.card'),
        input: tokenValue(tokens, 'color.border.input')
      },
      action: {
        primaryStart: tokenValue(tokens, 'color.action.primaryStart'),
        primaryEnd: tokenValue(tokens, 'color.action.primaryEnd')
      }
    },
    fontFamily: {
      sans: [tokenValue(tokens, 'font.family.base') || 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
    },
    borderRadius: {
      cardLg: tokenValue(tokens, 'radius.card.lg'),
      cardMd: tokenValue(tokens, 'radius.card.md'),
      control: tokenValue(tokens, 'radius.control.md'),
      controlSm: tokenValue(tokens, 'radius.control.sm')
    },
    spacing: {
      1: tokenValueAny(tokens, ['space.1', 'spacing.1']),
      2: tokenValueAny(tokens, ['space.2', 'spacing.2']),
      3: tokenValueAny(tokens, ['space.3', 'spacing.3']),
      4: tokenValueAny(tokens, ['space.4', 'spacing.4']),
      5: tokenValueAny(tokens, ['space.5', 'spacing.5']),
      6: tokenValueAny(tokens, ['space.6', 'spacing.6']),
      7: tokenValueAny(tokens, ['space.7', 'spacing.7']),
      8: tokenValueAny(tokens, ['space.8', 'spacing.8']),
      12: tokenValueAny(tokens, ['space.12', 'spacing.12'])
    },
    height: {
      input: tokenValue(tokens, 'size.input.desktop'),
      inputMobile: tokenValue(tokens, 'size.input.mobile'),
      btn: tokenValue(tokens, 'size.button.desktop'),
      btnMobile: tokenValue(tokens, 'size.button.mobile')
    },
    boxShadow: {
      card: tokenValue(tokens, 'shadow.card.desktop'),
      cardMobile: tokenValue(tokens, 'shadow.card.mobile')
    },
    backgroundImage: {
      loginBg: `linear-gradient(140deg, ${tokenValue(tokens, 'color.background.primary')} 0%, ${tokenValue(tokens, 'color.background.secondary')} 45%, ${tokenValue(tokens, 'color.background.tertiary')} 100%)`,
      primaryButton: `linear-gradient(120deg, ${tokenValue(tokens, 'color.action.primaryStart')} 0%, ${tokenValue(tokens, 'color.action.primaryEnd')} 100%)`
    },
    fontSize: {
      heroDesktop: ['54px', { lineHeight: '1.1', fontWeight: '700' }],
      heroMobile: ['40px', { lineHeight: '1.1', fontWeight: '700' }],
      cardTitleDesktop: ['32px', { lineHeight: '1.2', fontWeight: '700' }],
      cardTitleMobile: ['28px', { lineHeight: '1.2', fontWeight: '700' }]
    },
    maxWidth: {
      loginCard: '420px'
    }
  };

  const output = `module.exports = ${JSON.stringify(extend, null, 2)};\n`;
  fs.writeFileSync(themePath, output, 'utf8');
  return extend;
}

if (process.argv[1] === __filename) {
  buildTheme();
  console.log(`tailwind.theme.extend.js updated from tokens.json (theme=${getActiveTheme()})`);
}
