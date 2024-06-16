// Element Internals polyfill: setter of role attribute
if (!("role" in Element.prototype)) {
    Object.defineProperty(Element.prototype, "role", {
        get() {
            return this.getAttribute("role");
        },
        set(value) {
            this.setAttribute("role", value);
        },
    });
}
if (!("ariaExpanded" in Element.prototype)) {
    Object.defineProperty(Element.prototype, "ariaExpanded", {
        get() {
            return this.getAttribute("aria-expanded");
        },
        set(value) {
            this.setAttribute("aria-expanded", value);
        },
    });
}
