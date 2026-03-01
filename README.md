# Pencil Canvas Token Sync Project

## 專案簡介
本專案以 Pencil MCP 畫布（app.pen）為設計權威，實現設計 token（variables）與程式碼（tokens.json、tailwind.theme.extend.js）自動同步，支援多主題（theme）、一鍵開發指令，並可擴充至 Vue/React 等框架。目標是讓設計師與工程師能無縫協作，並結合 AI agent 進行人機協作開發。

---

## 專案架構

```
├── app.pen                  # Pencil MCP 設計畫布，設計權威來源
├── canvas.variables.json    # 畫布變數快照，設計 token 來源
├── tokens.json              # 程式碼用 token，支援多 theme
├── tailwind.theme.extend.js # Tailwind 主題擴充，動態生成
├── ui-kit/
│   ├── ui-patterns.json     # UI Patterns 規格（Foundations + Components + States）
│   └── README.md            # UI Kit 使用與接手指引
├── scripts/
│   ├── sync-canvas-to-tokens.mjs      # 變數同步主腳本（canvas → tokens/theme）
│   ├── build-theme.mjs                # 主題建置腳本，支援 TOKEN_THEME 切換
│   └── sync-variables-from-pen.mjs    # watcher 腳本，監控設計變數快照
├── src/
│   ├── input.css            # Tailwind 入口（已載入 ui-kit.css）
│   ├── ui-kit.css           # 可重用元件樣式層（含互動狀態）
│   └── index.html           # 示例頁（以 UI kit class 組裝）
├── package.json             # npm script、依賴管理
└── ...
```

---

## 核心邏輯

1. **設計權威**：所有 token/主題變更以 app.pen 畫布為唯一權威來源。
2. **自動同步**：
   - 畫布變數（canvas.variables.json）變更時，scripts/sync-canvas-to-tokens.mjs 會自動同步到 tokens.json、tailwind.theme.extend.js。
   - 支援多 theme，主題切換時自動刷新。
3. **Watcher 機制**：
   - scripts/sync-variables-from-pen.mjs 監控 app.pen 變數快照，偵測新增/修改/刪除，並觸發同步。
4. **一鍵啟動**：
   - `npm run dev` 可同時啟動 watcher 與 CSS build，確保設計變更即時反映到程式碼。
5. **擴充性**：
   - 可依需求 scaffold Vue/React 專案，並串接 token/theme。
   - 支援多 theme，主題切換自動刷新。
6. **UI Kit Library**：
   - 已將畫布元件整理為 UI Patterns：顏色、字型、尺寸、圓角、陰影、間距。
   - 已提供可重用元件與狀態：Card、Input、Primary Button、Link、Label。
   - 元件狀態含 `default / hover / focus / active / error / disabled`（依元件適用）。
7. **AI Agent 協作**：
   - 工程師可直接與 AI agent 溝通，進行腳本擴充、流程優化、框架串接等。

---

## 操作方式

### 1. 安裝依賴

```bash
npm install
```

### 2. 啟動開發環境（自動同步）

```bash
npm run dev
```
- 會同時啟動 watcher（設計變數快照）與 CSS build，設計變更即時同步。

### 3. 主要腳本說明

- `scripts/sync-canvas-to-tokens.mjs`：將 canvas.variables.json 內容同步到 tokens.json、tailwind.theme.extend.js，支援多 theme。
- `scripts/build-theme.mjs`：根據 TOKEN_THEME 參數建置主題。
- `scripts/sync-variables-from-pen.mjs`：監控 app.pen 變數快照，偵測變更並觸發同步。

### 4. 多主題支援

- tokens.json、tailwind.theme.extend.js 均支援多 theme，切換主題時自動刷新。
- 可於設計畫布新增/編輯/刪除 variable，程式碼自動同步。

### 5. 擴充建議

- 若需 scaffold Vue/React 專案，可直接產生初始結構，並串接 token/theme。
- 若需逆向同步（程式碼改 token →設計工具同步），建議建立中介管理層或 API（不建議直接程式碼→設計工具同步）。

### 6. AI Agent 協作

- 工程師可直接與 AI agent 溝通，進行腳本擴充、流程優化、框架串接等。
- 建議以設計工具（app.pen）為唯一權威來源，避免資料衝突。

### 7. 使用 UI Kit Library

- Patterns 規格：`ui-kit/ui-patterns.json`
- 使用指南：`ui-kit/README.md`
- 樣式入口：`src/ui-kit.css`（已由 `src/input.css` 載入）
- 範例頁：`src/index.html`

可直接在頁面／元件中套用 class：

```html
<div class="ui-card ui-card--mobile md:ui-card--desktop">...</div>
<label class="ui-label">Email</label>
<input class="ui-input ui-input--mobile md:ui-input--desktop" />
<button class="ui-btn-primary ui-btn-primary--mobile md:ui-btn-primary--desktop">Sign In</button>
<a class="ui-link" href="#">Forgot password?</a>
```

---

## 常見問題

- **設計變更未同步？**
  - 請確認 watcher 腳本已啟動，並檢查 canvas.variables.json 是否有更新。
- **主題切換未生效？**
  - 請確認 TOKEN_THEME 參數設定正確，並重新執行 build-theme 腳本。
- **如何擴充到新框架？**
  - 直接 scaffold 新專案，並串接 tokens.json、tailwind.theme.extend.js。

---

## 聯絡協作

- 若需協助或擴充，請直接與 AI agent 或專案負責人聯繫。
- 建議所有設計/程式碼變更均以 app.pen 為權威，確保資料一致性。

---

## 交付建議

- 工程師可依本文件快速理解專案架構與操作方式。
- 建議先啟動 dev script，驗證設計→程式碼同步流程。
- 若需擴充，直接與 AI agent 溝通，或依本文件指引操作。

---

> 本專案以設計工具為核心，結合自動化腳本與 AI agent，實現高效人機協作開發。
