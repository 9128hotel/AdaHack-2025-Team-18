function testLandmarkTags(element: Document) {
    const main = element.querySelector("main")
    
    if (main) {
        const headingSelectors = 'h1,h2,h3,h4,h5,h6';
        const headings = Array.from(main.querySelectorAll(headingSelectors)).map((h, i) => ({
            node: h,
            tag: h.tagName.toLowerCase(),
            level: parseInt(h.tagName.slice(1), 10),
            text: h.textContent.trim(),
            index: i
        }));
        const anyH1 = headings.find(h => h.level === 1);

        if (anyH1) {
            const directChildH1 = Array.from(main.children).some(c => c.tagName && c.tagName.toLowerCase() === 'h1');
            
            if (directChildH1) {
                const firstH1Index = headings.findIndex(h => h.level === 1);
                if (firstH1Index == 0) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } else {
            return false;
        }

    } else {
        return false;
    }
}