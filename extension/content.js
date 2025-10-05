"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function visibleItem(element) {
    const style = window.getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return (style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        style.opacity !== '0' &&
        rect.width > 0 &&
        rect.height > 0);
}
function getElem() {
    const elem = document.querySelectorAll('*');
    return Array.from(elem)
        .filter(visibleItem)
        .map(e => e.outerHTML);
}
chrome.runtime.sendMessage({ visibleHTML: getElem() });
//# sourceMappingURL=content.js.map