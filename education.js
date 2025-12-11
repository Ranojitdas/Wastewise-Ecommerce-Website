// Education page specific functionality

// Enhanced course card interactions
document.addEventListener('DOMContentLoaded', () => {
    const topicCards = document.querySelectorAll('.topic-card');
    
    topicCards.forEach(card => {
        // Add hover effects
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px)';
            card.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)';
        });
    });

    // Add loading animation to course buttons
    const courseButtons = document.querySelectorAll('.course-btn');
    courseButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            btn.style.transform = 'scale(0.95)';
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Loading...';
            
            // Reset after a short delay (the page will navigate anyway)
            setTimeout(() => {
                btn.style.transform = 'scale(1)';
            }, 200);
        });
    });
});
