// Initialize cart functionality when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Check user authentication
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userEmail = localStorage.getItem("userEmail");
  const userId = localStorage.getItem("userId");
  const cartKey = `cart_${userId}`;

  // Redirect to login if not authenticated
  if (!isLoggedIn || !userEmail) {
    window.location.href = "login.html";
    return;
  }

  // Load cart items from localStorage
  let cartItems = JSON.parse(localStorage.getItem(cartKey)) || [];

  // Define available promo codes
  // const promoCodes = [
  //   {
  //     code: "WELCOME10",
  //     discount: 0.1, // 10% discount
  //     description: "10% off",
  //     freeShipping: false,
  //   },
  //   {
  //     code: "FREESHIP",
  //     discount: 0,
  //     description: "Free Shipping",
  //     freeShipping: true,
  //   },
  //   {
  //     code: "SUMMER20",
  //     discount: 0.2, // 20% discount
  //     description: "20% off",
  //     freeShipping: false,
  //   },
  // ];

  // Initialize cart display
  renderCartItems();
  updateOrderSummary();
  updateCartCount();

  // Render cart items in the UI
  function renderCartItems() {
    const cartItemsContainer = document.querySelector(".cart-items");
    if (!cartItemsContainer) return;

    // Clear existing items
    cartItemsContainer.innerHTML = "";

    if (cartItems.length === 0) {
      cartItemsContainer.innerHTML = "<p>Your cart is empty</p>";
      return;
    }

    // Create HTML for each cart item
    cartItems.forEach((item, index) => {
      const cartItemElement = document.createElement("div");
      cartItemElement.className = "cart-item";
      cartItemElement.innerHTML = `
        <div class="item-image">
          <img src="${item.image}" alt="${item.name}" />
        </div>
        <div class="item-details">
          <div class="item-name">${item.name}</div>
          <div class="item-meta">Size: ${item.size || "N/A"}</div>
          <div class="item-price">${item.price}</div>
          <div class="item-quantity">Quantity: ${item.quantity}</div>
        </div>
        <div class="quantity-controls">
          <button class="quantity-btn minus" data-index="${index}">−</button>
          <input type="text" class="quantity" value="${
            item.quantity
          }" readonly />
          <button class="quantity-btn plus" data-index="${index}">+</button>
        </div>
        <div class="remove-badge" data-index="${index}">
          <i class="fa-solid fa-trash"></i>
        </div>
      `;
      cartItemsContainer.appendChild(cartItemElement);
    });

    // Add event listeners for quantity controls
    document.querySelectorAll(".quantity-btn.minus").forEach((btn) => {
      btn.addEventListener("click", () =>
        updateQuantity(parseInt(btn.dataset.index), -1)
      );
    });

    document.querySelectorAll(".quantity-btn.plus").forEach((btn) => {
      btn.addEventListener("click", () =>
        updateQuantity(parseInt(btn.dataset.index), 1)
      );
    });

    // Add event listeners for remove buttons
    document.querySelectorAll(".remove-badge").forEach((btn) => {
      btn.addEventListener("click", () =>
        removeItem(parseInt(btn.dataset.index))
      );
    });
  }

  // Update item quantity in cart
  function updateQuantity(index, change) {
    if (!cartItems || !cartItems[index]) return;

    const newQuantity = cartItems[index].quantity + change;
    if (newQuantity < 1) return;

    cartItems[index].quantity = newQuantity;
    saveCart();
    renderCartItems();
    updateOrderSummary();
    updateCartCount();
  }

  // Remove item from cart
  function removeItem(index) {
    if (!cartItems || !cartItems[index]) return;

    cartItems.splice(index, 1);
    saveCart();
    renderCartItems();
    updateOrderSummary();
    updateCartCount();
  }

  // Save cart to localStorage
  function saveCart() {
    localStorage.setItem(cartKey, JSON.stringify(cartItems));
  }

  // Update order summary with totals
  function updateOrderSummary() {
    const orderSummary = document.querySelector(".order-summary");
    if (!orderSummary) return;

    // Calculate subtotal
    const subtotal = cartItems.reduce((sum, item) => {
      const price = parseFloat(item.price.replace(/[^0-9.-]+/g, ""));
      return sum + price * item.quantity;
    }, 0);

    // Get applied promo code
    const appliedPromo = document.querySelector(".applied-promo");
    const promoCode = appliedPromo ? appliedPromo.dataset.code : null;
    const promo = promoCode
      ? promoCodes.find((p) => p.code === promoCode)
      : null;

    // Calculate discount and delivery fee
    const discount = promo ? subtotal * promo.discount : 0;
    const deliveryFee =
      cartItems.length === 0 ? 0 : promo && promo.freeShipping ? 0 : 15;
    const total = subtotal - discount + deliveryFee;

    // Update order summary HTML
    orderSummary.innerHTML = `
      <h2 class="summary-title">Order Summary</h2>
      <div class="summary-row">
        <div class="summary-label">Subtotal</div>
        <div class="summary-value">$${subtotal.toFixed(2)}</div>
      </div>
      ${
        promo
          ? `
          <div class="summary-row">
            <div class="summary-label">Discount (${promo.description})</div>
            <div class="summary-value discount">-$${discount.toFixed(2)}</div>
          </div>
        `
          : ""
      }
      <div class="summary-row">
        <div class="summary-label">Delivery Fee</div>
        <div class="summary-value">$${deliveryFee.toFixed(2)}</div>
      </div>
      <div class="total-row">
        <div>Total</div>
        <div>$${total.toFixed(2)}</div>
      </div>
      <div class="promo-input">
        <input type="text" class="promo-code" placeholder="Add promo code" />
        <button class="apply-btn">Apply</button>
      </div>
      <button class="checkout-btn" ${cartItems.length === 0 ? "disabled" : ""}>
        <span>Go to Checkout</span>
        <i class="fa-solid fa-arrow-right"></i>
      </button>
    `;

    // Add event listener for promo code
    const applyBtn = orderSummary.querySelector(".apply-btn");
    const promoInput = orderSummary.querySelector(".promo-code");

    if (applyBtn && promoInput) {
      applyBtn.addEventListener("click", () => {
        const code = promoInput.value.trim().toUpperCase();
        const validPromo = promoCodes.find((p) => p.code === code);

        if (validPromo) {
          // Remove any existing applied promo
          const existingPromo = document.querySelector(".applied-promo");
          if (existingPromo) {
            existingPromo.remove();
          }

          // Add new applied promo
          const promoElement = document.createElement("div");
          promoElement.className = "applied-promo";
          promoElement.dataset.code = code;
          promoElement.innerHTML = `
            <span>${code} Applied</span>
            <button class="remove-promo">×</button>
          `;
          orderSummary.insertBefore(
            promoElement,
            orderSummary.querySelector(".total-row")
          );

          // Add event listener to remove promo
          promoElement
            .querySelector(".remove-promo")
            .addEventListener("click", () => {
              promoElement.remove();
              updateOrderSummary();
            });

          updateOrderSummary();
        } else {
          alert("Invalid promo code");
        }
      });
    }

    // Add event listener for checkout button
    const checkoutBtn = orderSummary.querySelector(".checkout-btn");
    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", function () {
        const checkoutModal = document.getElementById("checkoutModal");
        if (checkoutModal) {
          checkoutModal.style.display = "flex";
          document.body.style.overflow = "hidden";
          updateCheckoutModal();
        }
      });
    }
  }

  // Update checkout modal content
  function updateCheckoutModal() {
    const checkoutItems = document.getElementById("checkoutItems");
    const checkoutSubtotal = document.getElementById("checkoutSubtotal");
    const checkoutShipping = document.getElementById("checkoutShipping");
    const checkoutDiscount = document.getElementById("checkoutDiscount");
    const checkoutTotal = document.getElementById("checkoutTotal");
    const promoDiscountRow = document.querySelector(
      ".checkout-summary .promo-discount"
    );

    if (
      !checkoutItems ||
      !checkoutSubtotal ||
      !checkoutShipping ||
      !checkoutTotal
    ) {
      console.error("Required checkout modal elements not found");
      return;
    }

    // Clear previous items
    checkoutItems.innerHTML = "";

    // Add current cart items
    cartItems.forEach((item) => {
      const itemElement = document.createElement("div");
      itemElement.className = "checkout-item";
      itemElement.innerHTML = `
        <div class="item-info">
          <span class="item-name">${item.name}</span>
          <span class="item-details"> ${item.size || "N/A"} / Qty: ${
        item.quantity
      }</span>
        </div>
        <span class="item-price">${item.price}</span>
      `;
      checkoutItems.appendChild(itemElement);
    });

    // Calculate values from cart items
    const subtotal = cartItems.reduce((sum, item) => {
      const price = parseFloat(item.price.replace(/[^0-9.-]+/g, ""));
      return sum + price * item.quantity;
    }, 0);

    // Get applied promo code
    const appliedPromo = document.querySelector(".applied-promo");
    const promoCode = appliedPromo ? appliedPromo.dataset.code : null;
    const promo = promoCode
      ? promoCodes.find((p) => p.code === promoCode)
      : null;

    // Calculate discount and shipping
    const discount = promo ? subtotal * promo.discount : 0;
    const shipping =
      cartItems.length === 0 ? 0 : promo && promo.freeShipping ? 0 : 15;
    const total = subtotal - discount + shipping;

    // Update modal values
    checkoutSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    checkoutShipping.textContent = `$${shipping.toFixed(2)}`;
    checkoutTotal.textContent = `$${total.toFixed(2)}`;

    // Handle discount display
    if (discount > 0 && promoDiscountRow && checkoutDiscount) {
      promoDiscountRow.style.display = "flex";
      checkoutDiscount.textContent = `-$${discount.toFixed(2)}`;
    } else if (promoDiscountRow) {
      promoDiscountRow.style.display = "none";
    }
  }

  // Process the order
  function processOrder() {
    // Get selected payment method
    const selectedPayment = document.querySelector(
      'input[name="payment"]:checked'
    );
    if (!selectedPayment) {
      alert("Please select a payment method");
      return;
    }

    // Create order object
    const order = {
      id: Date.now(),
      items: cartItems,
      date: new Date().toISOString(),
      status: "Processing",
      paymentMethod:
        selectedPayment.value === "card" ? "Credit Card" : "Cash on Delivery",
      total: document.getElementById("checkoutTotal").textContent,
    };

    // Save order to localStorage
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));

    // Clear cart
    cartItems = [];
    saveCart();

    // Close modal and update UI
    const modal = document.querySelector(".checkout-modal");
    if (modal) {
      modal.style.display = "none";
      document.body.style.overflow = "auto";
    }

    // Show success message
    alert("Order placed successfully!");

    // Update cart display
    renderCartItems();
    updateOrderSummary();
    updateCartCount();
  }

  // Update cart count in navigation
  function updateCartCount() {
    const cartCountElements = document.querySelectorAll(".cart-count");
    if (!cartCountElements || cartCountElements.length === 0) return;

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElements.forEach((element) => {
      element.textContent = totalItems > 0 ? totalItems : "";
    });
  }

  // Initialize checkout modal functionality
  const checkoutModal = document.querySelector(".checkout-modal");
  if (checkoutModal) {
    const closeModalBtn = checkoutModal.querySelector(".close-modal");
    if (closeModalBtn) {
      closeModalBtn.addEventListener("click", () => {
        checkoutModal.style.display = "none";
        document.body.style.overflow = "auto";
      });
    }

    // Handle payment method selection
    const paymentMethods = checkoutModal.querySelectorAll(
      'input[name="payment"]'
    );
    const cardDetails = checkoutModal.querySelector("#cardDetails");

    if (paymentMethods.length > 0 && cardDetails) {
      paymentMethods.forEach((method) => {
        method.addEventListener("change", function () {
          cardDetails.style.display = this.value === "card" ? "block" : "none";
        });
      });
    }

    // Handle place order button
    const placeOrderBtn = checkoutModal.querySelector(".place-order-btn");
    if (placeOrderBtn) {
      placeOrderBtn.addEventListener("click", processOrder);
    }
  }
});
