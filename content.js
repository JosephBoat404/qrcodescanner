// Function to check if an element is an image
function isImage(element) {
  return element.tagName === 'IMG' || 
         (element.tagName === 'DIV' && element.style.backgroundImage) ||
         (element.tagName === 'CANVAS');
}

// Function to extract image data from an element
async function getImageData(element) {
  if (element.tagName === 'IMG') {
    return element.src;
  } else if (element.tagName === 'DIV' && element.style.backgroundImage) {
    const url = element.style.backgroundImage.slice(4, -1).replace(/["']/g, '');
    return url;
  } else if (element.tagName === 'CANVAS') {
    return element.toDataURL();
  }
  return null;
}

// Function to scan QR code in an image
async function scanQRCode(imageData) {
  try {
    const response = await fetch(imageData);
    const blob = await response.blob();
    const imageBitmap = await createImageBitmap(blob);
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = imageBitmap.width;
    canvas.height = imageBitmap.height;
    context.drawImage(imageBitmap, 0, 0);
    
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    
    // Use jsQR library for QR code decoding
    const code = jsQR(imageData.data, imageData.width, imageData.height);
    
    if (code) {
      return code.data;
    }
    return null;
  } catch (error) {
    console.error('Error scanning QR code:', error);
    return null;
  }
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'scanQRCode') {
    scanQRCode(message.imageData)
      .then(result => {
        if (result) {
          chrome.runtime.sendMessage({
            action: 'qrCodeResult',
            result: result
          });
          sendResponse({ success: true, result: result });
        } else {
          sendResponse({ success: false, error: 'No QR code found' });
        }
      })
      .catch(error => {
        sendResponse({ success: false, error: error.message });
      });
    return true; // Required for async response
  }
});

// Add right-click context menu for images (not needed as it's handled by background.js)
// But keep track of right-clicked elements
document.addEventListener('contextmenu', (event) => {
  const target = event.target;
  if (isImage(target)) {
    chrome.runtime.sendMessage({
      action: 'imageContextMenu',
      imageInfo: {
        width: target.width || target.clientWidth,
        height: target.height || target.clientHeight
      }
    });
  }
});