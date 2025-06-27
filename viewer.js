function renderVideoList(videos) {
  const container = document.getElementById("videoList");
  container.innerHTML = "";

  if (!videos.length) {
    container.innerText = "🫥 No saved videos yet.";
    return;
  }

  videos.forEach((video) => {
    const card = document.createElement("div");
    card.className = "video-card";

    const thumbnail = document.createElement("img");
    thumbnail.src = video.thumbnail || "https://via.placeholder.com/120x80?text=No+Thumbnail";

    const info = document.createElement("div");
    info.className = "video-info";
    info.innerHTML = `<h3>${video.title}</h3><p>${video.platform}</p>`;

    const link = document.createElement("a");
    link.href = video.url;
    link.target = "_blank";
    link.innerText = "▶ Watch";

    const removeBtn = document.createElement("button");
    removeBtn.innerText = "❌ Remove";

    removeBtn.addEventListener("click", () => {
      chrome.runtime.sendMessage({ type: "deleteVideo", url: video.url }, (res) => {
        if (res?.success) {
          const updated = videos.filter(v => v.url !== video.url);
          chrome.storage.local.set({ watchLater: updated }, () => {
            renderVideoList(updated);
          });
        } else {
          alert("❌ Could not delete video");
        }
      });
    });

    card.appendChild(thumbnail);
    card.appendChild(info);
    card.appendChild(link);
    card.appendChild(removeBtn);
    container.appendChild(card);
  });
}

window.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get("watchLater", (result) => {
    const videos = result.watchLater || [];
    renderVideoList(videos);
  });
});
