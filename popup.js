document.getElementById("saveBtn").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: extractVideoData,
    }, (results) => {
      const videoData = results[0].result;
      if (!videoData) {
        document.getElementById("status").innerText = "No video found.";
        return;
      }

      chrome.storage.local.get({ watchLater: [] }, (result) => {
        const existing = result.watchLater;
        const alreadySaved = existing.some(v => v.url === videoData.url);
        if (alreadySaved) {
          document.getElementById("status").innerText = "Already saved.";
          return;
        }
        const updatedList = [...existing, videoData];
        chrome.storage.local.set({ watchLater: updatedList }, () => {
          document.getElementById("status").innerText = "Video saved!";
        });
      });
    });
  });
});

document.getElementById("openListBtn").addEventListener("click", () => {
  chrome.tabs.create({ url: chrome.runtime.getURL("index.html") });

});

function extractVideoData() {
  const video = document.querySelector("video");
  if (!video) return null;

  const url = window.location.href;
  const title = document.title;
  const platform = window.location.hostname;

  let thumbnail = null;
  const match = url.match(/(?:v=|\/shorts\/)([a-zA-Z0-9_-]{11})/);
  if (platform.includes("youtube.com") && match) {
    thumbnail = `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
  } else {
    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) thumbnail = ogImage.content;
  }

  return { url, title, platform, thumbnail };
}
