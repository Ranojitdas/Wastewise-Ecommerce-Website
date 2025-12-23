// Price Estimator with Gemini AI Integration
// Note: config.js must be loaded before this script

// Rate limiting for free tier (gemini-1.5-flash-8b: 15 RPM)
let apiRequestCount = 0;
let lastRequestTime = Date.now();

function canMakeApiRequest() {
    const now = Date.now();
    const oneMinute = 60000;
    
    // Reset counter if a minute has passed
    if (now - lastRequestTime > oneMinute) {
        apiRequestCount = 0;
        lastRequestTime = now;
    }
    
    // Allow max 10 requests per minute (leaving buffer under 15 RPM limit)
    if (apiRequestCount >= 10) {
        console.log('⚠️ Rate limit reached, using fallback insights');
        return false;
    }
    
    apiRequestCount++;
    return true;
}

// Price estimation rates (per kg in INR)
const priceRates = {
    plastic: 7,
    paper: 10,
    metal: 25,
    ewaste: 30,
    glass: 4
};

// High-value item detection (per piece pricing)
const highValueItems = {
    // Smartphones (iPhone models)
    'iphone 15': { min: 35000, max: 55000, avg: 45000 },
    'iphone 14': { min: 28000, max: 42000, avg: 35000 },
    'iphone 13': { min: 22000, max: 35000, avg: 28000 },
    'iphone 12': { min: 18000, max: 28000, avg: 23000 },
    'iphone 11': { min: 12000, max: 20000, avg: 16000 },
    'iphone': { min: 8000, max: 15000, avg: 12000 },
    
    // Samsung phones
    'samsung galaxy s24': { min: 30000, max: 45000, avg: 38000 },
    'samsung galaxy s23': { min: 25000, max: 38000, avg: 32000 },
    'samsung galaxy': { min: 8000, max: 20000, avg: 14000 },
    
    // Laptops
    'macbook pro': { min: 35000, max: 70000, avg: 52000 },
    'macbook air': { min: 25000, max: 50000, avg: 38000 },
    'dell laptop': { min: 8000, max: 25000, avg: 16000 },
    'hp laptop': { min: 7000, max: 22000, avg: 14000 },
    'lenovo laptop': { min: 8000, max: 24000, avg: 16000 },
    'laptop': { min: 5000, max: 15000, avg: 10000 },
    
    // Tablets
    'ipad': { min: 10000, max: 30000, avg: 20000 },
    'tablet': { min: 3000, max: 12000, avg: 7000 },
    
    // Other electronics
    'smart watch': { min: 2000, max: 8000, avg: 5000 },
    'airpods': { min: 3000, max: 8000, avg: 5500 },
    'camera': { min: 5000, max: 25000, avg: 15000 }
};

const conditionMultipliers = {
    excellent: 1.3,
    good: 1.1,
    fair: 1.0,
    poor: 0.7
};

let uploadedImageData = null;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    const imageUploadArea = document.getElementById('imageUploadArea');
    const imageInput = document.getElementById('estimatorImageInput');
    
    // Set initial step for kg
    updateQuantityStep();
    
    // Add event listener for unit selector to update step
    const unitSelect = document.getElementById('unitSelect');
    if (unitSelect) {
        unitSelect.addEventListener('change', updateQuantityStep);
    }
    
    // Add event listener for estimate button
    const estimateBtn = document.getElementById('getEstimateBtn');
    console.log('Looking for button with ID: getEstimateBtn');
    console.log('Button element:', estimateBtn);
    
    if (estimateBtn) {
        console.log('✓ Estimate button found, adding click listener');
        estimateBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('✓✓ Estimate button clicked!');
            getAIEstimate();
        });
    } else {
        console.error('✗ Estimate button not found!');
    }
    
    if (imageUploadArea) {
        imageUploadArea.addEventListener('click', () => imageInput.click());
        
        imageUploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            imageUploadArea.style.borderColor = '#667eea';
            imageUploadArea.style.background = 'rgba(102, 126, 234, 0.05)';
        });
        
        imageUploadArea.addEventListener('dragleave', () => {
            imageUploadArea.style.borderColor = '';
            imageUploadArea.style.background = '';
        });
        
        imageUploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            imageUploadArea.style.borderColor = '';
            imageUploadArea.style.background = '';
            
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                handleImageUpload(file);
            }
        });
        
        imageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                handleImageUpload(file);
            }
        });
    }
});

function handleImageUpload(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        uploadedImageData = e.target.result;
        
        // Show preview
        const preview = document.getElementById('uploadedImagePreview');
        preview.innerHTML = `
            <div class="image-preview">
                <img src="${e.target.result}" alt="Uploaded item">
                <button class="remove-image-btn" onclick="removeImage()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        preview.style.display = 'block';
        document.getElementById('imageUploadArea').style.display = 'none';
    };
    reader.readAsDataURL(file);
}

function removeImage() {
    uploadedImageData = null;
    document.getElementById('uploadedImagePreview').style.display = 'none';
    document.getElementById('imageUploadArea').style.display = 'flex';
    document.getElementById('estimatorImageInput').value = '';
}

function updateQuantityStep() {
    const unit = document.getElementById('unitSelect').value;
    const quantityInput = document.getElementById('quantityInput');
    
    if (unit === 'kg') {
        quantityInput.step = '0.5';
        quantityInput.min = '0.5';
    } else {
        quantityInput.step = '1';
        quantityInput.min = '1';
    }
}

function showValidationError(elementId, message) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    // Add error styling
    element.style.border = '2px solid #ff4444';
    element.style.animation = 'shake 0.5s';
    
    // Show alert with message
    alert(message);
    
    // Scroll to the field
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    element.focus();
    
    // Remove error styling after a delay
    setTimeout(() => {
        element.style.border = '';
        element.style.animation = '';
    }, 3000);
}

async function getAIEstimate() {
    console.log('=== getAIEstimate function called! ===');
    
    const wasteType = document.getElementById('wasteTypeSelect').value;
    const productName = document.getElementById('productNameInput').value.trim();
    const quantity = parseFloat(document.getElementById('quantityInput').value);
    const unit = document.getElementById('unitSelect').value;
    const condition = document.getElementById('conditionSelect').value;
    const description = document.getElementById('descriptionInput').value;
    
    console.log('Form values:', { wasteType, productName, quantity, unit, condition });
    
    // Validation with better visual feedback
    if (!wasteType) {
        showValidationError('wasteTypeSelect', '⚠️ Please select a waste type');
        return;
    }
    if (!quantity || quantity <= 0 || isNaN(quantity)) {
        showValidationError('quantityInput', '⚠️ Please enter a valid quantity (greater than 0)');
        return;
    }
    if (!condition) {
        showValidationError('conditionSelect', '⚠️ Please select item condition');
        return;
    }
    
    // Show result section with thinking animation
    document.getElementById('estimationResult').style.display = 'block';
    document.getElementById('aiThinking').style.display = 'block';
    document.getElementById('estimateCard').style.display = 'none';
    
    // Scroll to results
    document.getElementById('estimationResult').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Check for high-value items (like specific phone models)
    let estimatedPrice, minPrice, maxPrice;
    let isHighValueItem = false;
    let itemValue = null;
    let quantityBonus = 0; // Initialize for all calculations
    
    if (productName && (unit === 'pieces' || unit === 'units')) {
        const lowerProductName = productName.toLowerCase();
        
        // Check for exact or partial match
        for (const [key, value] of Object.entries(highValueItems)) {
            if (lowerProductName.includes(key)) {
                itemValue = value;
                isHighValueItem = true;
                break;
            }
        }
        
        if (isHighValueItem && itemValue) {
            // Calculate based on item value per piece
            const conditionMultiplier = conditionMultipliers[condition] || 1.0;
            const basePrice = itemValue.avg * quantity * conditionMultiplier;
            
            estimatedPrice = Math.round(basePrice);
            minPrice = Math.round(itemValue.min * quantity * conditionMultiplier * 0.9);
            maxPrice = Math.round(itemValue.max * quantity * conditionMultiplier * 1.1);
            
            const conditionBonusPercent = Math.round((conditionMultiplier - 1) * 100);
            
            // Check rate limit before making API call
            if (canMakeApiRequest()) {
                try {
                    const aiInsights = await getGeminiInsights(wasteType, productName, quantity, unit, condition, description, uploadedImageData);
                    setTimeout(() => {
                        displayEstimateResults(estimatedPrice, minPrice, maxPrice, Math.round(itemValue.avg), conditionBonusPercent, quantityBonus, aiInsights);
                    }, 3500);
                    return;
                } catch (error) {
                    console.error('Gemini API Error:', error);
                if (error.message.includes('429')) {
                    console.log('⚠️ API rate limit reached, using local insights instead');
                }
                const fallbackInsights = getLocalInsights(wasteType, productName, quantity, unit, condition);
                setTimeout(() => {
                    displayEstimateResults(estimatedPrice, minPrice, maxPrice, Math.round(itemValue.avg), conditionBonusPercent, quantityBonus, fallbackInsights);
                }, 3500);
            }
            return;
        }
    }
    
    // Standard calculation for bulk waste items
    let baseRate = priceRates[wasteType] || 10;
    const conditionMultiplier = conditionMultipliers[condition] || 1.0;
    
    // Convert pieces/units to approximate kg for calculation
    let effectiveQuantity = quantity;
    if (unit === 'pieces' || unit === 'units') {
        // Approximate weight conversions
        const pieceWeights = {
            plastic: 0.05,  // 50g per bottle/container
            paper: 0.1,     // 100g per item
            metal: 0.2,     // 200g per can/item
            ewaste: 0.3,    // 300g per device (phones, etc.)
            glass: 0.4      // 400g per bottle
        };
        effectiveQuantity = quantity * (pieceWeights[wasteType] || 0.2);
    }
    
    // Quantity bonus
    // Quantity bonus calculation
    if (effectiveQuantity >= 50) quantityBonus = 15;
    else if (effectiveQuantity >= 20) quantityBonus = 10;
    else if (effectiveQuantity >= 10) quantityBonus = 5;
    
    const conditionBonusPercent = Math.round((conditionMultiplier - 1) * 100);
    const totalMultiplier = conditionMultiplier * (1 + quantityBonus / 100);
    
    estimatedPrice = Math.round(baseRate * effectiveQuantity * totalMultiplier);
    minPrice = Math.round(estimatedPrice * 0.9);
    maxPrice = Math.round(estimatedPrice * 1.1);
    
    // Check rate limit before making API call
    if (canMakeApiRequest()) {
        try {
            // Get AI insights using Gemini
            const aiInsights = await getGeminiInsights(wasteType, productName, quantity, unit, condition, description, uploadedImageData);
            
            // Wait a bit for AI calculation effect
            setTimeout(() => {
                displayEstimateResults(estimatedPrice, minPrice, maxPrice, baseRate, conditionBonusPercent, quantityBonus, aiInsights);
            }, 3500);
            return;
        } catch (error) {
            console.error('Gemini API Error:', error);
        }
    }
    
    // Fallback to local insights (rate limited or API error)
        const fallbackInsights = getLocalInsights(wasteType, productName, quantity, unit, condition);
        setTimeout(() => {
            displayEstimateResults(estimatedPrice, minPrice, maxPrice, baseRate, conditionBonusPercent, quantityBonus, fallbackInsights);
        }, 3500);
    }
}

async function getGeminiInsights(wasteType, productName, quantity, unit, condition, description, imageData) {
    const wasteTypeNames = {
        plastic: 'Plastic waste (bottles, containers, bags)',
        paper: 'Paper/Cardboard',
        metal: 'Metal scrap',
        ewaste: 'Electronic waste (e-waste)',
        glass: 'Glass items'
    };
    
    const prompt = `You are a waste management pricing expert. Analyze this waste item for sale:

Type: ${wasteTypeNames[wasteType]}
${productName ? `Product: ${productName}` : ''}
Quantity: ${quantity} ${unit}
Condition: ${condition}
${description ? `Description: ${description}` : ''}
${imageData ? 'An image of the item was provided.' : ''}

Provide a brief 2-3 sentence analysis covering:
1. Market demand for this ${productName ? 'specific product/item' : 'waste type'}
2. Specific factors affecting its value
3. A helpful tip for the seller

Keep it concise, practical, and encouraging. Use simple language.`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: prompt
                }]
            }],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 100,  // Reduced from 150 for efficiency
                topP: 0.9,
                topK: 40
            }
        })
    });
    
    if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text.trim();
    } else {
        throw new Error('Invalid API response');
    }
}

function getLocalInsights(wasteType, productName, quantity, unit, condition) {
    const productInfo = productName ? ` (${productName})` : '';
    const quantityText = `${quantity} ${unit}`;
    const isLargeQuantity = (unit === 'kg' && quantity >= 20) || (unit === 'pieces' && quantity >= 50);
    const isBulk = (unit === 'kg' && quantity >= 100) || (unit === 'pieces' && quantity >= 200);
    
    // Condition-based insights
    const conditionInsights = {
        excellent: 'Your items are in excellent condition, which significantly increases their market value! ',
        good: 'Good condition items are in high demand among recyclers and refurbishers. ',
        fair: 'Fair condition items still have value, though sorting and cleaning can improve prices. ',
        poor: 'Even poor condition items contain valuable raw materials for processing. '
    };
    
    // Quantity-based bonus mentions
    let quantityBonus = '';
    if (isBulk) {
        quantityBonus = ' 🎉 Bulk quantity detected! You qualify for premium industrial rates (15-25% above standard). ';
    } else if (isLargeQuantity) {
        quantityBonus = ' 💰 Great quantity! You\'re eligible for volume discounts (10-15% bonus rate). ';
    }
    
    // Intelligent product-specific insights
    const productLower = (productName || '').toLowerCase();
    
    // High-value electronics detection
    if (productLower.includes('iphone') || productLower.includes('macbook') || productLower.includes('ipad')) {
        return `${conditionInsights[condition]}Apple products hold exceptional resale value! ${productInfo} in ${condition} condition can fetch premium prices due to high demand in refurbishment markets. 📱 ${quantityBonus}Market analysis shows ${condition === 'excellent' ? '90-95%' : condition === 'good' ? '75-85%' : '50-65%'} of original retail value recovery. Include original accessories (chargers, boxes) for maximum valuation. Pro tip: Data erasure documentation increases buyer confidence!`;
    }
    
    if (productLower.includes('samsung') || productLower.includes('galaxy')) {
        return `${conditionInsights[condition]}Samsung devices${productInfo} are highly sought after! ${quantityBonus}The ${condition} condition suggests ${condition === 'excellent' ? 'premium tier' : condition === 'good' ? 'standard refurb' : 'parts harvesting'} pricing. Current market: Strong demand for screens, batteries, and components. Galaxy S-series and Note devices command 20-30% higher rates than standard models.`;
    }
    
    if (productLower.includes('laptop') || productLower.includes('notebook')) {
        return `${conditionInsights[condition]}Laptops${productInfo} have excellent recycling value! Working condition: High resale potential. Non-working: Components (RAM, SSD, motherboard) are valuable. ${quantityBonus}${condition === 'excellent' || condition === 'good' ? 'Consider wiping data and reinstalling OS for 15-20% better pricing.' : 'Even broken laptops contain ₹800-2000 worth of recoverable parts!'} Market trend: Gaming laptops and business-grade ThinkPads fetch premium rates.`;
    }
    
    // Detailed waste-type insights
    const insights = {
        plastic: `${conditionInsights[condition]}Plastic waste${productInfo} shows strong market demand this quarter! Your ${quantityText} can be processed into: pellets for manufacturing (highest value), textile fibers, or construction materials. ${quantityBonus}Market intelligence: PET (water bottles) prices are up 12% this month due to beverage industry demand. Clean, sorted plastic earns 30-40% more. 🍾 Pro strategy: Remove labels and caps, flatten bottles - processors pay premium for prepared materials!`,
        
        paper: `${conditionInsights[condition]}Paper products${productInfo} are seeing increased demand from paper mills! Your ${quantityText} can become: new paper products, cardboard packaging, or molded fiber products. ${quantityBonus}Market analysis: Cardboard prices increased 8% due to e-commerce packaging needs. ${condition === 'excellent' || condition === 'good' ? 'Clean, dry paper without contaminants qualifies for Grade A pricing!' : 'Mixed paper still valuable - mills have advanced sorting technology.'} 📄 Environmental impact: Your quantity saves approximately ${Math.round(quantity * (unit === 'kg' ? 17 : 0.5))} trees! 🌳`,
        
        metal: `${conditionInsights[condition]}Metal scrap${productInfo} has EXCELLENT market value right now! Your ${quantityText} contains recoverable: ${productLower.includes('copper') ? 'copper (₹400-500/kg - highest tier!)' : productLower.includes('aluminum') ? 'aluminum (₹120-150/kg - premium grade)' : 'mixed metals (₹25-150/kg depending on composition)'}. ${quantityBonus}Market update: Metal prices are strong this quarter - industrial demand is up 15%. 🔩 Expert tip: Separate copper wires from steel casings for 3x better pricing! Non-ferrous metals (copper, aluminum, brass) command premium rates. Your estimated value could increase by 40-60% with proper sorting.`,
        
        ewaste: `${conditionInsights[condition]}E-waste${productInfo} is a goldmine of valuable materials! Your ${quantityText} contains: precious metals (gold, silver, palladium worth ₹50-200 per device), copper wiring (₹400/kg), rare earth elements, and reusable components. ${quantityBonus}${condition === 'excellent' || condition === 'good' ? 'Working electronics have DUAL value: refurbishment market (60-80% of retail) + materials recovery. Consider testing before selling!' : 'Non-working devices still profitable - circuit boards alone worth ₹300-500/kg.'} 📱 Market insight: ${quantity >= 5 ? 'Bulk e-waste buyers offer 20-30% above standard rates for your quantity!' : 'Even single devices are valuable - accumulate 5+ items for best deals.'} Fun fact: 1 ton of e-waste contains more gold than 17 tons of gold ore!`,
        
        glass: `${conditionInsights[condition]}Glass waste${productInfo} is 100% recyclable infinitely without quality loss! Your ${quantityText} can become: new bottles/jars (closed-loop recycling), fiberglass insulation, or decorative tiles. ${quantityBonus}Market data: Clear glass (highest value) is in demand for beverage bottles. Green glass for wine bottles (moderate). Brown/amber for beer bottles. ${condition === 'excellent' ? 'Intact, clean bottles can be sterilized and directly reused - 30% premium!' : 'Broken glass is fine - cullet (crushed glass) melts easier than raw materials, saving 30% energy!'} 🍶 Sustainability note: Glass recycling reduces CO2 emissions by 40% compared to new production. Your contribution: ${Math.round(quantity * (unit === 'kg' ? 0.3 : 0.15))}kg CO2 saved!`
    };
    
    return insights[wasteType] || `${conditionInsights[condition]}Your ${quantityText} of ${wasteType}${productInfo} shows solid recycling potential! ${quantityBonus}Based on current market conditions and material composition analysis, this waste stream maintains consistent demand. Quality preprocessing (cleaning, sorting, removing contaminants) can increase final valuation by 25-40%. ♻️ Market position: ${condition === 'excellent' || condition === 'good' ? 'Premium tier' : 'Standard processing tier'}. Recommendation: ${isLargeQuantity ? 'Consider direct industrial buyer connections for best rates!' : 'Accumulate similar items to reach bulk thresholds for bonus pricing!'}`;
}

function displayEstimateResults(estimatedPrice, minPrice, maxPrice, baseRate, conditionBonus, quantityBonus, insights) {
    // Hide thinking, show results
    document.getElementById('aiThinking').style.display = 'none';
    document.getElementById('estimateCard').style.display = 'block';
    
    // Animate price counter
    animateValue('estimatedAmount', 0, estimatedPrice, 1000);
    
    // Update values
    document.getElementById('minPrice').textContent = minPrice.toLocaleString('en-IN');
    document.getElementById('maxPrice').textContent = maxPrice.toLocaleString('en-IN');
    document.getElementById('marketRate').textContent = baseRate.toLocaleString('en-IN');
    document.getElementById('conditionBonus').textContent = conditionBonus >= 0 ? `+${conditionBonus}%` : `${conditionBonus}%`;
    document.getElementById('quantityBonus').textContent = `+${quantityBonus}%`;
    document.getElementById('aiInsights').textContent = insights;
    
    // Save to localStorage
    const estimate = {
        price: estimatedPrice,
        minPrice,
        maxPrice,
        wasteType: document.getElementById('wasteTypeSelect').value,
        quantity: document.getElementById('quantityInput').value,
        condition: document.getElementById('conditionSelect').value,
        insights,
        timestamp: new Date().toISOString()
    };
    
    let history = JSON.parse(localStorage.getItem('estimateHistory') || '[]');
    history.unshift(estimate);
    history = history.slice(0, 10);
    localStorage.setItem('estimateHistory', JSON.stringify(history));
}

function animateValue(id, start, end, duration) {
    const element = document.getElementById(id);
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.round(current);
    }, 16);
}

function resetEstimator() {
    document.getElementById('wasteTypeSelect').value = '';
    document.getElementById('productNameInput').value = '';
    document.getElementById('quantityInput').value = '';
    document.getElementById('unitSelect').value = 'kg';
    document.getElementById('conditionSelect').value = '';
    document.getElementById('descriptionInput').value = '';
    document.getElementById('estimationResult').style.display = 'none';
    removeImage();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function proceedWithEstimate() {
    const estimate = {
        price: document.getElementById('estimatedAmount').textContent,
        wasteType: document.getElementById('wasteTypeSelect').value,
        productName: document.getElementById('productNameInput').value,
        quantity: document.getElementById('quantityInput').value
    };
    
    // Save to session storage and redirect
    sessionStorage.setItem('pendingEstimate', JSON.stringify(estimate));
    alert('✅ Great! Redirecting to collection scheduling...');
    
    // Redirect after short delay
    setTimeout(() => {
        window.location.href = 'collection.html';
    }, 1000);
}

// Make functions globally accessible for HTML onclick handlers
window.getAIEstimate = getAIEstimate;
window.resetEstimator = resetEstimator;
window.proceedWithEstimate = proceedWithEstimate;

// Add shake animation CSS
const style = document.createElement('style');
style.textContent = `
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
}
`;
document.head.appendChild(style);
