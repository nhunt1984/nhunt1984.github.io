(function () {
    var herePath = location.pathname.replace(/\/+$/, "");
    var here = (herePath.split("/").pop() || "index.html").toLowerCase();

    document.querySelectorAll("a.nav-link").forEach(function (a) {
        try {
            var url = new URL(a.getAttribute("href"), location.href);
            var target = (url.pathname.replace(/\/+$/, "").split("/").pop() || "index.html").toLowerCase();
            if (target === here) {
                a.setAttribute("aria-current", "page");
                a.classList.add("active");
            }
        } catch (e) {
            /* ignore malformed hrefs */
        }
    });
})();

(function () {
    var images = document.querySelectorAll("img.expandable");
    if (!images.length) {
        return;
    }

    var lightbox = document.createElement("div");
    lightbox.className = "lightbox";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", "Enlarged image");
    lightbox.setAttribute("aria-hidden", "true");

    var closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "lightbox-close";
    closeButton.setAttribute("aria-label", "Close image");
    closeButton.textContent = "×";

    var lightboxImg = document.createElement("img");
    lightboxImg.alt = "";

    lightbox.appendChild(closeButton);
    lightbox.appendChild(lightboxImg);
    document.body.appendChild(lightbox);

    var opener = null;

    function isOpen() {
        return lightbox.getAttribute("aria-hidden") === "false";
    }

    function openLightbox(img) {
        opener = img;
        lightboxImg.src = img.currentSrc || img.src;
        lightboxImg.alt = img.alt;
        lightbox.setAttribute("aria-hidden", "false");
        closeButton.focus();
    }

    function closeLightbox() {
        lightbox.setAttribute("aria-hidden", "true");
        if (opener) {
            opener.focus();
            opener = null;
        }
    }

    images.forEach(function (img) {
        img.setAttribute("tabindex", "0");
        img.setAttribute("role", "button");
        img.setAttribute("aria-label", "Enlarge image: " + img.alt);

        img.addEventListener("click", function () {
            openLightbox(img);
        });

        img.addEventListener("keydown", function (e) {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openLightbox(img);
            }
        });
    });

    lightbox.addEventListener("click", function (e) {
        if (e.target !== lightboxImg) {
            closeLightbox();
        }
    });

    document.addEventListener("keydown", function (e) {
        if (!isOpen()) {
            return;
        }
        if (e.key === "Escape") {
            closeLightbox();
        } else if (e.key === "Tab") {
            e.preventDefault();
            closeButton.focus();
        }
    });
})();
