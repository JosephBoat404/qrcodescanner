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
    chrome.tabs.sendMessage(tab.id, {
      action: 'scanQRCode',
      imageData: info.srcUrl
    });
  }
});