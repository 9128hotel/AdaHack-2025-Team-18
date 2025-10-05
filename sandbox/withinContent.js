// Inserted into webpage, runs on wepage side 


function visibleItem (element){
    const style = window.getComputedStyle(element);
    const rect = element.getBoundingClientRect();

    return (
        style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        style.opacity !== '0' &&
        rect.width > 0 &&
        rect.height > 0

    )
}

function getElem(){
    const elem = document.querySelectorAll('*');

    const list =  Array.from(elem)
        .filter(visibleItem).map(e => e.outerHTML);

    console.log(list)
    return {elements: list};

    }


chrome.runtime.sendMessage({visibleHTML: getElem()});


console.log("Content script loaded");
