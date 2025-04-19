document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const cartItemsContainer = document.querySelector('.cart-items');
    const orderSummary = document.querySelector('.order-summary');
    const subtotalElement = document.getElementById('Subtotal_order');
    const discountElement = document.getElementById('discount_order');
    const deliveryFeeElement = document.getElementById('Delivery_fee_order');
    const serviceFeeElement = document.getElementById('Service_fee_order');
    const totalElement = document.getElementById('Total_order');
    const applyButton = document.getElementById('Apply');
    const promoCodeInput = document.getElementById('discountbar');
    const submitOrderButton = document.getElementById('sub');

    // Cart data
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let discount = 0;
    const deliveryFee = 10.00; // Fixed delivery fee
    const serviceFee = 5.00; // Fixed service fee

    // Promo codes and their discounts
    const promoCodes = {
        'FITLAB10': 0.10, // 10% off
        'FITLAB20': 0.20, // 20% off
        'FREESHIP': 'free-shipping' // Free shipping
    };

    // Initialize the cart
    function initCart() {
        renderCartItems();
        updateOrderSummary();
    }

    // Render cart items
    function renderCartItems() {
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `<h3>Your cart is empty!</h3>
            <p class="subtext">Add items to your cart to see them here.</p>
            <button id="Apply"><a href="../ecommerce.html" style="color: rgb(255, 255, 255);">Back to home page</a></button>`;
            
            orderSummary.style.display = 'none';
            subtotalElement.textContent = '$0.00';
            discountElement.textContent = '$0.00';
            return;
        }

        cart.forEach((item, index) => {
            const cartItemElement = document.createElement('div');
            cartItemElement.className = 'cart-item';
            cartItemElement.innerHTML = `
                <hr>
                <div class="product_and_delete">
                    <p class="Product">${item.name}</p>
                    <button class="Delete_Product_button" data-index="${index}">
                        <i class="fa-solid fa-trash-can" style="color: rgb(203, 24, 24);"></i>
                    </button>
                </div>
                <p class="subtext">Size: ${item.size}</p>
                <p class="subtext">Color: ${item.color}</p>
                <div class="Price_and_Quantity">
                    <div>
                        <span class="product_price">$${item.price.toFixed(2)}</span>
                    </div>
                    <div class="Quantity">
                        <button class="Minus_button" data-index="${index}">-</button>
                        <span class="quantity_num">${item.quantity}</span>
                        <button class="Plus_button" data-index="${index}">+</button>
                    </div>
                </div>
            `;
            cartItemsContainer.appendChild(cartItemElement);
        });

        // Add event listeners to buttons
        document.querySelectorAll('.Delete_Product_button').forEach(button => {
            button.addEventListener('click', removeItem);
        });

        document.querySelectorAll('.Minus_button').forEach(button => {
            button.addEventListener('click', decreaseQuantity);
        });

        document.querySelectorAll('.Plus_button').forEach(button => {
            button.addEventListener('click', increaseQuantity);
        });
    }

    // Remove item from cart
    function removeItem(e) {
        const index = e.target.closest('button').getAttribute('data-index');
        cart.splice(index, 1);
        saveCart();
        renderCartItems();
        updateOrderSummary();
    }

    // Decrease item quantity
    function decreaseQuantity(e) {
        const index = e.target.closest('button').getAttribute('data-index');
        if (cart[index].quantity > 1) {
            cart[index].quantity--;
            saveCart();
            renderCartItems();
            updateOrderSummary();
        }
    }

    // Increase item quantity
    function increaseQuantity(e) {
        const index = e.target.closest('button').getAttribute('data-index');
        cart[index].quantity++;
        saveCart();
        renderCartItems();
        updateOrderSummary();
    }

    // Calculate subtotal
    function calculateSubtotal() {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Calculate total
    function calculateTotal() {
        const subtotal = calculateSubtotal();
        let calculatedDeliveryFee = deliveryFee;
        let calculatedDiscount = 0;

        // Apply discount if promo code is valid
        if (discount === 'free-shipping') {
            calculatedDeliveryFee = 0;
        } else if (discount > 0) {
            calculatedDiscount = subtotal * discount;
        }

        return (subtotal - calculatedDiscount) + calculatedDeliveryFee + serviceFee;
    }

    // Update order summary
    function updateOrderSummary() {
        const subtotal = calculateSubtotal();
        let calculatedDeliveryFee = deliveryFee;
        let calculatedDiscount = 0;

        if (discount === 'free-shipping') {
            calculatedDeliveryFee = 0;
        } else if (discount > 0) {
            calculatedDiscount = subtotal * discount;
        }

        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        discountElement.textContent = `-$${calculatedDiscount.toFixed(2)}`;
        deliveryFeeElement.textContent = `$${calculatedDeliveryFee.toFixed(2)}`;
        serviceFeeElement.textContent = `$${serviceFee.toFixed(2)}`;
        
        const total = (subtotal - calculatedDiscount) + calculatedDeliveryFee + serviceFee;
        totalElement.textContent = `$${total.toFixed(2)}`;
    }

    // Apply promo code
    function applyPromoCode() {
        const code = promoCodeInput.value.trim().toUpperCase();
        
        if (promoCodes.hasOwnProperty(code)) {
            discount = promoCodes[code];
            updateOrderSummary();
            promoCodeInput.value = '';
            alert('Promo code applied successfully!');
        } else {
            alert('Invalid promo code');
        }
    }

    // Submit order
    function submitOrder() {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        
        // In a real application, you would process the payment here
        alert('Order submitted successfully!');
        
        // Clear the cart after submission
        cart = [];
        saveCart();
        renderCartItems();
        updateOrderSummary();
    }

    // Save cart to localStorage
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Event listeners
    applyButton.addEventListener('click', applyPromoCode);
    submitOrderButton.addEventListener('click', submitOrder);

    // Initialize the cart
    initCart();

    // Sample data for testing - remove in production
    if (cart.length === 0) {
        cart = [
            {
                name: 'Sample Product 1',
                size: 'L',
                color: 'white',
                price: 29.99,
                quantity: 1
            },
            {
                name: 'Sample Product 2',
                size: 'M',
                color: 'black',
                price: 39.99,
                quantity: 2
            }
        ];
        saveCart();
        initCart();
    }
});

