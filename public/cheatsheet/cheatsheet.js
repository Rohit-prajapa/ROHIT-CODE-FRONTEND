// ==========================================================
// CodeWithRohit - Common Cheat Sheet JavaScript
// Used for HTML, CSS, JavaScript, Python, C, C++, Java,
// React, DBMS, OS, CN, OOPs, DSA and all cheat-sheet pages
// ==========================================================

document.addEventListener("DOMContentLoaded", () => {

    // ======================================================
    // ELEMENTS
    // ======================================================

    const navbar = document.querySelector(".cheat-navbar");
    const hero = document.querySelector(".cheat-hero");
    const container = document.querySelector(".container");
    const cheatItems = document.querySelectorAll(
        ".container > ol > li"
    );
    const codeBlocks = document.querySelectorAll(
        'pre[class*="language-"]'
    );


    // ======================================================
    // NAVBAR SCROLL EFFECT
    // ======================================================

    function handleNavbarScroll() {

        if (!navbar) return;

        if (window.scrollY > 40) {

            navbar.style.background =
                "rgba(6, 10, 17, 0.98)";

            navbar.style.boxShadow =
                "0 5px 25px rgba(0, 0, 0, 0.35)";

        } else {

            navbar.style.background =
                "rgba(8, 13, 23, 0.95)";

            navbar.style.boxShadow = "none";

        }

    }

    window.addEventListener(
        "scroll",
        handleNavbarScroll
    );

    handleNavbarScroll();


    // ======================================================
    // CREATE SEARCH BAR
    // ======================================================

    let searchInput = null;
    let noResults = null;

    if (hero && cheatItems.length > 0) {

        const searchWrapper =
            document.createElement("div");

        searchWrapper.className =
            "cheat-search-wrapper";

        searchWrapper.innerHTML = `
            <input
                type="text"
                class="cheat-search"
                id="cheatSearch"
                placeholder="Search this cheat sheet..."
                autocomplete="off"
                aria-label="Search this cheat sheet"
            >

            <span
                class="cheat-search-icon"
                aria-hidden="true"
            >
                🔍
            </span>
        `;

        hero.appendChild(searchWrapper);

        searchInput =
            document.getElementById("cheatSearch");


        // No result message

        noResults =
            document.createElement("div");

        noResults.className =
            "no-results";

        noResults.textContent =
            "No matching topic found.";

        noResults.style.display =
            "none";

        if (container) {

            container.appendChild(
                noResults
            );

        }

    }


    // ======================================================
    // SEARCH CHEAT SHEET
    // ======================================================

    function filterCheatSheet() {

        if (!searchInput) return;

        const searchValue =
            searchInput.value
                .toLowerCase()
                .trim();

        let visibleItems = 0;

        cheatItems.forEach(item => {

            const heading =
                item.querySelector("h2")
                    ?.textContent
                    .toLowerCase() || "";

            const paragraph =
                Array.from(
                    item.querySelectorAll("p")
                )
                    .map(p =>
                        p.textContent.toLowerCase()
                    )
                    .join(" ");

            const code =
                Array.from(
                    item.querySelectorAll("code")
                )
                    .map(code =>
                        code.textContent.toLowerCase()
                    )
                    .join(" ");

            const completeText =
                `${heading} ${paragraph} ${code}`;

            if (
                searchValue === "" ||
                completeText.includes(searchValue)
            ) {

                item.style.display = "";

                visibleItems++;

            } else {

                item.style.display = "none";

            }

        });


        // Show no-result message

        if (noResults) {

            if (
                searchValue !== "" &&
                visibleItems === 0
            ) {

                noResults.style.display =
                    "block";

                noResults.innerHTML = `
                    No topic found for
                    "<strong>${escapeHTML(
                        searchInput.value
                    )}</strong>"
                `;

            } else {

                noResults.style.display =
                    "none";

            }

        }

    }


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            filterCheatSheet
        );

    }


    // ======================================================
    // SAFE HTML FUNCTION
    // ======================================================

    function escapeHTML(value) {

        const div =
            document.createElement("div");

        div.textContent = value;

        return div.innerHTML;

    }


    // ======================================================
    // "/" SHORTCUT TO SEARCH
    // ======================================================

    document.addEventListener(
        "keydown",
        event => {

            const activeElement =
                document.activeElement;

            const isTyping =
                activeElement &&
                (
                    activeElement.tagName ===
                        "INPUT" ||

                    activeElement.tagName ===
                        "TEXTAREA" ||

                    activeElement.isContentEditable
                );


            // Press "/" to focus search

            if (
                event.key === "/" &&
                !isTyping &&
                searchInput
            ) {

                event.preventDefault();

                searchInput.focus();

            }


            // Press Escape to clear search

            if (
                event.key === "Escape" &&
                searchInput
            ) {

                searchInput.value = "";

                filterCheatSheet();

                searchInput.blur();

            }

        }
    );


    // ======================================================
    // ADD COPY BUTTON TO EVERY CODE BLOCK
    // ======================================================

    codeBlocks.forEach(pre => {

        // Prevent duplicate copy buttons

        if (
            pre.querySelector(".copy-btn")
        ) {
            return;
        }


        const button =
            document.createElement("button");

        button.className =
            "copy-btn";

        button.type =
            "button";

        button.textContent =
            "Copy";

        button.setAttribute(
            "aria-label",
            "Copy code"
        );


        // Make sure button positioning works

        pre.style.position =
            "relative";


        pre.appendChild(button);


        // Copy event

        button.addEventListener(
            "click",
            async () => {

                const code =
                    pre.querySelector("code");

                if (!code) return;

                const text =
                    code.innerText;


                try {

                    await navigator.clipboard.writeText(
                        text
                    );

                    showCopied(button);

                } catch (error) {

                    // Fallback for browsers
                    // where Clipboard API
                    // is unavailable.

                    fallbackCopy(text);

                    showCopied(button);

                }

            }
        );

    });


    // ======================================================
    // COPY SUCCESS STATE
    // ======================================================

    function showCopied(button) {

        const oldText =
            button.textContent;

        button.textContent =
            "Copied ✓";

        button.classList.add(
            "copied"
        );

        setTimeout(() => {

            button.textContent =
                oldText;

            button.classList.remove(
                "copied"
            );

        }, 1600);

    }


    // ======================================================
    // FALLBACK COPY METHOD
    // ======================================================

    function fallbackCopy(text) {

        const textarea =
            document.createElement("textarea");

        textarea.value = text;

        textarea.style.position =
            "fixed";

        textarea.style.left =
            "-9999px";

        textarea.style.top =
            "-9999px";

        document.body.appendChild(
            textarea
        );

        textarea.focus();
        textarea.select();

        try {

            document.execCommand(
                "copy"
            );

        } catch (error) {

            console.error(
                "Unable to copy:",
                error
            );

        }

        textarea.remove();

    }


    // ======================================================
    // SCROLL ANIMATION
    // ======================================================

    if (
        "IntersectionObserver" in window
    ) {

        const observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(
                        entry => {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target
                                    .classList
                                    .add(
                                        "cheat-visible"
                                    );

                                observer.unobserve(
                                    entry.target
                                );

                            }

                        }
                    );

                },
                {
                    threshold: 0.08,
                    rootMargin:
                        "0px 0px -30px 0px"
                }
            );


        cheatItems.forEach(item => {

            item.classList.add(
                "cheat-hidden"
            );

            observer.observe(
                item
            );

        });

    } else {

        // Fallback

        cheatItems.forEach(item => {

            item.classList.add(
                "cheat-visible"
            );

        });

    }


    // ======================================================
    // CREATE BACK TO TOP BUTTON
    // ======================================================

    const backToTop =
        document.createElement("button");

    backToTop.className =
        "cheat-back-to-top";

    backToTop.type =
        "button";

    backToTop.innerHTML =
        "↑";

    backToTop.setAttribute(
        "aria-label",
        "Back to top"
    );

    backToTop.setAttribute(
        "title",
        "Back to top"
    );

    document.body.appendChild(
        backToTop
    );


    // ======================================================
    // SHOW / HIDE BACK TO TOP
    // ======================================================

    function toggleBackToTop() {

        if (
            window.scrollY > 500
        ) {

            backToTop.classList.add(
                "show"
            );

        } else {

            backToTop.classList.remove(
                "show"
            );

        }

    }


    window.addEventListener(
        "scroll",
        toggleBackToTop
    );

    toggleBackToTop();


    // ======================================================
    // BACK TO TOP CLICK
    // ======================================================

    backToTop.addEventListener(
        "click",
        () => {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );


    // ======================================================
    // SMOOTH SCROLL FOR INTERNAL LINKS
    // ======================================================

    document.querySelectorAll(
        'a[href^="#"]'
    ).forEach(link => {

        link.addEventListener(
            "click",
            event => {

                const targetId =
                    link.getAttribute(
                        "href"
                    );

                if (
                    !targetId ||
                    targetId === "#"
                ) {
                    return;
                }


                const target =
                    document.querySelector(
                        targetId
                    );

                if (target) {

                    event.preventDefault();

                    target.scrollIntoView({
                        behavior:
                            "smooth",
                        block:
                            "start"
                    });

                }

            }
        );

    });


    // ======================================================
    // UPDATE FOOTER YEAR AUTOMATICALLY
    // ======================================================

    const footer =
        document.querySelector(
            ".main-footer"
        );

    if (footer) {

        const footerText =
            footer.querySelector("p");

        if (footerText) {

            footerText.innerHTML =
                footerText.innerHTML.replace(
                    /©\s*\d{4}/,
                    `© ${new Date().getFullYear()}`
                );

        }

    }


    // ======================================================
    // ADD TOPIC COUNT
    // ======================================================

    if (
        hero &&
        cheatItems.length > 0
    ) {

        const topicCount =
            document.createElement("p");

        topicCount.className =
            "topic-count";

        topicCount.innerHTML =
            `<strong>${cheatItems.length}</strong> topics included`;

        const searchWrapper =
            hero.querySelector(
                ".cheat-search-wrapper"
            );

        if (searchWrapper) {

            searchWrapper.insertAdjacentElement(
                "afterend",
                topicCount
            );

        }

    }


    // ======================================================
    // ADD TOOLTIP TO SEARCH
    // ======================================================

    if (searchInput) {

        searchInput.title =
            'Press "/" to search and "Esc" to clear';

    }


    // ======================================================
    // PRISM REFRESH
    // ======================================================

    if (
        typeof Prism !== "undefined"
    ) {

        Prism.highlightAll();

    }


    // ======================================================
    // CONSOLE MESSAGE
    // ======================================================

    console.log(
        "%c</> CodeWithRohit",
        [
            "font-size: 20px",
            "font-weight: bold",
            "color: #38bdf8"
        ].join(";")
    );

    console.log(
        `${cheatItems.length} topics loaded successfully.`
    );

});