document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('tempChatToggle');
  const btn = document.getElementById('actionBtn');

  // Load saved state
  chrome.storage.local.get(['useTempChat'], (res) => {
    if (res.useTempChat !== undefined) {
      toggle.checked = res.useTempChat;
    }
  });

  toggle.addEventListener('change', () => {
    chrome.storage.local.set({ useTempChat: toggle.checked });
  });

  btn.addEventListener('click', async () => {
    const isTemp = toggle.checked;
    
    // Get the active tab before closing the popup
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Send a message to background script to perform the action
    chrome.runtime.sendMessage({ action: "open_chat", isTemp: isTemp, tab: tab });
    window.close();
  });
});
