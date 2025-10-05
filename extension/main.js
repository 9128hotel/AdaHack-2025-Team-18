// Remove import statements for web usage and assume required functions are available globally or included via <script> tags
// Runs on web page side
// Make sure highlight.js, captions.js, focusable.js, form_control.js, and imageAlts.js are loaded before this script
import { checkContrast } from "./highlighter.js";
import { testFormHasLabel } from "./form_control.js";
import { testReachableByTab } from "./focusable.js";

import { imgsWithoutAlts } from "./imageAlts.js";
import {testMediaHasCaptions} from "./captions.js"

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    
    console.log("Message received in main.ts");
    console.log(request);
    if (request.visibleHTML){
        processElements(request.visibleHTML);
    }



});

function zip(a, b) {

    
    const result = [];
    for (let i = 0; i < Math.min(a.length, b.length); i++) {
        result.push([a[i], b[i]]);
    }
    return result;
}





function processElements(elements){
    console.log("Processing elements:", elements.elements);
    const placeHolder = Array.from({ length: elements.elements.length }, () => []);

    let elementsAndIssues = zip(elements.elements, placeHolder)
    console.log(elementsAndIssues)
    
    for (let i = 0; i < elementsAndIssues.length; i++) {
    const [el, issues] = elementsAndIssues[i];
    setTimeout(() => {
        console.log("Processing element:", el);
        if (checkContrast(el)) {
            issues.push("Poor Contrast");
        }
        if (!testMediaHasCaptions(el)) {
        const captionsResult = testMediaHasCaptions(el);
        if (!captionsResult.hasSubtitles) {
            issues.push("Missing Captions");
        }
            issues.push("Not Focusable by Tab");
        }
        if (!testFormHasLabel(el)) {
            issues.push("Not Form Labelled");
        }
        if (!imgsWithoutAlts(el)) {
            issues.push("Image missing alt text");
        }

        const listEl = document.createElement('ul');

        if (issues.length > 0) {
            for (const text of issues) {
                const li = document.createElement("li");
                li.textContent = text;
                listEl.appendChild(li);
            }
            highlightElement(el, listEl);
        }
    }, 10);
}

}