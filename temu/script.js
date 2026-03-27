import { gsap } from 'gsap';

const buttons = document.querySelectorAll('.icon-button');
const eatBtn = document.getElementById('eat-btn');
const eatCountSpan = document.getElementById('eat-count');
const foodPanel = document.getElementById('food-panel');
const foodButtons = document.querySelectorAll('.food-button');
const talkingTom = document.getElementById('talking-tom');
const micBtn = document.getElementById('mic-btn');
const fartBtn = document.getElementById('fart-btn');
const pawBtn = document.getElementById('paw-btn');
const adBtn = document.getElementById('ad-btn');
const orientationBtn = document.getElementById('orientation-btn');
const gameContainer = document.getElementById('game-container');
const aspectBarTop = document.getElementById('aspect-bar-top');
const aspectBarBottom = document.getElementById('aspect-bar-bottom');
const adShowerOverlay = document.getElementById('ad-shower-overlay');
const birdBtn = document.getElementById('bird-btn');
const blocksBtn = document.getElementById('blocks-btn');
const bannerAdImg = document.getElementById('banner-ad-img');
const websimBtn = document.getElementById('websim-btn');
const websimBtn2 = document.getElementById('websim-btn-2');
const vomitStream = document.getElementById('vomit-stream');
const pianoBtn = document.getElementById('piano-btn');
const pianoKeyboard = document.getElementById('piano-keyboard');
const pianoKeys = document.querySelectorAll('.piano-key');
const shopBtn = document.getElementById('shop-btn');
const shopPanel = document.getElementById('shop-panel');
const buyFoodBtn = document.getElementById('buy-food-btn');
const shopCloseBtn = document.getElementById('shop-close-btn');
const shopCoinCount = document.getElementById('shop-coin-count');
const shopFoodCount = document.getElementById('shop-food-count');
const bsodOverlay = document.getElementById('bsod-overlay');
const micErrorOverlay = document.getElementById('mic-error-overlay');
const micErrorOkBtn = document.getElementById('mic-error-ok-btn');
const noFoodOverlay = document.getElementById('no-food-overlay');
const noFoodOkBtn = document.getElementById('no-food-ok-btn');
const noFoodShopBtn = document.getElementById('no-food-shop-btn');
const phoneBtn = document.getElementById('phone-btn');
const phoneInterface = document.getElementById('phone-interface');
const phoneCloseBtn = document.getElementById('phone-close-btn');
const phoneAppBtns = document.querySelectorAll('.phone-app-btn');
const appBackBtns = document.querySelectorAll('.app-back-btn');
const phoneApps = document.querySelectorAll('.phone-app');
const cameraCaptureBtn = document.querySelector('.camera-capture-btn');
const cameraFlipBtn = document.querySelector('.camera-flip-btn');
const cameraFilterBtns = document.querySelectorAll('.camera-filter-btn');
const cameraPreviewImg = document.querySelector('.camera-preview img');
const cameraSnapshotOverlay = document.getElementById('camera-snapshot-overlay');
const snapshotImage = document.getElementById('snapshot-image');
const snapshotSaveBtn = document.getElementById('snapshot-save-btn');
const snapshotDiscardBtn = document.getElementById('snapshot-discard-btn');
const musicTrackSelector = document.getElementById('music-track-selector');
const musicPlayBtn = document.querySelector('.music-play-btn');
const musicPrevBtn = document.querySelector('.music-prev-btn');
const musicNextBtn = document.querySelector('.music-next-btn');
const musicVolumeSlider = document.getElementById('music-volume-slider');
const musicAlbumArt = document.querySelector('.music-album-art img');
const musicTitle = document.querySelector('.music-title');
const musicArtist = document.querySelector('.music-artist');
const musicCurrentTime = document.querySelector('.music-current-time');
const musicTotalTime = document.querySelector('.music-total-time');
const weatherCitySelector = document.getElementById('weather-city-selector');
const weatherLocation = document.querySelector('.weather-location');
const weatherIcon = document.querySelector('.weather-icon');
const weatherTemp = document.querySelector('.weather-temp');
const weatherDesc = document.querySelector('.weather-desc');
const weatherRefreshBtn = document.getElementById('weather-refresh-btn');
const gameItems = document.querySelectorAll('.game-item');
const warningCancelBtn = document.getElementById('warning-cancel-btn');
const warningFixBtn = document.getElementById('warning-fix-btn');
const swapBtn = document.getElementById('swap-btn');
const danceBtn = document.getElementById('dance-btn');
const page1Buttons = document.querySelector('.page-1-buttons');
const page2Buttons = document.querySelector('.page-2-buttons');
const benBtn = document.getElementById('ben-btn');
const benDogSrc = '/talking_ben_dog.png';
let isBenPunchAnimating = false;

// Shop tabs elements
const foodShopTab = document.getElementById('food-shop-tab');
const skinsShopTab = document.getElementById('skins-shop-tab');
const foodShopPanel = document.getElementById('food-shop');
const skinsShopPanel = document.getElementById('skins-shop');

// Skin management
const skinButtons = document.querySelectorAll('.skin-action-btn');
const skinPurchasedOverlay = document.getElementById('skin-purchased-overlay');
const purchasedSkinPreview = document.getElementById('purchased-skin-preview');
const purchasedSkinName = document.getElementById('purchased-skin-name');
const skinPurchasedOkBtn = document.getElementById('skin-purchased-ok-btn');

// Sound Test Elements
const soundTestBtn = document.getElementById('sound-test-btn');
const soundTestOverlay = document.getElementById('sound-test-overlay');
const soundTestCloseBtn = document.getElementById('sound-test-close-btn');
const soundTestGrid = document.querySelector('.sound-test-grid');

// Leaderboard Elements
const leaderboardBtn = document.getElementById('leaderboard-btn');
const leaderboardOverlay = document.getElementById('leaderboard-overlay');
const leaderboardCloseBtn = document.getElementById('leaderboard-close-btn');
const coinsTab = document.getElementById('coins-tab');
const foodTab = document.getElementById('food-tab');
const coinsLeaderboard = document.getElementById('coins-leaderboard');
const foodLeaderboard = document.getElementById('food-leaderboard');
const coinsLeaderboardBody = document.getElementById('coins-leaderboard-body');
const foodLeaderboardBody = document.getElementById('food-leaderboard-body');
const updateStatsBtn = document.getElementById('update-stats-btn');
const yourCoinsCount = document.getElementById('your-coins-count');
const yourFoodCount = document.getElementById('your-food-count');

// Game state variables
let totalCoins = 0;
let totalFood = 10;
let foodEaten = 0;

// Skin management
let ownedSkins = ['tom']; // Default skin is always owned
let activeSkin = 'tom';   // Default active skin

// Image source mapping for different character states
const characterImages = {
    tom: {
        default: '/talking_tom.png',
        listening: '/talking_tom_listening.png',
        farting: '/talking_tom_farting.png',
        scratching: '/talking_tom_scratching.png',
        chili: '/talking_tom_chili.png',
        sandwich: '/talking_tom_sandwich.png',
        cake: '/talking_tom_cake.png',
        icecream: '/talking_tom_icecream.png',
        watermelon: '/talking_tom_watermelon.png',
        eating: '/talking_tom_eating_generic.png',
        sad: '/talking_tom_sad.png',
        punched: '/talking_tom_punched.png',
        failCatch: '/talking_tom_fail_catch.png',
        gummy: '/talking_tom_gummy.png',
        cookie: '/talking_tom_cookie_dough.png',
        blocks: '/talking_tom_blocks.png',
        vomit: '/talking_tom_vomit.png',
        piano: '/talking_tom_piano.png',
        pianoPlaying: '/talking_tom_piano_playing.png',
        phone: '/talking_tom_phone.png',
        dancing: '/talking_tom_dancing.png',
        mario: '/talking_tom_mario.png'
    },
    ben: {
        default: '/talking_ben_dog.png',
        listening: '/talking_ben_listening.png',
        farting: '/talking_ben_farting.png',
        scratching: '/talking_ben_scratching.png',
        chili: '/talking_ben_chili.png',
        sandwich: '/talking_ben_sandwich.png',
        cake: '/talking_ben_cake.png',
        icecream: '/talking_ben_icecream.png',
        watermelon: '/talking_ben_watermelon.png',
        eating: '/talking_ben_eating_generic.png',
        sad: '/talking_ben_sad.png',
        punched: '/talking_ben_punched.png',
        failCatch: '/talking_ben_fail_catch.png',
        gummy: '/talking_ben_gummy.png',
        cookie: '/talking_ben_cookie_dough.png',
        blocks: '/talking_ben_blocks.png',
        vomit: '/talking_ben_vomit.png',
        piano: '/talking_ben_piano.png',
        pianoPlaying: '/talking_ben_piano_playing.png',
        phone: '/talking_ben_phone.png',
        dancing: '/talking_ben_dancing.png',
        mario: '/talking_ben_mario.png'
    }
};

const originalTomSrc = '/talking_tom.png';
const listeningTomSrc = '/talking_tom_listening.png';
const fartingTomSrc = '/talking_tom_farting.png';
const scratchingTomSrc = '/talking_tom_scratching.png';
const chiliTomSrc = '/talking_tom_chili.png';
const sandwichTomSrc = '/talking_tom_sandwich.png';
const cakeTomSrc = '/talking_tom_cake.png';
const icecreamTomSrc = '/talking_tom_icecream.png';
const watermelonTomSrc = '/talking_tom_watermelon.png';
const eatingGenericTomSrc = '/talking_tom_eating_generic.png';
const sadTomSrc = '/talking_tom_sad.png';
const punchedTomSrc = '/talking_tom_punched.png';
const failCatchTomSrc = '/talking_tom_fail_catch.png';
const adIconSrc = '/ad_icon.png';
const gummyTomSrc = '/talking_tom_gummy.png';
const cookieDoughTomSrc = '/talking_tom_cookie_dough.png';
const blocksTomSrc = '/talking_tom_blocks.png';
const vomitTomSrc = '/talking_tom_vomit.png';
const pianoTomSrc = '/talking_tom_piano.png';
const pianoPlayingTomSrc = '/talking_tom_piano_playing.png';
const phoneTomSrc = '/talking_tom_phone.png';
const dancingTomSrc = '/talking_tom_dancing.png';

const bannerAds = [
    '/Screenshot 2025-05-05 111840 (1).png',
    '/Screenshot 2025-05-05 111840 (2).png',
    '/1s.png',
    '/badweek.png',
    '/fat.png'
];

const audioElements = {};

function safelyPlayAudio(audio) {
    if (!audio) return Promise.resolve();
    
    audio.currentTime = 0;
    
    return audio.play().catch(error => {
        console.warn(`Audio playback error: ${error.message}`);
    });
}

function safelyPauseAudio(audio) {
    if (!audio || audio.paused) return;
    try {
        audio.pause();
    } catch (error) {
        console.warn(`Audio pause error: ${error.message}`);
    }
}

function initAudio(name, src) {
    const audio = new Audio(src);
    audio.addEventListener('error', (e) => {
        console.warn(`Error loading audio ${name}: ${e.message}`);
    });
    return audio;
}

audioElements.popHigh = initAudio('popHigh', '/pop_high.mp3');
audioElements.popLow = initAudio('popLow', '/pop_low.mp3');
audioElements.eating = initAudio('eating', '/eating.mp3');
audioElements.fart = initAudio('vroom.mp3');
audioElements.scratch = initAudio('scratch', '/scratch.mp3');
audioElements.vroom = initAudio('vroom', '/vroom.mp3');
audioElements.tomScream = initAudio('tomScream', '/tom-scream.mp3');
audioElements.punch = initAudio('punch', '/punch.mp3');
audioElements.birdInteraction = initAudio('birdInteraction', '/bird_interaction.mp3');
audioElements.starPowerUp = initAudio('starPowerUp', '/star_power_up.mp3');
audioElements.blocks = initAudio('blocks', '/blocks.mp3');
audioElements.tomCrazy = initAudio('tomCrazy', '/tom-crazy (2).mp3');
audioElements.freezeGlitch = initAudio('freezeGlitch', '/tom-crazy.mp3');
audioElements.vomit = initAudio('vomit', '/vomit.mp3');
audioElements.pianoNote = initAudio('pianoNote', '/piano_note.mp3');
audioElements.phoneDialSound = initAudio('phoneDialSound', '/phone_dial.mp3');
audioElements.oldGameMusic = initAudio('oldGameMusic', '/game_music.mp3'); 
audioElements.gameMusic = initAudio('gameMusic', '/newmariomusic.wav'); 
audioElements.jumpSound = initAudio('jumpSound', '/jump_sound.mp3');
audioElements.coinSound = initAudio('coinSound', '/coin_collect.mp3');
audioElements.victorySound = initAudio('victorySound', '/victory_sound.mp3');
audioElements.danceMusic = initAudio('danceMusic', '/dance_music.mp3');
audioElements.benWoof = initAudio('benWoof', '/ben_woof.mp3');
audioElements.tomVsBen = initAudio('tomVsBen', '/tom_vs_ben.mp3');

let isListening = false;
let mediaRecorder;
let audioChunks = [];
let audioContext;
let pitchFactor = 1.5;

let isEatingAnimating = false;
let isInteractiveAnimating = false;
let isSpeakingAnimating = false;
let isBSODActive = false;
let isMicErrorActive = false;
let isOrientationAnimating = false;
let isAdAnimating = false;
let isPunchedAnimating = false;
let isGummyAnimating = false;
let isBlocksAnimating = false;
let isVomitAnimating = false;
let isPianoAnimating = false;
let isPianoKeyboardVisible = false;
let isCrazyMode = false;
let crazyModeTimelineRef = null;
let isCrashed = false;
let isPhoneActive = false;
let isPhoneAnimating = false;
let currentPhoneApp = null;
let isMusicPlaying = false;
let currentFilter = 'normal';
let isCameraFlipped = false;
let isRainingStars = false;
let isPage2Active = false;
let isDancing = false;

let coinGenerationInterval = null;
let lastCoinTime = Date.now();
const COIN_GENERATION_DELAY = 10000; // 10 seconds between generating coins

// Weather data for different cities
const weatherData = {
    'tom-city': {
        name: 'Talking Tom City',
        temp: '72°F',
        icon: '☀️',
        desc: 'Sunny',
        forecast: [
            { day: 'Mon', icon: '☀️', temp: '75°' },
            { day: 'Tue', icon: '🌤️', temp: '72°' },
            { day: 'Wed', icon: '🌧️', temp: '65°' },
            { day: 'Thu', icon: '⛅', temp: '70°' }
        ]
    },
    'angela-city': {
        name: 'Angela\'s Town',
        temp: '68°F',
        icon: '🌤️',
        desc: 'Partly Cloudy',
        forecast: [
            { day: 'Mon', icon: '🌤️', temp: '68°' },
            { day: 'Tue', icon: '☀️', temp: '70°' },
            { day: 'Wed', icon: '☀️', temp: '72°' },
            { day: 'Thu', icon: '⛅', temp: '69°' }
        ]
    },
    'hank-city': {
        name: 'Hank\'s Village',
        temp: '58°F',
        icon: '🌧️',
        desc: 'Rainy',
        forecast: [
            { day: 'Mon', icon: '🌧️', temp: '58°' },
            { day: 'Tue', icon: '🌧️', temp: '56°' },
            { day: 'Wed', icon: '⛅', temp: '60°' },
            { day: 'Thu', icon: '🌤️', temp: '65°' }
        ]
    },
    'ben-city': {
        name: 'Ben\'s Playground',
        temp: '80°F',
        icon: '☀️',
        desc: 'Hot & Sunny',
        forecast: [
            { day: 'Mon', icon: '☀️', temp: '80°' },
            { day: 'Tue', icon: '☀️', temp: '82°' },
            { day: 'Wed', icon: '⛈️', temp: '75°' },
            { day: 'Thu', icon: '🌤️', temp: '78°' }
        ]
    }
};

// Music tracks data
const musicTracks = {
    'theme': {
        title: 'Talking Tom Theme',
        artist: 'Talking Tom',
        albumArt: '/talking_tom_logo.png',
        audio: audioElements.tomCrazy,
        duration: '2:15'
    },
    'star': {
        title: 'Star Power',
        artist: 'Tom & Friends',
        albumArt: '/gummy_icon.png',
        audio: audioElements.starPowerUp,
        duration: '1:30'
    },
    'game': {
        title: 'Game Adventure',
        artist: 'Angela Orchestra',
        albumArt: '/mario_hat_icon.png',
        audio: audioElements.gameMusic, 
        duration: '3:45'
    }
};

// Available skins data
const skinsData = {
    'tom': {
        name: 'Tom (Default)',
        price: 0,
        preview: '/talking_tom.png',
        description: 'The classic Talking Tom character'
    },
    'ben': {
        name: 'Ben',
        price: 50,
        preview: '/talking_ben_dog.png',
        description: 'Play as Talking Ben the dog instead!'
    }
};

function stopAllAudio() {
    Object.values(audioElements).forEach(audio => {
        if (audio) safelyPauseAudio(audio);
    });
    
    // Optionally stop coin generation during critical errors
    if (isCrashed || isBSODActive) {
        clearInterval(coinGenerationInterval);
    }
}

function changeBannerAd() {
    const randomIndex = Math.floor(Math.random() * bannerAds.length);
    bannerAdImg.src = bannerAds[randomIndex];
    
    // Force the banner to be visible
    const bannerAd = document.getElementById('banner-ad');
    bannerAd.style.display = 'flex';
    bannerAd.style.opacity = '1';
    bannerAd.style.visibility = 'visible';
    
    // Apply critical styles directly
    bannerAd.style.position = 'absolute';
    bannerAd.style.top = '0';
    bannerAd.style.left = '0';
    bannerAd.style.right = '0';
    bannerAd.style.zIndex = '999';
    
    // Ensure the image is loaded
    bannerAdImg.onload = function() {
        // Make sure the banner is sized correctly after loading
        bannerAd.style.opacity = '1';
        
        // Force layout recalculation
        bannerAd.offsetHeight;
    };
}

function ensureBannerVisible() {
    // Get banner elements
    const bannerAd = document.getElementById('banner-ad');
    const bannerAdImg = document.getElementById('banner-ad-img');
    
    // More aggressive visibility enforcement
    bannerAd.style.display = 'flex';
    bannerAd.style.opacity = '1';
    bannerAd.style.visibility = 'visible';
    bannerAd.style.position = 'absolute';
    bannerAd.style.top = '0';
    bannerAd.style.left = '0';
    bannerAd.style.right = '0';
    bannerAd.style.zIndex = '999';
    
    // Check if banner image is properly loaded
    if (!bannerAdImg.complete || !bannerAdImg.naturalWidth) {
        console.log('Reloading banner image');
        // Force reload of the current banner
        const currentSrc = bannerAdImg.src;
        bannerAdImg.src = '';
        setTimeout(() => {
            bannerAdImg.src = currentSrc;
        }, 100);
    }
    
    // Force banner display in case it was hidden by CSS
    document.querySelectorAll('#banner-ad, #banner-ad-img').forEach(el => {
        el.setAttribute('style', el.getAttribute('style') + '; display: flex !important; opacity: 1 !important; visibility: visible !important;');
    });
}

// Initialize banner
changeBannerAd();

// More frequent checks to ensure banner visibility
setInterval(changeBannerAd, 15000);
setInterval(ensureBannerVisible, 2000); // Increased frequency

// Ensure banner is visible on window resize and orientation change
window.addEventListener('resize', ensureBannerVisible);
window.addEventListener('orientationchange', ensureBannerVisible);

// Add an initial timeout to make sure banner is shown after page load
setTimeout(ensureBannerVisible, 100);
setTimeout(ensureBannerVisible, 500);
setTimeout(ensureBannerVisible, 1000);

// Gets the active character image for a given state
function getCharacterImage(state) {
    // Use the current active skin to get the right image
    return characterImages[activeSkin][state] || characterImages[activeSkin].default;
}

function setTomImage(src) {
    // Map the source to the current skin
    let skinSrc = src;
    
    // If this is a known pose, get the appropriate skin version
    if (src === originalTomSrc) {
        skinSrc = getCharacterImage('default');
    } else if (src === listeningTomSrc) {
        skinSrc = getCharacterImage('listening');
    } else if (src === fartingTomSrc) {
        skinSrc = getCharacterImage('farting');
    } else if (src === scratchingTomSrc) {
        skinSrc = getCharacterImage('scratching');
    } else if (src === chiliTomSrc) {
        skinSrc = getCharacterImage('chili');
    } else if (src === sandwichTomSrc) {
        skinSrc = getCharacterImage('sandwich');
    } else if (src === cakeTomSrc) {
        skinSrc = getCharacterImage('cake');
    } else if (src === icecreamTomSrc) {
        skinSrc = getCharacterImage('icecream');
    } else if (src === watermelonTomSrc) {
        skinSrc = getCharacterImage('watermelon');
    } else if (src === eatingGenericTomSrc) {
        skinSrc = getCharacterImage('eating');
    } else if (src === sadTomSrc) {
        skinSrc = getCharacterImage('sad');
    } else if (src === punchedTomSrc) {
        skinSrc = getCharacterImage('punched');
    } else if (src === failCatchTomSrc) {
        skinSrc = getCharacterImage('failCatch');
    } else if (src === gummyTomSrc) {
        skinSrc = getCharacterImage('gummy');
    } else if (src === cookieDoughTomSrc) {
        skinSrc = getCharacterImage('cookie');
    } else if (src === blocksTomSrc) {
        skinSrc = getCharacterImage('blocks');
    } else if (src === vomitTomSrc) {
        skinSrc = getCharacterImage('vomit');
    } else if (src === pianoTomSrc) {
        skinSrc = getCharacterImage('piano');
    } else if (src === pianoPlayingTomSrc) {
        skinSrc = getCharacterImage('pianoPlaying');
    } else if (src === phoneTomSrc) {
        skinSrc = getCharacterImage('phone');
    } else if (src === dancingTomSrc) {
        skinSrc = getCharacterImage('dancing');
    }

    if (!isListening && !isBSODActive && !isMicErrorActive && !isOrientationAnimating && !isAdAnimating && 
        !isSpeakingAnimating && !isEatingAnimating && !isPunchedAnimating && !isInteractiveAnimating && 
        !isGummyAnimating && !isBlocksAnimating && !isVomitAnimating && !isPianoAnimating && !isPhoneAnimating) {
        talkingTom.src = skinSrc;
    } else if (isPunchedAnimating && src === punchedTomSrc) {
        talkingTom.src = skinSrc;
    } else if (isListening && src === listeningTomSrc) {
        talkingTom.src = skinSrc;
    } else if (isEatingAnimating && (src === eatingGenericTomSrc || src === chiliTomSrc || src === sandwichTomSrc || 
               src === cakeTomSrc || src === icecreamTomSrc || src === watermelonTomSrc || src === cookieDoughTomSrc)) {
        talkingTom.src = skinSrc;
    } else if (isInteractiveAnimating && (src === fartingTomSrc || src === scratchingTomSrc || src === failCatchTomSrc)) {
        talkingTom.src = skinSrc;
    } else if (isGummyAnimating && src === gummyTomSrc) {
        talkingTom.src = skinSrc;
    } else if (isBlocksAnimating && src === blocksTomSrc) {
         talkingTom.src = skinSrc;
    } else if (isVomitAnimating && src === vomitTomSrc) {
        talkingTom.src = skinSrc;
    } else if (isPianoAnimating && (src === pianoTomSrc || src === pianoPlayingTomSrc)) {
        talkingTom.src = skinSrc;
    } else if (isPhoneAnimating && src === phoneTomSrc) {
        talkingTom.src = skinSrc;
    }
}

function resetTomImage() {
    if (!isListening && !isBSODActive && !isMicErrorActive && !isOrientationAnimating && !isAdAnimating && 
        !isSpeakingAnimating && !isEatingAnimating && !isPunchedAnimating && !isInteractiveAnimating && 
        !isGummyAnimating && !isBlocksAnimating && !isVomitAnimating && !isPianoAnimating && !isPhoneAnimating) {
        // Set to the default image for the current skin
        talkingTom.src = getCharacterImage('default');
        gsap.set(talkingTom, { clearProps: "scale, x, y, rotation, filter, tint, transformOrigin" });
    }
}

function isTomBusy() {
    return isEatingAnimating || isInteractiveAnimating || isListening || isSpeakingAnimating || 
           isBSODActive || isMicErrorActive || isOrientationAnimating || isAdAnimating || 
           isPunchedAnimating || isGummyAnimating || isBlocksAnimating || isVomitAnimating ||
           isCrazyMode || isCrashed || isPianoAnimating || isPhoneAnimating || isDancing || isBenPunchAnimating;
}

const allButtons = document.querySelectorAll('.icon-button');

allButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        if (isTomBusy()) return;

        const buttonId = event.currentTarget.id;
        console.log(`${buttonId} clicked!`);
        if (buttonId !== 'eat-btn' && !event.currentTarget.classList.contains('food-button')) {
            foodPanel.classList.add('hidden');
        }
    });
});

eatBtn.addEventListener('click', (event) => {
    if (isTomBusy()) {
        console.log('Tom is busy, cannot open food panel.');
        gsap.to(eatBtn, {
            scale: 1.1,
            yoyo: true,
            repeat: 1,
            duration: 0.1,
            ease: "power1.easeInOut"
        });
        return;
    }
    console.log('Eat button clicked!');
    if (event.currentTarget.id === 'eat-btn' && !isTomBusy()) {
        foodPanel.classList.toggle('hidden');
    }
});

talkingTom.addEventListener('click', () => {
    if (isTomBusy()) return;
    console.log('Talking Tom clicked!');

    isPunchedAnimating = true;
    safelyPlayAudio(audioElements.punch);

    gsap.killTweensOf(talkingTom);
    gsap.set(talkingTom, { transformOrigin: "center center" });
    setTomImage(punchedTomSrc);

    gsap.timeline({
        onComplete: () => {
            gsap.delayedCall(0.3, () => {
                isPunchedAnimating = false;
                resetTomImage();
            });
        }
    })
    .to(talkingTom, {
        x: "+=10",
        yoyo: true,
        repeat: 5,
        duration: 0.05,
        ease: "power1.easeInOut"
    }, 0)
    .to(talkingTom, {
        scaleX: 1.05,
        scaleY: 0.95,
        duration: 0.1,
        ease: "power1.easeOut"
    }, 0)
    .to(talkingTom, {
        scaleX: 1,
        scaleY: 1,
        duration: 0.3,
        ease: "power1.easeIn"
    }, 0.1);

});

eatCountSpan.addEventListener('click', () => {
    if (isTomBusy()) return;
    console.log('Eat count clicked!');
});

foodButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        if (isTomBusy()) return;

        const foodType = event.currentTarget.dataset.food;

        console.log(`${foodType} food item clicked!`);
        
        if (foodType === 'chili' && event.shiftKey) {
            foodPanel.classList.add('hidden');
            enterCrazyMode();
            return;
        }

        foodPanel.classList.add('hidden');

        if (totalFood > 0 && !isTomBusy()) {
            totalFood--;
            updateFoodDisplay();

            console.log(`Tom ate ${foodType}. Food count is now ${totalFood}.`);

            gsap.killTweensOf(talkingTom);
            gsap.set(talkingTom, { scale: 1, x: 0, y: 0, rotation: 0, filter: "none", transformOrigin: "bottom center" });

            const eatTimeline = gsap.timeline({
                onComplete: () => {
                    if (!isGummyAnimating && !isVomitAnimating) {
                         gsap.delayedCall(0.3, () => {
                            isEatingAnimating = false;
                            isInteractiveAnimating = false;
                            resetTomImage();
                        });
                    }
                }
            });

            switch (foodType) {
                case 'broccoli':
                    isVomitAnimating = true;
                    isEatingAnimating = true;
                    isInteractiveAnimating = true;
                    safelyPlayAudio(audioElements.vomit);
                    
                    eatTimeline
                        .to(talkingTom, { 
                            scaleY: 0.95, 
                            duration: 0.2, 
                            ease: "power1.easeOut" 
                        }, 0)
                        .call(() => setTomImage(vomitTomSrc), null, 0.3)
                        .to(talkingTom, {
                            rotation: -5,
                            y: "-=10",
                            duration: 0.2,
                            ease: "power1.easeOut"
                        }, 0.4)
                        .call(() => createVomitEffect(), null, 0.5)
                        .to(talkingTom, {
                            rotation: -8,
                            y: "-=5",
                            duration: 0.3,
                            ease: "power1.easeInOut",
                            repeat: 2,
                            yoyo: true
                        }, 0.7)
                        .to(talkingTom, {
                            rotation: 0,
                            y: 0,
                            duration: 0.5,
                            ease: "power1.easeInOut",
                            onComplete: () => {
                                gsap.delayedCall(0.5, () => {
                                    isVomitAnimating = false;
                                    isEatingAnimating = false;
                                    isInteractiveAnimating = false;
                                    resetTomImage();
                                });
                            }
                        }, 1.5);
                    break;
                    
                case 'chili':
                    isEatingAnimating = true;
                    isInteractiveAnimating = true;
                    safelyPlayAudio(audioElements.tomScream);

                    eatTimeline
                        .to(talkingTom, { scaleY: 0.95, duration: 0.2, ease: "power1.easeOut" }, 0)
                        .to(talkingTom, { scaleY: 1.05, duration: 0.2, ease: "power1.easeOut" }, "+=0.1")
                        .to(talkingTom, { scaleY: 0.98, duration: 0.2, ease: "power1.easeIn" })
                        .call(() => setTomImage(chiliTomSrc), null, "+=0.2")
                        .to(talkingTom, { scaleY: 1.0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
                    break;
                case 'bubbles':
                     isEatingAnimating = true;
                     isInteractiveAnimating = true;

                    safelyPlayAudio(audioElements.eating);
                    eatTimeline.call(() => setTomImage(eatingGenericTomSrc), null, 0);
                    for (let i = 0; i < 10; i++) {
                        const bubble = document.createElement('div');
                        bubble.classList.add('bubble');
                        const tomRect = talkingTom.getBoundingClientRect();
                        const gameRect = gameContainer.getBoundingClientRect();
                        const tomBottomPx = tomRect.bottom - gameRect.top;
                        const tomCenterXPx = tomRect.left + tomRect.width / 2 - gameRect.left;

                        const tomBottomPercentage = (tomBottomPx / gameRect.height) * 100;
                        const tomCenterXPercentage = (tomCenterXPx / gameRect.width) * 100;


                        const startX = tomCenterXPercentage + (Math.random() * 5 - 2.5);
                        const startY = 100 - tomBottomPercentage + 5 + (Math.random() * 5 - 2.5);

                        bubble.style.bottom = `${startY}%`;
                        bubble.style.left = `${startX}%`;
                        bubble.style.width = `${10 + Math.random() * 15}px`;
                        bubble.style.height = bubble.style.width;

                        gameContainer.appendChild(bubble);

                        gsap.to(bubble, {
                            y: -gameContainer.offsetHeight * (0.4 + Math.random() * 0.4),
                            x: (Math.random() - 0.5) * 50,
                            opacity: 0,
                            duration: 2 + Math.random() * 1,
                            ease: "power1.easeOut",
                            delay: i * 0.05,
                            onComplete: () => bubble.remove()
                        });
                    }
                    eatTimeline.to(talkingTom, { scale: 1.02, yoyo: true, repeat: 1, duration: 0.2 }, 0);
                    break;
                case 'sandwich':
                    isEatingAnimating = true;
                    isInteractiveAnimating = true;
                    safelyPlayAudio(audioElements.eating);
                    eatTimeline
                        .to(talkingTom, { scaleY: 0.95, duration: 0.2, ease: "power1.easeOut" }, 0)
                        .to(talkingTom, { scaleY: 1.05, duration: 0.2, ease: "power1.easeOut" }, "+=0.1")
                        .to(talkingTom, { scaleY: 0.98, duration: 0.2, ease: "power1.easeIn" })
                        .call(() => setTomImage(sandwichTomSrc), null, "+=0.2")
                        .to(talkingTom, { scaleY: 1.0, duration: 0.5, ease: "back.out(1.7)" });
                    break;
                case 'milk':
                    isEatingAnimating = true;
                    isInteractiveAnimating = true;
                    safelyPlayAudio(audioElements.eating);
                    eatTimeline
                        .to(talkingTom, { scaleY: 0.95, duration: 0.2, ease: "power1.easeOut" }, 0)
                        .to(talkingTom, { y: "-=10", duration: 0.3, ease: "power1.easeOut" }, "+=0.1")
                        .to(talkingTom, { y: 0, duration: 0.3, ease: "power1.easeIn" });
                    break;
                case 'cake':
                    isEatingAnimating = true;
                    isInteractiveAnimating = true;
                    safelyPlayAudio(audioElements.eating);
                    eatTimeline
                        .to(talkingTom, { scaleY: 0.95, duration: 0.2, ease: "power1.easeOut" }, 0)
                        .to(talkingTom, { y: "-=20", rotation: 5, duration: 0.2, ease: "power2.easeOut" }, "+=0.1")
                        .to(talkingTom, { y: "-=10", rotation: -5, duration: 0.2, ease: "power2.easeOut" })
                        .call(() => setTomImage(cakeTomSrc), null, "+=0.1")
                        .to(talkingTom, { y: 0, rotation: 0, duration: 0.5, ease: "power2.easeInOut" });
                    break;
                case 'popsicle':
                    isEatingAnimating = true;
                    isInteractiveAnimating = true;
                    safelyPlayAudio(audioElements.eating);
                    eatTimeline
                        .to(talkingTom, { scale: 0.95, duration: 0.2, ease: "power1.easeOut" }, 0)
                        .call(() => setTomImage(icecreamTomSrc), null, 0.3)

                        .to(talkingTom, {
                            rotation: 10,
                            y: "-=20",
                            duration: 0.3,
                            ease: "power2.easeOut"
                        }, "+=0.2")
                        .to(talkingTom, {
                            rotation: -10,
                            y: "-=20",
                            duration: 0.3,
                            ease: "power2.easeOut"
                        })
                        .to(talkingTom, {
                            rotation: 0,
                            y: 0,
                            scale: 1,
                            duration: 0.5,
                            ease: "power2.easeInOut"
                        });
                    break;
                case 'watermelon':
                    isEatingAnimating = true;
                    isInteractiveAnimating = true;
                    safelyPlayAudio(audioElements.eating);
                    eatTimeline
                        .to(talkingTom, { scaleY: 0.95, duration: 0.3, ease: "power1.easeOut" }, 0)
                        .to(talkingTom, { scaleY: 1.1, duration: 0.4, ease: "power1.easeOut" }, "+=0.1")
                        .call(() => setTomImage(watermelonTomSrc), null, "+=0.4")
                        .to(talkingTom, { scaleY: 1, duration: 0.6, ease: "elastic.out(1, 0.3)" });
                    break;
                case 'gummy':
                    isGummyAnimating = true;
                    isInteractiveAnimating = true;

                    safelyPlayAudio(audioElements.starPowerUp);

                    gsap.killTweensOf(talkingTom);
                    gsap.set(talkingTom, { transformOrigin: "bottom center" });

                    setTomImage(gummyTomSrc);

                    gsap.timeline({
                        repeat: 3,
                        yoyo: true,
                        onComplete: () => {
                            gsap.delayedCall(0.5, () => {
                                isGummyAnimating = false;
                                isInteractiveAnimating = false;
                                resetTomImage();
                            });
                        }
                    })
                    .to(talkingTom, {
                        x: "+=50",
                        rotation: 10,
                        filter: "hue-rotate(360deg) saturate(2) brightness(1.5)",
                        duration: 0.5,
                        ease: "power1.easeInOut"
                    }, 0)
                    .to(talkingTom, {
                        x: "-=100",
                        rotation: -10,
                        filter: "hue-rotate(720deg) saturate(2) brightness(1.5)",
                        duration: 0.5,
                        ease: "power1.easeInOut"
                    }, 0.5)
                    .to(talkingTom, {
                        x: "+=50",
                        rotation: 0,
                        filter: "hue-rotate(1080deg) saturate(2) brightness(1.5)",
                        duration: 0.5,
                        ease: "power1.easeInOut"
                    }, 1);

                    createStarsEffect();
                    trackFoodEaten();
                    return;

                case 'cookie':
                    isEatingAnimating = true;
                    isInteractiveAnimating = true;
                    safelyPlayAudio(audioElements.eating);
                    eatTimeline
                        .to(talkingTom, { scaleY: 0.95, duration: 0.2, ease: "power1.easeOut" }, 0)
                        .to(talkingTom, { scaleY: 1.05, duration: 0.2, ease: "power1.easeOut" }, "+=0.1")
                        .to(talkingTom, { scaleY: 0.98, duration: 0.2, ease: "power1.easeIn" })
                        .call(() => setTomImage(cookieDoughTomSrc), null, "+=0.2")
                        .to(talkingTom, { scaleY: 1.0, duration: 0.5, ease: "back.out(1.7)" });
                    break;
                default:
                    isEatingAnimating = true;
                    isInteractiveAnimating = true;
                    safelyPlayAudio(audioElements.eating);
                    eatTimeline.call(() => setTomImage(eatingGenericTomSrc), null, 0);
                    eatTimeline
                        .to(talkingTom, { scaleY: 0.95, duration: 0.2, ease: "power1.easeOut" }, 0)
                        .to(talkingTom, { scaleY: 1.02, duration: 0.2, ease: "power1.easeOut" }, "+=0.1")
                        .to(talkingTom, { scaleY: 0.98, duration: 0.2, ease: "power1.easeIn" })
                        .to(talkingTom, { scaleY: 1.0, duration: 0.5, ease: "back.out(1.7)" });
                    break;
            }

            // Track that food was eaten
            trackFoodEaten();

            // Check if food is zero - show no food dialog instead of BSOD
            if (totalFood === 0) {
                eatTimeline.call(() => {
                    showNoFoodDialog();
                }, null, "+=0.5");
            }

        } else if (totalFood === 0) {
            console.log("Food count is 0. Cannot eat.");
            showNoFoodDialog();
            gsap.to(eatBtn, {
                scale: 1.1,
                yoyo: true,
                repeat: 1,
                duration: 0.1,
                ease: "power1.easeInOut"
            });
        }
    });
});

// No Food Dialog
function showNoFoodDialog() {
    if (noFoodOverlay.classList.contains('hidden')) {
        noFoodOverlay.classList.remove('hidden');
        setTomImage(sadTomSrc);
    }
}

noFoodOkBtn.addEventListener('click', () => {
    noFoodOverlay.classList.add('hidden');
    resetTomImage();
});

noFoodShopBtn.addEventListener('click', () => {
    noFoodOverlay.classList.add('hidden');
    resetTomImage();
    shopPanel.classList.remove('hidden');
    
    // Show the food tab
    foodShopTab.click();
});

// Create stars effect (used by gummy bear)
function createStarsEffect() {
    if (isRainingStars) return;
    isRainingStars = true;

    for (let i = 0; i < 20; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        star.style.position = 'absolute';
        star.style.width = `${5 + Math.random() * 10}px`;
        star.style.height = star.style.width;
        star.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 70%)`;
        star.style.borderRadius = '50%';
        star.style.zIndex = 1;

        const startXPercentage = Math.random() * 100;
        const startYPercentage = -5;

        star.style.top = `${startYPercentage}%`;
        star.style.left = `${startXPercentage}%`;
        star.style.opacity = 0;

        gameContainer.appendChild(star);

        gsap.timeline({
            delay: Math.random() * 1.5,
            onComplete: () => {
                star.remove();
                if (i === 19) isRainingStars = false;
            }
        })
        .to(star, {
            opacity: 1,
            duration: 0.1
        })
        .to(star, {
             y: gameContainer.offsetHeight * (1.0 + Math.random() * 0.2),
             x: (Math.random() - 0.5) * 150,
             rotation: Math.random() * 360,
             scale: 0.5 + Math.random(),
             opacity: 0,
             duration: 1.5 + Math.random() * 1,
             ease: "power1.easeIn"
        }, "<");
    }
}

benBtn.addEventListener('click', () => {
    if (isTomBusy() && !isBenPunchAnimating) return;
    console.log('Ben button clicked!');
    
    if (activeSkin === 'ben') {
        // Special case: If player is using Ben skin, Tom attacks Ben
        performTomAttackBen();
    } else {
        // Play Ben's woof sound
        safelyPlayAudio(audioElements.benWoof);
        
        // Wait for woof to finish before punching
        setTimeout(() => {
            performBenPunch();
        }, 400);
    }
});

function performBenPunch() {
    if (isTomBusy() && !isBenPunchAnimating) return;
    
    isBenPunchAnimating = true;
    
    // Save current character to restore after animation
    const currentCharacter = talkingTom.src;
    
    // Use the punched image for the current skin
    setTomImage(punchedTomSrc);
    
    // Play punch sound
    safelyPlayAudio(audioElements.punch);
    
    // Create Ben character if needed
    let benCharacter = document.querySelector('#ben-character');
    
    if (!benCharacter) {
        benCharacter = document.createElement('img');
        benCharacter.id = 'ben-character';
        benCharacter.src = benDogSrc;
        benCharacter.style.position = 'absolute';
        benCharacter.style.height = '80%';
        benCharacter.style.bottom = '0';
        benCharacter.style.left = '-50%';  // Start off-screen
        benCharacter.style.zIndex = '1';
        benCharacter.style.transformOrigin = 'bottom center';
        gameContainer.appendChild(benCharacter);
    } else {
        benCharacter.style.display = 'block';
        benCharacter.style.left = '-50%';
    }
    
    // Animate Ben coming in, punching, and leaving
    gsap.timeline({
        onComplete: () => {
            // Hide Ben
            benCharacter.style.display = 'none';
            
            // Reset Tom
            isBenPunchAnimating = false;
            resetTomImage();
        }
    })
    .to(benCharacter, {
        left: '40%',
        duration: 0.5,
        ease: "power2.out"
    })
    .to(benCharacter, {
        rotation: 15,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: "power1.inOut",
        onComplete: () => {
            // Shake Tom
            gsap.to(talkingTom, {
                x: "+=10",
                duration: 0.05,
                yoyo: true,
                repeat: 3,
                ease: "power1.inOut"
            });
        }
    })
    .to(benCharacter, {
        left: '-50%',
        duration: 0.5,
        ease: "power2.in",
        delay: 0.3
    });
}

birdBtn.addEventListener('click', () => {
    if (isTomBusy()) return;
    console.log('Bird button clicked!');

    isInteractiveAnimating = true;
    safelyPlayAudio(audioElements.birdInteraction);

    gsap.killTweensOf(talkingTom);
    gsap.set(talkingTom, { transformOrigin: "bottom center" });
    setTomImage(failCatchTomSrc);

    gsap.timeline({
        onComplete: () => {
            gsap.delayedCall(0.5, () => {
                isInteractiveAnimating = false;
                resetTomImage();
            });
        }
    })
    .to(talkingTom, {
        y: "-=30",
        rotation: -10,
        duration: 0.3,
        ease: "power2.easeOut"
    }, 0)
    .to(talkingTom, {
        y: 0,
        rotation: 0,
        duration: 0.5,
        ease: "bounce.out"
    }, 0.3);
});

fartBtn.addEventListener('click', () => {
    if (isTomBusy()) return;
    console.log('Fart button clicked!');

    isInteractiveAnimating = true;
    safelyPlayAudio(audioElements.fart);

    gsap.killTweensOf(talkingTom);
    gsap.set(talkingTom, { transformOrigin: "bottom center" });
    setTomImage(fartingTomSrc);

    gsap.timeline({
        onComplete: () => {
            gsap.delayedCall(0.3, () => {
                isInteractiveAnimating = false;
                resetTomImage();
            });
        }
    })
    .to(talkingTom, { scaleX: 1.1, scaleY: 0.9, duration: 0.2, ease: "power1.easeOut" })
    .to(talkingTom, { scaleX: 1, scaleY: 1, duration: 0.5, ease: "elastic.out(1, 0.3)" });
});

pawBtn.addEventListener('click', () => {
    if (isTomBusy()) return;
    console.log('Paw button clicked!');

    isInteractiveAnimating = true;
    safelyPlayAudio(audioElements.scratch);

    gsap.killTweensOf(talkingTom);
    gsap.set(talkingTom, { transformOrigin: "bottom center" });
    setTomImage(scratchingTomSrc);

    gsap.timeline({
        onComplete: () => {
            gsap.delayedCall(0.3, () => {
                isInteractiveAnimating = false;
                resetTomImage();
            });
        }
    })
    .to(talkingTom, { rotation: -5, y: "-=10", duration: 0.1, ease: "power1.easeOut" })
    .to(talkingTom, { rotation: 5, y: "-=10", duration: 0.1, ease: "power1.easeOut" })
    .to(talkingTom, { rotation: -5, y: "-=10", duration: 0.1, ease: "power1.easeOut" })
    .to(talkingTom, { rotation: 0, y: 0, duration: 0.3, ease: "power1.easeIn" });
});

blocksBtn.addEventListener('click', () => {
    if (isTomBusy()) return;
    console.log('Blocks button clicked!');

    isBlocksAnimating = true;
    isInteractiveAnimating = true;

    safelyPlayAudio(audioElements.blocks);

    gsap.killTweensOf(talkingTom);
    gsap.set(talkingTom, { transformOrigin: "bottom center", y: "10%" });

    setTomImage(blocksTomSrc);

    gsap.timeline({
        onComplete: () => {
            gsap.delayedCall(0.5, () => {
                isBlocksAnimating = false;
                isInteractiveAnimating = false;
                gsap.set(talkingTom, { y: "0%" });
                resetTomImage();
            });
        }
    })
    .to(talkingTom, {
         scale: 1.02,
         duration: 0.5,
         ease: "power1.easeInOut",
         repeat: 2,
         yoyo: true
    }, 0);
});

adBtn.addEventListener('click', async () => {
    if (isTomBusy()) return;
    console.log('Ad button clicked!');

    isAdAnimating = true;
    safelyPlayAudio(audioElements.vroom);

    adShowerOverlay.classList.remove('hidden');
    gsap.set(adShowerOverlay, { opacity: 0.8 });

    adShowerOverlay.innerHTML = '';

    const adImage = document.createElement('img');
    adImage.src = adIconSrc;
    adImage.style.position = 'absolute';
    const baseIconSize = 50;
    const aspectRatio = 9 / 16;
    adImage.style.width = `${baseIconSize}px`;
    adImage.style.height = `${baseIconSize / aspectRatio}px`;
    adImage.style.objectFit = 'contain';
    adImage.style.pointerEvents = 'none';

    const containerRect = adShowerOverlay.getBoundingClientRect();
    const maxIcons = 100;
    const duration = 3;

    gsap.killTweensOf(talkingTom);

    gsap.timeline({
        onComplete: () => {
            adShowerOverlay.innerHTML = '';
            adShowerOverlay.classList.add('hidden');
            isAdAnimating = false;
        }
    })
    .to(adShowerOverlay, {
        opacity: 0.5,
        duration: duration,
        ease: "power1.easeInOut"
    }, 0)
    .call(() => {
        for (let i = 0; i < maxIcons; i++) {
            const icon = adImage.cloneNode();
            adShowerOverlay.appendChild(icon);

            const startX = Math.random() * (containerRect.width - baseIconSize);
            const startY = Math.random() * (containerRect.height - baseIconSize / aspectRatio);
            const endX = Math.random() * (containerRect.width - baseIconSize);
            const endY = Math.random() * (containerRect.height - baseIconSize / aspectRatio);
            const scale = 0.5 + Math.random() * 0.5;

            gsap.set(icon, { x: startX, y: startY, scale: 0.5 });

            gsap.to(icon, {
                x: endX,
                y: endY,
                rotation: Math.random() * 360,
                scale: scale,
                opacity: 0.5 + Math.random() * 0.5,
                duration: duration,
                ease: "power1.easeOut",
                delay: Math.random() * (duration * 0.8)
            });
        }
    }, null, 0);
});

orientationBtn.addEventListener('click', () => {
    if (isTomBusy()) return;
    console.log('Orientation button clicked!');

    isOrientationAnimating = true;
    safelyPlayAudio(audioElements.vroom);

    const isLandscape = gameContainer.classList.contains('landscape');
    const targetRatio = isLandscape ? '9 / 16' : '16 / 9';
    const targetHeight = isLandscape ? '100%' : 'auto';
    const targetWidth = isLandscape ? 'auto' : '100%';

    gsap.killTweensOf(talkingTom);
    gsap.set(aspectBarTop, { height: 0, top: 0, opacity: 1 });
    gsap.set(aspectBarBottom, { height: 0, bottom: 0, opacity: 1 });

    gsap.timeline({
        onComplete: () => {
            gameContainer.classList.toggle('landscape');
            gsap.set([aspectBarTop, aspectBarBottom], { height: 0, opacity: 0 });
            gsap.delayedCall(0.5, () => {
                isOrientationAnimating = false;
            });
        }
    })
    .to(aspectBarTop, { height: '50vh', duration: 1, ease: "power1.easeInOut" }, 0)
    .to(aspectBarBottom, { height: '50vh', duration: 1, ease: "power1.easeInOut" }, 0)
    .call(() => {
        gameContainer.style.aspectRatio = targetRatio;
        gameContainer.style.height = targetHeight;
        gameContainer.style.width = targetWidth;
    }, null, 0.5)
    .to(aspectBarTop, { height: 0, opacity: 0, duration: 1, ease: "power1.easeInOut" }, 0.5)
    .to(aspectBarBottom, { height: 0, opacity: 0, duration: 1, ease: "power1.easeInOut" }, 0.5);
});

function showBSOD() {
    if (isBSODActive) return;
    console.log("Showing BSOD");
    isBSODActive = true;

    micErrorOverlay.classList.add('hidden');
    adShowerOverlay.classList.add('hidden');
    noFoodOverlay.classList.add('hidden');

    bsodOverlay.classList.remove('hidden');
    bsodOverlay.style.pointerEvents = 'auto';

    stopAllAudio();

    gsap.killTweensOf(talkingTom);
}

function showMicError() {
    if (isTomBusy()) return;
    console.log("Showing Mic Error");
    isMicErrorActive = true;

    bsodOverlay.classList.add('hidden');
    adShowerOverlay.classList.add('hidden');
    noFoodOverlay.classList.add('hidden');

    micErrorOverlay.classList.remove('hidden');
    micErrorOverlay.style.pointerEvents = 'auto';

    stopAllAudio();

    gsap.killTweensOf(talkingTom);

    setTomImage(sadTomSrc);
}

micErrorOkBtn.addEventListener('click', () => {
    console.log('Mic Error OK clicked!');
    micErrorOverlay.classList.add('hidden');
    micErrorOverlay.style.pointerEvents = 'none';
    isMicErrorActive = false;
    resetTomImage();
});

micBtn.addEventListener('click', async (event) => {
    if (isCrashed) return;
    
    if (event.shiftKey) {
        console.log(' CRITICAL ERROR: Shift+mic clicked! ');
        triggerCrashFreeze();
        return;
    }
    
    if (isTomBusy()) return;
    console.log('Mic button clicked!');

    if (!isListening) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            console.log("Microphone access granted.");

            isListening = true;
            gsap.killTweensOf(talkingTom);
            setTomImage(listeningTomSrc);

            mediaRecorder = new MediaRecorder(stream);
            audioChunks = [];

            mediaRecorder.ondataavailable = (event) => {
                audioChunks.push(event.data);
            };

            mediaRecorder.onstop = async () => {
                console.log("Recording stopped. Processing audio...");
                isListening = false;

                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                audioChunks = [];

                if (audioBlob.size > 1000) {
                    isSpeakingAnimating = true;
                    try {
                        audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
                        const arrayBuffer = await audioBlob.arrayBuffer();
                        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

                        const source = audioContext.createBufferSource();
                        source.buffer = audioBuffer;

                        const compressor = audioContext.createDynamicsCompressor();
                        compressor.threshold.setValueAtTime(-50, audioContext.currentTime);
                        compressor.knee.setValueAtTime(40, audioContext.currentTime);
                        compressor.ratio.setValueAtTime(12, audioContext.currentTime);
                        compressor.attack.setValueAtTime(0, audioContext.currentTime);
                        compressor.release.setValueAtTime(0.25, audioContext.currentTime);

                        source.playbackRate.value = pitchFactor;

                        source.connect(compressor);
                        compressor.connect(audioContext.destination);

                        source.start();

                        source.onended = () => {
                            console.log("Playback finished.");
                            isSpeakingAnimating = false;
                            resetTomImage();
                        };

                        gsap.killTweensOf(talkingTom);
                        gsap.timeline({ repeat: -1, yoyo: true, duration: 0.1 })
                            .to(talkingTom, { scaleY: 0.98, ease: "power1.easeInOut" });
                    } catch (error) {
                        console.error('Error processing audio:', error);
                        isSpeakingAnimating = false;
                        resetTomImage();
                    }
                } else {
                    console.log("No audio data recorded.");
                    resetTomImage();
                }

                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            console.log("Recording started.");

            gsap.delayedCall(3, () => {
                if (mediaRecorder && mediaRecorder.state !== 'inactive') {
                    mediaRecorder.stop();
                    console.log("Recording stopped by timer.");
                }
            });
        } catch (err) {
            console.error('Error accessing microphone:', err);
            showMicError();
        }
    } else {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
            console.log("Recording manually stopped.");
        }
    }
});

websimBtn.addEventListener('click', () => {
    console.log('WebSim button clicked!');
    window.open('https://websim.ai/@autumn', '_blank');
});

websimBtn2.addEventListener('click', () => {
    console.log('WebSim button (page 2) clicked!');
    window.open('https://websim.ai/@autumn', '_blank');
});

document.querySelectorAll('img').forEach(img => {
    img.addEventListener('dragstart', (e) => e.preventDefault());
});

function triggerCrashFreeze() {
    isCrashed = true;
    
    if (crazyModeTimelineRef) {
        if (crazyModeTimelineRef.tomInterval) {
            clearInterval(crazyModeTimelineRef.tomInterval);
        }
        if (crazyModeTimelineRef.watermelonInterval) {
            clearInterval(crazyModeTimelineRef.watermelonInterval);
        }
        if (crazyModeTimelineRef.animations) {
            crazyModeTimelineRef.animations.forEach(timeline => {
                if (timeline) timeline.kill();
            });
        }
    }
    
    stopAllAudio();
    
    try {
        const glitchContext = new (window.AudioContext || window.webkitAudioContext)();
        
        const crashAudio = audioElements.freezeGlitch;
        crashAudio.loop = true;
        
        crashAudio.playbackRate = 0.8;
        
        crashAudio.currentTime = 0.3;
        
        crashAudio.play().catch(e => console.error("Failed to play crash audio:", e));
        
        gsap.killTweensOf(talkingTom);
        gsap.set(talkingTom, {
            scaleX: 2.5, 
            scaleY: 0.2,
            rotation: 37,
            x: 50,
            filter: "hue-rotate(90deg) contrast(5) brightness(1.5)"
        });
        
        for (let i = 0; i < 12; i++) {
            const glitchLine = document.createElement('div');
            glitchLine.classList.add('glitch-line');
            glitchLine.style.position = 'absolute';
            glitchLine.style.width = '100%';
            glitchLine.style.height = `${3 + Math.random() * 8}px`;
            glitchLine.style.top = `${Math.random() * 100}%`;
            glitchLine.style.backgroundColor = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.8)`;
            glitchLine.style.zIndex = '9995';
            glitchLine.style.transform = `skewX(${Math.random() * 10 - 5}deg)`;
            gameContainer.appendChild(glitchLine);
        }
        
        const freezeOverlay = document.createElement('div');
        freezeOverlay.classList.add('freeze-overlay');
        freezeOverlay.style.position = 'fixed';
        freezeOverlay.style.top = '0';
        freezeOverlay.style.left = '0';
        freezeOverlay.style.width = '100%';
        freezeOverlay.style.height = '100%';
        freezeOverlay.style.zIndex = '9997';
        freezeOverlay.style.pointerEvents = 'all';
        document.body.appendChild(freezeOverlay);
        
        const crashText = document.createElement('div');
        crashText.classList.add('crash-text');
        crashText.style.position = 'fixed';
        crashText.style.top = '70%';
        crashText.style.left = '50%';
        crashText.style.transform = 'translate(-50%, -50%)';
        crashText.style.color = 'white';
        crashText.style.fontFamily = 'monospace';
        crashText.style.fontSize = '24px';
        crashText.style.textShadow = '2px 2px 4px rgba(0,0,0,0.8)';
        crashText.style.zIndex = '9998';
        crashText.textContent = 'CRITICAL ERROR: SYSTEM CRASH';
        document.body.appendChild(crashText);
        
        const refreshText = document.createElement('div');
        refreshText.classList.add('refresh-text');
        refreshText.style.position = 'fixed';
        refreshText.style.top = '80%';
        refreshText.style.left = '50%';
        refreshText.style.transform = 'translate(-50%, -50%)';
        refreshText.style.color = 'yellow';
        refreshText.style.fontFamily = 'monospace';
        refreshText.style.fontSize = '16px';
        refreshText.style.textShadow = '2px 2px 4px rgba(0,0,0,0.8)';
        refreshText.style.zIndex = '9998';
        refreshText.textContent = 'Please refresh the page to restart the application';
        document.body.appendChild(refreshText);
        
    } catch (error) {
        console.error("Error during crash effect:", error);
    }
}

function enterCrazyMode() {
    if (isCrazyMode) return; // Already in crazy mode
    
    console.log(" CRAZY MODE ACTIVATED ");
    isCrazyMode = true;
    
    stopAllAudio();
    
    const crazyAudio = new Audio('/tom-crazy (2).mp3');
    crazyAudio.loop = true;
    crazyAudio.play().catch(err => console.warn("Failed to play crazy mode sound:", err));
    
    const allImages = document.querySelectorAll('img');
    const allButtons = document.querySelectorAll('button');
    const foodPanelItems = document.querySelectorAll('.food-button');
    const bannerAd = document.getElementById('banner-ad-img');
    
    const crazyElements = [...allImages, ...allButtons, ...foodPanelItems];
    const animations = [];
    
    foodPanel.classList.remove('hidden');
    
    const originalSources = new Map();
    
    allImages.forEach(img => {
        originalSources.set(img, img.src);
        img.src = watermelonTomSrc;
    });
    
    document.querySelectorAll('button img').forEach(img => {
        originalSources.set(img, img.src);
        img.src = watermelonTomSrc;
    });
    
    const originalSetTomImage = setTomImage;
    window.setTomImage = function() {
        talkingTom.src = watermelonTomSrc;
        return;
    };
    
    function getRandomProps() {
        return {
            x: (Math.random() - 0.5) * window.innerWidth * 1.5, 
            y: (Math.random() - 0.5) * window.innerHeight * 1.5,
            rotation: Math.random() * 1080 - 540, 
            scaleX: 0.1 + Math.random() * 4, 
            scaleY: 0.1 + Math.random() * 4,
            filter: `hue-rotate(${Math.random() * 360}deg) saturate(${1 + Math.random() * 8}) contrast(${0.5 + Math.random() * 3})`,
            duration: 0.05 + Math.random() * 0.1, 
            ease: "none"
        };
    }
    
    crazyElements.forEach(element => {
        if (element === talkingTom) return;
        
        gsap.set(element, { transformOrigin: "center center" });
        
        const anim = gsap.timeline({ repeat: -1 });
        
        for (let i = 0; i < 20; i++) {
            anim.to(element, getRandomProps(), i * 0.05);
            if (element.tagName.toLowerCase() === 'img') {
                anim.set(element, { attr: { src: watermelonTomSrc } }, i * 0.05);
            }
        }
        
        animations.push(anim);
    });
    
    const forceWatermelonImages = () => {
        document.querySelectorAll('img').forEach(img => {
            if (img.src !== watermelonTomSrc) {
                img.src = watermelonTomSrc;
            }
        });
    };
    
    const watermelonInterval = setInterval(forceWatermelonImages, 50);
    
    const tomFrequency = 0.1; 
    
    const tomTicker = () => {
        const props = getRandomProps();
        props.scaleX = 0.2 + Math.random() * 5;
        props.scaleY = 0.2 + Math.random() * 5;
        
        gsap.to(talkingTom, props);
        
        talkingTom.src = watermelonTomSrc;
    };
    
    const tomInterval = setInterval(tomTicker, tomFrequency * 1000);
    
    crazyModeTimelineRef = {
        animations: animations,
        tomInterval: tomInterval,
        watermelonInterval: watermelonInterval,
        originalSetTomImage: originalSetTomImage,
        originalSources: originalSources
    };
    
    document.addEventListener('click', exitCrazyMode);
    
    const flashEffect = gsap.timeline({ repeat: -1 });
    for (let i = 0; i < 10; i++) {
        const color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        flashEffect.to(gameContainer, {
            backgroundColor: color,
            duration: 0.1,
            ease: "none"
        }, i * 0.1);
    }
    animations.push(flashEffect);
    
    for (let i = 0; i < 20; i++) {
        const flyingEl = document.createElement('div');
        flyingEl.classList.add('crazy-element');
        flyingEl.style.position = 'absolute';
        flyingEl.style.width = '50px';
        flyingEl.style.height = '50px';
        flyingEl.style.background = `url(${watermelonTomSrc}) center/contain no-repeat`;
        flyingEl.style.zIndex = '5';
        gameContainer.appendChild(flyingEl);
        
        gsap.set(flyingEl, { 
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight
        });
        
        const flyingAnim = gsap.timeline({ repeat: -1 });
        for (let j = 0; j < 10; j++) {
            flyingAnim.to(flyingEl, getRandomProps(), j * 0.1);
        }
        animations.push(flyingAnim);
    }
}

function exitCrazyMode() {
    if (!isCrazyMode) return;
    
    console.log("Exiting crazy mode...");
    isCrazyMode = false;
    
    document.removeEventListener('click', exitCrazyMode);
    
    stopAllAudio();
    
    if (crazyModeTimelineRef) {
        if (crazyModeTimelineRef.animations) {
            crazyModeTimelineRef.animations.forEach(timeline => {
                if (timeline) timeline.kill();
            });
        }
        
        if (crazyModeTimelineRef.tomInterval) {
            clearInterval(crazyModeTimelineRef.tomInterval);
        }
        
        if (crazyModeTimelineRef.watermelonInterval) {
            clearInterval(crazyModeTimelineRef.watermelonInterval);
        }
        
        if (crazyModeTimelineRef.originalSetTomImage) {
            window.setTomImage = crazyModeTimelineRef.originalSetTomImage;
        }
        
        if (crazyModeTimelineRef.originalSources) {
            crazyModeTimelineRef.originalSources.forEach((originalSrc, img) => {
                img.src = originalSrc;
            });
        }
    }
    
    gsap.globalTimeline.clear();
    
    document.querySelectorAll('.crazy-element').forEach(el => el.remove());
    
    document.querySelectorAll('img, button').forEach(el => {
        gsap.set(el, { 
            clearProps: "all"
        });
    });
    
    gsap.set(gameContainer, { clearProps: "backgroundColor" });
    
    gsap.set(talkingTom, { 
        clearProps: "all",
        transformOrigin: "bottom center" 
    });
    
    foodPanel.classList.add('hidden');
    
    resetTomImage();
}

// New function for Tom attacking Ben when in Ben skin
function performTomAttackBen() {
    if (isTomBusy() && !isBenPunchAnimating) return;
    
    isBenPunchAnimating = true;
    
    // Play new Tom vs Ben sound
    if (!audioElements.tomVsBen) {
        audioElements.tomVsBen = initAudio('tomVsBen', '/tom_vs_ben.mp3');
    }
    safelyPlayAudio(audioElements.tomVsBen);
    
    // Create Tom character if needed
    let tomAttacker = document.querySelector('#tom-attacker');
    
    if (!tomAttacker) {
        tomAttacker = document.createElement('img');
        tomAttacker.id = 'tom-attacker';
        tomAttacker.src = '/talking_tom.png';
        tomAttacker.style.position = 'absolute';
        tomAttacker.style.height = '80%';
        tomAttacker.style.bottom = '0';
        tomAttacker.style.right = '-50%';  // Start off-screen on the right
        tomAttacker.style.zIndex = '1';
        tomAttacker.style.transformOrigin = 'bottom center';
        gameContainer.appendChild(tomAttacker);
    } else {
        tomAttacker.style.display = 'block';
        tomAttacker.style.right = '-50%';
    }
    
    // Temporarily change Ben button icon to Tom attack icon
    const originalBenBtnImg = benBtn.querySelector('img').src;
    benBtn.querySelector('img').src = '/tom_attack_icon.png';
    
    // Animate Tom coming in, attacking, and leaving
    gsap.timeline({
        onComplete: () => {
            // Hide Tom attacker
            tomAttacker.style.display = 'none';
            
            // Reset Ben button icon
            benBtn.querySelector('img').src = originalBenBtnImg;
            
            // Reset Ben character
            isBenPunchAnimating = false;
            resetTomImage();
        }
    })
    .to(tomAttacker, {
        right: '40%',
        duration: 0.5,
        ease: "power2.out"
    })
    .to(tomAttacker, {
        rotation: -15,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: "power1.inOut",
        onComplete: () => {
            // Shake Ben (the character)
            gsap.to(talkingTom, {
                x: "+=10",
                duration: 0.05,
                yoyo: true,
                repeat: 3,
                ease: "power1.inOut"
            });
            // Use punched Ben texture
            setTomImage(punchedTomSrc);
        }
    })
    .to(tomAttacker, {
        right: '-50%',
        duration: 0.5,
        ease: "power2.in",
        delay: 0.3
    });
}

// Piano Button Event Listener
pianoBtn.addEventListener('click', () => {
    if (isTomBusy() && !isPianoAnimating) return;
    console.log('Piano button clicked!');
    
    // Dismiss other panels
    foodPanel.classList.add('hidden');
    shopPanel.classList.add('hidden');
    
    // Toggle piano keyboard
    isPianoKeyboardVisible = !isPianoKeyboardVisible;
    pianoKeyboard.classList.toggle('hidden', !isPianoKeyboardVisible);
    
    if (isPianoKeyboardVisible) {
        isPianoAnimating = true;
        
        // Set Tom to piano position
        gsap.killTweensOf(talkingTom);
        gsap.set(talkingTom, { transformOrigin: "bottom center" });
        setTomImage(pianoTomSrc);
        
        // Animate Tom sitting at piano
        gsap.timeline()
        .to(talkingTom, {
            y: "+=10",
            scale: 0.95,
            duration: 0.3,
            ease: "power1.easeOut"
        });
        
    } else {
        // Reset Tom when piano is closed
        isPianoAnimating = false;
        gsap.to(talkingTom, {
            y: 0,
            scale: 1,
            duration: 0.3,
            ease: "power1.easeOut",
            onComplete: resetTomImage
        });
    }
});

// Piano Key Event Listeners
pianoKeys.forEach(key => {
    key.addEventListener('mousedown', function() {
        if (!isPianoKeyboardVisible || isCrashed) return;
        
        // Highlight the pressed key
        this.classList.add('active');
        
        // Get the note
        const note = this.dataset.note;
        console.log(`Piano key ${note} pressed`);
        
        // Play the note sound with slightly randomized pitch for variety
        const noteAudio = audioElements.pianoNote.cloneNode();
        noteAudio.playbackRate = 0.5 + (Array.from(pianoKeys).indexOf(this) / 10);
        safelyPlayAudio(noteAudio);
        
        // Animate Tom pressing the key
        gsap.killTweensOf(talkingTom);
        setTomImage(pianoPlayingTomSrc);
        
        gsap.timeline()
        .to(talkingTom, {
            scaleY: 0.97,
            rotation: Math.random() < 0.5 ? -2 : 2,
            duration: 0.1,
            ease: "power1.easeOut"
        })
        .to(talkingTom, {
            scaleY: 1,
            rotation: 0,
            duration: 0.2,
            ease: "power1.easeOut",
            onComplete: () => {
                if (isPianoKeyboardVisible) {
                    setTomImage(pianoTomSrc);
                }
            }
        });
    });
    
    key.addEventListener('mouseup', function() {
        this.classList.remove('active');
    });
    
    key.addEventListener('mouseleave', function() {
        this.classList.remove('active');
    });
});

// Close piano keyboard when clicking outside
document.addEventListener('click', (event) => {
    if (isPianoKeyboardVisible && 
        !pianoKeyboard.contains(event.target) && 
        event.target !== pianoBtn && 
        !pianoBtn.contains(event.target)) {
        
        isPianoKeyboardVisible = false;
        pianoKeyboard.classList.add('hidden');
        
        // Reset Tom
        isPianoAnimating = false;
        gsap.to(talkingTom, {
            y: 0,
            scale: 1,
            duration: 0.3,
            ease: "power1.easeOut",
            onComplete: resetTomImage
        });
    }
});

function createVomitEffect() {
    vomitStream.classList.remove('hidden');
    vomitStream.innerHTML = '';

    // Calculate position based on Tom's mouth
    const tomRect = talkingTom.getBoundingClientRect();
    const gameRect = gameContainer.getBoundingClientRect();
    
    // Position vomit stream to come from Tom's mouth
    vomitStream.style.bottom = '45%'; // Adjust as needed
    vomitStream.style.left = '50%';
    vomitStream.style.transform = 'translateX(-50%)';
    
    // Create vomit stream
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('vomit-particle');
        
        // Random size for each particle
        const size = 5 + Math.random() * 15;
        particle.style.width = `${size}px`;
        particle.style.height = particle.style.width;
        
        // Varying shades of green
        const greenHue = 80 + Math.random() * 40; // Range from yellowish-green to darker green
        const saturation = 70 + Math.random() * 30;
        const lightness = 40 + Math.random() * 30;
        particle.style.backgroundColor = `hsl(${greenHue}, ${saturation}%, ${lightness}%)`;
        
        // Initial position
        particle.style.left = `${50 + (Math.random() * 40 - 20)}%`;
        particle.style.top = `${Math.random() * 10}%`;
        
        vomitStream.appendChild(particle);
        
        // Animate each particle
        gsap.to(particle, {
            y: 300 + Math.random() * 200,
            x: (Math.random() - 0.5) * 100,
            opacity: 0,
            scale: Math.random() * 0.5 + 0.5,
            duration: 1 + Math.random() * 1,
            ease: "power2.out",
            delay: Math.random() * 0.3,
            onComplete: () => particle.remove()
        });
    }
    
    // Create larger "chunks"
    for (let i = 0; i < 15; i++) {
        const chunk = document.createElement('div');
        chunk.classList.add('vomit-particle');
        
        // Larger size for chunks
        const size = 15 + Math.random() * 20;
        chunk.style.width = `${size}px`;
        chunk.style.height = `${size}px`;
        
        // Darker green with some brownish tints for chunks
        const greenHue = 70 + Math.random() * 30;
        const saturation = 60 + Math.random() * 20;
        const lightness = 30 + Math.random() * 20;
        chunk.style.backgroundColor = `hsl(${greenHue}, ${saturation}%, ${lightness}%)`;
        
        // Slightly irregular shape for chunks
        chunk.style.borderRadius = `${30 + Math.random() * 40}% ${30 + Math.random() * 40}% ${30 + Math.random() * 40}% ${30 + Math.random() * 40}%`;
        
        // Initial position
        chunk.style.left = `${50 + (Math.random() * 30 - 15)}%`;
        chunk.style.top = `${Math.random() * 5}%`;
        
        vomitStream.appendChild(chunk);
        
        // Heavier animation for chunks
        gsap.to(chunk, {
            y: 200 + Math.random() * 300,
            x: (Math.random() - 0.5) * 80,
            rotation: Math.random() * 360,
            opacity: 0,
            scale: Math.random() * 0.7 + 0.3,
            duration: 0.8 + Math.random() * 0.7,
            ease: "power3.out",
            delay: Math.random() * 0.2,
            onComplete: () => chunk.remove()
        });
    }
    
    // Final cleanup
    gsap.delayedCall(2, () => {
        vomitStream.classList.add('hidden');
        vomitStream.innerHTML = '';
    });
}

// Initialize food and coin displays
function updateFoodDisplay() {
    eatCountSpan.textContent = totalFood;
    shopFoodCount.textContent = totalFood;
}

function updateCoinDisplay() {
    shopCoinCount.textContent = totalCoins;
    // Update coin progress bar
    const progressPercent = Math.min(100, ((Date.now() - lastCoinTime) / COIN_GENERATION_DELAY) * 100);
    document.getElementById('coin-progress-bar').style.width = `${progressPercent}%`;
    
    // Update skin buttons based on available coins
    updateSkinButtons();
}

// Shop button event listener
shopBtn.addEventListener('click', () => {
    if (isTomBusy()) return;
    console.log('Shop button clicked!');
    
    // Dismiss other panels
    foodPanel.classList.add('hidden');
    pianoKeyboard.classList.add('hidden');
    isPianoKeyboardVisible = false;
    
    // Update shop display
    updateCoinDisplay();
    updateFoodDisplay();
    updateSkinButtons();
    
    // Show shop panel
    shopPanel.classList.remove('hidden');
});

// Shop tab functionality
foodShopTab.addEventListener('click', () => {
    foodShopTab.classList.add('active');
    skinsShopTab.classList.remove('active');
    foodShopPanel.classList.add('active');
    skinsShopPanel.classList.remove('active');
});

skinsShopTab.addEventListener('click', () => {
    skinsShopTab.classList.add('active');
    foodShopTab.classList.remove('active');
    skinsShopPanel.classList.add('active');
    foodShopPanel.classList.remove('active');
    
    // Ensure skin buttons are up to date
    updateSkinButtons();
});

// Buy food button event listener
buyFoodBtn.addEventListener('click', () => {
    console.log('Buy food button clicked!');
    
    // Check if player has enough coins
    if (totalCoins >= 1) {
        // Convert 1 coin to 2 food
        totalCoins -= 1;
        totalFood += 2;
        
        // Update displays
        updateCoinDisplay();
        updateFoodDisplay();
        
        // Update stats
        updateUserStats();
        
        // Play coin sound
        safelyPlayAudio(audioElements.coinSound);
        
        // Animation feedback
        gsap.to(buyFoodBtn, {
            scale: 1.2,
            duration: 0.2,
            yoyo: true,
            repeat: 1,
            ease: "power1.inOut"
        });
    } else {
        // Not enough coins
        gsap.to(buyFoodBtn, {
            x: "+=5",
            yoyo: true,
            repeat: 3,
            duration: 0.1
        });
    }
});

// Update skin buttons based on ownership and current selection
function updateSkinButtons() {
    // Get all skin items
    const skinItems = document.querySelectorAll('.skin-item');
    
    skinItems.forEach(item => {
        const skinId = item.dataset.skin;
        const button = item.querySelector('.skin-action-btn');
        const skinData = skinsData[skinId];
        
        if (ownedSkins.includes(skinId)) {
            // Already owned - show select/selected button
            if (activeSkin === skinId) {
                button.textContent = 'SELECTED';
                button.classList.add('selected');
                button.disabled = true;
            } else {
                button.textContent = 'SELECT';
                button.classList.remove('selected');
                button.disabled = false;
                
                // Add select handler
                button.onclick = () => {
                    selectSkin(skinId);
                };
            }
        } else {
            // Not owned - show buy button with price
            button.textContent = `BUY (${skinData.price})`;
            button.classList.remove('selected');
            button.disabled = totalCoins < skinData.price;
            
            // Add buy handler
            button.onclick = () => {
                buySkin(skinId);
            };
        }
    });
}

// Function to buy a skin
function buySkin(skinId) {
    const skinData = skinsData[skinId];
    
    if (totalCoins >= skinData.price) {
        // Deduct coins
        totalCoins -= skinData.price;
        
        // Add to owned skins
        ownedSkins.push(skinId);
        
        // Update user stats
        updateUserStats();
        
        // Update displays
        updateCoinDisplay();
        
        // Show purchase confirmation
        showSkinPurchasedDialog(skinId);
        
        // Update buttons
        updateSkinButtons();
    }
}

// Function to select a skin
function selectSkin(skinId) {
    if (ownedSkins.includes(skinId)) {
        activeSkin = skinId;
        
        // Update the character's appearance
        resetTomImage();
        
        // Update UI
        updateSkinButtons();
        
        // Apply to the phone screen Tom too
        const phoneTomDisplay = document.querySelector('.phone-tom-display img');
        if (phoneTomDisplay) {
            phoneTomDisplay.src = getCharacterImage('default');
        }
        
        // Play a sound effect
        safelyPlayAudio(audioElements.popHigh);
    }
}

// Show skin purchased dialog
function showSkinPurchasedDialog(skinId) {
    const skinData = skinsData[skinId];
    
    // Set dialog content
    purchasedSkinPreview.src = skinData.preview;
    purchasedSkinName.textContent = skinData.name;
    
    // Show overlay
    skinPurchasedOverlay.classList.remove('hidden');
    
    // Play success sound
    safelyPlayAudio(audioElements.coinSound);
}

// Skin purchased OK button handler
skinPurchasedOkBtn.addEventListener('click', () => {
    skinPurchasedOverlay.classList.add('hidden');
    
    // Auto-select the newly purchased skin
    selectSkin(ownedSkins[ownedSkins.length - 1]);
});

// Shop close button
shopCloseBtn.addEventListener('click', () => {
    shopPanel.classList.add('hidden');
});

// New variables for Mario game
const marioBtn = document.getElementById('mario-btn');
const marioGameContainer = document.getElementById('mario-game-container');
const marioGameCanvas = document.getElementById('mario-game-canvas');
const marioLeftBtn = document.getElementById('mario-left-btn');
const marioRightBtn = document.getElementById('mario-right-btn');
const marioJumpBtn = document.getElementById('mario-jump-btn');
const marioExitBtn = document.getElementById('mario-exit-btn');
const coinCountSpan = document.getElementById('coin-count');
const gameVictoryOverlay = document.getElementById('game-victory-overlay');
const gameOverOverlay = document.getElementById('game-over-overlay');
const victoryOkBtn = document.getElementById('victory-ok-btn');
const gameOverRetryBtn = document.getElementById('game-over-retry-btn');
const gameOverExitBtn = document.getElementById('game-over-exit-btn');
const victoryCoinSpan = document.getElementById('victory-coins');

let isPlayingMarioGame = false;
let gameMusic = null;
let jumpSound = null;
let coinSound = null;
let victorySound = null;

// Load game audio
audioElements.gameMusic = initAudio('gameMusic', '/newmariomusic.wav');
audioElements.jumpSound = initAudio('jumpSound', '/jump_sound.mp3');
audioElements.coinSound = initAudio('coinSound', '/coin_collect.mp3');
audioElements.victorySound = initAudio('victorySound', '/victory_sound.mp3');

// Mario Game Module
const MarioGame = (function() {
    // Game canvas and context
    let canvas;
    let ctx;
    
    // Game objects and state
    let player = {
        x: 50,
        y: 0,
        width: 50,
        height: 80,
        velocityX: 0,
        velocityY: 0,
        isJumping: false,
        speed: 5
    };
    
    let angela = {
        x: 0,
        y: 0,
        width: 50,
        height: 80
    };
    
    let platforms = [];
    let enemies = [];
    let batmanShells = []; 
    let coins = [];
    let score = 0;
    let currentLevel = 1;
    
    // Game assets
    let playerImage = new Image();
    let angelaImage = new Image();
    let platformImage = new Image();
    let groundTexture = new Image(); 
    let enemyImage = new Image();
    let batmanCatImage = new Image(); 
    let batmanShellImage = new Image(); 
    let coinImage = new Image();
    
    // Game controls
    let keys = {
        left: false,
        right: false,
        jump: false
    };
    
    // Game state
    let gameActive = false;
    let gravity = 0.5;
    let levelWidth = 0;
    let cameraX = 0;
    
    // Initialize game
    function init() {
        canvas = marioGameCanvas;
        ctx = canvas.getContext('2d');
        
        // Set canvas size to match container
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        // Load images
        playerImage.src = activeSkin === 'tom' ? '/talking_tom_mario.png' : '/talking_ben_dog.png';
        angelaImage.src = '/angela_cat.png';
        platformImage.src = '/platform_block.png';
        groundTexture.src = '/ground_texture.png'; 
        enemyImage.src = '/goomba_enemy.png';
        batmanCatImage.src = '/batman_cat_enemy.png'; 
        batmanShellImage.src = '/batman_mask_shell.png'; 
        coinImage.src = '/coin_item.png';
        
        // Initialize player position
        player.y = canvas.height - player.height - 50;
        
        // Create the level
        createLevel(currentLevel);
        
        // Setup controls
        setupControls();
        
        // Start game loop
        gameActive = true;
        requestAnimationFrame(gameLoop);
        
        // Start music
        if (audioElements.gameMusic) {
            audioElements.gameMusic.loop = true;
            safelyPlayAudio(audioElements.gameMusic);
        }
    }
    
    function resizeCanvas() {
        canvas.width = marioGameContainer.clientWidth;
        canvas.height = marioGameContainer.clientHeight;
    }
    
    // Define fixed levels
    function createLevel(levelNumber) {
        // Reset game objects
        platforms = [];
        enemies = [];
        batmanShells = [];
        coins = [];
        score = 0;
        coinCountSpan.textContent = '0';
        
        // Set level width based on level design
        levelWidth = canvas.width * 3;
        
        const platformHeight = 40;
        const floorY = canvas.height - platformHeight;
        
        // Level designs
        switch(levelNumber) {
            case 1:
                // Create the ground - series of connected platforms
                const groundSegments = 15; 
                const groundWidth = levelWidth / groundSegments;
                
                for (let i = 0; i < groundSegments; i++) {
                    // Add gaps occasionally
                    if (i !== 0 && i !== groundSegments-1 && i % 4 === 3) {
                        // Skip this segment to create a gap
                        continue;
                    }
                    
                    platforms.push({
                        x: i * groundWidth,
                        y: floorY,
                        width: groundWidth,
                        height: platformHeight,
                        isGround: true
                    });
                }
                
                // Elevated platforms at different heights
                platforms.push({
                    x: 300,
                    y: floorY - 120,
                    width: 200,
                    height: platformHeight
                });
                
                platforms.push({
                    x: 650,
                    y: floorY - 180,
                    width: 250,
                    height: platformHeight
                });
                
                platforms.push({
                    x: 1000,
                    y: floorY - 100,
                    width: 350,
                    height: platformHeight
                });
                
                // Platform where Angela is waiting
                const angelaPlatform = {
                    x: 1800,
                    y: floorY - 150,
                    width: 300,
                    height: platformHeight
                };
                platforms.push(angelaPlatform);
                
                // Place coins on platforms and in the air
                for (let i = 0; i < 5; i++) {
                    coins.push({
                        x: 350 + i * 40,
                        y: floorY - 180, 
                        width: 30,
                        height: 30,
                        collected: false
                    });
                }
                
                for (let i = 0; i < 6; i++) {
                    coins.push({
                        x: 700 + i * 40,
                        y: floorY - 240, 
                        width: 30,
                        height: 30,
                        collected: false
                    });
                }
                
                // Add coins in a pattern between platforms
                for (let i = 0; i < 8; i++) {
                    coins.push({
                        x: 1400 + i * 50,
                        y: floorY - 120 - Math.sin(i * 0.5) * 40, 
                        width: 30,
                        height: 30,
                        collected: false
                    });
                }
                
                // Add Batman Cat enemies
                // First enemy on the ground
                enemies.push({
                    x: 400,
                    y: floorY - 50, 
                    width: 50,
                    height: 50,
                    direction: -1,
                    speed: 2,
                    platformX1: 300,
                    platformX2: 550,
                    type: 'batmanCat',
                    state: 'normal' 
                });
                
                // Second enemy on the first elevated platform
                enemies.push({
                    x: 750,
                    y: floorY - 180 - 50, 
                    width: 50,
                    height: 50,
                    direction: -1,
                    speed: 2,
                    platformX1: 650,
                    platformX2: 900,
                    type: 'batmanCat',
                    state: 'normal'
                });
                
                // Regular Goomba-style enemies
                enemies.push({
                    x: 1100,
                    y: floorY - 100 - 40, 
                    width: 40,
                    height: 40,
                    direction: 1,
                    speed: 2,
                    platformX1: 1000,
                    platformX2: 1350,
                    type: 'goomba',
                    state: 'normal'
                });
                
                // Place Angela at the end on her platform
                angela.x = angelaPlatform.x + angelaPlatform.width/2 - angela.width/2;
                angela.y = angelaPlatform.y - angela.height;
                break;
                
            case 2:
                // Level 2: More complex with multiple paths
                // (Would implement more complex level designs here)
                // For now, we'll just have level 1
                createLevel(1);
                break;
                
            default:
                // Default to level 1
                createLevel(1);
        }
    }
    
    // Update the drawing function to use the ground texture for ground platforms
    function gameLoop() {
        if (!gameActive) return;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update game state
        updatePlayer();
        updateEnemies();
        updateShells();
        checkCollisions();
        
        // Draw background
        ctx.fillStyle = '#87CEEB'; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Adjust camera to follow player
        cameraX = Math.max(0, Math.min(player.x - canvas.width / 3, levelWidth - canvas.width));
        
        // Draw platforms
        platforms.forEach(platform => {
            const onScreen = platform.x + platform.width > cameraX && platform.x < cameraX + canvas.width;
            
            if (onScreen) {
                // Choose texture based on whether it's ground or elevated platform
                const textureImg = platform.isGround ? groundTexture : platformImage;
                
                // Draw the platform with pattern tiling
                const pattern = ctx.createPattern(textureImg, 'repeat');
                
                ctx.save();
                ctx.fillStyle = pattern;
                ctx.fillRect(
                    platform.x - cameraX,
                    platform.y,
                    platform.width,
                    platform.height
                );
                ctx.restore();
                
                // Add a slight shadow at the bottom for elevated platforms if not ground
                if (!platform.isGround) {
                    ctx.fillStyle = 'rgba(0,0,0,0.2)';
                    ctx.fillRect(
                        platform.x - cameraX,
                        platform.y + platform.height,
                        platform.width,
                        3
                    );
                }
            }
        });
        
        // Draw coins
        coins.forEach(coin => {
            if (!coin.collected && coin.x + coin.width > cameraX && coin.x < cameraX + canvas.width) {
                ctx.drawImage(
                    coinImage,
                    coin.x - cameraX,
                    coin.y,
                    coin.width,
                    coin.height
                );
            }
        });
        
        // Draw enemies
        enemies.forEach(enemy => {
            if (enemy.x + enemy.width > cameraX && enemy.x < cameraX + canvas.width) {
                if (enemy.type === 'batmanCat' && enemy.state === 'normal') {
                    ctx.drawImage(
                        batmanCatImage,
                        enemy.x - cameraX,
                        enemy.y,
                        enemy.width,
                        enemy.height
                    );
                } else if (enemy.type === 'goomba') {
                    ctx.drawImage(
                        enemyImage,
                        enemy.x - cameraX,
                        enemy.y,
                        enemy.width,
                        enemy.height
                    );
                } else if (enemy.type === 'batmanCat' && enemy.state === 'stunned') {
                    // Draw exposed cat (without mask)
                    ctx.drawImage(
                        enemyImage, 
                        enemy.x - cameraX,
                        enemy.y,
                        enemy.width,
                        enemy.height
                    );
                }
            }
        });
        
        // Draw Batman shells
        batmanShells.forEach(shell => {
            if (shell.x + shell.width > cameraX && shell.x < cameraX + canvas.width) {
                ctx.drawImage(
                    batmanShellImage,
                    shell.x - cameraX,
                    shell.y,
                    shell.width,
                    shell.height
                );
            }
        });
        
        // Draw Angela
        if (angela.x + angela.width > cameraX && angela.x < cameraX + canvas.width) {
            ctx.drawImage(
                angelaImage,
                angela.x - cameraX,
                angela.y,
                angela.width,
                angela.height
            );
        }
        
        // Draw player
        ctx.drawImage(
            playerImage,
            player.x - cameraX,
            player.y,
            player.width,
            player.height
        );
        
        // Continue the game loop
        requestAnimationFrame(gameLoop);
    }
    
    function updatePlayer() {
        // Horizontal movement
        player.velocityX = 0;
        
        if (keys.left) {
            player.velocityX = -player.speed;
        }
        
        if (keys.right) {
            player.velocityX = player.speed;
        }
        
        // Apply gravity
        player.velocityY += gravity;
        
        // Jumping
        if (keys.jump && !player.isJumping) {
            player.velocityY = -12;
            player.isJumping = true;
            safelyPlayAudio(audioElements.jumpSound);
        }
        
        // Update position
        player.x += player.velocityX;
        player.y += player.velocityY;
        
        // Keep player within level bounds
        player.x = Math.max(0, Math.min(player.x, levelWidth - player.width));
        
        // Check for platform collisions
        let onPlatform = false;
        
        platforms.forEach(platform => {
            // Check if player is on this platform
            if (player.velocityY >= 0 && // Moving down
                player.y + player.height >= platform.y && 
                player.y + player.height <= platform.y + platform.height + 10 && // Slightly below platform top
                player.x + player.width > platform.x && 
                player.x < platform.x + platform.width) {
                
                player.y = platform.y - player.height;
                player.velocityY = 0;
                player.isJumping = false;
                onPlatform = true;
            }
        });
        
        // If player falls below the bottom of the screen, game over
        if (player.y > canvas.height) {
            gameOver();
        }
    }
    
    function updateEnemies() {
        enemies.forEach(enemy => {
            // Skip stunned enemies
            if (enemy.state === 'stunned') return;
            
            // Move horizontally within platform bounds
            if (enemy.platformX1 && enemy.platformX2) {
                enemy.x += enemy.direction * enemy.speed;
                
                // Reverse direction at platform edges
                if (enemy.x <= enemy.platformX1) {
                    enemy.direction = 1;
                } else if (enemy.x + enemy.width >= enemy.platformX2) {
                    enemy.direction = -1;
                }
            }
            
            // Check if enemy has fallen off a platform
            let onPlatform = false;
            platforms.forEach(platform => {
                if (enemy.y + enemy.height === platform.y && 
                    enemy.x + enemy.width > platform.x && 
                    enemy.x < platform.x + platform.width) {
                    onPlatform = true;
                }
            });
            
            // If not on platform, apply gravity
            if (!onPlatform) {
                enemy.y += gravity;
            }
        });
    }
    
    function updateShells() {
        batmanShells.forEach((shell, index) => {
            // Move shell if active
            if (shell.active) {
                shell.x += shell.direction * shell.speed;
                
                // Check for platform edges
                let onPlatform = false;
                let canContinue = false;
                
                platforms.forEach(platform => {
                    // Check if shell is on this platform
                    if (shell.y + shell.height === platform.y && 
                        shell.x + shell.width > platform.x && 
                        shell.x < platform.x + platform.width) {
                        onPlatform = true;
                    }
                    
                    // Check if shell can continue moving in its direction
                    if (shell.y + shell.height === platform.y && 
                        ((shell.direction > 0 && shell.x + shell.width + 5 < platform.x + platform.width) || 
                         (shell.direction < 0 && shell.x - 5 > platform.x))) {
                        canContinue = true;
                    }
                });
                
                // If shell hit an edge or fell off, reverse direction
                if (!canContinue || !onPlatform) {
                    shell.direction *= -1;
                }
                
                // Check if shell hit an enemy
                enemies.forEach((enemy, enemyIndex) => {
                    if (shell.x < enemy.x + enemy.width &&
                        shell.x + shell.width > enemy.x &&
                        shell.y < enemy.y + enemy.height &&
                        shell.y + shell.height > enemy.y) {
                            
                        // Remove the enemy
                        enemies.splice(enemyIndex, 1);
                        
                        // Play sound
                        safelyPlayAudio(audioElements.punch);
                    }
                });
                
                // Shell falls off screen
                if (shell.y > canvas.height) {
                    batmanShells.splice(index, 1);
                }
            }
            
            // Apply gravity to shell if it's not on a platform
            let shellOnPlatform = false;
            platforms.forEach(platform => {
                if (shell.y + shell.height === platform.y && 
                    shell.x + shell.width > platform.x && 
                    shell.x < platform.x + platform.width) {
                    shellOnPlatform = true;
                }
            });
            
            if (!shellOnPlatform) {
                shell.y += gravity;
            }
        });
    }
    
    function checkCollisions() {
        // Check collision with enemies
        enemies.forEach((enemy, index) => {
            // Simple bounding box collision
            if (player.x < enemy.x + enemy.width &&
                player.x + player.width > enemy.x &&
                player.y < enemy.y + enemy.height &&
                player.y + player.height > enemy.y) {
                
                // Check if player is jumping on enemy from above
                if (player.velocityY > 0 && player.y + player.height < enemy.y + enemy.height / 2) {
                    // Different behavior based on enemy type and state
                    if (enemy.type === 'batmanCat' && enemy.state === 'normal') {
                        // First stomp: turn into stunned cat and create shell
                        enemy.state = 'stunned';
                        
                        // Create shell at the position where the enemy was
                        batmanShells.push({
                            x: enemy.x,
                            y: enemy.y + enemy.height - 20, 
                            width: 40,
                            height: 20,
                            direction: 0, 
                            speed: 7,
                            active: false 
                        });
                        
                        // Bounce player
                        player.velocityY = -8;
                        
                        // Play sound
                        safelyPlayAudio(audioElements.jumpSound);
                        
                    } else if (enemy.type === 'batmanCat' && enemy.state === 'stunned') {
                        // Second stomp: kill the stunned enemy
                        enemies.splice(index, 1);
                        
                        // Bounce player
                        player.velocityY = -8;
                        
                        // Play sound
                        safelyPlayAudio(audioElements.punch);
                        
                    } else if (enemy.type === 'goomba') {
                        // "Defeat" regular enemy by removing it
                        enemies.splice(index, 1);
                        
                        // Bounce player
                        player.velocityY = -8;
                        
                        // Play sound
                        safelyPlayAudio(audioElements.punch);
                    }
                } else {
                    // Player is hit by enemy (not from above)
                    gameOver();
                }
            }
        });
        
        // Check collision with shells
        batmanShells.forEach((shell, index) => {
            if (shell.x < player.x + player.width &&
                shell.x + shell.width > player.x &&
                shell.y < player.y + player.height &&
                shell.y + shell.height > player.y) {
                    
                // Check if player is jumping on shell from above
                if (player.velocityY > 0 && player.y + player.height < shell.y + shell.height / 2) {
                    // Jump on stationary shell: activate it
                    if (!shell.active) {
                        shell.active = true;
                        
                        // Direction based on player position
                        shell.direction = (player.x + player.width/2 < shell.x + shell.width/2) ? 1 : -1;
                        
                        // Bounce player
                        player.velocityY = -8;
                        
                        // Play sound
                        safelyPlayAudio(audioElements.jumpSound);
                    } else {
                        // Jump on moving shell: stop it
                        shell.active = false;
                        shell.direction = 0;
                        
                        // Bounce player
                        player.velocityY = -8;
                        
                        // Play sound
                        safelyPlayAudio(audioElements.jumpSound);
                    }
                } else if (shell.active) {
                    // Player is hit by moving shell
                    gameOver();
                } else {
                    // Player touches stationary shell from the side: kick it
                    shell.active = true;
                    shell.direction = (player.x + player.width/2 < shell.x + shell.width/2) ? 1 : -1;
                    
                    // Play sound
                    safelyPlayAudio(audioElements.vroom);
                }
            }
        });
        
        // Check collision with coins
        coins.forEach(coin => {
            if (!coin.collected &&
                player.x < coin.x + coin.width &&
                player.x + player.width > coin.x &&
                player.y < coin.y + coin.height &&
                player.y + player.height > coin.y) {
                
                coin.collected = true;
                score++;
                coinCountSpan.textContent = score;
                safelyPlayAudio(audioElements.coinSound);
            }
        });
        
        // Check collision with Angela (win condition)
        if (player.x < angela.x + angela.width &&
            player.x + player.width > angela.x &&
            player.y < angela.y + angela.height &&
            player.y + player.height > angela.y) {
            
            victory();
        }
    }
    
    function gameOver() {
        gameActive = false;
        
        if (audioElements.gameMusic) {
            audioElements.gameMusic.pause();
            audioElements.gameMusic.currentTime = 0;
        }
        
        gameOverOverlay.classList.remove('hidden');
    }
    
    function victory() {
        gameActive = false;
        
        if (audioElements.gameMusic) {
            audioElements.gameMusic.pause();
            audioElements.gameMusic.currentTime = 0;
        }
        
        safelyPlayAudio(audioElements.victorySound);
        
        // Add coins to total count for the shop
        totalCoins += score;
        updateCoinDisplay();
        
        // Update stats
        updateUserStats();
        
        victoryCoinSpan.textContent = score;
        gameVictoryOverlay.classList.remove('hidden');
    }
    
    function stopGame() {
        gameActive = false;
        
        if (audioElements.gameMusic) {
            audioElements.gameMusic.pause();
            audioElements.gameMusic.currentTime = 0;
        }
        
        isPlayingMarioGame = false;
        marioGameContainer.classList.add('hidden');
        resetTomImage();
    }
    
    // Add this function to handle game controls
    function setupControls() {
        // Keyboard controls
        window.addEventListener('keydown', function(e) {
            if (!gameActive) return;
            
            switch(e.key) {
                case 'ArrowLeft':
                case 'a':
                    keys.left = true;
                    break;
                case 'ArrowRight':
                case 'd':
                    keys.right = true;
                    break;
                case 'ArrowUp':
                case 'w':
                case ' ':
                    keys.jump = true;
                    break;
            }
        });
        
        window.addEventListener('keyup', function(e) {
            switch(e.key) {
                case 'ArrowLeft':
                case 'a':
                    keys.left = false;
                    break;
                case 'ArrowRight':
                case 'd':
                    keys.right = false;
                    break;
                case 'ArrowUp':
                case 'w':
                case ' ':
                    keys.jump = false;
                    break;
            }
        });
        
        // Touch/click controls
        marioLeftBtn.addEventListener('mousedown', function() {
            keys.left = true;
        });
        
        marioLeftBtn.addEventListener('mouseup', function() {
            keys.left = false;
        });
        
        marioLeftBtn.addEventListener('touchstart', function(e) {
            e.preventDefault();
            keys.left = true;
        });
        
        marioLeftBtn.addEventListener('touchend', function() {
            keys.left = false;
        });
        
        marioRightBtn.addEventListener('mousedown', function() {
            keys.right = true;
        });
        
        marioRightBtn.addEventListener('mouseup', function() {
            keys.right = false;
        });
        
        marioRightBtn.addEventListener('touchstart', function(e) {
            e.preventDefault();
            keys.right = true;
        });
        
        marioRightBtn.addEventListener('touchend', function() {
            keys.right = false;
        });
        
        marioJumpBtn.addEventListener('mousedown', function() {
            keys.jump = true;
        });
        
        marioJumpBtn.addEventListener('mouseup', function() {
            keys.jump = false;
        });
        
        marioJumpBtn.addEventListener('touchstart', function(e) {
            e.preventDefault();
            keys.jump = true;
        });
        
        marioJumpBtn.addEventListener('touchend', function() {
            keys.jump = false;
        });
        
        // Exit button
        marioExitBtn.addEventListener('click', function() {
            MarioGame.stopGame();
        });
    }
    
    // Public API
    return {
        init,
        stopGame
    };
})();

// Mario button event listener
marioBtn.addEventListener('click', () => {
    if (isTomBusy()) {
        console.log('Tom is busy, cannot start Mario game.');
        gsap.to(marioBtn, {
            scale: 1.1,
            yoyo: true,
            repeat: 1,
            duration: 0.1,
            ease: "power1.easeInOut"
        });
        return;
    }
    
    console.log('Mario button clicked!');
    
    // Hide any open panels
    foodPanel.classList.add('hidden');
    pianoKeyboard.classList.add('hidden');
    shopPanel.classList.add('hidden');
    isPianoKeyboardVisible = false;
    
    // Show the game container
    marioGameContainer.classList.remove('hidden');
    isPlayingMarioGame = true;
    
    // Initialize and start the game
    MarioGame.init();
});

// Victory OK button
victoryOkBtn.addEventListener('click', () => {
    gameVictoryOverlay.classList.add('hidden');
    MarioGame.stopGame();
});

// Game Over buttons
gameOverRetryBtn.addEventListener('click', () => {
    gameOverOverlay.classList.add('hidden');
    MarioGame.init(); 
});

gameOverExitBtn.addEventListener('click', () => {
    gameOverOverlay.classList.add('hidden');
    MarioGame.stopGame();
});

function startCoinGeneration() {
    // Clear any existing interval
    if (coinGenerationInterval) {
        clearInterval(coinGenerationInterval);
    }
    
    // Initialize the time of the last coin
    lastCoinTime = Date.now();
    
    // Check every second if enough time has passed to generate a coin
    coinGenerationInterval = setInterval(() => {
        const currentTime = Date.now();
        const elapsedTime = currentTime - lastCoinTime;
        
        // Update UI to show progress
        const progressPercent = Math.min(100, (elapsedTime / COIN_GENERATION_DELAY) * 100);
        document.getElementById('coin-progress-bar').style.width = `${progressPercent}%`;
        
        // Generate coin if enough time has passed
        if (elapsedTime >= COIN_GENERATION_DELAY) {
            generateCoin();
            lastCoinTime = currentTime;
        }
    }, 1000);
}

function generateCoin() {
    if (isBSODActive || isCrashed) return; // Don't generate coins if game is crashed
    
    console.log('Generating coin after 10 seconds');
    
    // Create a coin element
    const coin = document.createElement('img');
    coin.src = '/coin_item.png';
    coin.classList.add('generated-coin');
    coin.style.position = 'absolute';
    coin.style.width = '40px';
    coin.style.height = '40px';
    coin.style.zIndex = '1000';
    
    // Start position - center of screen
    coin.style.top = '50%';
    coin.style.left = '50%';
    coin.style.transform = 'translate(-50%, -50%)';
    
    // Add to container
    gameContainer.appendChild(coin);
    
    // Play coin sound
    safelyPlayAudio(audioElements.coinSound);
    
    // Get shop button position
    const shopBtnRect = shopBtn.getBoundingClientRect();
    const gameContainerRect = gameContainer.getBoundingClientRect();
    
    // Calculate target position relative to game container
    const targetX = (shopBtnRect.left + shopBtnRect.width/2) - gameContainerRect.left;
    const targetY = (shopBtnRect.top + shopBtnRect.height/2) - gameContainerRect.top;
    
    // Animate coin to shop button
    gsap.timeline({
        onComplete: () => {
            // Remove coin element
            coin.remove();
            
            // Add to coin count
            totalCoins++;
            updateCoinDisplay();
            
            // Update stats
            updateUserStats();
            
            // Animate shop button to give feedback
            gsap.to(shopBtn, {
                scale: 1.2,
                duration: 0.2,
                yoyo: true,
                repeat: 1,
                ease: "power1.inOut"
            });
        }
    })
    .to(coin, {
        rotation: 360,
        repeat: 2,
        duration: 0.8,
        ease: "none"
    }, 0)
    .to(coin, {
        x: targetX - parseFloat(coin.style.left),
        y: targetY - parseFloat(coin.style.top),
        duration: 1,
        ease: "power1.inOut"
    }, 0);
}

// Phone Button Event Listener
phoneBtn.addEventListener('click', () => {
    if (isTomBusy() && !isPhoneAnimating) return;
    console.log('Phone button clicked!');
    
    // Dismiss other panels
    foodPanel.classList.add('hidden');
    shopPanel.classList.add('hidden');
    pianoKeyboard.classList.add('hidden');
    isPianoKeyboardVisible = false;
    
    // Toggle phone interface
    isPhoneActive = !isPhoneActive;
    phoneInterface.classList.toggle('hidden', !isPhoneActive);
    
    if (isPhoneActive) {
        showPhoneHomeScreen();
        
        isPhoneAnimating = true;
        
        // Play phone dial sound
        safelyPlayAudio(audioElements.phoneDialSound);
        
        // Set Tom to phone position
        gsap.killTweensOf(talkingTom);
        gsap.set(talkingTom, { transformOrigin: "bottom center" });
        setTomImage(phoneTomSrc);
        
        // Animate Tom holding phone
        gsap.timeline()
        .to(talkingTom, {
            rotation: 5,
            duration: 0.3,
            ease: "power1.easeOut"
        })
        .to(talkingTom, {
            rotation: 3,
            duration: 0.2,
            ease: "power1.easeInOut",
            repeat: 1,
            yoyo: true
        });
        
    } else {
        closeAllPhoneApps();
        if (document.querySelector('.under-construction')) {
            document.querySelector('.under-construction').style.display = 'none';
        }
        
        // Reset Tom when phone is closed
        isPhoneAnimating = false;
        gsap.to(talkingTom, {
            rotation: 0,
            duration: 0.3,
            ease: "power1.easeOut",
            onComplete: resetTomImage
        });
    }
});

// New function to show phone home screen
function showPhoneHomeScreen() {
    closeAllPhoneApps();
    
    // Make sure the phone screen (with app icons) is visible
    const phoneScreen = document.querySelector('.phone-screen');
    phoneScreen.style.display = 'flex';
    
    // Hide any under construction message if it exists
    if (document.querySelector('.under-construction')) {
        document.querySelector('.under-construction').style.display = 'none';
    }
    
    // Ensure app icons are visible
    ensurePhoneIconsVisible();
}

// Function to ensure phone icons are visible
function ensurePhoneIconsVisible() {
    // Get phone screen and phone apps 
    const phoneScreen = document.querySelector('.phone-screen');
    const phoneApps = document.querySelector('.phone-apps');
    
    // Make sure phone screen is displayed as flex
    phoneScreen.style.display = 'flex';
    
    // Ensure all app icons are visible
    const appButtons = document.querySelectorAll('.phone-app-btn');
    appButtons.forEach(btn => {
        btn.style.display = 'flex';
        
        // Make sure the icon is displayed
        const img = btn.querySelector('img');
        if (img && img.style.display === 'none') {
            img.style.display = 'block';
        }
    });
    
    // Force phone apps container to be visible
    phoneApps.style.display = 'grid';
    phoneApps.style.opacity = '1';
    phoneApps.style.visibility = 'visible';
}

// New function to show under construction message
function showUnderConstructionMessage() {
    closeAllPhoneApps();
    
    // Hide phone screen with app icons
    document.querySelector('.phone-screen').style.display = 'none';
    
    if (!document.querySelector('.under-construction')) {
        const constructionMessage = document.createElement('div');
        constructionMessage.classList.add('under-construction');
        constructionMessage.innerHTML = `
            <div class="construction-icon">🚧</div>
            <h3>Under Construction</h3>
            <p>This feature is currently being developed.</p>
            <p>Please check back later!</p>
            <div class="construction-animation">
                <div class="gear">⚙️</div>
                <div class="tool">🔧</div>
            </div>
        `;
        document.querySelector('.phone-app-container').appendChild(constructionMessage);
    } else {
        document.querySelector('.under-construction').style.display = 'flex';
    }
}

// Phone Home button
const phoneHomeBtn = document.getElementById('phone-home-btn');
phoneHomeBtn.addEventListener('click', () => {
    console.log('Phone Home button clicked');
    showPhoneHomeScreen();
});

// Close button for phone
phoneCloseBtn.addEventListener('click', () => {
    isPhoneActive = false;
    phoneInterface.classList.add('hidden');
    closeAllPhoneApps();
    
    // Reset Tom
    isPhoneAnimating = false;
    gsap.to(talkingTom, {
        rotation: 0,
        duration: 0.3,
        ease: "power1.easeOut",
        onComplete: resetTomImage
    });
});

// App buttons in phone interface
phoneAppBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const appName = btn.dataset.app;
        console.log(`Opening ${appName} app`);
        
        closeAllPhoneApps();
        
        const appElement = document.querySelector(`.${appName}-app`);
        if (appElement) {
            appElement.classList.remove('hidden');
            currentPhoneApp = appName;
            
            if (appName === 'music') {
                animateMusicProgress();
            } else if (appName === 'weather') {
                updateWeatherDisplay(weatherCitySelector.value);
            }
        }
    });
});

// Back buttons in apps
appBackBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const appElement = btn.closest('.phone-app');
        if (appElement) {
            appElement.classList.add('hidden');
            currentPhoneApp = null;
            
            showPhoneHomeScreen();
        }
    });
});

function closeAllPhoneApps() {
    const phoneApps = document.querySelectorAll('.phone-app');
    phoneApps.forEach(app => {
        app.classList.add('hidden');
    });
    
    currentPhoneApp = null;
    
    if (isMusicPlaying) {
        isMusicPlaying = false;
        musicPlayBtn.textContent = '▶️';
        
        Object.values(musicTracks).forEach(track => {
            if (track.audio) {
                safelyPauseAudio(track.audio);
            }
        });
    }
}

// Weather App
weatherCitySelector.addEventListener('change', function() {
    updateWeatherDisplay(this.value);
});

weatherRefreshBtn.addEventListener('click', function() {
    const currentCity = weatherCitySelector.value;
    safelyPlayAudio(audioElements.popHigh);
    
    weatherIcon.textContent = '⏳';
    weatherTemp.textContent = '...';
    
    setTimeout(() => {
        updateWeatherDisplay(currentCity);
    }, 500);
});

function updateWeatherDisplay(cityKey) {
    const cityData = weatherData[cityKey];
    
    if (cityData) {
        weatherLocation.textContent = cityData.name;
        weatherIcon.textContent = cityData.icon;
        weatherTemp.textContent = cityData.temp;
        weatherDesc.textContent = cityData.desc;
        
        const forecastDays = document.querySelectorAll('.forecast-day');
        cityData.forecast.forEach((day, index) => {
            if (index < forecastDays.length) {
                forecastDays[index].querySelector('div:nth-child(1)').textContent = day.day;
                forecastDays[index].querySelector('div:nth-child(2)').textContent = day.icon;
                forecastDays[index].querySelector('div:nth-child(3)').textContent = day.temp;
            }
        });
    }
}

// Camera App
cameraFilterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const filter = this.dataset.filter;
        currentFilter = filter;
        
        cameraFilterBtns.forEach(b => b.classList.remove('active'));
        
        this.classList.add('active');
        
        switch(filter) {
            case 'normal':
                cameraPreviewImg.style.filter = 'none';
                break;
            case 'sepia':
                cameraPreviewImg.style.filter = 'sepia(100%)';
                break;
            case 'invert':
                cameraPreviewImg.style.filter = 'invert(100%)';
                break;
            case 'grayscale':
                cameraPreviewImg.style.filter = 'grayscale(100%)';
                break;
        }
    });
});

cameraFlipBtn.addEventListener('click', () => {
    isCameraFlipped = !isCameraFlipped;
    
    gsap.to(cameraPreviewImg, {
        rotationY: isCameraFlipped ? 180 : 0,
        duration: 0.5,
        ease: "power1.easeOut"
    });
    
    safelyPlayAudio(audioElements.vroom);
});

cameraCaptureBtn.addEventListener('click', () => {
    const cameraPreview = document.querySelector('.camera-preview');
    gsap.to(cameraPreview, {
        backgroundColor: '#fff',
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "none"
    });
    
    safelyPlayAudio(audioElements.popHigh);
    
    cameraSnapshotOverlay.classList.remove('hidden');
    snapshotImage.src = cameraPreviewImg.src;
    snapshotImage.style.filter = cameraPreviewImg.style.filter;
    snapshotImage.style.transform = `rotateY(${isCameraFlipped ? '180deg' : '0deg'})`;
});

snapshotSaveBtn.addEventListener('click', () => {
    safelyPlayAudio(audioElements.popHigh);
    cameraSnapshotOverlay.classList.add('hidden');
    
    const savedMsg = document.createElement('div');
    savedMsg.textContent = 'Photo saved!';
    savedMsg.style.position = 'absolute';
    savedMsg.style.bottom = '20%';
    savedMsg.style.left = '50%';
    savedMsg.style.transform = 'translateX(-50%)';
    savedMsg.style.backgroundColor = 'rgba(0,0,0,0.7)';
    savedMsg.style.color = 'white';
    savedMsg.style.padding = '10px 20px';
    savedMsg.style.borderRadius = '20px';
    savedMsg.style.zIndex = '1000';
    
    document.querySelector('.camera-app').appendChild(savedMsg);
    
    gsap.to(savedMsg, {
        opacity: 0,
        y: -30,
        duration: 1.5,
        ease: "power1.inOut",
        onComplete: () => savedMsg.remove()
    });
});

snapshotDiscardBtn.addEventListener('click', () => {
    safelyPlayAudio(audioElements.popLow);
    cameraSnapshotOverlay.classList.add('hidden');
});

// Music App
musicTrackSelector.addEventListener('change', function() {
    const trackKey = this.value;
    updateMusicPlayer(trackKey);
    
    if (isMusicPlaying) {
        stopAllAudio();
        safelyPlayAudio(musicTracks[trackKey].audio);
        
        animateMusicProgress();
    }
});

musicPlayBtn.addEventListener('click', () => {
    isMusicPlaying = !isMusicPlaying;
    musicPlayBtn.textContent = isMusicPlaying ? '⏸️' : '▶️';
    
    const trackKey = musicTrackSelector.value;
    
    if (isMusicPlaying) {
        safelyPlayAudio(musicTracks[trackKey].audio);
        animateMusicProgress();
    } else {
        if (musicTracks[trackKey].audio) {
            musicTracks[trackKey].audio.pause();
        }
    }
});

musicPrevBtn.addEventListener('click', () => {
    const trackKeys = Object.keys(musicTracks);
    const currentTrackKey = musicTrackSelector.value;
    const currentIndex = trackKeys.indexOf(currentTrackKey);
    
    const prevIndex = (currentIndex - 1 + trackKeys.length) % trackKeys.length;
    const prevTrackKey = trackKeys[prevIndex];
    
    musicTrackSelector.value = prevTrackKey;
    
    updateMusicPlayer(prevTrackKey);
    
    if (isMusicPlaying) {
        stopAllAudio();
        safelyPlayAudio(musicTracks[prevTrackKey].audio);
        animateMusicProgress();
    }
});

musicNextBtn.addEventListener('click', () => {
    const trackKeys = Object.keys(musicTracks);
    const currentTrackKey = musicTrackSelector.value;
    const currentIndex = trackKeys.indexOf(currentTrackKey);
    
    const nextIndex = (currentIndex + 1) % trackKeys.length;
    const nextTrackKey = trackKeys[nextIndex];
    
    musicTrackSelector.value = nextTrackKey;
    
    updateMusicPlayer(nextTrackKey);
    
    if (isMusicPlaying) {
        stopAllAudio();
        safelyPlayAudio(musicTracks[nextTrackKey].audio);
        animateMusicProgress();
    }
});

musicVolumeSlider.addEventListener('input', function() {
    const trackKey = musicTrackSelector.value;
    if (musicTracks[trackKey].audio) {
        musicTracks[trackKey].audio.volume = this.value / 100;
    }
});

function updateMusicPlayer(trackKey) {
    const track = musicTracks[trackKey];
    
    if (track) {
        musicAlbumArt.src = track.albumArt;
        musicTitle.textContent = track.title;
        musicArtist.textContent = track.artist;
        musicTotalTime.textContent = track.duration;
        
        musicCurrentTime.textContent = '0:00';
    }
}

function animateMusicProgress() {
    if (!isMusicPlaying) return;
    
    const progressBar = document.querySelector('.music-progress-bar');
    const currentTimeElement = document.querySelector('.music-current-time');
    gsap.killTweensOf(progressBar);
    gsap.set(progressBar, { width: '0%' });
    
    const trackKey = musicTrackSelector.value;
    const trackDuration = parseDuration(musicTracks[trackKey].duration);
    
    let elapsedSeconds = 0;
    const updateTime = () => {
        elapsedSeconds++;
        const minutes = Math.floor(elapsedSeconds / 60);
        const seconds = elapsedSeconds % 60;
        currentTimeElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        gsap.to(progressBar, {
            width: `${(elapsedSeconds / trackDuration) * 100}%`,
            duration: 1,
            ease: "linear",
            onComplete: () => {
                if (isMusicPlaying) {
                    updateTime();
                }
            }
        });
    };
    updateTime();
}

function parseDuration(duration) {
    const parts = duration.split(':');
    const minutes = parseInt(parts[0]);
    const seconds = parseInt(parts[1]);
    return minutes * 60 + seconds;
}

// Swap button functionality
swapBtn.addEventListener('click', () => {
    if (isTomBusy() && !isDancing) return;
    console.log('Swap button clicked!');
    
    isPage2Active = !isPage2Active;
    
    // Toggle button sets
    if (isPage2Active) {
        page1Buttons.classList.add('hidden');
        page2Buttons.classList.remove('hidden');
        
        // Animate swap button
        gsap.to(swapBtn, {
            rotation: 180,
            duration: 0.3,
            ease: "power1.easeOut"
        });
    } else {
        page1Buttons.classList.remove('hidden');
        page2Buttons.classList.add('hidden');
        
        // Stop dancing if active
        if (isDancing) {
            stopDancing();
        }
        
        // Animate swap button back
        gsap.to(swapBtn, {
            rotation: 0,
            duration: 0.3,
            ease: "power1.easeOut"
        });
    }
});

// Dance button functionality
danceBtn.addEventListener('click', () => {
    if (isTomBusy() && !isDancing) return;
    console.log('Dance button clicked!');
    
    if (!isDancing) {
        startDancing();
    } else {
        stopDancing();
    }
});

function startDancing() {
    isDancing = true;
    
    // Play dance music
    if (audioElements.danceMusic) {
        audioElements.danceMusic.loop = true;
        safelyPlayAudio(audioElements.danceMusic);
    }
    
    // Highlight the dance button
    danceBtn.classList.add('active-button');
    
    // Set Tom's dancing image
    setTomImage(dancingTomSrc);
    
    // Create dance animation
    gsap.killTweensOf(talkingTom);
    const danceAnimation = gsap.timeline({repeat: -1, repeatDelay: 0.2});
    
    danceAnimation.to(talkingTom, {
        rotation: 5,
        y: "-=20",
        scaleY: 1.05,
        scaleX: 0.95,
        duration: 0.3,
        ease: "power1.easeOut"
    })
    .to(talkingTom, {
        rotation: -5,
        y: "0",
        scaleY: 0.95,
        scaleX: 1.05,
        duration: 0.3,
        ease: "power1.easeOut"
    })
    .to(talkingTom, {
        rotation: 5,
        y: "-=15",
        scaleY: 1.03,
        scaleX: 0.97,
        duration: 0.25,
        ease: "power1.easeOut"
    })
    .to(talkingTom, {
        rotation: 0,
        y: 0,
        scaleY: 1,
        scaleX: 1,
        duration: 0.25,
        ease: "power1.easeOut"
    });
    
    // Occasionally generate stars for visual effect
    const starsInterval = setInterval(() => {
        if (isDancing) {
            createStarsEffect();
        } else {
            clearInterval(starsInterval);
        }
    }, 5000);
}

function stopDancing() {
    isDancing = false;
    
    // Stop dance music
    if (audioElements.danceMusic) {
        safelyPauseAudio(audioElements.danceMusic);
    }
    
    // Remove highlight from dance button
    danceBtn.classList.remove('active-button');
    
    // Stop dance animation and reset Tom's image
    gsap.killTweensOf(talkingTom);
    gsap.to(talkingTom, {
        rotation: 0,
        y: 0,
        scaleY: 1,
        scaleX: 1,
        duration: 0.3,
        ease: "power1.easeOut",
        onComplete: resetTomImage
    });
}

// Setup Websim room for leaderboard
const room = new WebsimSocket();

// Initialize leaderboard
function initLeaderboard() {
    // Set up tab switching
    coinsTab.addEventListener('click', () => {
        coinsTab.classList.add('active');
        foodTab.classList.remove('active');
        coinsLeaderboard.classList.add('active');
        foodLeaderboard.classList.remove('active');
    });
    
    foodTab.addEventListener('click', () => {
        foodTab.classList.add('active');
        coinsTab.classList.remove('active');
        foodLeaderboard.classList.add('active');
        coinsLeaderboard.classList.remove('active');
    });
    
    // Set up close button
    leaderboardCloseBtn.addEventListener('click', () => {
        leaderboardOverlay.classList.add('hidden');
        
        // Unsubscribe from real-time updates when leaderboard is closed
        if (coinsSubscription) {
            coinsSubscription();
            coinsSubscription = null;
        }
        if (foodSubscription) {
            foodSubscription();
            foodSubscription = null;
        }
    });
    
    // Set up update stats button
    updateStatsBtn.addEventListener('click', async () => {
        await updateUserStats();
        safelyPlayAudio(audioElements.coinSound);
        
        gsap.to(updateStatsBtn, {
            scale: 1.1,
            yoyo: true,
            repeat: 1,
            duration: 0.15,
            ease: "power1.inOut"
        });
        
        // Stats will update automatically through subscriptions
    });
    
    // Leaderboard button click
    leaderboardBtn.addEventListener('click', () => {
        if (isTomBusy() && !isDancing) return;
        console.log('Leaderboard button clicked!');
        
        leaderboardOverlay.classList.remove('hidden');
        
        // Update display with current stats
        yourCoinsCount.textContent = totalCoins;
        yourFoodCount.textContent = foodEaten;
        
        // Load leaderboard data with real-time updates
        subscribeToLeaderboards();
    });
}

// Update user's statistics in the database
async function updateUserStats() {
    try {
        let username;
        try {
            username = await getCurrentUsername();
        } catch (error) {
            console.error('Error getting username:', error);
            username = `Guest${Math.floor(Math.random() * 10000)}`;
        }
        
        // Look for existing stats first
        try {
            const existingCoinsStats = await room.collection('tom_coins_stats')
                .filter({ username: username })
                .getList();
                
            if (existingCoinsStats.length > 0) {
                // Update existing coin stats
                const statsRecord = existingCoinsStats[0];
                if (totalCoins > statsRecord.coins) {
                    await room.collection('tom_coins_stats').update(statsRecord.id, {
                        coins: totalCoins
                    });
                }
            } else {
                // Create new coin stats
                await room.collection('tom_coins_stats').create({
                    coins: totalCoins
                });
            }
        } catch (error) {
            console.error('Error updating coin stats:', error);
            // Continue to try food stats even if coin stats fail
        }
        
        try {
            const existingFoodStats = await room.collection('tom_food_stats')
                .filter({ username: username })
                .getList();
            
            if (existingFoodStats.length > 0) {
                // Update existing food stats
                const statsRecord = existingFoodStats[0];
                if (foodEaten > statsRecord.food) {
                    await room.collection('tom_food_stats').update(statsRecord.id, {
                        food: foodEaten
                    });
                }
            } else {
                // Create new food stats
                await room.collection('tom_food_stats').create({
                    food: foodEaten
                });
            }
        } catch (error) {
            console.error('Error updating food stats:', error);
        }
        
        console.log('Stats updated successfully');
    } catch (error) {
        console.error('Error updating stats:', error);
    }
}

// Subscribe to real-time leaderboard updates
async function subscribeToLeaderboards() {
    try {
        // Show loading indicators
        coinsLeaderboardBody.innerHTML = '';
        foodLeaderboardBody.innerHTML = '';
        
        document.querySelectorAll('.leaderboard-loading').forEach(el => {
            el.style.display = 'block';
        });
        
        let currentUsername;
        try {
            currentUsername = await getCurrentUsername();
        } catch (error) {
            console.error('Error fetching username, using guest:', error);
            currentUsername = `Guest${Math.floor(Math.random() * 10000)}`;
        }
        
        // Unsubscribe from any existing subscriptions
        if (coinsSubscription) {
            coinsSubscription();
            coinsSubscription = null;
        }
        if (foodSubscription) {
            foodSubscription();
            foodSubscription = null;
        }
        
        // Add timeout to detect if subscriptions aren't responding
        let coinsDataReceived = false;
        let foodDataReceived = false;
        
        const subscriptionTimeout = setTimeout(() => {
            if (!coinsDataReceived) {
                document.querySelectorAll('.leaderboard-loading')[0].style.display = 'none';
                coinsLeaderboardBody.innerHTML = '<tr><td colspan="4" class="error-message">Connection timeout. Please try again later.</td></tr>';
            }
            if (!foodDataReceived) {
                document.querySelectorAll('.leaderboard-loading')[1].style.display = 'none';
                foodLeaderboardBody.innerHTML = '<tr><td colspan="4" class="error-message">Connection timeout. Please try again later.</td></tr>';
            }
        }, 5000); // 5 second timeout
        
        // Subscribe to coin stats with real-time updates
        try {
            coinsSubscription = room.collection('tom_coins_stats').subscribe(coinStats => {
                coinsDataReceived = true;
                if (coinStats.length > 0) {
                    // Sort by coins (highest first)
                    coinStats.sort((a, b) => b.coins - a.coins);
                    document.querySelectorAll('.leaderboard-loading')[0].style.display = 'none';
                    populateLeaderboard(coinsLeaderboardBody, coinStats, currentUsername, 'coins');
                } else {
                    coinsLeaderboardBody.innerHTML = '<tr><td colspan="4" class="empty-message">No data available yet. Be the first to submit your score!</td></tr>';
                    document.querySelectorAll('.leaderboard-loading')[0].style.display = 'none';
                }
            });
        } catch (error) {
            console.error('Error subscribing to coin stats:', error);
            document.querySelectorAll('.leaderboard-loading')[0].style.display = 'none';
            coinsLeaderboardBody.innerHTML = '<tr><td colspan="4" class="error-message">Failed to load coin data. Please try again.</td></tr>';
        }
        
        // Subscribe to food stats with real-time updates
        try {
            foodSubscription = room.collection('tom_food_stats').subscribe(foodStats => {
                foodDataReceived = true;
                if (foodStats.length > 0) {
                    // Sort by food (highest first)
                    foodStats.sort((a, b) => b.food - a.food);
                    document.querySelectorAll('.leaderboard-loading')[1].style.display = 'none';
                    populateLeaderboard(foodLeaderboardBody, foodStats, currentUsername, 'food');
                } else {
                    foodLeaderboardBody.innerHTML = '<tr><td colspan="4" class="empty-message">No data available yet. Be the first to submit your score!</td></tr>';
                    document.querySelectorAll('.leaderboard-loading')[1].style.display = 'none';
                }
            });
        } catch (error) {
            console.error('Error subscribing to food stats:', error);
            document.querySelectorAll('.leaderboard-loading')[1].style.display = 'none';
            foodLeaderboardBody.innerHTML = '<tr><td colspan="4" class="error-message">Failed to load food data. Please try again.</td></tr>';
        }
        
        // Clear timeout if both data sets are received
        if (coinsDataReceived && foodDataReceived) {
            clearTimeout(subscriptionTimeout);
        }
        
    } catch (error) {
        console.error('Error subscribing to leaderboards:', error);
        
        // Show error message and retry button
        document.querySelectorAll('.leaderboard-loading').forEach(el => {
            el.style.display = 'none';
        });
        
        coinsLeaderboardBody.innerHTML = '<tr><td colspan="4" class="error-message">Error loading data. <button class="retry-btn">Try Again</button></td></tr>';
        foodLeaderboardBody.innerHTML = '<tr><td colspan="4" class="error-message">Error loading data. <button class="retry-btn">Try Again</button></td></tr>';
        
        // Add event listeners to retry buttons
        document.querySelectorAll('.retry-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                subscribeToLeaderboards();
            });
        });
    }
}

// Populate leaderboard table - modified to show top 10 + user's position
function populateLeaderboard(tableBody, stats, currentUsername, statType) {
    tableBody.innerHTML = '';
    
    // Find the user's position in the full stats list
    const userPosition = stats.findIndex(stat => stat.username === currentUsername);
    
    // Create a set to track which positions we need to show
    const positionsToShow = new Set();
    
    // Always include top 10
    for (let i = 0; i < Math.min(10, stats.length); i++) {
        positionsToShow.add(i);
    }
    
    // If user is outside top 10, add their position and some context
    if (userPosition >= 10) {
        // Add user's position
        positionsToShow.add(userPosition);
        
        // Add one position above and below for context if they exist
        if (userPosition > 10) positionsToShow.add(userPosition - 1);
        if (userPosition < stats.length - 1) positionsToShow.add(userPosition + 1);
    }
    
    // Convert to sorted array for easier rendering
    const sortedPositions = Array.from(positionsToShow).sort((a, b) => a - b);
    
    let lastPos = -1;
    
    sortedPositions.forEach(position => {
        const stat = stats[position];
        
        // Add a separator row if there's a gap in positions
        if (lastPos !== -1 && position > lastPos + 1) {
            const separatorRow = document.createElement('tr');
            separatorRow.classList.add('separator-row');
            
            const separatorCell = document.createElement('td');
            separatorCell.colSpan = 4;
            separatorCell.textContent = '...';
            separatorCell.style.textAlign = 'center';
            separatorCell.style.padding = '5px';
            separatorCell.style.color = '#888';
            
            separatorRow.appendChild(separatorCell);
            tableBody.appendChild(separatorRow);
        }
        
        const tr = document.createElement('tr');
        const isCurrentUser = stat.username === currentUsername;
        
        if (isCurrentUser) {
            tr.classList.add('current-user');
        }
        
        // Rank column
        const rankTd = document.createElement('td');
        rankTd.textContent = position + 1;
        tr.appendChild(rankTd);
        
        // Username column
        const usernameTd = document.createElement('td');
        usernameTd.textContent = stat.username;
        tr.appendChild(usernameTd);
        
        // Stat value column
        const valueTd = document.createElement('td');
        valueTd.textContent = statType === 'coins' ? stat.coins : stat.food;
        tr.appendChild(valueTd);
        
        // Last updated
        const dateTd = document.createElement('td');
        const date = new Date(stat.created_at);
        dateTd.textContent = date.toLocaleDateString();
        tr.appendChild(dateTd);
        
        tableBody.appendChild(tr);
        
        lastPos = position;
    });
}

// Global variables for subscriptions
let coinsSubscription = null;
let foodSubscription = null;

// Track food eaten
function trackFoodEaten() {
    foodEaten++;
    updateUserStats();
}

// Victory updates stats
function victory() {
    gameActive = false;
    
    if (audioElements.gameMusic) {
        audioElements.gameMusic.pause();
        audioElements.gameMusic.currentTime = 0;
    }
    
    safelyPlayAudio(audioElements.victorySound);
    
    // Add coins to total count for the shop
    totalCoins += score;
    updateCoinDisplay();
    
    // Update stats
    updateUserStats();
    
    victoryCoinSpan.textContent = score;
    gameVictoryOverlay.classList.remove('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
    startCoinGeneration();
    
    const iconPaths = [
        '/weather_app_icon.png',
        '/camera_app_icon.png',
        '/music_app_icon.png',
        '/game_app_icon.png',
        '/warning_app_icon.png',
        '/sound_test_icon.png',
        '/leaderboard_icon.png'  // Add leaderboard icon to preload
    ];
    
    iconPaths.forEach(path => {
        const img = new Image();
        img.src = path;
    });
    
    // Initialize leaderboard
    initLeaderboard();
});

// Helper function to get current username
async function getCurrentUsername() {
    try {
        // Try to get username from websim API
        if (window.websim && typeof window.websim.getCreatedBy === 'function') {
            const creator = await window.websim.getCreatedBy();
            return creator.username;
        }
        // Fallback to a default guest name with random number
        return `Guest${Math.floor(Math.random() * 10000)}`;
    } catch (error) {
        console.error('Error getting username:', error);
        return `Guest${Math.floor(Math.random() * 10000)}`;
    }
}