// Listen for extension icon clicks
chrome.action.onClicked.addListener(() => {
  // Open a new tab with the extension's page
  chrome.tabs.create({
    url: 'index.html'
  });
});
