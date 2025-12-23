// Chatbot with Gemini AI Integration
// Note: config.js must be loaded before this script

// System context for waste management
const SYSTEM_CONTEXT = `You are WasteWise AI, a helpful assistant specialized in waste management, recycling, and environmental sustainability. 
You help users with:
- Identifying recyclable materials
- Providing disposal instructions
- Explaining waste management services
- Answering questions about e-waste, plastic, metal, paper, and other waste types
- Guiding users on how to schedule pickups and sell recyclable items
- Giving tips on reducing waste and living sustainably

Keep responses concise (2-4 sentences), friendly, and practical. Use emojis occasionally to make it engaging.`;

// Rate limiting (free tier gemini-1.5-flash: 15 RPM, we'll use max 10 RPM for safety)
let requestCount = 0;
let requestTimer = null;

function resetRateLimit() {
    requestCount = 0;
}

// Initialize rate limit reset every minute
setInterval(resetRateLimit, 60000);

// Load chat history on page load
document.addEventListener('DOMContentLoaded', function() {
    loadChatHistory();
    
    // Enter key to send message
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
});

function loadChatHistory() {
    const history = JSON.parse(localStorage.getItem('wastewiseChatHistory') || '[]');
    const chatMessages = document.getElementById('chatMessages');
    
    // Clear existing messages except welcome
    const welcomeMessage = chatMessages.querySelector('.bot-message');
    chatMessages.innerHTML = '';
    if (welcomeMessage) {
        chatMessages.appendChild(welcomeMessage);
    }
    
    // Load last 5 messages
    const recentHistory = history.slice(-5);
    recentHistory.forEach(msg => {
        addMessageToUI(msg.text, msg.sender, false);
    });
    
    scrollToBottom();
}

function saveChatHistory(message, sender) {
    let history = JSON.parse(localStorage.getItem('wastewiseChatHistory') || '[]');
    history.push({
        text: message,
        sender: sender,
        timestamp: new Date().toISOString()
    });
    
    // Keep last 50 messages
    if (history.length > 50) {
        history = history.slice(-50);
    }
    
    localStorage.setItem('wastewiseChatHistory', JSON.stringify(history));
}

async function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Check rate limit (10 requests per minute for safety margin)
    if (requestCount >= 10) {
        addMessageToUI('⚠️ Too many requests. Please wait a moment before sending more messages. (Rate limit protection)', 'bot');
        return;
    }
    
    // Add user message
    addMessageToUI(message, 'user');
    saveChatHistory(message, 'user');
    input.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    try {
        requestCount++;
        
        // Call Gemini API
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `${SYSTEM_CONTEXT}\n\nUser question: ${message}`
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 150,  // Reduced from 200 for efficiency
                    topP: 0.9,
                    topK: 40
                }
            })
        });
        
        removeTypingIndicator();
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
            const botResponse = data.candidates[0].content.parts[0].text.trim();
            addMessageToUI(botResponse, 'bot');
            saveChatHistory(botResponse, 'bot');
        } else {
            throw new Error('Invalid API response');
        }
        
    } catch (error) {
        console.error('Gemini API Error:', error);
        removeTypingIndicator();
        
        // Fallback to local responses
        const fallbackResponse = getLocalResponse(message);
        addMessageToUI(fallbackResponse, 'bot');
        saveChatHistory(fallbackResponse, 'bot');
    }
}

function getLocalResponse(message) {
    const msg = message.toLowerCase();
    const words = msg.split(' ');
    
    // Advanced pattern matching with context
    const hasQuestion = msg.includes('how') || msg.includes('what') || msg.includes('where') || msg.includes('when') || msg.includes('why') || msg.includes('can');
    const hasQuantity = /\d+/.test(msg);
    
    // E-waste specific queries
    if ((msg.includes('e-waste') || msg.includes('electronic') || msg.includes('phone') || msg.includes('laptop') || msg.includes('computer') || msg.includes('battery')) && !msg.includes('price')) {
        const responses = [
            '📱 E-waste is valuable! Items like phones, laptops, and batteries contain recoverable materials. Based on current market conditions, you can get ₹15-50/kg depending on the device type. Schedule a free pickup and our team will provide an exact valuation!',
            '💻 Electronic waste requires special handling. We accept all types: smartphones (₹30-50/kg), laptops (₹25-40/kg), tablets (₹20-35/kg), and accessories (₹15-25/kg). Our certified recyclers ensure data security and environmental safety.',
            '🔋 Great question about e-waste! Old electronics are treasure troves of copper, gold, and rare metals. Premium devices in good condition fetch higher prices. Want me to estimate the value of your specific item?'
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Price inquiries with intelligence
    if (msg.includes('price') || msg.includes('value') || msg.includes('worth') || msg.includes('cost') || (msg.includes('how') && msg.includes('much'))) {
        if (msg.includes('plastic')) {
            return `🍾 Plastic pricing varies by type and quality: Clean PET bottles (₹8-12/kg), Mixed plastic (₹5-8/kg), Rigid plastics (₹6-10/kg). ${hasQuantity ? 'For bulk quantities over 50kg, you can get an additional 15-20% bonus!' : 'The cleaner and sorted your plastic, the better the price!'} Use our AI estimator for precise quotes.`;
        }
        if (msg.includes('metal')) {
            return `🔩 Metal prices are excellent right now! Aluminum (₹120-150/kg), Copper (₹400-500/kg), Steel (₹25-35/kg), Brass (₹300-350/kg). ${hasQuantity ? 'Quantities over 20kg qualify for premium rates!' : 'Mixed metals? No problem - we sort and pay accordingly!'}`;
        }
        if (msg.includes('paper') || msg.includes('cardboard')) {
            return `📄 Paper & cardboard current rates: Newspaper (₹10-13/kg), Cardboard boxes (₹8-12/kg), Office paper (₹12-15/kg), Mixed paper (₹6-10/kg). Keep them dry for best value! ${hasQuantity ? 'Bulk deals available for 100kg+' : 'Even small amounts are welcome!'}`;
        }
        if (msg.includes('glass')) {
            return `🍶 Glass bottle prices: Clear glass (₹4-7/kg), Colored glass (₹3-6/kg), Mixed glass (₹2-5/kg). ${hasQuantity ? 'Large quantities (50kg+) get better rates!' : 'Separate by color for premium pricing!'} Handle with care during collection.`;
        }
        // General pricing
        return `💰 Current market rates (updated daily): Metal ₹25-150/kg (highest value!), E-waste ₹15-50/kg, Paper ₹8-15/kg, Plastic ₹5-12/kg, Glass ₹3-7/kg. Prices vary by quality, condition, and quantity. ${hasQuantity ? 'I see you mentioned a quantity - use our AI Price Estimator for an exact quote!' : 'Want a specific estimate? Share details about your items!'}`;
    }
    
    // Recycling process queries
    if (msg.includes('recycle') || msg.includes('recycling')) {
        if (msg.includes('how') || msg.includes('process')) {
            return '♻️ Our recycling process is simple and efficient: 1) Upload photos or describe your items 2) Get instant AI valuation 3) Schedule free doorstep pickup 4) Receive payment within 24hrs after verification. We handle everything from sorting to processing at certified facilities!';
        }
        return '♻️ We recycle all major categories: Plastic (bottles, containers, bags), Paper (newspapers, cardboard, magazines), Metal (cans, wires, appliances), E-waste (electronics), and Glass. Each material is processed differently to maximize recovery. What specific items do you have?';
    }
    
    // Pickup and scheduling
    if (msg.includes('pickup') || msg.includes('schedule') || msg.includes('collect')) {
        const urgency = msg.includes('urgent') || msg.includes('today') || msg.includes('asap');
        if (urgency) {
            return '🚛 For urgent pickups, we offer same-day service in select areas! Visit our Collection page, mark it as "Urgent", and provide your location. Our nearest team will contact you within 2 hours. Standard pickups are scheduled within 24-48 hours.';
        }
        return '🚛 Scheduling pickups is easy! Just: 1) Go to our Collection page 2) Select your waste type & quantity 3) Choose a convenient time slot 4) Add pickup location. We typically confirm within 2-4 hours and arrive on schedule. Minimum pickup: 5kg or ₹50 worth of items.';
    }
    
    // Plastic specific
    if (msg.includes('plastic') && !msg.includes('price')) {
        return '🍾 Plastic waste management tips: Clean and dry plastics fetch 30-40% better prices. Remove labels when possible. PET bottles (water bottles) are most valuable. We accept all types: rigid, flexible, foam. Did you know? 1 ton of recycled plastic saves 5,774 kWh of energy! 🌍';
    }
    
    // Metal specific
    if ((msg.includes('metal') || msg.includes('aluminum') || msg.includes('copper') || msg.includes('steel')) && !msg.includes('price')) {
        return '🔩 Metal is highly valuable! Separate different types for best prices: Aluminum (cans, frames), Copper (wires, pipes), Steel (utensils, cans), Brass (fittings). Even small amounts add up. Pro tip: Remove non-metal parts (plastic, rubber) before selling for premium rates!';
    }
    
    // Paper specific  
    if ((msg.includes('paper') || msg.includes('cardboard') || msg.includes('newspaper')) && !msg.includes('price')) {
        return '📦 Paper recycling tips: Store in a dry place (moisture reduces value by 50%!), flatten cardboard boxes to save space, remove plastic tape and staples. We accept: newspapers, magazines, cardboard, office paper, books. Interesting fact: Recycling 1 ton of paper saves 17 trees! 🌳';
    }
    
    // Glass specific
    if (msg.includes('glass') && !msg.includes('price')) {
        return '🍶 Glass is 100% recyclable! Tips for better value: Separate by color (clear, green, brown), remove caps and lids, rinse out residue. We accept bottles, jars, containers. Broken glass is okay but worth less. Fun fact: Glass can be recycled endlessly without quality loss!';
    }
    
    // How it works
    if ((msg.includes('how') && (msg.includes('work') || msg.includes('use') || msg.includes('start')))) {
        return '⚙️ Getting started is super simple! 1) Use our AI Classifier to identify items (just upload a photo!) 2) Get instant price estimates with our AI tool 3) Schedule free pickup at your convenience 4) Get paid via UPI/Bank within 24hrs. Our AI handles identification and pricing automatically. Ready to begin?';
    }
    
    // Marketplace queries
    if (msg.includes('marketplace') || msg.includes('store') || msg.includes('shop') || msg.includes('buy')) {
        return '🛒 Our marketplace features eco-friendly products and refurbished electronics at 30-60% off retail prices! Every purchase supports the circular economy. Browse sustainable alternatives, upcycled items, and premium refurbished gadgets. Plus, selling your waste earns credits for marketplace purchases! 🌱';
    }
    
    // Account/Login
    if (msg.includes('account') || msg.includes('profile') || msg.includes('login') || msg.includes('sign')) {
        return '👤 Create your WasteWise account to unlock: 📊 Real-time impact tracking (trees saved, CO2 reduced), 🎁 Loyalty rewards & bonus rates, 📅 Easy pickup scheduling & history, 💰 Multiple payment options, 🏆 Achievement badges. Sign up via cart icon → it\'s free and takes just 30 seconds!';
    }
    
    // Environmental impact
    if (msg.includes('environment') || msg.includes('impact') || msg.includes('save') || msg.includes('earth') || msg.includes('planet')) {
        return '🌍 Every item you recycle makes a real difference! On average, our users save: 12kg CO2 per transaction, 2.5 trees through paper recycling, 847 liters of water, 4,000 kWh of energy. Visit our Impact page to see your personal contribution. Together, we\'ve recycled over 500 tons! 💚';
    }
    
    // App/Technology questions
    if (msg.includes('ai') || msg.includes('technology') || msg.includes('app') || msg.includes('feature')) {
        return '🤖 Our AI technology uses advanced computer vision & machine learning to: Identify waste types from photos (95% accuracy!), Predict fair market prices in real-time, Match you with nearest collection points, Optimize pickup routes. All powered by Google\'s Gemini AI for smart, instant responses!';
    }
    
    // Quantity/bulk questions
    if (msg.includes('bulk') || msg.includes('large') || msg.includes('ton') || (hasQuantity && parseInt(msg.match(/\d+/)[0]) > 50)) {
        return '📦 Bulk waste? Excellent! We love large quantities (50kg+ or ₹500+). Benefits: 15-25% bonus rates, Priority pickup slots, Dedicated account manager, Free packaging materials, Direct factory pricing. For industrial quantities (1+ ton), we offer custom contracts with premium rates!';
    }
    
    // Greetings - varied responses
    if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey') || msg.includes('namaste')) {
        const greetings = [
            '👋 Hello! I\'m your WasteWise AI assistant. I can help you with waste pricing, recycling tips, pickup scheduling, and more. What can I help you with today?',
            '🌟 Hi there! Great to see you! I\'m here to help turn your waste into value. Whether you want to check prices, schedule a pickup, or learn about recycling - just ask!',
            '👋 Hey! Welcome to WasteWise! I can identify waste from photos, estimate prices, and guide you through eco-friendly disposal. How can I assist you?'
        ];
        return greetings[Math.floor(Math.random() * greetings.length)];
    }
    
    // Thanks
    if (msg.includes('thank') || msg.includes('thanks')) {
        const thanks = [
            '😊 You\'re most welcome! Happy to help. Feel free to ask anything else about waste management, pricing, or recycling. Have a great day! ♻️',
            '🙏 My pleasure! Remember, every small recycling action creates a big environmental impact. Come back anytime you need assistance! 🌱',
            '💚 Glad I could help! Thanks for choosing WasteWise and contributing to a cleaner planet. Reach out anytime!'
        ];
        return thanks[Math.floor(Math.random() * thanks.length)];
    }
    
    // Goodbye
    if (msg.includes('bye') || msg.includes('goodbye') || msg.includes('see you')) {
        return '👋 Goodbye! Thanks for using WasteWise. Remember: your waste is someone\'s resource! Come back soon, and keep recycling! 🌍💚';
    }
    
    // Help/confused
    if (msg.includes('help') || msg.includes('confused') || msg.includes('don\'t know') || msg.includes('not sure')) {
        return '💡 No worries, I\'m here to help! I can assist with: 📸 Identifying waste from photos (AI Classifier), 💰 Getting price estimates (AI Estimator), 🚛 Scheduling pickups, ♻️ Recycling tips & best practices, 📊 Tracking your environmental impact. What would you like to start with?';
    }
    
    // Default intelligent response
    const defaultResponses = [
        '🤔 Interesting question! Based on what you\'re asking, I\'d recommend: 1) Use our AI Classifier to identify specific items 2) Get instant price quotes with our Estimator 3) Browse our Education section for recycling guides. Could you provide more details about your waste items?',
        '💭 I want to give you the most accurate answer! Could you be more specific? For example: "How much for 10kg plastic bottles?" or "Schedule pickup for e-waste" or "What\'s the process for recycling paper?" I\'m here to help!',
        '🎯 Let me help you better! I can: Check real-time prices for any waste type, Identify items from photos instantly, Guide you through recycling processes, Schedule convenient pickups. What would you like to explore first?'
    ];
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

function showTypingIndicator() {
    const chatMessages = document.getElementById('chatMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message typing-indicator';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-bubble">
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    chatMessages.appendChild(typingDiv);
    scrollToBottom();
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
        indicator.remove();
    }
}

function addMessageToUI(text, sender, save = true) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const time = new Date().toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
    });
    
    const avatarIcon = sender === 'user' ? 'fa-user' : 'fa-robot';
    
    messageDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas ${avatarIcon}"></i>
        </div>
        <div class="message-bubble">
            <p>${text}</p>
            <span class="message-time">${time}</span>
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
}

function scrollToBottom() {
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function askQuestion(question) {
    document.getElementById('chatInput').value = question;
    sendMessage();
}

function clearChat() {
    if (confirm('Clear all chat history?')) {
        localStorage.removeItem('wastewiseChatHistory');
        const chatMessages = document.getElementById('chatMessages');
        chatMessages.innerHTML = `
            <div class="message bot-message">
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-bubble">
                    <p>Hello! 👋 I'm your AI waste management assistant. How can I help you today?</p>
                    <span class="message-time">Just now</span>
                </div>
            </div>
        `;
    }
}

// Make functions globally accessible for HTML onclick handlers
window.askQuestion = askQuestion;
window.sendMessage = sendMessage;
window.clearChat = clearChat;

// Add CSS for typing indicator
const style = document.createElement('style');
style.textContent = `
.typing-dots {
    display: flex;
    gap: 5px;
    padding: 5px 0;
}

.typing-dots span {
    width: 8px;
    height: 8px;
    background: #667eea;
    border-radius: 50%;
    animation: typing 1.4s infinite;
}

.typing-dots span:nth-child(2) {
    animation-delay: 0.2s;
}

.typing-dots span:nth-child(3) {
    animation-delay: 0.4s;
}
`;
document.head.appendChild(style);
