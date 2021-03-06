"use strict";

const DownloadManager = pquire("util/download-manager");
const ipc = require("electron").ipcMain;
const cache = pquire("cache");
const settings = pquire("settings");

ipc.on("add-blog", (e, name) => {
  log.trace(`Adding blog ${name}`);
  try {
    const dm = DownloadManager.new(name,
      (dm) => e.sender.send("update-blog", dm.name, dm.state, dm.progress),
      (dm) => e.sender.send("finish-blog", dm.name, dm.state, dm.errorCount),
    );
    e.sender.send("add-blog-success", dm.name, dm.state);
  } catch (err) {
    e.sender.send("add-blog-failure", err.message);
  }
});

ipc.on("button-pressed", (e, name, button) => {
  console.log(`Pressed ${button} for ${name}`);
  DownloadManager.get(name)[button]();
});

ipc.on("open-settings", () => {
  settings.show();
});


module.exports = {
  send(evt, ...args) {
    cache.win.webContents.send(evt, ...args);
  }
};