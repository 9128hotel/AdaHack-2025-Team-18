chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.visibleHTML){
        console.log(request.visibleHTML)
    }
});


