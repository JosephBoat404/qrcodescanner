document.addEventListener('DOMContentLoaded', function() {
  const scanButton = document.getElementById('scanButton');
  const resultDiv = document.getElementById('result');
  const previewImg = document.getElementById('preview');

  // First, verify we can capture a screenshot
  scanButton.addEventListener('click', async () => {
    try {
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
      previewImg.src = dataUrl;
      previewImg.style.display = 'block';
      
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
            resultDiv.textContent = 'No QR code found in the current page.';
          }
        } catch (error) {
          console.error('Error processing image:', error);
          resultDiv.textContent = `Error processing image: ${error.message}`;
        }
      };

      img.onerror = () => {
        throw new Error('Failed to load screenshot image');
      };

      img.src = dataUrl;
    } catch (error) {
      console.error('Error:', error);
      resultDiv.textContent = `Error: ${error.message}`;
    }
  });

  function handleQRCodeResult(text) {
    // Clear any previous results
    resultDiv.innerHTML = '';
    
    // Create a text element
    const textElement = document.createElement('div');
    textElement.textContent = text;
    resultDiv.appendChild(textElement);
    
    // Check if the result is a URL
    try {
      const url = new URL(text);
      if (url.protocol === 'http:' || url.protocol === 'https:') {
        const openButton = document.createElement('button');
        openButton.textContent = 'Open URL';
        openButton.className = 'open-url-btn';
        openButton.onclick = () => {
          chrome.tabs.create({ url: text });
        };
        resultDiv.appendChild(openButton);
      }
    } catch (e) {
      // Not a valid URL, no need to do anything
    }
  }
});