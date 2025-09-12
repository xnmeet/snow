chrome.action.onClicked.addListener(tab => {
  if (tab.id) {
    chrome.sidePanel.open({ tabId: tab.id, windowId: tab.windowId });
  }
});

chrome.runtime.onInstalled.addListener(() => {
  console.log('E2E Test Recorder extension installed');
});

// Listen for tab removal to notify side panels for cleanup
chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  console.log('Tab removed:', tabId, removeInfo);

  // Notify any connected side panels about tab destruction
  chrome.runtime
    .sendMessage({
      type: 'TAB_DESTROYED',
      tabId: tabId,
      windowId: removeInfo.windowId,
      isWindowClosing: removeInfo.isWindowClosing,
    })
    .catch(error => {
      // This is expected when no listeners are available
      console.log('No listeners for tab destruction message:', error.message);
    });
});

// Listen for tab updates that might indicate navigation away
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    console.log('Tab navigated to new URL:', tabId, changeInfo.url);

    // Notify side panels about navigation which might require cleanup
    chrome.runtime
      .sendMessage({
        type: 'TAB_NAVIGATED',
        tabId: tabId,
        url: changeInfo.url,
        tab: tab,
      })
      .catch(error => {
        // This is expected when no listeners are available
        console.log('No listeners for tab navigation message:', error.message);
      });
  }
});

// Listen for messages from the side panel
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background script received message:', request);

  // Handle storage-related messages
  if (request.type === 'GET_STORAGE') {
    chrome.storage.local.get(request.keys, result => {
      console.log('Sending storage data back to side panel:', result);
      sendResponse({ data: result });
    });
    return true;
  }

  if (request.type === 'SET_STORAGE') {
    chrome.storage.local.set(request.data, () => {
      console.log('Storage updated with data:', request.data);
      sendResponse({ success: true });
    });
    return true;
  }

  // For any other message type, do nothing
  return false;
});
