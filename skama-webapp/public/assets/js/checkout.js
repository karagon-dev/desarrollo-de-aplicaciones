"use strict";
(() => {
    const form = document.querySelector("[data-checkout-form]");
    const submit = document.querySelector("[data-whatsapp-submit]");
    const output = document.querySelector("[data-whatsapp-message]");
    const validation = document.querySelector("[data-checkout-validation]");
    const productContainer = document.querySelector("[data-checkout-products]");
    const totalElement = document.querySelector("[data-checkout-total]");
    const cartStorageKey = "skama-cart";
    if (!form || !submit || !output || !validation) {
        return;
    }
    const requiredFields = Array.from(form.querySelectorAll("[data-required]"));
    const paymentOptions = Array.from(form.querySelectorAll("input[name='payment']"));
    const phoneDestination = form.dataset.whatsappPhone || "50600000000";
    const currency = new Intl.NumberFormat("es-CR");
    const getNamedField = (name) => form.elements.namedItem(name);
    const getValue = (name) => {
        const field = getNamedField(name);
        if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement) {
            return field.value.trim();
        }
        return "";
    };
    const getCustomerName = () => {
        return [getValue("firstName"), getValue("lastName")]
            .filter((value) => value.length > 0)
            .join(" ");
    };
    const getProductsFromMarkup = () => Array.from(document.querySelectorAll("[data-product-name]")).map((row) => ({
        name: row.dataset.productName || "",
        quantity: Number(row.dataset.productQuantity || 1),
        price: Number(row.dataset.productPrice || 0)
    }));
    const getProductsFromStorage = () => {
        try {
            const parsed = JSON.parse(localStorage.getItem(cartStorageKey) || "[]");
            if (!Array.isArray(parsed)) {
                return [];
            }
            return parsed
                .map((item) => ({
                name: typeof item.name === "string" ? item.name : "",
                quantity: Number(item.quantity || 1),
                price: Number(item.price || 0),
                image: typeof item.image === "string" ? item.image : "",
                imageAlt: typeof item.imageAlt === "string" ? item.imageAlt : ""
            }))
                .filter((item) => item.name.length > 0 && item.price > 0);
        }
        catch {
            return [];
        }
    };
    const getPayment = () => paymentOptions.find((option) => option.checked)?.value || "";
    let products = getProductsFromStorage();
    if (products.length === 0) {
        products = getProductsFromMarkup();
    }
    const getProducts = () => products;
    const formatPrice = (value) => `CRC ${currency.format(value)}`;
    const renderProducts = () => {
        if (!productContainer || products.length === 0 || getProductsFromStorage().length === 0) {
            return;
        }
        productContainer.textContent = "";
        products.forEach((product) => {
            const row = document.createElement("article");
            row.className = "checkout-product";
            row.dataset.productName = product.name;
            row.dataset.productQuantity = String(product.quantity);
            row.dataset.productPrice = String(product.price);
            const image = document.createElement("img");
            image.src = product.image || "";
            image.alt = product.imageAlt || product.name;
            image.loading = "lazy";
            image.decoding = "async";
            const copy = document.createElement("div");
            const name = document.createElement("p");
            const quantity = document.createElement("span");
            name.textContent = product.name;
            quantity.textContent = `Quantity ${product.quantity}`;
            copy.append(name, quantity);
            const price = document.createElement("strong");
            price.className = "sk-price";
            price.textContent = formatPrice(product.price * product.quantity);
            row.append(image, copy, price);
            productContainer.append(row);
        });
    };
    const updateTotal = () => {
        const total = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
        if (totalElement) {
            totalElement.textContent = formatPrice(total);
        }
    };
    const isComplete = () => requiredFields.every((field) => field.value.trim().length > 0) && getPayment().length > 0;
    const buildMessage = () => {
        const products = getProducts();
        const total = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
        const giftField = getNamedField("isGift");
        const gift = giftField instanceof HTMLInputElement && giftField.checked ? "Si" : "No";
        const dedication = getValue("giftMessage") || "No aplica";
        const productLines = products.map((product) => `- ${product.name} x${product.quantity} - CRC ${currency.format(product.price * product.quantity)}`);
        return [
            "Order SKAMA Jewelry",
            "",
            `Cliente: ${getCustomerName() || "[pendiente]"}`,
            `Email: ${getValue("email") || "[pendiente]"}`,
            `Phone: ${getValue("phone") || "[pendiente]"}`,
            `Delivery type: ${getValue("deliveryType") || "[pendiente]"}`,
            `Address: ${getValue("address") || "[pendiente]"}`,
            `Payment method: ${getPayment() || "[pendiente]"}`,
            `Gift: ${gift}`,
            `Dedication: ${dedication}`,
            "",
            "Products:",
            ...productLines,
            "",
            `Total: ${formatPrice(total)}`,
            "Status: Pending"
        ].join("\n");
    };
    const updateCheckout = () => {
        const complete = isComplete();
        const message = buildMessage();
        output.value = message;
        submit.href = complete ? `https://wa.me/${phoneDestination}?text=${encodeURIComponent(message)}` : "#";
        submit.setAttribute("aria-disabled", String(!complete));
        submit.tabIndex = complete ? 0 : -1;
        validation.dataset.state = complete ? "valid" : "invalid";
        validation.textContent = complete
            ? "Details complete. The order will be sent in a readable WhatsApp format."
            : "Please complete all delivery details and select a payment method.";
    };
    form.addEventListener("input", updateCheckout);
    form.addEventListener("change", updateCheckout);
    submit.addEventListener("click", (event) => {
        if (submit.getAttribute("aria-disabled") === "true") {
            event.preventDefault();
            validation.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    });
    renderProducts();
    updateTotal();
    updateCheckout();
})();
