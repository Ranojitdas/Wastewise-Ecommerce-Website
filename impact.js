// Impact Page - Advanced Interactive Functionality

class ImpactTracker {
    constructor() {
        this.userPoints = 1234;
        this.impactProfiles = {
            plastic: { co2: 1.6, water: 18, landfill: 0.012, trees: 0.002, note: 'Plastic benefits most from clean sorting and bottle separation.' },
            paper: { co2: 1.1, water: 26, landfill: 0.02, trees: 0.03, note: 'Paper and cardboard create strong tree-saving impact.' },
            ewaste: { co2: 8.5, water: 9, landfill: 0.01, trees: 0.001, note: 'E-waste has the highest material recovery value per kg.' },
            metal: { co2: 3.8, water: 12, landfill: 0.014, trees: 0.002, note: 'Metal recycling delivers strong carbon savings and resale value.' },
            glass: { co2: 0.7, water: 7, landfill: 0.018, trees: 0.001, note: 'Glass recycling is best when items stay unbroken and separated.' },
            mixed: { co2: 1.9, water: 16, landfill: 0.013, trees: 0.003, note: 'Mixed waste is useful, but separation improves every metric.' }
        };
        this.init();
    }

    init() {
        this.animateCounters();
        this.animateCircularProgress();
        this.setupRewardButtons();
        this.setupAchievementInteractions();
        this.loadUserProgress();
        this.setupImpactLab();
    }

    // Animate counter numbers with smooth count-up effect
    animateCounters() {
        const counters = document.querySelectorAll('.impact-value');
        
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateValue(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        counters.forEach(counter => observer.observe(counter));
    }

    animateValue(element) {
        const text = element.textContent;
        const hasKg = text.includes('kg');
        const number = parseInt(text.replace(/[^0-9]/g, ''));
        
        if (isNaN(number)) return;

        const duration = 2000;
        const stepTime = 50;
        const steps = duration / stepTime;
        const increment = number / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= number) {
                current = number;
                clearInterval(timer);
            }
            
            const formattedNumber = Math.floor(current).toLocaleString();
            element.textContent = hasKg ? `${formattedNumber} kg` : formattedNumber;
        }, stepTime);
    }

    // Animate circular progress bars with smooth fill animation
    animateCircularProgress() {
        const progressCircles = document.querySelectorAll('.progress-ring-circle');
        const radius = 60;
        const circumference = 2 * Math.PI * radius;
        
        // Set initial state
        progressCircles.forEach(circle => {
            circle.style.strokeDasharray = `${circumference} ${circumference}`;
            circle.style.strokeDashoffset = circumference;
        });
        
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const circle = entry.target;
                    const card = circle.closest('.breakdown-card');
                    const percentage = parseInt(card.dataset.percentage);
                    const color = circle.dataset.color;
                    
                    // Set stroke color
                    circle.style.stroke = color;
                    
                    // Calculate offset for the percentage
                    const offset = circumference - (percentage / 100) * circumference;
                    
                    // Animate the circle
                    setTimeout(() => {
                        circle.style.strokeDashoffset = offset;
                    }, 100);
                    
                    // Animate the percentage number
                    this.animatePercentage(card.querySelector('.percentage'), percentage);
                    
                    observer.unobserve(circle);
                }
            });
        }, observerOptions);

        progressCircles.forEach(circle => observer.observe(circle));
    }

    animatePercentage(element, targetPercentage) {
        const duration = 1500;
        const stepTime = 30;
        const steps = duration / stepTime;
        const increment = targetPercentage / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= targetPercentage) {
                current = targetPercentage;
                clearInterval(timer);
            }
            element.textContent = `${Math.floor(current)}%`;
        }, stepTime);
    }

    // Setup reward redemption buttons
    setupRewardButtons() {
        const rewardButtons = document.querySelectorAll('.reward-card button');
        
        rewardButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                if (button.classList.contains('disabled')) {
                    this.showNotification('Not enough points! Keep recycling to earn more.', 'error');
                    return;
                }

                const card = button.closest('.reward-card');
                const rewardName = card.querySelector('h3').textContent;
                const pointsCost = parseInt(card.querySelector('.points-cost').textContent.replace(/[^0-9]/g, ''));

                this.redeemReward(rewardName, pointsCost, button);
            });
        });
    }

    redeemReward(rewardName, pointsCost, button) {
        if (this.userPoints >= pointsCost) {
            this.userPoints -= pointsCost;
            this.showSuccessModal(rewardName, pointsCost);
            this.updatePointsDisplay();
            
            // Disable button after redemption
            button.classList.add('disabled');
            button.textContent = 'Redeemed';
            button.style.background = '#e9ecef';
            button.style.color = '#999';
            
            // Save to localStorage
            this.saveRedemption(rewardName, pointsCost);
        } else {
            this.showNotification('Not enough points!', 'error');
        }
    }

    showSuccessModal(rewardName, pointsCost) {
        // Create modal if it doesn't exist
        let modal = document.getElementById('successModal');
        
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'successModal';
            modal.className = 'modal-overlay';
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-icon">
                        <i class="fas fa-check"></i>
                    </div>
                    <h3>Reward Redeemed!</h3>
                    <p id="modal-message"></p>
                    <button class="primary-btn" onclick="impactTracker.closeModal()">Awesome!</button>
                </div>
            `;
            document.body.appendChild(modal);
        }

        const message = `You've successfully redeemed <strong>${rewardName}</strong> for <strong>${pointsCost} points</strong>. Your reward will be processed and delivered soon!`;
        document.getElementById('modal-message').innerHTML = message;
        
        modal.classList.add('active');
        
        // Auto-close after 5 seconds
        setTimeout(() => this.closeModal(), 5000);
    }

    closeModal() {
        const modal = document.getElementById('successModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 30px;
            background: ${type === 'success' ? 'var(--green-theme-color)' : '#e74c3c'};
            color: white;
            padding: 20px 30px;
            border-radius: 10px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            animation: slideInRight 0.4s ease;
            font-weight: 500;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.4s ease';
            setTimeout(() => notification.remove(), 400);
        }, 3000);
    }

    // Setup achievement card interactions
    setupAchievementInteractions() {
        const achievementCards = document.querySelectorAll('.achievement-card');
        
        achievementCards.forEach(card => {
            card.addEventListener('click', () => {
                const title = card.querySelector('h3').textContent;
                const description = card.querySelector('p').textContent;
                const isUnlocked = card.classList.contains('unlocked');
                
                this.showAchievementDetails(title, description, isUnlocked);
            });
        });
    }

    showAchievementDetails(title, description, isUnlocked) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay active';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-icon" style="background: ${isUnlocked ? 'linear-gradient(135deg, #FFD700, #FFA500)' : 'linear-gradient(135deg, #ccc, #999)'}">
                    <i class="fas ${isUnlocked ? 'fa-trophy' : 'fa-lock'}"></i>
                </div>
                <h3>${title}</h3>
                <p>${description}</p>
                ${isUnlocked ? '<p style="color: var(--green-theme-color); font-weight: 600; margin-top: 10px;">✓ Achievement Unlocked!</p>' : '<p style="color: #999; margin-top: 10px;">🔒 Keep going to unlock this achievement!</p>'}
                <button class="primary-btn" onclick="this.closest('.modal-overlay').remove()">Close</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    updatePointsDisplay() {
        const pointsElements = document.querySelectorAll('.impact-card:nth-child(3) .impact-value');
        pointsElements.forEach(el => {
            el.textContent = this.userPoints.toLocaleString();
        });
    }

    saveRedemption(rewardName, pointsCost) {
        const redemptions = JSON.parse(localStorage.getItem('wastewise_redemptions') || '[]');
        redemptions.push({
            reward: rewardName,
            points: pointsCost,
            date: new Date().toISOString()
        });
        localStorage.setItem('wastewise_redemptions', JSON.stringify(redemptions));
        localStorage.setItem('wastewise_user_points', this.userPoints);
    }

    loadUserProgress() {
        const savedPoints = localStorage.getItem('wastewise_user_points');
        if (savedPoints) {
            this.userPoints = parseInt(savedPoints);
            this.updatePointsDisplay();
        }

        // Check for previously redeemed items
        const redemptions = JSON.parse(localStorage.getItem('wastewise_redemptions') || '[]');
        redemptions.forEach(redemption => {
            const rewardCards = document.querySelectorAll('.reward-card');
            rewardCards.forEach(card => {
                const title = card.querySelector('h3').textContent;
                if (title === redemption.reward) {
                    const button = card.querySelector('button');
                    button.classList.add('disabled');
                    button.textContent = 'Redeemed';
                    button.style.background = '#e9ecef';
                    button.style.color = '#999';
                }
            });
        });
    }

    // Update impact stats based on user activity
    updateStats(recycledKg, co2Saved, pickups) {
        const stats = {
            recycled: recycledKg || 247,
            co2: co2Saved || 456,
            pickups: pickups || 18
        };

        localStorage.setItem('wastewise_impact_stats', JSON.stringify(stats));
    }

    // Calculate and display environmental impact
    calculateImpact() {
        const stats = JSON.parse(localStorage.getItem('wastewise_impact_stats') || '{"recycled":247,"co2":456,"pickups":18}');
        
        // Calculate equivalent environmental impact
        const treesEquivalent = Math.floor(stats.co2 / 20); // 1 tree absorbs ~20kg CO2/year
        const plasticBottlesSaved = Math.floor(stats.recycled / 0.02); // Average bottle weight 20g
        
        console.log(`Your impact: ${treesEquivalent} trees worth of CO2 saved, ${plasticBottlesSaved} plastic bottles diverted`);
        
        return {
            trees: treesEquivalent,
            bottles: plasticBottlesSaved
        };
    }

    setupImpactLab() {
        const button = document.getElementById('calculateImpactBtn');
        const recycledKgInput = document.getElementById('recycledKg');
        const materialSelect = document.getElementById('materialType');

        if (!button || !recycledKgInput || !materialSelect) {
            return;
        }

        const runCalculator = () => {
            const recycledKg = Math.max(0, parseFloat(recycledKgInput.value) || 0);
            const material = materialSelect.value;
            const profile = this.impactProfiles[material] || this.impactProfiles.mixed;

            const co2Saved = recycledKg * profile.co2;
            const waterSaved = recycledKg * profile.water;
            const landfillSaved = recycledKg * profile.landfill;
            const treeEquivalent = recycledKg * profile.trees;

            document.getElementById('impactHeadline').textContent = `${recycledKg.toFixed(0)} kg of ${this.formatMaterial(material)} can save about ${co2Saved.toFixed(1)} kg of CO2.`;
            document.getElementById('impactInsight').textContent = profile.note;
            document.getElementById('landfillSaved').textContent = `${landfillSaved.toFixed(1)} m³`;
            document.getElementById('waterSaved').textContent = `${Math.round(waterSaved).toLocaleString()} L`;
            document.getElementById('treeEquivalent').textContent = `${treeEquivalent.toFixed(1)} trees`;

            const goalProgress = Math.min((recycledKg / 100) * 100, 100);
            document.getElementById('goalFill').style.width = `${goalProgress}%`;
            document.getElementById('goalText').textContent = `${recycledKg.toFixed(0)} / 100 kg this month`;

            const actions = this.getImpactActions(material, recycledKg);
            const actionList = document.getElementById('impactActions');
            actionList.innerHTML = '';
            actions.forEach(action => {
                const item = document.createElement('li');
                item.textContent = action;
                actionList.appendChild(item);
            });
        };

        button.addEventListener('click', runCalculator);
        recycledKgInput.addEventListener('change', runCalculator);
        materialSelect.addEventListener('change', runCalculator);
        runCalculator();
    }

    formatMaterial(material) {
        const labels = {
            plastic: 'plastic',
            paper: 'paper and cardboard',
            ewaste: 'e-waste',
            metal: 'metal',
            glass: 'glass',
            mixed: 'mixed waste'
        };

        return labels[material] || 'mixed waste';
    }

    getImpactActions(material, recycledKg) {
        const baseActions = [
            'Keep items clean and dry before collection.',
            'Separate materials to improve recycling quality.'
        ];

        const materialActions = {
            plastic: [
                'Remove caps and labels when possible.',
                'Bundle bottles to save pickup space.'
            ],
            paper: [
                'Flatten cardboard to reduce volume.',
                'Keep paper away from moisture.'
            ],
            ewaste: [
                'Back up and wipe devices before pickup.',
                'Store cables, chargers, and batteries separately.'
            ],
            metal: [
                'Sort aluminum, copper, and steel separately.',
                'Remove non-metal parts for better recovery.'
            ],
            glass: [
                'Keep glass in a separate box or bag.',
                'Avoid mixing broken glass with other recyclables.'
            ],
            mixed: [
                'Split out e-waste, metal, and paper if you can.',
                'A little sorting increases the value of the whole pickup.'
            ]
        };

        const volumeAction = recycledKg >= 50
            ? 'You are in a strong bulk-pickup range. Book a regular collection schedule.'
            : 'A single pickup this week is enough to build momentum.';

        return [...baseActions, ...(materialActions[material] || materialActions.mixed), volumeAction];
    }
}

// Initialize Impact Tracker
const impactTracker = new ImpactTracker();

// Add CSS animation for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Log impact on page load
window.addEventListener('load', () => {
    const impact = impactTracker.calculateImpact();
    console.log(`🌱 Environmental Impact Dashboard Loaded`);
    console.log(`📊 Impact Summary: ${impact.trees} trees, ${impact.bottles} bottles saved`);
});
