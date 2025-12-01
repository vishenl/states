/**
 * Mindvalley States - Shopify Theme JavaScript
 */

(function() {
  'use strict';

  // ==========================================
  // Utility Functions
  // ==========================================
  
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  function formatMoney(cents) {
    return '$' + (cents / 100).toFixed(2);
  }

  // ==========================================
  // Cart Functionality
  // ==========================================
  
  const Cart = {
    init() {
      this.cartToggle = document.getElementById('cart-toggle');
      this.cartSidebar = document.getElementById('cart-sidebar');
      this.cartOverlay = document.getElementById('cart-overlay');
      this.cartClose = document.getElementById('cart-close');
      this.cartItems = document.getElementById('cart-items');
      this.cartTotal = document.getElementById('cart-total');
      this.headerCartCount = document.getElementById('header-cart-count');

      if (!this.cartToggle) return;

      this.bindEvents();
    },

    bindEvents() {
      // Open cart
      this.cartToggle.addEventListener('click', () => this.open());
      
      // Close cart
      if (this.cartClose) {
        this.cartClose.addEventListener('click', () => this.close());
      }
      if (this.cartOverlay) {
        this.cartOverlay.addEventListener('click', () => this.close());
      }

      // Close on escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') this.close();
      });

      // Add to cart buttons
      document.querySelectorAll('.add-to-cart-btn, .add-to-cart, .cross-sell-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const form = btn.closest('form');
          if (form) {
            this.addToCart(form);
          } else {
            const productId = btn.dataset.productId;
            if (productId) {
              this.addToCartById(productId);
            }
          }
        });
      });

      // Quantity buttons in cart
      if (this.cartItems) {
        this.cartItems.addEventListener('click', (e) => {
          if (e.target.classList.contains('qty-increase')) {
            this.updateQuantity(e.target.dataset.key, 1);
          } else if (e.target.classList.contains('qty-decrease')) {
            this.updateQuantity(e.target.dataset.key, -1);
          } else if (e.target.classList.contains('cart-item-remove')) {
            this.removeItem(e.target.dataset.key);
          }
        });
      }

      // Mobile add to cart
      const mobileAddToCart = document.getElementById('mobile-add-to-cart');
      if (mobileAddToCart) {
        mobileAddToCart.addEventListener('click', () => {
          const form = document.querySelector('form[action="/cart/add"]');
          if (form) this.addToCart(form);
        });
      }
    },

    open() {
      if (this.cartSidebar) this.cartSidebar.classList.add('active');
      if (this.cartOverlay) this.cartOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    },

    close() {
      if (this.cartSidebar) this.cartSidebar.classList.remove('active');
      if (this.cartOverlay) this.cartOverlay.classList.remove('active');
      document.body.style.overflow = '';
    },

    async addToCart(form) {
      const formData = new FormData(form);
      
      try {
        const response = await fetch('/cart/add.js', {
          method: 'POST',
          body: formData
        });
        
        const item = await response.json();
        
        if (item.id) {
          await this.refresh();
          this.open();
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    },

    async addToCartById(variantId, quantity = 1) {
      try {
        const response = await fetch('/cart/add.js', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: variantId,
            quantity: quantity
          })
        });
        
        const item = await response.json();
        
        if (item.id) {
          await this.refresh();
          this.open();
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    },

    async updateQuantity(key, delta) {
      try {
        const cart = await this.getCart();
        const item = cart.items.find(i => i.key === key);
        
        if (item) {
          const newQuantity = item.quantity + delta;
          
          if (newQuantity <= 0) {
            await this.removeItem(key);
          } else {
            await fetch('/cart/change.js', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                id: key,
                quantity: newQuantity
              })
            });
            
            await this.refresh();
          }
        }
      } catch (error) {
        console.error('Error updating quantity:', error);
      }
    },

    async removeItem(key) {
      try {
        await fetch('/cart/change.js', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: key,
            quantity: 0
          })
        });
        
        await this.refresh();
      } catch (error) {
        console.error('Error removing item:', error);
      }
    },

    async getCart() {
      const response = await fetch('/cart.js');
      return response.json();
    },

    async refresh() {
      const cart = await this.getCart();
      this.updateUI(cart);
    },

    updateUI(cart) {
      // Update cart count
      if (this.headerCartCount) {
        this.headerCartCount.textContent = cart.item_count;
      }

      // Update cart total
      if (this.cartTotal) {
        this.cartTotal.textContent = formatMoney(cart.total_price);
      }

      // Update cart items
      if (this.cartItems) {
        if (cart.item_count === 0) {
          this.cartItems.innerHTML = `
            <div class="cart-empty">
              <p>Your cart is empty</p>
              <a href="/collections/all" class="btn-continue-shopping">Continue Shopping</a>
            </div>
          `;
        } else {
          this.cartItems.innerHTML = cart.items.map(item => `
            <div class="cart-item" data-line-item-key="${item.key}">
              <div class="cart-item-img">
                ${item.image ? `<img src="${item.image.replace(/(\.[^.]+)$/, '_128x128$1')}" alt="${item.title}" loading="lazy">` : ''}
              </div>
              <div class="cart-item-info">
                <div class="cart-item-name">${item.product_title}</div>
                ${item.variant_title && item.variant_title !== 'Default Title' ? `<div class="cart-item-variant">${item.variant_title}</div>` : ''}
                <div class="cart-item-price">${formatMoney(item.price)}</div>
                <div class="cart-item-qty">
                  <button class="qty-btn qty-decrease" data-key="${item.key}" aria-label="Decrease quantity">-</button>
                  <span class="qty-value">${item.quantity}</span>
                  <button class="qty-btn qty-increase" data-key="${item.key}" aria-label="Increase quantity">+</button>
                </div>
              </div>
              <button class="cart-item-remove" data-key="${item.key}" aria-label="Remove item">&times;</button>
            </div>
          `).join('');
        }
      }
    }
  };

  // ==========================================
  // Product Gallery
  // ==========================================
  
  const ProductGallery = {
    init() {
      const thumbnails = document.querySelectorAll('.thumbnail');
      const mainImage = document.getElementById('gallery-main-img');

      if (!thumbnails.length || !mainImage) return;

      thumbnails.forEach(thumb => {
        thumb.addEventListener('click', () => {
          // Update main image
          const imageUrl = thumb.dataset.imageUrl;
          mainImage.src = imageUrl;

          // Update active state
          thumbnails.forEach(t => t.classList.remove('active'));
          thumb.classList.add('active');
        });
      });
    }
  };

  // ==========================================
  // Quantity Selector
  // ==========================================
  
  const QuantitySelector = {
    init() {
      document.querySelectorAll('.qty-selector').forEach(selector => {
        const decreaseBtn = selector.querySelector('[data-action="decrease"], .qty-decrease');
        const increaseBtn = selector.querySelector('[data-action="increase"], .qty-increase');
        const input = selector.querySelector('.qty-value');

        if (!decreaseBtn || !increaseBtn || !input) return;

        decreaseBtn.addEventListener('click', () => {
          const currentValue = parseInt(input.value) || 1;
          if (currentValue > 1) {
            input.value = currentValue - 1;
            this.updatePrice();
          }
        });

        increaseBtn.addEventListener('click', () => {
          const currentValue = parseInt(input.value) || 1;
          const max = parseInt(input.max) || 10;
          if (currentValue < max) {
            input.value = currentValue + 1;
            this.updatePrice();
          }
        });
      });
    },

    updatePrice() {
      // Update add to cart button price if needed
      const priceSpan = document.querySelector('.add-to-cart-price');
      const qtyInput = document.querySelector('.qty-value');
      
      if (priceSpan && qtyInput && window.productPrice) {
        const qty = parseInt(qtyInput.value) || 1;
        const total = window.productPrice * qty;
        priceSpan.textContent = formatMoney(total);
      }
    }
  };

  // ==========================================
  // Pricing Options
  // ==========================================
  
  const PricingOptions = {
    init() {
      const options = document.querySelectorAll('.pricing-option');
      const sellingPlanInput = document.getElementById('selling-plan-input');

      if (!options.length) return;

      options.forEach(option => {
        option.addEventListener('click', () => {
          // Update selection
          options.forEach(o => o.classList.remove('selected'));
          option.classList.add('selected');

          // Update hidden input
          if (sellingPlanInput) {
            sellingPlanInput.value = option.dataset.sellingPlanId || '';
          }
        });
      });
    }
  };

  // ==========================================
  // FAQ Accordion
  // ==========================================
  
  const FAQ = {
    init() {
      const faqItems = document.querySelectorAll('.faq-item');

      faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
          question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other items
            faqItems.forEach(i => i.classList.remove('active'));
            
            // Toggle current item
            if (!isActive) {
              item.classList.add('active');
            }
          });

          // Keyboard accessibility
          question.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              question.click();
            }
          });
        }
      });
    }
  };

  // ==========================================
  // Testimonials Filter
  // ==========================================
  
  const TestimonialsFilter = {
    init() {
      const tabs = document.querySelectorAll('.filter-tab');
      const cards = document.querySelectorAll('.testimonial-card');

      if (!tabs.length) return;

      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          const filter = tab.dataset.filter;

          // Update active tab
          tabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');

          // Filter cards
          cards.forEach(card => {
            if (filter === 'all' || card.dataset.product === filter) {
              card.style.display = '';
            } else {
              card.style.display = 'none';
            }
          });
        });
      });
    }
  };

  // ==========================================
  // Quiz
  // ==========================================
  
  const Quiz = {
    currentQuestion: 0,
    answers: [],

    init() {
      this.intro = document.getElementById('quiz-intro');
      this.questions = document.getElementById('quiz-questions');
      this.results = document.getElementById('quiz-results');
      this.startBtn = document.getElementById('quiz-start');
      this.backBtn = document.getElementById('quiz-back');
      this.nextBtn = document.getElementById('quiz-next');
      this.restartBtn = document.getElementById('quiz-restart');
      this.questionScreens = document.querySelectorAll('.quiz-question-screen');

      if (!this.intro) return;

      this.totalQuestions = this.questionScreens.length;
      this.bindEvents();
    },

    bindEvents() {
      if (this.startBtn) {
        this.startBtn.addEventListener('click', () => this.start());
      }

      if (this.backBtn) {
        this.backBtn.addEventListener('click', () => this.back());
      }

      if (this.nextBtn) {
        this.nextBtn.addEventListener('click', () => this.next());
      }

      if (this.restartBtn) {
        this.restartBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.restart();
        });
      }

      // Option selection
      document.querySelectorAll('.quiz-option').forEach(option => {
        option.addEventListener('click', () => {
          const screen = option.closest('.quiz-question-screen');
          const isMultiSelect = screen.querySelector('.quiz-options').classList.contains('multi-select');

          if (isMultiSelect) {
            option.classList.toggle('selected');
          } else {
            screen.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('selected'));
            option.classList.add('selected');
          }
        });
      });
    },

    start() {
      this.intro.style.display = 'none';
      this.questions.style.display = 'block';
      this.showQuestion(0);
    },

    showQuestion(index) {
      this.currentQuestion = index;
      
      this.questionScreens.forEach((screen, i) => {
        screen.style.display = i === index ? 'block' : 'none';
      });

      // Update back button visibility
      if (this.backBtn) {
        this.backBtn.style.visibility = index === 0 ? 'hidden' : 'visible';
      }

      // Update next button text
      if (this.nextBtn) {
        this.nextBtn.textContent = index === this.totalQuestions - 1 ? 'See Results' : 'Next';
      }
    },

    back() {
      if (this.currentQuestion > 0) {
        this.showQuestion(this.currentQuestion - 1);
      }
    },

    next() {
      // Save current answer
      const currentScreen = this.questionScreens[this.currentQuestion];
      const selected = currentScreen.querySelectorAll('.quiz-option.selected');
      
      this.answers[this.currentQuestion] = Array.from(selected).map(s => s.dataset.value);

      if (this.currentQuestion < this.totalQuestions - 1) {
        this.showQuestion(this.currentQuestion + 1);
      } else {
        this.showResults();
      }
    },

    showResults() {
      this.questions.style.display = 'none';
      this.results.style.display = 'block';
      
      // Generate recommendations based on answers
      const recommendations = this.generateRecommendations();
      const resultsContent = document.getElementById('quiz-results-content');
      
      if (resultsContent) {
        resultsContent.innerHTML = recommendations;
      }
    },

    generateRecommendations() {
      // Simple recommendation logic based on answers
      const allAnswers = this.answers.flat();
      const recommendations = [];

      if (allAnswers.includes('Better Focus') || allAnswers.includes('Morning') || allAnswers.includes('Brain Fog')) {
        recommendations.push({
          name: 'FOCUS',
          desc: 'Perfect for enhanced concentration and mental clarity',
          color: '#3b82f6'
        });
      }

      if (allAnswers.includes('Stress Relief') || allAnswers.includes('Stress') || allAnswers.includes('All Day')) {
        recommendations.push({
          name: 'ZEN',
          desc: 'Great for calm focus without drowsiness',
          color: '#10b981'
        });
      }

      if (allAnswers.includes('Mood Boost') || allAnswers.includes('Social Events') || allAnswers.includes('Social Anxiety')) {
        recommendations.push({
          name: 'BLISS',
          desc: 'Ideal for mood elevation and social confidence',
          color: '#f59e0b'
        });
      }

      if (allAnswers.includes('Better Sleep') || allAnswers.includes('Night') || allAnswers.includes('Poor Sleep')) {
        recommendations.push({
          name: 'DREAM',
          desc: 'Perfect for deep, restorative sleep',
          color: '#6366f1'
        });
      }

      if (allAnswers.includes('Enhanced Intimacy')) {
        recommendations.push({
          name: 'GAZM',
          desc: 'Great for deeper connection and intimacy',
          color: '#e11d48'
        });
      }

      // Default recommendation if nothing matched
      if (recommendations.length === 0) {
        recommendations.push({
          name: 'Box Set',
          desc: 'Try all 5 States to discover what works best for you',
          color: '#7a12d4'
        });
      }

      return `
        <div class="quiz-recommendations">
          ${recommendations.map(rec => `
            <div class="quiz-recommendation" style="border-left: 4px solid ${rec.color}">
              <h3>${rec.name}</h3>
              <p>${rec.desc}</p>
            </div>
          `).join('')}
          <a href="/collections/all" class="btn-primary" style="margin-top: 2rem;">
            Shop Recommended Products
          </a>
        </div>
      `;
    },

    restart() {
      this.currentQuestion = 0;
      this.answers = [];
      
      // Clear selections
      document.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('selected'));
      
      this.results.style.display = 'none';
      this.intro.style.display = 'block';
    }
  };

  // ==========================================
  // Mobile Menu
  // ==========================================
  
  const MobileMenu = {
    init() {
      this.toggle = document.getElementById('mobile-menu-toggle');
      this.nav = document.getElementById('mobile-nav');

      if (!this.toggle || !this.nav) return;

      this.toggle.addEventListener('click', () => {
        this.nav.classList.toggle('active');
        this.toggle.classList.toggle('active');
      });
    }
  };

  // ==========================================
  // Announcement Bar
  // ==========================================
  
  const AnnouncementBar = {
    init() {
      const closeBtn = document.querySelector('.announcement-close');
      const bar = document.querySelector('.announcement-bar');

      if (!closeBtn || !bar) return;

      closeBtn.addEventListener('click', () => {
        bar.style.display = 'none';
        sessionStorage.setItem('announcementClosed', 'true');
      });

      // Check if already closed
      if (sessionStorage.getItem('announcementClosed') === 'true') {
        bar.style.display = 'none';
      }
    }
  };

  // ==========================================
  // Video Player
  // ==========================================
  
  const VideoPlayer = {
    init() {
      const wrappers = document.querySelectorAll('.video-wrapper');

      wrappers.forEach(wrapper => {
        const playBtn = wrapper.querySelector('.play-button');
        if (!playBtn) return;

        playBtn.addEventListener('click', () => {
          const videoId = wrapper.dataset.videoId;
          const videoType = wrapper.dataset.videoType || 'youtube';

          if (videoType === 'youtube' && videoId) {
            wrapper.innerHTML = `
              <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed/${videoId}?autoplay=1" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen
              ></iframe>
            `;
          } else if (videoType === 'vimeo' && videoId) {
            wrapper.innerHTML = `
              <iframe 
                width="100%" 
                height="100%" 
                src="https://player.vimeo.com/video/${videoId}?autoplay=1" 
                frameborder="0" 
                allow="autoplay; fullscreen" 
                allowfullscreen
              ></iframe>
            `;
          }
        });
      });
    }
  };

  // ==========================================
  // Smooth Scroll
  // ==========================================
  
  const SmoothScroll = {
    init() {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
          const href = this.getAttribute('href');
          if (href === '#') return;

          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        });
      });
    }
  };

  // ==========================================
  // Initialize All Modules
  // ==========================================
  
  document.addEventListener('DOMContentLoaded', () => {
    Cart.init();
    ProductGallery.init();
    QuantitySelector.init();
    PricingOptions.init();
    FAQ.init();
    TestimonialsFilter.init();
    Quiz.init();
    MobileMenu.init();
    AnnouncementBar.init();
    VideoPlayer.init();
    SmoothScroll.init();
  });

})();

