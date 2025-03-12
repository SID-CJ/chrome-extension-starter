// Listen for extension icon clicks
chrome.action.onClicked.addListener(() => {
  // Open a new tab
  chrome.tabs.create({});
});
