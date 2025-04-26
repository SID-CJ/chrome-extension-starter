# Chrome Extension Starter

A feature-rich new tab replacement Chrome extension that transforms your browsing experience with a beautiful, customizable interface.

## Features

- **Customizable Background**: Choose from curated images or solid colors
- **Time and Date Display**: Configurable format and visibility
- **Inspirational Quotes**: Daily, hourly, or weekly refreshed quotes
- **Ambient Sounds**: Built-in ambient sound player with various tracks for focus, relaxation, meditation, and more
- **Timer Function**: Set a timer for sound playback
- **Dark/Light Mode**: Automatic system detection or manual selection
- **Persistent Settings**: Your preferences are saved across sessions

## Screenshots

(Add screenshots here)

## Installation

### From Chrome Web Store

1. Visit the [Chrome Web Store page](https://chrome.google.com/webstore/detail/your-extension-id)
2. Click "Add to Chrome"
3. Confirm by clicking "Add extension"

### From Source

1. Clone this repository
   ```bash
   git clone https://github.com/your-username/chrome-extension-starter.git
   cd chrome-extension-starter
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Build the extension
   ```bash
   npm run build
   ```

4. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in the top-right corner)
   - Click "Load unpacked" and select the `dist` folder from the project

## Development

### Prerequisites

- Node.js (v16 or later recommended)
- npm or pnpm

### Setup

1. Install dependencies
   ```bash
   npm install
   ```

2. Start the development server
   ```bash
   npm run dev
   ```

3. For testing in Chrome:
   - Build the extension: `npm run build`
   - Load the unpacked extension from the `dist` folder in Chrome

### Project Structure

- `/src` - Source code
  - `/components` - UI components
  - `/routes` - Page routes
  - `/api` - API client code
  - `/services` - Service modules
  - `/lib` - Utility functions
  - `/utils` - Helper utilities
- `/public` - Static assets and manifest.json

### Environment Variables

Create a `.env` file in the root directory with:
