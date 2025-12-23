// Chatbot with Gemini AI Integration
import { GEMINI_API_KEY, GEMINI_API_URL } from './config.js';

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
    
    // Waste management responses
    if (msg.includes('recycle') || msg.includes('recycling')) {
        return '♻️ We accept plastic, paper, metal, glass, and e-waste! Each type should be sorted separately. Would you like specific instructions for any material?';
    }
    if (msg.includes('e-waste') || msg.includes('electronic')) {
        return '📱 E-waste includes phones, computers, batteries, and cables. We offer special collection for electronics. Schedule a pickup on our Collection page!';
    }
    if (msg.includes('pickup') || msg.includes('schedule') || msg.includes('collect')) {
        return '🚛 Schedule a pickup through our Collection page! Just select your waste type, quantity, and preferred time. We typically respond within 24 hours.';
    }
    if (msg.includes('price') || msg.includes('value') || msg.includes('worth') || msg.includes('sell')) {
        return '💰 Prices vary by material: Metal (₹20-30/kg), E-waste (₹15-50/kg), Paper (₹8-12/kg), Plastic (₹5-10/kg). Use our AI Price Estimator for exact quotes!';
    }
    if (msg.includes('plastic')) {
        return '🍾 Plastic bottles, containers, and bags are recyclable! Clean them before disposal. Worth ₹5-10 per kg. Drop in blue bins or schedule a pickup.';
    }
    if (msg.includes('metal') || msg.includes('can') || msg.includes('aluminum')) {
        return '🔩 Metal scraps, cans, and utensils are valuable! Worth ₹20-30 per kg. Clean and separate from other waste. We accept all metal types.';
    }
    if (msg.includes('paper') || msg.includes('cardboard')) {
        return '📦 Paper and cardboard are recyclable! Keep them dry and clean. Worth ₹8-12 per kg. Great for making new paper products!';
    }
    if (msg.includes('glass')) {
        return '🍶 Glass bottles and jars are recyclable! Clean and separate by color if possible. Worth ₹3-6 per kg. Handle with care!';
    }
    if (msg.includes('how') && msg.includes('work')) {
        return '⚙️ Simple! 1) Browse our marketplace or list your recyclables 2) Schedule a pickup 3) Get paid or shop sustainably. Our AI helps identify and price items!';
    }
    if (msg.includes('marketplace') || msg.includes('store') || msg.includes('shop')) {
        return '🛒 Our marketplace has eco-friendly products and refurbished items! Browse sustainable alternatives and support the circular economy.';
    }
    if (msg.includes('account') || msg.includes('profile') || msg.includes('login')) {
        return '👤 Create an account to track your impact, manage pickups, and earn rewards! Click the cart icon to get started.';
    }
    
    // Greetings
    if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
        return '👋 Hello! How can I help you with waste management today? Ask me about recycling, pricing, or scheduling pickups!';
    }
    if (msg.includes('thank')) {
        return '😊 You\'re welcome! Let me know if you need anything else. Happy recycling!';
    }
    if (msg.includes('bye') || msg.includes('goodbye')) {
        return '👋 Goodbye! Thanks for choosing WasteWise. Come back anytime!';
    }
    
    // Default response
    return '🤔 I can help you with recycling questions, waste pricing, scheduling pickups, and more! Try asking about specific materials like "How do I recycle e-waste?" or "What are plastic prices?"';
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
