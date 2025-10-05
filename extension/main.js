//Runs on extension side 
import {checkContrast, highlightElement } from "./highlight.js";
import { testMediaHasCaptions } from "./captions.js";
import { testReachableByTab } from "./focusable.js";
import { testFormHasLabel } from "./form_control.js";
import { imgsWithoutAlts } from "./imageAlts.js"; 


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    
    console.log("Message received in pop.ts");
    if (request.visibleHTML){
        processElements(request.visibleHTML);
    }



});



function processElements(elements){
    const placeHolder = [[]]
    let elementsAndIssues = zip(elements, placeHolder)

    elementsAndIssues.array.forEach(el, issues => {
       setTimeout(() => {
               
            if( checkContrast(el) == true){
                issues.push("Poor Contrast")
            }
            if (!testMediaHasCaptions(el) == false){
                issues.push("Missing Captions")
            }
            
            if (!testReachableByTab(el) == false){
                issues.push("Not Focusable by Tab")
            }

            if (!testFormHasLabel(el) == false){
                issues.push("Not Form Labelled")
            }
            if (!imgsWithoutAlts(el) == false){
                issues.push("Image missing alt text")
            }

            const listEl = document.createElement('ul');

            if (issues.length > 0){
                for (const text of issues) {
                    const li = document.createElement("li");
                    li.textContent = text;
                    ul.appendChild(li);
                }
                highlightElement(el, listEl)

            }


            

        }, 1000);

    
    });

}