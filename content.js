const distractingSites = [
  'youtube.com/shorts', 'instagram.com', 'twitter.com', 'reddit.com', 'netflix.com'
];

chrome.storage.local.get(['focusMode'], data => {
  if (data.focusMode) {
    const currentUrl = window.location.href;
    if (distractingSites.some(site => currentUrl.includes(site))) {
      const overlay = document.createElement('div');
      overlay.style.position = 'fixed';
      overlay.style.top = 0;
      overlay.style.left = 0;
      overlay.style.width = '100vw';
      overlay.style.height = '100vh';
      overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
      overlay.style.color = '#fff';
      overlay.style.zIndex = '999999';
      overlay.style.display = 'flex';
      overlay.style.alignItems = 'center';
      overlay.style.justifyContent = 'center';
      overlay.style.fontSize = '24px';
      overlay.style.textAlign = 'center';
      overlay.style.padding = '20px';
      overlay.innerText = '🚨 You’re being distracted. Get back to your goal! 🚀';

      document.body.appendChild(overlay);

      const observer = new MutationObserver(() => {
        chrome.storage.local.get('focusMode', data => {
          if (!data.focusMode) {
            overlay.remove();
            observer.disconnect();
          }
        });
      });

      observer.observe(document.body, { childList: true, subtree: true });
    }
  }
});
