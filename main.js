const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: true,
      webviewTag: true, // ✅ enable webviews
    },
    backgroundColor: "#111",
  });

  // ✅ Use this block:
  const startURL =
    process.env.NODE_ENV === "development"
      ? "http://localhost:1234"
      : `file://${path.join(__dirname, "dist", "index.html")}`;

  mainWindow.loadURL(startURL);

  mainWindow.on("closed", () => { mainWindow = null; })
  
}

/* ============ Window Control ============ */
ipcMain.on("window-control", (event, action) => {
  if (!mainWindow) return;

  switch (action) {
    case "minimize":
      mainWindow.minimize();
      break;
    case "maximize":
      mainWindow.isMaximized()
        ? mainWindow.unmaximize()
        : mainWindow.maximize();
      break;
    case "close":
      mainWindow.close();
      break;
  }
});

/* ============ App Lifecycle ============ */
app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
