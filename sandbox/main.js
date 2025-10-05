console.log("Accessibility checker loaded!");

let isFrameValid = true;

window.addEventListener('beforeunload', () => {
    isFrameValid = false;
});

function safeExecute(fn) {
    if (!isFrameValid) return;
    try {
        fn();
    } catch (error) {
        if (error.message.includes('Frame') || error.message.includes('removed')) {
            isFrameValid = false;
            console.log('Frame became invalid, stopping execution');
        } else {
            console.error(error);
        }
    }
}

function highlightElement(element, message) {
    element.style.outline = '3px solid red';
    element.style.outlineOffset = '2px';
    element.style.position = 'relative';

    const tooltip = document.createElement('div');
    tooltip.className = 'a11y-tooltip';
    tooltip.innerHTML = message;

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
}

function testMediaHasCaptions(element) {
    const videos = Array.from(element.querySelectorAll("video"));
    const badVideos = [];
    
    if (videos.length === 0) return { badVideos };
    
    for (const video of videos) {
        const tracks = Array.from(video.getElementsByTagName("track"));
        const textTracks = Array.from(video.textTracks);
        const hasSubtitles = tracks.some(t => t.kind === "subtitles" || t.kind === "captions") || 
                            textTracks.some(t => t.kind === "subtitles" || t.kind === "captions");

        if (!hasSubtitles) {
            highlightElement(video, "Video has no captions");
            badVideos.push(video);
        }
    }
    return { badVideos };
}

function testFormHasLabels(elements) {
    const forms = elements.querySelectorAll("form");
    let badForms = [];
    
    if (forms.length === 0) {
        console.log("No forms found");
        return badForms;
    }

    for (const form of forms) {
        const otherElements = [
            ...Array.from(form.querySelectorAll("input")),
            ...Array.from(form.querySelectorAll("select")),
            ...Array.from(form.querySelectorAll("textarea")),
            ...Array.from(form.querySelectorAll("button")),
        ];

        const visibleOtherElements = otherElements.filter(c => 
            !(c instanceof HTMLInputElement && c.type === "hidden")
        );

        if (visibleOtherElements.length === 0) continue;

        for (const element of visibleOtherElements) {
            const id = element.id;
            const hasForLabel = id ? !!form.querySelector(`label[for="${CSS.escape(id)}"]`) : false;
            const isWrappedByLabel = !!element.closest("label");

            const ariaLabelledBy = element.getAttribute("aria-labelledby");
            const hasAriaLabelledBy = !!ariaLabelledBy && 
                Array.from(form.querySelectorAll(`#${ariaLabelledBy.split(/\s+/).map(s => CSS.escape(s)).join(",#")}`)).length > 0;
            const ariaLabel = element.getAttribute("aria-label");

            const hasLabel = hasForLabel || isWrappedByLabel || hasAriaLabelledBy || 
                           (!!ariaLabel && ariaLabel.trim().length > 0);

            if (!hasLabel) {
                highlightElement(element, "Form element missing label");
                badForms.push(element);
            }
        }

        if (form.querySelectorAll("fieldset").length > form.querySelectorAll("legend").length) {
            console.log("WARN: All fieldsets should have a legend");
        }
    }

    return badForms;
}

function getLum(r, g, b) {
    const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
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

function checkContrast(element) {
    const computed = window.getComputedStyle(element);
    const txtColor = parseRGB(computed.color);
    if (!txtColor) return;
    
    const bgColor = getBGColor(element);
    const contrast = getContrastRatio(txtColor, bgColor);

    if (contrast < 4.5) {
        const bgLum = getLum(bgColor[0], bgColor[1], bgColor[2]);
        
        let message = `Poor contrast: ${contrast.toFixed(2)}:1 (needs 4.5:1)`;
        if (bgLum > 0.5) {
            message += '<br>Use darker text';
        } else {
            message += '<br>Use lighter text';
        }
        
        highlightElement(element, message);
    }
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

function init() {
    safeExecute(() => {
        // Run initial checks
        const formIssues = testFormHasLabels(document);
        const results = testMediaHasCaptions(document);
        document.querySelectorAll('p, span, a, li, div, h1, h2, h3, h4, h5, h6, button, input, textarea, label').forEach(element => {
            checkContrast(element);
        });

        console.log(`Found ${formIssues.length} form issues and ${results.badVideos.length} video issues`);

        // Set up observer for dynamic content
        const observer = new MutationObserver(mutations => {
            if (!isFrameValid) return;
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        checkContrast(node);
                        const children = node.querySelectorAll('p, span, a, li, div, h1, h2, h3, h4, h5, h6, button, input, textarea');
                        children.forEach(child => checkContrast(child));
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}