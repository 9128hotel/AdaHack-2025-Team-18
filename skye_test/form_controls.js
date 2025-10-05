"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function test_form_controls(elements) {
    const forms = elements.querySelectorAll("form");
    var badForms = [];
    for (const form of forms) {
        const labels = form.querySelectorAll("label");
        const otherElements = [
            ...Array.from(form.querySelectorAll("input")),
            ...Array.from(form.querySelectorAll("select")),
            ...Array.from(form.querySelectorAll("textarea")),
            ...Array.from(form.querySelectorAll("button")),
        ];
        if (labels.length < otherElements.length) {
            badForms.concat(form);
        }
        // warn - not implemented yet
    }
    return badForms;
}
//# sourceMappingURL=form_controls.js.map