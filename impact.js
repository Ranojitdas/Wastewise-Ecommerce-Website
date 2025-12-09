const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

document.querySelectorAll('.reward-card button:not(.disabled)').forEach(button => {
    button.addEventListener('click', function() {
        const rewardName = this.closest('.reward-content').querySelector('h3').textContent;
        const pointsCost = this.closest('.reward-content').querySelector('.points-cost').textContent;

        alert(`You've redeemed: ${rewardName}\\nCost: ${pointsCost}\\n\\nYour reward will be shipped soon!`);
    });
});
