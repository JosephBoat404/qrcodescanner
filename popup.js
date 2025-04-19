document.addEventListener('DOMContentLoaded', function() {
  const scanButton = document.getElementById('scanButton');
  const preview = document.getElementById('preview');
  const previewContainer = document.getElementById('previewContainer');
  const result = document.getElementById('result');
  const resultLabel = document.getElementById('resultLabel');
  const resultActions = document.getElementById('resultActions');
  const openUrlBtn = document.getElementById('openUrlBtn');
  const copyBtn = document.getElementById('copyBtn');
  const statusMessage = document.getElementById('statusMessage');
  const loadingBar = document.getElementById('loadingBar');

  // Initially hide results and actions
  result.style.display = 'none';
  resultActions.style.display = 'none';
  resultLabel.style.display = 'none';

  scanButton.addEventListener('click', async function() {
    try {
      // Show loading animation
      loadingBar.style.display = 'block';
      statusMessage.textContent = 'Scanning page for QR codes...';
      
      // Get the current active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab) {
        throw new Error('No active tab found');
      }

      // Take a screenshot of the current tab
      const dataUrl = await chrome.tabs.captureVisibleTab(null, { 
        format: 'png',
        quality: 100
      });
      
      if (!dataUrl) {
        throw new Error('Failed to capture screenshot');
      }
      
      // Show preview of the screenshot
      previewContainer.style.display = 'block';
      preview.src = dataUrl;
      preview.style.display = 'block';
      
      // Create an image element to load the screenshot
      const img = new Image();
      
      img.onload = () => {
        try {
          // Create a canvas to process the image
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;
          context.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          // Get image data for QR code scanning
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          
          // Verify jsQR is available
          if (typeof jsQR !== 'function') {
            throw new Error('jsQR library not loaded');
          }
          
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          
          if (code) {
            handleQRCodeResult(code.data);
          } else {
            result.textContent = 'No QR code found in the current page.';
            result.style.display = 'block';
            resultLabel.style.display = 'block';
            resultActions.style.display = 'none';
            statusMessage.textContent = 'No QR code detected.';
          }
        } catch (error) {
          console.error('Error processing image:', error);
          result.textContent = `Error processing image: ${error.message}`;
          result.style.display = 'block';
          resultLabel.style.display = 'block';
          resultActions.style.display = 'none';
          statusMessage.textContent = 'Error processing image.';
        } finally {
          loadingBar.style.display = 'none';
        }
      };

      img.onerror = () => {
        loadingBar.style.display = 'none';
        statusMessage.textContent = 'Failed to load screenshot image.';
      };

      img.src = dataUrl;
    } catch (error) {
      console.error('Error:', error);
      loadingBar.style.display = 'none';
      statusMessage.textContent = `Error: ${error.message}`;
    }
  });

  function handleQRCodeResult(text) {
    // Show result
    result.textContent = text;
    result.style.display = 'block';
    resultLabel.style.display = 'block';
    resultActions.style.display = 'flex';
    
    // Check if the result is a URL
    try {
      const url = new URL(text);
      if (url.protocol === 'http:' || url.protocol === 'https:') {
        openUrlBtn.style.display = 'flex';
      } else {
        openUrlBtn.style.display = 'none';
      }
    } catch (e) {
      openUrlBtn.style.display = 'none';
    }
    
    statusMessage.textContent = 'QR code detected!';
  }

  openUrlBtn.addEventListener('click', function() {
    const url = result.textContent;
    if (url) {
      chrome.tabs.create({ url: url });
      statusMessage.textContent = 'Opening URL in new tab...';
      setTimeout(() => {
        statusMessage.textContent = '';
      }, 2000);
    }
  });

  copyBtn.addEventListener('click', function() {
    const text = result.textContent;
    if (text) {
      navigator.clipboard.writeText(text)
        .then(() => {
          statusMessage.textContent = 'Copied to clipboard!';
          setTimeout(() => {
            statusMessage.textContent = '';
          }, 2000);
        })
        .catch(err => {
          statusMessage.textContent = 'Failed to copy: ' + err;
        });
    }
  });
});