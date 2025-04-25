// Initialize the context menu when the service worker starts
chrome.runtime.onInstalled.addListener(() => {
  if (chrome.contextMenus) {
    chrome.contextMenus.removeAll(() => {
      chrome.contextMenus.create({
        id: 'scanQRCode',
        title: 'Scan QR Code',
        contexts: ['image']
      });
    });
  }
});

// Listen for messages from content script and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'scanQRCode' || message.action === 'qrCodeResult') {
    // Forward the message to the appropriate destination
    chrome.runtime.sendMessage(message);
  }
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'scanQRCode') {
    // Use activeTab permission instead of tabs
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: (imageData) => {
        // Send message to content script
        window.postMessage({ action: 'scanQRCode', imageData }, '*');
      },
      args: [info.srcUrl]
    });
  }
});