// ===== WebGL Rain/Drop Effect =====
window.addEventListener('load', function() {
    const canvasContainer = document.getElementById("canvas");
    if (!canvasContainer) return;

    const mouse = {
        x: 0,
        y: 0
    };

    const shader = {
        vertex: `    
        #ifdef GL_ES
        precision mediump float;
        #endif
        
        attribute vec3 aVertexPosition;
        attribute vec2 aTextureCoord;
    
        uniform mat4 uMVMatrix;
        uniform mat4 uPMatrix;
        uniform mat4 dispImageMatrix;
    
        varying vec3 vVertexPosition;
        varying vec2 vTextureCoord;
    
        void main() {
            vec3 vertexPosition = aVertexPosition;
            gl_Position = uPMatrix * uMVMatrix * vec4(vertexPosition, 1.0);
            vTextureCoord = (dispImageMatrix * vec4(aTextureCoord, 0., 1.)).xy;
            vVertexPosition = vertexPosition;
        }`,
        fragment: `
        #ifdef GL_ES
        precision mediump float;
        #endif
        
        #define PI2 6.28318530718
        #define PI 3.14159265359
        #define S(a,b,n) smoothstep(a,b,n)
        
        varying vec3 vVertexPosition;
        varying vec2 vTextureCoord;
    
        uniform float uTime;
        uniform vec2 uReso;
        uniform vec2 uMouse;
    
        uniform sampler2D dispImage;
        uniform sampler2D blurImage;
      
        // 噪声函数
        float N12(vec2 p){
            p = fract(p * vec2(123.34, 345.45));
            p += dot(p, p + 34.345);
            return fract(p.x * p.y);
        }
    
        vec3 Layer(vec2 uv0, float t){
            vec2 asp = vec2(2., 1.);
            vec2 uv1 = uv0 * 3. * asp;
            uv1.y += t * .25;
            vec2 gv = fract(uv1) - .5;
            vec2 id = floor(uv1);
            float n = N12(id);
            t += n * PI2;
            float w = uv0.y * 10.;
            float x = (n - .5) * .8;
            x += (.4 - abs(x)) * sin(3. * w) * pow(sin(w), 6.) * .45;
            float y = -sin(t + sin(t + sin(t) * .5)) * (.5 - .06);
            y -= (gv.x - x) * (gv.x - x);
            vec2 dropPos = (gv - vec2(x, y)) / asp; 
            float drop = S(.03, .02, length(dropPos));
            vec2 trailPos = (gv - vec2(x, t * .25)) / asp; 
            trailPos.y = (fract(trailPos.y * 8.) - .5) / 8.;
            float trail = S(.02, .015, length(trailPos));
            float fogTrail = S(-.05, .05, dropPos.y);
            fogTrail *= S(.5, y, gv.y);
            trail *= fogTrail;
            fogTrail *= S(.03, .015, abs(dropPos.x));
            vec2 off = drop * dropPos + trail * trailPos;
            return vec3(off, fogTrail);
        }
      
        void main() {      
            float dist = 2.;
            float blurSize = 1.5;
            float t = mod(uTime * .03, 7200.);
            vec4 c = vec4(0);
            vec2 uv = vTextureCoord;    
            vec3 drops = Layer(uv, t);
            drops += Layer(uv * 1.25 + 7.54, t);
            drops += Layer(uv * 1.35 + 1.54, t);
            drops += Layer(uv * 1.57 - 7.54, t);
            float blur = blurSize * 7. * (1. - drops.z);
            vec4 col = vec4(0.);
            int numSamples = 32;
            float a = N12(uv) * PI2;
            blur *= .0002;
            uv += drops.xy * dist;
            for(int n = 0; n < 32; n++){
                vec2 off = vec2(sin(a), cos(a)) * blur;
                float d = fract(sin((float(n) + 1.) * 546.) * 5424.);
                d = sqrt(d);         
                off *= d;
                col += texture2D(dispImage, uv + off);
                a++;
            }
            col /= float(numSamples);
            gl_FragColor = col;
        }
        `
    };

    // 初始化 WebGL
    const webGLCurtain = new Curtains({ container: "canvas" });
    const planeElement = document.getElementsByClassName("plane")[0];

    const params = {
        vertexShader: shader.vertex,
        fragmentShader: shader.fragment,
        widthSegments: 40,
        heightSegments: 40,
        uniforms: {
            time: {
                name: "uTime",
                type: "1f",
                value: 0
            },
            mousepos: {
                name: "uMouse",
                type: "2f",
                value: [mouse.x, mouse.y]
            },
            resolution: {
                name: "uReso",
                type: "2f",
                value: [window.innerWidth, window.innerHeight]
            }
        }
    };

    const plane = webGLCurtain.addPlane(planeElement, params);

    if (plane) {
        plane.onRender(function() {
            plane.uniforms.time.value++;
            plane.uniforms.resolution.value = [window.innerWidth, window.innerHeight];
        });

        canvasContainer.addEventListener("mousemove", function(e) {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            plane.uniforms.mousepos.value = [mouse.x, mouse.y];
        });
    }
});

// ===== Typewriter Effect =====
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
