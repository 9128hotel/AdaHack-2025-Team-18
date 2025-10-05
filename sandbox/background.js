console.log("PLEASE")

//chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//    const currentTab = tabs[0];
//    chrome.action.onClicked.dispatch({ tabId: currentTab.id });
//    console.log("Current Tab ID:", currentTab.id); // Access the tabId here
//});

chrome.action.onClicked.addListener((tab) => {
    console.log("woohoo!!")
    
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['main.js']
    });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.visibleHTML) {
        //console.log("Output:", request.visibleHTML.form);
    }
});