function test_form_controls(elements: Document) {
    const forms = elements.querySelectorAll<HTMLFormElement>("form")
    var badForms: HTMLFormElement[] = []
    for (const form of forms) {
        const labels = form.querySelectorAll("label")
        const otherElements = [
            ...Array.from(form.querySelectorAll<HTMLInputElement>("input")),
            ...Array.from(form.querySelectorAll<HTMLSelectElement>("select")),
            ...Array.from(form.querySelectorAll<HTMLTextAreaElement>("textarea")),
            ...Array.from(form.querySelectorAll<HTMLButtonElement>("button")),
        ];

        if (labels.length < otherElements.length) {
            badForms.concat(form)
        }

        // warn - not implemented yet
        if (form.querySelectorAll("fieldset").length > form.querySelectorAll("legend").length) {
            console.log("WARN: All fieldsets should have a legend")
        }
    }

    return badForms
}