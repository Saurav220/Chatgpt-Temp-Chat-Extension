# ChatGPT Temporary Chat & Summarizer

A privacy-focused Google Chrome extension that instantly opens a temporary ChatGPT session. It also features automatic text summarization for either your current text selection or the entire webpage.

## ✨ Features
* **Temporary Chat by Default**: Always opens ChatGPT in "Temporary Chat" mode (`?temporary-chat=true`), meaning your conversations aren't saved to your history.
* **Smart Summarization**: 
  * **Highlight & Summarize**: Select any text on a webpage, click the extension icon, and ChatGPT will automatically summarize your selection.
  * **Full Page Summarize**: Click the extension icon without highlighting anything, and it will automatically grab the readable text from the entire page and ask ChatGPT to summarize it.

## 🛠️ How It Works
1. When clicked, the extension (`background.js`) checks for highlighted text on your active tab.
2. If no text is highlighted, it safely captures the readable content of the entire page (up to 30,000 characters to ensure stability).
3. The text is temporarily saved to your browser's local storage.
4. A new tab opens directly to ChatGPT with the temporary chat URL parameter.
5. Once the page loads, `content.js` seamlessly pastes the summarization prompt into the ChatGPT editor and automatically sends it.

## 🚀 Installation (Developer Mode)
1. Clone this repository or download the source code as a ZIP file and extract it.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** using the toggle switch in the top right corner.
4. Click the **Load unpacked** button in the top left.
5. Select the folder containing this extension's files (`manifest.json`, etc.).
6. Pin the extension to your browser toolbar for quick, one-click access!

## 🔒 Permissions Used
* `activeTab` & `scripting`: To read the text you've highlighted or the content of the current page you're viewing.
* `storage`: To temporarily hold the text while the new ChatGPT tab is opening.
* `tabs`: To open the new tab pointing to ChatGPT.
