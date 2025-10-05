// Remove import statements for web usage and assume required functions are available globally or included via <script> tags
// Runs on web page side
// Make sure highlight.js, captions.js, focusable.js, form_control.js, and imageAlts.js are loaded before this script


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    
    console.log("Message received in main.ts");
    if (request.visibleHTML){
        processElements(request.visibleHTML);
    }



});

function zip(a, b) {
  return a.map((val, i) => [val, b[i]]);
}





function processElements(elements){
    const placeHolder = [[]]
    let elementsAndIssues = zip(elements.elements, placeHolder)
    console.log(elementsAndIssues)
    elementsAndIssues.array.forEach(el, issues => {
       setTimeout(() => {
               
            console.log("Processing element:", el);
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


            

        }, 10);

    
    });

}