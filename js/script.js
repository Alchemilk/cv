(function() {
    const lines = ['你好，我是alchemilk', '欢迎来到我的主页'];
    const typewriter = document.getElementById('typewriter');
    let lineIndex = 0;
    let charIndex = 0;
    
    function type() {
        if (lineIndex < lines.length) {
            if (charIndex < lines[lineIndex].length) {
                if (charIndex === 0 && lineIndex > 0) {
                    typewriter.innerHTML += '<br>';
                }
                const currentText = typewriter.innerHTML;
                const currentLine = lines[lineIndex].substring(0, charIndex + 1);
                if (lineIndex === 0) {
                    typewriter.textContent = currentLine;
                } else {
                    typewriter.innerHTML = lines[0] + '<br>' + currentLine;
                }
                charIndex++;
                setTimeout(type, 100);
            } else {
                lineIndex++;
                charIndex = 0;
                if (lineIndex < lines.length) {
                    setTimeout(type, 300);
                } else {
                    typewriter.classList.add('done');
                }
            }
        }
    }
    
    setTimeout(type, 500);
})();

(function() {
    const heroWrapper = document.getElementById('heroWrapper');
    const scrollIndicator = document.getElementById('scrollIndicator');
    const contentSection = document.getElementById('contentSection');
    const navLogo = document.querySelector('.nav-logo');

    let isScrolling = false;
    let hasScrolledToContent = false;

    window.addEventListener('load', function() {
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    });

    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible') {
            setTimeout(function() {
                window.scrollTo(0, 0);
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
            }, 100);
        }
    });

    window.addEventListener('wheel', function(e) {
        if (!isScrolling) {
            if (e.deltaY > 0 && !hasScrolledToContent) {
                isScrolling = true;
                heroWrapper.classList.add('hide');
                contentSection.classList.add('visible');
                hasScrolledToContent = true;
                setTimeout(function() {
                    window.scrollTo(0, 0);
                    document.body.scrollTop = 0;
                    document.documentElement.scrollTop = 0;
                    window.scrollIntoView({ behavior: 'auto', block: 'start' });
                }, 100);
                
                document.querySelectorAll('.nav-btn').forEach(function(btn) {
                    btn.classList.remove('active');
                });
                document.querySelector('.nav-btn[data-page="profile"]').classList.add('active');
                
                setTimeout(function() {
                    isScrolling = false;
                }, 700);
            } else if (e.deltaY < 0 && hasScrolledToContent) {
                isScrolling = true;
                heroWrapper.classList.remove('hide');
                contentSection.classList.remove('visible');
                hasScrolledToContent = false;
                setTimeout(function() {
                    window.scrollTo(0, 0);
                    document.body.scrollTop = 0;
                    document.documentElement.scrollTop = 0;
                    window.scrollIntoView({ behavior: 'auto', block: 'start' });
                }, 100);
                
                document.querySelectorAll('.nav-btn').forEach(function(btn) {
                    btn.classList.remove('active');
                });
                document.querySelector('.nav-btn[data-page="home"]').classList.add('active');
                
                setTimeout(function() {
                    isScrolling = false;
                }, 700);
            }
        }
    }, { passive: true });

    let touchStartY = 0;
    let touchEndY = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });
    
    document.addEventListener('touchend', function(e) {
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        if (!isScrolling) {
            const swipeThreshold = 50;
            const diff = touchStartY - touchEndY;
            
            if (diff > swipeThreshold && !hasScrolledToContent) {
                isScrolling = true;
                heroWrapper.classList.add('hide');
                contentSection.classList.add('visible');
                hasScrolledToContent = true;
                setTimeout(function() {
                    window.scrollTo(0, 0);
                    document.body.scrollTop = 0;
                    document.documentElement.scrollTop = 0;
                    window.scrollIntoView({ behavior: 'auto', block: 'start' });
                }, 100);
                
                document.querySelectorAll('.nav-btn').forEach(function(btn) {
                    btn.classList.remove('active');
                });
                document.querySelector('.nav-btn[data-page="profile"]').classList.add('active');
                
                setTimeout(function() {
                    isScrolling = false;
                }, 700);
            } else if (diff < -swipeThreshold && hasScrolledToContent) {
                isScrolling = true;
                heroWrapper.classList.remove('hide');
                contentSection.classList.remove('visible');
                hasScrolledToContent = false;
                setTimeout(function() {
                    window.scrollTo(0, 0);
                    document.body.scrollTop = 0;
                    document.documentElement.scrollTop = 0;
                    window.scrollIntoView({ behavior: 'auto', block: 'start' });
                }, 100);
                
                document.querySelectorAll('.nav-btn').forEach(function(btn) {
                    btn.classList.remove('active');
                });
                document.querySelector('.nav-btn[data-page="home"]').classList.add('active');
                
                setTimeout(function() {
                    isScrolling = false;
                }, 700);
            }
        }
    }

    scrollIndicator.addEventListener('click', function() {
        heroWrapper.classList.add('hide');
        contentSection.classList.add('visible');
        hasScrolledToContent = true;
        setTimeout(function() {
            window.scrollTo(0, 0);
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
            window.scrollIntoView({ behavior: 'auto', block: 'start' });
        }, 100);
    });

    navLogo.addEventListener('click', function(e) {
        e.preventDefault();
        if (hasScrolledToContent) {
            heroWrapper.classList.remove('hide');
            contentSection.classList.remove('visible');
            hasScrolledToContent = false;
            document.querySelectorAll('.nav-btn').forEach(function(btn) {
                btn.classList.remove('active');
            });
            document.querySelector('.nav-btn[data-page="home"]').classList.add('active');
        }
    });

    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            
            navBtns.forEach(function(b) {
                b.classList.remove('active');
            });
            this.classList.add('active');
            
            if (page === 'home') {
                heroWrapper.classList.remove('hide');
                contentSection.classList.remove('visible');
                hasScrolledToContent = false;
                setTimeout(function() {
                    window.scrollTo(0, 0);
                    document.body.scrollTop = 0;
                    document.documentElement.scrollTop = 0;
                    window.scrollIntoView({ behavior: 'auto', block: 'start' });
                }, 100);
            } else if (page === 'profile') {
                heroWrapper.classList.add('hide');
                contentSection.classList.add('visible');
                hasScrolledToContent = true;
                setTimeout(function() {
                    window.scrollTo(0, 0);
                    document.body.scrollTop = 0;
                    document.documentElement.scrollTop = 0;
                    window.scrollIntoView({ behavior: 'auto', block: 'start' });
                }, 100);
            }
        });
    });
})();

(function() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');

            tabBtns.forEach(function(b) {
                b.classList.remove('active');
            });
            this.classList.add('active');

            tabContents.forEach(function(content) {
                content.classList.remove('active');
            });
            document.getElementById(targetTab).classList.add('active');
        });
    });
})();
