# WasteWise 🌱

**Your smart companion for responsible waste management and e-waste recycling**

---

## Inspiration

In a world drowning in electronic waste and struggling with proper waste disposal, we saw an opportunity to make a difference. Every year, **50 million tons** of e-waste are generated globally, yet only **20%** is properly recycled. This results in **$62.5 billion** worth of recoverable materials lost annually, while toxic materials contaminate our soil and water.

WasteWise was born from a simple question: *What if recycling could be as easy as shopping online?*

We envisioned a platform that doesn't just tell you to recycle – it shows you how much your waste is worth, connects you with verified recyclers, educates you about environmental impact, and rewards you for making sustainable choices. Our mission is to bridge the gap between environmental responsibility and everyday convenience, making it easier for individuals and businesses to recycle responsibly while earning rewards.

---

## What it does

WasteWise is a comprehensive AI-powered platform that transforms waste management into an engaging, rewarding experience:

### 🤖 **AI Waste Classifier**
- Upload a photo of your waste item and our Gemini-powered AI instantly identifies the waste type (e-waste, plastic, metal, paper, glass, organic)
- Provides disposal recommendations and recycling options
- Shows environmental impact information for informed decisions

### 💰 **Intelligent Price Estimator**
- Get real-time estimates for your e-waste and recyclables
- Recognizes high-value items (iPhones, MacBooks, Samsung devices, laptops, tablets, accessories)
- Calculates per-piece prices for electronics and per-kg rates for bulk materials
- Applies condition-based multipliers (excellent, good, fair, poor)
- Provides quantity bonuses to encourage larger recycling efforts
- Delivers AI-powered insights and recommendations with realistic pricing using thousands separator formatting

### 💬 **24/7 AI Chatbot Assistant**
- Available via floating button across all pages (except homepage)
- Answers questions about what can be recycled and proper disposal methods
- Provides pickup scheduling information
- Educates users about environmental benefits
- Features local fallback responses and graceful rate limit handling

### 🌍 **Comprehensive Platform Features**
- **Marketplace**: Browse eco-friendly products and refurbished electronics
- **Education Hub**: Learn about waste types, recycling processes, and environmental impact
- **Impact Tracker**: See collective environmental achievements (CO₂ reduced, trees saved, e-waste diverted)
- **Collection Scheduling**: Easy pickup booking with tracking and history
- **Reward System**: Earn points and benefits for responsible recycling

---

## How we built it

**Frontend Stack:**
- Pure HTML5, CSS3, and vanilla JavaScript for lightweight performance
- Responsive design with custom animations and modern card-based UI
- Glassmorphism effects and animated loading states for enhanced UX
- Dynamic form validation and progressive enhancement patterns

**AI & Machine Learning:**
- Google Gemini API (gemini-2.0-flash-exp model) via REST endpoints
- Image recognition for waste classification
- Natural language processing for chatbot interactions
- Custom prompt engineering for accurate waste identification and pricing insights

**Data Architecture:**
- LocalStorage for user preferences, chat history, and estimate tracking
- SessionStorage for form state management
- Comprehensive pricing database with 50+ item categories
- High-value items database with per-piece pricing logic
- Condition multipliers and quantity bonus tier system

**Design Patterns:**
- Progressive enhancement with graceful API fallbacks
- Rate limiting with local response alternatives (429 error handling)
- Error handling for API failures (404, network errors)
- Event-driven architecture with proper listener management
- Dynamic UI updates with typing indicators and 3.5s "AI calculating" animations

---

## Challenges we ran into

### **API Integration & Model Selection**
Initially struggled with Gemini API endpoint configuration – started with `gemini-pro`, encountered 404 errors, migrated to `gemini-1.5-flash`, and finally settled on `gemini-2.0-flash-exp` for optimal performance and availability.

### **Rate Limiting & Error Handling**
Hit rate limits (429 errors) during testing, requiring implementation of robust fallback systems with local insights when API calls fail, ensuring users always get valuable responses.

### **Realistic Pricing Logic**
Building a pricing engine that felt authentic required extensive research into actual e-waste values. Developed a sophisticated system distinguishing between high-value electronics (per-piece pricing) and bulk materials (per-kg pricing), with condition multipliers and quantity bonuses.

### **Event Listener Management**
Encountered issues with button click handlers not firing due to inline `onclick` attributes conflicting with dynamic JavaScript listeners. Resolved by implementing proper event delegation and DOMContentLoaded initialization.

### **Dynamic Form Behavior**
Creating flexible quantity inputs that adapt step values (0.5 for kg, 1 for pieces/units) while maintaining proper validation and min values required careful state management.

### **UI/UX Polish**
Balancing feature-rich interfaces with clean design – implemented floating chatbot buttons across multiple pages while maintaining consistent styling, and added animated loading states that feel natural without frustrating users.

---

## Accomplishments that we're proud of

✅ **Fully Functional AI Integration**: Three distinct AI-powered features (classifier, estimator, chatbot) working seamlessly with real Gemini API calls and intelligent fallbacks

✅ **Sophisticated Pricing Engine**: Realistic calculations with 50+ categories, high-value item recognition, condition assessment, and quantity bonuses – featuring proper number formatting with thousands separators

✅ **Resilient Architecture**: Built-in rate limiting, error handling, and local fallback responses ensure users always get value even when APIs are unavailable

✅ **Exceptional UX**: Animated loading states, typing indicators, floating chatbot buttons, dynamic form validations, and glassmorphism effects create an engaging, modern experience

✅ **Production-Ready Code**: Clean event handling, proper state management, comprehensive error logging, and modular architecture make the codebase maintainable and scalable

✅ **Environmental Impact Focus**: Not just a technical solution, but a platform designed to genuinely encourage sustainable behavior through education, transparency, and rewards

✅ **Cross-Page Integration**: Successfully implemented floating chatbot access across marketplace, education, impact, and collection pages while maintaining clean homepage design

---

## What we learned

### **Technical Lessons**
- **API Versioning Matters**: Different Gemini model endpoints have varying availability and capabilities – always test thoroughly and build fallbacks
- **Event Handling Best Practices**: Inline onclick handlers can cause conflicts; proper event delegation and DOMContentLoaded initialization are essential
- **User Experience > Features**: A 3.5s loading animation makes AI feel more intelligent than instant results; perceived performance matters
- **Error Messages as Features**: Well-crafted fallback responses and rate limit messages turn failures into opportunities to educate users

### **Design Insights**
- **Progressive Enhancement Works**: Building core functionality first, then layering AI features creates resilient experiences
- **Simplicity in Complexity**: Complex pricing logic can be presented through clean, intuitive UI with clear factor breakdowns
- **Accessibility of AI**: Floating buttons make powerful AI features discoverable without overwhelming the interface

### **Environmental Understanding**
- The staggering scale of e-waste problems (50M tons/year, $62.5B lost value)
- How proper pricing information can motivate recycling behavior
- The importance of education alongside action in sustainability platforms

---

## What's next for Wastewise

### **Feature Expansion**
- 📱 Mobile app development (iOS & Android) for on-the-go recycling
- 🗺️ Interactive recycling center map with real-time availability
- 🏪 Expand marketplace with verified sellers and more product categories
- 📊 Advanced analytics dashboard showing personal and community impact
- 🎁 Enhanced reward redemption with partner discounts and benefits

### **Technical Improvements**
- 🌐 Multi-language support for global accessibility
- 🤝 API integrations with local recycling centers for automated pickups
- 🔍 Enhanced AI models with more accurate waste classification
- 📈 Machine learning for dynamic pricing based on market conditions
- ⚡ Performance optimization and PWA capabilities

### **Community & Scale**
- 🤝 Partnerships with municipalities and waste management companies
- 🏆 Leaderboards and social features to gamify recycling
- 🎓 Educational content expansion with video tutorials and guides
- 🌍 Regional expansion with localized pricing and recycling rules

---
