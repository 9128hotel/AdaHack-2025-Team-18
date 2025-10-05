function test_form_controls(elements: Document) {
    const forms = elements.querySelectorAll<HTMLFormElement>("form")
    var badForms: (HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | HTMLButtonElement)[] = []
    for (const form of forms) {

        const otherElements = [
            ...Array.from(form.querySelectorAll<HTMLInputElement>("input")),
            ...Array.from(form.querySelectorAll<HTMLSelectElement>("select")),
            ...Array.from(form.querySelectorAll<HTMLTextAreaElement>("textarea")),
            ...Array.from(form.querySelectorAll<HTMLButtonElement>("button")),
        ];

        const visibleOtherElements = otherElements.filter(c => !(c instanceof HTMLInputElement && c.type === "hidden"))

        for (const element of visibleOtherElements) {
            // wrapped by or referenced by label
            const id = (element as Element).id
            const hasForLabel = id ? !!form.querySelector(`label[for="${CSS.escape(id)}"]`) : false
            const isWrappedByLabel = !!element.closest("label")

            const ariaLabelledBy = element.getAttribute("aria-labelledby")
            const hasAriaLabelledBy = !!ariaLabelledBy && Array.from(form.querySelectorAll(`#${ariaLabelledBy.split(/\s+/).map(s => CSS.escape(s)).join(",#")}`)).length > 0 // element has ariaLabeledBy and the element its referencing exists within the form
            const ariaLabel = element.getAttribute("aria-label")

            const hasLabel = hasForLabel || isWrappedByLabel || hasAriaLabelledBy || (!!ariaLabel && ariaLabel.trim().length > 0)

            if (!hasLabel) {badForms.push(element)}
        }

        // warn - not implemented yet
        if (form.querySelectorAll("fieldset").length > form.querySelectorAll("legend").length) {
            console.log("WARN: All fieldsets should have a legend")
        }
    }

    return badForms
}