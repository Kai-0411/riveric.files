// Force page to always start at the top on load/refresh
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.addEventListener('beforeunload', () => {
    window.scrollTo(0, 0);
});
window.scrollTo(0, 0);

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
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
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
    const frameCount = 192;

    if (canvas && heroContainer) {
        const context = canvas.getContext("2d", { alpha: false });
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = 'high';

        const currentFrame = index => (
            `ezgif-frame-${(index + 1).toString().padStart(3, '0')}.jpg`
        );

        const img = new Image();
        img.src = currentFrame(0);

        // Preload all images
        const preloadedImages = [];
        let loadedCount = 0;

        const preload = () => {
            const batchSize = 12; // Load in batches of 12 for speed without congestion
            let currentBatchStart = 0;
            const preloaderBar = document.getElementById('preloader-bar');
            const preloaderPerc = document.getElementById('preloader-perc');
            const preloaderStatus = document.querySelector('.preloader-status');
            const preloader = document.getElementById('preloader');

            // Prevent scrolling during load
            document.body.classList.add('is-loading');

            const loadBatch = (start) => {
                const end = Math.min(start + batchSize, frameCount);
                let batchLoaded = 0;

                for (let i = start; i < end; i++) {
                    const preImg = new Image();
                    if (i === 0) preImg.fetchPriority = "high";
                    preImg.src = currentFrame(i);
                    preImg.onload = () => {
                        loadedCount++;
                        batchLoaded++;
                        
                        // Update Preloader UI
                        const progress = Math.round((loadedCount / frameCount) * 100);
                        if (preloaderBar) preloaderBar.style.width = `${progress}%`;
                        if (preloaderPerc) preloaderPerc.innerText = `${progress}%`;

                        if (i === 0) {
                            resizeCanvas();
                            render();
                        }

                        if (loadedCount === frameCount) {
                            // Finished Loading
                            if (preloaderStatus) preloaderStatus.innerText = "Purely Loaded.";
                            setTimeout(() => {
                                // Force scroll to top and reset animation to frame 0
                                window.scrollTo(0, 0);
                                currentFrameIndex = 0;
                                targetFrameIndex = 0;
                                currentScrollFraction = 0;
                                targetScrollFraction = 0;
                                render();

                                if (preloader) preloader.classList.add('fade-out');
                                // Enable scrolling
                                document.body.classList.remove('is-loading');
                                setTimeout(() => {
                                    if (preloader) preloader.style.display = 'none';
                                }, 800);
                            }, 500);
                        }

                        if (batchLoaded === (end - start)) {
                            loadBatch(end);
                        }
                    };
                    preImg.onerror = () => {
                        loadedCount++;
                        batchLoaded++;
                        if (batchLoaded === (end - start)) {
                            loadBatch(end);
                        }
                    };
                    preloadedImages[i] = preImg;
                }
            };

            loadBatch(0);
        };

        const resizeCanvas = () => {
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            
            // Set internal resolution to match screen for sharpness and smoothness
            canvas.width = windowWidth;
            canvas.height = windowHeight;
            render();
        };

        const drawImageCover = (ctx, img) => {
            const canvasWidth = ctx.canvas.width;
            const canvasHeight = ctx.canvas.height;
            const imgWidth = img.width;
            const imgHeight = img.height;
            const ratio = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight);
            const newWidth = imgWidth * ratio;
            const newHeight = imgHeight * ratio;
            const x = (canvasWidth - newWidth) / 2;
            const y = (canvasHeight - newHeight) / 2;
            ctx.drawImage(img, x, y, newWidth, newHeight);
        };

        let shakeIntensity = 0;
        const landingPoint = 0.45; // Adjust this value to match when the bottle 'lands' in your frames
        let lastScrollFraction = 0;

        const render = () => {
            let frameToDraw = Math.min(frameCount - 1, Math.round(currentFrameIndex));
            
            // Fallback logic: If the target frame isn't loaded yet, find the nearest previously loaded frame
            if (!preloadedImages[frameToDraw]) {
                let fallbackIndex = frameToDraw;
                while (fallbackIndex >= 0 && !preloadedImages[fallbackIndex]) {
                    fallbackIndex--;
                }
                // If we found a previously loaded frame, use it
                if (fallbackIndex >= 0) {
                    frameToDraw = fallbackIndex;
                } else {
                    // If even frame 0 isn't loaded, don't render anything yet
                    return;
                }
            }

            context.save();
            
            // Apply Shake Effect
            if (shakeIntensity > 0.1) {
                const xShake = (Math.random() - 0.5) * shakeIntensity;
                const yShake = (Math.random() - 0.5) * shakeIntensity;
                context.translate(xShake, yShake);
                shakeIntensity *= 0.85; // Decay shake
            }

            drawImageCover(context, preloadedImages[frameToDraw]);
            context.restore();
        };

        const renderLoop = () => {
            // Trigger shake on impact point
            if (lastScrollFraction < landingPoint && targetScrollFraction >= landingPoint) {
                shakeIntensity = 15; // Set initial shake intensity
            }
            lastScrollFraction = targetScrollFraction;

            // 1. Interpolate Scroll Fraction (Faster for responsiveness)
            currentScrollFraction += (targetScrollFraction - currentScrollFraction) * 0.12;

            // 2. Interpolate Frame Index (Faster for responsiveness)
            const frameDiff = targetFrameIndex - currentFrameIndex;
            currentFrameIndex += frameDiff * 0.15;

            // 3. Render Canvas Frame
            render();

            // 4. Smooth Text Splitting
            if (textLeft && textRight) {
                const xMove = currentScrollFraction * window.innerWidth * 1.2; 
                const yMove = currentScrollFraction * 120;
                textLeft.style.transform = `translate(-${xMove}px, -${yMove}px)`;
                textRight.style.transform = `translate(${xMove}px, ${yMove}px)`;
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

            requestAnimationFrame(renderLoop);
        };

        window.addEventListener('resize', resizeCanvas);
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
            if (window.innerWidth <= 768) return;

            const rect = purificationSection.getBoundingClientRect();
            const sectionHeight = rect.height;
            const scrollDistance = -rect.top;
            
            // Ultra-slow: animation spans more distance
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
                
                // Stay centered in the gutter to avoid hiding text
                targetTop = cTop + (nTop - cTop) * subProgress;
                targetLeft = 50; 
            }
        });

        // Start the loop
        requestAnimationFrame(updateBottlePosition);
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
});
