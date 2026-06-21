// Force page to always start at the top on load/refresh
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.addEventListener('beforeunload', () => {
    window.scrollTo(0, 0);
});
window.scrollTo(0, 0);

// --- Lock viewport height against mobile URL bar resize ---
// Capture the real viewport height ONCE (while URL bar is visible).
// Store it as --real-vh so .hero-sticky-wrapper never snaps when the
// mobile browser hides/shows its address bar during scroll.
(function setRealVh() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--real-vh', `${window.innerHeight}px`);
})();

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Hero Image Lightbox ---
    const lightbox = document.getElementById('hero-lightbox');
    const lightboxImg = document.getElementById('hero-lightbox-img');
    const lightboxClose = document.getElementById('hero-lightbox-close');
    const lightboxOverlay = document.getElementById('hero-lightbox-overlay');

    document.querySelectorAll('.hero-img-card').forEach(card => {
        card.addEventListener('click', () => {
            const src = card.querySelector('img').src;
            const alt = card.querySelector('img').alt;
            lightboxImg.src = src;
            lightboxImg.alt = alt;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    const closeLightbox = () => {
        if (lightbox) lightbox.classList.remove('active');
        document.body.style.overflow = '';
        if (lightboxImg) setTimeout(() => { lightboxImg.src = ''; }, 300);
    };

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxOverlay) lightboxOverlay.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

    // --- Sticky Header ---
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    });

    // --- Mobile Menu Toggle ---
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // --- Smooth Scrolling for Navigation ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // If it's the hero section, scroll to absolute top
                if (targetId === '#home') {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                    return;
                }
                
                let headerOffset = 80;
                if (targetId === '#products') {
                    headerOffset = 0;
                }
                
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu) navMenu.classList.remove('active');
            if (mobileToggle) {
                const icon = mobileToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    });

    // --- Scroll Reveal Animations ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);



    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // --- FAQ Accordion ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        if (otherAnswer) otherAnswer.style.maxHeight = null;
                    }
                });
                item.classList.toggle('active');
                const answer = item.querySelector('.faq-answer');
                if (answer) {
                    if (item.classList.contains('active')) {
                        answer.style.maxHeight = answer.scrollHeight + "px";
                    } else {
                        answer.style.maxHeight = null;
                    }
                }
            });
        }
    });

    // --- Hero Scroll Effects (Animation + Parallax + Fade) ---
    const heroContainer = document.querySelector('.hero-scroll-container');
    const canvas = document.getElementById("hero-canvas");
    const textLeft = document.querySelector('.staggered-title .align-left');
    const textRight = document.querySelector('.staggered-title .align-right');
    const heroBtn = document.getElementById('hero-btn');

    let targetFrameIndex = 0;
    let currentFrameIndex = 0;
    let targetScrollFraction = 0;
    let currentScrollFraction = 0;
    const frameCount = 240;

    if (canvas && heroContainer) {
        const context = canvas.getContext("2d", { alpha: false });
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = 'high';

        const currentFrame = index => (
            `ezgif-frame-${(index + 1).toString().padStart(3, '0')}.jpg`
        );

        const img = new Image();
        img.src = currentFrame(0);

        // List of key static image assets to preload alongside animation frames
        const staticAssets = [
            'favicon.png',
            'verified_iso.jpeg',
            'FSSAI.jpeg',
            'moving_bg.jpeg',
            'hero_banner.jpeg',
            'square_bottle.jpeg',
            'diamond_bottle_2.jpeg',
            'ambassador.jpeg',
            'removed_bg_bottle.png',
            'BANNER.jpeg',
            'removed_bg_bottle2.png',
            'director_1.jpeg',
            'director_2.jpeg',
            'office_photo.jpg',
            'factory_supply.jpeg',
            'factory_inside_1.jpeg',
            'india_map.jpeg',
            'pricing_1.jpg',
            'pricing_2.jpg',
            'available_on.jpeg',
            'banner_1.jpg',
            'banner_2.jpeg',
            'banner_3.jpeg',
            'banner_4.jpeg',
            'akbhar_logo.jpg',
            'faq_bottle.jpeg',
            'bg_core.jpeg'
        ];

        // Preload ALL frames sequentially in batches of 20 + all static assets
        // Plain Image() objects — browser manages memory efficiently, no VRAM thrashing.
        // Batches of 20 give good parallel throughput without flooding mobile connections.
        const preloadedImages = [];
        let loadedCount = 0;
        const totalAssets = frameCount + staticAssets.length;
        const BATCH_SIZE = 20;

        const preload = () => {
            const preloaderBar = document.getElementById('preloader-bar');
            const preloaderPerc = document.getElementById('preloader-perc');
            const preloaderStatus = document.querySelector('.preloader-status');
            const preloader = document.getElementById('preloader');

            const urlParams = new URLSearchParams(window.location.search);
            const isReturn = urlParams.get('return') === 'true';

            if (isReturn) {
                if (preloader) preloader.style.display = 'none';
                document.body.classList.remove('is-loading');
                // Clean the URL so a refresh runs the preloader normally
                const newUrl = window.location.pathname + window.location.hash;
                window.history.replaceState({}, document.title, newUrl);
            } else {
                document.body.classList.add('is-loading');
            }

            const itemLoaded = () => {
                loadedCount++;
                const progress = Math.round((loadedCount / totalAssets) * 100);
                
                if (!isReturn) {
                    if (preloaderBar) preloaderBar.style.width = `${progress}%`;
                    if (preloaderPerc) preloaderPerc.innerText = `${progress}%`;
                }

                if (loadedCount >= totalAssets) {
                    if (preloaderStatus && !isReturn) preloaderStatus.innerText = "Purely Loaded.";
                    
                    setTimeout(() => {
                        currentFrameIndex = 0;
                        targetFrameIndex = 0;
                        currentScrollFraction = 0;
                        targetScrollFraction = 0;
                        render();
                        
                        if (!isReturn) {
                            window.scrollTo(0, 0); // Always start from top on normal load/refresh
                            if (preloader) preloader.classList.add('fade-out');
                            document.body.classList.remove('is-loading');
                            setTimeout(() => { if (preloader) preloader.style.display = 'none'; }, 800);
                        } else {
                            if (window.location.hash) {
                                const hashEl = document.querySelector(window.location.hash);
                                if (hashEl) hashEl.scrollIntoView();
                            }
                        }
                    }, isReturn ? 0 : 400);
                }
            };

            // Static page assets — all parallel
            staticAssets.forEach(src => {
                const img = new Image();
                img.src = src;
                img.onload = itemLoaded;
                img.onerror = itemLoaded;
            });

            // Load one batch of frames simultaneously, then move to the next batch.
            // This keeps frames arriving in sequential order (0→239) so the
            // canvas always has a nearby frame ready no matter where you scroll.
            const loadBatch = (start) => {
                const end = Math.min(start + BATCH_SIZE, frameCount);
                let batchDone = 0;
                const batchTotal = end - start;

                for (let i = start; i < end; i++) {
                    const img = new Image();
                    if (i === 0) img.fetchPriority = 'high';
                    img.src = currentFrame(i);
                    preloadedImages[i] = img;

                    const onDone = () => {
                        if (i === 0) { resizeCanvas(); render(); }
                        itemLoaded();
                        batchDone++;
                        if (batchDone === batchTotal && end < frameCount) {
                            loadBatch(end); // kick off next batch
                        }
                    };
                    img.onload = onDone;
                    img.onerror = onDone;
                }
            };

            loadBatch(0);
        };

        const resizeCanvas = () => {
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            const dpr = Math.min(window.devicePixelRatio || 1, 2); // cap DPR at 2× for performance
            canvas.width  = windowWidth  * dpr;
            canvas.height = windowHeight * dpr;
            context.imageSmoothingEnabled = true;
            context.imageSmoothingQuality = 'high';
            render();
        };

        const drawImageCover = (ctx, img) => {
            const canvasWidth  = ctx.canvas.width;
            const canvasHeight = ctx.canvas.height;
            const imgWidth  = img.width  || img.naturalWidth;
            const imgHeight = img.height || img.naturalHeight;
            if (!imgWidth || !imgHeight) return;

            const screenAspectRatio = canvasWidth / canvasHeight;
            const imgAspectRatio    = imgWidth / imgHeight;

            let ratio;
            const isMobilePortrait = screenAspectRatio < 0.75;
            if (isMobilePortrait) {
                ratio = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight);
            } else if (screenAspectRatio < imgAspectRatio) {
                const coverRatio   = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight);
                const containRatio = canvasWidth / imgWidth;
                ratio = containRatio + (coverRatio - containRatio) * 0.6;
            } else {
                ratio = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight);
            }

            const newWidth  = imgWidth  * ratio;
            const newHeight = imgHeight * ratio;
            const x = (canvasWidth  - newWidth)  / 2;
            const y = (canvasHeight - newHeight) / 2;
            ctx.drawImage(img, x, y, newWidth, newHeight);
        };

        let shakeIntensity = 0;
        const landingPoint = 0.45;
        let lastScrollFraction = 0;

        // A frame is ready when the Image has fully decoded
        const isFrameReady = (index) => {
            const img = preloadedImages[index];
            if (!img) return false;
            return img.complete && img.naturalWidth > 0;
        };

        const render = () => {
            let frameToDraw = Math.min(frameCount - 1, Math.round(currentFrameIndex));
            // Fall back to nearest earlier ready frame if target isn't decoded yet
            if (!isFrameReady(frameToDraw)) {
                let fb = frameToDraw;
                while (fb > 0 && !isFrameReady(fb)) fb--;
                if (!isFrameReady(fb)) return;
                frameToDraw = fb;
            }

            context.save();
            if (shakeIntensity > 0.1) {
                context.translate(
                    (Math.random() - 0.5) * shakeIntensity,
                    (Math.random() - 0.5) * shakeIntensity
                );
                shakeIntensity *= 0.85;
            }
            drawImageCover(context, preloadedImages[frameToDraw]);
            context.restore();
        };

        let lastRenderedFrameIndex = -1;
        let lastRenderedScrollFraction = -1;

        const renderLoop = () => {
            // Shake trigger
            if (lastScrollFraction < landingPoint && targetScrollFraction >= landingPoint) {
                shakeIntensity = 15;
            }
            lastScrollFraction = targetScrollFraction;

            // Smooth scroll fraction LERP — buttery glide without frame drift
            currentScrollFraction += (targetScrollFraction - currentScrollFraction) * 0.12;

            // Direct frame mapping — NO frame-index LERP.
            // Maps scroll fraction → exact frame instantly for clean 30fps feel.
            currentFrameIndex = targetFrameIndex;

            // Calculate rounded frame index for rendering
            const frameToDraw = Math.min(frameCount - 1, Math.round(currentFrameIndex));

            // Check if anything has actually changed (avoid redrawing/re-styling when static)
            const hasFrameChanged = frameToDraw !== lastRenderedFrameIndex;
            const hasScrollChanged = Math.abs(currentScrollFraction - lastRenderedScrollFraction) > 0.0001;
            const isShaking = shakeIntensity > 0.1;

            if (hasFrameChanged || hasScrollChanged || isShaking) {
                // 3. Render Canvas Frame
                render();

                // 4. Smooth Text Splitting (Responsive - Always Horizontal Split)
                if (textLeft && textRight) {
                    const isMobile = window.innerWidth <= 767;
                    const xMove = currentScrollFraction * window.innerWidth * (isMobile ? 0.5 : 1.2); 
                    const yMove = currentScrollFraction * (isMobile ? 80 : 120);
                    
                    textLeft.style.transform = `translate(-${xMove}px, -${yMove}px)`;
                    textRight.style.transform = `translate(${xMove}px, ${yMove}px)`;
                    
                    // Fade out on scroll for mobile/tablet to ensure it disappears gracefully
                    if (isMobile) {
                        const opacity = 1 - (currentScrollFraction * 3.5);
                        textLeft.style.opacity = opacity >= 0 ? opacity : 0;
                        textRight.style.opacity = opacity >= 0 ? opacity : 0;
                    } else {
                        textLeft.style.opacity = 1;
                        textRight.style.opacity = 1;
                    }
                }

                // 5. Smooth Button Morph/Fade
                if (heroBtn) {
                    let progress = 0;
                    if (currentScrollFraction > 0.02) {
                        progress = Math.min(1, (currentScrollFraction - 0.02) / 0.15);
                    }
                    const currentWidth = 320 - (265 * progress);
                    heroBtn.style.width = `${currentWidth}px`;
                    const textOpacity = Math.max(0, 1 - progress * 4);
                    heroBtn.style.color = `rgba(255, 255, 255, ${textOpacity})`;
                    
                    let scale = 1;
                    let btnOpacity = 1;
                    if (currentScrollFraction > 0.18) {
                        let disappearProgress = Math.min(1, (currentScrollFraction - 0.18) / 0.1);
                        scale = 1 - disappearProgress;
                        btnOpacity = 1 - disappearProgress;
                    }
                    heroBtn.style.transform = `translateX(-50%) scale(${scale})`;
                    heroBtn.style.opacity = btnOpacity;
                }

                // Store last rendered values
                lastRenderedFrameIndex = frameToDraw;
                lastRenderedScrollFraction = currentScrollFraction;
            }

            requestAnimationFrame(renderLoop);
        };

        // Smart resize handler:
        // On mobile, the browser fires a 'resize' event ONLY because the URL bar
        // hid/showed (height changes, width stays the same). We must ignore those
        // to prevent the canvas and hero from snapping.
        // We DO resize on genuine orientation changes (width changes) or desktop resize.
        let _lastResizeWidth = window.innerWidth;
        window.addEventListener('resize', () => {
            const newWidth = window.innerWidth;
            const widthChanged = newWidth !== _lastResizeWidth;
            _lastResizeWidth = newWidth;
            
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

            if (widthChanged || !isMobile) {
                // Genuine resize (rotation / desktop window change) — update everything
                document.documentElement.style.setProperty('--real-vh', `${window.innerHeight}px`);
                resizeCanvas();
            }
            // Height-only change on mobile = URL bar toggling — do nothing, let CSS --real-vh hold steady
        });
        preload();
        renderLoop();
    }

    // Single robust scroll listener for all hero effects
    window.addEventListener('scroll', () => {
        if (!heroContainer) return;
        
        const scrollTop = window.scrollY;
        const containerTop = heroContainer.offsetTop;
        const containerHeight = heroContainer.scrollHeight;
        const maxScroll = containerHeight - window.innerHeight;
        
        if (maxScroll <= 0) return;

        let scrollFraction = (scrollTop - containerTop) / maxScroll;
        if (scrollFraction < 0) scrollFraction = 0;
        if (scrollFraction > 1) scrollFraction = 1;

        // Set targets for the interpolation in renderLoop
        targetScrollFraction = scrollFraction;
        targetFrameIndex = scrollFraction * (frameCount - 1);
    });

    // --- Auto-sliding Image Gallery ---
    const autoSlider = document.querySelector('.auto-slider');
    if (autoSlider) {
        const slides = autoSlider.querySelectorAll('.slide-img');
        let currentSlide = 0;

        const nextSlide = () => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        };

        // Change slide every 4 seconds
        setInterval(nextSlide, 4000);
    }

    // --- 3D Testimonial Carousel ---
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.nav-btn.prev');
    const nextBtn = document.querySelector('.nav-btn.next');
    let currentIndex = 2; // Start with the 3rd card as active (Raj)

    function updateCarousel() {
        testimonialCards.forEach((card, index) => {
            card.classList.remove('active', 'prev', 'next', 'far-prev', 'far-next', 'hidden');
            
            const total = testimonialCards.length;
            const diff = (index - currentIndex + total) % total;

            if (diff === 0) {
                card.classList.add('active');
            } else if (diff === 1) {
                card.classList.add('next');
            } else if (diff === total - 1) {
                card.classList.add('prev');
            } else if (diff === 2) {
                card.classList.add('far-next');
            } else if (diff === total - 2) {
                card.classList.add('far-prev');
            } else {
                card.classList.add('hidden');
            }
        });
    }

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + testimonialCards.length) % testimonialCards.length;
            updateCarousel();
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % testimonialCards.length;
            updateCarousel();
        });

        // Initialize
        updateCarousel();
    }
    // --- Purification Bottle Path Animation (Ultra-Smooth Center Gutter) ---
    const purificationSection = document.getElementById('purification');
    const movingBottle = document.getElementById('purification-bottle');
    const nodes = document.querySelectorAll('.purification-node');

    if (purificationSection && movingBottle && nodes.length > 0) {
        let targetTop = nodes[0].offsetTop + nodes[0].offsetHeight / 2;
        let targetLeft = 50; // Centered
        let currentTop = targetTop;
        let currentLeft = targetLeft;

        const updateBottlePosition = () => {
            // Slower LERP for "majestic" glide
            currentTop += (targetTop - currentTop) * 0.05;
            currentLeft += (targetLeft - currentLeft) * 0.05;

            movingBottle.style.top = `${currentTop}px`;
            movingBottle.style.left = `${currentLeft}%`;
            movingBottle.style.transform = `translate(-50%, -50%)`;

            requestAnimationFrame(updateBottlePosition);
        };

        window.addEventListener('scroll', () => {
            const isMobile = window.innerWidth <= 767;
            const rect = purificationSection.getBoundingClientRect();
            const sectionHeight = rect.height;
            const scrollDistance = -rect.top;
            
            // Offset logic for smooth entry
            const startOffset = window.innerHeight * 0.5;
            const animationHeight = sectionHeight + window.innerHeight * 0.2; 
            
            let progress = (scrollDistance + startOffset) / animationHeight;
            progress = Math.max(0, Math.min(1, progress));

            const totalNodes = nodes.length;
            const scaledProgress = progress * (totalNodes - 1);
            const index = Math.floor(scaledProgress);
            const nextIndex = Math.ceil(scaledProgress);
            const subProgress = scaledProgress - index;

            const currNode = nodes[index];
            const nextNode = nodes[nextIndex];

            if (currNode && nextNode) {
                const cTop = currNode.offsetTop + currNode.offsetHeight / 2;
                const nTop = nextNode.offsetTop + nextNode.offsetHeight / 2;
                
                targetTop = cTop + (nTop - cTop) * subProgress;
                
                if (isMobile) {
                    // Mobile Gutter (30px from left)
                    targetLeft = (30 / window.innerWidth) * 100;
                } else {
                    // Desktop Center
                    targetLeft = 50; 
                }
            }
        });

        // Start the loop
        requestAnimationFrame(updateBottlePosition);
    }
    // --- 3D Products Carousel ---
    const productsCarousel = document.getElementById('carouselViewport');
    if (productsCarousel) {
        const items = Array.from(productsCarousel.querySelectorAll('.carousel-item'));
        const titleEl = document.getElementById('productTitle');
        const priceEl = document.getElementById('productPrice');
        const featuresEl = document.getElementById('productFeatures');
        const detailsContainer = document.getElementById('carouselDetails');
        
        let currentProdIndex = 0;
        
        const productData = [
            {
                title: 'riveric 200ml',
                price: 'Case of 24 Bottles',
                features: ['• Mineral-Rich Water', '• Premium Quality', '• Ideal for events']
            },
            {
                title: 'riveric 500ml',
                price: 'Case of 24 Bottles',
                features: ['• Pure Hydration', '• Perfect for active lifestyle', '• Easily portable']
            },
            {
                title: 'riveric 1 Litre',
                price: 'Case of 12 Bottles',
                features: ['• Daily Hydration', '• Great for home & office', '• Eco-conscious packaging']
            },
            {
                title: 'riveric 200ml Premium',
                price: 'Case of 24 Bottles',
                features: ['• Enhanced Minerals', '• Sleek Design', '• VIP Events']
            },
            {
                title: 'riveric 500ml Premium',
                price: 'Case of 24 Bottles',
                features: ['• Maximum Purity', '• Fine Dining Choice', '• Superior Taste']
            },
            {
                title: 'riveric 1 Litre Premium',
                price: 'Case of 12 Bottles',
                features: ['• Ultimate Hydration', '• Premium Hospitality', '• Distinctive Bottle']
            },
            {
                title: 'riveric Foods (Half)',
                price: 'Perfect Snack',
                features: ['• Delicious Taste', '• Authentic Flavors', '• Quick & Easy']
            },
            {
                title: 'riveric Foods (Full)',
                price: 'Satisfying Portion',
                features: ['• Full Meal', '• Extra Spices', '• Fresh Ingredients']
            },
            {
                // Index 8 placeholder
                title: '', price: '', features: []
            }
        ];

        let carouselIndex = 0; // 0 for Classic, 1 for Premium
        let volumeIndex = 1; // 0: 200ml, 1: 500ml, 2: 1L (Start at 500ml default)
        
        const getProdIndex = () => (carouselIndex * 3) + volumeIndex;

        let detailsTimeout;
        
        const updateCarouselSpin = () => {
            items.forEach((item, index) => {
                item.classList.remove('active', 'prev', 'next', 'hidden');
                
                const total = items.length;
                let diff = index - carouselIndex;
                
                if (diff < -Math.floor(total / 2)) diff += total;
                if (diff > Math.floor(total / 2)) diff -= total;

                if (diff === 0) item.classList.add('active');
                else if (diff === 1) item.classList.add('next');
                else if (diff === -1) item.classList.add('prev');
                else item.classList.add('hidden');
            });
        };

        const updateProductText = (instant = false) => {
            const applyData = () => {
                const prodIndex = getProdIndex();
                const data = productData[prodIndex];
                if (!data) return;
                
                titleEl.textContent = data.title;
                priceEl.textContent = data.price;
                featuresEl.innerHTML = data.features.map(f => `<li>${f}</li>`).join('');
                
                const orderBtn = document.getElementById('orderNowBtn');
                if (orderBtn) {
                    const message = `Hi riveric! I would like to place an order for ${data.title}.`;
                    orderBtn.href = `https://wa.me/919471491032?text=${encodeURIComponent(message)}`;
                }

                const activeVolBtns = document.querySelectorAll('.vol-btn');
                if (activeVolBtns.length === 3) {
                    if (carouselIndex === 2) {
                        activeVolBtns[0].textContent = 'HALF PLATE';
                        activeVolBtns[0].style.display = 'inline-block';
                        activeVolBtns[1].textContent = 'FULL PLATE';
                        activeVolBtns[1].style.display = 'inline-block';
                        activeVolBtns[2].style.display = 'none';
                        if (volumeIndex > 1) volumeIndex = 1;
                    } else {
                        activeVolBtns[0].textContent = '200 ML';
                        activeVolBtns[0].style.display = 'inline-block';
                        activeVolBtns[1].textContent = '500 ML';
                        activeVolBtns[1].style.display = 'inline-block';
                        activeVolBtns[2].textContent = '1 LITRE';
                        activeVolBtns[2].style.display = 'inline-block';
                    }
                    
                    activeVolBtns.forEach(b => b.classList.remove('active'));
                    activeVolBtns[volumeIndex].classList.add('active');
                }
            };

            if (instant) {
                if (detailsTimeout) clearTimeout(detailsTimeout);
                applyData();
                detailsContainer.classList.add('show');
                return;
            }

            detailsContainer.classList.remove('show');
            if (detailsTimeout) clearTimeout(detailsTimeout);
            
            detailsTimeout = setTimeout(() => {
                applyData();
                detailsContainer.classList.add('show');
            }, 300);
        };

        items.forEach((item, index) => {
            item.addEventListener('click', () => {
                if (carouselIndex !== index) {
                    carouselIndex = index;
                    updateCarouselSpin();
                    updateProductText();
                }
            });
        });

        let startX = 0;
        let isDragging = false;
        
        const handleDragStart = (e) => {
            isDragging = true;
            startX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
            document.body.style.userSelect = 'none';
        };

        const handleDragEnd = (e) => {
            if (!isDragging) return;
            isDragging = false;
            document.body.style.userSelect = '';
            
            const endX = e.type.includes('mouse') ? e.pageX : e.changedTouches[0].clientX;
            const diffX = startX - endX;
            
            if (Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    carouselIndex = (carouselIndex + 1) % items.length;
                } else {
                    carouselIndex = (carouselIndex - 1 + items.length) % items.length;
                }
                updateCarouselSpin();
                updateProductText();
            }
        };

        productsCarousel.addEventListener('mousedown', handleDragStart);
        productsCarousel.addEventListener('mouseup', handleDragEnd);
        productsCarousel.addEventListener('mouseleave', handleDragEnd);
        productsCarousel.addEventListener('touchstart', handleDragStart, { passive: true });
        productsCarousel.addEventListener('touchend', handleDragEnd);
        productsCarousel.addEventListener('touchcancel', handleDragEnd);

        const prevBtn = document.getElementById('carouselPrevBtn');
        const nextBtn = document.getElementById('carouselNextBtn');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                carouselIndex = (carouselIndex - 1 + items.length) % items.length;
                updateCarouselSpin();
                updateProductText();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                carouselIndex = (carouselIndex + 1) % items.length;
                updateCarouselSpin();
                updateProductText();
            });
        }

        // Make categories clickable
        const comingSoonMessage = document.getElementById('comingSoonMessage');
        const carouselViewportWrapper = document.getElementById('carouselViewportWrapper');
        
        const catBtns = document.querySelectorAll('.cat-btn');
        catBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                catBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                const isComingSoon = e.target.getAttribute('data-status') === 'coming-soon';
                
                if (comingSoonMessage) {
                    comingSoonMessage.style.display = isComingSoon ? 'block' : 'none';
                }
                
                if (carouselViewportWrapper) {
                    const wasHidden = carouselViewportWrapper.style.visibility === 'hidden';
                    
                    carouselViewportWrapper.style.visibility = isComingSoon ? 'hidden' : 'visible';
                    carouselViewportWrapper.style.opacity = isComingSoon ? '0' : '1';
                    carouselViewportWrapper.style.pointerEvents = isComingSoon ? 'none' : 'auto';
                    carouselViewportWrapper.style.transition = 'opacity 0.3s ease';
                    
                    if (!isComingSoon) {
                        // Switch between Classic, Premium, and Foods based on category
                        const catText = e.target.textContent.trim().toUpperCase();
                        if (catText === 'PREMIUM') carouselIndex = 1;
                        else if (catText === 'FOODS') carouselIndex = 2;
                        else carouselIndex = 0;
                        
                        updateCarouselSpin();
                        updateProductText();
                    }
                }
                
                if (detailsContainer && isComingSoon) {
                    detailsContainer.classList.remove('show');
                }
            });
        });

        // Make volume buttons clickable
        const volBtns = document.querySelectorAll('.vol-btn');
        volBtns.forEach((btn, idx) => {
            btn.addEventListener('click', (e) => {
                volumeIndex = idx; // 0, 1, or 2
                
                // ONLY update text, do NOT spin carousel
                // Pass true for instant update (no fade animation)
                updateProductText(true);
            });
        });

        updateCarouselSpin();
        updateProductText();
    }

    // Distributor Form Handler
    const distributorForm = document.getElementById('distributor-form');
    if (distributorForm) {
        distributorForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const email = document.getElementById('email').value;
            const address = document.getElementById('address').value;
            const city = document.getElementById('city').value;
            const state = document.getElementById('state').value;
            
            const subject = `New Distributor Application: ${name}`;
            const body = `New Distributor Application%0D%0A%0D%0A` +
                            `Name: ${name}%0D%0A` +
                            `Phone: ${phone}%0D%0A` +
                            `Email: ${email}%0D%0A` +
                            `Address: ${address}%0D%0A` +
                            `City: ${city}%0D%0A` +
                            `State: ${state}`;
            
            const mailtoUrl = `mailto:riveric.info@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
            
            window.location.href = mailtoUrl;
        });
    }

    // --- Global Smooth Mouse Wheel Scrolling (Slowing down scroll speed globally) ---
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    
    // Only apply custom smooth scroll on Non-Mac Desktop devices (like Windows Chrome)
    // Mac trackpads and Safari have flawless native momentum scrolling, and JS overrides break them!
    if (!isMobileDevice && !isMac && !isSafari) {
        let targetScrollY = window.scrollY;
        let currentScrollY = window.scrollY;
        let isScrolling = false;
        
        // Sync targetScrollY on native scroll events
        window.addEventListener('scroll', () => {
            if (!isScrolling) {
                targetScrollY = window.scrollY;
                currentScrollY = window.scrollY;
            }
        }, { passive: true });

        // Instantly sync on resize to prevent viewport jumps
        window.addEventListener('resize', () => {
            targetScrollY = window.scrollY;
            currentScrollY = window.scrollY;
            isScrolling = false;
        });

        window.addEventListener('wheel', (e) => {
            // Prevent default rapid jump scrolling
            e.preventDefault();
            
            const speedMultiplier = 1.2; // Higher = faster scroll per wheel tick
            targetScrollY += e.deltaY * speedMultiplier;
            
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            targetScrollY = Math.max(0, Math.min(maxScroll, targetScrollY));
            
            if (!isScrolling) {
                isScrolling = true;
                animateScroll();
            }
        }, { passive: false });

        const animateScroll = () => {
            const ease = 0.07; // Easing speed: smaller numbers make the scroll glide slower and smoother
            currentScrollY += (targetScrollY - currentScrollY) * ease;
            
            window.scrollTo(0, currentScrollY);
            
            if (Math.abs(targetScrollY - currentScrollY) > 0.5) {
                requestAnimationFrame(animateScroll);
            } else {
                isScrolling = false;
                currentScrollY = targetScrollY;
                window.scrollTo(0, targetScrollY);
            }
        };
    }
});
