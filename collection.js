// Enhanced Collection page functionality

class CollectionManager {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 3;
        this.pickupData = {};
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupDateConstraints();
        this.loadPickupHistory();
        this.setupFormValidation();
    }

    setupEventListeners() {
        const form = document.getElementById('scheduleForm');
        if (form) {
            form.addEventListener('submit', this.handleFormSubmit.bind(this));
        }

        // Form field listeners for live updates
        document.addEventListener('change', (e) => {
            if (e.target.matches('input[name="wasteType"]')) {
                this.updateSummary();
            }
            if (e.target.matches('#date, #time, #quantity')) {
                this.updateSummary();
            }
        });

        // Waste type selection from collection cards
        document.querySelectorAll('.collection-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const wasteType = btn.closest('.collection-card').dataset.category;
                this.selectWasteType(wasteType);
            });
        });
    }

    setupDateConstraints() {
        const dateInput = document.getElementById('date');
        if (dateInput) {
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);
            
            const maxDate = new Date(today);
            maxDate.setDate(today.getDate() + 30); // 30 days in advance
            
            dateInput.setAttribute('min', tomorrow.toISOString().split('T')[0]);
            dateInput.setAttribute('max', maxDate.toISOString().split('T')[0]);
        }
    }

    setupFormValidation() {
        const inputs = document.querySelectorAll('input[required], textarea[required], select[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', this.validateField);
            input.addEventListener('input', this.clearValidationError);
        });
    }

    validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        
        if (!value) {
            this.showFieldError(field, 'This field is required');
            return false;
        }

        // Email validation
        if (field.type === 'email' && !this.isValidEmail(value)) {
            this.showFieldError(field, 'Please enter a valid email address');
            return false;
        }

        // Phone validation
        if (field.type === 'tel' && !this.isValidPhone(value)) {
            this.showFieldError(field, 'Please enter a valid phone number');
            return false;
        }

        this.clearFieldError(field);
        return true;
    }

    showFieldError(field, message) {
        this.clearFieldError(field);
        field.classList.add('error');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    clearValidationError(e) {
        this.clearFieldError(e.target);
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        const phoneRegex = /^[\+]?[(]?[\d\s\-\(\)]{10,}$/;
        return phoneRegex.test(phone);
    }

    nextStep() {
        if (this.validateCurrentStep()) {
            if (this.currentStep < this.totalSteps) {
                this.currentStep++;
                this.updateStepDisplay();
                this.updateSummary();
            }
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateStepDisplay();
        }
    }

    validateCurrentStep() {
        const currentStepElement = document.querySelector(`[data-step="${this.currentStep}"]`);
        const requiredFields = currentStepElement.querySelectorAll('input[required], textarea[required], select[required]');
        
        let isValid = true;
        requiredFields.forEach(field => {
            if (!this.validateField({ target: field })) {
                isValid = false;
            }
        });

        // Special validation for radio buttons
        if (this.currentStep === 2) {
            const wasteTypeSelected = document.querySelector('input[name="wasteType"]:checked');
            if (!wasteTypeSelected) {
                this.showNotification('Please select a waste type', 'error');
                isValid = false;
            }
        }

        if (this.currentStep === 3) {
            const timeSelected = document.querySelector('input[name="time"]:checked');
            if (!timeSelected) {
                this.showNotification('Please select a preferred time', 'error');
                isValid = false;
            }
        }

        return isValid;
    }

    updateStepDisplay() {
        // Update progress steps
        document.querySelectorAll('.progress-step').forEach((step, index) => {
            step.classList.toggle('active', index + 1 <= this.currentStep);
            step.classList.toggle('completed', index + 1 < this.currentStep);
        });

        // Show/hide form steps
        document.querySelectorAll('.form-step').forEach(step => {
            step.classList.toggle('active', 
                parseInt(step.dataset.step) === this.currentStep);
        });
    }

    updateSummary() {
        const wasteType = document.querySelector('input[name="wasteType"]:checked');
        const date = document.getElementById('date').value;
        const time = document.querySelector('input[name="time"]:checked');
        const quantity = document.getElementById('quantity').value;

        document.getElementById('summaryService').textContent = 
            wasteType ? this.getWasteTypeLabel(wasteType.value) : '-';
        
        document.getElementById('summaryDate').textContent = 
            date ? this.formatDate(date) : '-';
        
        document.getElementById('summaryTime').textContent = 
            time ? this.getTimeLabel(time.value) : '-';
        
        document.getElementById('summaryQuantity').textContent = 
            quantity ? this.getQuantityLabel(quantity) : '-';

        // Calculate estimated cost (keeping it free for now)
        document.getElementById('estimatedCost').textContent = 'Free';
    }

    getWasteTypeLabel(type) {
        const labels = {
            'ewaste': 'E-Waste',
            'household': 'Household Waste',
            'organic': 'Organic Waste',
            'plastics': 'Plastics & Glass'
        };
        return labels[type] || type;
    }

    getTimeLabel(time) {
        const labels = {
            'morning': 'Morning (8 AM - 12 PM)',
            'afternoon': 'Afternoon (12 PM - 4 PM)',
            'evening': 'Evening (4 PM - 7 PM)'
        };
        return labels[time] || time;
    }

    getQuantityLabel(quantity) {
        const labels = {
            'small': 'Small (1-2 bags)',
            'medium': 'Medium (3-5 bags)',
            'large': 'Large (6+ bags)',
            'bulk': 'Bulk Collection'
        };
        return labels[quantity] || quantity;
    }

    formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { 
            weekday: 'short', 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }

    selectWasteType(type) {
        const radioButton = document.querySelector(`input[name="wasteType"][value="${type}"]`);
        if (radioButton) {
            radioButton.checked = true;
            this.updateSummary();
            this.scrollToSection('schedule');
        }
    }

    handleFormSubmit(e) {
        e.preventDefault();

        if (!this.validateCurrentStep()) {
            return;
        }

        const formData = new FormData(e.target);
        this.pickupData = Object.fromEntries(formData);
        
        // Generate tracking number
        const trackingNumber = this.generateTrackingNumber();
        
        // Save to local storage
        this.savePickupToHistory(trackingNumber);
        
        // Show success message
        this.showSuccessModal(trackingNumber);
        
        // Reset form
        this.resetForm();
    }

    generateTrackingNumber() {
        return 'WW' + Date.now().toString(36).toUpperCase() + 
               Math.random().toString(36).substr(2, 4).toUpperCase();
    }

    savePickupToHistory(trackingNumber) {
        let history = JSON.parse(localStorage.getItem('pickupHistory') || '[]');
        
        const pickup = {
            id: trackingNumber,
            ...this.pickupData,
            status: 'Scheduled',
            createdAt: new Date().toISOString(),
            estimatedPickup: this.pickupData.date
        };
        
        history.unshift(pickup);
        
        // Keep only last 10 pickups
        if (history.length > 10) {
            history = history.slice(0, 10);
        }
        
        localStorage.setItem('pickupHistory', JSON.stringify(history));
        this.loadPickupHistory();
    }

    loadPickupHistory() {
        const history = JSON.parse(localStorage.getItem('pickupHistory') || '[]');
        const historySection = document.getElementById('pickupHistory');
        const historyGrid = document.getElementById('historyGrid');
        
        if (history.length > 0) {
            historySection.style.display = 'block';
            historyGrid.innerHTML = history.map(pickup => this.createHistoryCard(pickup)).join('');
        }
    }

    createHistoryCard(pickup) {
        const date = new Date(pickup.createdAt).toLocaleDateString();
        const statusClass = pickup.status.toLowerCase().replace(/\s+/g, '-');
        
        return `
            <div class="history-card">
                <div class="history-header">
                    <span class="tracking-id">#${pickup.id}</span>
                    <span class="status ${statusClass}">${pickup.status}</span>
                </div>
                <div class="history-details">
                    <p><strong>Type:</strong> ${this.getWasteTypeLabel(pickup.wasteType)}</p>
                    <p><strong>Date:</strong> ${date}</p>
                    <p><strong>Quantity:</strong> ${this.getQuantityLabel(pickup.quantity)}</p>
                </div>
                <button class="track-btn" onclick="collectionManager.trackPickupById('${pickup.id}')">
                    Track Status
                </button>
            </div>
        `;
    }

    showSuccessModal(trackingNumber) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay success-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3>Pickup Scheduled Successfully!</h3>
                <p>Your waste collection has been scheduled.</p>
                <div class="tracking-info">
                    <strong>Tracking Number: ${trackingNumber}</strong>
                </div>
                <p>We'll send confirmation details to ${this.pickupData.email}</p>
                <div class="modal-actions">
                    <button class="primary-btn" onclick="this.closest('.modal-overlay').remove()">
                        Continue
                    </button>
                    <button class="secondary-btn" onclick="collectionManager.trackPickupById('${trackingNumber}')">
                        Track Pickup
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (modal.parentNode) {
                modal.remove();
            }
        }, 5000);
    }

    resetForm() {
        document.getElementById('scheduleForm').reset();
        this.currentStep = 1;
        this.updateStepDisplay();
        this.updateSummary();
    }

    scrollToSection(sectionId) {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="close-btn" onclick="this.parentNode.remove()">&times;</button>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    // Tracking functionality
    showTrackingModal() {
        document.getElementById('trackingModal').style.display = 'flex';
    }

    hideTrackingModal() {
        document.getElementById('trackingModal').style.display = 'none';
        document.getElementById('trackingResult').innerHTML = '';
    }

    trackPickup() {
        const trackingNumber = document.getElementById('trackingNumber').value.trim();
        if (!trackingNumber) {
            this.showNotification('Please enter a tracking number', 'error');
            return;
        }
        
        this.trackPickupById(trackingNumber);
    }

    trackPickupById(trackingNumber) {
        const history = JSON.parse(localStorage.getItem('pickupHistory') || '[]');
        const pickup = history.find(p => p.id === trackingNumber);
        
        if (pickup) {
            this.showTrackingResult(pickup);
        } else {
            // Simulate tracking for demo
            this.showTrackingResult({
                id: trackingNumber,
                status: 'In Transit',
                estimatedPickup: new Date().toISOString().split('T')[0],
                wasteType: 'household'
            });
        }
    }

    showTrackingResult(pickup) {
        const resultDiv = document.getElementById('trackingResult');
        const statusSteps = this.getTrackingSteps(pickup.status);
        
        resultDiv.innerHTML = `
            <div class="tracking-info">
                <h4>Pickup #${pickup.id}</h4>
                <div class="tracking-steps">
                    ${statusSteps}
                </div>
                <div class="pickup-details">
                    <p><strong>Type:</strong> ${this.getWasteTypeLabel(pickup.wasteType)}</p>
                    <p><strong>Status:</strong> ${pickup.status}</p>
                    <p><strong>Estimated Pickup:</strong> ${this.formatDate(pickup.estimatedPickup)}</p>
                </div>
            </div>
        `;
        
        this.showTrackingModal();
    }

    getTrackingSteps(currentStatus) {
        const steps = [
            { label: 'Scheduled', status: 'completed' },
            { label: 'Confirmed', status: 'completed' },
            { label: 'In Transit', status: 'active' },
            { label: 'Collected', status: 'pending' }
        ];
        
        return steps.map(step => `
            <div class="tracking-step ${step.status}">
                <div class="step-icon">
                    <i class="fas fa-${step.status === 'completed' ? 'check' : 
                        step.status === 'active' ? 'truck' : 'clock'}"></i>
                </div>
                <span>${step.label}</span>
            </div>
        `).join('');
    }
}

// Global functions for onclick handlers
function nextStep() {
    window.collectionManager.nextStep();
}

function prevStep() {
    window.collectionManager.prevStep();
}

function selectWasteType(type) {
    window.collectionManager.selectWasteType(type);
}

function scrollToSection(sectionId) {
    window.collectionManager.scrollToSection(sectionId);
}

function showTrackingModal() {
    window.collectionManager.showTrackingModal();
}

function hideTrackingModal() {
    window.collectionManager.hideTrackingModal();
}

function trackPickup() {
    window.collectionManager.trackPickup();
}

// Initialize the collection manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.collectionManager = new CollectionManager();
});
