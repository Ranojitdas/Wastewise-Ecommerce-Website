// Cart Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    loadCart();
});

function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItems = document.getElementById('cartItems');
    const cartSummary = document.getElementById('cartSummary');
    const emptyCart = document.getElementById('emptyCart');

    if (cart.length === 0) {
        emptyCart.style.display = 'block';
        cartSummary.style.display = 'none';
        return;
    }

    emptyCart.style.display = 'none';
    cartSummary.style.display = 'block';

    // Render cart items
    cartItems.innerHTML = cart.map((item, index) => `
        <div class="cart-item" data-index="${index}">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/120x120?text=Product'">
            </div>
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <div class="cart-item-price">${item.price}</div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
            <div class="cart-item-actions">
                <div class="item-total">${calculateItemTotal(item)}</div>
                <button class="remove-btn" onclick="removeItem(${index})">
                    <i class="fas fa-trash"></i> Remove
                </button>
            </div>
        </div>
    `).join('');

    updateSummary(cart);
}

function calculateItemTotal(item) {
    const price = parseFloat(item.price.replace(/[₹,]/g, ''));
    const total = price * item.quantity;
    return '₹' + total.toFixed(0);
}

function updateQuantity(index, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart[index]) {
        cart[index].quantity += change;
        
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCart();
    }
}

function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
}

function updateSummary(cart) {
    let subtotal = 0;
    let itemCount = 0;

    cart.forEach(item => {
        const price = parseFloat(item.price.replace(/[₹,]/g, ''));
        subtotal += price * item.quantity;
        itemCount += item.quantity;
    });

    const shipping = subtotal >= 500 ? 0 : 50;
    const tax = subtotal * 0.18;
    const total = subtotal + shipping + tax;

    document.getElementById('itemCount').textContent = itemCount;
    document.getElementById('subtotal').textContent = '₹' + subtotal.toFixed(0);
    document.getElementById('shipping').textContent = shipping === 0 ? 'FREE' : '₹' + shipping;
    document.getElementById('tax').textContent = '₹' + tax.toFixed(0);
    document.getElementById('total').textContent = '₹' + total.toFixed(0);
}

function proceedToCheckout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    // Save cart to session for order page
    sessionStorage.setItem('checkoutCart', JSON.stringify(cart));
    window.location.href = 'order.html';
}
