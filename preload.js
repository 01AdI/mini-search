const { contextBridge, ipcRenderer } = require("electron");

// ✅ Log preload load state
console.log("✅ Preload script loaded!");

window.addEventListener("DOMContentLoaded", () => {
  console.log("✅ DOM fully loaded!");
});

// ✅ Expose safe API to renderer
contextBridge.exposeInMainWorld("electronAPI", {
  // For window controls (minimize, maximize, close)
  controlWindow: (action) => ipcRenderer.send("window-control", action),
    openInNewTab: (url) => ipcRenderer.send("open-new-tab", url),
  // Optional: for future AI calls from renderer
  // fetchAISummary: async (query) =>
  //   await ipcRenderer.invoke("fetch-ai-summary", query),
});
