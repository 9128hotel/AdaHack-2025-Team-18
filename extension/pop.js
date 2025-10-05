"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.visibleHTML) {
        console.log(request.visibleHTML);
    }
});
//# sourceMappingURL=pop.js.map