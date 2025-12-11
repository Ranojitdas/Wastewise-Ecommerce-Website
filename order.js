// Order Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    loadOrderSummary();
    setupOrderForm();
});

function loadOrderSummary() {
    const cart = JSON.parse(sessionStorage.getItem('checkoutCart')) || [];
    
    if (cart.length === 0) {
        alert('No items in checkout. Redirecting to cart...');
        window.location.href = 'cart.html';
        return;
    }

    const summaryItems = document.getElementById('summaryItems');
    
    // Render cart items
    summaryItems.innerHTML = cart.map(item => `
        <div class="summary-item">
            <div class="summary-item-image">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/60x60?text=Product'">
            </div>
            <div class="summary-item-details">
                <h4>${item.name}</h4>
                <p>Qty: ${item.quantity} × ${item.price}</p>
            </div>
        </div>
    `).join('');

    // Calculate totals
    updateOrderTotals(cart);
}

function updateOrderTotals(cart) {
    let subtotal = 0;

    cart.forEach(item => {
        const price = parseFloat(item.price.replace(/[₹,]/g, ''));
        subtotal += price * item.quantity;
    });

    const shipping = subtotal >= 500 ? 0 : 50;
    const tax = subtotal * 0.18;
    const total = subtotal + shipping + tax;

    document.getElementById('orderSubtotal').textContent = '₹' + subtotal.toFixed(0);
    document.getElementById('orderShipping').textContent = shipping === 0 ? 'FREE' : '₹' + shipping;
    document.getElementById('orderTax').textContent = '₹' + tax.toFixed(0);
    document.getElementById('orderTotal').textContent = '₹' + total.toFixed(0);
}

function setupOrderForm() {
    const form = document.getElementById('orderForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Collect form data
        const formData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            state: document.getElementById('state').value,
            pincode: document.getElementById('pincode').value,
            country: document.getElementById('country').value,
            payment: document.querySelector('input[name="payment"]:checked').value,
            notes: document.getElementById('notes').value,
            orderDate: new Date().toISOString(),
            items: JSON.parse(sessionStorage.getItem('checkoutCart')) || []
        };

        // Generate order ID
        const orderId = 'WW' + Math.floor(100000 + Math.random() * 900000);
        formData.orderId = orderId;

        // Save order to localStorage
        saveOrder(formData);

        // Show success modal
        showSuccessModal(orderId);

        // Clear cart and checkout data
        localStorage.removeItem('cart');
        sessionStorage.removeItem('checkoutCart');
    });
}

function saveOrder(orderData) {
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(orderData);
    localStorage.setItem('orders', JSON.stringify(orders));
}

function showSuccessModal(orderId) {
    const modal = document.getElementById('successModal');
    const orderIdElement = document.getElementById('generatedOrderId');
    const trackBtn = document.getElementById('trackOrderBtn');
    
    orderIdElement.textContent = orderId;
    trackBtn.href = `track-order.html?id=${orderId}`;
    modal.classList.add('show');

    // Prevent closing modal by clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            e.preventDefault();
        }
    });
}

// Helper function to format currency
function formatCurrency(amount) {
    return '₹' + amount.toFixed(0);
}
