function testTabReachability(elements: Document) {
    var badElements: HTMLElement[] = []

    const focusableElements = elements.querySelectorAll<HTMLElement>(
        'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) {
        console.log("No focusable elements");
        return badElements;
    }

    focusableElements.forEach((element, index) => {
        element.focus();
        
        if (document.activeElement !== element) {
            badElements.concat(element)
        }
    });

    return badElements
}