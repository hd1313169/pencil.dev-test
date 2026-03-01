# Pencil Login Design System

本文件依據目前已完成的兩個畫面整理：
- Desktop: Modern Login
- Mobile: Mobile Login

## 1) Design Principles

- 視覺風格：現代、乾淨、專業
- 版面策略：深色品牌背景 + 白色登入卡片
- 層次策略：以字級、留白、卡片陰影建立資訊層次
- 互動重點：主按鈕使用高對比漸層藍色，提升行動辨識

## 2) Foundations

### 2.1 Typography

- Font family: Inter
- 主要字級與用途：
  - 54 / 700：Desktop Hero 標題
  - 40 / 700：Mobile Hero 標題
  - 32 / 700：Desktop Card 標題
  - 28 / 700：Mobile Card 標題
  - 18 / 600：品牌小標（Desktop）
  - 18 / 400：Desktop Hero 內文
  - 16 / 600：主按鈕文字
  - 16 / 400：Mobile Hero 內文
  - 14 / 600：欄位標籤
  - 14 / 400：次要說明與連結（Desktop）
  - 13 / 600：次要連結（Mobile）

### 2.2 Color Palette

#### Background / Surface
- #0F172A：背景深色起點
- #1E293B：背景中段
- #334155：背景深色終點
- #FFFFFF：登入卡片底色
- #F8FAFC：輸入框底色

#### Text
- #F8FAFC：深色背景上的主要文字
- #CBD5E1：深色背景上的次要文字
- #94A3B8：深色背景上的品牌輔助文字 / placeholder
- #0F172A：卡片上的主要文字
- #334155：欄位標籤文字
- #64748B：卡片上的次要文字

#### Action
- #2563EB：連結與主按鈕漸層起點
- #4F46E5：主按鈕漸層終點
- #FFFFFF：主按鈕文字

#### Border / Stroke
- #E2E8F0：卡片邊框
- #CBD5E1：輸入框邊框

### 2.3 Radius

- Card: 20 (Desktop), 16 (Mobile)
- Input: 12 (Desktop), 10 (Mobile)
- Button: 12 (Desktop), 10 (Mobile)

### 2.4 Shadow

- Desktop Card: 0,16,40,#02061726
- Mobile Card: 0,12,28,#02061726

### 2.5 Spacing

- 全域區塊間距：24、48
- 卡片內間距：20、28
- 欄位群組間距：8、16、20
- 文字與元素微間距：6、10

## 3) Layout System

### 3.1 Desktop (1440 x 900)

- 外層 frame：左右分欄、置中對齊
- 左欄：品牌資訊與價值文案
- 右欄：固定寬度登入卡片（420）

### 3.2 Mobile (390 x 844)

- 外層 frame：單欄垂直堆疊
- 上方：品牌與主標題
- 下方：滿寬登入卡片

## 4) Component Specs

### 4.1 Login Card

- 結構：Title + Field Groups + Secondary Link + Primary Button + Sign-up Row
- 背景：白色
- 邊框：1px #E2E8F0
- 陰影：柔和外陰影

### 4.2 Input Field

- 高度：52（Desktop）/ 48（Mobile）
- 底色：#F8FAFC
- 邊框：1px #CBD5E1
- 內距：左右 12~14
- Placeholder：#94A3B8

### 4.3 Primary Button

- 高度：52（Desktop）/ 50（Mobile）
- 背景：linear gradient (#2563EB -> #4F46E5)
- 文字：16 / 600 / #FFFFFF
- 對齊：水平與垂直置中

### 4.4 Secondary Text Link

- 用於 Forgot password? 與 Create account
- 顏色：#2563EB
- 字重：600

## 5) Responsive Guidance

- 保持同一色彩語言與按鈕風格
- Desktop 使用雙欄資訊架構，Mobile 收斂為單欄
- 在 mobile 優先保留：標題、輸入欄、主要行動按鈕
- Hero 文案可依空間縮短，但不改變語氣與品牌色

## 6) Tokenization Recommendation

目前檔案 variables 為空，建議下一步建立可重用 tokens：
- color.background.primary = #0F172A
- color.background.secondary = #1E293B
- color.background.tertiary = #334155
- color.surface.card = #FFFFFF
- color.text.primaryOnDark = #F8FAFC
- color.text.secondaryOnDark = #CBD5E1
- color.text.primaryOnLight = #0F172A
- color.action.primaryStart = #2563EB
- color.action.primaryEnd = #4F46E5
- radius.card.lg = 20
- radius.control.md = 12
- spacing.1 = 6
- spacing.2 = 8
- spacing.3 = 10
- spacing.4 = 16
- spacing.5 = 20
- spacing.6 = 24
- spacing.8 = 28
- spacing.12 = 48

---

最後更新日期：2026-03-01
