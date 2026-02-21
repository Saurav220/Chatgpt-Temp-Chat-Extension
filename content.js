(async () => {
  const data = await chrome.storage.local.get(['tempChatPrompt', 'timestamp']);
  if (!data.tempChatPrompt) return;

  // Ignore stale requests (older than 30 seconds)
  if (data.timestamp && Date.now() - data.timestamp > 30000) {
    await chrome.storage.local.remove(['tempChatPrompt', 'timestamp']);
    return;
  }

  const textToInsert = data.tempChatPrompt;
  await chrome.storage.local.remove(['tempChatPrompt', 'timestamp']);

  const MAX_WAIT = 15000;
  const POLL_INTERVAL = 500;

  const waitForEditor = () => {
    return new Promise((resolve, reject) => {
      const start = Date.now();
      const check = () => {
        const editor = document.querySelector('#prompt-textarea');
        if (editor) {
          resolve(editor);
          return;
        }
        if (Date.now() - start > MAX_WAIT) {
          reject(new Error('ChatGPT editor not found'));
          return;
        }
        setTimeout(check, POLL_INTERVAL);
      };
      check();
    });
  };

  try {
    const editor = await waitForEditor();
    await new Promise(r => setTimeout(r, 800)); // wait for React to fully bind

    // Insert text
    editor.focus();
    
    // Modern ChatGPT uses ProseMirror or a basic textarea. We use execCommand to ensure React state updates correctly.
    if (!document.execCommand('insertText', false, textToInsert)) {
        // Fallback if execCommand fails
        editor.innerText = textToInsert;
        editor.dispatchEvent(new Event('input', { bubbles: true }));
    }

    await new Promise(r => setTimeout(r, 800));

    // Find and click the send button
    const sendButton = document.querySelector('[data-testid="send-button"]');
    if (sendButton && !sendButton.disabled) {
      sendButton.click();
    } else {
      // Fallback: press Enter
      editor.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true
      }));
    }
  } catch (err) {
    console.error('[ChatGPT Temp Chat Extension]', err.message);
  }
})();
