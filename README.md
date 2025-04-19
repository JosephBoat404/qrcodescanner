# QR Code Scanner Extension

A Chrome extension that allows you to scan QR codes directly from web pages
## Features

- Scan QR codes from any webpage
- Automatically open URLs found in QR codes
- Simple and intuitive interface
- No camera required

## Installation

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension directory
5. The extension should now be installed and ready to use

## How to Use

1. Click on the extension icon in your Chrome toolbar
2. Click the "Scan Current Page" button
3. The extension will take a screenshot of the current page
4. A preview of the screenshot will be shown
5. The extension will automatically scan for QR codes
6. If a QR code is found, the content will be displayed
7. If the QR code contains a URL, you can click "Open URL" to visit the website

## Requirements

- Chrome browser (version 88 or later)
- Internet connection (for loading the QR code library)

## Technical Details

- Uses jsQR library for QR code scanning
- Takes screenshots using Chrome's tabCapture API
- Works with any webpage that Chrome can access
- No camera permissions required

## Notes

- The extension works best with clear, well-lit QR codes
- Screenshots are taken at high quality for better QR code detection
- The extension will show an error message if no QR code is found
- You can try scanning different parts of the page by scrolling and scanning again 