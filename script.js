// --- 1. THREE.JS GLOBE ---
function initGlobe() {
    const container = document.getElementById('globe-container');
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 18; camera.position.y = 5; camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Base Globe
    const geometry = new THREE.IcosahedronGeometry(6, 2);
    const material = new THREE.MeshBasicMaterial({ color: 0x111827, transparent: true, opacity: 0.95 });
    globeGroup.add(new THREE.Mesh(geometry, material));
    globeGroup.add(new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0x00f2ff, wireframe: true, transparent: true, opacity: 0.15 })));

    const GLOBE_RADIUS = 6;
    
    function latLonToVector3(lat, lon, radius) {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);
        const x = -(radius * Math.sin(phi) * Math.cos(theta));
        const z = (radius * Math.sin(phi) * Math.sin(theta));
        const y = (radius * Math.cos(phi));
        return new THREE.Vector3(x, y, z);
    }

    function drawLoop(coordinates, color, opacity, lineWidth) {
        const points = [];
        coordinates.forEach(coord => {
            points.push(latLonToVector3(coord[1], coord[0], GLOBE_RADIUS + 0.03));
        });
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ color: color, linewidth: lineWidth, transparent: true, opacity: opacity });
        globeGroup.add(new THREE.Line(geometry, material));
    }

    function drawFill(coordinates, color) {
        const shape = new THREE.Shape();
        shape.moveTo(coordinates[0][0], coordinates[0][1]);
        for (let i = 1; i < coordinates.length; i++) {
            shape.lineTo(coordinates[i][0], coordinates[i][1]);
        }
        const geometry = new THREE.ShapeGeometry(shape);
        const pos = geometry.attributes.position;
        for (let i = 0; i < pos.count; i++) {
            const v = latLonToVector3(pos.getY(i), pos.getX(i), GLOBE_RADIUS + 0.01);
            pos.setXYZ(i, v.x, v.y, v.z);
        }
        globeGroup.add(new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.4, side: THREE.DoubleSide })));
    }

    fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json')
        .then(res => res.json())
        .then(data => {
            data.features.forEach(feature => {
                const isKSA = feature.id === 'SAU';
                const isUAE = feature.id === 'ARE';
                
                let color = 0x3daad9; 
                let opacity = 0.2;    
                let lineWidth = 1;

                if (isKSA || isUAE) {
                    color = isKSA ? 0x22c55e : 0xFFD700; 
                    opacity = 1.0;
                    lineWidth = 2;
                }

                if (feature.geometry.type === 'Polygon') {
                    feature.geometry.coordinates.forEach(loop => drawLoop(loop, color, opacity, lineWidth));
                    if (isKSA || isUAE) drawFill(feature.geometry.coordinates[0], color);
                } else if (feature.geometry.type === 'MultiPolygon') {
                    feature.geometry.coordinates.forEach(polygon => {
                        polygon.forEach(loop => drawLoop(loop, color, opacity, lineWidth));
                        if (isKSA || isUAE) drawFill(polygon[0], color);
                    });
                }
            });
        })
        .catch(err => console.error("Globe Data Error:", err));

    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 1500;
    const posArray = new Float32Array(starsCount * 3);
    for(let i = 0; i < starsCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 90;
    }
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const starMesh = new THREE.Points(starsGeometry, new THREE.PointsMaterial({size: 0.08, color: 0xffffff, transparent: true, opacity: 0.7}));
    scene.add(starMesh);

    let scrollPercent = 0;
    window.addEventListener('scroll', () => {
        scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    });

    function animate() {
        requestAnimationFrame(animate);
        globeGroup.rotation.y -= 0.0015;
        starMesh.rotation.y -= 0.0002;
        const targetZ = 18 - (scrollPercent * 10); 
        const targetY = 5 - (scrollPercent * 3);
        camera.position.z += (targetZ - camera.position.z) * 0.05;
        camera.position.y += (targetY - camera.position.y) * 0.05;
        camera.lookAt(0, 0, 0);
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// --- 2. GENERAL UI LOGIC ---
document.addEventListener('DOMContentLoaded', () => {
    initGlobe();

    const cursor = document.getElementById('cursor');
    const magneticTriggers = document.querySelectorAll('.magnetic-trigger');
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
    magneticTriggers.forEach(trigger => {
        trigger.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
        trigger.addEventListener('mouseleave', () => {
            cursor.classList.remove('hovered');
            trigger.style.transform = 'translate(0, 0)';
        });
        trigger.addEventListener('mousemove', (e) => {
            const rect = trigger.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            trigger.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });
    });

   

    // Flip Cards Spotlight
    document.querySelectorAll('.flip-card-container').forEach(c => {
        c.addEventListener('mousemove', e => {
            const r = c.getBoundingClientRect();
            c.querySelector('.flip-card-front').style.background = `radial-gradient(circle at ${e.clientX - r.left}px ${e.clientY - r.top}px, rgba(0,242,255,0.15), rgba(17,24,39,0.7) 40%)`;
        });
        c.addEventListener('mouseleave', e => c.querySelector('.flip-card-front').style.background = '');
    });

    // Scroll Progress
    window.addEventListener('scroll', () => {
        const journeySection = document.getElementById('journey');
        if (!journeySection) return;
        const rect = journeySection.getBoundingClientRect();
        const height = journeySection.offsetHeight;
        const top = rect.top;
        if (top < window.innerHeight && top > -height) {
            let percent = ((window.innerHeight - top) / (height + window.innerHeight)) * 100;
            const bar = document.getElementById('scroll-progress');
            if(bar) bar.style.height = Math.min(Math.max(percent, 0), 100) + '%';
        }
    });

    // Stamp Collector
    const collectedStamps = new Set();
    const stamps = {
        'entry': { icon: 'fa-plane-arrival', color: 'text-brand-neon' },
        'tools': { icon: 'fa-tools', color: 'text-brand-gold' },
        'journey': { icon: 'fa-route', color: 'text-brand-purple' },
        'footer': { icon: 'fa-flag-checkered', color: 'text-white' }
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('data-stamp');
                if (id && !collectedStamps.has(id)) {
                    collectedStamps.add(id);
                    document.getElementById('stamp-count').innerText = collectedStamps.size;
                    const grid = document.getElementById('stamp-grid');
                    const sData = stamps[id];
                    if(sData) grid.innerHTML += `<div class="h-12 bg-gray-800 rounded flex items-center justify-center animate-pulse-glow"><i class="fas ${sData.icon} ${sData.color}"></i></div>`;
                }
            }
        });
    }, { threshold: 0.3 });
    document.querySelectorAll('.section-tracker').forEach(sec => observer.observe(sec));

    // Modal Logic
    const modal = document.getElementById('assessment-modal');
    const modalContent = document.getElementById('modal-content');
    const step1 = document.getElementById('modal-step-1');
    const step2 = document.getElementById('modal-step-2');
    const goalOptions = [document.getElementById('goal-work'), document.getElementById('goal-study'), document.getElementById('goal-visit')];
    const goalValues = ['Work Visa', 'Study Visa', 'Tourist Visa'];
    let selectedGoal = goalValues[0];

    window.selectGoalVisual = function(index) {
        goalOptions.forEach(opt => opt.classList.remove('active'));
        goalOptions[index].classList.add('active');
        selectedGoal = goalValues[index];
    };

    document.querySelectorAll('.open-assessment-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            setTimeout(() => {
                modalContent.classList.remove('scale-95', 'opacity-0');
                modalContent.classList.add('scale-100', 'opacity-100');
            }, 10);
            step1.classList.remove('hidden');
            step2.classList.add('hidden');
            document.getElementById('modal-step-success').classList.add('hidden');
        });
    });

    document.getElementById('modal-close-btn').addEventListener('click', closeModal);
    
    function closeModal() {
        modalContent.classList.remove('scale-100', 'opacity-100');
        modalContent.classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }, 200);
    }

    document.getElementById('modal-next-btn').addEventListener('click', () => {
        document.getElementById('visa-type-hidden').value = selectedGoal;
        step1.classList.add('hidden');
        step2.classList.remove('hidden');
    });

    // Calculator Logic
    const slider = document.getElementById('duration-slider');
    const durationDisplay = document.getElementById('duration-display');
    const totalPriceEl = document.getElementById('total-price');
    let basePrice = 450, addOns = 0;
    const prices = { 1: 450, 2: 750, 3: 1100 };
    const labels = { 1: "30 Days", 2: "60 Days", 3: "90 Days" };

    if(slider) {
        slider.addEventListener('input', () => {
            basePrice = prices[slider.value];
            durationDisplay.innerText = labels[slider.value];
            updateTotal();
        });
    }

    window.toggleSwitch = function(element, cost) {
        const checkbox = element.querySelector('.check-box i');
        if (element.classList.contains('active')) {
            element.classList.remove('active', 'bg-white/20');
            element.classList.add('bg-white/5');
            checkbox.classList.add('opacity-0');
            addOns -= cost;
        } else {
            element.classList.add('active', 'bg-white/20');
            element.classList.remove('bg-white/5');
            checkbox.classList.remove('opacity-0');
            addOns += cost;
        }
        updateTotal();
    };

    function updateTotal() {
        totalPriceEl.innerText = basePrice + addOns;
        totalPriceEl.classList.remove('animate-bounce');
        void totalPriceEl.offsetWidth; 
        totalPriceEl.classList.add('animate-bounce');
    }

    // Quiz Logic
    const quizData = [
        { q: "Nationality Group?", opts: ["Asia", "Europe/Americas", "Africa", "Other"] },
        { q: "Purpose of Visit?", opts: ["Tourism/Leisure", "Job Hunting", "Business Meeting"] },
        { q: "Visited UAE before?", opts: ["Yes, multiple times", "No, first time"] }
    ];
    let currentQ = 0;

    window.startQuiz = function() {
        document.getElementById('quiz-start').classList.add('hidden');
        document.getElementById('quiz-question').classList.remove('hidden');
        loadQuestion();
    };

    function loadQuestion() {
        const qData = quizData[currentQ];
        document.getElementById('q-text').innerText = qData.q;
        document.getElementById('question-counter').innerText = `STEP ${currentQ + 1}/${quizData.length}`;
        document.getElementById('quiz-progress').style.width = `${((currentQ + 1)/quizData.length) * 100}%`;
        const optsDiv = document.getElementById('q-options');
        optsDiv.innerHTML = '';
        qData.opts.forEach(opt => {
            optsDiv.innerHTML += `<button onclick="nextQuestion()" class="w-full text-left p-3 rounded-lg bg-gray-900 hover:bg-brand-purple hover:text-white transition-colors border border-gray-700">${opt}</button>`;
        });
    }

    window.nextQuestion = function() {
        currentQ++;
        if (currentQ < quizData.length) loadQuestion();
        else {
            document.getElementById('quiz-question').classList.add('hidden');
            document.getElementById('quiz-result').classList.remove('hidden');
        }
    };

    // News Slider
    const mockNewsData = [
        { id: 1, category: 'KSA Updates', categoryColor: 'text-brand-neon', title: 'Vision 2030: New Opportunities', summary: 'Learn about the new projects and visa reforms opening up the Kingdom.', imageUrl: 'https://placehold.co/600x400/1e3a8a/ffffff?text=KSA+Vision', sourceUrl: 'https://www.vision2030.gov.sa/en' },
        { id: 2, category: 'UAE Updates', categoryColor: 'text-brand-purple', title: 'UAE Golden Visa Guide', summary: 'The coveted 10-year Golden Visa has new categories for professionals.', imageUrl: 'https://placehold.co/600x400/065f46/ffffff?text=UAE+Golden', sourceUrl: 'https://u.ae/en/information-and-services/visa-and-emirates-id/residence-visas/golden-visa' },
        { id: 3, category: 'Travel Tips', categoryColor: 'text-brand-gold', title: '5 Visa Application Mistakes', summary: 'A simple error can lead to costly delays. Avoid these pitfalls.', imageUrl: 'https://placehold.co/600x400/4b5563/ffffff?text=Travel+Tips', sourceUrl: 'https://ifza.com/en/uae-visa-common-application-mistakes/' }
    ];
    const newsGrid = document.getElementById('news-grid');
    const sliderEl = document.getElementById('news-slider');

    if (newsGrid) {
        mockNewsData.forEach(n => {
            newsGrid.innerHTML += `
            <div class="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 hover:transform hover:scale-105 transition duration-300">
                <img src="${n.imageUrl}" class="w-full h-40 object-cover">
                <div class="p-5">
                    <span class="text-xs font-mono ${n.categoryColor} mb-2 block">${n.category}</span>
                    <h4 class="text-white font-bold text-lg leading-tight mb-2">${n.title}</h4>
                    <p class="text-gray-400 text-sm mb-4 line-clamp-2">${n.summary}</p>
                    <button class="text-brand-neon text-sm font-bold flex items-center gap-1 read-story-btn" data-id="${n.id}">
                        Read Story <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            </div>`;
        });

        document.querySelectorAll('.read-story-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                const article = mockNewsData.find(a => a.id == id);
                if (article) {
                    document.getElementById('news-details-image').src = article.imageUrl;
                    document.getElementById('news-details-title').innerText = article.title;
                    document.getElementById('news-details-summary').innerText = article.summary;
                    document.getElementById('news-details-link').href = article.sourceUrl;
                    sliderEl.classList.add('details-active');
                }
            });
        });
    }

    document.getElementById('back-to-news-btn').addEventListener('click', () => {
        sliderEl.classList.remove('details-active');
    });

    //  backend part Firebase-by sam
    const firebaseConfig = { apiKey: "AIzaSyDt0_VrU7S96QTCRxxUF2U5MAg1XOJRQUU", authDomain: "dweldubai-website.firebaseapp.com", projectId: "dweldubai-website", storageBucket: "dweldubai-website.firebasestorage.app", messagingSenderId: "955916762022", appId: "1:955916762022:web:13726621ff4f80b856ed67", measurementId: "G-WF4E3DWKWY" };
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore(); 

    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button[type="submit"]');
        const originalText = btn.innerText;
        btn.disabled = true;
        btn.innerText = 'Sending...';

        const formData = {
            name: contactForm.name.value,
            email: contactForm.email.value,
            phone: contactForm.phone.value,
            country: contactForm.country.value,
            visaType: contactForm['visa-type-value'].value,
            message: contactForm.message.value,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        try {
            await db.collection("assessments").add(formData);
            step2.classList.add('hidden');
            document.getElementById('modal-step-success').classList.remove('hidden');
            contactForm.reset();
            setTimeout(closeModal, 3000);
        } catch (error) {
            console.error("Error:", error);
            alert("Error submitting form. Please check console.");
        } finally {
            btn.disabled = false;
            btn.innerText = originalText;
        }
    });
});
//backend ends


// Global scope for HTML onclick
window.triggerScan = function() {
    const laser = document.getElementById('laser-beam');
    const overlay = document.getElementById('scan-overlay');
    const success = document.getElementById('scan-success');
    success.style.opacity = '0';
    laser.style.opacity = '1';
    laser.style.transition = 'top 1.5s ease-in-out';
    laser.style.top = '100%'; 
    overlay.style.opacity = '1';
    setTimeout(() => {
        laser.style.opacity = '0';
        laser.style.top = '0'; 
        laser.style.transition = 'none';
        overlay.style.opacity = '0';
        success.style.opacity = '1';
    }, 1500);
};

window.triggerVerification = function() {
    document.getElementById('terminal-start').classList.add('hidden');
    const screen = document.getElementById('terminal-screen');
    screen.classList.remove('hidden');
    screen.innerHTML = '';
    const logs = ["> Connect_Interpol_DB...", "> Checking_Blacklist... [CLEAN]", "> Validating_Passport... [VALID]", "> Embassy_Sync... [OK]", "> STATUS: APPROVED"];
    let i = 0;
    function typeLine() {
        if (i < logs.length) {
            screen.innerHTML += `<div>${logs[i]}</div>`;
            i++;
            setTimeout(typeLine, 600);
        }
    }
    typeLine();
};

window.triggerApproval = function() {
    document.getElementById('approval-start').classList.add('hidden');
    const card = document.getElementById('visa-card');
    card.classList.remove('hidden');
    setTimeout(() => {
        card.classList.remove('scale-90', 'opacity-0');
        card.classList.add('scale-100', 'opacity-100');
    }, 50);
};