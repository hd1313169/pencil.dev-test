# UI Kit Library

這份 UI Kit 由 `app.pen` 的 Login 畫布整理而成，目標是讓工程師可在不同專案中快速重用。

## 內容

- `ui-patterns.json`：UI Patterns 規格（Foundations + Components + States）
- `src/ui-kit.css`：可直接套用的元件 class（含狀態）

## Foundations（設計基礎）

- 顏色：背景、表面、文字、邊框、行為色
- 字型：Inter + 標準字級階層（hero/card/body/label/button）
- 尺寸：input/button desktop/mobile
- 圓角：card/control desktop/mobile
- 陰影：desktop/mobile card
- 間距：`space.1`~`space.12`

所有 Foundation 值皆對應 `tokens.json`，來源為畫布 variables。

## Components（含狀態）

- Card：`ui-card`
- Input：`ui-input`（`hover/focus/error/disabled`）
- Primary Button：`ui-btn-primary`（`hover/active/focus/disabled`）
- Link：`ui-link`（`hover/focus/disabled`）
- Label：`ui-label`

## 快速使用

1. 確保 `src/input.css` 已載入 `src/ui-kit.css`
2. 在 HTML/模板直接套 class：

```html
<label class="ui-label">Email</label>
<input class="ui-input ui-input--desktop" placeholder="name@company.com" />
<button class="ui-btn-primary ui-btn-primary--desktop">Sign In</button>
<a class="ui-link" href="#">Forgot password?</a>
```

3. 狀態使用方式：

- Input error：`class="ui-input ui-input--desktop ui-input--error"`
- Input disabled：`disabled`
- Button disabled：`disabled`

## 與 AI Agent 協作建議

- 若要新增元件：先在 `app.pen` 建立樣式與變數，再同步到 `tokens.json`。
- 若要擴充 state：先在 `ui-patterns.json` 定義，再在 `src/ui-kit.css` 實作 class。
- 若要跨專案移植：複製 `ui-kit/` + `tokens.json` + `tailwind.theme.extend.js` 即可快速落地。
