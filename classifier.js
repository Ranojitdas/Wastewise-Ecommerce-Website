// AI Waste Classifier with Gemini Vision API
// Note: config.js must be loaded before this script

// Waste database for categorization
const wasteDatabase = {
    plastic: {
        type: 'Plastic Container/Bottle',
        category: '♻️ Recyclable Plastic',
        value: '₹5-10 per kg',
        disposal: 'Clean and place in blue recycling bin',
        confidence: 92,
        icon: '🍾'
    },
    paper: {
        type: 'Paper/Cardboard',
        category: '📄 Recyclable Paper',
        value: '₹8-12 per kg',
        disposal: 'Keep dry and place in paper recycling bin',
        confidence: 88,
        icon: '📦'
    },
    metal: {
        type: 'Metal Scrap',
        category: '🔩 Metal Recyclable',
        value: '₹20-30 per kg',
        disposal: 'Clean and separate from other waste',
        confidence: 90,
        icon: '🔧'
    },
    ewaste: {
        type: 'Electronic Waste',
        category: '📱 E-Waste',
        value: '₹15-50 per kg',
        disposal: 'Take to authorized e-waste collection center',
        confidence: 85,
        icon: '📱'
    },
    glass: {
        type: 'Glass Container',
        category: '🍶 Recyclable Glass',
        value: '₹3-6 per kg',
        disposal: 'Clean and place in glass recycling bin',
        confidence: 87,
        icon: '🍶'
    },
    organic: {
        type: 'Organic/Food Waste',
        category: '🥬 Compostable',
        value: 'Not for sale (Compost)',
        disposal: 'Compost or use for biogas',
        confidence: 85,
        icon: '🥬'
    }
};

// Rate limiting for Gemini API
let classifierRequestCount = 0;
let lastClassifierRequest = Date.now();

function canMakeClassifierRequest() {
    const now = Date.now();
    const oneMinute = 60000;
    
    if (now - lastClassifierRequest > oneMinute) {
        classifierRequestCount = 0;
        lastClassifierRequest = now;
    }
    
    if (classifierRequestCount >= 8) {
        return false;
    }
    
    classifierRequestCount++;
    return true;
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.getElementById('uploadArea');
    const imageInput = document.getElementById('imageInput');
    
    if (uploadArea && imageInput) {
        // Click to upload
        uploadArea.addEventListener('click', () => imageInput.click());
        
        // Drag and drop handlers
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#667eea';
            uploadArea.style.background = 'rgba(102, 126, 234, 0.05)';
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
            } else {
                alert('Please upload a valid image file (JPG, PNG, JPEG)');
            }
        });
        
        // File input change
        imageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                processImage(file);
            }
        });
    }
});

// Process uploaded image
function processImage(file) {
    // Validate file size (max 4MB for Gemini API)
    if (file.size > 4 * 1024 * 1024) {
        alert('Image size should be less than 4MB. Please upload a smaller image.');
        return;
    }
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const imageData = e.target.result;
        
        // Show image preview
        const resultImage = document.getElementById('resultImage');
        resultImage.innerHTML = `<img src="${imageData}" alt="Uploaded waste item">`;
        
        // Show result section with scanning animation
        document.getElementById('uploadArea').style.display = 'none';
        document.getElementById('classificationResult').style.display = 'block';
        document.getElementById('scanningAnimation').style.display = 'block';
        document.getElementById('resultDetails').style.display = 'none';
        
        // Scroll to results
        document.getElementById('classificationResult').scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Classify image with AI
        classifyImageWithAI(imageData);
    };
    
    reader.readAsDataURL(file);
}

// Classify image using Gemini Vision API
async function classifyImageWithAI(imageDataUrl) {
    try {
        // Check rate limit
        if (!canMakeClassifierRequest()) {
            console.log('⚠️ Rate limit reached, using fallback classification');
            setTimeout(() => classifyWithFallback(imageDataUrl), 1500);
            return;
        }
        
        // Extract base64 data (remove data:image/...;base64, prefix)
        const base64Data = imageDataUrl.split(',')[1];
        const mimeType = imageDataUrl.split(';')[0].split(':')[1];
        
        // Call Gemini Vision API
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        {
                            text: `Analyze this waste item image and classify it into ONE of these categories: plastic, paper, metal, ewaste, glass, or organic.

Identify:
1. Main waste type (plastic/paper/metal/ewaste/glass/organic)
2. Specific item name (e.g., "Plastic Water Bottle", "Cardboard Box", "Aluminum Can")
3. Condition (excellent/good/fair/poor)
4. Estimated quantity in kg if visible

Respond in this EXACT format:
CATEGORY: [one of: plastic/paper/metal/ewaste/glass/organic]
ITEM: [specific item name]
CONDITION: [excellent/good/fair/poor]
QUANTITY: [number in kg or "unknown"]
CONFIDENCE: [number 1-100]

Be concise and specific.`
                        },
                        {
                            inline_data: {
                                mime_type: mimeType,
                                data: base64Data
                            }
                        }
                    ]
                }],
                generationConfig: {
                    temperature: 0.4,
                    maxOutputTokens: 200,
                    topP: 0.8,
                    topK: 40
                }
            })
        });
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
            const aiResponse = data.candidates[0].content.parts[0].text;
            parseAndDisplayResults(aiResponse);
        } else {
            throw new Error('Invalid API response');
        }
        
    } catch (error) {
        console.error('AI Classification Error:', error);
        classifyWithFallback(imageDataUrl);
    }
}

// Parse AI response and display results
function parseAndDisplayResults(aiResponse) {
    console.log('AI Response:', aiResponse);
    
    // Parse the response
    const lines = aiResponse.split('\n');
    let category = 'plastic';
    let itemName = 'Waste Item';
    let confidence = 85;
    
    lines.forEach(line => {
        if (line.includes('CATEGORY:')) {
            const match = line.match(/CATEGORY:\s*(\w+)/i);
            if (match) category = match[1].toLowerCase();
        } else if (line.includes('ITEM:')) {
            const match = line.match(/ITEM:\s*(.+)/i);
            if (match) itemName = match[1].trim();
        } else if (line.includes('CONFIDENCE:')) {
            const match = line.match(/CONFIDENCE:\s*(\d+)/i);
            if (match) confidence = parseInt(match[1]);
        }
    });
    
    // Get waste data
    const wasteData = wasteDatabase[category] || wasteDatabase['plastic'];
    
    // Display results
    displayClassificationResults(wasteData, itemName, confidence);
}

// Fallback classification using color analysis
function classifyWithFallback(imageDataUrl) {
    const img = new Image();
    img.onload = function() {
        const category = analyzeImageColors(img);
        const wasteData = wasteDatabase[category];
        const confidence = wasteData.confidence - Math.floor(Math.random() * 10);
        
        setTimeout(() => {
            displayClassificationResults(wasteData, wasteData.type, confidence);
        }, 1000);
    };
    img.src = imageDataUrl;
}

// Analyze image colors for fallback classification
function analyzeImageColors(img) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    
    // Sample multiple points
    const samples = [];
    for (let i = 0; i < 5; i++) {
        const x = Math.floor(img.width * (0.2 + i * 0.15));
        const y = Math.floor(img.height / 2);
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        samples.push({ r: pixel[0], g: pixel[1], b: pixel[2] });
    }
    
    // Calculate average color
    const avg = samples.reduce((acc, s) => ({
        r: acc.r + s.r / samples.length,
        g: acc.g + s.g / samples.length,
        b: acc.b + s.b / samples.length
    }), { r: 0, g: 0, b: 0 });
    
    // Classify based on color
    if (avg.b > avg.r + 20 && avg.b > avg.g + 20) return 'plastic';
    if (avg.g > avg.r + 20 && avg.g > avg.b + 20) return 'glass';
    if (avg.r > 200 && avg.g > 180 && avg.b > 150) return 'paper';
    if (avg.r > avg.g + 30 && avg.r > avg.b + 30) return 'metal';
    if (avg.r < 80 && avg.g < 80 && avg.b < 80) return 'ewaste';
    
    return 'plastic';
}

// Display classification results
function displayClassificationResults(wasteData, itemName, confidence) {
    // Hide scanning animation
    document.getElementById('scanningAnimation').style.display = 'none';
    
    // Update result details
    document.getElementById('confidenceValue').textContent = confidence + '%';
    document.getElementById('wasteType').textContent = itemName;
    document.getElementById('wasteCategory').textContent = wasteData.category;
    document.getElementById('estimatedValue').textContent = wasteData.value;
    document.getElementById('disposalMethod').textContent = wasteData.disposal;
    
    // Show results with animation
    const resultDetails = document.getElementById('resultDetails');
    resultDetails.style.display = 'block';
    resultDetails.style.animation = 'fadeInUp 0.5s ease';
    
    // Save to history
    saveClassificationHistory({
        type: itemName,
        category: wasteData.category,
        value: wasteData.value,
        confidence: confidence,
        timestamp: new Date().toISOString()
    });
}

// Save classification to localStorage
function saveClassificationHistory(classification) {
    let history = JSON.parse(localStorage.getItem('classificationHistory') || '[]');
    history.unshift(classification);
    history = history.slice(0, 20); // Keep last 20
    localStorage.setItem('classificationHistory', JSON.stringify(history));
}

// Load example classification
function loadExample(type) {
    // Scroll to classifier section
    const classifierSection = document.querySelector('.classifier-section');
    if (classifierSection) {
        classifierSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // Create demo image based on type
    const demoImages = {
        plastic: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%233498db" width="400" height="400"/%3E%3Ctext x="200" y="220" font-size="120" text-anchor="middle" fill="white"%3E🍾%3C/text%3E%3C/svg%3E',
        ewaste: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%2334495e" width="400" height="400"/%3E%3Ctext x="200" y="220" font-size="120" text-anchor="middle" fill="white"%3E📱%3C/text%3E%3C/svg%3E',
        metal: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%2395a5a6" width="400" height="400"/%3E%3Ctext x="200" y="220" font-size="120" text-anchor="middle" fill="white"%3E🔧%3C/text%3E%3C/svg%3E',
        paper: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23f39c12" width="400" height="400"/%3E%3Ctext x="200" y="220" font-size="120" text-anchor="middle" fill="white"%3E📦%3C/text%3E%3C/svg%3E'
    };
    
    setTimeout(() => {
        // Show image
        const resultImage = document.getElementById('resultImage');
        resultImage.innerHTML = `<img src="${demoImages[type]}" alt="${type} example" style="animation: zoomIn 0.3s ease;">`;
        
        // Show result section
        document.getElementById('uploadArea').style.display = 'none';
        document.getElementById('classificationResult').style.display = 'block';
        document.getElementById('scanningAnimation').style.display = 'block';
        document.getElementById('resultDetails').style.display = 'none';
        
        // Display results after delay
        const wasteData = wasteDatabase[type];
        setTimeout(() => {
            displayClassificationResults(wasteData, wasteData.type, wasteData.confidence);
        }, 1500);
    }, 500);
}

// Reset classifier
function resetClassifier() {
    document.getElementById('uploadArea').style.display = 'flex';
    document.getElementById('classificationResult').style.display = 'none';
    document.getElementById('imageInput').value = '';
    
    // Scroll to upload area
    setTimeout(() => {
        document.getElementById('uploadArea').scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
}

// Schedule pickup
function schedulePickup() {
    window.location.href = 'collection.html';
}

// Make functions globally accessible
window.loadExample = loadExample;
window.resetClassifier = resetClassifier;
window.schedulePickup = schedulePickup;
