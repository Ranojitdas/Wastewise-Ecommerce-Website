const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

const scheduleForm = document.getElementById('scheduleForm');

if (scheduleForm) {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').setAttribute('min', today);

    scheduleForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(scheduleForm);
        const data = Object.fromEntries(formData);

        alert(`Thank you! Your pickup has been scheduled for ${data.date} during ${data.time}.\\n\\nWe'll send a confirmation email to ${data.email} shortly.`);

        scheduleForm.reset();
    });
}
