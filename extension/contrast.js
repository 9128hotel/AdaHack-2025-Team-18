function getLum(r, g, b) {
    const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrast(rgb1, rgb2) {
    const lum1 = getLum(rgb1[0], rgb1[1], rgb1[2]);
    const lum2 = getLum(rgb2[0], rgb2[1], rgb2[2]);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
}

function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b];
}

function getContrastRatio(rgb1, rgb2) {
    const lum1 = getLum(rgb1[0], rgb1[1], rgb1[2]);
    const lum2 = getLum(rgb2[0], rgb2[1], rgb2[2]);
    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);
    return (lighter + 0.05) / (darker + 0.05);
}

function parseRGB(colorString) {
    const match = colorString.match(/\d+/g);
    if (!match || match.length < 3) return null;
    return [parseInt(match[0]), parseInt(match[1]), parseInt(match[2])];
}

function getBGColor(element) {
    let current = element;
    let bgColor = null;

    while (current && current !== document.body) {
        const computed = window.getComputedStyle(current);
        const bg = computed.backgroundColor;
        
        if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
            bgColor = parseRGB(bg);
            break;
        }
        current = current.parentElement;
    }

    return bgColor || [255, 255, 255]; 
}

function highlightElement(element, message) {
    element.style.outline = '3px solid red';
    element.style.outlineOffset = '2px';
    element.style.position = 'relative';

    const tooltip = document.createElement('div');
    tooltip.className = 'contrast-tooltip';
    tooltip.innerHTML =  message
    tooltip.style.cssText = `
        position: absolute;
        top: -10px;
        left: 0;
        background: #ff4444;
        color: white;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 11px;
        line-height: 1.4;
        z-index: 999999;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        min-width: 200px;
        pointer-events: none;
        display: none;
    `;
    
    element.appendChild(tooltip);

    element.addEventListener('mouseenter', () => {
        tooltip.style.display = 'block';
    });
    
    element.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
    });
    
    element.setAttribute('data-contrast-ratio', contrastRatio.toFixed(2));
    element.setAttribute('data-contrast-issue', recommendation);
}

function checkContrast(element) {
    const computed = window.getComputedStyle(element);
    const txtColor = parseRGB(computed.color);
    if (!txtColor) return;
    
    const bgColor = getBGColor(element);
    const contrast = getContrastRatio(txtColor, bgColor);

    if (contrast < 3.0) {
        const bgLum = getLum(bgColor[0], bgColor[1], bgColor[2]);
        
        if (bgLum > 0.5) {
            return true
        } else {
            return false
        }
        
        highlightElement(element, "no good");
    }
}



const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1) {
                adjustCont(node);

                const children = node.querySelectorAll('p, span, a, li, div, h1, h2, h3, h4, h5, h6, button, input, textarea');
                children.forEach(child => adjustCont(child));
            }
        });
    });
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

