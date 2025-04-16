let cart = JSON.parse(localStorage.getItem('cart')) || [];
const cartContainer = document.getElementById('cart-container');
const totalPrice = document.getElementById('Total_order');
const checkoutButton = document.getElementById('sub');

