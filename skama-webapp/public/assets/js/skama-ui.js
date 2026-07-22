"use strict";
(() => {
    const root = document.documentElement;
    const body = document.body;
    const dateFormatRevealTimers = new WeakMap();
    const storageKey = "skama-theme";
    const cartStorageKey = "skama-cart";
    const favoriteStorageKey = "skama-favorites";
    const priceFormatter = new Intl.NumberFormat("es-CR");
    const iconMap = {
        "search": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"><circle cx=\"11\" cy=\"11\" r=\"7\"></circle><path d=\"m16.5 16.5 4 4\"></path></svg>",
        "heart": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"><path d=\"M20.4 5.8c-1.5-1.7-4-1.8-5.7-.3L12 8l-2.7-2.5c-1.7-1.5-4.2-1.4-5.7.3-1.6 1.8-1.4 4.6.4 6.2l8 7 8-7c1.8-1.6 2-4.4.4-6.2Z\"></path></svg>",
        "shopping-bag": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"><path d=\"M6 8h12l-1 12H7L6 8Z\"></path><path d=\"M9 8a3 3 0 0 1 6 0\"></path></svg>",
        "menu": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"><path d=\"M4 7h16\"></path><path d=\"M4 12h16\"></path><path d=\"M4 17h16\"></path></svg>",
        "x": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"><path d=\"m6 6 12 12\"></path><path d=\"m18 6-12 12\"></path></svg>",
        "sun": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"><circle cx=\"12\" cy=\"12\" r=\"4\"></circle><path d=\"M12 2v2\"></path><path d=\"M12 20v2\"></path><path d=\"M4.9 4.9 6.3 6.3\"></path><path d=\"m17.7 17.7 1.4 1.4\"></path><path d=\"M2 12h2\"></path><path d=\"M20 12h2\"></path><path d=\"m4.9 19.1 1.4-1.4\"></path><path d=\"m17.7 6.3 1.4-1.4\"></path></svg>",
        "moon": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"><path d=\"M20 15.5A8.5 8.5 0 0 1 8.5 4 7 7 0 1 0 20 15.5Z\"></path></svg>",
        "location": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"><path d=\"M12 21s6-5.3 6-11a6 6 0 1 0-12 0c0 5.7 6 11 6 11Z\"></path><circle cx=\"12\" cy=\"10\" r=\"2\"></circle></svg>",
        "mail": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"><rect x=\"4\" y=\"6\" width=\"16\" height=\"12\" rx=\"1.5\"></rect><path d=\"m5 8 7 5 7-5\"></path></svg>",
        "instagram": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"><rect x=\"5\" y=\"5\" width=\"14\" height=\"14\" rx=\"4\"></rect><circle cx=\"12\" cy=\"12\" r=\"3\"></circle><path d=\"M16.5 7.5h.01\"></path></svg>",
        "facebook": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"><path d=\"M14 8h2V5h-2c-2.2 0-4 1.8-4 4v2H8v3h2v5h3v-5h2.5l.5-3h-3V9c0-.6.4-1 1-1Z\"></path></svg>",
        "tiktok": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"><path d=\"M15 5c.6 2.4 2.1 3.9 4 4v3c-1.5 0-2.8-.4-4-1.2V16a5 5 0 1 1-5-5\"></path></svg>",
        "whatsapp": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"><path d=\"M5.5 19 7 15.8a7 7 0 1 1 2.8 2.7L5.5 19Z\"></path><path d=\"M9.5 9.5c.5 2.2 2.1 3.8 4.5 4.8l1.2-1.2\"></path></svg>",
        "arrow-left": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"><path d=\"m15 6-6 6 6 6\"></path></svg>",
        "arrow-right": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"><path d=\"m9 6 6 6-6 6\"></path></svg>",
        "list": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"><path d=\"M8 6h12\"></path><path d=\"M8 12h12\"></path><path d=\"M8 18h12\"></path><path d=\"M4 6h.01\"></path><path d=\"M4 12h.01\"></path><path d=\"M4 18h.01\"></path></svg>",
        "x-social": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"><path d=\"m5 5 14 14\"></path><path d=\"M19 5 5 19\"></path></svg>",
        "pinterest": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"><path d=\"M12 3a8 8 0 0 0-3 15.4l1.2-5.1\"></path><path d=\"M10.2 13.3c.4 1 1.3 1.7 2.6 1.7 2.1 0 3.7-1.8 3.7-4.3 0-2.2-1.6-3.7-4-3.7-2.7 0-4.7 2-4.7 4.6 0 1.1.4 2 1.1 2.5\"></path></svg>",
        "eye": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"><path d=\"M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z\"></path><circle cx=\"12\" cy=\"12\" r=\"3\"></circle></svg>",
        "eye-off": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"><path d=\"m3 3 18 18\"></path><path d=\"M10.6 10.6a3 3 0 0 0 4.2 4.2\"></path><path d=\"M9.9 5.3A10.8 10.8 0 0 1 12 5c6 0 9.5 7 9.5 7a17.9 17.9 0 0 1-2.4 3.2\"></path><path d=\"M6.6 6.6C3.9 8.4 2.5 12 2.5 12s3.5 7 9.5 7c1.2 0 2.3-.3 3.3-.7\"></path></svg>",
        "dashboard": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"><rect x=\"4\" y=\"4\" width=\"6\" height=\"7\" rx=\"1\"></rect><rect x=\"14\" y=\"4\" width=\"6\" height=\"4\" rx=\"1\"></rect><rect x=\"14\" y=\"12\" width=\"6\" height=\"8\" rx=\"1\"></rect><rect x=\"4\" y=\"15\" width=\"6\" height=\"5\" rx=\"1\"></rect></svg>",
        "gem": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"><path d=\"M6 4h12l4 6-10 10L2 10l4-6Z\"></path><path d=\"M2 10h20\"></path><path d=\"m8 10 4 10 4-10\"></path></svg>",
        "layers": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"><path d=\"m12 3 9 5-9 5-9-5 9-5Z\"></path><path d=\"m3 12 9 5 9-5\"></path><path d=\"m3 16 9 5 9-5\"></path></svg>",
        "sparkle": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"><path d=\"M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z\"></path><path d=\"M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z\"></path></svg>",
        "receipt": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"><path d=\"M6 3h12v18l-3-2-3 2-3-2-3 2V3Z\"></path><path d=\"M9 8h6\"></path><path d=\"M9 12h6\"></path><path d=\"M9 16h4\"></path></svg>",
        "users": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"><path d=\"M16 19c0-2.2-1.8-4-4-4s-4 1.8-4 4\"></path><circle cx=\"12\" cy=\"9\" r=\"3\"></circle><path d=\"M20 18c0-1.7-1.1-3.1-2.7-3.7\"></path><path d=\"M17 6.4a2.5 2.5 0 0 1 0 5.2\"></path></svg>",
        "shield": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"><path d=\"M12 3 5 6v5c0 4.5 2.9 8.4 7 10 4.1-1.6 7-5.5 7-10V6l-7-3Z\"></path><path d=\"m9.5 12 1.7 1.7 3.8-4\"></path></svg>",
        "chart": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"><path d=\"M4 19V5\"></path><path d=\"M4 19h16\"></path><rect x=\"7\" y=\"11\" width=\"3\" height=\"5\"></rect><rect x=\"12\" y=\"8\" width=\"3\" height=\"8\"></rect><rect x=\"17\" y=\"6\" width=\"3\" height=\"10\"></rect></svg>",
        "settings": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"><circle cx=\"12\" cy=\"12\" r=\"3\"></circle><path d=\"M19.4 15a8 8 0 0 0 .1-6l-2.1-.4a7 7 0 0 0-1.1-1.1L16 5.4a8 8 0 0 0-6 0l-.4 2.1a7 7 0 0 0-1.1 1.1L6.4 9a8 8 0 0 0 0 6l2.1.4c.3.4.7.8 1.1 1.1l.4 2.1a8 8 0 0 0 6 0l.4-2.1c.4-.3.8-.7 1.1-1.1l1.9-.4Z\"></path></svg>",
        "logout": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"><path d=\"M10 5H5v14h5\"></path><path d=\"M14 8l4 4-4 4\"></path><path d=\"M18 12H9\"></path></svg>",
        "bell": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"><path d=\"M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z\"></path><path d=\"M10 21h4\"></path></svg>",
        "plus": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"><path d=\"M12 5v14\"></path><path d=\"M5 12h14\"></path></svg>",
        "download": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"><path d=\"M12 4v10\"></path><path d=\"m8 10 4 4 4-4\"></path><path d=\"M5 20h14\"></path></svg>",
        "filter": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"><path d=\"M4 6h16\"></path><path d=\"M7 12h10\"></path><path d=\"M10 18h4\"></path></svg>",
        "edit": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"><path d=\"M4 20h4L19 9l-4-4L4 16v4Z\"></path><path d=\"m13 7 4 4\"></path></svg>",
        "trash": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"><path d=\"M4 7h16\"></path><path d=\"M9 7V5h6v2\"></path><path d=\"M7 7l1 13h8l1-13\"></path></svg>",
        "clock": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"><circle cx=\"12\" cy=\"12\" r=\"8\"></circle><path d=\"M12 8v5l3 2\"></path></svg>",
        "alert": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"><path d=\"M12 3 2.5 20h19L12 3Z\"></path><path d=\"M12 9v4\"></path><path d=\"M12 17h.01\"></path></svg>"
    };
    document.querySelectorAll("[data-icon]").forEach((icon) => {
        const svg = iconMap[icon.dataset.icon];
        if (svg) {
            icon.innerHTML = svg;
        }
    });
    const updateThemeToggleState = (theme) => {
        document.querySelectorAll("[data-theme-toggle]").forEach((toggle) => {
            toggle.setAttribute("aria-pressed", String(theme === "dark"));
        });
    };
    const applyTheme = (theme) => {
        root.dataset.theme = theme;
        localStorage.setItem(storageKey, theme);
        updateThemeToggleState(theme);
    };
    const savedTheme = localStorage.getItem(storageKey);
    if (savedTheme) {
        root.dataset.theme = savedTheme;
    }
    updateThemeToggleState(root.dataset.theme || "light");
    const isDateFieldControl = (control) => {
        return control instanceof HTMLInputElement && control.type === "date";
    };
    const parseTimeInMs = (value) => {
        const times = value.split(",").map((part) => {
            const time = part.trim();
            const amount = Number.parseFloat(time);
            if (Number.isNaN(amount)) {
                return 0;
            }
            return time.endsWith("ms") ? amount : amount * 1000;
        });
        return Math.max(...times, 0);
    };
    const getLabelRiseDuration = (field) => {
        const labelLetters = Array.from(field.querySelectorAll(".sk-field__label span"));
        return labelLetters.reduce((duration, letter) => {
            const styles = window.getComputedStyle(letter);
            const letterDuration = parseTimeInMs(styles.transitionDelay) + parseTimeInMs(styles.transitionDuration);
            return Math.max(duration, letterDuration);
        }, 0);
    };
    const updateDateFormatVisibility = (control, field, shouldFloat) => {
        if (!isDateFieldControl(control)) {
            return;
        }
        field.classList.add("sk-field--date");
        const activeTimer = dateFormatRevealTimers.get(control);
        if (activeTimer !== undefined) {
            window.clearTimeout(activeTimer);
        }
        if (!shouldFloat) {
            field.classList.remove("is-date-format-visible");
            return;
        }
        const revealDelay = getLabelRiseDuration(field);
        const timer = window.setTimeout(() => {
            field.classList.add("is-date-format-visible");
            dateFormatRevealTimers.delete(control);
        }, revealDelay);
        dateFormatRevealTimers.set(control, timer);
    };
    const updateFloatingFieldState = (control) => {
        const field = control.closest(".sk-field");
        if (!field) {
            return;
        }
        const value = typeof control.value === "string" ? control.value.trim() : "";
        const isSelect = control.tagName.toLowerCase() === "select";
        const isFilled = isSelect || value.length > 0;
        const shouldFloat = isFilled || field.matches(":focus-within");
        field.classList.toggle("is-filled", isFilled);
        updateDateFormatVisibility(control, field, shouldFloat);
    };
    const initializeFloatingFields = () => {
        document.querySelectorAll(".sk-field__label").forEach((label) => {
            if (label.dataset.waveReady === "true") {
                return;
            }
            const text = label.textContent || "";
            label.textContent = "";
            Array.from(text).forEach((letter, index) => {
                const span = document.createElement("span");
                span.textContent = letter === " " ? "\u00a0" : letter;
                span.style.transitionDelay = `${index * 50}ms`;
                label.append(span);
            });
            label.dataset.waveReady = "true";
        });
        document.querySelectorAll(".sk-field input, .sk-field textarea, .sk-field select").forEach((control) => {
            updateFloatingFieldState(control);
            if (control.dataset.floatingReady === "true") {
                return;
            }
            control.addEventListener("focus", () => updateFloatingFieldState(control));
            control.addEventListener("input", () => updateFloatingFieldState(control));
            control.addEventListener("change", () => updateFloatingFieldState(control));
            control.addEventListener("blur", () => updateFloatingFieldState(control));
            control.dataset.floatingReady = "true";
        });
    };
    initializeFloatingFields();
    let activeDrawerTrigger = null;
    let activeCatalogProduct = null;
    let activeCatalogAddButton = null;
    const getFocusableElements = (container) => {
        return Array.from(container.querySelectorAll("a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])"))
            .filter((element) => element.getClientRects().length > 0);
    };
    const closeDrawer = (drawer) => {
        drawer?.classList.remove("is-open");
        drawer?.setAttribute("aria-hidden", "true");
        body.classList.remove("is-scroll-locked");
        document.querySelectorAll("[data-drawer-open]").forEach((button) => {
            button.setAttribute("aria-expanded", "false");
        });
        activeDrawerTrigger?.focus();
        activeDrawerTrigger = null;
    };
    const getCatalogProductData = (card) => {
        const stock = Math.max(1, Math.floor(Number(card.dataset.productStock || 8)));
        const purchaseLimit = Math.max(1, Math.floor(Number(card.dataset.productPurchaseLimit || stock)));
        return {
            id: card.dataset.productId || card.dataset.productImage || card.dataset.productName || "",
            name: card.dataset.productName || "",
            collection: card.dataset.productCollection || "",
            price: Number(card.dataset.productPrice || 0),
            priceLabel: card.dataset.productPriceLabel || "",
            description: card.dataset.productDescription || "",
            image: card.dataset.productImage || "",
            imageAlt: card.dataset.productImageAlt || "",
            stock,
            purchaseLimit: Math.min(stock, purchaseLimit),
            isLimited: card.dataset.productLimited === "true"
        };
    };
    const isRecord = (value) => {
        return typeof value === "object" && value !== null;
    };
    const formatCatalogPrice = (value) => `CRC ${priceFormatter.format(value)}`;
    const getProductQuantityLimit = (product) => {
        const stock = Math.max(1, Math.floor(product.stock || 1));
        const purchaseLimit = Math.max(1, Math.floor(product.purchaseLimit || stock));
        return product.isLimited ? 1 : Math.min(stock, purchaseLimit);
    };
    const formatStockLabel = (product) => {
        const units = product.stock === 1 ? "unidad" : "unidades";
        const limit = getProductQuantityLimit(product);
        return product.isLimited
            ? `Disponible: ${product.stock} ${units}. Limite de compra: 1 joya limitada por persona.`
            : `Disponible: ${product.stock} ${units}. Maximo por pedido: ${limit}.`;
    };
    const normalizeCatalogProductData = (value) => {
        if (!isRecord(value)) {
            return null;
        }
        const price = typeof value.price === "number" ? value.price : Number(value.price || 0);
        const name = typeof value.name === "string" ? value.name : "";
        const stock = Math.max(1, Math.floor(Number(value.stock || 8)));
        const purchaseLimit = Math.max(1, Math.floor(Number(value.purchaseLimit || stock)));
        if (name.length === 0 || price <= 0) {
            return null;
        }
        return {
            id: typeof value.id === "string" && value.id.length > 0
                ? value.id
                : typeof value.image === "string" && value.image.length > 0
                    ? value.image
                    : name,
            name,
            collection: typeof value.collection === "string" ? value.collection : "",
            price,
            priceLabel: typeof value.priceLabel === "string" && value.priceLabel.length > 0 ? value.priceLabel : formatCatalogPrice(price),
            description: typeof value.description === "string" ? value.description : "",
            image: typeof value.image === "string" ? value.image : "",
            imageAlt: typeof value.imageAlt === "string" ? value.imageAlt : name,
            stock,
            purchaseLimit: Math.min(stock, purchaseLimit),
            isLimited: value.isLimited === true
        };
    };
    const setText = (element, value) => {
        if (element) {
            element.textContent = value;
        }
    };
    const showDialog = (dialog) => {
        if (dialog && !dialog.open) {
            dialog.showModal();
        }
    };
    const isUserAuthenticated = () => {
        return body.dataset.userAuthenticated === "true" ||
            localStorage.getItem("skama-user-authenticated") === "true" ||
            localStorage.getItem("skama-user") !== null;
    };
    const openLimitedAccessDialog = () => {
        const detailModal = document.querySelector("[data-product-detail-modal]");
        const limitedModal = document.querySelector("[data-limited-access-modal]");
        if (detailModal?.open) {
            detailModal.close();
        }
        showDialog(limitedModal || null);
    };
    const syncLimitedPurchaseButtons = () => {
        const authenticated = isUserAuthenticated();
        document.querySelectorAll("[data-limited-purchase-trigger]").forEach((button) => {
            button.disabled = false;
            button.classList.toggle("sk-button--secondary", !authenticated);
            button.classList.toggle("sk-button--primary", authenticated);
            button.textContent = authenticated
                ? button.dataset.limitedUnlockedLabel || "Agregar"
                : button.dataset.limitedLockedLabel || "Iniciar sesión para comprar";
            if (authenticated) {
                delete button.dataset.limitedPurchaseTrigger;
                button.dataset.productAddTrigger = "";
            }
        });
    };
    const setLimitedCarouselSlide = (carousel, index) => {
        const slides = Array.from(carousel.querySelectorAll("[data-limited-slide]"));
        const dots = Array.from(carousel.querySelectorAll("[data-limited-carousel-dot]"));
        if (slides.length === 0) {
            return;
        }
        const nextIndex = ((index % slides.length) + slides.length) % slides.length;
        carousel.dataset.activeLimitedSlide = String(nextIndex);
        slides.forEach((slide, slideIndex) => {
            const isActive = slideIndex === nextIndex;
            slide.classList.toggle("is-active", isActive);
            slide.setAttribute("aria-hidden", String(!isActive));
        });
        dots.forEach((dot, dotIndex) => {
            dot.setAttribute("aria-current", String(dotIndex === nextIndex));
        });
    };
    const initializeLimitedCarousels = () => {
        document.querySelectorAll("[data-limited-carousel]").forEach((carousel) => {
            if (carousel.dataset.carouselReady === "true") {
                return;
            }
            carousel.dataset.carouselReady = "true";
            carousel.dataset.activeLimitedSlide = carousel.dataset.activeLimitedSlide || "0";
            window.setInterval(() => {
                const current = Number(carousel.dataset.activeLimitedSlide || 0);
                setLimitedCarouselSlide(carousel, current + 1);
            }, 2000);
        });
    };
    function getCartQuantityForProduct(productId) {
        return getStoredCartItems()
            .filter((item) => item.id === productId)
            .reduce((total, item) => total + item.quantity, 0);
    }
    function getLimitedCartQuantity() {
        return getStoredCartItems()
            .filter((item) => item.isLimited)
            .reduce((total, item) => total + item.quantity, 0);
    }
    function getRemainingProductQuantity(product) {
        if (product.isLimited) {
            return Math.max(0, 1 - getLimitedCartQuantity());
        }
        return Math.max(0, getProductQuantityLimit(product) - getCartQuantityForProduct(product.id));
    }
    const openCatalogAddDialog = (product, sourceButton) => {
        if (product.isLimited && !isUserAuthenticated()) {
            openLimitedAccessDialog();
            return;
        }
        activeCatalogProduct = product;
        activeCatalogAddButton = sourceButton;
        const detailModal = document.querySelector("[data-product-detail-modal]");
        const addModal = document.querySelector("[data-product-add-modal]");
        const quantity = addModal?.querySelector("[data-product-add-quantity]");
        const submitButton = addModal?.querySelector("button[type='submit']");
        const remainingQuantity = getRemainingProductQuantity(product);
        const effectiveMax = Math.max(1, remainingQuantity);
        if (detailModal?.open) {
            detailModal.close();
        }
        setText(addModal?.querySelector("[data-product-add-name]") || null, product.name);
        setText(addModal?.querySelector("[data-product-add-summary]") || null, product.priceLabel);
        setText(addModal?.querySelector("[data-product-add-stock]") || null, remainingQuantity > 0
            ? formatStockLabel(product)
            : product.isLimited
                ? "Ya alcanzaste el limite de 1 joya limitada por persona."
                : "Ya agregaste la cantidad maxima disponible para esta joya.");
        if (quantity) {
            quantity.value = "1";
            quantity.max = String(effectiveMax);
            quantity.disabled = remainingQuantity === 0;
        }
        if (submitButton) {
            submitButton.disabled = remainingQuantity === 0;
            submitButton.textContent = remainingQuantity === 0 ? "Limite alcanzado" : "Agregar seleccion";
        }
        showDialog(addModal || null);
        window.setTimeout(() => quantity?.focus(), 0);
    };
    const openCatalogProductDetail = (card) => {
        const product = getCatalogProductData(card);
        activeCatalogProduct = product;
        activeCatalogAddButton = card.querySelector("[data-product-add-trigger]");
        const modal = document.querySelector("[data-product-detail-modal]");
        const image = modal?.querySelector("[data-product-detail-image]");
        const addButton = modal?.querySelector("[data-product-detail-add]");
        if (image) {
            image.src = product.image;
            image.alt = product.imageAlt || product.name;
        }
        setText(modal?.querySelector("[data-product-detail-name]") || null, product.name);
        setText(modal?.querySelector("[data-product-detail-price]") || null, product.priceLabel);
        setText(modal?.querySelector("[data-product-detail-stock]") || null, formatStockLabel(product));
        setText(modal?.querySelector("[data-product-detail-description]") || null, product.description);
        if (addButton) {
            const lockedLimited = product.isLimited && !isUserAuthenticated();
            const limitReached = !lockedLimited && getRemainingProductQuantity(product) === 0;
            addButton.disabled = limitReached;
            addButton.classList.toggle("sk-button--secondary", lockedLimited);
            addButton.classList.toggle("sk-button--primary", !lockedLimited);
            addButton.textContent = lockedLimited
                ? "Iniciar sesión para comprar"
                : limitReached
                    ? "Limite alcanzado"
                    : "Agregar al pedido";
        }
        showDialog(modal || null);
    };
    syncLimitedPurchaseButtons();
    initializeLimitedCarousels();
    const normalizeCatalogCartItem = (value) => {
        if (!isRecord(value)) {
            return null;
        }
        const product = normalizeCatalogProductData(value);
        const requestedQuantity = Math.floor(Number(value.quantity || 0));
        const quantity = product ? Math.min(getProductQuantityLimit(product), requestedQuantity) : requestedQuantity;
        return product && quantity > 0 ? { ...product, quantity } : null;
    };
    const getStoredCartItems = () => {
        try {
            const parsed = JSON.parse(localStorage.getItem(cartStorageKey) || "[]");
            return Array.isArray(parsed)
                ? parsed.map(normalizeCatalogCartItem).filter((item) => item !== null)
                : [];
        }
        catch {
            return [];
        }
    };
    const storeCartItems = (items) => {
        localStorage.setItem(cartStorageKey, JSON.stringify(items.filter((item) => item.quantity > 0)));
    };
    const getCartItemCount = (items = getStoredCartItems()) => {
        return items.reduce((total, item) => total + item.quantity, 0);
    };
    const getCartSubtotal = (items = getStoredCartItems()) => {
        return items.reduce((total, item) => total + item.price * item.quantity, 0);
    };
    const updateCartCounter = (items = getStoredCartItems()) => {
        const count = getCartItemCount(items);
        document.querySelectorAll("[data-cart-count]").forEach((counter) => {
            counter.textContent = "";
            counter.hidden = count === 0;
            counter.setAttribute("aria-label", count === 1 ? "1 artículo en el carrito" : `${count} artículos en el carrito`);
        });
    };
    const createCartDrawerItem = (item) => {
        const card = document.createElement("article");
        card.className = "sk-cart-item";
        card.dataset.cartItem = item.id;
        const image = document.createElement("img");
        image.src = item.image;
        image.alt = item.imageAlt || item.name;
        image.loading = "lazy";
        image.decoding = "async";
        const content = document.createElement("div");
        content.className = "sk-cart-item__content";
        const top = document.createElement("div");
        top.className = "sk-cart-item__top";
        const heading = document.createElement("div");
        const name = document.createElement("p");
        name.textContent = item.name;
        heading.append(name);
        const removeButton = document.createElement("button");
        removeButton.className = "sk-icon-button sk-icon-button--sm";
        removeButton.type = "button";
        removeButton.dataset.cartRemove = item.id;
        removeButton.setAttribute("aria-label", `Eliminar ${item.name} del carrito`);
        const removeIcon = document.createElement("span");
        removeIcon.className = "sk-icon";
        removeIcon.dataset.icon = "x";
        removeIcon.setAttribute("aria-hidden", "true");
        removeIcon.innerHTML = iconMap.x;
        removeButton.append(removeIcon);
        top.append(heading, removeButton);
        const description = document.createElement("span");
        description.className = "sk-cart-item__description";
        description.textContent = `${item.description} ${formatStockLabel(item)}`.trim();
        const meta = document.createElement("div");
        meta.className = "sk-cart-item__meta";
        const price = document.createElement("strong");
        price.className = "sk-price";
        price.textContent = formatCatalogPrice(item.price * item.quantity);
        const quantityLabel = document.createElement("span");
        quantityLabel.className = "sk-cart-item__favorite";
        quantityLabel.textContent = `Cantidad x${item.quantity}`;
        meta.append(price, quantityLabel);
        const quantity = document.createElement("div");
        quantity.className = "sk-quantity";
        quantity.dataset.quantitySelector = "";
        const decrease = document.createElement("button");
        decrease.type = "button";
        decrease.dataset.quantityDecrease = "";
        decrease.setAttribute("aria-label", "Disminuir cantidad");
        decrease.textContent = "-";
        const input = document.createElement("input");
        input.type = "number";
        input.min = "1";
        input.max = String(getProductQuantityLimit(item));
        input.value = String(item.quantity);
        input.dataset.quantityInput = "";
        input.dataset.cartItemQuantity = item.id;
        input.setAttribute("aria-label", `Cantidad de ${item.name}`);
        const increase = document.createElement("button");
        increase.type = "button";
        increase.dataset.quantityIncrease = "";
        increase.setAttribute("aria-label", "Aumentar cantidad");
        increase.textContent = "+";
        quantity.append(decrease, input, increase);
        if (item.description.length > 0) {
            content.append(top, description, meta, quantity);
        }
        else {
            content.append(top, meta, quantity);
        }
        card.append(image, content);
        return card;
    };
    const renderCartDrawer = () => {
        const items = getStoredCartItems();
        const count = getCartItemCount(items);
        const subtotal = getCartSubtotal(items);
        const hasItems = items.length > 0;
        const itemsContainer = document.querySelector("[data-cart-items]");
        const empty = document.querySelector("[data-cart-empty]");
        if (itemsContainer) {
            itemsContainer.replaceChildren(...items.map(createCartDrawerItem));
            itemsContainer.hidden = !hasItems;
        }
        document.querySelectorAll("[data-cart-section]").forEach((section) => {
            section.hidden = !hasItems;
        });
        if (empty) {
            empty.hidden = hasItems;
        }
        setText(document.querySelector("[data-cart-summary-count]"), count === 0 ? "Sin productos" : count === 1 ? "1 producto" : `${count} productos`);
        setText(document.querySelector("[data-cart-subtotal]"), formatCatalogPrice(subtotal));
        setText(document.querySelector("[data-cart-total]"), formatCatalogPrice(subtotal));
        updateCartCounter(items);
    };
    const storeCatalogCartItem = (product, quantity) => {
        const items = getStoredCartItems();
        const existing = items.find((item) => item.id === product.id);
        const currentQuantity = existing?.quantity || 0;
        const limit = getProductQuantityLimit(product);
        const remainingQuantity = product.isLimited
            ? Math.max(0, 1 - getLimitedCartQuantity())
            : Math.max(0, limit - currentQuantity);
        const addedQuantity = Math.min(quantity, remainingQuantity);
        const nextQuantity = currentQuantity + addedQuantity;
        if (addedQuantity === 0) {
            renderCartDrawer();
            return 0;
        }
        if (existing) {
            existing.quantity = nextQuantity;
            existing.stock = product.stock;
            existing.purchaseLimit = product.purchaseLimit;
        }
        else {
            items.push({ ...product, quantity: nextQuantity });
        }
        storeCartItems(items);
        renderCartDrawer();
        return addedQuantity;
    };
    const removeCartItem = (name) => {
        storeCartItems(getStoredCartItems().filter((item) => item.id !== name));
        renderCartDrawer();
    };
    const updateCartItemQuantity = (name, quantity) => {
        const items = getStoredCartItems().map((item) => item.id === name
            ? { ...item, quantity: Math.min(getProductQuantityLimit(item), Math.max(1, quantity)) }
            : item);
        storeCartItems(items);
        renderCartDrawer();
    };
    const getStoredFavoriteItems = () => {
        try {
            const parsed = JSON.parse(localStorage.getItem(favoriteStorageKey) || "[]");
            return Array.isArray(parsed)
                ? parsed.map(normalizeCatalogProductData).filter((item) => item !== null)
                : [];
        }
        catch {
            return [];
        }
    };
    const storeFavoriteItems = (items) => {
        localStorage.setItem(favoriteStorageKey, JSON.stringify(items));
    };
    const isFavoriteProduct = (product, favorites = getStoredFavoriteItems()) => {
        return favorites.some((item) => item.id === product.id);
    };
    const updateFavoriteCounter = () => {
        const count = getStoredFavoriteItems().length;
        document.querySelectorAll("[data-favorite-count]").forEach((counter) => {
            counter.textContent = "";
            counter.hidden = count === 0;
            counter.setAttribute("aria-label", count === 1 ? "1 destacado" : `${count} destacados`);
        });
    };
    const syncFavoriteToggles = () => {
        const favorites = getStoredFavoriteItems();
        document.querySelectorAll("[data-favorite-toggle]").forEach((toggle) => {
            const productCard = toggle.closest("[data-product-card]");
            if (!productCard) {
                return;
            }
            const product = getCatalogProductData(productCard);
            const isFavorite = isFavoriteProduct(product, favorites);
            toggle.setAttribute("aria-pressed", String(isFavorite));
            toggle.setAttribute("aria-label", `${isFavorite ? "Quitar" : "Agregar"} ${product.name} ${isFavorite ? "de" : "a"} destacados`);
        });
    };
    const createFavoriteProductCard = (product) => {
        const card = document.createElement("article");
        card.className = "sk-product-card";
        card.dataset.productCard = "";
        card.dataset.productId = product.id;
        card.dataset.productName = product.name;
        card.dataset.productCollection = product.collection;
        card.dataset.productPrice = String(product.price);
        card.dataset.productPriceLabel = product.priceLabel;
        card.dataset.productDescription = product.description;
        card.dataset.productImage = product.image;
        card.dataset.productImageAlt = product.imageAlt;
        card.dataset.productStock = String(product.stock);
        card.dataset.productPurchaseLimit = String(product.purchaseLimit);
        card.dataset.productLimited = String(product.isLimited);
        const media = document.createElement("button");
        media.className = "sk-product-card__media";
        media.type = "button";
        media.dataset.productDetailTrigger = "";
        media.setAttribute("aria-label", `Ver detalle de ${product.name}`);
        const image = document.createElement("img");
        image.src = product.image;
        image.alt = product.imageAlt || product.name;
        image.loading = "lazy";
        media.append(image);
        const favorite = document.createElement("button");
        favorite.className = "sk-icon-button sk-icon-button--sm sk-product-card__favorite";
        favorite.type = "button";
        favorite.dataset.favoriteToggle = "";
        favorite.setAttribute("aria-label", `Quitar ${product.name} de destacados`);
        favorite.setAttribute("aria-pressed", "true");
        const favoriteIcon = document.createElement("span");
        favoriteIcon.className = "sk-icon";
        favoriteIcon.dataset.icon = "heart";
        favoriteIcon.setAttribute("aria-hidden", "true");
        favoriteIcon.innerHTML = iconMap.heart;
        favorite.append(favoriteIcon);
        const bodyContent = document.createElement("div");
        bodyContent.className = "sk-product-card__body";
        const title = document.createElement("h3");
        const titleButton = document.createElement("button");
        titleButton.type = "button";
        titleButton.dataset.productDetailTrigger = "";
        titleButton.textContent = product.name;
        title.append(titleButton);
        const description = document.createElement("span");
        description.className = "sk-product-card__description";
        description.textContent = product.description;
        const price = document.createElement("strong");
        price.className = "sk-price";
        price.textContent = product.priceLabel;
        const stock = document.createElement("span");
        stock.className = "sk-product-card__stock";
        stock.textContent = `Disponible: ${product.stock} ${product.stock === 1 ? "unidad" : "unidades"}`;
        const action = document.createElement("button");
        action.className = `sk-button sk-button--${product.isLimited ? "secondary" : "primary"} sk-button--sm`;
        action.type = "button";
        action.textContent = product.isLimited ? "Iniciar sesión para comprar" : "Agregar";
        if (product.isLimited) {
            action.dataset.limitedPurchaseTrigger = "";
            action.dataset.limitedLockedLabel = "Iniciar sesión para comprar";
            action.dataset.limitedUnlockedLabel = "Agregar";
        }
        else {
            action.dataset.productAddTrigger = "";
        }
        bodyContent.append(title);
        if (product.description.length > 0) {
            bodyContent.append(description);
        }
        bodyContent.append(stock, price, action);
        card.append(media, favorite, bodyContent);
        return card;
    };
    const renderFavoritesPage = () => {
        const grid = document.querySelector("[data-favorites-grid]");
        const empty = document.querySelector("[data-favorites-empty]");
        if (!grid && !empty) {
            return;
        }
        const favorites = getStoredFavoriteItems();
        if (grid) {
            grid.replaceChildren(...favorites.map(createFavoriteProductCard));
        }
        empty?.classList.toggle("is-visible", favorites.length === 0);
        syncFavoriteToggles();
        syncLimitedPurchaseButtons();
    };
    const toggleFavoriteProduct = (product) => {
        if (product.name.length === 0 || product.price <= 0) {
            return;
        }
        const favorites = getStoredFavoriteItems();
        const nextFavorites = isFavoriteProduct(product, favorites)
            ? favorites.filter((item) => item.id !== product.id)
            : [...favorites, product];
        storeFavoriteItems(nextFavorites);
        updateFavoriteCounter();
        syncFavoriteToggles();
        renderFavoritesPage();
    };
    renderCartDrawer();
    updateFavoriteCounter();
    syncFavoriteToggles();
    renderFavoritesPage();
    const updateHeaderState = () => {
        document.querySelector("[data-navbar]")?.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    updateHeaderState();
    window.addEventListener("scroll", updateHeaderState, { passive: true });
    const getCarouselStep = (carousel) => {
        const track = carousel.querySelector("[data-carousel-track]");
        const slide = carousel.querySelector("[data-carousel-slide]");
        if (!track || !slide) {
            return 0;
        }
        const styles = window.getComputedStyle(track);
        const gap = Number.parseFloat(styles.columnGap || styles.gap || "0");
        return slide.getBoundingClientRect().width + gap;
    };
    const updateCarouselPagination = (carousel) => {
        const track = carousel.querySelector("[data-carousel-track]");
        const step = getCarouselStep(carousel);
        if (!track || step === 0) {
            return;
        }
        const index = Math.round(track.scrollLeft / step);
        carousel.querySelectorAll("[data-carousel-page]").forEach((button, buttonIndex) => {
            button.setAttribute("aria-current", String(buttonIndex === index));
        });
    };
    document.querySelectorAll("[data-carousel]").forEach((carousel) => {
        const track = carousel.querySelector("[data-carousel-track]");
        if (!track) {
            return;
        }
        let isDragging = false;
        let startX = 0;
        let startScroll = 0;
        let frame = 0;
        track.addEventListener("scroll", () => {
            window.cancelAnimationFrame(frame);
            frame = window.requestAnimationFrame(() => updateCarouselPagination(carousel));
        }, { passive: true });
        track.addEventListener("keydown", (event) => {
            const direction = event.key === "ArrowLeft" ? -1 : event.key === "ArrowRight" ? 1 : 0;
            if (direction === 0) {
                return;
            }
            event.preventDefault();
            track.scrollBy({ left: direction * getCarouselStep(carousel), behavior: "smooth" });
        });
        track.addEventListener("pointerdown", (event) => {
            if (event.button !== 0) {
                return;
            }
            isDragging = true;
            startX = event.clientX;
            startScroll = track.scrollLeft;
            track.classList.add("is-dragging");
            track.setPointerCapture(event.pointerId);
        });
        track.addEventListener("pointermove", (event) => {
            if (!isDragging) {
                return;
            }
            track.scrollLeft = startScroll - (event.clientX - startX);
        });
        track.addEventListener("pointerup", (event) => {
            isDragging = false;
            track.classList.remove("is-dragging");
            track.releasePointerCapture(event.pointerId);
            updateCarouselPagination(carousel);
        });
        track.addEventListener("pointercancel", () => {
            isDragging = false;
            track.classList.remove("is-dragging");
        });
        updateCarouselPagination(carousel);
    });
    document.addEventListener("click", (event) => {
        const target = event.target;
        const adminShell = document.querySelector("[data-admin-shell] .admin-shell");
        const adminSidebar = document.querySelector("[data-admin-sidebar]");
        const themeToggle = target.closest("[data-theme-toggle]");
        if (themeToggle) {
            applyTheme(root.dataset.theme === "dark" ? "light" : "dark");
        }
        const adminSidebarToggle = target.closest("[data-admin-sidebar-toggle]");
        if (adminSidebarToggle && adminShell) {
            const isCollapsed = adminShell.classList.toggle("is-sidebar-collapsed");
            adminSidebarToggle.setAttribute("aria-expanded", String(!isCollapsed));
        }
        const adminSidebarOpen = target.closest("[data-admin-sidebar-open]");
        if (adminSidebarOpen && adminShell) {
            adminShell.classList.add("is-sidebar-open");
            adminSidebarOpen.setAttribute("aria-expanded", "true");
            body.classList.add("is-scroll-locked");
            window.setTimeout(() => {
                getFocusableElements(adminSidebar || document).at(0)?.focus();
            }, 0);
        }
        if (target.closest("[data-admin-sidebar-overlay]") && adminShell) {
            adminShell.classList.remove("is-sidebar-open");
            document.querySelector("[data-admin-sidebar-open]")?.setAttribute("aria-expanded", "false");
            body.classList.remove("is-scroll-locked");
        }
        const adminPopoverTrigger = target.closest("[data-admin-popover-trigger]");
        if (adminPopoverTrigger) {
            const popover = adminPopoverTrigger.closest(".admin-popover");
            const isOpen = popover?.classList.contains("is-open") === true;
            document.querySelectorAll(".admin-popover.is-open").forEach((openPopover) => {
                if (openPopover !== popover) {
                    openPopover.classList.remove("is-open");
                    openPopover.querySelector("[data-admin-popover-trigger]")?.setAttribute("aria-expanded", "false");
                }
            });
            popover?.classList.toggle("is-open", !isOpen);
            adminPopoverTrigger.setAttribute("aria-expanded", String(!isOpen));
        }
        else if (!target.closest(".admin-popover")) {
            document.querySelectorAll(".admin-popover.is-open").forEach((openPopover) => {
                openPopover.classList.remove("is-open");
                openPopover.querySelector("[data-admin-popover-trigger]")?.setAttribute("aria-expanded", "false");
            });
        }
        const favoriteToggle = target.closest("[data-favorite-toggle]");
        if (favoriteToggle) {
            const productCard = favoriteToggle.closest("[data-product-card]");
            if (productCard) {
                toggleFavoriteProduct(getCatalogProductData(productCard));
            }
        }
        const cartRemove = target.closest("[data-cart-remove]");
        if (cartRemove) {
            removeCartItem(cartRemove.dataset.cartRemove || "");
        }
        const productDetailTrigger = target.closest("[data-product-detail-trigger]");
        if (productDetailTrigger) {
            const productCard = productDetailTrigger.closest("[data-product-card]");
            if (productCard) {
                openCatalogProductDetail(productCard);
            }
        }
        const carouselDot = target.closest("[data-limited-carousel-dot]");
        if (carouselDot) {
            const carousel = carouselDot.closest("[data-limited-carousel]");
            if (carousel) {
                setLimitedCarouselSlide(carousel, Number(carouselDot.dataset.limitedCarouselDot || 0));
            }
        }
        const limitedPurchaseTrigger = target.closest("[data-limited-purchase-trigger]");
        if (limitedPurchaseTrigger) {
            if (!isUserAuthenticated()) {
                openLimitedAccessDialog();
                return;
            }
            const productCard = limitedPurchaseTrigger.closest("[data-product-card]");
            if (productCard) {
                openCatalogAddDialog(getCatalogProductData(productCard), limitedPurchaseTrigger);
            }
        }
        const productAddTrigger = target.closest("[data-product-add-trigger]");
        if (productAddTrigger) {
            const productCard = productAddTrigger.closest("[data-product-card]");
            if (productCard) {
                openCatalogAddDialog(getCatalogProductData(productCard), productAddTrigger);
            }
        }
        const productDetailAdd = target.closest("[data-product-detail-add]");
        if (productDetailAdd && activeCatalogProduct) {
            openCatalogAddDialog(activeCatalogProduct, activeCatalogAddButton);
        }
        const optionChoice = target.closest(".product-option__choice");
        if (optionChoice) {
            optionChoice.parentElement?.querySelectorAll(".product-option__choice").forEach((choice) => {
                choice.setAttribute("aria-pressed", String(choice === optionChoice));
            });
        }
        const galleryThumb = target.closest("[data-gallery-thumb]");
        if (galleryThumb) {
            const gallery = galleryThumb.closest(".product-gallery");
            const mainImage = gallery?.querySelector("[data-gallery-main]");
            const thumbImage = galleryThumb.querySelector("img");
            gallery?.querySelectorAll("[data-gallery-thumb]").forEach((thumb) => {
                thumb.setAttribute("aria-current", String(thumb === galleryThumb));
            });
            if (mainImage && thumbImage) {
                mainImage.style.opacity = "0";
                window.setTimeout(() => {
                    mainImage.setAttribute("src", thumbImage.getAttribute("src") || "");
                    mainImage.style.opacity = "";
                }, 140);
            }
        }
        const passwordToggle = target.closest("[data-password-toggle]");
        if (passwordToggle) {
            const field = passwordToggle.closest("[data-password-field], .sk-password-field");
            const input = field?.querySelector("[data-password-input]");
            const icon = passwordToggle.querySelector("[data-icon]");
            const shouldShow = input?.getAttribute("type") === "password";
            input?.setAttribute("type", shouldShow ? "text" : "password");
            passwordToggle.setAttribute("aria-label", shouldShow ? "Ocultar contraseña" : "Mostrar contraseña");
            if (icon) {
                icon.dataset.icon = shouldShow ? "eye-off" : "eye";
                icon.innerHTML = iconMap[icon.dataset.icon] || "";
            }
        }
        const drawerOpen = target.closest("[data-drawer-open]");
        if (drawerOpen) {
            event.preventDefault();
            const drawer = document.getElementById(drawerOpen.dataset.drawerOpen);
            activeDrawerTrigger = drawerOpen;
            drawer?.classList.add("is-open");
            drawer?.setAttribute("aria-hidden", "false");
            drawerOpen.setAttribute("aria-expanded", "true");
            body.classList.add("is-scroll-locked");
            window.setTimeout(() => {
                getFocusableElements(drawer || document).at(0)?.focus();
            }, 0);
        }
        if (target.closest("[data-drawer-close]")) {
            const drawer = target.closest("[data-drawer]");
            closeDrawer(drawer);
        }
        const openDrawer = target.closest("[data-drawer].is-open");
        if (openDrawer && event.target === openDrawer) {
            closeDrawer(openDrawer);
        }
        const modalOpen = target.closest("[data-modal-open]");
        if (modalOpen) {
            document.getElementById(modalOpen.dataset.modalOpen)?.showModal();
        }
        if (target.closest("[data-modal-close]")) {
            target.closest("[data-modal]")?.close();
        }
        const quantity = target.closest("[data-quantity-selector]");
        if (quantity) {
            const input = quantity.querySelector("[data-quantity-input]");
            const min = Number(input.min || 1);
            const max = Number(input.max || 99);
            const current = Number(input.value || min);
            if (target.closest("[data-quantity-decrease]")) {
                input.value = Math.max(min, current - 1);
            }
            if (target.closest("[data-quantity-increase]")) {
                input.value = Math.min(max, current + 1);
            }
            if (input.dataset.cartItemQuantity) {
                updateCartItemQuantity(input.dataset.cartItemQuantity, Number(input.value || min));
            }
        }
        const carousel = target.closest("[data-carousel]");
        if (carousel) {
            const track = carousel.querySelector("[data-carousel-track]");
            const page = target.closest("[data-carousel-page]");
            const direction = target.closest("[data-carousel-prev]") ? -1 : target.closest("[data-carousel-next]") ? 1 : 0;
            if (page && track) {
                track.scrollTo({ left: Number(page.dataset.carouselPage) * getCarouselStep(carousel), behavior: "smooth" });
            }
            if (direction !== 0 && track) {
                track.scrollBy({ left: direction * getCarouselStep(carousel), behavior: "smooth" });
            }
        }
    });
    document.addEventListener("change", (event) => {
        const input = event.target.closest("[data-cart-item-quantity]");
        if (!input) {
            return;
        }
        const min = Number(input.min || 1);
        const max = Number(input.max || 12);
        const requested = Number(input.value || min);
        const quantity = Math.min(max, Math.max(min, Number.isNaN(requested) ? min : requested));
        input.value = String(quantity);
        updateCartItemQuantity(input.dataset.cartItemQuantity || "", quantity);
    });
    document.querySelector("[data-product-add-form]")?.addEventListener("submit", (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const modal = form.closest("[data-product-add-modal]");
        const quantityInput = form.querySelector("[data-product-add-quantity]");
        const min = Number(quantityInput?.min || 1);
        const max = Number(quantityInput?.max || 12);
        const requested = Number(quantityInput?.value || min);
        const quantity = Math.min(max, Math.max(min, Number.isNaN(requested) ? min : requested));
        if (quantityInput) {
            quantityInput.value = String(quantity);
        }
        if (activeCatalogProduct) {
            const addedQuantity = storeCatalogCartItem(activeCatalogProduct, quantity);
            if (activeCatalogAddButton) {
                activeCatalogAddButton.textContent = addedQuantity > 0 ? `Agregado x${addedQuantity}` : "Limite alcanzado";
                activeCatalogAddButton.dataset.selectedQuantity = String(addedQuantity);
                activeCatalogAddButton.setAttribute("aria-label", addedQuantity > 0
                    ? `${activeCatalogProduct.name} agregado, cantidad ${addedQuantity}`
                    : `${activeCatalogProduct.name} ya alcanzo el limite permitido`);
            }
        }
        modal?.close();
    });
    document.addEventListener("keydown", (event) => {
        const openDrawer = document.querySelector("[data-drawer].is-open");
        if (event.key === "Tab" && openDrawer) {
            const focusable = getFocusableElements(openDrawer);
            const first = focusable.at(0);
            const last = focusable.at(-1);
            if (!first || !last) {
                return;
            }
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            }
            else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        }
        if (event.key === "Escape") {
            document.querySelectorAll("[data-drawer].is-open").forEach((drawer) => {
                closeDrawer(drawer);
            });
            document.querySelectorAll(".admin-popover.is-open").forEach((popover) => {
                popover.classList.remove("is-open");
                popover.querySelector("[data-admin-popover-trigger]")?.setAttribute("aria-expanded", "false");
            });
            const adminShell = document.querySelector("[data-admin-shell] .admin-shell");
            if (adminShell?.classList.contains("is-sidebar-open")) {
                adminShell.classList.remove("is-sidebar-open");
                document.querySelector("[data-admin-sidebar-open]")?.setAttribute("aria-expanded", "false");
                body.classList.remove("is-scroll-locked");
            }
        }
    });
})();
