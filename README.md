# UI/UX Portfolio — Interactive Wireframe

依據 Figma `Di4WItbhPgQIBtqXxSf3cQ` 的 `60:2` 首頁線框稿製作。

## 使用方式

直接以瀏覽器開啟 `index.html`，無需安裝套件與網路。也可用 VS Code Live Server 或放在 Vercel / GitHub Pages。

## 互動

- 左側選單切換作品集／關於我／我的履歷。
- 在右側內容區使用滑鼠滾輪、觸控上下滑動、鍵盤方向鍵，循環切換 `作品集 → 關於我 → 我的履歷 → 作品集`。往上滑從作品集切到履歷。
- 三張作品分類卡片使用 CSS Flex 動畫，Hover / 鍵盤 Focus 時目前的卡片加寬、其他縮窄。點擊可查看該分類的灰底作品列表。
- 點擊「聯絡我」彈出名片 Modal，可透過 X、點擊遮罩或 Esc 關閉。
- 手機版將 Sidebar 改為頂部導覽，作品分類改為直向排列。

## 後續填入真實資料

- Figma 的灰色圖塊、作品分類圖片和所有作品縮圖目前都是 CSS 灰底，不需額外圖片資源。
- 在 `index.html` 編輯關於我、履歷、聯絡資料。
- 在 `app.js` 的 `projects` 物件填入實際專案清單。
- 目前僅首頁與分類的示意內容，不含正式作品 Case Study 內頁。
