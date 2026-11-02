/* =====================================
   Natures' Garden - site scripts
   One DOMContentLoaded listener; each feature
   exits quietly if its elements aren't on the page.
===================================== */

document.addEventListener("DOMContentLoaded", function () {
    initContactForm();
    initFaq();
    initProfileForm();
    initOrderForm();
    initLightbox();
});

/* =====================================
   CONTACT FORM
===================================== */
function initContactForm() {
    const contactForm = document.getElementById("contactForm");
    if (!contactForm) return;

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const subjectInput = document.getElementById("subject");
    const messageInput = document.getElementById("message");
    const formMessage = document.getElementById("formMessage");
    const submitBtn = contactForm.querySelector("button[type='submit']");

    const invalidNameChars = /[^A-Za-zÀ-ÖØ-öø-ÿ\s'-]/g;
    const validNamePattern = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // ---------- Helpers ----------
    function createError(input) {
        const el = document.createElement("small");
        el.className = "field-error";
        input.insertAdjacentElement("afterend", el);
        return el;
    }

    function showError(message) {
        formMessage.textContent = message;
        formMessage.style.color = "#B00020";
        contactForm.classList.remove("shake");
        void contactForm.offsetWidth; // restart the animation
        contactForm.classList.add("shake");
    }

    contactForm.addEventListener("animationend", function (e) {
        if (e.animationName === "shake") contactForm.classList.remove("shake");
    });

    // ---------- Live name validation ----------
    const nameError = createError(nameInput);
    let nameTimer;

    nameInput.addEventListener("input", function () {
        const cleaned = this.value.replace(invalidNameChars, "");
        if (cleaned !== this.value) {
            this.value = cleaned;
            nameError.textContent = "Numbers and symbols aren't allowed. Please use letters only.";
            clearTimeout(nameTimer);
            nameTimer = setTimeout(() => (nameError.textContent = ""), 3000);
        } else {
            clearTimeout(nameTimer);
            nameError.textContent = "";
        }
    });

    // ---------- Live email validation ----------
    const emailError = createError(emailInput);

    function checkEmail() {
        const value = emailInput.value.trim();
        if (value === "") {
            emailError.textContent = "";
        } else if (!value.includes("@")) {
            emailError.textContent = "Email must include an @ symbol.";
        } else if (!emailPattern.test(value)) {
            emailError.textContent = "Please enter a full email address, e.g. name@example.com.";
        } else {
            emailError.textContent = "";
        }
    }

    emailInput.addEventListener("input", checkEmail);
    emailInput.addEventListener("blur", checkEmail);

    // ---------- Success effects ----------
    function showSuccess(name) {
        formMessage.style.color = "";
        formMessage.innerHTML =
            '<div class="success-box">' +
            '<svg class="checkmark" viewBox="0 0 36 36">' +
            '<circle cx="18" cy="18" r="15"/>' +
            '<path d="M10 19 L16 25 L26 12"/>' +
            "</svg><span></span></div>";
        // textContent keeps the name safe
        formMessage.querySelector("span").textContent =
            "Thank you, " + name + "! Your enquiry has been sent.";
    }

    function morphButton() {
        if (!submitBtn) return;
        const originalHTML = submitBtn.innerHTML;
        submitBtn.classList.add("sent");
        submitBtn.innerHTML = "Sent ✓";
        submitBtn.disabled = true;

        setTimeout(function () {
            submitBtn.classList.remove("sent");
            submitBtn.innerHTML = originalHTML;
            submitBtn.disabled = false;
        }, 3000);
    }

    function launchLeaves() {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        for (let i = 0; i < 20; i++) {
            const leaf = document.createElement("span");
            leaf.className = "leaf";
            leaf.textContent = "🍃";
            leaf.style.left = Math.random() * 100 + "vw";
            leaf.style.fontSize = 16 + Math.random() * 16 + "px";
            leaf.style.animationDuration = 2 + Math.random() * 2 + "s";
            document.body.appendChild(leaf);
            setTimeout(() => leaf.remove(), 4500);
        }
    }

    // ---------- Submit validation ----------
    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const subject = subjectInput.value;
        const message = messageInput.value.trim();

        if (!name || !email || !subject || !message) {
            showError("Please complete all fields.");
            return;
        }

        if (!validNamePattern.test(name)) {
            showError("Name can only contain letters.");
            return;
        }

        if (!email.includes("@")) {
            showError("Email must include an @ symbol.");
            return;
        }

        if (!emailPattern.test(email)) {
            showError("Please enter a full email address, e.g. name@example.com.");
            return;
        }

        // Values are already read, so reset first. The reset handler clears
        // formMessage, so the success message must be shown AFTER it.
        contactForm.reset();
        nameError.textContent = "";
        emailError.textContent = "";

        showSuccess(name);
        morphButton();
        launchLeaves();
    });

    // ---------- Clear button ----------
    contactForm.addEventListener("reset", function () {
        nameError.textContent = "";
        emailError.textContent = "";
        formMessage.textContent = "";
    });
}

/* =====================================
   FAQ ACCORDION
===================================== */
function initFaq() {
    const faqQuestions = document.querySelectorAll(".faq-question");

    faqQuestions.forEach(function (question) {
        question.addEventListener("click", function () {
            const isExpanded = question.getAttribute("aria-expanded") === "true";
            const answer = document.getElementById(question.getAttribute("aria-controls"));

            // Close all FAQ answers
            faqQuestions.forEach(function (otherQuestion) {
                const otherAnswer = document.getElementById(
                    otherQuestion.getAttribute("aria-controls")
                );
                otherQuestion.setAttribute("aria-expanded", "false");
                if (otherAnswer) otherAnswer.hidden = true;
            });

            // Open the selected answer if it was previously closed
            if (!isExpanded && answer) {
                question.setAttribute("aria-expanded", "true");
                answer.hidden = false;
            }
        });
    });
}

/* =====================================
   PROFILE FORM
===================================== */
function initProfileForm() {
    const profileForm = document.getElementById("profileForm");
    if (!profileForm) return;

    profileForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        console.log("Username:", formData.get("username"));
        console.log("Email:", formData.get("email"));
        console.log(Object.fromEntries(formData.entries()));
    });
}

/* =====================================
   ORDER FORM
===================================== */
function initOrderForm() {
    const form = document.getElementById("orderForm");
    if (!form) return;

    const productSelect = document.getElementById("orderProduct");
    const quantityInput = document.getElementById("orderQuantity");
    const totalDisplay = document.getElementById("orderTotal");
    const fulfilmentSelect = document.getElementById("fulfilment");
    const addressGroup = document.getElementById("deliveryAddressGroup");
    const addressInput = document.getElementById("deliveryAddress");
    const messageBox = document.getElementById("orderMessage");
    const successBox = document.getElementById("orderSuccess");

    // Product catalogue (prices in Rand)
    const PRODUCTS = {
        tea: { name: "Herbal Tea", price: 80 },
        gummies: { name: "Herbal Gummies", price: 120 },
        collagen: { name: "Collagen Powder", price: 150 }
    };

    const formatRand = (amount) =>
        "R" + amount.toLocaleString("en-ZA", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).replace(/\u00a0/g, " ");

    const getQuantity = () => {
        const qty = parseInt(quantityInput.value, 10);
        return Number.isNaN(qty) ? 0 : qty;
    };

    // ---------- Total ----------
    function updateTotal() {
        const product = PRODUCTS[productSelect.value];
        const qty = getQuantity();
        const total = product && qty > 0 ? product.price * qty : 0;
        totalDisplay.textContent = formatRand(total);
        return total;
    }

    // ---------- Delivery / Collection ----------
    function updateFulfilment() {
        const isDelivery = fulfilmentSelect.value === "delivery";
        addressGroup.hidden = !isDelivery;
        addressInput.required = isDelivery;
        if (!isDelivery) addressInput.value = "";
    }

    // ---------- Messages ----------
    function showMessage(text, type) {
        messageBox.textContent = text;
        messageBox.className = type || "";
        messageBox.style.color = type === "error" ? "#b3261e" : "#2e7d32";
    }

    function clearMessage() {
        messageBox.textContent = "";
        messageBox.className = "";
    }

    // ---------- Validation ----------
    function validate() {
        const errors = [];
        const name = form.customerName.value.trim();
        const email = form.customerEmail.value.trim();
        const phone = form.customerPhone.value.trim();
        const qty = getQuantity();

        if (name.length < 2) {
            errors.push("Please enter your full name.");
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
            errors.push("Please enter a valid email address.");
        }

        // South African numbers: 0821234567, 082 123 4567, +27 82 123 4567
        const digits = phone.replace(/[\s\-()]/g, "");
        if (!/^(\+27|0)\d{9}$/.test(digits)) {
            errors.push("Please enter a valid contact number (e.g. 082 123 4567).");
        }

        if (!PRODUCTS[productSelect.value]) {
            errors.push("Please select a product.");
        }

        if (qty < 1 || qty > 99) {
            errors.push("Quantity must be between 1 and 99.");
        }

        if (!fulfilmentSelect.value) {
            errors.push("Please choose delivery or collection.");
        } else if (
            fulfilmentSelect.value === "delivery" &&
            addressInput.value.trim().length < 10
        ) {
            errors.push("Please enter a full delivery address.");
        }

        return errors;
    }

    // ---------- Confirmation summary ----------
    function buildSummary() {
        const product = PRODUCTS[productSelect.value];
        const qty = getQuantity();

        const lines = [
            ["Name", form.customerName.value.trim()],
            ["Email", form.customerEmail.value.trim()],
            ["Phone", form.customerPhone.value.trim()],
            ["Product", product.name + " x " + qty],
            ["Product total", formatRand(product.price * qty)],
            ["Method", fulfilmentSelect.value === "delivery" ? "Delivery" : "Collection"]
        ];

        if (fulfilmentSelect.value === "delivery") {
            lines.push(["Address", addressInput.value.trim()]);
        }

        const notes = form.orderNotes ? form.orderNotes.value.trim() : "";
        if (notes) lines.push(["Notes", notes]);

        // Built with textContent so user input is never treated as HTML
        const list = document.createElement("ul");
        list.id = "orderSummary";
        lines.forEach(([label, value]) => {
            const li = document.createElement("li");
            const strong = document.createElement("strong");
            strong.textContent = label + ": ";
            li.appendChild(strong);
            li.appendChild(document.createTextNode(value));
            list.appendChild(li);
        });
        return list;
    }

    // ---------- Events ----------
    productSelect.addEventListener("change", updateTotal);
    quantityInput.addEventListener("input", updateTotal);
    quantityInput.addEventListener("blur", () => {
        // Keep quantity within allowed range
        let qty = getQuantity();
        if (qty < 1) qty = 1;
        if (qty > 99) qty = 99;
        quantityInput.value = qty;
        updateTotal();
    });
    fulfilmentSelect.addEventListener("change", updateFulfilment);

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        successBox.hidden = true;

        const errors = validate();
        if (errors.length > 0) {
            showMessage(errors.join(" "), "error");
            return;
        }

        // Build the summary before the form is cleared
        const summary = buildSummary();
        form.reset(); // the reset listener below tidies up the total and address box

        // Replace any previous summary, then show the new one
        const oldSummary = document.getElementById("orderSummary");
        if (oldSummary) oldSummary.remove();

        const heading = successBox.querySelector("h2");
        if (heading) {
            heading.insertAdjacentElement("afterend", summary);
        } else {
            successBox.prepend(summary);
        }

        clearMessage();
        successBox.hidden = false;
        successBox.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    form.addEventListener("reset", () => {
        // Wait for the browser to restore default values first
        setTimeout(() => {
            updateTotal();
            updateFulfilment();
        }, 0);
        clearMessage();
        successBox.hidden = true;
    });

    // Initial state
    updateTotal();
    updateFulfilment();
}

/* =====================================
   LIGHTBOX (gallery items and product card images)
   Needs: #lightbox, #lightboxImage, #lightboxCaption, #closeLightbox
   Optional: .prev-btn and .next-btn inside #lightbox
===================================== */
function initLightbox() {
    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightboxImage");
    const lightboxCaption = document.getElementById("lightboxCaption");
    const closeBtn = document.getElementById("closeLightbox");

    // Stop safely if this page has no lightbox
    if (!lightbox || !lightboxImage || !lightboxCaption || !closeBtn) return;

    const items = Array.from(document.querySelectorAll(".gallery-item, .product-card img"));
    if (items.length === 0) return;

    const prevBtn = lightbox.querySelector(".prev-btn");
    const nextBtn = lightbox.querySelector(".next-btn");

    let currentIndex = 0;
    let lastFocused = null;

    function getImg(item) {
        return item.matches("img") ? item : item.querySelector("img");
    }

    function getCaption(item, img) {
        const span = item.querySelector("span");
        if (span) return span.textContent.trim();

        const card = item.closest(".product-card");
        const heading = card && card.querySelector("h2");
        if (heading) return heading.textContent.trim();

        return img.alt || "";
    }

    function showImage(index) {
        currentIndex = (index + items.length) % items.length; // loops both ways
        const item = items[currentIndex];
        const img = getImg(item);
        if (!img) return;

        lightboxImage.src = item.dataset.full || img.dataset.full || img.src;
        lightboxImage.alt = item.dataset.alt || img.alt;
        lightboxCaption.textContent = getCaption(item, img);
    }

    function openLightbox(index) {
        lastFocused = items[index];
        showImage(index);
        lightbox.hidden = false;
        document.body.classList.add("no-scroll");
        closeBtn.focus();
    }

    function closeLightbox() {
        lightbox.hidden = true;
        lightboxImage.src = "";
        document.body.classList.remove("no-scroll");
        if (lastFocused) lastFocused.focus();
    }

    // Open on click
    items.forEach(function (item, index) {
        if (item.matches("img")) item.style.cursor = "zoom-in";
        item.addEventListener("click", function (event) {
            event.preventDefault();
            openLightbox(index);
        });
    });

    // Close button and dark background
    closeBtn.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", function (event) {
        if (event.target === lightbox) closeLightbox();
    });

    // Previous / next (only if those buttons exist)
    if (prevBtn) {
        prevBtn.addEventListener("click", function (event) {
            event.stopPropagation();
            showImage(currentIndex - 1);
        });
    }
    if (nextBtn) {
        nextBtn.addEventListener("click", function (event) {
            event.stopPropagation();
            showImage(currentIndex + 1);
        });
    }

    // Keyboard: Escape closes, arrows navigate
    document.addEventListener("keydown", function (event) {
        if (lightbox.hidden) return;
        if (event.key === "Escape") closeLightbox();
        if (event.key === "ArrowRight") showImage(currentIndex + 1);
        if (event.key === "ArrowLeft") showImage(currentIndex - 1);
    });
}

/* =====================================
   NATURES' GARDEN SHOPPING FEATURES
===================================== */

/* =====================================
   NATURES' GARDEN SHOPPING FEATURES
===================================== */

document.addEventListener("DOMContentLoaded", function () {

    const cards = Array.from(document.querySelectorAll(".product-card"));

    const categoryFilter = document.getElementById("categoryFilter");
    const priceSort = document.getElementById("priceSort");

    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");
    const cartEmpty = document.getElementById("cartEmpty");
    const cartMessage = document.getElementById("cartMessage");
    const clearCart = document.getElementById("clearCart");
    const checkoutButton = document.getElementById("checkoutButton");

    if (!categoryFilter || !priceSort || !cartItems) return;

    // PRODUCT INFORMATION
    const products = cards.map(function (card, index) {
        return {
            id: index,
            name: card.dataset.name,
            price: Number(card.dataset.price),
            category: card.dataset.category
        };
    });

    const cart = {};

    function money(amount) {
        return "R" + amount.toFixed(2);
    }

    // FILTER PRODUCTS
    function filterProducts() {
        const selected = categoryFilter.value;

        cards.forEach(function (card) {
            const matches =
                selected === "all" ||
                card.dataset.category === selected;

            card.hidden = !matches;
        });
    }

    categoryFilter.addEventListener("change", filterProducts);

    // SORT PRODUCTS
    cards.forEach(function (card, index) {
        card.dataset.originalOrder = index;
    });

    priceSort.addEventListener("change", function () {
        const mode = priceSort.value;

        const sortedCards = [...cards].sort(function (a, b) {
            const priceA = Number(a.dataset.price);
            const priceB = Number(b.dataset.price);

            const nameA = a.dataset.name.toLowerCase();
            const nameB = b.dataset.name.toLowerCase();

            if (mode === "low-high") return priceA - priceB;
            if (mode === "high-low") return priceB - priceA;
            if (mode === "name") return nameA.localeCompare(nameB);

            return Number(a.dataset.originalOrder) -
                Number(b.dataset.originalOrder);
        });

        sortedCards.forEach(function (card) {
            card.parentElement.appendChild(card);
        });
    });

    // ADD TO CART
    cards.forEach(function (card, index) {
        const button = card.querySelector(".add-to-cart");

        if (!button) return;

        button.addEventListener("click", function () {
            cart[index] = (cart[index] || 0) + 1;

            cartMessage.textContent =
                products[index].name + " added to your cart.";

            renderCart();
        });
    });

    // DISPLAY CART
    function renderCart() {
        cartItems.replaceChildren();

        let total = 0;
        let itemCount = 0;

        products.forEach(function (product) {
            const quantity = cart[product.id] || 0;

            if (quantity === 0) return;

            total += product.price * quantity;
            itemCount += quantity;

            const li = document.createElement("li");
            li.className = "cart-item";

            const productInfo = document.createElement("span");
            productInfo.textContent =
                product.name + " - " + money(product.price) + " each";

            // DECREASE QUANTITY
            const decreaseButton = document.createElement("button");
            decreaseButton.type = "button";
            decreaseButton.textContent = "−";
            decreaseButton.className = "quantity-btn";

            decreaseButton.addEventListener("click", function () {
                if (cart[product.id] > 1) {
                    cart[product.id]--;
                } else {
                    delete cart[product.id];
                }

                renderCart();
            });

            // QUANTITY INPUT
            const quantityInput = document.createElement("input");
            quantityInput.type = "number";
            quantityInput.min = "1";
            quantityInput.max = "99";
            quantityInput.value = quantity;
            quantityInput.className = "cart-quantity";

            quantityInput.addEventListener("change", function () {
                const value = Number(quantityInput.value);

                if (!Number.isInteger(value) || value < 1 || value > 99) {
                    cartMessage.textContent =
                        "Quantity must be between 1 and 99.";
                    renderCart();
                    return;
                }

                cart[product.id] = value;
                cartMessage.textContent = "";
                renderCart();
            });

            // INCREASE QUANTITY
            const increaseButton = document.createElement("button");
            increaseButton.type = "button";
            increaseButton.textContent = "+";
            increaseButton.className = "quantity-btn";

            increaseButton.addEventListener("click", function () {
                if (cart[product.id] < 99) {
                    cart[product.id]++;
                    cartMessage.textContent = "";
                    renderCart();
                } else {
                    cartMessage.textContent = "Maximum quantity is 99.";
                }
            });

            // REMOVE PRODUCT
            const removeButton = document.createElement("button");
            removeButton.type = "button";
            removeButton.textContent = "Remove";
            removeButton.className = "remove-item";

            removeButton.addEventListener("click", function () {
                delete cart[product.id];

                cartMessage.textContent =
                    product.name + " removed from your cart.";

                renderCart();
            });

            li.append(
                productInfo,
                decreaseButton,
                quantityInput,
                increaseButton,
                removeButton
            );

            cartItems.appendChild(li);
        });

        cartTotal.textContent = money(total);
        cartEmpty.hidden = itemCount > 0;
        clearCart.disabled = itemCount === 0;
        checkoutButton.disabled = itemCount === 0;
    }

    // CLEAR CART
    clearCart.addEventListener("click", function () {
        Object.keys(cart).forEach(function (key) {
            delete cart[key];
        });

        cartMessage.textContent = "Your cart has been cleared.";
        renderCart();
    });

    // WHATSAPP CHECKOUT
    checkoutButton.addEventListener("click", function () {
        const lines = [
            "Hello Natures' Garden! I'd like to enquire about:"
        ];

        products.forEach(function (product) {
            const quantity = cart[product.id] || 0;

            if (quantity > 0) {
                lines.push(
                    product.name + " x " + quantity +
                    " = " + money(product.price * quantity)
                );
            }
        });

        const total = products.reduce(function (sum, product) {
            return sum +
                product.price * (cart[product.id] || 0);
        }, 0);

        lines.push("Total: " + money(total));

        const businessNumber = "27799718880";

        if (!/^27\d{9}$/.test(businessNumber)) {
            cartMessage.textContent =
                "Please check the WhatsApp business number.";
            return;
        }

        const url = "https://wa.me/" + businessNumber +
            "?text=" + encodeURIComponent(lines.join("\n"));

        window.open(url, "_blank", "noopener,noreferrer");
    });

    renderCart();
});


/* =====================================
   SCROLL ANIMATIONS AND BACK TO TOP
===================================== */

document.addEventListener("DOMContentLoaded", function () {

    const revealElements = document.querySelectorAll(
        "main h2, main section, .product-card"
    );

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
        revealElements.forEach(function (element) {
            element.classList.add("is-visible");
        });
    } else {
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12
        });

        revealElements.forEach(function (element) {
            element.classList.add("reveal-on-scroll");
            observer.observe(element);
        });
    }

    // BACK TO TOP
    const topButton = document.getElementById("backToTop");

    if (!topButton) return;

    function updateTopButton() {
        topButton.classList.toggle(
            "visible",
            window.scrollY > 300
        );
    }

    window.addEventListener("scroll", updateTopButton, {
        passive: true
    });

    topButton.addEventListener("click", function () {
        window.scrollTo({
            top: 0,
            behavior: reduceMotion ? "auto" : "smooth"
        });
    });

    updateTopButton();
});

// =====================================
// NATURES' GARDEN CUSTOMER REVIEWS
// =====================================

document.addEventListener("DOMContentLoaded", function () {

    const reviewForm = document.getElementById("reviewForm");
    const reviewList = document.getElementById("reviewList");
    const reviewMessage = document.getElementById("reviewMessage");

    const customerName = document.getElementById("customerName");
    const reviewProduct = document.getElementById("reviewProduct");
    const customerRating = document.getElementById("customerRating");
    const customerMessage = document.getElementById("customerMessage");

    // LOAD SAVED REVIEWS
    let reviews = [];

    try {
        reviews = JSON.parse(
            localStorage.getItem("naturesGardenReviews") || "[]"
        );

        if (!Array.isArray(reviews)) {
            reviews = [];
        }
    } catch (error) {
        reviews = [];
    }

    // DISPLAY REVIEWS
    function displayReviews() {

        reviewList.replaceChildren();

        reviews.forEach(function (review) {

            const card = document.createElement("div");
            card.className = "review-card";

            const name = document.createElement("h3");
            name.textContent = review.name;

            const product = document.createElement("p");
            product.textContent = "Product: " + review.product;

            const stars = document.createElement("p");
            stars.className = "review-stars";

            const rating = Number(review.rating);

            stars.textContent =
                "★".repeat(rating) + "☆".repeat(5 - rating);

            const message = document.createElement("p");
            message.textContent = '"' + review.message + '"';

            card.appendChild(name);
            card.appendChild(product);
            card.appendChild(stars);
            card.appendChild(message);

            reviewList.appendChild(card);
        });
    }

    // SUBMIT A REVIEW
    reviewForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const name = customerName.value.trim();
        const product = reviewProduct.value;
        const rating = Number(customerRating.value);
        const message = customerMessage.value.trim();

        // NAME VALIDATION
        const namePattern = /^[A-Za-zÀ-ÿ\s'-]+$/;

        if (!namePattern.test(name)) {
            reviewMessage.textContent =
                "Please enter a valid name using letters only.";

            customerName.focus();
            return;
        }

        // REQUIRED FIELD VALIDATION
        if (!name || !product || !rating || !message) {
            reviewMessage.textContent =
                "Please complete all fields.";
            return;
        }

        // RATING VALIDATION
        if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
            reviewMessage.textContent =
                "Please select a valid rating.";
            return;
        }

        // REVIEW LENGTH VALIDATION
        if (message.length < 5) {
            reviewMessage.textContent =
                "Your review must contain at least 5 characters.";
            return;
        }

        // CREATE NEW REVIEW
        const newReview = {
            name: name,
            product: product,
            rating: rating,
            message: message,
            date: new Date().toLocaleDateString()
        };

        reviews.unshift(newReview);

        // SAVE REVIEWS
        try {
            localStorage.setItem(
                "naturesGardenReviews",
                JSON.stringify(reviews)
            );
        } catch (error) {
            reviews.shift();

            reviewMessage.textContent =
                "Unable to save your review. Please try again.";
            return;
        }

        // UPDATE DISPLAY
        displayReviews();

        // RESET FORM
        reviewForm.reset();

        reviewMessage.textContent =
            "Thank you! Your review has been submitted successfully 🌿";

    });

    // DISPLAY SAVED REVIEWS ON PAGE LOAD
    displayReviews();

});
