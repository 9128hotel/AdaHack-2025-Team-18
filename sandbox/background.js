console.log("Background script loaded");

chrome.action.onClicked.addListener(async (tab) => {
    console.log("Extension clicked!");
    
    // Check if tab is valid
    if (!tab || !tab.id) {
        console.error("Invalid tab");
        return;
    }
    
    // Check if URL is accessible
    if (tab.url.startsWith('chrome://') || 
        tab.url.startsWith('chrome-extension://') ||
        tab.url.startsWith('edge://') ||
        tab.url.startsWith('about:')) {
        console.log("Cannot inject into browser pages");
        return;
    }
    
    try {
        await chrome.scripting.executeScript({
            target: { 
                tabId: tab.id,
                allFrames: false
            },
            files: ['main.js']
        });
        console.log("Accessibility checker injected successfully!");
    } catch (error) {
        console.error("Injection failed:", error.message);
    }
});