chrome.action.onClicked.addListener(async (tab) => {
  let contentToSummarize = "";

  if (tab.id && !tab.url.startsWith("chrome://")) {
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

  // Open ChatGPT with temporary chat enabled
  chrome.tabs.create({ url: "https://chatgpt.com/?temporary-chat=true" });
});
