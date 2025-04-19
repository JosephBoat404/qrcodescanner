# QR Code Scanner Extension

A Chrome extension that allows you to scan QR codes directly from web pages. You can either use your camera to scan QR codes or scan QR codes that are already present in images on web pages.

## Features

- Scan QR codes using your device's camera
- Scan QR codes from images on web pages
- Right-click on any image to scan for QR codes
- Automatically open URLs found in QR codes
- Simple and intuitive interface

## Installation

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension directory
5. The extension should now be installed and ready to use

## How to Use

### Using the Camera
1. Click on the extension icon in your Chrome toolbar
2. Click the "Scan QR Code" button
3. Allow camera access when prompted
4. Point your camera at a QR code
5. The extension will automatically detect and decode the QR code
6. If the QR code contains a URL, you can click "Open URL" to visit the website

### Scanning Images on Web Pages
1. Right-click on any image containing a QR code
2. Select "Scan QR Code" from the context menu
3. The extension will scan the image and display the result
4. If the QR code contains a URL, you can click "Open URL" to visit the website

## Requirements

- Chrome browser (version 88 or later)
- Camera access (for scanning with camera)
- Internet connection (for loading the QR code library)

## Notes

- The extension uses the ZXing library for QR code scanning
- Camera access is required for scanning QR codes with your device's camera
- The extension works best with clear, well-lit QR codes 