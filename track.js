// Track Collection JavaScript

// Sample tracking data
const trackingData = {
    'WW123456': {
        id: 'WW123456',
        status: 'ontheway',
        statusText: 'On The Way',
        pickupDate: 'Dec 12, 2025',
        timeSlot: 'Morning (8 AM - 12 PM)',
        wasteType: 'E-Waste',
        quantity: 'Medium (3-5 bags)',
        location: '123 Green Street, Eco City',
        contactPerson: 'John Doe',
        driver: {
            name: 'Mike Johnson',
            role: 'Certified Collection Agent',
            rating: '4.8',
            reviews: '152',
            vehicle: 'Truck #TRK-4521',
            license: 'DL-3XY-2024'
        },
        timeline: [
            { status: 'confirmed', completed: true },
            { status: 'assigned', completed: true },
            { status: 'ontheway', completed: false, active: true },
            { status: 'collected', completed: false },
            { status: 'processing', completed: false },
            { status: 'completed', completed: false }
        ]
    },
    'WW125489': {
        id: 'WW125489',
        status: 'completed',
        statusText: 'Completed',
        pickupDate: 'Dec 5, 2025',
        timeSlot: 'Afternoon (12 PM - 4 PM)',
        wasteType: 'Household Waste',
        quantity: 'Large (6+ bags)',
        location: '456 Eco Avenue, Green City',
        contactPerson: 'Sarah Smith',
        driver: {
            name: 'Tom Wilson',
            role: 'Senior Collection Agent',
            rating: '4.9',
            reviews: '203',
            vehicle: 'Truck #TRK-3214',
            license: 'DL-2AB-2024'
        },
        timeline: [
            { status: 'confirmed', completed: true },
            { status: 'assigned', completed: true },
            { status: 'ontheway', completed: true },
            { status: 'collected', completed: true },
            { status: 'processing', completed: true },
            { status: 'completed', completed: true }
        ]
    },
    'WW120987': {
        id: 'WW120987',
        status: 'confirmed',
        statusText: 'Scheduled',
        pickupDate: 'Dec 15, 2025',
        timeSlot: 'Morning (8 AM - 12 PM)',
        wasteType: 'Organic Waste',
        quantity: 'Small (1-2 bags)',
        location: '789 Recycle Road, Eco Town',
        contactPerson: 'Mike Chen',
        driver: {
            name: 'Not Yet Assigned',
            role: 'Pending Assignment',
            rating: 'N/A',
            reviews: 'N/A',
            vehicle: 'To be assigned',
            license: 'To be assigned'
        },
        timeline: [
            { status: 'confirmed', completed: true },
            { status: 'assigned', completed: false },
            { status: 'ontheway', completed: false },
            { status: 'collected', completed: false },
            { status: 'processing', completed: false },
            { status: 'completed', completed: false }
        ]
    }
};

// Track collection function
function trackCollection() {
    const trackingInput = document.getElementById('trackingInput');
    const trackingId = trackingInput.value.trim().toUpperCase();
    
    if (!trackingId) {
        alert('Please enter a tracking ID');
        return;
    }
    
    loadTracking(trackingId);
}

// Load tracking information
function loadTracking(trackingId) {
    const data = trackingData[trackingId];
    
    if (!data) {
        alert('Tracking ID not found. Please check and try again.');
        return;
    }
    
    // Show results section
    document.getElementById('trackingResults').style.display = 'block';
    
    // Populate data
    document.getElementById('displayTrackingId').textContent = data.id;
    document.getElementById('pickupDate').textContent = data.pickupDate;
    document.getElementById('timeSlot').textContent = data.timeSlot;
    document.getElementById('wasteType').textContent = data.wasteType;
    document.getElementById('quantity').textContent = data.quantity;
    document.getElementById('location').textContent = data.location;
    document.getElementById('contactPerson').textContent = data.contactPerson;
    
    // Update status badge
    const statusBadge = document.getElementById('statusBadge');
    const statusText = document.getElementById('statusText');
    statusText.textContent = data.statusText;
    
    // Remove existing status classes
    statusBadge.classList.remove('scheduled', 'completed');
    
    if (data.status === 'confirmed') {
        statusBadge.classList.add('scheduled');
    } else if (data.status === 'completed') {
        statusBadge.classList.add('completed');
    }
    
    // Update driver info
    document.getElementById('driverName').textContent = data.driver.name;
    document.getElementById('driverRole').textContent = data.driver.role;
    
    // Update timeline
    updateTimeline(data.timeline);
    
    // Scroll to results
    document.getElementById('trackingResults').scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Update input value
    document.getElementById('trackingInput').value = trackingId;
}

// Update timeline based on status
function updateTimeline(timelineData) {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach((item, index) => {
        // Remove all classes
        item.classList.remove('completed', 'active', 'pending');
        
        if (timelineData[index].completed) {
            item.classList.add('completed');
        } else if (timelineData[index].active) {
            item.classList.add('active');
        } else {
            item.classList.add('pending');
        }
    });
}

// Allow Enter key to trigger tracking
document.addEventListener('DOMContentLoaded', function() {
    const trackingInput = document.getElementById('trackingInput');
    
    if (trackingInput) {
        trackingInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                trackCollection();
            }
        });
    }
    
    // Back to top functionality
    const backToTop = document.getElementById('backToTop');
    
    if (backToTop) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTop.style.display = 'flex';
            } else {
                backToTop.style.display = 'none';
            }
        });
        
        backToTop.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});

// Auto-format tracking ID input
document.addEventListener('DOMContentLoaded', function() {
    const trackingInput = document.getElementById('trackingInput');
    
    if (trackingInput) {
        trackingInput.addEventListener('input', function(e) {
            // Auto-format to uppercase
            this.value = this.value.toUpperCase();
        });
    }
});
