document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const burgerMenu = document.querySelector('.burger-menu');
    const navMenu = document.querySelector('nav ul');
    
    burgerMenu.addEventListener('click', function() {
        navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
        burgerMenu.classList.toggle('active');
    });
    
    // Easter Egg - Logo Click Sound
    const logoElement = document.querySelector('.logo');
    const laughSound = new Audio('barney-laugh.mp3');
    
    if (logoElement) {
        logoElement.addEventListener('click', function(e) {
            e.preventDefault();
            laughSound.currentTime = 0; // Reset sound to beginning
            laughSound.play();
            
            // Add a little bounce animation when clicked
            gsap.to(this, {duration: 0.1, scale: 1.2});
            gsap.to(this, {duration: 0.2, scale: 1, delay: 0.1});
        });
        
        // Add cursor pointer to indicate it's clickable
        logoElement.style.cursor = 'pointer';
    }
    
    // Menu Filter Functionality (only on menu page)
    const filterBtns = document.querySelectorAll('.filter-btn');
    const menuItems = document.querySelectorAll('.menu-item');
    
    if(filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Filter menu items
                const filter = this.getAttribute('data-filter');
                
                menuItems.forEach(item => {
                    if (filter === 'all' || item.getAttribute('data-category') === filter) {
                        gsap.to(item, {duration: 0.5, opacity: 1, scale: 1, display: 'block'});
                    } else {
                        gsap.to(item, {duration: 0.5, opacity: 0, scale: 0.8, display: 'none'});
                    }
                });
            });
        });
    }
    
    // Shopping Cart Functionality
    const cartIcon = document.querySelector('.cart-icon');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const closeCart = document.querySelector('.close-cart');
    const cartItems = document.querySelector('.cart-items');
    const cartCount = document.querySelector('.cart-count');
    const cartTotal = document.getElementById('cart-total-amount');
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    const checkoutBtn = document.querySelector('.checkout-btn');
    
    let cart = [];
    
    // Open cart sidebar
    if (cartIcon) {
        cartIcon.addEventListener('click', function() {
            cartSidebar.classList.add('active');
        });
    }
    
    // Close cart sidebar
    if (closeCart) {
        closeCart.addEventListener('click', function() {
            cartSidebar.classList.remove('active');
        });
    }
    
    // Add to cart functionality
    if (addToCartBtns.length > 0) {
        addToCartBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const name = this.getAttribute('data-name');
                const price = parseFloat(this.getAttribute('data-price'));
                
                // Check if item already in cart
                const existingItem = cart.find(item => item.name === name);
                
                if (existingItem) {
                    existingItem.quantity++;
                } else {
                    cart.push({
                        name,
                        price,
                        quantity: 1
                    });
                }
                
                updateCart();
                
                // Show notification
                const notification = document.createElement('div');
                notification.className = 'add-to-cart-notification';
                notification.textContent = `Added ${name} to cart!`;
                document.body.appendChild(notification);
                
                setTimeout(() => {
                    notification.remove();
                }, 2000);
            });
        });
    }
    
    // Update cart display
    function updateCart() {
        // Clear cart display
        cartItems.innerHTML = '';
        
        // Count total items
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        // Calculate total price
        const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        cartTotal.textContent = totalPrice.toFixed(2);
        
        // Generate cart items HTML
        cart.forEach(item => {
            const cartItemElement = document.createElement('div');
            cartItemElement.className = 'cart-item';
            cartItemElement.innerHTML = `
                <div class="cart-item-info">
                    <span class="cart-item-name">${item.name}</span>
                    <span class="cart-item-price">$${item.price.toFixed(2)}</span>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn decrease" data-name="${item.name}">-</button>
                    <span class="cart-quantity">${item.quantity}</span>
                    <button class="quantity-btn increase" data-name="${item.name}">+</button>
                </div>
                <span class="remove-item" data-name="${item.name}">Remove</span>
            `;
            cartItems.appendChild(cartItemElement);
        });
        
        // Add event listeners to quantity buttons and remove buttons
        document.querySelectorAll('.quantity-btn.decrease').forEach(btn => {
            btn.addEventListener('click', function() {
                const name = this.getAttribute('data-name');
                const item = cart.find(i => i.name === name);
                
                if (item.quantity > 1) {
                    item.quantity--;
                } else {
                    cart = cart.filter(i => i.name !== name);
                }
                
                updateCart();
            });
        });
        
        document.querySelectorAll('.quantity-btn.increase').forEach(btn => {
            btn.addEventListener('click', function() {
                const name = this.getAttribute('data-name');
                const item = cart.find(i => i.name === name);
                item.quantity++;
                updateCart();
            });
        });
        
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const name = this.getAttribute('data-name');
                cart = cart.filter(i => i.name !== name);
                updateCart();
            });
        });
    }
    
    // Checkout functionality
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                alert('Your cart is empty!');
                return;
            }
            
            alert('Thank you for your order! Barney is cooking up your delicious food right now!');
            cart = [];
            updateCart();
            cartSidebar.classList.remove('active');
        });
    }
    
    // Animations for page elements on load
    const currentPage = window.location.pathname.split('/').pop();
    
    // Common animations for all pages
    gsap.from('.logo', {duration: 1, y: -50, opacity: 0, ease: 'power3.out'});
    gsap.from('nav ul li', {duration: 1, y: -50, opacity: 0, stagger: 0.2, ease: 'power3.out'});
    
    // Home page specific animations
    if(currentPage === '' || currentPage === 'index.html') {
        gsap.from('.hero-content h1', {duration: 1, x: -100, opacity: 0, delay: 0.5, ease: 'power3.out'});
        gsap.from('.hero-content p', {duration: 1, x: -100, opacity: 0, delay: 0.7, ease: 'power3.out'});
        gsap.from('.hero-content .cta-button', {duration: 1, y: 50, opacity: 0, delay: 0.9, ease: 'power3.out'});
        gsap.from('.hero-image', {duration: 1.5, scale: 0.8, opacity: 0, delay: 0.5, ease: 'power3.out'});
        
        // Featured item animations
        gsap.from('.featured-content', {duration: 1, x: -100, opacity: 0, delay: 1.2, ease: 'power3.out'});
        gsap.from('.featured-image', {duration: 1.5, scale: 0.8, opacity: 0, delay: 1.4, ease: 'power3.out'});
    }
    
    // Menu page specific animations
    if(currentPage === 'menu.html') {
        gsap.from('.page-banner h1', {duration: 1, y: -50, opacity: 0, ease: 'power3.out'});
        gsap.from('.filter-btn', {duration: 0.8, y: 20, opacity: 0, stagger: 0.1, delay: 0.5, ease: 'power3.out'});
        gsap.from('.menu-item', {duration: 1, y: 50, opacity: 0, stagger: 0.2, delay: 0.8, ease: 'power3.out'});
    }
    
    // About page specific animations
    if(currentPage === 'about.html') {
        gsap.from('.page-banner h1', {duration: 1, y: -50, opacity: 0, ease: 'power3.out'});
        gsap.from('.about-image', {duration: 1.5, scale: 0.8, opacity: 0, delay: 0.5, ease: 'power3.out'});
        gsap.from('.about-content h2', {duration: 1, x: 100, opacity: 0, delay: 0.5, ease: 'power3.out'});
        gsap.from('.about-content p', {duration: 1, x: 100, opacity: 0, stagger: 0.2, delay: 0.7, ease: 'power3.out'});
    }
    
    // Reviews page specific animations
    if(currentPage === 'reviews.html') {
        gsap.from('.page-banner h1', {duration: 1, y: -50, opacity: 0, ease: 'power3.out'});
        gsap.from('.review-card', {duration: 1, y: 50, opacity: 0, stagger: 0.2, delay: 0.5, ease: 'power3.out'});
    }
    
    // Contact page specific animations
    if(currentPage === 'contact.html') {
        gsap.from('.page-banner h1', {duration: 1, y: -50, opacity: 0, ease: 'power3.out'});
        gsap.from('.location', {duration: 1, x: -100, opacity: 0, delay: 0.5, ease: 'power3.out'});
        gsap.from('.contact-form', {duration: 1, x: 100, opacity: 0, delay: 0.5, ease: 'power3.out'});
    }
    
    // Form submission handling
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your message! Barney will get back to you soon!');
            this.reset();
        });
    }
});