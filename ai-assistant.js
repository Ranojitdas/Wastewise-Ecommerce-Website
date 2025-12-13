// AI Assistant JavaScript (Demo Version)

// Sample waste data for classification
const wasteDatabase = {
    plastic: {
        type: 'Plastic Bottle',
        category: 'Recyclable Plastic',
        value: '₹5-10 per kg',
        disposal: 'Recycle in blue bin',
        confidence: 95
    },
    paper: {
        type: 'Paper/Cardboard',
        category: 'Recyclable Paper',
        value: '₹8-12 per kg',
        disposal: 'Recycle in green bin',
        confidence: 92
    },
    metal: {
        type: 'Metal Can',
        category: 'Recyclable Metal',
        value: '₹20-30 per kg',
        disposal: 'Recycle in yellow bin',
        confidence: 98
    },
    ewaste: {
        type: 'Electronic Device',
        category: 'E-Waste',
        value: '₹15-50 per kg',
        disposal: 'Special e-waste collection',
        confidence: 88
    },
    glass: {
        type: 'Glass Bottle',
        category: 'Recyclable Glass',
        value: '₹3-6 per kg',
        disposal: 'Recycle in white bin',
        confidence: 94
    }
};

// Price estimation rates (per kg)
const priceRates = {
    plastic: 7,
    paper: 10,
    metal: 25,
    ewaste: 30,
    glass: 4
};

const conditionMultipliers = {
    excellent: 1.3,
    good: 1.1,
    fair: 1.0,
    poor: 0.7
};

// Modal Functions
function openClassifier() {
    document.getElementById('classifierModal').classList.add('show');
}

function openChatbot() {
    document.getElementById('chatbotModal').classList.add('show');
}

function openEstimator() {
    document.getElementById('estimatorModal').classList.add('show');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

// Close modals on outside click
document.querySelectorAll('.ai-modal').forEach(modal => {
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('show');
        }
    });
});

// Classifier Functions
document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.getElementById('uploadArea');
    const imageInput = document.getElementById('imageInput');
    
    if (uploadArea) {
        uploadArea.addEventListener('click', () => imageInput.click());
        
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'var(--green-theme-color)';
            uploadArea.style.background = '#f0fdf4';
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.style.borderColor = '';
            uploadArea.style.background = '';
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '';
            uploadArea.style.background = '';
            
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                processImage(file);
            }
        });
        
        imageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                processImage(file);
            }
        });
    }
});

function processImage(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        // Show image
        const resultImage = document.getElementById('resultImage');
        resultImage.innerHTML = `<img src="${e.target.result}" alt="Uploaded waste">`;
        
        // Show result section
        document.getElementById('uploadArea').style.display = 'none';
        document.getElementById('classificationResult').style.display = 'block';
        document.getElementById('scanningAnimation').style.display = 'block';
        document.getElementById('resultDetails').style.display = 'none';
        
        // Analyze image colors to determine waste type
        const img = new Image();
        img.onload = function() {
            const wasteType = analyzeImageForWasteType(img);
            setTimeout(() => {
                classifyImage(wasteType);
            }, 2000);
        };
        img.src = e.target.result;
    };
    
    reader.readAsDataURL(file);
}

function analyzeImageForWasteType(img) {
    // Create canvas to analyze image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    
    // Get image data from center
    const centerX = Math.floor(img.width / 2);
    const centerY = Math.floor(img.height / 2);
    const imageData = ctx.getImageData(centerX - 50, centerY - 50, 100, 100);
    const data = imageData.data;
    
    // Calculate average RGB values
    let r = 0, g = 0, b = 0;
    for (let i = 0; i < data.length; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
    }
    const pixels = data.length / 4;
    r = r / pixels;
    g = g / pixels;
    b = b / pixels;
    
    // Determine waste type based on color analysis
    if (b > r && b > g) {
        return 'plastic'; // Blue-ish = plastic
    } else if (g > r && g > b) {
        return 'glass'; // Green-ish = glass
    } else if (r > 200 && g > 200 && b > 200) {
        return 'paper'; // White-ish = paper
    } else if (r > g && r > b) {
        return 'metal'; // Red-ish/brown = metal
    } else if (r < 100 && g < 100 && b < 100) {
        return 'ewaste'; // Dark = electronics
    }
    
    // Default to plastic
    return 'plastic';
}

function classifyImage(wasteType = null) {
    // Use provided waste type or randomly select
    if (!wasteType) {
        const wasteTypes = Object.keys(wasteDatabase);
        wasteType = wasteTypes[Math.floor(Math.random() * wasteTypes.length)];
    }
    
    const data = wasteDatabase[wasteType];
    
    // Hide scanning, show results
    document.getElementById('scanningAnimation').style.display = 'none';
    document.getElementById('resultDetails').style.display = 'block';
    
    // Add slight confidence variation
    const confidence = data.confidence + Math.floor(Math.random() * 5 - 2);
    
    // Update UI with results
    document.getElementById('confidenceValue').textContent = confidence + '%';
    document.getElementById('wasteType').textContent = data.type;
    document.getElementById('wasteCategory').textContent = data.category;
    document.getElementById('estimatedValue').textContent = data.value;
    document.getElementById('disposalMethod').textContent = data.disposal;
    
    // Add animation to results
    const resultDetails = document.getElementById('resultDetails');
    resultDetails.style.animation = 'slideUp 0.5s ease';
    
    // Save to localStorage
    const classification = {
        type: data.type,
        category: data.category,
        value: data.value,
        confidence: confidence,
        timestamp: new Date().toISOString()
    };
    
    let history = JSON.parse(localStorage.getItem('classificationHistory') || '[]');
    history.unshift(classification);
    history = history.slice(0, 10); // Keep last 10
    localStorage.setItem('classificationHistory', JSON.stringify(history));
}

// Load Example Function
function loadExample(type) {
    // Scroll to upload area
    document.querySelector('.classifier-section').scrollIntoView({ behavior: 'smooth' });
    
    // Create demo images based on type
    const demoImages = {
        plastic: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect fill="%233498db" width="300" height="300"/%3E%3Ctext x="150" y="150" font-size="80" text-anchor="middle" fill="white"%3E🍾%3C/text%3E%3C/svg%3E',
        ewaste: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect fill="%23e74c3c" width="300" height="300"/%3E%3Ctext x="150" y="150" font-size="80" text-anchor="middle" fill="white"%3E📱%3C/text%3E%3C/svg%3E',
        metal: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect fill="%2395a5a6" width="300" height="300"/%3E%3Ctext x="150" y="150" font-size="80" text-anchor="middle" fill="white"%3E🔧%3C/text%3E%3C/svg%3E',
        paper: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect fill="%23f39c12" width="300" height="300"/%3E%3Ctext x="150" y="150" font-size="80" text-anchor="middle" fill="white"%3E📦%3C/text%3E%3C/svg%3E'
    };
    
    // Show image
    const resultImage = document.getElementById('resultImage');
    resultImage.innerHTML = `<img src="${demoImages[type]}" alt="${type} example" style="animation: zoomIn 0.3s ease;">`;
    
    // Show result section
    document.getElementById('uploadArea').style.display = 'none';
    document.getElementById('classificationResult').style.display = 'block';
    document.getElementById('scanningAnimation').style.display = 'block';
    document.getElementById('resultDetails').style.display = 'none';
    
    // Classify after animation
    setTimeout(() => {
        classifyImage(type);
    }, 2000);
}

function resetClassifier() {
    const result = wasteDatabase[wasteType];
    
    // Add slight confidence variation for realism
    const confidence = result.confidence + Math.floor(Math.random() * 5) - 2;
    
    // Update UI with results
    document.getElementById('scanningAnimation').style.display = 'none';
    document.getElementById('resultDetails').style.display = 'block';
    
    document.getElementById('confidenceValue').textContent = confidence + '%';
    document.getElementById('wasteType').textContent = result.type;
    document.getElementById('wasteCategory').textContent = result.category;
    document.getElementById('estimatedValue').textContent = result.value;
    document.getElementById('disposalMethod').textContent = result.disposal;
    
    // Save classification result to localStorage for collection page
    localStorage.setItem('lastClassification', JSON.stringify({
        type: result.type,
        category: result.category,
        confidence: confidence
    }));
}
const botResponses = {
    'recycle': 'To recycle e-waste, you can schedule a pickup through our Collection page. We accept electronics like phones, laptops, batteries, and more. Would you like to schedule a pickup now?',
    'e-waste': 'E-waste includes phones, laptops, chargers, batteries, and other electronics. We ensure safe disposal and recycling. Schedule a pickup anytime!',
    'plastic': 'We accept all types of plastic waste - bottles, containers, bags, and packaging. Clean plastic fetches better prices. Current rate: ₹5-10/kg.',
    'paper': 'Paper and cardboard are highly recyclable! We accept newspapers, magazines, boxes, and office paper. Rate: ₹8-12/kg.',
    'metal': 'Metal waste includes cans, wires, appliances, and scrap metal. Metal has great recycling value at ₹20-30/kg!',
    'glass': 'Glass bottles and containers are fully recyclable. Clean, sorted glass gets the best rates at ₹3-6/kg.',
    'sell': 'You can sell various recyclable items including plastic, paper, metal, e-waste, and glass. Check our Marketplace to see current prices and list your items!',
    'pickup': 'Great! I can help you schedule a pickup. You can choose your preferred date and time. Would you like me to take you to the Collection page?',
    'schedule': 'To schedule a pickup: 1) Select waste type, 2) Choose date & time, 3) Enter your details. It takes less than 2 minutes!',
    'price': 'Current prices vary by material: Plastic ₹5-10/kg, Paper ₹8-12/kg, Metal ₹20-30/kg, E-waste ₹15-50/kg, Glass ₹3-6/kg. Prices may vary based on condition and quantity.',
    'track': 'You can track your collection using the Track Collection page. Just enter your tracking ID and you\'ll see real-time updates on your pickup status.',
    'order': 'Track your marketplace orders on our Track Order page. Enter your order ID to see delivery status, timeline, and driver details.',
    'payment': 'We accept multiple payment methods: Cash on Delivery, UPI, Credit/Debit Cards, and Net Banking. Choose what works best for you!',
    'time': 'Pickup usually happens within 24-48 hours of scheduling. You can choose morning (8AM-12PM), afternoon (12PM-4PM), or evening (4PM-8PM) slots.',
    'location': 'We currently serve Kerala and surrounding areas. Enter your pincode during scheduling to confirm service availability in your area.',
    'help': 'I can help you with: Recycling information, Scheduling pickups, Price estimates, Order tracking, Payment options, and more. What do you need help with?',
    'hi': 'Hello! 👋 How can I assist you with waste management today?',
    'hello': 'Hi there! 👋 I\'m here to help with all your recycling and waste management needs.',
    'thanks': 'You\'re welcome! Feel free to ask if you need anything else. Happy recycling! ♻️',
    'thank': 'Glad I could help! Remember, every small step towards recycling makes a big difference. 🌱',
    'default': 'I\'m here to help with waste management! You can ask me about recycling, selling items, scheduling pickups, checking prices, or tracking orders. What would you like to know?'
};nction schedulePickup() {
    closeModal('classifierModal');
    window.location.href = 'collection.html';
}

// Chatbot Functions
const botResponses = {
    'recycle': 'To recycle e-waste, you can schedule a pickup through our Collection page. We accept electronics like phones, laptops, batteries, and more. Would you like to schedule a pickup now?',
    'sell': 'You can sell various recyclable items including plastic, paper, metal, e-waste, and glass. Check our Marketplace to see current prices and list your items!',
    'pickup': 'Great! I can help you schedule a pickup. You can choose your preferred date and time. Would you like me to take you to the Collection page?',
    'price': 'Current prices vary by material: Plastic ₹5-10/kg, Paper ₹8-12/kg, Metal ₹20-30/kg, E-waste ₹15-50/kg, Glass ₹3-6/kg. Prices may vary based on condition and quantity.',
    'track': 'You can track your collection using the Track Collection page. Just enter your tracking ID and you\'ll see real-time updates on your pickup status.',
    'default': 'I\'m here to help with waste management! You can ask me about recycling, selling items, scheduling pickups, or checking prices. What would you like to know?'
};

function askQuestion(question) {
    sendMessage(question);
}

function sendMessage(customMessage) {
    const input = document.getElementById('chatInput');
    const message = customMessage || input.value.trim();
    
    if (!message) return;
    
    // Add user message
    addMessage(message, 'user');
    input.value = '';
    
    // Get bot response (typing indicator handled in addMessage)
    const response = getBotResponse(message);
    addMessage(response, 'bot');
    
    // Save conversation to localStorage
    const chatHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');
    chatHistory.push({ user: message, bot: response, time: new Date().toISOString() });
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory.slice(-20))); // Keep last 20 messages
}

function getBotResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Check for exact matches first
    for (const key in botResponses) {
        if (lowerMessage.includes(key)) {
            return botResponses[key];
        }
    }
    
    // Smart responses based on keywords
    if (lowerMessage.includes('how') && lowerMessage.includes('work')) {
function addMessage(text, sender) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    if (sender === 'bot') {
        // Show typing indicator first
        if (!document.getElementById('typingIndicator')) {
            const typingDiv = document.createElement('div');
            typingDiv.id = 'typingIndicator';
            typingDiv.className = 'message bot-message';
            typingDiv.innerHTML = `
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-bubble">
                    <div class="typing-dots">
                        <span></span><span></span><span></span>
                    </div>
                </div>
            `;
            chatMessages.appendChild(typingDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
        
        // Remove typing indicator and show message after delay
        setTimeout(() => {
            const typingIndicator = document.getElementById('typingIndicator');
            if (typingIndicator) typingIndicator.remove();
            
            messageDiv.innerHTML = `
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-bubble">
                    <p>${text}</p>
                    <span class="message-time">${time}</span>
                </div>
            `;
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 800);
        
        return;
    } else {
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="message-bubble">
                <p>${text}</p>
                <span class="message-time">${time}</span>
            </div>
        `;
    }
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}               <p>${text}</p>
                <span class="message-time">${time}</span>
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="message-bubble">
                <p>${text}</p>
                <span class="message-time">${time}</span>
            </div>
        `;
    }
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Allow Enter key to send message
document.addEventListener('DOMContentLoaded', function() {
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
});

// Price Estimator Functions
function updateEstimate() {
    const wasteType = document.getElementById('wasteTypeSelect').value;
    const quantity = parseFloat(document.getElementById('quantityInput').value);
    const condition = document.getElementById('conditionSelect').value;
    
    if (!wasteType || !quantity || !condition) {
        return;
    }
    
    // Show estimation process
    document.getElementById('estimationResult').style.display = 'block';
    document.getElementById('aiThinking').style.display = 'block';
    document.getElementById('estimateCard').style.display = 'none';
    
    // Simulate AI calculation (1.5 seconds)
    setTimeout(() => {
        calculateEstimate(wasteType, quantity, condition);
    }, 1500);
}

function calculateEstimate(wasteType, quantity, condition) {
    const baseRate = priceRates[wasteType];
    const conditionMultiplier = conditionMultipliers[condition];
    
    // Calculate bonuses
    const conditionBonus = Math.round((conditionMultiplier - 1) * 100);
    const quantityBonus = quantity > 10 ? 10 : Math.round(quantity / 2);
    
    // Calculate prices
    const subtotal = baseRate * quantity * conditionMultiplier;
    const quantityBonusAmount = subtotal * (quantityBonus / 100);
    const total = Math.round(subtotal + quantityBonusAmount);
    const minPrice = Math.round(total * 0.9);
    const maxPrice = Math.round(total * 1.1);
    
    // Update UI
    document.getElementById('aiThinking').style.display = 'none';
    document.getElementById('estimateCard').style.display = 'block';
    
    document.getElementById('estimatedAmount').textContent = total;
    document.getElementById('minPrice').textContent = minPrice;
    document.getElementById('maxPrice').textContent = maxPrice;
    document.getElementById('marketRate').textContent = baseRate;
    document.getElementById('conditionBonus').textContent = (conditionBonus > 0 ? '+' : '') + conditionBonus + '%';
function proceedWithEstimate() {
    const wasteType = document.getElementById('wasteTypeSelect').value;
    const quantity = document.getElementById('quantityInput').value;
    const estimatedAmount = document.getElementById('estimatedAmount').textContent;
    
    // Save estimate data to localStorage
    localStorage.setItem('priceEstimate', JSON.stringify({
        type: wasteType,
        quantity: quantity,
        estimatedValue: estimatedAmount,
        timestamp: new Date().toISOString()
    }));
    
    closeModal('estimatorModal');
    window.location.href = 'collection.html';
}

// Load chat history on page load
document.addEventListener('DOMContentLoaded', function() {
    const chatHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');
    if (chatHistory.length > 0 && document.getElementById('chatMessages')) {
        // Show last 5 messages
        chatHistory.slice(-5).forEach(msg => {
            if (msg.user) {
                const userDiv = document.createElement('div');
                userDiv.className = 'message user-message';
                userDiv.innerHTML = `
                    <div class="message-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="message-bubble">
                        <p>${msg.user}</p>
                        <span class="message-time">Previous</span>
                    </div>
                `;
                document.getElementById('chatMessages').appendChild(userDiv);
            }
            if (msg.bot) {
                const botDiv = document.createElement('div');
                botDiv.className = 'message bot-message';
                botDiv.innerHTML = `
                    <div class="message-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="message-bubble">
                        <p>${msg.bot}</p>
                        <span class="message-time">Previous</span>
                    </div>
                `;
                document.getElementById('chatMessages').appendChild(botDiv);
            }
        });
    }
});unction proceedWithEstimate() {
    closeModal('estimatorModal');
    window.location.href = 'collection.html';
}
