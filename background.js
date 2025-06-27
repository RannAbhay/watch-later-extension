chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "deleteVideo" && message.url) {
    chrome.storage.local.get("watchLater", (result) => {
      const updated = (result.watchLater || []).filter(v => v.url !== message.url);
      chrome.storage.local.set({ watchLater: updated }, () => {
        sendResponse({ success: true });
      });
    });
    return true;
  }
});
