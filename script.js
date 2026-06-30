// Romantic Apology Website JavaScript

// 1. Music Playlist Configuration
const playlist = [
    { title: "عمرو دياب - تملي معاك 💖", src: "audio/tamally_maak.mp3" },
    { title: "عمرو دياب - ابتسامتك أنا اشتريها 😊", src: "audio/ebtesamtek.mp3" },
    { title: "عمرو دياب - ياما ليالي ✨", src: "audio/yama_layaly.mp3" }
];

let currentTrackIndex = 0;
const audio = document.getElementById('bg-audio');
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const playIcon = document.getElementById('play-icon');
const pauseIcon = document.getElementById('pause-icon');
const songTitle = document.getElementById('song-title');
const cdDisc = document.getElementById('cd-disc');
const progressBar = document.getElementById('progress-bar');
const progressContainer = document.getElementById('progress-container');
const currentTimeEl = document.getElementById('current-time');
const totalDurationEl = document.getElementById('total-duration');

// 2. Apology Letter Typewriter Effect Configuration
const apologyText = "روما حبيبتي..\n\nأنا آسف بجد لو كلامي وصلك بطريقة ضايقتك أو زعلتك مني. عمري ما كان قصدي أضايقك أو أوصلك إحساس مش حلو، وإنتِ عارفة غلاوتك عندي قد إيه.\n\nحقك عليا ومقدرش على زعلك يا روما 💖";
const apologyContainer = document.getElementById('apology-text');

// 3. Floating Hearts & Confetti Canvas System
const canvas = document.getElementById('heartsCanvas');
const ctx = canvas.getContext('2d');

let hearts = [];
let particles = []; // Confetti particles

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Heart {
    constructor(x, y, isBurst = false) {
        this.x = x || Math.random() * canvas.width;
        this.y = y || canvas.height + 20;
        this.size = Math.random() * 15 + 8;
        this.speedX = isBurst ? (Math.random() - 0.5) * 6 : (Math.random() - 0.5) * 1.5;
        this.speedY = isBurst ? -(Math.random() * 4 + 2) : -(Math.random() * 1.5 + 0.8);
        this.opacity = Math.random() * 0.6 + 0.2;
        this.fadeSpeed = isBurst ? Math.random() * 0.015 + 0.005 : 0;
        this.isBurst = isBurst;
        // Varying shades of red/pink
        const colors = ['#ff3366', '#ff66b2', '#ff85a2', '#ff0a54', '#ff477e'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;

        ctx.beginPath();
        const size = this.size;
        ctx.moveTo(this.x, this.y);
        // Draw heart shape using cubic bezier curves
        ctx.bezierCurveTo(this.x - size / 2, this.y - size / 2, this.x - size, this.y + size / 3, this.x, this.y + size);
        ctx.bezierCurveTo(this.x + size, this.y + size / 3, this.x + size / 2, this.y - size / 2, this.x, this.y);
        ctx.fill();
        ctx.restore();
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.isBurst) {
            this.opacity -= this.fadeSpeed;
        }

        // Return true if particle is dead
        if (this.isBurst && this.opacity <= 0) return true;
        if (!this.isBurst && this.y < -20) return true;
        return false;
    }
}

// Confetti Particle Class
class Confetti {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = -20;
        this.size = Math.random() * 8 + 6;
        this.speedX = (Math.random() - 0.5) * 5;
        this.speedY = Math.random() * 4 + 3;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 10;
        
        const colors = ['#ff3366', '#ff66b2', '#2ec4b6', '#ffb703', '#8338ec', '#3a86c8'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;
        return this.y > canvas.height + 20;
    }
}

// Spark a burst of hearts at specific coordinate
function createHeartBurst(x, y, count = 12) {
    for (let i = 0; i < count; i++) {
        hearts.push(new Heart(x, y, true));
    }
}

// Spawn basic floating background hearts
function spawnBackgroundHearts() {
    if (Math.random() < 0.05 && hearts.filter(h => !h.isBurst).length < 25) {
        hearts.push(new Heart());
    }
}

// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    spawnBackgroundHearts();

    // Update & draw hearts
    hearts = hearts.filter(heart => {
        const isDead = heart.update();
        if (!isDead) heart.draw();
        return !isDead;
    });

    // Update & draw confetti
    particles = particles.filter(p => {
        const isDead = p.update();
        if (!isDead) p.draw();
        return !isDead;
    });

    requestAnimationFrame(animate);
}
animate();

// Add heart burst on page click
document.addEventListener('click', (e) => {
    // Avoid bursts on interactive elements
    if (e.target.tagName !== 'BUTTON' && !e.target.closest('.music-player')) {
        createHeartBurst(e.clientX, e.clientY, 8);
    }
});


// 4. Music Player Logic
function loadTrack(index) {
    const track = playlist[index];
    audio.src = track.src;
    songTitle.textContent = track.title;
    audio.load();
    progressBar.style.width = '0%';
}

function playTrack() {
    audio.play().then(() => {
        playIcon.classList.add('hidden');
        pauseIcon.classList.remove('hidden');
        cdDisc.classList.add('playing');
    }).catch(err => {
        console.log("Audio play blocked by browser:", err);
    });
}

function pauseTrack() {
    audio.pause();
    playIcon.classList.remove('hidden');
    pauseIcon.classList.add('hidden');
    cdDisc.classList.remove('playing');
}

// Toggle Play/Pause
playBtn.addEventListener('click', () => {
    if (audio.paused) {
        playTrack();
    } else {
        pauseTrack();
    }
});

// Previous Song
prevBtn.addEventListener('click', () => {
    currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    loadTrack(currentTrackIndex);
    playTrack();
});

// Next Song
nextBtn.addEventListener('click', () => {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    loadTrack(currentTrackIndex);
    playTrack();
});

// Progress Bar Updates
audio.addEventListener('timeupdate', () => {
    const current = audio.currentTime;
    const duration = audio.duration;
    if (duration) {
        const percent = (current / duration) * 100;
        progressBar.style.width = `${percent}%`;
        
        // Time calculations
        const curMins = Math.floor(current / 60);
        const curSecs = Math.floor(current % 60).toString().padStart(2, '0');
        const durMins = Math.floor(duration / 60);
        const durSecs = Math.floor(duration % 60).toString().padStart(2, '0');

        currentTimeEl.textContent = `${curMins}:${curSecs}`;
        totalDurationEl.textContent = `${durMins}:${durSecs}`;
    }
});

// Seek Track
progressContainer.addEventListener('click', (e) => {
    const width = progressContainer.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    if (duration) {
        audio.currentTime = (clickX / width) * duration;
    }
});

// Track ends -> play next
audio.addEventListener('ended', () => {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    loadTrack(currentTrackIndex);
    playTrack();
});

// Skip on loading errors to guarantee continuous play
audio.addEventListener('error', (e) => {
    console.error("Audio error encountered, skipping to next:", e);
    setTimeout(() => {
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
        loadTrack(currentTrackIndex);
        playTrack();
    }, 1000);
});


// 5. Letter Typewriter Effect
let typeIndex = 0;
function typeLetter() {
    if (typeIndex < apologyText.length) {
        apologyContainer.textContent += apologyText.charAt(typeIndex);
        typeIndex++;
        // Speed control: faster for newlines/spaces, normal for characters
        const char = apologyText.charAt(typeIndex - 1);
        let speed = 60;
        if (char === '\n') speed = 350;
        else if (char === '.') speed = 450;
        
        setTimeout(typeLetter, speed);
    } else {
        apologyContainer.classList.add('typing-finished');
    }
}


// 6. Navigation: Transition to Main Card
const landingScreen = document.getElementById('landing-screen');
const mainScreen = document.getElementById('main-screen');
const openBtn = document.getElementById('open-btn');

openBtn.addEventListener('click', () => {
    // Initialise audio on click
    loadTrack(currentTrackIndex);
    playTrack();

    // Transition Screens
    landingScreen.classList.remove('active');
    setTimeout(() => {
        landingScreen.style.display = 'none';
        mainScreen.classList.add('active');
        // Start typing effect after screen transition
        setTimeout(typeLetter, 800);
    }, 800);
});


// 7. Interactive Apology Buttons
const forgiveBtn = document.getElementById('forgive-btn');
const angryBtn = document.getElementById('angry-btn');
const successOverlay = document.getElementById('success-overlay');
const closeSuccessBtn = document.getElementById('close-success-btn');

// Trigger Confetti Effect
function triggerConfetti() {
    for (let i = 0; i < 150; i++) {
        setTimeout(() => {
            particles.push(new Confetti());
        }, i * 15);
    }
}

// Forgive Button click
forgiveBtn.addEventListener('click', (e) => {
    // Trigger canvas bursts and confetti
    createHeartBurst(window.innerWidth / 2, window.innerHeight / 2 - 100, 30);
    triggerConfetti();

    // Show success banner/overlay
    successOverlay.classList.add('active');
});

// Close Success Overlay
closeSuccessBtn.addEventListener('click', () => {
    successOverlay.classList.remove('active');
});

// Runaway "Still Angry" Button Logic
// Moves the button randomly within the card boundaries when cursor hovers or fingers touch.
function escapeButton(e) {
    const card = document.querySelector('.main-card');
    
    // Move button to be a direct child of the card to allow free movement within card bounds
    if (angryBtn.parentElement !== card) {
        card.appendChild(angryBtn);
        angryBtn.style.position = 'absolute';
    }

    const cardRect = card.getBoundingClientRect();
    const btnRect = angryBtn.getBoundingClientRect();

    // Calculate maximum boundaries relative to the card container
    const padding = 20;
    const maxX = cardRect.width - btnRect.width - (padding * 2);
    const maxY = cardRect.height - btnRect.height - (padding * 2);

    // Calculate a random location inside the card
    const randomX = Math.random() * maxX + padding;
    const randomY = Math.random() * maxY + padding;

    // Apply absolute positions
    angryBtn.style.left = `${randomX}px`;
    angryBtn.style.top = `${randomY}px`;
    
    // Create tiny heart burst when she tries to click it!
    createHeartBurst(btnRect.left + btnRect.width / 2, btnRect.top + btnRect.height / 2, 4);
}

// Trigger escape on mouse enter (hover) or touch start (mobile tap)
angryBtn.addEventListener('mouseenter', escapeButton);
angryBtn.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Prevents tapping trigger click
    escapeButton(e);
});

// Trigger warning if click is somehow registered (e.g. keyboard navigation)
angryBtn.addEventListener('click', (e) => {
    e.preventDefault();
    escapeButton(e);
});
