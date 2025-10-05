"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Message received in pop.ts");
    if (request.visibleHTML) {
        console.log(request.visibleHTML);
    }
});
//# sourceMappingURL=pop.js.map