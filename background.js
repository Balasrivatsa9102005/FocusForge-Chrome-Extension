chrome.runtime.onInstalled.addListener(() => {
  console.log("FocusForge installed.");
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (!changeInfo.url && !tab.url) return;

  chrome.storage.local.get(['focusMode', 'focusData'], data => {
    if (!data.focusMode) return;

    const url = tab.url || changeInfo.url;
    if (!url) return;

    
    if (url.includes("youtube.com/shorts")) {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: '🚫 Stop Scrolling!',
        message: `You're on YouTube Shorts. Get back to "${data.focusData.goal}" 🙏`
      });

      
      chrome.tabs.update(tabId, { url: "https://www.youtube.com/feed/subscriptions" });
      return;
    }

    const distractingSites = ['instagram.com', 'reddit.com', 'twitter.com', 'netflix.com'];
    for (const site of distractingSites) {
      if (url.includes(site)) {
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icons/icon48.png',
          title: 'FocusForge Alert ⚠️',
          message: `${site} = distraction 🧨. Let’s stick to "${data.focusData.goal}".`
        });
        break;
      }
    }
  });
});
