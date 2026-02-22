chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "open_chat") {
    handleOpenChat(request.isTemp, request.tab);
  }
});

async function handleOpenChat(isTemp, tab) {
  let contentToSummarize = "";
  
  if (tab && tab.id && tab.url && !tab.url.startsWith("chrome://")) {
    try {
      // Execute a script to get selected text or the full body text if nothing is selected
      const [{ result }] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          const selection = window.getSelection().toString();
          if (selection && selection.trim().length > 0) {
            return selection;
          }
          // If no selection, grab the entire readable text from the body
          return document.body.innerText || document.body.textContent;
        }
      });
      contentToSummarize = result;
    } catch (err) {
      console.log("Could not extract content:", err);
    }
  }

  // If we successfully grabbed content, send it to ChatGPT
  if (contentToSummarize && contentToSummarize.trim().length > 0) {
    // Truncate if the text is exceptionally large to prevent breaking the clipboard/storage
    const maxChars = 30000;
    if (contentToSummarize.length > maxChars) {
      contentToSummarize = contentToSummarize.substring(0, maxChars) + "\n\n...[Content truncated due to length]";
    }

    await chrome.storage.local.set({
      tempChatPrompt: `Please summarize the following text:\n\n${contentToSummarize}`,
      timestamp: Date.now()
    });
  }

  const baseUrl = "https://chatgpt.com/";
  const finalUrl = isTemp ? `${baseUrl}?temporary-chat=true` : baseUrl;

  // Check if a chatgpt tab is already open
  const existingTabs = await chrome.tabs.query({ url: "https://chatgpt.com/*" });
  
  if (existingTabs.length > 0) {
    // Use the first existing chatgpt tab
    const chatTab = existingTabs[0];
    await chrome.tabs.update(chatTab.id, { url: finalUrl, active: true });
    await chrome.windows.update(chatTab.windowId, { focused: true });
  } else {
    // Open ChatGPT in a new tab
    chrome.tabs.create({ url: finalUrl });
  }
}
