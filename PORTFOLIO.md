![工作坊完成徽章](https://img.shields.io/badge/GitHub_Copilot_實戰工作坊-已完成-1F883D?style=for-the-badge&logo=githubcopilot&logoColor=white)

# 待辦清單 Web App

這是在 GitHub Copilot 實戰工作坊中完成的待辦清單 Web App。使用者可以整理日常事項、追蹤完成狀態，並依照自己的閱讀偏好切換外觀與篩選清單。

## 線上展示

GitHub Pages：`https://wpohao.github.io/Copilot/`

## 功能

- 新增待辦事項，並阻止空白內容送出。
- 勾選事項為已完成，或逐筆刪除待辦。
- 顯示整份清單的未完成數量。
- 依「全部」、「未完成」或「已完成」篩選，並在篩選結果為空時提供提示。
- 在淺色與深色模式間切換；記住手動選擇，未手動選擇時跟隨作業系統偏好。
- 一次清除所有已完成事項；清除前會要求確認，沒有已完成事項時按鈕會停用。
- 透過 localStorage 保存待辦資料與手動選擇的主題，重新整理後仍可讀取。
- 採用響應式卡片介面，支援手機螢幕。

## 技術

- 使用純 HTML、CSS 與原生 JavaScript 建置。
- 不使用前端框架或套件；不依賴外部 CDN，可離線開啟。
- 待辦清單與手動選擇的主題偏好保存在瀏覽器的 localStorage。

## 開發方式

- 使用 GitHub Copilot Agent Mode，依需求建立並逐步擴充待辦清單 App。
- 透過 Microsoft Learn MCP 查詢官方文件，並使用 GitHub MCP 讀取專案 issues。
- 在 `.github/prompts/fix-issue.prompt.md` 定義依 issue 處理工作的 agentic workflow：先整理問題與修改計畫、等待使用者確認，再建立分支、實作、驗證並準備 Pull Request。

## 我學到什麼

- 把功能需求整理成明確的步驟，有助於讓 AI 協作更聚焦。
- 使用 localStorage 保存介面資料與使用者偏好，並在重新整理後還原狀態。
- 透過 CSS 變數管理淺色與深色主題，讓配色集中且容易調整。
- 使用篩選、空狀態提示與確認對話框，提供明確的操作回饋。
- 透過 MCP 查閱官方文件與 issue，並以瀏覽器操作驗證功能。
