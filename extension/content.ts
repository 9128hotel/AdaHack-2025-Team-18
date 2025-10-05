


function visibleItem (element: Element): boolean {
    const style: CSSStyleDeclaration = window.getComputedStyle(element);
    const rect = element.getBoundingClientRect();

    return (
        style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        style.opacity !== '0' &&
        rect.width > 0 &&
        rect.height > 0

    )
}

function getElem(): string[]{
    const elem: NodeListOf<Element> = document.querySelectorAll('*');

    return Array.from(elem)
        .filter(visibleItem)
        .map(e => e.outerHTML);
}


chrome.runtime.sendMessage({visibleHTML: getElem()});



