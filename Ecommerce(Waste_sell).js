// Marketplace functionality
document.addEventListener('DOMContentLoaded', function() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const cartCount = document.getElementById('cartCount');
    
    // Initialize cart count
    updateCartCount();
    
    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const productCards = document.querySelectorAll('.product-card');
            
            productCards.forEach(card => {
                const productName = card.querySelector('.card-title');
                if (productName) {
                    const title = productName.textContent.toLowerCase();
                    const cardContainer = card.closest('li') || card.closest('.product-item');
                    
                    if (title.includes(searchTerm) || searchTerm === '') {
                        if (cardContainer) cardContainer.style.display = '';
                    } else {
                        if (cardContainer) cardContainer.style.display = 'none';
                    }
                }
            });
        });
    }
    
    // Cart functionality
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        
        if (cartCount) {
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    }
    
    // Add to cart buttons
    const addToCartButtons = document.querySelectorAll('.btn-primary, .add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const productCard = this.closest('.product-card');
            if (productCard) {
                const productName = productCard.querySelector('.card-title a, .card-title');
                const productPrice = productCard.querySelector('.price');
                const productImage = productCard.querySelector('img');
                
                if (productName && productPrice) {
                    const product = {
                        id: Date.now(),
                        name: productName.textContent.trim(),
                        price: productPrice.textContent.trim(),
                        image: productImage ? productImage.src : '',
                        quantity: 1
                    };
                    
                    addToCart(product);
                    
                    // Visual feedback
                    this.innerHTML = '<i class="fas fa-check"></i> Added!';
                    this.style.background = '#28a745';
                    
                    setTimeout(() => {
                        this.innerHTML = 'Add to Cart';
                        this.style.background = '';
                    }, 1500);
                }
            }
        });
    });
    
    function addToCart(product) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Check if product already exists
        const existingProduct = cart.find(item => item.name === product.name);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.push(product);
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    }
    
    // User button functionality
    const userBtn = document.querySelector('.user-btn');
    if (userBtn) {
        userBtn.addEventListener('click', function() {
            // Add user menu functionality here
            alert('User menu - Feature coming soon!');
        });
    }
});