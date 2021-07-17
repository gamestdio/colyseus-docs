document.addEventListener('DOMContentLoaded', (event) => {
    /**
     * WORKAROUND:
     * Rewrites language links to redirect to current page.
     */
    var languageOptions = Array.from(document.querySelectorAll('.md-header__option .md-select .md-select__item > a'));

    // Builds regexp: /(pt|en|fr|...)/
    var languageOptionsRegexp = new RegExp("\/(" + languageOptions.map((el) => el.getAttribute("hreflang")).join("|") + ")\/")
    var currentPath = document.location.pathname.replace(languageOptionsRegexp, "/");

    languageOptions.forEach((el) => {
        var lang = el.getAttribute("hreflang");
        el.href = "/" + lang + currentPath;
    });

    /**
     * Enable syntax highlight
     */
    document.querySelectorAll('pre code').forEach((el) => {
        hljs.highlightElement(el);
    });
});
