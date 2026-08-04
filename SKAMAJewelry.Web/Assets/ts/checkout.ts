(() => {
    type CheckoutField = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

    type CheckoutProduct = {
        name: string;
        quantity: number;
        price: number;
        image?: string;
        imageAlt?: string;
    };

    const form = document.querySelector<HTMLFormElement>("[data-checkout-form]");
    const submit = document.querySelector<HTMLAnchorElement>("[data-whatsapp-submit]");
    const output = document.querySelector<HTMLTextAreaElement>("[data-whatsapp-message]");
    const validation = document.querySelector<HTMLElement>("[data-checkout-validation]");
    const productContainer = document.querySelector<HTMLElement>("[data-checkout-products]");
    const totalElement = document.querySelector<HTMLElement>("[data-checkout-total]");
    const cartStorageKey = "skama-cart";

    if (!form || !submit || !output || !validation) {
        return;
    }

    const requiredFields = Array.from(form.querySelectorAll<CheckoutField>("[data-required]"));
    const paymentOptions = Array.from(form.querySelectorAll<HTMLInputElement>("input[name='payment']"));
    const phoneDestination = form.dataset.whatsappPhone || "50600000000";
    const currency = new Intl.NumberFormat("es-CR");

    const getNamedField = (name: string): Element | RadioNodeList | null => form.elements.namedItem(name);

    const getValue = (name: string): string => {
        const field = getNamedField(name);
        if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement) {
            return field.value.trim();
        }

        return "";
    };

    const getCustomerName = (): string => {
        return [getValue("firstName"), getValue("lastName")]
            .filter((value) => value.length > 0)
            .join(" ");
    };

    const getProductsFromMarkup = (): CheckoutProduct[] => Array.from(document.querySelectorAll<HTMLElement>("[data-product-name]")).map((row) => ({
        name: row.dataset.productName || "",
        quantity: Number(row.dataset.productQuantity || 1),
        price: Number(row.dataset.productPrice || 0)
    }));

    const getProductsFromStorage = (): CheckoutProduct[] => {
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
        } catch {
            return [];
        }
    };

    const getPayment = (): string => paymentOptions.find((option) => option.checked)?.value || "";

    let products = getProductsFromStorage();
    if (products.length === 0) {
        products = getProductsFromMarkup();
    }

    const getProducts = (): CheckoutProduct[] => products;

    const formatPrice = (value: number): string => `CRC ${currency.format(value)}`;

    const renderProducts = (): void => {
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
            quantity.textContent = `Cantidad ${product.quantity}`;
            copy.append(name, quantity);

            const price = document.createElement("strong");
            price.className = "sk-price";
            price.textContent = formatPrice(product.price * product.quantity);

            row.append(image, copy, price);
            productContainer.append(row);
        });
    };

    const updateTotal = (): void => {
        const total = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
        if (totalElement) {
            totalElement.textContent = formatPrice(total);
        }
    };

    const isComplete = (): boolean => requiredFields.every((field) => field.value.trim().length > 0) && getPayment().length > 0;

    const buildMessage = (): string => {
        const products = getProducts();
        const total = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
        const giftField = getNamedField("isGift");
        const gift = giftField instanceof HTMLInputElement && giftField.checked ? "Si" : "No";
        const dedication = getValue("giftMessage") || "No aplica";
        const productLines = products.map((product) => `- ${product.name} x${product.quantity} - CRC ${currency.format(product.price * product.quantity)}`);

        return [
            "Pedido SKAMA Jewelry",
            "",
            `Cliente: ${getCustomerName() || "[pendiente]"}`,
            `Correo: ${getValue("email") || "[pendiente]"}`,
            `Teléfono: ${getValue("phone") || "[pendiente]"}`,
            `Tipo de entrega: ${getValue("deliveryType") || "[pendiente]"}`,
            `Dirección: ${getValue("address") || "[pendiente]"}`,
            `Método de pago: ${getPayment() || "[pendiente]"}`,
            `Es regalo: ${gift}`,
            `Dedicatoria: ${dedication}`,
            "",
            "Productos:",
            ...productLines,
            "",
            `Total: ${formatPrice(total)}`,
            "Estado: Pendiente"
        ].join("\n");
    };

    const updateCheckout = (): void => {
        const complete = isComplete();
        const message = buildMessage();

        output.value = message;
        submit.href = complete ? `https://wa.me/${phoneDestination}?text=${encodeURIComponent(message)}` : "#";
        submit.setAttribute("aria-disabled", String(!complete));
        submit.tabIndex = complete ? 0 : -1;
        validation.dataset.state = complete ? "valid" : "invalid";
        validation.textContent = complete
            ? "Datos completos. El pedido se enviará con formato legible para WhatsApp."
            : "Por favor, completa todos los datos de entrega y selecciona un método de pago.";
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
