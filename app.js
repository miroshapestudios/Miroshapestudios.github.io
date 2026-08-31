/* ==========================================================================
   MIROSHAPE STUDIOS - INTERACTIVE LOGIC & THREE.JS 3D RENDERER (ES/EN)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================================================
       0. THREE.JS 3D MASCOT RENDERER (GLTF/GLB LOAD & 360° ORBIT CONTROLS)
       ========================================================================== */
    function init3DMascot() {
        const container = document.getElementById('mascot-3d-canvas-container');
        if (!container || typeof THREE === 'undefined') return;

        const width = container.clientWidth || 360;
        const height = container.clientHeight || 360;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.set(0, 0, 4.2);

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        if (THREE.sRGBEncoding) renderer.outputEncoding = THREE.sRGBEncoding;
        container.appendChild(renderer.domElement);

        // Lighting System
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
        scene.add(ambientLight);

        const hemiLight = new THREE.HemisphereLight(0x2BF2DA, 0xFF5E43, 0.9);
        scene.add(hemiLight);

        const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.6);
        dirLight1.position.set(5, 8, 5);
        scene.add(dirLight1);

        const dirLight2 = new THREE.DirectionalLight(0x2BF2DA, 1.2);
        dirLight2.position.set(-5, -4, -4);
        scene.add(dirLight2);

        // Orbit Controls for 360° Mouse/Touch Rotation
        let controls;
        if (typeof THREE.OrbitControls !== 'undefined') {
            controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            controls.autoRotate = true;
            controls.autoRotateSpeed = 2.5;
            controls.enableZoom = false;
            controls.enablePan = false;
        }

        // Load MiroShape GLB
        if (typeof THREE.GLTFLoader !== 'undefined') {
            const loader = new THREE.GLTFLoader();
            const base64Source = window.MIRO_GLB_BASE64;
            const primaryPath = 'Character/MiroShape.glb';
            const fallbackPath = 'MiroShape.glb';

            function loadModel(path, stage) {
                loader.load(
                    path,
                    (gltf) => {
                        const model = gltf.scene;

                        // 1. Calculate exact 3D bounding box of the character
                        const box = new THREE.Box3().setFromObject(model);
                        const center = box.getCenter(new THREE.Vector3());
                        const size = box.getSize(new THREE.Vector3());

                        // 2. Shift model internal position so geometrical midpoint is at (0, 0, 0)
                        model.position.set(-center.x, -center.y, -center.z);

                        // 3. Create a centered wrapper group
                        const wrapperGroup = new THREE.Group();
                        wrapperGroup.add(model);

                        // 4. Scale wrapperGroup proportionally to fit container
                        const maxDim = Math.max(size.x, size.y, size.z);
                        if (maxDim > 0) {
                            const scale = 2.6 / maxDim;
                            wrapperGroup.scale.set(scale, scale, scale);
                        }

                        // 5. Add centered wrapperGroup to scene
                        scene.add(wrapperGroup);

                        if (controls) {
                            controls.target.set(0, 0, 0);
                            controls.update();
                        }
                    },
                    undefined,
                    (error) => {
                        if (stage === 1) {
                            loadModel(primaryPath, 2);
                        } else if (stage === 2) {
                            loadModel(fallbackPath, 3);
                        } else {
                            console.warn('GLTFLoader Error:', error);
                            container.innerHTML = '<img src="Logos/Characterlogo@4x.png" alt="MiroShape" class="mascot-fallback-img">';
                        }
                    }
                );
            }

            if (base64Source) {
                loadModel(base64Source, 1);
            } else {
                loadModel(primaryPath, 2);
            }
        } else {
            container.innerHTML = '<img src="Logos/Characterlogo@4x.png" alt="MiroShape" class="mascot-fallback-img">';
        }

        function animate() {
            requestAnimationFrame(animate);
            if (controls) controls.update();
            renderer.render(scene, camera);
        }
        animate();

        window.addEventListener('resize', () => {
            if (!container) return;
            const w = container.clientWidth || 360;
            const h = container.clientHeight || 360;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        });
    }

    init3DMascot();
    
    /* ==========================================================================
       1. BILINGUAL TRANSLATION ENGINE (ES / EN)
       ========================================================================== */
    const translations = {
        es: {
            "nav.home": "Inicio",
            "nav.services": "Servicios",
            "nav.projects": "Proyectos",
            "nav.about": "Nosotros",
            "nav.contact": "Contacto",
            "nav.quote": "Cotizar Proyecto",

            "hero.title": "IMAGINACIÓN EN 3D CREANDO MUNDOS SIN LÍMITES.",
            "hero.subtitle": "En Miroshape Studios damos vida a las ideas de nuestros clientes creando personajes, escenarios, props y animaciones 3D de alta calidad. Desarrollamos contenido visual para videojuegos, realidad virtual (VR), realidad aumentada (AR), producciones animadas, marketing y medios digitales, combinando creatividad, técnica y atención al detalle en cada proyecto.",
            "hero.btnStart": "Iniciar Proyecto",
            "hero.btnPortfolio": "Ver Portafolio",
            "hero.3dHint": "Arrastra para rotar en 3D",

            "services.title": "LO QUE HACEMOS",
            "services.intro": "En Miroshape Studios damos vida a las ideas de nuestros clientes creando personajes, props, escenarios, animaciones y contenido digital con calidad profesional. Desarrollamos activos visuales optimizados para videojuegos, realidad virtual (VR), realidad aumentada (AR), producciones animadas, marketing y medios digitales, combinando creatividad, técnica y atención al detalle en cada proyecto.",
            "services.pipelineTitle": "NUESTRO FLUJO DE PRODUCCIÓN",
            "services.pipelineSub": "Conoce las etapas que seguimos para transformar tu idea en un proyecto 3D listo para producción.",

            "pipeline.nodes.modelado": "Modelado",
            "pipeline.nodes.texturas": "UVs y Texturas",
            "pipeline.nodes.optimizacion": "Optimización",
            "pipeline.nodes.rigging": "Rigging",
            "pipeline.nodes.animacion": "Animación",
            "pipeline.nodes.integracion": "Integración",
            "pipeline.nodes.iluminacion": "Iluminación",
            "pipeline.nodes.renderizado": "Renderizado",

            "about.title": "SOBRE NOSOTROS",
            "about.subtitle": "Combinamos creatividad, innovación y excelencia técnica para desarrollar soluciones 3D de alta calidad.",
            "about.card1Title": "Creatividad e Innovación",
            "about.card1Text": "Transformamos ideas en personajes, escenarios, props y experiencias visuales que combinan creatividad, técnica y atención al detalle.",
            "about.card2Title": "Soluciones para Tiempo Real",
            "about.card2Text": "Desarrollamos activos optimizados para videojuegos, realidad virtual (VR), realidad aumentada (AR) y otras experiencias interactivas utilizando motores como Unity y Unreal Engine.",
            "about.card3Title": "Calidad Profesional",
            "about.card3Text": "Cada proyecto es desarrollado con altos estándares de modelado, texturizado, optimización y producción, garantizando resultados listos para su implementación.",
            "about.footerNote": "Más de 7 años desarrollando contenido 3D para videojuegos, VR, AR y producciones animadas, colaborando en proyectos que combinan creatividad, optimización y calidad profesional.",

            "projects.title": "PROYECTOS",
            "projects.desc": "Descubre algunos de los proyectos en los que hemos participado, creando personajes, escenarios, props y contenido 3D de alta calidad.",

            "portfolio.filterAll": "Todos",
            "portfolio.filterGames": "🎮 Videojuegos",
            "portfolio.filterSeries": "🎬 Series Animadas",
            "portfolio.filterVR": "🥽 Realidad Virtual (VR)",
            "portfolio.filterAR": "📱 Realidad Aumentada (AR)",

            "contact.title": "CONTACTO",
            "contact.subtitle": "¿Tienes un proyecto en mente?",
            "contact.lead": "Cuéntanos qué necesitas Creamos personajes, escenarios, props, animaciones y activos 3D para videojuegos, VR, AR, producciones animadas y otros proyectos digitales.",
            "contact.desc": "Revisaremos tu solicitud y te responderemos lo antes posible con una propuesta personalizada.",

            "form.nameLabel": "Nombre",
            "form.emailLabel": "Email",
            "form.titleLabel": "Título",
            "form.detailsLabel": "Mensaje",
            "form.submitBtn": "Enviar Solicitud",
            "form.successTitle": "¡Solicitud Recibida!",
            "form.successText": "Hemos recibido tu solicitud. Nuestro equipo de Miroshape la analizará y te responderá lo antes posible.",
            "form.resetBtn": "Enviar otra solicitud",

            "footer.desc": "Donde las ideas se transforman en experiencias visuales extraordinarias mediante arte, diseño y animación 3D.",
            "footer.phrase": "\"Construimos universos, un detalle a la vez.\"",
            "footer.navTitle": "Navegación",
            "footer.socialTitle": "Síguenos",
            "footer.rights": "Todos los derechos reservados."
        },
        en: {
            "nav.home": "Home",
            "nav.services": "Services",
            "nav.projects": "Projects",
            "nav.about": "About Us",
            "nav.contact": "Contact",
            "nav.quote": "Get a Quote",

            "hero.title": "3D IMAGINATION CREATING WORLDS WITHOUT LIMITS.",
            "hero.subtitle": "At Miroshape Studios we bring our clients' ideas to life by crafting high-quality 3D characters, environments, props, and animations. We develop visual content for video games, virtual reality (VR), augmented reality (AR), animated productions, marketing, and digital media, combining creativity, technical mastery, and attention to detail in every project.",
            "hero.btnStart": "Start Project",
            "hero.btnPortfolio": "View Portfolio",
            "hero.3dHint": "Drag to rotate in 3D",

            "services.title": "WHAT WE DO",
            "services.intro": "At Miroshape Studios we bring our clients' ideas to life by crafting high-quality 3D characters, props, environments, animations, and digital content with professional standards. We develop visual assets optimized for video games, virtual reality (VR), augmented reality (AR), animated productions, marketing, and digital media.",
            "services.pipelineTitle": "Our Production Pipeline",
            "services.pipelineSub": "Discover the stages we follow to transform your idea into a production-ready 3D project.",

            "pipeline.nodes.modelado": "Modeling",
            "pipeline.nodes.texturas": "UVs & Textures",
            "pipeline.nodes.optimizacion": "Optimization",
            "pipeline.nodes.rigging": "Rigging",
            "pipeline.nodes.animacion": "Animation",
            "pipeline.nodes.integracion": "Integration",
            "pipeline.nodes.iluminacion": "Lighting",
            "pipeline.nodes.renderizado": "Rendering",

            "about.title": "ABOUT US",
            "about.subtitle": "We combine creativity, innovation, and technical excellence to develop high-quality 3D solutions.",
            "about.card1Title": "Creativity & Innovation",
            "about.card1Text": "We transform ideas into characters, environments, props, and visual experiences that blend creativity, technique, and attention to detail.",
            "about.card2Title": "Real-Time Solutions",
            "about.card2Text": "We develop optimized assets for video games, virtual reality (VR), augmented reality (AR), and other interactive experiences using engines like Unity and Unreal Engine.",
            "about.card3Title": "Professional Quality",
            "about.card3Text": "Every project is developed with high standards of modeling, texturing, optimization, and production, ensuring results ready for deployment.",
            "about.footerNote": "Over 7 years developing 3D content for video games, VR, AR, and animated productions, collaborating on projects combining creativity, optimization, and professional quality.",

            "projects.title": "PROJECTS",
            "projects.desc": "Discover some of the projects we have participated in, creating high-quality characters, environments, props, and 3D content.",

            "portfolio.filterAll": "All",
            "portfolio.filterGames": "🎮 Video Games",
            "portfolio.filterSeries": "🎬 Animated Series",
            "portfolio.filterVR": "🥽 Virtual Reality (VR)",
            "portfolio.filterAR": "📱 Augmented Reality (AR)",

            "contact.title": "CONTACT US",
            "contact.lead": "Tell us what you need. We create characters, environments, props, animations, and 3D assets for video games, VR, AR, animated productions, and digital projects.",
            "contact.desc": "We will review your request and reply as soon as possible with a customized proposal.",

            "form.nameLabel": "Name",
            "form.emailLabel": "Email",
            "form.titleLabel": "Title",
            "form.detailsLabel": "Message",
            "form.submitBtn": "Send Request",
            "form.successTitle": "Request Received!",
            "form.successText": "We have received your request. Our Miroshape team will analyze it and reach out shortly.",
            "form.resetBtn": "Send another request",

            "footer.desc": "Where ideas are transformed into extraordinary visual experiences through art, design, and 3D animation.",
            "footer.phrase": "\"We build universes, one detail at a time.\"",
            "footer.navTitle": "Navigation",
            "footer.socialTitle": "Follow Us",
            "footer.rights": "All rights reserved."
        }
    };

    let currentLang = 'es';

    const setLanguage = (lang) => {
        currentLang = lang;
        const langData = translations[lang];
        
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (langData[key]) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = langData[key];
                } else {
                    el.textContent = langData[key];
                }
            }
        });

        const btnEs = document.getElementById('btn-es');
        const btnEn = document.getElementById('btn-en');
        if (btnEs && btnEn) {
            if (lang === 'es') {
                btnEs.classList.add('active');
                btnEn.classList.remove('active');
            } else {
                btnEn.classList.add('active');
                btnEs.classList.remove('active');
            }
        }

        updatePipelineNodeInfo();
    };

    const btnEs = document.getElementById('btn-es');
    const btnEn = document.getElementById('btn-en');

    if (btnEs && btnEn) {
        btnEs.addEventListener('click', () => setLanguage('es'));
        btnEn.addEventListener('click', () => setLanguage('en'));
    }

    /* ==========================================================================
       3. INTERACTIVE ARTISTIC CANVAS (Mesh, Sparkles & Mouse Trail)
       ========================================================================== */
    const canvas = document.getElementById('mesh-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        
        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        const colors = [
            'rgba(255, 94, 67, 0.22)',
            'rgba(43, 242, 218, 0.22)',
            'rgba(18, 22, 34, 0.95)',
            'rgba(255, 94, 67, 0.12)',
            'rgba(43, 242, 218, 0.12)'
        ];

        class Blob {
            constructor(x, y, radius, color) {
                this.x = x;
                this.y = y;
                this.radius = radius;
                this.baseRadius = radius;
                this.color = color;
                this.vx = (Math.random() - 0.5) * 1.2;
                this.vy = (Math.random() - 0.5) * 1.2;
                this.sinVal = Math.random() * 100;
                this.pulseSpeed = 0.005 + Math.random() * 0.008;
            }

            update(mouseX, mouseY, scrollY) {
                this.x += this.vx;
                this.y += this.vy;
                this.sinVal += this.pulseSpeed;
                
                this.radius = this.baseRadius + Math.sin(this.sinVal) * (this.baseRadius * 0.15);

                this.x += Math.sin(this.sinVal) * 0.25;
                this.y += Math.cos(this.sinVal) * 0.25;

                const margin = 200;
                if (this.x < -margin || this.x > width + margin) this.vx *= -1;
                if (this.y < -margin || this.y > height + margin) this.vy *= -1;

                if (mouseX !== undefined && mouseY !== undefined) {
                    const dx = this.x - mouseX;
                    const dy = this.y - mouseY;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    if (dist < 500) {
                        const force = (500 - dist) / 500;
                        this.x += (dx / dist) * force * 4;
                        this.y += (dy / dist) * force * 4;
                    }
                }

                this.y += (scrollY - lastScrollY) * 0.12;
            }

            draw() {
                const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
                grad.addColorStop(0, this.color);
                grad.addColorStop(0.5, this.color.replace('0.22', '0.08').replace('0.12', '0.04'));
                grad.addColorStop(1, 'transparent');
                
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const blobs = [];
        const numBlobs = 7;
        for (let i = 0; i < numBlobs; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const radius = Math.random() * (width * 0.3) + (width * 0.15);
            const color = colors[i % colors.length];
            blobs.push(new Blob(x, y, radius, color));
        }

        const sparkles = [];
        const numSparkles = 25;
        for (let i = 0; i < numSparkles; i++) {
            sparkles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 2.5 + 1,
                alpha: Math.random(),
                speed: 0.01 + Math.random() * 0.02,
                color: Math.random() > 0.5 ? '#FF5E43' : '#2BF2DA'
            });
        }

        function drawSparkles() {
            sparkles.forEach(s => {
                s.alpha += s.speed;
                if (s.alpha > 1 || s.alpha < 0) {
                    s.speed *= -1;
                }

                ctx.save();
                ctx.globalAlpha = Math.max(0, Math.min(1, s.alpha * 0.4));
                ctx.fillStyle = s.color;
                ctx.shadowBlur = 4;
                ctx.shadowColor = s.color;
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            });
        }

        const particles = [];
        function addParticle(x, y) {
            particles.push({
                x: x,
                y: y,
                size: Math.random() * 3.5 + 1.5,
                color: Math.random() > 0.5 ? '#FF5E43' : '#2BF2DA',
                vx: (Math.random() - 0.5) * 1.5,
                vy: (Math.random() - 0.5) * 1.5 - 0.5,
                alpha: 1.0,
                decay: 0.015 + Math.random() * 0.015
            });
        }

        let mouseX = width / 2;
        let mouseY = height / 2;
        let targetMouseX = mouseX;
        let targetMouseY = mouseY;
        let isMouseActive = false;

        window.addEventListener('mousemove', (e) => {
            targetMouseX = e.clientX;
            targetMouseY = e.clientY;
            isMouseActive = true;
            
            if (Math.random() > 0.3) {
                addParticle(e.clientX, e.clientY);
            }
        });

        window.addEventListener('mouseleave', () => {
            isMouseActive = false;
        });

        let lastScrollY = window.scrollY;
        let scrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            scrollY = window.scrollY;
        });

        function animate() {
            ctx.fillStyle = '#121622';
            ctx.fillRect(0, 0, width, height);

            ctx.filter = 'blur(110px)';
            ctx.globalCompositeOperation = 'screen';

            if (isMouseActive) {
                mouseX += (targetMouseX - mouseX) * 0.06;
                mouseY += (targetMouseY - mouseY) * 0.06;
            }

            blobs.forEach(blob => {
                blob.update(isMouseActive ? mouseX : undefined, isMouseActive ? mouseY : undefined, scrollY);
                blob.draw();
            });

            ctx.filter = 'none';
            ctx.globalCompositeOperation = 'source-over';

            drawSparkles();

            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.alpha -= p.decay;
                
                if (p.alpha <= 0) {
                    particles.splice(i, 1);
                } else {
                    ctx.save();
                    ctx.globalAlpha = p.alpha;
                    ctx.fillStyle = p.color;
                    ctx.shadowBlur = 8;
                    ctx.shadowColor = p.color;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                }
            }

            lastScrollY = scrollY;
            requestAnimationFrame(animate);
        }

        animate();
    }

    /* ==========================================================================
       4. STICKY NAVBAR & MOBILE MENU
       ========================================================================== */
    const navbar = document.getElementById('navbar');
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        let currentSection = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('open');
            navMenu.classList.toggle('open');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('open');
                navMenu.classList.remove('open');
            });
        });
    }

    /* ==========================================================================
       5. PIPELINE 3D - NAVEGACIÓN POR NODOS
       ========================================================================== */
    const pipelineNodes = document.querySelectorAll('.pipeline-node');
    const nodeTitle = document.getElementById('node-title');
    const nodeDescription = document.getElementById('node-description');
    const nodeMiroDisplayImg = document.getElementById('node-miro-display-img');
    const infoPanel = document.getElementById('pipeline-info-panel');

    const nodeData = {
        modelado: {
            title: { es: "Modelado", en: "Modeling" },
            desc: { 
                es: "Creamos personajes, props y escenarios optimizados según las necesidades del proyecto.",
                en: "We create characters, props, and environments optimized according to project requirements."
            },
            img: "PipelineMiro/1MODELADO.png",
            indicatorLeft: "7%"
        },
        texturas: {
            title: { es: "UVs y Texturas", en: "UVs & Textures" },
            desc: { 
                es: "Organizamos las UVs y desarrollamos materiales y texturas con un acabado profesional.",
                en: "We unwrap UVs and develop materials and textures with a professional finish."
            },
            img: "PipelineMiro/2UVSYTEXTURAS.png",
            indicatorLeft: "19%"
        },
        optimizacion: {
            title: { es: "Optimización", en: "Optimization" },
            desc: { 
                es: "Ajustamos la topología, densidad poligonal y recursos para obtener el mejor rendimiento.",
                en: "We adjust topology, polygon density, and assets to achieve peak performance."
            },
            img: "PipelineMiro/3OPTIMIZACION.png",
            indicatorLeft: "31%"
        },
        rigging: {
            title: { es: "Rigging", en: "Rigging" },
            desc: { 
                es: "Construimos esqueletos y sistemas de control que preparan los modelos para una deformación limpia, facilitando la animación y su integración en distintos motores o producciones.",
                en: "We build skeletons and control systems that prepare models for clean deformation, facilitating animation and integration into engines or productions."
            },
            img: "PipelineMiro/4RIGGING.png",
            indicatorLeft: "44%"
        },
        animacion: {
            title: { es: "Animación", en: "Animation" },
            desc: { 
                es: "Damos vida a personajes, objetos y escenarios mediante animaciones fluidas y expresivas, adaptadas a videojuegos, producciones animadas, VR y otros medios digitales.",
                en: "We bring characters, objects, and environments to life with fluid, expressive animations tailored for games, animated productions, VR, and digital media."
            },
            img: "PipelineMiro/6Animacion.mp4",
            isVideo: true,
            indicatorLeft: "57%"
        },
        integracion: {
            title: { es: "Integración (Unity / Unreal)", en: "Engine Integration (Unity / Unreal)" },
            desc: { 
                es: "Configuramos y preparamos activos 3D para su correcto funcionamiento e integración directa en motores en tiempo real como Unity y Unreal Engine.",
                en: "We configure and prepare 3D assets for smooth, direct integration into real-time engines like Unity and Unreal Engine."
            },
            img: "PipelineMiro/8INTEGRACION.png",
            indicatorLeft: "70%"
        },
        iluminacion: {
            title: { es: "Iluminación", en: "Lighting" },
            desc: { 
                es: "Configuramos la iluminación y el ambiente para resaltar cada escena, creando la atmósfera adecuada según el estilo y los objetivos del proyecto.",
                en: "We set up lighting and environment to highlight every scene, crafting the right atmosphere tailored to project style and goals."
            },
            img: "PipelineMiro/5ILUMINACION.png",
            indicatorLeft: "83%"
        },
        renderizado: {
            title: { es: "Renderizado", en: "Rendering" },
            desc: { 
                es: "Generamos imágenes y secuencias finales con alta calidad visual, listas para presentación, publicidad, producciones audiovisuales o portafolios.",
                en: "We generate final images and sequences with high visual quality, ready for presentations, advertising, audiovisual productions, or portfolios."
            },
            img: "PipelineMiro/7RENDER.png",
            indicatorLeft: "94%"
        }
    };

    let activeNodeKey = 'modelado';

    function updatePipelineNodeInfo() {
        if (!nodeTitle || !nodeDescription) return;
        const data = nodeData[activeNodeKey];
        if (data) {
            nodeTitle.textContent = data.title[currentLang];
            nodeDescription.textContent = data.desc[currentLang];
            
            const imgSide = document.querySelector('.node-info-img-side');
            if (imgSide) {
                if (data.isVideo) {
                    imgSide.innerHTML = `<video src="${data.img}" autoplay loop muted playsinline class="node-info-miro-main" id="node-miro-display-img"></video>`;
                } else {
                    imgSide.innerHTML = `<img src="${data.img}" alt="Miro Pipeline Stage" id="node-miro-display-img" class="node-info-miro-main">`;
                }
            }
        }
    }

    if (pipelineNodes.length > 0 && infoPanel) {
        pipelineNodes.forEach(node => {
            node.addEventListener('click', () => {
                pipelineNodes.forEach(n => n.classList.remove('active'));
                node.classList.add('active');
                
                activeNodeKey = node.getAttribute('data-node');
                const data = nodeData[activeNodeKey];

                infoPanel.style.opacity = '0';
                infoPanel.style.transform = 'translateY(5px)';

                setTimeout(() => {
                    updatePipelineNodeInfo();
                    
                    if (window.innerWidth > 992) {
                        infoPanel.style.setProperty('--arrow-left', data.indicatorLeft);
                    }
                    
                    infoPanel.style.opacity = '1';
                    infoPanel.style.transform = 'translateY(0)';
                }, 200);
            });
        });
    }

    /* ==========================================================================
       6. PORTAFOLIO - FILTROS Y EFECTO HOVER 3D (TILT)
       ========================================================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-card');

    if (filterButtons.length > 0 && portfolioCards.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const filterValue = button.getAttribute('data-filter');

                portfolioCards.forEach(card => {
                    const categories = card.getAttribute('data-category').split(' ');
                    
                    if (filterValue === 'all' || categories.includes(filterValue)) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.85)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });

        portfolioCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const cardRect = card.getBoundingClientRect();
                
                const mouseX = e.clientX - cardRect.left;
                const mouseY = e.clientY - cardRect.top;
                
                const percentX = (mouseX / cardRect.width) - 0.5;
                const percentY = (mouseY / cardRect.height) - 0.5;
                
                const maxRotation = 10; 
                const rotateX = -percentY * maxRotation;
                const rotateY = percentX * maxRotation;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px) scale(1.02)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)`;
            });
        });
    }

    /* ==========================================================================
       7. FORMULARIO DE CONTACTO SIMPLIFICADO
       ========================================================================== */
    const quoteForm = document.getElementById('quote-form');
    const formSuccess = document.getElementById('form-success');
    const resetFormBtn = document.getElementById('btn-reset-form');
    const submitBtn = document.getElementById('form-submit-btn');

    const btnIndiePostular = document.getElementById('btn-indie-postular');
    if (btnIndiePostular) {
        btnIndiePostular.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = document.getElementById('contacto');
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
            
            const detailsField = document.getElementById('form-details');
            if (detailsField) {
                detailsField.focus();
                detailsField.placeholder = currentLang === 'es' ? 
                    "Hola Miroshape, tengo una propuesta de proyecto indie..." : 
                    "Hello Miroshape, I have an indie project proposal...";
            }
        });
    }

    if (quoteForm && submitBtn) {
        quoteForm.addEventListener('submit', () => {
            submitBtn.disabled = true;
            submitBtn.textContent = currentLang === 'es' ? "Enviando Solicitud..." : "Sending Request...";
            submitBtn.style.opacity = '0.7';
        });
    }

    if (resetFormBtn && quoteForm && formSuccess) {
        resetFormBtn.addEventListener('click', () => {
            quoteForm.reset();
            formSuccess.style.display = 'none';
            quoteForm.style.display = 'flex';
        });
    }

    /* ==========================================================================
       8. MODAL DE PROYECTOS Y LIGHTBOX PANTALLA COMPLETA
       ========================================================================== */
    const projectsData = {
        'tier-haze-1': {
            title: 'Tier Haze 1',
            tag: '🎬 Series Animadas / Corto Animado',
            description: 'En <strong>Tier Haze 1</strong> realizamos la producción del corto animado, encargándonos del modelado 3D de escenarios y props (el personaje ya estaba diseñado previamente), rigging corporal y facial, animación fluida, esquema de iluminación y renderizado final.',
            scope: ['Modelado de Escenarios y Props', 'Rigging', 'Animación', 'Iluminación', 'Renderizado'],
            video: 'Proyectos/Tier haze 1 Corto Animado/Render_Clip.mp4',
            poster: 'Proyectos/Tier haze 1 Corto Animado/Render_Final0001.png',
            gallery: [
                'Proyectos/Tier haze 1 Corto Animado/Render_Final0001.png',
                'Proyectos/Tier haze 1 Corto Animado/Render_Final0041.png',
                'Proyectos/Tier haze 1 Corto Animado/Render_Final0224.png',
                'Proyectos/Tier haze 1 Corto Animado/Render_Final0237.png',
                'Proyectos/Tier haze 1 Corto Animado/Render_Final0301.png'
            ]
        },
        'tier-haze-2': {
            title: 'Tier Haze 2',
            tag: '🎬 Series Animadas / Edición Mundial',
            description: 'Secuencia animada del personaje jugando con el balón de fútbol para una edición especial del Mundial. En este proyecto se realizó únicamente la secuencia de animación y el renderizado final de alta fidelidad.',
            scope: ['Secuencia de Animación', 'Renderizado HD', 'Edición Especial Mundial'],
            video: 'Proyectos/Tierhaze2 Corto Animado/ClipFutbol.mp4',
            poster: 'Proyectos/Tierhaze2 Corto Animado/Anim_Haze0468.png',
            gallery: [
                'Proyectos/Tierhaze2 Corto Animado/Anim_Haze0468.png',
                'Proyectos/Tierhaze2 Corto Animado/Anim_Haze0443.png',
                'Proyectos/Tierhaze2 Corto Animado/Anim_Haze0577.png',
                'Proyectos/Tierhaze2 Corto Animado/Anim_Haze0830.png'
            ]
        },
        'interlace-logo': {
            title: 'Interlace Logo',
            tag: '🎬 Corto Animado / Identidad 3D',
            description: 'Desarrollo completo de animación 3D para logo corporativo de empresa. Se realizó el modelado, texturizado, rigging, animación y renderizado final de la secuencia de identidad visual. Explora a continuación todos los clips y videos del proyecto.',
            scope: ['Modelado 3D', 'Texturizado', 'Rigging', 'Animación', 'Renderizado'],
            video: 'Proyectos/Interlace Logo - Corto Animado/Video_Logo_Union.mp4',
            videos: [
                { title: '📹 Video Completo', src: 'Proyectos/Interlace Logo - Corto Animado/Video_Logo_Union.mp4' },
                { title: '📹 Clip Animación 01', src: 'Proyectos/Interlace Logo - Corto Animado/0000-0600 (1).mp4' },
                { title: '📹 Video Parte 01', src: 'Proyectos/Interlace Logo - Corto Animado/Video_Logo_Part_010000-0720.mkv' },
                { title: '📹 Video Parte 02', src: 'Proyectos/Interlace Logo - Corto Animado/Video_Logo_Part_020000-0720.mkv' }
            ],
            poster: 'Proyectos/Interlace Logo - Corto Animado/Portada.png',
            gallery: ['Proyectos/Interlace Logo - Corto Animado/Portada.png']
        },
        'room-vr': {
            title: 'Room VR',
            tag: '🥽 Realidad Virtual (VR)',
            description: 'Trabajamos en el modelado 3D de props, escenarios, texturizado detallado, iluminación ambiental y montaje interactivo dentro de Unreal Engine.',
            scope: ['Modelado de Props y Escenarios', 'Texturizado', 'Iluminación', 'Montaje en Unreal Engine'],
            video: null,
            poster: 'Proyectos/Room VR/1.PNG',
            gallery: [
                'Proyectos/Room VR/1.PNG',
                'Proyectos/Room VR/2.PNG',
                'Proyectos/Room VR/Captura de pantalla 2026-07-21 152511.png',
                'Proyectos/Room VR/Captura de pantalla 2026-07-21 152523.png',
                'Proyectos/Room VR/Captura de pantalla 2026-07-21 152546.png',
                'Proyectos/Room VR/Captura de pantalla 2026-07-21 152558.png',
                'Proyectos/Room VR/Captura de pantalla 2026-07-21 152628.png',
                'Proyectos/Room VR/Captura de pantalla 2026-07-21 152644.png',
                'Proyectos/Room VR/Captura de pantalla 2026-07-21 152659.png',
                'Proyectos/Room VR/Captura de pantalla 2026-07-21 152718.png',
                'Proyectos/Room VR/Captura de pantalla 2026-07-21 152931.png'
            ]
        },
        'metroject-vr': {
            title: 'Metroject VR',
            tag: '🥽 Realidad Virtual (VR)',
            description: 'Proyecto completo cinemático para VR. Se trabajó el modelado 3D, texturizado, rigging corporal y facial, animación, captura de movimiento (Mocap), renderizado y montaje en Unreal Engine.',
            scope: ['Modelado', 'Texturizado', 'Rigging', 'Animación', 'Mocap (Captura de Movimiento)', 'Renderizado', 'Montaje en Unreal Engine'],
            video: 'Proyectos/Metroject VR/VIDEO_01_NEW.mp4',
            poster: 'Proyectos/Metroject VR/Render_Metroject (3).png',
            gallery: [
                'Proyectos/Metroject VR/Render_Metroject (3).png',
                'Proyectos/Metroject VR/Render_Metroject (2).png',
                'Proyectos/Metroject VR/Render_Metroject (1).png',
                'Proyectos/Metroject VR/Render_Metroject (1).jpeg'
            ]
        },
        'chiribiquete-game': {
            title: 'El Murmullo de Chiribiquete',
            tag: '🎮 Videojuegos / Game Jam',
            description: 'Proyecto de videojuego realizado en un Game Jam junto a grandes artistas 3D y programadores. Se trabajó el modelado de assets, escenarios, propuesta visual integral y montaje interactivo en Unity Engine.',
            scope: ['Modelado de Assets y Escenarios', 'Propuesta Visual', 'Montaje en Unity', 'Game Jam Colaborativo'],
            video: 'Proyectos/El murmullo de chiribiquete  VideoJuego/Video_Vr.mp4',
            poster: 'Proyectos/El murmullo de chiribiquete  VideoJuego/Captura de pantalla 2026-07-21 234702.png',
            gallery: [
                'Proyectos/El murmullo de chiribiquete  VideoJuego/Captura de pantalla 2026-07-21 234702.png',
                'Proyectos/El murmullo de chiribiquete  VideoJuego/Captura de pantalla 2026-07-21 234602.png',
                'Proyectos/El murmullo de chiribiquete  VideoJuego/Captura de pantalla 2026-07-21 234613.png',
                'Proyectos/El murmullo de chiribiquete  VideoJuego/Captura de pantalla 2026-07-21 234751.png',
                'Proyectos/El murmullo de chiribiquete  VideoJuego/Captura de pantalla 2026-07-21 234811.png',
                'Proyectos/El murmullo de chiribiquete  VideoJuego/Captura de pantalla 2026-07-21 234848.png',
                'Proyectos/El murmullo de chiribiquete  VideoJuego/Captura de pantalla 2026-07-21 234859.png',
                'Proyectos/El murmullo de chiribiquete  VideoJuego/Captura de pantalla 2026-07-21 234910.png',
                'Proyectos/El murmullo de chiribiquete  VideoJuego/Captura de pantalla 2026-07-21 234923.png',
                'Proyectos/El murmullo de chiribiquete  VideoJuego/Captura de pantalla 2026-07-21 234947.png',
                'Proyectos/El murmullo de chiribiquete  VideoJuego/Captura de pantalla 2026-07-21 235110.png',
                'Proyectos/El murmullo de chiribiquete  VideoJuego/Captura de pantalla 2026-07-21 235145.png',
                'Proyectos/El murmullo de chiribiquete  VideoJuego/Captura de pantalla 2026-07-21 235248.png',
                'Proyectos/El murmullo de chiribiquete  VideoJuego/Captura de pantalla 2026-07-21 235314.png'
            ]
        },
        'renders-3d': {
            title: 'Renders 3D & Iluminación',
            tag: '🎨 Renderizado 3D / Arte Digital',
            description: 'Colección especial de renderizados 3D de alta fidelidad, estudio de iluminación ambiental, texturizado PBR fotorrealista y composición visual para personajes, escenarios y props.',
            scope: ['Modelado 3D', 'Texturizado PBR', 'Iluminación Ambiental', 'Composición Visual', 'Renderizado HD'],
            video: null,
            poster: 'Proyectos/Renders/Renders_Apt (1).jpg',
            gallery: [
                'Proyectos/Renders/Renders_Apt (1).jpg',
                'Proyectos/Renders/Renders_Apt (2).jpg',
                'Proyectos/Renders/Renders_Apt (3).jpg',
                'Proyectos/Renders/Renders_Apt (4).jpg',
                'Proyectos/Renders/Renders_Apt (5).jpg',
                'Proyectos/Renders/Renders_Apt (6).jpg',
                'Proyectos/Renders/Renders_Apt (7).jpg',
                'Proyectos/Renders/Renders_Apt (8).jpg',
                'Proyectos/Renders/Renders_Apt (9).jpg',
                'Proyectos/Renders/Renders_Apt (10).jpg'
            ]
        }
    };

    const projectModal = document.getElementById('project-modal');
    const modalClose = document.getElementById('project-modal-close');
    const modalBackdrop = document.getElementById('project-modal-backdrop');
    const modalVideoPlayer = document.getElementById('modal-video-player');
    const modalMediaContainer = document.getElementById('modal-media-container');
    const modalTag = document.getElementById('modal-project-tag');
    const modalTitle = document.getElementById('modal-project-title');
    const modalDesc = document.getElementById('modal-project-desc');
    const modalGalleryContainer = document.getElementById('modal-gallery-container');

    // Lightbox elements
    const lightbox = document.getElementById('image-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxBackdrop = document.getElementById('lightbox-backdrop');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');

    let currentGallerySources = [];
    let currentImageIndex = 0;

    const populateModalData = (projectKey) => {
        const data = projectsData[projectKey];
        if (!data) return;

        if (modalTag) modalTag.textContent = data.tag;
        if (modalTitle) modalTitle.textContent = data.title;
        if (modalDesc) modalDesc.innerHTML = data.description;

        // Render Scope Chips
        const scopeContainer = document.querySelector('.project-modal-scope');
        if (scopeContainer) {
            scopeContainer.innerHTML = data.scope.map(s => `<span class="scope-chip">${s}</span>`).join('');
        }

        // Render Media (YouTube, HTML5 Video or Cover Image)
        if (modalMediaContainer) {
            if (data.youtube) {
                modalMediaContainer.innerHTML = `
                    <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                        <iframe src="${data.youtube}?autoplay=1&rel=0" title="${data.title}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    </div>
                `;
            } else if (data.video) {
                let playlistHTML = '';
                if (data.videos && data.videos.length > 0) {
                    playlistHTML = `
                        <div class="video-playlist-container">
                            <div class="video-playlist-heading">Seleccionar Video del Proyecto:</div>
                            ${data.videos.map((v, idx) => `
                                <button class="video-playlist-btn ${idx === 0 ? 'active' : ''}" data-src="${v.src}">${v.title}</button>
                            `).join('')}
                        </div>
                    `;
                }

                modalMediaContainer.innerHTML = `
                    <video id="modal-video-player" controls poster="${data.poster}" class="project-modal-video">
                        <source src="${data.video}" type="video/mp4">
                        Tu navegador no soporta reproducción de video HTML5.
                    </video>
                    ${playlistHTML}
                `;

                if (data.videos && data.videos.length > 0) {
                    const playlistBtns = modalMediaContainer.querySelectorAll('.video-playlist-btn');
                    playlistBtns.forEach(btn => {
                        btn.addEventListener('click', () => {
                            playlistBtns.forEach(b => b.classList.remove('active'));
                            btn.classList.add('active');
                            const newSrc = btn.getAttribute('data-src');
                            const player = document.getElementById('modal-video-player');
                            if (player) {
                                player.src = newSrc;
                                player.load();
                                player.play().catch(() => {});
                            }
                        });
                    });
                }
            } else {
                modalMediaContainer.innerHTML = `
                    <img src="${data.poster}" alt="${data.title}" class="project-modal-video" style="max-height: 480px; object-fit: contain;">
                `;
            }
        }

        // Render Gallery Thumbnails
        currentGallerySources = data.gallery;
        if (modalGalleryContainer) {
            if (data.gallery && data.gallery.length > 0) {
                modalGalleryContainer.style.display = 'grid';
                const heading = document.querySelector('.gallery-heading');
                if (heading) heading.style.display = 'block';

                modalGalleryContainer.innerHTML = data.gallery.map((imgUrl, idx) => `
                    <img src="${imgUrl}" alt="${data.title} Render ${idx + 1}" class="gallery-thumb ${idx === 0 ? 'active' : ''}" data-index="${idx}">
                `).join('');

                // Re-bind click events for gallery thumbs
                const newThumbs = modalGalleryContainer.querySelectorAll('.gallery-thumb');
                newThumbs.forEach((thumb, idx) => {
                    thumb.addEventListener('click', (e) => {
                        e.stopPropagation();
                        newThumbs.forEach(t => t.classList.remove('active'));
                        thumb.classList.add('active');
                        openLightbox(idx);
                    });
                });
            } else {
                modalGalleryContainer.style.display = 'none';
                const heading = document.querySelector('.gallery-heading');
                if (heading) heading.style.display = 'none';
            }
        }
    };

    const openProjectModal = (projectKey) => {
        populateModalData(projectKey);
        if (projectModal) {
            projectModal.classList.add('open');
            document.body.style.overflow = 'hidden';
            const activePlayer = document.getElementById('modal-video-player');
            if (activePlayer) {
                activePlayer.currentTime = 0;
                activePlayer.play().catch(() => {});
            }
        }
    };

    const closeProjectModal = () => {
        if (projectModal) {
            projectModal.classList.remove('open');
            document.body.style.overflow = '';
            const activePlayer = document.getElementById('modal-video-player');
            if (activePlayer) {
                activePlayer.pause();
            }
        }
    };

    const projectCards = document.querySelectorAll('.media-project-card');
    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            const projectKey = card.getAttribute('data-project') || 'tier-haze-1';
            openProjectModal(projectKey);
        });
    });

    if (modalClose) modalClose.addEventListener('click', closeProjectModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeProjectModal);

    // Lightbox logic
    const updateLightboxImage = (index) => {
        if (currentGallerySources.length === 0) return;
        currentImageIndex = (index + currentGallerySources.length) % currentGallerySources.length;
        if (lightboxImg) {
            lightboxImg.src = currentGallerySources[currentImageIndex];
        }
        if (lightboxCaption) {
            lightboxCaption.textContent = `Imagen ${currentImageIndex + 1} de ${currentGallerySources.length}`;
        }
    };

    const openLightbox = (index) => {
        updateLightboxImage(index);
        if (lightbox) {
            lightbox.classList.add('open');
        }
    };

    const closeLightbox = () => {
        if (lightbox) {
            lightbox.classList.remove('open');
        }
    };

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', () => updateLightboxImage(currentImageIndex - 1));
    if (lightboxNext) lightboxNext.addEventListener('click', () => updateLightboxImage(currentImageIndex + 1));

    window.addEventListener('keydown', (e) => {
        if (lightbox && lightbox.classList.contains('open')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') updateLightboxImage(currentImageIndex - 1);
            if (e.key === 'ArrowRight') updateLightboxImage(currentImageIndex + 1);
        } else if (e.key === 'Escape' && projectModal && projectModal.classList.contains('open')) {
            closeProjectModal();
        }
    });
});
