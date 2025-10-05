export function testFormHasLabel(element) {
    const otherElements = [
        ...Array.from(element.querySelectorAll<HTMLInputElement>("input")),
        ...Array.from(element.querySelectorAll<HTMLSelectElement>("select")),
        ...Array.from(element.querySelectorAll<HTMLTextAreaElement>("textarea")),
        ...Array.from(element.querySelectorAll<HTMLButtonElement>("button")),
    ];

    const visibleOtherElements = otherElements.filter(c => !(c instanceof HTMLInputElement && c.type === "hidden"))
    for (const element of visibleOtherElements) {
        // wrapped by or referenced by label
        const id = element.id
        const hasForLabel = id ? !!element.querySelector(`label[for="${CSS.escape(id)}"]`) : false
        const isWrappedByLabel = !!element.closest("label")
        const ariaLabelledBy = element.getAttribute("aria-labelledby")
        const hasAriaLabelledBy = !!ariaLabelledBy && Array.from(element.querySelectorAll(`#${ariaLabelledBy.split(/\s+/).map(s => CSS.escape(s)).join(",#")}`)).length > 0 // element has ariaLabeledBy and the element its referencing exists within the form
        const ariaLabel = element.getAttribute("aria-label")
        const hasLabel = hasForLabel || isWrappedByLabel || hasAriaLabelledBy || (!!ariaLabel && ariaLabel.trim().length > 0)
        if (!hasLabel) {return false}
    }

    // warn - not implemented yet
    if (element.querySelectorAll("fieldset").length > element.querySelectorAll("legend").length) {
        console.log("WARN: All fieldsets should have a legend")
    }
}