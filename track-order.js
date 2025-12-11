// Track Order JavaScript

// Sample order tracking data
const orderTrackingData = {
    'WW123456': {
        orderId: 'WW123456',
        orderDate: 'Dec 10, 2025',
        status: 'shipped',
        statusText: 'Shipped',
        deliveryDate: 'Dec 14, 2025',
        paymentMethod: 'Cash on Delivery',
        totalAmount: '₹3,450',
        address: '123 Green Street, Eco City, Kerala - 682001',
        items: [
            {
                name: 'Recycled Paper Notebook',
                image: 'paper.jpg',
                quantity: 2,
                price: '₹400'
            },
            {
                name: 'Eco-Friendly Water Bottle',
                image: 'plastic.jpg',
                quantity: 1,
                price: '₹650'
            },
            {
                name: 'Bamboo Toothbrush Set',
                image: 'bio waste new/Ecofriendly.jpg',
                quantity: 3,
                price: '₹600'
            }
        ],
        timeline: [
            {
                status: 'Order Confirmed',
                description: 'Your order has been confirmed',
                time: 'Dec 10, 2:30 PM',
                completed: true
            },
            {
                status: 'Processing',
                description: 'Your order is being prepared',
                time: 'Dec 10, 4:15 PM',
                completed: true
            },
            {
                status: 'Shipped',
                description: 'Your order has been shipped',
                time: 'Dec 11, 10:00 AM',
                completed: true,
                active: true
            },
            {
                status: 'Out for Delivery',
                description: 'Your order is out for delivery',
                time: 'Expected Dec 14',
                completed: false
            },
            {
                status: 'Delivered',
                description: 'Your order has been delivered',
                time: 'Expected Dec 14',
                completed: false
            }
        ],
        deliveryPartner: {
            name: 'Rajesh Kumar',
            vehicle: 'Delivery Van #DV-2341',
            rating: '4.7',
            reviews: '284'
        }
    },
    'WW789012': {
        orderId: 'WW789012',
        orderDate: 'Dec 8, 2025',
        status: 'delivered',
        statusText: 'Delivered',
        deliveryDate: 'Dec 11, 2025',
        paymentMethod: 'UPI Payment',
        totalAmount: '₹2,450',
        address: '456 Eco Avenue, Green City, Kerala - 682002',
        items: [
            {
                name: 'Recycled Plastic Chair',
                image: 'furniture.jpg',
                quantity: 1,
                price: '₹1,200'
            },
            {
                name: 'Bio-degradable Plates',
                image: 'bio waste new/Bio plastic products.jpg',
                quantity: 1,
                price: '₹350'
            }
        ],
        timeline: [
            {
                status: 'Order Confirmed',
                description: 'Your order has been confirmed',
                time: 'Dec 8, 11:20 AM',
                completed: true
            },
            {
                status: 'Processing',
                description: 'Your order is being prepared',
                time: 'Dec 8, 2:45 PM',
                completed: true
            },
            {
                status: 'Shipped',
                description: 'Your order has been shipped',
                time: 'Dec 9, 9:00 AM',
                completed: true
            },
            {
                status: 'Out for Delivery',
                description: 'Your order is out for delivery',
                time: 'Dec 11, 8:30 AM',
                completed: true
            },
            {
                status: 'Delivered',
                description: 'Your order has been delivered',
                time: 'Dec 11, 2:15 PM',
                completed: true,
                active: true
            }
        ],
        deliveryPartner: {
            name: 'Amit Sharma',
            vehicle: 'Delivery Bike #DB-4567',
            rating: '4.9',
            reviews: '412'
        }
    },
    'WW654321': {
        orderId: 'WW654321',
        orderDate: 'Dec 5, 2025',
        status: 'delivered',
        statusText: 'Delivered',
        deliveryDate: 'Dec 8, 2025',
        paymentMethod: 'Credit Card',
        totalAmount: '₹1,890',
        address: '789 Sustainability Road, Kerala - 682003',
        items: [
            {
                name: 'Recycled Textiles',
                image: 'textiles.jpg',
                quantity: 2,
                price: '₹800'
            }
        ],
        timeline: [
            {
                status: 'Order Confirmed',
                description: 'Your order has been confirmed',
                time: 'Dec 5, 3:10 PM',
                completed: true
            },
            {
                status: 'Processing',
                description: 'Your order is being prepared',
                time: 'Dec 5, 5:30 PM',
                completed: true
            },
            {
                status: 'Shipped',
                description: 'Your order has been shipped',
                time: 'Dec 6, 11:00 AM',
                completed: true
            },
            {
                status: 'Out for Delivery',
                description: 'Your order is out for delivery',
                time: 'Dec 8, 9:15 AM',
                completed: true
            },
            {
                status: 'Delivered',
                description: 'Your order has been delivered',
                time: 'Dec 8, 1:45 PM',
                completed: true,
                active: true
            }
        ],
        deliveryPartner: {
            name: 'Priya Nair',
            vehicle: 'Delivery Van #DV-8901',
            rating: '4.8',
            reviews: '356'
        }
    }
};

document.addEventListener('DOMContentLoaded', function() {
    // Auto-format input to uppercase
    const input = document.getElementById('orderIdInput');
    input.addEventListener('input', function() {
        this.value = this.value.toUpperCase();
    });

    // Allow Enter key to track
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            trackOrder();
        }
    });

    // Check if there's an order ID from successful checkout
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('id');
    if (orderId) {
        input.value = orderId;
        trackOrder();
    }
});

function trackOrder(orderId) {
    const orderIdInput = document.getElementById('orderIdInput');
    const searchId = orderId || orderIdInput.value.trim().toUpperCase();
    
    if (!searchId) {
        alert('Please enter an order ID');
        return;
    }

    const trackingResult = document.getElementById('trackingResult');
    const noResult = document.getElementById('noResult');
    const orderData = orderTrackingData[searchId];

    // Check localStorage for recent orders
    const localOrders = JSON.parse(localStorage.getItem('orders')) || [];
    const localOrder = localOrders.find(order => order.orderId === searchId);

    if (orderData || localOrder) {
        const data = orderData || convertLocalOrder(localOrder);
        loadOrderTracking(data);
        trackingResult.style.display = 'block';
        noResult.style.display = 'none';
        
        // Scroll to result
        trackingResult.scrollIntoView({ behavior: 'smooth' });
    } else {
        document.getElementById('searchedId').textContent = searchId;
        trackingResult.style.display = 'none';
        noResult.style.display = 'block';
        noResult.scrollIntoView({ behavior: 'smooth' });
    }
}

function convertLocalOrder(order) {
    // Convert localStorage order to tracking format
    const daysSinceOrder = Math.floor((new Date() - new Date(order.orderDate)) / (1000 * 60 * 60 * 24));
    let status = 'processing';
    let statusText = 'Processing';
    
    if (daysSinceOrder >= 3) {
        status = 'delivered';
        statusText = 'Delivered';
    } else if (daysSinceOrder >= 2) {
        status = 'outfordelivery';
        statusText = 'Out for Delivery';
    } else if (daysSinceOrder >= 1) {
        status = 'shipped';
        statusText = 'Shipped';
    }

    return {
        orderId: order.orderId,
        orderDate: new Date(order.orderDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: status,
        statusText: statusText,
        deliveryDate: 'Within 5-7 days',
        paymentMethod: order.payment === 'cod' ? 'Cash on Delivery' : order.payment.toUpperCase(),
        totalAmount: calculateTotal(order.items),
        address: `${order.address}, ${order.city}, ${order.state} - ${order.pincode}`,
        items: order.items || [],
        timeline: generateTimeline(daysSinceOrder),
        deliveryPartner: {
            name: 'Delivery Partner',
            vehicle: 'Delivery Vehicle',
            rating: '4.8',
            reviews: '200'
        }
    };
}

function calculateTotal(items) {
    let total = 0;
    items.forEach(item => {
        const price = parseFloat(item.price.replace(/[₹,]/g, ''));
        total += price * item.quantity;
    });
    const shipping = total >= 500 ? 0 : 50;
    const tax = total * 0.18;
    return '₹' + (total + shipping + tax).toFixed(0);
}

function generateTimeline(daysSince) {
    const timeline = [
        { status: 'Order Confirmed', description: 'Your order has been confirmed', time: 'Confirmed', completed: true },
        { status: 'Processing', description: 'Your order is being prepared', time: 'In Progress', completed: daysSince >= 0 },
        { status: 'Shipped', description: 'Your order has been shipped', time: daysSince >= 1 ? 'Completed' : 'Pending', completed: daysSince >= 1, active: daysSince === 1 },
        { status: 'Out for Delivery', description: 'Your order is out for delivery', time: daysSince >= 2 ? 'In Transit' : 'Pending', completed: daysSince >= 2, active: daysSince === 2 },
        { status: 'Delivered', description: 'Your order has been delivered', time: daysSince >= 3 ? 'Delivered' : 'Expected Soon', completed: daysSince >= 3, active: daysSince >= 3 }
    ];
    return timeline;
}

function loadOrderTracking(data) {
    // Set order header
    document.getElementById('orderNumber').textContent = data.orderId;
    document.getElementById('orderDate').textContent = data.orderDate;
    document.getElementById('orderStatus').textContent = data.statusText;
    
    const statusBadge = document.getElementById('orderStatusBadge');
    statusBadge.className = 'order-status-badge ' + data.status;

    // Set order details
    document.getElementById('deliveryDate').textContent = data.deliveryDate;
    document.getElementById('paymentMethod').textContent = data.paymentMethod;
    document.getElementById('totalAmount').textContent = data.totalAmount;
    document.getElementById('deliveryAddress').textContent = data.address;

    // Render timeline
    updateOrderTimeline(data.timeline);

    // Render order items
    renderOrderItems(data.items);

    // Show delivery partner if shipped
    if (data.status === 'shipped' || data.status === 'outfordelivery' || data.status === 'delivered') {
        showDeliveryPartner(data.deliveryPartner);
    } else {
        document.getElementById('deliveryPartnerCard').style.display = 'none';
    }
}

function updateOrderTimeline(timeline) {
    const timelineContainer = document.getElementById('orderTimeline');
    
    timelineContainer.innerHTML = timeline.map(item => `
        <div class="timeline-item ${item.completed ? 'completed' : ''} ${item.active ? 'active' : ''}">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
                <h4>${item.status}</h4>
                <p>${item.description}</p>
                <span class="time">${item.time}</span>
            </div>
        </div>
    `).join('');
}

function renderOrderItems(items) {
    const itemsContainer = document.getElementById('orderItems');
    
    itemsContainer.innerHTML = items.map(item => `
        <div class="order-item">
            <div class="item-image">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/80x80?text=Product'">
            </div>
            <div class="item-info">
                <h4>${item.name}</h4>
                <p>Quantity: ${item.quantity}</p>
            </div>
            <div class="item-price">${item.price}</div>
        </div>
    `).join('');
}

function showDeliveryPartner(partner) {
    const partnerCard = document.getElementById('deliveryPartnerCard');
    partnerCard.style.display = 'block';
    
    document.getElementById('partnerName').textContent = partner.name;
    document.getElementById('partnerVehicle').textContent = partner.vehicle;
    document.getElementById('partnerRating').textContent = partner.rating;
    document.getElementById('partnerReviews').textContent = partner.reviews;
}
