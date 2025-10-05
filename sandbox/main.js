console.log("Content script has been injected and is running");

function highlightElement(element, message) {
    element.style.outline = '3px solid red';
    element.style.outlineOffset = '2px';
    element.style.position = 'relative';

    const tooltip = document.createElement('div');
    tooltip.className = 'contrast-tooltip';
    tooltip.innerHTML = message; // Now using the message parameter correctly

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
    
    // Show tooltip on hover
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
    if (!videos) {return null};
    for (const video of videos) {
        const tracks = Array.from(video.getElementsByTagName("track"));
        const textTracks = Array.from(video.textTracks);
        const hasSubtitles = tracks.some(t => t.kind === "subtitles" || t.kind === "captions") || textTracks.some(t => t.kind === "subtitles" || t.kind === "captions");

        if (!hasSubtitles) {
            video.style.border = "2px solid red";
            highlightElement(video, "Video has no captions")
            
            badVideos.push(video);
        }
    }
    return { badVideos };
}

function testFormHasLabels(elements) {
    const forms = elements.querySelectorAll<HTMLFormElement>("form");
    var badForms = [];
    if (!forms) {
        console.log("No forms");
        return null;
    }

    console.log(forms);
    for (const form of forms) {
        const otherElements = [
            ...Array.from(form.querySelectorAll<HTMLInputElement>("input")),
            ...Array.from(form.querySelectorAll<HTMLSelectElement>("select")),
            ...Array.from(form.querySelectorAll<HTMLTextAreaElement>("textarea")),
            ...Array.from(form.querySelectorAll<HTMLButtonElement>("button")),
        ];

        const visibleOtherElements = otherElements.filter(c => !(c instanceof HTMLInputElement && c.type === "hidden"));

        if (!visibleOtherElements) {
            console.log("No elements");
            return null;
        }

        console.log(visibleOtherElements);

        for (const element of visibleOtherElements) {
            // wrapped by or referenced by label
            const id = element.id;
            const hasForLabel = id ? !!form.querySelector(`label[for="${CSS.escape(id)}"]`) : false;
            const isWrappedByLabel = !!element.closest("label");

            const ariaLabelledBy = element.getAttribute("aria-labelledby");
            const hasAriaLabelledBy = !!ariaLabelledBy && Array.from(form.querySelectorAll(`#${ariaLabelledBy.split(/\s+/).map(s => CSS.escape(s)).join(",#")}`)).length > 0; // element has ariaLabeledBy and the element its referencing exists within the form
            const ariaLabel = element.getAttribute("aria-label");

            const hasLabel = hasForLabel || isWrappedByLabel || hasAriaLabelledBy || (!!ariaLabel && ariaLabel.trim().length > 0);

            // If the element does not have a label, apply red border and add to badForms
            if (!hasLabel) {
                element.style.border = "2px solid red"; // Apply a red border to the element
                badForms.push(element);
            }
        }

        // warn - not implemented yet
        if (form.querySelectorAll("fieldset").length > form.querySelectorAll("legend").length) {
            console.log("WARN: All fieldsets should have a legend");
        }
    }

    return badForms;
}

const formIssues = testFormHasLabels(document);
const results = testMediaHasCaptions(document);