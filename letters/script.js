// Use Matter directly from the global scope instead of importing
const Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      Bodies = Matter.Bodies,
      Body = Matter.Body,
      Composite = Matter.Composite,
      Mouse = Matter.Mouse,
      MouseConstraint = Matter.MouseConstraint,
      Events = Matter.Events,
      Vector = Matter.Vector,
      Query = Matter.Query,
      Constraint = Matter.Constraint;

// Helper function to generate random colors
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Create engine and world
const engine = Engine.create();
const world = engine.world;
let defaultGravity = 1;
let blackHoleActive = false;
let blackHoleAttractor = null;
let waterEffectActive = false;
let windActive = false;
let windDirection = { x: 0, y: 0 };
let letterMagnetActive = false;
let tornadoActive = false;
let tornadoCenter = { x: 0, y: 0 };
let lettersFrozen = false;
let blenderActive = false;
let blenderCenter = { x: 0, y: 0 };
let draggingFrozenElement = null;
let dragOffset = { x: 0, y: 0 };
let clearWallActive = false;
let ribbonVisible = true;
let followingBody = null;
let followingIndicator = null;

// Global variables
let deleteMode = false;
let cloneMode = false;
let currentFont = 'Arial';
let currentFontSize = 24;

// Available fonts from Google Fonts
const availableFonts = [
    { name: 'Roboto', sample: 'Aa' },
    { name: 'Open Sans', sample: 'Aa' },
    { name: 'Lato', sample: 'Aa' },
    { name: 'Montserrat', sample: 'Aa' },
    { name: 'Oswald', sample: 'Aa' },
    { name: 'Raleway', sample: 'Aa' },
    { name: 'Ubuntu', sample: 'Aa' },
    { name: 'Pacifico', sample: 'Aa' },
    { name: 'Bangers', sample: 'Aa' },
    { name: 'Creepster', sample: 'Aa' },
    { name: 'Satisfy', sample: 'Aa' },
    { name: 'Permanent Marker', sample: 'Aa' },
    { name: 'Arial', sample: 'Aa' },
    { name: 'Times New Roman', sample: 'Aa' },
    { name: 'Courier New', sample: 'Aa' },
    { name: 'Verdana', sample: 'Aa' },
    { name: 'Georgia', sample: 'Aa' },
    { name: 'Comic Sans MS', sample: 'Aa' },
    { name: 'Impact', sample: 'Aa' },
    { name: 'Tahoma', sample: 'Aa' }
];

// List of common emojis
const emojis = [
    "😀", "😁", "😂", "🤣", "😃", "😄", "😅", "😆", "😉", "😊", 
    "😋", "😎", "😍", "😘", "🥰", "😗", "😙", "😚", "🙂", "🤗", 
    "🤩", "🤔", "🤨", "😐", "😑", "😶", "🙄", "😏", "😣", "😥"
];

// Character sets for spawn menu
const latinUppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const latinLowercase = "abcdefghijklmnopqrstuvwxyz";
const numbers = "0123456789";
const specialChars = "!@#$%^&*()_+{}|:<>?-=[];',./";
const russianChars = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ";
const moreEmojis = "😀😁😂🤣😃😄😅😆😉😊😋😎😍😘🥰😗😙😚🙂🤗🤩🤔🤨😐😑😶🙄😏😣😥😮😯😪😫😴😌😛😜😝🤤😒😓😔😕🙃🤑😲😌☹️🙁😖😞😟😤😢😭😦😧😨😩🤯😬😰😱😳🤪😵😡😠🤬😷🤒🤕🤢🤮🤧😇🤠🤡🥳🥴🥺🤥🤫🤭🧐";

// Initialize the physics world when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create renderer
    const render = Render.create({
        element: document.getElementById('container'),
        engine: engine,
        options: {
            width: window.innerWidth,
            height: window.innerHeight,
            wireframes: false,
            background: '#f0f0f0'
        }
    });

    // Run the renderer
    Render.run(render);

    // Create runner
    const runner = Runner.create();
    Runner.run(runner, engine);

    // Add mouse control
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: {
                visible: false
            }
        }
    });

    Composite.add(world, mouseConstraint);
    render.mouse = mouse;

    // Function to create letters with physics
    function createPhysicsText() {
        const textContainer = document.getElementById('text-container');
        const text = textContainer.textContent;
        
        // Clear the text container
        textContainer.textContent = '';
        
        // Add walls
        const wallOptions = { 
            isStatic: true,
            render: { 
                fillStyle: 'transparent',
                strokeStyle: 'transparent'
            },
            restitution: 0.9 // Make walls bouncy too
        };
        
        // Ground, left wall, right wall
        Composite.add(world, [
            Bodies.rectangle(window.innerWidth / 2, window.innerHeight, window.innerWidth, 50, wallOptions),
            Bodies.rectangle(0, window.innerHeight / 2, 50, window.innerHeight, wallOptions),
            Bodies.rectangle(window.innerWidth, window.innerHeight / 2, 50, window.innerHeight, wallOptions)
        ]);

        // Create letters with physics
        let offsetX = window.innerWidth / 2 - (text.length * 15) / 2;
        const offsetY = 50;
        
        // Process each character
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            
            if (char === ' ') {
                offsetX += 15;
                continue;
            }
            
            // Create letter div
            const letterElement = document.createElement('div');
            letterElement.classList.add('letter');
            letterElement.textContent = char;
            letterElement.style.color = getRandomColor();
            letterElement.style.fontFamily = currentFont;
            letterElement.style.fontSize = `${currentFontSize}px`;
            document.body.appendChild(letterElement);
            
            // Create physical letter body with extra bounciness
            const letterBody = Bodies.rectangle(
                offsetX + i * 15,
                offsetY,
                20,
                20,
                {
                    restitution: 0.9 + Math.random() * 0.3, // Higher bounciness with some randomness
                    friction: 0.05, // Lower friction to slide more
                    density: 0.8 + Math.random() * 0.4, // Add some random weight variation
                    frictionAir: 0.01, // Lower air friction
                    render: {
                        fillStyle: 'transparent',
                        strokeStyle: 'transparent'
                    }
                }
            );
            
            // Store reference to DOM element in userData to avoid modifying Matter.js objects directly
            letterBody.userData = { element: letterElement, type: 'letter' };
            
            Composite.add(world, letterBody);
        }
    }

    // Function to create different character sets
    function createAllLetterSets() {
        // Create character sets
        createUppercaseLetters();
        createLowercaseLetters();
        createNumbers();
        createSpecialCharacters();
        createRussianAlphabet();
        createEmojis();
    }

    // Function to create emoji characters in the center
    function createEmojis() {
        const emojiContainer = document.getElementById('emoji-container');
        
        // Calculate starting positions to center emojis
        const centerX = window.innerWidth / 2;
        const startY = 150;
        const columns = 6;
        const spacing = 40;
        
        for (let i = 0; i < emojis.length; i++) {
            const emoji = emojis[i];
            
            // Calculate position in a grid layout
            const row = Math.floor(i / columns);
            const col = i % columns;
            const offsetX = (col - Math.floor(columns/2)) * spacing;
            
            // Create emoji div
            const emojiElement = document.createElement('div');
            emojiElement.classList.add('emoji');
            emojiElement.textContent = emoji;
            document.body.appendChild(emojiElement);
            
            // Create physical emoji body
            const emojiBody = Bodies.circle(
                centerX + offsetX,
                startY + row * spacing,
                15,
                {
                    restitution: 0.9,
                    friction: 0.05,
                    density: 0.8,
                    frictionAir: 0.01,
                    render: {
                        fillStyle: 'transparent',
                        strokeStyle: 'transparent'
                    }
                }
            );
            
            // Store reference to DOM element
            emojiBody.userData = { element: emojiElement, type: 'emoji' };
            
            Composite.add(world, emojiBody);
        }
    }

    // Function to create uppercase letters (on right side now)
    function createUppercaseLetters() {
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        
        const startX = window.innerWidth - 50;
        const startY = 50;
        
        createCharacterSet(alphabet, startX, startY, 0, 'uppercase');
    }

    // Function to create lowercase letters (on right side)
    function createLowercaseLetters() {
        const alphabet = "abcdefghijklmnopqrstuvwxyz";
        
        const startX = window.innerWidth - 100;
        const startY = 50;
        
        createCharacterSet(alphabet, startX, startY, 0, 'lowercase');
    }

    // Function to create numbers (on left side)
    function createNumbers() {
        const numbers = "0123456789";
        
        const startX = 50;
        const startY = 50;
        
        createCharacterSet(numbers, startX, startY, 0, 'number');
    }

    // Function to create special characters (on left side)
    function createSpecialCharacters() {
        const specialChars = "!@#$%^&*()_+{}|:<>?-=[];',./";
        
        const startX = 100;
        const startY = 50;
        
        createCharacterSet(specialChars, startX, startY, 0, 'special');
    }

    // Function to create Russian alphabet (on left side)
    function createRussianAlphabet() {
        const russianAlphabet = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ";
        
        const startX = 150;
        const startY = 50;
        
        createCharacterSet(russianAlphabet, startX, startY, 0, 'russian');
    }

    // Generic function to create a set of characters with physics
    function createCharacterSet(chars, startX, startY, offsetX, charClass) {
        for (let i = 0; i < chars.length; i++) {
            const char = chars[i];
            
            // Create letter div
            const letterElement = document.createElement('div');
            letterElement.classList.add('alphabet-letter', charClass);
            letterElement.textContent = char;
            letterElement.style.color = getRandomColor();
            letterElement.style.fontFamily = currentFont;
            letterElement.style.fontSize = `${currentFontSize}px`;
            document.body.appendChild(letterElement);
            
            // Create physical letter body
            const letterBody = Bodies.rectangle(
                startX + offsetX,
                startY + (i * 15),
                20,
                20,
                {
                    restitution: 0.9,
                    friction: 0.05,
                    density: 0.8,
                    frictionAir: 0.01,
                    render: {
                        fillStyle: 'transparent',
                        strokeStyle: 'transparent'
                    }
                }
            );
            
            // Store reference to DOM element
            letterBody.userData = { element: letterElement, type: 'letter' };
            
            Composite.add(world, letterBody);
        }
    }

    // Function to update the position of the letter elements
    function updateLetterPositions() {
        const bodies = Composite.allBodies(world);
        
        bodies.forEach(body => {
            if (body.userData && body.userData.element) {
                const pos = body.position;
                const angle = body.angle;
                body.userData.element.style.left = `${pos.x - 10}px`;
                body.userData.element.style.top = `${pos.y - 10}px`;
                body.userData.element.style.transform = `rotate(${angle}rad)`;
            } else if (body.userData && body.userData.car) {
                const pos = body.position;
                const angle = body.angle;
                const car = body.userData.car;
                car.style.left = `${pos.x - 50}px`;
                car.style.top = `${pos.y - 25}px`;
                car.style.transform = `rotate(${angle}rad)`;
            } else if (body.userData && body.userData.ball) {
                const pos = body.position;
                const ball = body.userData.ball;
                const radius = body.circleRadius;
                ball.style.left = `${pos.x - radius}px`;
                ball.style.top = `${pos.y - radius}px`;
                ball.style.width = `${radius * 2}px`;
                ball.style.height = `${radius * 2}px`;
            } else if (body.userData && body.userData.ragdollPart) {
                const pos = body.position;
                const angle = body.angle;
                const part = body.userData.ragdollPart;
                const width = part.offsetWidth;
                const height = part.offsetHeight;
                part.style.left = `${pos.x - width/2}px`;
                part.style.top = `${pos.y - height/2}px`;
                part.style.transform = `rotate(${angle}rad)`;
            } else if (body.userData && body.userData.trampoline) {
                const pos = body.position;
                const trampoline = body.userData.trampoline;
                trampoline.style.left = `${pos.x - 75}px`;
                trampoline.style.top = `${pos.y - 5}px`;
            } else if (body.userData && body.userData.spring) {
                const pos = body.position;
                const angle = body.angle;
                const spring = body.userData.spring;
                spring.style.left = `${pos.x - 10}px`;
                spring.style.top = `${pos.y - 40}px`;
                spring.style.transform = `rotate(${angle}rad)`;
            } else if (body.userData && body.userData.platform) {
                const pos = body.position;
                const angle = body.angle;
                const platform = body.userData.platform;
                platform.style.left = `${pos.x - 100}px`;
                platform.style.top = `${pos.y - 10}px`;
                platform.style.transform = `rotate(${angle}rad)`;
            } else if (body.userData && body.userData.bubble) {
                const pos = body.position;
                const bubble = body.userData.bubble;
                const radius = body.circleRadius;
                bubble.style.left = `${pos.x - radius}px`;
                bubble.style.top = `${pos.y - radius}px`;
                bubble.style.width = `${radius * 2}px`;
                bubble.style.height = `${radius * 2}px`;
            } else if (body.userData && body.userData.conveyor) {
                const pos = body.position;
                const conveyor = body.userData.conveyor;
                conveyor.style.left = `${pos.x - 150}px`;
                conveyor.style.top = `${pos.y - 10}px`;
            }
        });

        // Apply black hole attraction if active
        if (blackHoleActive && blackHoleAttractor) {
            applyBlackHoleAttraction();
        }
        
        // Apply physics effects
        if (waterEffectActive) {
            applyWaterEffect();
        }
        
        if (windActive) {
            applyWindEffect();
        }
        
        if (letterMagnetActive) {
            applyLetterMagnet();
        }
        
        if (tornadoActive) {
            applyTornadoEffect();
        }
        
        if (blenderActive) {
            applyBlenderEffect();
        }
        
        // If following an object, center the view on it
        if (followingBody && followingBody.userData && followingBody.userData.element) {
            followObject(followingBody);
        }
        
        requestAnimationFrame(updateLetterPositions);
    }

    // Function to spawn a random letter
    function spawnRandomLetter() {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ";
        const randomChar = chars.charAt(Math.floor(Math.random() * chars.length));
        
        // Create letter div
        const letterElement = document.createElement('div');
        letterElement.classList.add('letter');
        letterElement.textContent = randomChar;
        letterElement.style.color = getRandomColor();
        letterElement.style.fontSize = '36px';  // Make it bigger
        letterElement.style.fontFamily = currentFont;
        document.body.appendChild(letterElement);
        
        // Create physical letter body
        const letterBody = Bodies.rectangle(
            window.innerWidth / 2 + (Math.random() * 200 - 100),
            100,
            30,  // Bigger hitbox
            30,
            {
                restitution: 0.9,
                friction: 0.05,
                density: 0.8,
                frictionAir: 0.01,
                render: {
                    fillStyle: 'transparent',
                    strokeStyle: 'transparent'
                }
            }
        );
        
        // Store reference to DOM element
        letterBody.userData = { element: letterElement, type: 'letter' };
        
        Composite.add(world, letterBody);
    }

    // Function to spawn a specific character
    function spawnSpecificCharacter(char) {
        // Create character div
        const letterElement = document.createElement('div');
        letterElement.classList.add('letter');
        letterElement.textContent = char;
        letterElement.style.color = getRandomColor();
        letterElement.style.fontSize = '36px';
        letterElement.style.fontFamily = currentFont;
        document.body.appendChild(letterElement);
        
        // Create physical letter body
        const letterBody = Bodies.rectangle(
            window.innerWidth / 2,
            100,
            30,
            30,
            {
                restitution: 0.9,
                friction: 0.05,
                density: 0.8,
                frictionAir: 0.01,
                render: {
                    fillStyle: 'transparent',
                    strokeStyle: 'transparent'
                }
            }
        );
        
        // Store reference to DOM element
        letterBody.userData = { element: letterElement, type: 'letter' };
        
        Composite.add(world, letterBody);
        
        return letterBody;
    }

    // Function to spawn a random emoji
    function spawnRandomEmoji() {
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        
        // Create emoji div
        const emojiElement = document.createElement('div');
        emojiElement.classList.add('emoji');
        emojiElement.textContent = randomEmoji;
        emojiElement.style.fontSize = '36px';
        document.body.appendChild(emojiElement);
        
        // Create physical emoji body
        const emojiBody = Bodies.circle(
            window.innerWidth / 2 + (Math.random() * 200 - 100),
            100,
            20,
            {
                restitution: 0.9,
                friction: 0.05,
                density: 0.8,
                frictionAir: 0.01,
                render: {
                    fillStyle: 'transparent',
                    strokeStyle: 'transparent'
                }
            }
        );
        
        // Store reference to DOM element
        emojiBody.userData = { element: emojiElement, type: 'emoji' };
        
        Composite.add(world, emojiBody);
    }

    // Toggle gravity functionality
    const gravityButton = document.getElementById('gravity-button');
    gravityButton.addEventListener('click', toggleGravity);
    
    function toggleGravity() {
        if (engine.world.gravity.y === 0) {
            // Restore gravity
            engine.world.gravity.y = defaultGravity;
            gravityButton.textContent = "Zero Gravity";
            gravityButton.innerHTML = '<i class="fas fa-arrow-down"></i> Toggle Gravity';
            gravityButton.classList.remove('active');
        } else {
            // Set zero gravity
            defaultGravity = engine.world.gravity.y;
            engine.world.gravity.y = 0;
            gravityButton.innerHTML = '<i class="fas fa-arrow-down"></i> Restore Gravity';
            gravityButton.classList.add('active');
        }
    }
    
    // Black hole functionality
    const blackholeButton = document.getElementById('blackhole-button');
    blackholeButton.addEventListener('click', toggleBlackHole);
    
    function toggleBlackHole() {
        if (blackHoleActive) {
            // Remove black hole
            removeBlackHole();
            blackholeButton.innerHTML = '<i class="fas fa-circle"></i> Spawn Black Hole';
            blackholeButton.classList.remove('active');
        } else {
            // Spawn black hole
            spawnBlackHole();
            blackholeButton.innerHTML = '<i class="fas fa-circle"></i> Remove Black Hole';
            blackholeButton.classList.add('active');
        }
    }
    
    function spawnBlackHole() {
        // Create visual black hole
        const blackHole = document.createElement('div');
        blackHole.classList.add('black-hole');
        blackHole.id = 'black-hole';
        
        // Position in center
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        blackHole.style.left = `${centerX - 30}px`;
        blackHole.style.top = `${centerY - 30}px`;
        
        document.body.appendChild(blackHole);
        
        // Create physics attractor point
        blackHoleAttractor = { x: centerX, y: centerY, strength: 0.001 };
        blackHoleActive = true;
    }
    
    function removeBlackHole() {
        const blackHole = document.getElementById('black-hole');
        if (blackHole) {
            blackHole.parentNode.removeChild(blackHole);
        }
        
        blackHoleAttractor = null;
        blackHoleActive = false;
    }
    
    function applyBlackHoleAttraction() {
        const bodies = Composite.allBodies(world);
        const center = Vector.create(blackHoleAttractor.x, blackHoleAttractor.y);
        
        bodies.forEach(body => {
            if (!body.isStatic) {
                const direction = Vector.sub(center, body.position);
                const distance = Vector.magnitude(direction);
                
                if (distance < 400) { // Only affect objects within a radius
                    // Calculate force - stronger as objects get closer
                    const force = Vector.mult(
                        Vector.normalise(direction),
                        (0.1 * body.mass * (1 + (400 - distance) / 100))
                    );
                    
                    Body.applyForce(body, body.position, force);
                    
                    // Remove bodies that get too close to the black hole
                    if (distance < 20 && body.userData && body.userData.element) {
                        const element = body.userData.element;
                        if (element.parentNode) {
                            element.parentNode.removeChild(element);
                        }
                        Composite.remove(world, body);
                    }
                }
            }
        });
    }

    // Explode Letters functionality
    document.getElementById('explode-button').addEventListener('click', explodeLetters);
    
    function explodeLetters() {
        const bodies = Composite.allBodies(world);
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        bodies.forEach(body => {
            if (body.userData && (body.userData.type === 'letter' || body.userData.type === 'emoji')) {
                const direction = Vector.sub(body.position, Vector.create(centerX, centerY));
                const distance = Vector.magnitude(direction);
                
                if (distance < 500) { // Only affect objects within a radius
                    const force = Vector.mult(
                        Vector.normalise(direction),
                        (0.1 * body.mass * (1 + (500 - distance) / 100))
                    );
                    
                    Body.applyForce(body, body.position, force);
                }
            }
        });
    }

    // Tornado Effect functionality
    const tornadoButton = document.getElementById('tornado-button');
    tornadoButton.addEventListener('click', toggleTornado);
    
    function toggleTornado() {
        if (tornadoActive) {
            // Remove tornado
            removeTornado();
            tornadoButton.innerHTML = '<i class="fas fa-sync-alt"></i> Tornado Effect';
            tornadoButton.classList.remove('active');
        } else {
            // Create tornado
            createTornado();
            tornadoButton.innerHTML = '<i class="fas fa-sync-alt"></i> Stop Tornado';
            tornadoButton.classList.add('active');
        }
    }
    
    function createTornado() {
        tornadoCenter = { 
            x: window.innerWidth / 2, 
            y: window.innerHeight / 2 
        };
        
        // Create visual tornado
        const tornado = document.createElement('div');
        tornado.classList.add('tornado');
        tornado.id = 'tornado';
        tornado.style.left = `${tornadoCenter.x - 50}px`;
        tornado.style.top = `${tornadoCenter.y - 50}px`;
        document.body.appendChild(tornado);
        
        tornadoActive = true;
    }
    
    function removeTornado() {
        const tornado = document.getElementById('tornado');
        if (tornado) {
            tornado.parentNode.removeChild(tornado);
        }
        
        tornadoActive = false;
    }
    
    function applyTornadoEffect() {
        const bodies = Composite.allBodies(world);
        const center = Vector.create(tornadoCenter.x, tornadoCenter.y);
        
        bodies.forEach(body => {
            if (!body.isStatic) {
                const direction = Vector.sub(center, body.position);
                const distance = Vector.magnitude(direction);
                
                if (distance < 300) { // Only affect objects within a radius
                    // Calculate tangential force (perpendicular to direction to center)
                    const normalDirection = Vector.normalise(direction);
                    const tangent = { x: -normalDirection.y, y: normalDirection.x };
                    
                    // Force strength diminishes with distance
                    const strength = 0.02 * body.mass * (1 - distance / 300);
                    
                    // Also add slight attraction to center
                    const centerForce = Vector.mult(normalDirection, strength * 0.2);
                    
                    // Apply tangential force for spinning effect
                    const spinForce = Vector.mult(tangent, strength);
                    const resultantForce = Vector.add(spinForce, centerForce);
                    
                    Body.applyForce(body, body.position, resultantForce);
                }
            }
        });
    }

    // Letter Rain functionality
    document.getElementById('rain-button').addEventListener('click', createLetterRain);
    
    function createLetterRain() {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ";
        const numLetters = 50;
        
        for (let i = 0; i < numLetters; i++) {
            setTimeout(() => {
                const randomChar = chars.charAt(Math.floor(Math.random() * chars.length));
                
                // Create letter div
                const letterElement = document.createElement('div');
                letterElement.classList.add('letter');
                letterElement.textContent = randomChar;
                letterElement.style.color = getRandomColor();
                letterElement.style.fontFamily = currentFont;
                document.body.appendChild(letterElement);
                
                // Create physical letter body
                const letterBody = Bodies.rectangle(
                    Math.random() * window.innerWidth,
                    -20, // Start above screen
                    20,
                    20,
                    {
                        restitution: 0.9,
                        friction: 0.05,
                        density: 0.8,
                        frictionAir: 0.01,
                        render: {
                            fillStyle: 'transparent',
                            strokeStyle: 'transparent'
                        }
                    }
                );
                
                // Store reference to DOM element
                letterBody.userData = { element: letterElement, type: 'letter' };
                
                Composite.add(world, letterBody);
            }, i * 100); // Stagger the creation for a rain effect
        }
    }

    // Fireworks functionality
    document.getElementById('fireworks-button').addEventListener('click', createFireworks);
    
    function createFireworks() {
        const centerX = window.innerWidth / 2 + (Math.random() * 400 - 200);
        const centerY = window.innerHeight / 2 + (Math.random() * 200 - 100);
        const numParticles = 30;
        const chars = "!@#$%^&*()_+{}|:<>?-=[];',./";
        
        for (let i = 0; i < numParticles; i++) {
            setTimeout(() => {
                const randomChar = chars.charAt(Math.floor(Math.random() * chars.length));
                
                // Create particle div
                const particleElement = document.createElement('div');
                particleElement.classList.add('letter', 'firework');
                particleElement.textContent = randomChar;
                particleElement.style.color = getRandomColor();
                particleElement.style.fontSize = '20px';
                particleElement.style.fontFamily = currentFont;
                document.body.appendChild(particleElement);
                
                // Create particle body
                const particleBody = Bodies.circle(
                    centerX,
                    centerY,
                    10,
                    {
                        restitution: 0.9,
                        friction: 0.05,
                        density: 0.3,
                        frictionAir: 0.01,
                        render: {
                            fillStyle: 'transparent',
                            strokeStyle: 'transparent'
                        }
                    }
                );
                
                // Store reference to DOM element
                particleBody.userData = { 
                    element: particleElement, 
                    type: 'firework',
                    displayName: 'Firework Particle'
                };
                
                Composite.add(world, particleBody);
                
                // Apply explosive force in random direction
                const angle = Math.random() * Math.PI * 2;
                const magnitude = 0.02 + Math.random() * 0.03;
                const force = {
                    x: Math.cos(angle) * magnitude,
                    y: Math.sin(angle) * magnitude
                };
                
                Body.applyForce(particleBody, particleBody.position, force);
                
                // Remove after a few seconds
                setTimeout(() => {
                    if (particleElement.parentNode) {
                        particleElement.parentNode.removeChild(particleElement);
                    }
                    Composite.remove(world, particleBody);
                }, 3000);
            }, i * 20); // Slight delay for visual effect
        }
    }

    // Resize Letters functionality
    document.getElementById('resize-button').addEventListener('click', resizeLetters);
    
    function resizeLetters() {
        const bodies = Composite.allBodies(world);
        
        bodies.forEach(body => {
            if (body.userData && (body.userData.type === 'letter' || body.userData.type === 'emoji')) {
                const element = body.userData.element;
                const newSize = 20 + Math.random() * 40;
                element.style.fontSize = `${newSize}px`;
                
                // Also resize the physics body if needed
                if (body.circleRadius) {
                    // For circular bodies like emojis
                    Body.scale(body, newSize / body.circleRadius, newSize / body.circleRadius);
                } else {
                    // For rectangular bodies like letters
                    const scaleX = newSize / 20;
                    const scaleY = newSize / 20;
                    Body.scale(body, scaleX, scaleY);
                }
            }
        });
    }

    // Reverse Gravity functionality
    document.getElementById('reverse-gravity-button').addEventListener('click', reverseGravity);
    
    function reverseGravity() {
        engine.world.gravity.y = -engine.world.gravity.y;
    }

    // Letter Magnet functionality
    const magnetButton = document.getElementById('magnet-button');
    magnetButton.addEventListener('click', toggleLetterMagnet);
    
    function toggleLetterMagnet() {
        if (letterMagnetActive) {
            letterMagnetActive = false;
            magnetButton.innerHTML = '<i class="fas fa-magnet"></i> Letter Magnet';
            magnetButton.classList.remove('active');
        } else {
            letterMagnetActive = true;
            magnetButton.innerHTML = '<i class="fas fa-magnet"></i> Stop Magnet';
            magnetButton.classList.add('active');
        }
    }
    
    function applyLetterMagnet() {
        const bodies = Composite.allBodies(world);
        
        for (let i = 0; i < bodies.length; i++) {
            const bodyA = bodies[i];
            
            if (!bodyA.isStatic && bodyA.userData && 
                (bodyA.userData.type === 'letter' || bodyA.userData.type === 'emoji')) {
                
                for (let j = i + 1; j < bodies.length; j++) {
                    const bodyB = bodies[j];
                    
                    if (!bodyB.isStatic && bodyB.userData && 
                        (bodyB.userData.type === 'letter' || bodyB.userData.type === 'emoji')) {
                        
                        const direction = Vector.sub(bodyB.position, bodyA.position);
                        const distance = Vector.magnitude(direction);
                        
                        if (distance < 100 && distance > 0) {
                            const force = Vector.mult(
                                Vector.normalise(direction),
                                0.0001 * bodyA.mass * bodyB.mass * (1 - distance / 100)
                            );
                            
                            Body.applyForce(bodyA, bodyA.position, force);
                            Body.applyForce(bodyB, bodyB.position, Vector.neg(force));
                        }
                    }
                }
            }
        }
    }

    // Spawn Trampoline functionality
    document.getElementById('trampoline-button').addEventListener('click', spawnTrampoline);
    
    function spawnTrampoline() {
        // Create trampoline element
        const trampolineElement = document.createElement('div');
        trampolineElement.classList.add('trampoline');
        trampolineElement.innerHTML = `
            <svg width="150" height="10" viewBox="0 0 150 10">
                <rect width="150" height="10" fill="#ff9800" rx="5" />
            </svg>
        `;
        document.body.appendChild(trampolineElement);
        
        // Create trampoline physics body
        const trampolineBody = Bodies.rectangle(
            window.innerWidth / 2 + (Math.random() * 400 - 200),
            window.innerHeight / 2 + (Math.random() * 200 - 100),
            150,
            10,
            {
                restitution: 1.5, // Super bouncy
                isStatic: true,
                render: {
                    fillStyle: 'transparent',
                    strokeStyle: 'transparent'
                }
            }
        );
        
        // Store reference to DOM element
        trampolineBody.userData = { 
            trampoline: trampolineElement,
            type: 'trampoline',
            displayName: 'Trampoline'
        };
        
        Composite.add(world, trampolineBody);
    }

    // Spawn Spring functionality
    document.getElementById('spring-button').addEventListener('click', spawnSpring);
    
    function spawnSpring() {
        // Create spring element
        const springElement = document.createElement('div');
        springElement.classList.add('spring');
        springElement.innerHTML = `
            <svg width="20" height="80" viewBox="0 0 20 80">
                <rect width="20" height="80" fill="#8e44ad" rx="5" />
                <line x1="10" y1="5" x2="10" y2="75" stroke="#ffffff" stroke-width="2" stroke-dasharray="5,5" />
            </svg>
        `;
        document.body.appendChild(springElement);
        
        // Create spring physics body
        const springX = window.innerWidth / 2 + (Math.random() * 400 - 200);
        const springY = window.innerHeight / 2 + (Math.random() * 200 - 100);
        
        const springBody = Bodies.rectangle(
            springX,
            springY,
            20,
            80,
            {
                restitution: 2.0, // Extremely bouncy
                friction: 0.01,
                frictionAir: 0.01,
                render: {
                    fillStyle: 'transparent',
                    strokeStyle: 'transparent'
                }
            }
        );
        
        // Store reference to DOM element
        springBody.userData = { 
            spring: springElement,
            type: 'spring',
            displayName: 'Spring'
        };
        
        Composite.add(world, springBody);
        
        // Constraint to fix the spring in place but allow it to rotate
        const constraint = Constraint.create({
            pointA: { x: springX, y: springY },
            bodyB: springBody,
            pointB: { x: 0, y: 0 },
            stiffness: 0.8,
            length: 0
        });
        
        Composite.add(world, constraint);
    }

    // Freeze Letters functionality - Modified to handle dragging
    const freezeButton = document.getElementById('freeze-button');
    freezeButton.addEventListener('click', toggleFreezeLetters);
    
    function toggleFreezeLetters() {
        if (lettersFrozen) {
            // Unfreeze all letters
            const bodies = Composite.allBodies(world);
            
            bodies.forEach(body => {
                if (body.userData && (body.userData.type === 'letter' || body.userData.type === 'emoji')) {
                    Body.setStatic(body, false);
                    if (body.userData.element) {
                        body.userData.element.classList.remove('draggable');
                    }
                }
            });
            
            lettersFrozen = false;
            freezeButton.innerHTML = '<i class="far fa-snowflake"></i> Freeze Letters';
            freezeButton.classList.remove('active');
            
            // Remove event listeners for drag functionality
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
        } else {
            // Freeze all letters
            const bodies = Composite.allBodies(world);
            
            bodies.forEach(body => {
                if (body.userData && (body.userData.type === 'letter' || body.userData.type === 'emoji')) {
                    Body.setStatic(body, true);
                    if (body.userData.element) {
                        body.userData.element.classList.add('draggable');
                    }
                }
            });
            
            lettersFrozen = true;
            freezeButton.innerHTML = '<i class="far fa-snowflake"></i> Unfreeze Letters';
            freezeButton.classList.add('active');
            
            // Add event listeners for drag functionality
            document.addEventListener('mousedown', handleMouseDown);
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.addEventListener('touchstart', handleTouchStart, { passive: false });
            document.addEventListener('touchmove', handleTouchMove, { passive: false });
            document.addEventListener('touchend', handleTouchEnd);
        }
    }
    
    // Handle mouse down for dragging frozen elements
    function handleMouseDown(e) {
        if (!lettersFrozen) return;
        
        const element = getElementUnderPointer(e.clientX, e.clientY);
        if (!element) return;
        
        const body = findBodyByElement(element);
        if (body) {
            draggingFrozenElement = body;
            const rect = element.getBoundingClientRect();
            dragOffset = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
            e.preventDefault();
        }
    }
    
    // Handle mouse move for dragging frozen elements
    function handleMouseMove(e) {
        if (!draggingFrozenElement) return;
        
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        
        // Update the body position
        Body.setPosition(draggingFrozenElement, {
            x: newX + 10, // Center adjustment
            y: newY + 10
        });
        
        e.preventDefault();
    }
    
    // Handle mouse up to stop dragging
    function handleMouseUp() {
        draggingFrozenElement = null;
    }
    
    // Touch event handlers for mobile devices
    function handleTouchStart(e) {
        if (!lettersFrozen || e.touches.length !== 1) return;
        
        const touch = e.touches[0];
        const element = getElementUnderPointer(touch.clientX, touch.clientY);
        if (!element) return;
        
        const body = findBodyByElement(element);
        if (body) {
            draggingFrozenElement = body;
            const rect = element.getBoundingClientRect();
            dragOffset = {
                x: touch.clientX - rect.left,
                y: touch.clientY - rect.top
            };
            e.preventDefault();
        }
    }
    
    function handleTouchMove(e) {
        if (!draggingFrozenElement || e.touches.length !== 1) return;
        
        const touch = e.touches[0];
        const newX = touch.clientX - dragOffset.x;
        const newY = touch.clientY - dragOffset.y;
        
        // Update the body position
        Body.setPosition(draggingFrozenElement, {
            x: newX + 10, // Center adjustment
            y: newY + 10
        });
        
        e.preventDefault();
    }
    
    function handleTouchEnd() {
        draggingFrozenElement = null;
    }
    
    // Helper function to find element under pointer
    function getElementUnderPointer(x, y) {
        const elements = document.elementsFromPoint(x, y);
        for (const el of elements) {
            if (el.classList.contains('letter') || el.classList.contains('emoji') || 
                el.classList.contains('alphabet-letter')) {
                return el;
            }
        }
        return null;
    }
    
    // Find physics body associated with DOM element
    function findBodyByElement(element) {
        const bodies = Composite.allBodies(world);
        for (const body of bodies) {
            if (body.userData && body.userData.element === element) {
                return body;
            }
        }
        return null;
    }

    // Create the custom text input modal
    function createCustomTextModal() {
        const modal = document.createElement('div');
        modal.id = 'custom-text-modal';
        modal.className = 'modal';
        
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Enter Custom Text</h2>
                <p>What text would you like to see falling?</p>
                <input type="text" id="custom-text-input" placeholder="Enter your text here">
                <div class="modal-buttons">
                    <button id="cancel-custom-text" class="btn-gray">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                    <button id="submit-custom-text" class="btn-green">
                        <i class="fas fa-check"></i> Add Text
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Event listeners for modal buttons
        document.getElementById('cancel-custom-text').addEventListener('click', closeCustomTextModal);
        document.getElementById('submit-custom-text').addEventListener('click', addCustomText);
        
        // Allow pressing Enter to submit
        document.getElementById('custom-text-input').addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                addCustomText();
            }
        });
    }
    
    // Open the custom text modal
    function openCustomTextModal() {
        const modal = document.getElementById('custom-text-modal');
        modal.style.display = 'block';
        document.getElementById('custom-text-input').focus();
    }
    
    // Close the custom text modal
    function closeCustomTextModal() {
        const modal = document.getElementById('custom-text-modal');
        modal.style.display = 'none';
    }
    
    // Add custom text from the modal input
    function addCustomText() {
        const textInput = document.getElementById('custom-text-input').value.trim();
        
        if (textInput) {
            createFallingText(textInput);
            closeCustomTextModal();
            document.getElementById('custom-text-input').value = '';
        }
    }
    
    // Create falling text from input
    function createFallingText(text) {
        const startX = window.innerWidth / 2 - (text.length * 15) / 2;
        const startY = 50;
        
        // Process each character
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            
            if (char === ' ') {
                continue; // Skip spaces
            }
            
            // Create letter div
            const letterElement = document.createElement('div');
            letterElement.classList.add('letter');
            letterElement.textContent = char;
            letterElement.style.color = getRandomColor();
            letterElement.style.fontSize = '24px';
            letterElement.style.fontFamily = currentFont;
            document.body.appendChild(letterElement);
            
            // Create physical letter body
            const letterBody = Bodies.rectangle(
                startX + i * 15,
                startY,
                20,
                20,
                {
                    restitution: 0.9 + Math.random() * 0.3,
                    friction: 0.05,
                    density: 0.8 + Math.random() * 0.4,
                    frictionAir: 0.01,
                    render: {
                        fillStyle: 'transparent',
                        strokeStyle: 'transparent'
                    }
                }
            );
            
            // Store reference to DOM element
            letterBody.userData = { element: letterElement, type: 'letter' };
            
            Composite.add(world, letterBody);
        }
    }

    // Add Custom Text button functionality
    document.getElementById('custom-text-button').addEventListener('click', openCustomTextModal);

    // Spawn Platform functionality
    document.getElementById('platform-button').addEventListener('click', spawnPlatform);
    
    function spawnPlatform() {
        // Create platform element
        const platformElement = document.createElement('div');
        platformElement.classList.add('platform');
        platformElement.innerHTML = `
            <svg width="200" height="20" viewBox="0 0 200 20">
                <rect width="200" height="20" fill="#2ecc71" rx="5" />
            </svg>
        `;
        document.body.appendChild(platformElement);
        
        // Create platform physics body
        const platformBody = Bodies.rectangle(
            window.innerWidth / 2 + (Math.random() * 400 - 200),
            window.innerHeight / 2 + (Math.random() * 200 - 100),
            200,
            20,
            {
                restitution: 0.3,
                friction: 0.05,
                frictionAir: 0.01,
                density: 0.1,
                render: {
                    fillStyle: 'transparent',
                    strokeStyle: 'transparent'
                }
            }
        );
        
        // Store reference to DOM element
        platformBody.userData = { 
            platform: platformElement,
            type: 'platform',
            displayName: 'Platform'
        };
        
        Composite.add(world, platformBody);
    }

    // Spawn Chain functionality
    document.getElementById('chain-button').addEventListener('click', spawnChain);
    
    function spawnChain() {
        const chainLength = 10;
        const startX = window.innerWidth / 2 + (Math.random() * 200 - 100);
        const startY = 50;
        const letters = "CHAIN";
        
        let previousBody = null;
        const chainBodies = [];
        const constraints = [];
        
        for (let i = 0; i < chainLength; i++) {
            // Create letter element
            const letterElement = document.createElement('div');
            letterElement.classList.add('letter', 'chain-link');
            letterElement.textContent = letters[i % letters.length];
            letterElement.style.color = getRandomColor();
            letterElement.style.fontSize = '24px';
            letterElement.style.fontFamily = currentFont;
            document.body.appendChild(letterElement);
            
            // Create physics body
            const letterBody = Bodies.circle(
                startX,
                startY + i * 30,
                15,
                {
                    restitution: 0.8,
                    friction: 0.05,
                    density: 0.1,
                    frictionAir: 0.01,
                    render: {
                        fillStyle: 'transparent',
                        strokeStyle: 'transparent'
                    }
                }
            );
            
            // Store reference to DOM element
            letterBody.userData = { 
                element: letterElement, 
                type: 'chain',
                displayName: 'Chain Link'
            };
            
            chainBodies.push(letterBody);
        }
        
        // Create constraint to previous body
        for (let i = 1; i < chainLength; i++) {
            const constraint = Constraint.create({
                bodyA: chainBodies[i-1],
                bodyB: chainBodies[i],
                pointA: { x: 0, y: 15 },
                pointB: { x: 0, y: -15 },
                stiffness: 0.8,
                render: {
                    visible: true,
                    lineWidth: 2,
                    strokeStyle: '#666'
                }
            });
            
            constraints.push(constraint);
        }
        
        // Add anchor constraint for the first body
        const anchor = Constraint.create({
            pointA: { x: startX, y: startY },
            bodyB: chainBodies[0],
            pointB: { x: 0, y: -15 },
            stiffness: 0.8,
            render: {
                visible: true,
                lineWidth: 2,
                strokeStyle: '#666'
            }
        });
        
        constraints.push(anchor);
        
        // Add all bodies and constraints to the world
        Composite.add(world, [...chainBodies, ...constraints]);
    }

    // Spawn Bubble functionality
    document.getElementById('bubble-button').addEventListener('click', spawnBubbles);
    
    function spawnBubbles() {
        const numBubbles = 10;
        
        for (let i = 0; i < numBubbles; i++) {
            setTimeout(() => {
                // Create bubble element
                const bubbleElement = document.createElement('div');
                bubbleElement.classList.add('bubble');
                document.body.appendChild(bubbleElement);
                
                const radius = 20 + Math.random() * 30;
                const startX = Math.random() * window.innerWidth;
                
                // Create bubble physics body
                const bubbleBody = Bodies.circle(
                    startX,
                    window.innerHeight + radius,
                    radius,
                    {
                        restitution: 0.8,
                        friction: 0.001,
                        frictionAir: 0.001,
                        density: 0.0005, // Very low density to float up
                        render: {
                            fillStyle: 'transparent',
                            strokeStyle: 'transparent'
                        }
                    }
                );
                
                // Store reference to DOM element
                bubbleBody.userData = { 
                    bubble: bubbleElement,
                    type: 'bubble',
                    displayName: 'Bubble'
                };
                bubbleBody.circleRadius = radius;
                
                Composite.add(world, bubbleBody);
                
                // Apply upward force
                Body.applyForce(bubbleBody, bubbleBody.position, {
                    x: 0,
                    y: -0.001 * bubbleBody.mass
                });
                
                // Remove after it leaves the top of the screen
                setTimeout(() => {
                    if (bubbleElement.parentNode) {
                        bubbleElement.parentNode.removeChild(bubbleElement);
                    }
                    Composite.remove(world, bubbleBody);
                }, 10000);
            }, i * 300);
        }
    }

    // Letter Blender functionality
    const blenderButton = document.getElementById('blender-button');
    blenderButton.addEventListener('click', toggleBlender);
    
    function toggleBlender() {
        if (blenderActive) {
            // Remove blender
            removeBlender();
            blenderButton.innerHTML = '<i class="fas fa-blender"></i> Letter Blender';
            blenderButton.classList.remove('active');
        } else {
            // Create blender
            createBlender();
            blenderButton.innerHTML = '<i class="fas fa-blender"></i> Stop Blender';
            blenderButton.classList.add('active');
        }
    }
    
    function createBlender() {
        blenderCenter = { 
            x: window.innerWidth / 2, 
            y: window.innerHeight / 2 
        };
        
        // Create visual blender
        const blender = document.createElement('div');
        blender.classList.add('blender');
        blender.id = 'blender';
        blender.style.left = `${blenderCenter.x - 100}px`;
        blender.style.top = `${blenderCenter.y - 100}px`;
        document.body.appendChild(blender);
        
        blenderActive = true;
    }
    
    function removeBlender() {
        const blender = document.getElementById('blender');
        if (blender) {
            blender.parentNode.removeChild(blender);
        }
        
        blenderActive = false;
    }
    
    function applyBlenderEffect() {
        const bodies = Composite.allBodies(world);
        const center = Vector.create(blenderCenter.x, blenderCenter.y);
        
        bodies.forEach(body => {
            if (!body.isStatic) {
                const direction = Vector.sub(center, body.position);
                const distance = Vector.magnitude(direction);
                
                if (distance < 100) { // Only affect objects within the blender radius
                    // Calculate tangential force (perpendicular to direction to center)
                    const normalDirection = Vector.normalise(direction);
                    const tangent = { x: -normalDirection.y, y: normalDirection.x };
                    
                    // Force strength is highest at edge, decreases toward center
                    const strength = 0.1 * body.mass * (distance / 100);
                    
                    // Apply tangential force for spinning effect
                    const spinForce = Vector.mult(tangent, strength);
                    
                    Body.applyForce(body, body.position, spinForce);
                    
                    // Also add high angular velocity
                    Body.setAngularVelocity(body, body.angularVelocity * 1.05);
                }
            }
        });
    }

    // Spawn Conveyor functionality
    document.getElementById('conveyor-button').addEventListener('click', spawnConveyor);
    
    function spawnConveyor() {
        // Create conveyor element
        const conveyorElement = document.createElement('div');
        conveyorElement.classList.add('conveyor');
        conveyorElement.innerHTML = `
            <svg width="300" height="20" viewBox="0 0 300 20">
                <rect width="300" height="20" fill="#3498db" rx="5" />
                <line x1="0" y1="10" x2="300" y2="10" stroke="#ffffff" stroke-width="2" stroke-dasharray="10,10">
                    <animateTransform attributeName="transform" type="translate" from="0 0" to="100 0" dur="1s" repeatCount="indefinite" />
                </line>
            </svg>
        `;
        document.body.appendChild(conveyorElement);
        
        // Create conveyor physics body
        const conveyorBody = Bodies.rectangle(
            window.innerWidth / 2,
            window.innerHeight - 100 + Math.random() * 50,
            300,
            20,
            {
                isStatic: true,
                render: {
                    fillStyle: 'transparent',
                    strokeStyle: 'transparent'
                }
            }
        );
        
        // Store reference to DOM element
        conveyorBody.userData = { 
            conveyor: conveyorElement,
            type: 'conveyor',
            displayName: 'Conveyor'
        };
        
        Composite.add(world, conveyorBody);
        
        // Set up collision handling for conveyor effect
        Events.on(engine, 'collisionStart', function(event) {
            const pairs = event.pairs;
            
            pairs.forEach(function(pair) {
                if (pair.bodyA === conveyorBody || pair.bodyB === conveyorBody) {
                    const otherBody = pair.bodyA === conveyorBody ? pair.bodyB : pair.bodyA;
                    
                    // Apply horizontal force to object on conveyor
                    Body.applyForce(otherBody, otherBody.position, {
                        x: 0.001,
                        y: 0
                    });
                }
            });
        });
        
        // Also apply force during active collisions
        Events.on(engine, 'collisionActive', function(event) {
            const pairs = event.pairs;
            
            pairs.forEach(function(pair) {
                if (pair.bodyA === conveyorBody || pair.bodyB === conveyorBody) {
                    const otherBody = pair.bodyA === conveyorBody ? pair.bodyB : pair.bodyA;
                    
                    // Apply horizontal force to object on conveyor
                    Body.applyForce(otherBody, otherBody.position, {
                        x: 0.0005,
                        y: 0
                    });
                }
            });
        });
    }

    // Spawn Wind functionality
    const windButton = document.getElementById('wind-button');
    windButton.addEventListener('click', toggleWind);
    
    function toggleWind() {
        if (windActive) {
            // Stop wind
            windActive = false;
            windButton.innerHTML = '<i class="fas fa-wind"></i> Spawn Wind';
            windButton.classList.remove('active');
            
            // Remove wind indicator
            const windIndicator = document.getElementById('wind-indicator');
            if (windIndicator) {
                windIndicator.parentNode.removeChild(windIndicator);
            }
        } else {
            // Start wind
            windActive = true;
            
            // Random wind direction
            const angle = Math.random() * Math.PI * 2;
            windDirection = {
                x: Math.cos(angle) * 0.0003,
                y: Math.sin(angle) * 0.0003
            };
            
            // Create wind indicator
            const windIndicator = document.createElement('div');
            windIndicator.id = 'wind-indicator';
            windIndicator.classList.add('wind-indicator');
            windIndicator.style.transform = `rotate(${angle}rad)`;
            document.body.appendChild(windIndicator);
            
            windButton.innerHTML = '<i class="fas fa-wind"></i> Stop Wind';
            windButton.classList.add('active');
        }
    }
    
    function applyWindEffect() {
        const bodies = Composite.allBodies(world);
        
        bodies.forEach(body => {
            if (!body.isStatic) {
                Body.applyForce(body, body.position, {
                    x: windDirection.x * body.mass,
                    y: windDirection.y * body.mass
                });
            }
        });
    }

    // Letter Tower functionality - Fixed to use proper async function
    document.getElementById('tower-button').addEventListener('click', createLetterTower);
    
    function createLetterTower() {
        const chars = "TOWER";
        const towerHeight = 15;
        const centerX = window.innerWidth / 2;
        const bottomY = window.innerHeight - 50;
        const blockSize = 30;
        
        (async function buildTower() {
            for (let row = 0; row < towerHeight; row++) {
                for (let col = 0; col < 3; col++) {
                    const char = chars[Math.floor(Math.random() * chars.length)];
                    
                    // Create letter element
                    const letterElement = document.createElement('div');
                    letterElement.classList.add('letter', 'tower-block');
                    letterElement.textContent = char;
                    letterElement.style.color = getRandomColor();
                    letterElement.style.backgroundColor = 'rgba(255,255,255,0.7)';
                    letterElement.style.fontFamily = currentFont;
                    document.body.appendChild(letterElement);
                    
                    // Create physics body - staggered layout
                    const xPos = centerX + (col - 1) * blockSize;
                    const yPos = bottomY - row * blockSize;
                    
                    const letterBody = Bodies.rectangle(
                        xPos,
                        yPos,
                        blockSize,
                        blockSize,
                        {
                            restitution: 0.3,
                            friction: 0.5, // Higher friction for stable stacking
                            density: 0.1,
                            frictionAir: 0.01,
                            render: {
                                fillStyle: 'transparent',
                                strokeStyle: 'transparent'
                            }
                        }
                    );
                    
                    // Store reference to DOM element
                    letterBody.userData = { 
                        element: letterElement, 
                        type: 'tower',
                        displayName: 'Tower Block'
                    };
                    
                    Composite.add(world, letterBody);
                    
                    // Short delay to allow physics to settle
                    await new Promise(resolve => setTimeout(resolve, 50));
                }
            }
        })();
    }

    // Clear All functionality
    document.getElementById('clear-all-button').addEventListener('click', clearAll);
    
    function clearAll() {
        if (clearWallActive) return; // Prevent multiple walls
        clearWallActive = true;
        
        // Create wall element
        const wallElement = document.createElement('div');
        wallElement.classList.add('clear-wall');
        wallElement.style.width = '50px';
        wallElement.style.height = window.innerHeight + 'px';
        wallElement.style.right = '0';
        wallElement.style.top = '0';
        
        // Add text to the wall
        const wallText = document.createElement('div');
        wallText.classList.add('clear-wall-text');
        wallText.textContent = 'CLEARING ALL';
        wallElement.appendChild(wallText);
        
        document.body.appendChild(wallElement);
        
        // Create wall physics body
        const wallBody = Bodies.rectangle(
            window.innerWidth + 25, // Start just off-screen to the right
            window.innerHeight / 2,
            50,
            window.innerHeight,
            {
                isStatic: true,
                friction: 0,
                restitution: 0.2,
                render: {
                    fillStyle: 'transparent',
                    strokeStyle: 'transparent'
                }
            }
        );
        
        Composite.add(world, wallBody);
        
        // Set up animation for wall movement
        let position = window.innerWidth + 25;
        const speed = 10; // pixels per frame
        const leftBoundary = -100; // Where the wall disappears
        let objectsRemaining = true;
        
        function animateWall() {
            if (!clearWallActive) return;
            
            // Move wall to the left
            position -= speed;
            Body.setPosition(wallBody, {
                x: position,
                y: window.innerHeight / 2
            });
            
            // Update visual element
            wallElement.style.right = (window.innerWidth - position - 25) + 'px';
            
            // Check if all objects are pushed off screen
            if (position < window.innerWidth / 2 && objectsRemaining) {
                objectsRemaining = false;
                
                // Check for any remaining objects
                const bodies = Composite.allBodies(world);
                bodies.forEach(body => {
                    if (!body.isStatic && body !== wallBody) {
                        // Mark if any non-wall bodies remain
                        if (body.position.x > 0) {
                            objectsRemaining = true;
                        }
                        
                        // Remove bodies that are off-screen to the left
                        if (body.position.x < -50) {
                            if (body.userData && body.userData.element) {
                                // Remove DOM element
                                const element = body.userData.element || 
                                               body.userData.car || 
                                               body.userData.ball || 
                                               body.userData.ragdollPart ||
                                               body.userData.trampoline ||
                                               body.userData.spring ||
                                               body.userData.platform ||
                                               body.userData.bubble ||
                                               body.userData.conveyor;
                                
                                if (element && element.parentNode) {
                                    element.parentNode.removeChild(element);
                                }
                            }
                            Composite.remove(world, body);
                        }
                    }
                });
            }
            
            // Check if wall has reached left side
            if (position <= leftBoundary) {
                // Final cleanup - remove any remaining objects
                const bodies = Composite.allBodies(world);
                bodies.forEach(body => {
                    if (!body.isStatic && body !== wallBody) {
                        if (body.userData && body.userData.element) {
                            // Remove DOM element
                            const element = body.userData.element || 
                                           body.userData.car || 
                                           body.userData.ball || 
                                           body.userData.ragdollPart ||
                                           body.userData.trampoline ||
                                           body.userData.spring ||
                                           body.userData.platform ||
                                           body.userData.bubble ||
                                           body.userData.conveyor;
                            
                            if (element && element.parentNode) {
                                element.parentNode.removeChild(element);
                            }
                        }
                        Composite.remove(world, body);
                    }
                });
                
                // Remove wall
                Composite.remove(world, wallBody);
                if (wallElement.parentNode) {
                    wallElement.parentNode.removeChild(wallElement);
                }
                
                // Reset flag
                clearWallActive = false;
                
                // Clean up any effects too
                if (blackHoleActive) removeBlackHole();
                if (tornadoActive) removeTornado();
                if (blenderActive) removeBlender();
                
                return; // Stop animation
            }
            
            requestAnimationFrame(animateWall);
        }
        
        // Start animation
        animateWall();
    }

    // Respawn all letters functionality
    document.getElementById('respawn-button').addEventListener('click', respawnAllLetters);
    
    function respawnAllLetters() {
        // First clear existing letters
        const bodies = Composite.allBodies(world);
        bodies.forEach(body => {
            if (body.userData && (body.userData.type === 'letter' || body.userData.type === 'emoji')) {
                if (body.userData.element && body.userData.element.parentNode) {
                    body.userData.element.parentNode.removeChild(body.userData.element);
                }
                Composite.remove(world, body);
            }
        });
        
        // Recreate all letter sets
        createPhysicsText();
        createAllLetterSets();
    }

    // Toggle ribbon visibility
    document.getElementById('toggle-ribbon-button').addEventListener('click', toggleRibbonVisibility);
    
    function toggleRibbonVisibility() {
        const ribbon = document.getElementById('ribbon');
        const toggleButton = document.getElementById('toggle-ribbon-button');
        const icon = toggleButton.querySelector('i');
        
        ribbonVisible = !ribbonVisible;
        
        if (ribbonVisible) {
            ribbon.classList.remove('hidden');
            icon.className = 'fas fa-eye';
        } else {
            ribbon.classList.add('hidden');
            icon.className = 'fas fa-eye-slash';
        }
    }

    // Ribbon tab switching
    const tabButtons = document.querySelectorAll('.tab-button');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all tabs and contents
            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab
            button.classList.add('active');
            
            // Show corresponding content
            const tabId = button.getAttribute('data-tab');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
    
    // Button search functionality
    const searchInput = document.getElementById('button-search');
    
    searchInput.addEventListener('input', searchButtons);
    
    function searchButtons() {
        const searchText = searchInput.value.toLowerCase();
        const allButtons = document.querySelectorAll('.ribbon-content button');
        
        // Remove highlights from all buttons
        allButtons.forEach(button => {
            button.classList.remove('button-highlighted');
        });
        
        if (searchText.trim() === '') return;
        
        // Find and highlight matching buttons
        allButtons.forEach(button => {
            const buttonText = button.textContent.toLowerCase();
            
            if (buttonText.includes(searchText)) {
                button.classList.add('button-highlighted');
                
                // Show the tab containing the matching button
                const tabContent = button.closest('.tab-content');
                if (tabContent && !tabContent.classList.contains('active')) {
                    // Find and activate the corresponding tab
                    const tabId = tabContent.id.replace('-tab', '');
                    document.querySelectorAll('.tab-button').forEach(btn => {
                        btn.classList.remove('active');
                        if (btn.getAttribute('data-tab') === tabId) {
                            btn.classList.add('active');
                        }
                    });
                    
                    // Show the tab content
                    document.querySelectorAll('.tab-content').forEach(content => {
                        content.classList.remove('active');
                    });
                    tabContent.classList.add('active');
                }
            }
        });
    }

    // WORST SONG EVER button functionality
    document.getElementById('worst-song-button').addEventListener('click', playWorstSong);
    
    function playWorstSong() {
        const audioElement = document.getElementById('worst-song');
        
        // Create music playing indicator
        const musicIndicator = document.createElement('div');
        musicIndicator.classList.add('music-playing');
        musicIndicator.innerHTML = `
            <div class="equalizer">
                <div class="bar"></div>
                <div class="bar"></div>
                <div class="bar"></div>
                <div class="bar"></div>
            </div>
            <span>Playing: KSI - Thick Of It</span>
        `;
        document.body.appendChild(musicIndicator);
        
        // Disable the button to prevent multiple clicks
        const songButton = document.getElementById('worst-song-button');
        songButton.disabled = true;
        songButton.innerHTML = '<i class="fas fa-music"></i> PLAYING...';
        
        // Play the song
        audioElement.volume = 0.7;
        audioElement.play();
        
        // After 5 seconds, force all letters to the left
        setTimeout(() => {
            forceLettersLeft();
            songButton.innerHTML = '<i class="fas fa-music"></i> CLEARING SOON...';
        }, 5000);
        
        // After 7 seconds total (2 more seconds), clear everything and stop song
        setTimeout(() => {
            clearAll();
            
            // After everything is cleared, stop the song with a fade out
            const fadeInterval = setInterval(() => {
                if (audioElement.volume > 0.05) {
                    audioElement.volume -= 0.05;
                } else {
                    audioElement.pause();
                    audioElement.currentTime = 0;
                    audioElement.volume = 0.7;
                    clearInterval(fadeInterval);
                    
                    // Re-enable the button
                    songButton.disabled = false;
                    songButton.innerHTML = '<i class="fas fa-music"></i> WORST SONG EVER';
                    
                    // Remove the music indicator
                    if (musicIndicator.parentNode) {
                        musicIndicator.parentNode.removeChild(musicIndicator);
                    }
                }
            }, 100);
        }, 7000);
    }
    
    function forceLettersLeft() {
        const bodies = Composite.allBodies(world);
        
        bodies.forEach(body => {
            if (!body.isStatic) {
                // Apply a strong force to the left
                Body.applyForce(body, body.position, {
                    x: -0.1 * body.mass,
                    y: 0
                });
            }
        });
    }

    // List All Objects functionality 
    document.getElementById('list-button').addEventListener('click', openObjectsList);
    
    function createObjectsListModal() {
        // Create modal element if it doesn't exist
        if (!document.getElementById('objects-list-modal')) {
            const modal = document.createElement('div');
            modal.id = 'objects-list-modal';
            modal.className = 'modal';
            
            modal.innerHTML = `
                <div class="modal-content list-modal">
                    <h2><i class="fas fa-list"></i> Objects in Scene</h2>
                    <div id="objects-list-container"></div>
                    <div class="modal-buttons">
                        <button id="close-objects-list" class="btn-gray">
                            <i class="fas fa-times"></i> Close
                        </button>
                        <button id="refresh-objects-list" class="btn-blue">
                            <i class="fas fa-sync"></i> Refresh List
                        </button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Add event listeners
            document.getElementById('close-objects-list').addEventListener('click', closeObjectsList);
            document.getElementById('refresh-objects-list').addEventListener('click', refreshObjectsList);
        }
    }
    
    function openObjectsList() {
        createObjectsListModal();
        const modal = document.getElementById('objects-list-modal');
        modal.style.display = 'block';
        populateObjectsList();
    }
    
    function closeObjectsList() {
        const modal = document.getElementById('objects-list-modal');
        modal.style.display = 'none';
    }
    
    function refreshObjectsList() {
        populateObjectsList();
    }
    
    function populateObjectsList() {
        const listContainer = document.getElementById('objects-list-container');
        listContainer.innerHTML = '';  // Clear current list
        
        const bodies = Composite.allBodies(world);
        let objectCount = 0;
        
        // Filter out static bodies like walls
        const nonStaticBodies = bodies.filter(body => 
            !body.isStatic && body.userData
        );
        const nonStaticBodyIds = nonStaticBodies.map(body => body.id);
        
        if (nonStaticBodies.length === 0) {
            listContainer.innerHTML = '<p>No objects in scene. Try adding some letters or objects first!</p>';
            return;
        }
        
        // Group objects by type for better organization
        const groupedObjects = {};
        
        nonStaticBodies.forEach(body => {
            if (!body.userData) return;
            
            const type = body.userData.type || 'unknown';
            if (!groupedObjects[type]) {
                groupedObjects[type] = [];
            }
            groupedObjects[type].push(body);
        });
        
        // Create heading and list for each type
        for (const type in groupedObjects) {
            const objects = groupedObjects[type];
            
            const typeHeading = document.createElement('h3');
            typeHeading.textContent = type.charAt(0).toUpperCase() + type.slice(1) + 's';
            listContainer.appendChild(typeHeading);
            
            objects.forEach(body => {
                objectCount++;
                
                const listItem = document.createElement('div');
                listItem.className = 'list-item';
                
                // Determine what to show for this object
                let content = '';
                let label = '';
                
                if (body.userData.displayName) {
                    label = body.userData.displayName;
                } else if (body.userData.type === 'letter' && body.userData.element) {
                    label = 'Letter: ' + body.userData.element.textContent;
                } else if (body.userData.type === 'emoji' && body.userData.element) {
                    label = 'Emoji: ' + body.userData.element.textContent;
                } else {
                    label = 'Object #' + objectCount;
                }
                
                // Create the list item content
                listItem.innerHTML = `
                    <div class="list-item-content">${label}</div>
                    <button class="follow-button btn-blue" data-body-id="${body.id}">
                        <i class="fas fa-eye"></i> Follow
                    </button>
                `;
                
                listContainer.appendChild(listItem);
            });
        }
        
        // Add event listeners to follow buttons
        const followButtons = document.querySelectorAll('.follow-button');
        followButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const bodyId = parseInt(e.currentTarget.getAttribute('data-body-id'));
                const targetBody = bodies.find(body => body.id === bodyId);
                if (targetBody) {
                    startFollowing(targetBody);
                    closeObjectsList();
                }
            });
        });
    }
    
    // Object following functionality
    function startFollowing(body) {
        // Stop any current following
        stopFollowing();
        
        followingBody = body;
        
        // Create visual indicator
        followingIndicator = document.createElement('div');
        followingIndicator.classList.add('following');
        document.body.appendChild(followingIndicator);
        
        // Show unfollow button
        const unfollowButton = document.getElementById('unfollow-button');
        unfollowButton.classList.remove('hidden');
        unfollowButton.addEventListener('click', stopFollowing);
        
        // Center on the object initially
        followObject(body);
    }
    
    function stopFollowing() {
        followingBody = null;
        
        // Remove visual indicator
        if (followingIndicator && followingIndicator.parentNode) {
            followingIndicator.parentNode.removeChild(followingIndicator);
        }
        followingIndicator = null;
        
        // Hide unfollow button
        const unfollowButton = document.getElementById('unfollow-button');
        unfollowButton.classList.add('hidden');
        
        // Reset any scrolling
        window.scrollTo(0, 0);
    }
    
    function followObject(body) {
        if (!body.position) return;
        
        // Update the indicator position and size
        if (followingIndicator) {
            let size = 50;
            if (body.userData && body.userData.element) {
                const element = body.userData.element;
                size = Math.max(element.offsetWidth, element.offsetHeight) + 20;
            }
            
            followingIndicator.style.width = `${size}px`;
            followingIndicator.style.height = `${size}px`;
            followingIndicator.style.left = `${body.position.x - size/2}px`;
            followingIndicator.style.top = `${body.position.y - size/2}px`;
            
            // Center the viewport on the object
            const centerX = Math.max(0, body.position.x - window.innerWidth/2);
            const centerY = Math.max(0, body.position.y - window.innerHeight/2);
            
            window.scrollTo({
                left: centerX,
                top: centerY,
                behavior: 'smooth'
            });
        }
    }
    
    // Create spawn-specific modal
    function createSpawnSpecificModal() {
        if (!document.getElementById('spawn-specific-modal')) {
            const modal = document.createElement('div');
            modal.id = 'spawn-specific-modal';
            modal.className = 'modal';
            
            modal.innerHTML = `
                <div class="modal-content spawn-modal">
                    <h2><i class="fas fa-th-large"></i> Spawn Character</h2>
                    
                    <div class="spawn-tabs">
                        <div class="spawn-tab active" data-spawn-tab="latin-uppercase">Latin Uppercase</div>
                        <div class="spawn-tab" data-spawn-tab="latin-lowercase">Latin Lowercase</div>
                        <div class="spawn-tab" data-spawn-tab="numbers">Numbers</div>
                        <div class="spawn-tab" data-spawn-tab="special">Symbols</div>
                        <div class="spawn-tab" data-spawn-tab="russian">Russian</div>
                        <div class="spawn-tab" data-spawn-tab="emoji">Emoji</div>
                    </div>
                    
                    <div class="spawn-content active" id="latin-uppercase-content"></div>
                    <div class="spawn-content" id="latin-lowercase-content"></div>
                    <div class="spawn-content" id="numbers-content"></div>
                    <div class="spawn-content" id="special-content"></div>
                    <div class="spawn-content" id="russian-content"></div>
                    <div class="spawn-content" id="emoji-content"></div>
                    
                    <div class="modal-buttons">
                        <button id="close-spawn-specific" class="btn-gray">
                            <i class="fas fa-times"></i> Close
                        </button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Add event listeners
            document.getElementById('close-spawn-specific').addEventListener('click', closeSpawnSpecific);
            
            // Set up tabs
            const spawnTabs = document.querySelectorAll('.spawn-tab');
            spawnTabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    // Remove active class from all tabs and contents
                    document.querySelectorAll('.spawn-tab').forEach(t => t.classList.remove('active'));
                    document.querySelectorAll('.spawn-content').forEach(c => c.classList.remove('active'));
                    
                    // Add active class to clicked tab
                    tab.classList.add('active');
                    
                    // Show corresponding content
                    const tabId = tab.getAttribute('data-spawn-tab');
                    document.getElementById(`${tabId}-content`).classList.add('active');
                });
            });
            
            // Populate characters
            populateCharacters('latin-uppercase-content', latinUppercase, '#4285F4');
            populateCharacters('latin-lowercase-content', latinLowercase, '#34A853');
            populateCharacters('numbers-content', numbers, '#FBBC05');
            populateCharacters('special-content', specialChars, '#EA4335');
            populateCharacters('russian-content', russianChars, '#9C27B0');
            populateCharacters('emoji-content', moreEmojis, '#FF9800');
        }
    }
    
    function populateCharacters(containerId, chars, baseColor) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        
        for (let i = 0; i < chars.length; i++) {
            const char = chars[i];
            
            // Create character button
            const button = document.createElement('div');
            button.className = 'char-button';
            button.textContent = char;
            button.style.backgroundColor = lightenColor(baseColor, 0.8);
            button.style.color = baseColor;
            button.style.borderColor = baseColor;
            
            button.addEventListener('click', () => {
                const body = spawnSpecificCharacter(char);
                closeSpawnSpecific();
                
                // Follow the new character automatically
                setTimeout(() => startFollowing(body), 100);
            });
            
            container.appendChild(button);
        }
    }
    
    function lightenColor(color, factor) {
        // Simple color lightening for hex colors
        if (color.startsWith('#')) {
            let r = parseInt(color.substr(1, 2), 16);
            let g = parseInt(color.substr(3, 2), 16);
            let b = parseInt(color.substr(5, 2), 16);
            
            r = Math.floor(r + (255 - r) * factor);
            g = Math.floor(g + (255 - g) * factor);
            b = Math.floor(b + (255 - b) * factor);
            
            return `rgb(${r}, ${g}, ${b})`;
        }
        return color;
    }
    
    function openSpawnSpecific() {
        createSpawnSpecificModal();
        const modal = document.getElementById('spawn-specific-modal');
        modal.style.display = 'block';
    }
    
    function closeSpawnSpecific() {
        const modal = document.getElementById('spawn-specific-modal');
        modal.style.display = 'none';
    }
    
    // Add event listener for opening spawn specific modal
    document.getElementById('open-specific-spawn').addEventListener('click', openSpawnSpecific);
    
    // Add unfollow button event listener
    document.getElementById('unfollow-button').addEventListener('click', stopFollowing);

    // Clone Character functionality
    const cloneButton = document.getElementById('clone-button');
    cloneButton.addEventListener('click', toggleCloneMode);
    
    // Exit clone mode button
    document.getElementById('exit-clone-mode').addEventListener('click', exitCloneMode);
    
    function toggleCloneMode() {
        cloneMode = !cloneMode;
        
        const cloneIndicator = document.getElementById('clone-mode-indicator');
        
        if (cloneMode) {
            // Enter clone mode
            cloneIndicator.classList.remove('hidden');
            cloneButton.innerHTML = '<i class="fas fa-sheep"></i> Exit Clone Mode';
            cloneButton.classList.add('active');
            
            // Make all characters clickable for cloning
            const bodies = Composite.allBodies(world);
            bodies.forEach(body => {
                if (body.userData && (body.userData.type === 'letter' || body.userData.type === 'emoji')) {
                    if (body.userData.element) {
                        body.userData.element.classList.add('clonable');
                        body.userData.element.addEventListener('click', handleElementClone);
                    }
                }
            });
            
            // Disable other functionality while in clone mode
            if (lettersFrozen) {
                document.removeEventListener('mousedown', handleMouseDown);
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
                document.removeEventListener('touchstart', handleTouchStart);
                document.removeEventListener('touchmove', handleTouchMove);
                document.removeEventListener('touchend', handleTouchEnd);
            }
            
            // Exit delete mode if active
            if (deleteMode) {
                exitDeleteMode();
            }
        } else {
            // Exit clone mode
            exitCloneMode();
        }
    }
    
    function exitCloneMode() {
        cloneMode = false;
        
        const cloneIndicator = document.getElementById('clone-mode-indicator');
        cloneIndicator.classList.add('hidden');
        
        const cloneButton = document.getElementById('clone-button');
        cloneButton.innerHTML = '<i class="fas fa-sheep"></i> Clone Character';
        cloneButton.classList.remove('active');
        
        // Remove clickable state from all characters
        const bodies = Composite.allBodies(world);
        bodies.forEach(body => {
            if (body.userData && (body.userData.type === 'letter' || body.userData.type === 'emoji')) {
                if (body.userData.element) {
                    body.userData.element.classList.remove('clonable');
                    body.userData.element.removeEventListener('click', handleElementClone);
                }
            }
        });
        
        // Re-enable frozen letter dragging if needed
        if (lettersFrozen) {
            document.addEventListener('mousedown', handleMouseDown);
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.addEventListener('touchstart', handleTouchStart, { passive: false });
            document.addEventListener('touchmove', handleTouchMove, { passive: false });
            document.addEventListener('touchend', handleTouchEnd);
        }
    }
    
    function handleElementClone(e) {
        if (!cloneMode) return;
        
        const element = e.currentTarget;
        const body = findBodyByElement(element);
        
        if (body) {
            // Clone the character
            let clonedBody;
            
            // Create a clone based on the type
            if (body.userData.type === 'letter' || body.userData.type === 'emoji') {
                // Create clone element
                const cloneElement = document.createElement('div');
                cloneElement.classList.add(body.userData.type === 'letter' ? 'letter' : 'emoji');
                cloneElement.textContent = element.textContent;
                cloneElement.style.color = element.style.color;
                cloneElement.style.fontSize = element.style.fontSize;
                cloneElement.style.fontFamily = currentFont;
                document.body.appendChild(cloneElement);
                
                // Create physics body
                if (body.circleRadius) {
                    // For circular bodies (emoji)
                    clonedBody = Bodies.circle(
                        window.innerWidth / 2,
                        window.innerHeight / 2 - 100,
                        body.circleRadius,
                        {
                            restitution: body.restitution,
                            friction: body.friction,
                            density: body.density,
                            frictionAir: body.frictionAir,
                            render: {
                                fillStyle: 'transparent',
                                strokeStyle: 'transparent'
                            }
                        }
                    );
                    clonedBody.circleRadius = body.circleRadius;
                } else {
                    // For rectangular bodies (letters)
                    clonedBody = Bodies.rectangle(
                        window.innerWidth / 2,
                        window.innerHeight / 2 - 100,
                        body.bounds.max.x - body.bounds.min.x,
                        body.bounds.max.y - body.bounds.min.y,
                        {
                            restitution: body.restitution,
                            friction: body.friction,
                            density: body.density,
                            frictionAir: body.frictionAir,
                            render: {
                                fillStyle: 'transparent',
                                strokeStyle: 'transparent'
                            }
                        }
                    );
                }
                
                // Store reference to DOM element
                clonedBody.userData = { 
                    element: cloneElement, 
                    type: body.userData.type,
                    displayName: body.userData.displayName || (body.userData.type === 'letter' ? 'Letter' : 'Emoji')
                };
                
                Composite.add(world, clonedBody);
                
                // Add clone effect
                const cloneEffect = document.createElement('div');
                cloneEffect.classList.add('clone-effect');
                cloneEffect.style.left = (window.innerWidth / 2 - 50) + 'px';
                cloneEffect.style.top = (window.innerHeight / 2 - 150) + 'px';
                document.body.appendChild(cloneEffect);
                
                // Remove effect after animation
                setTimeout(() => {
                    if (cloneEffect.parentNode) {
                        cloneEffect.parentNode.removeChild(cloneEffect);
                    }
                }, 1000);
                
                // Follow the cloned object
                startFollowing(clonedBody);
            }
            
            e.stopPropagation();
        }
    }

    // Delete Character functionality
    const deleteButton = document.getElementById('delete-button');
    deleteButton.addEventListener('click', toggleDeleteMode);
    
    // Exit delete mode button
    document.getElementById('exit-delete-mode').addEventListener('click', exitDeleteMode);
    
    function toggleDeleteMode() {
        deleteMode = !deleteMode;
        
        const deleteIndicator = document.getElementById('delete-mode-indicator');
        
        if (deleteMode) {
            // Enter delete mode
            deleteIndicator.classList.remove('hidden');
            deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i> Exit Delete Mode';
            deleteButton.classList.add('active');
            
            // Make all characters clickable for deletion
            const bodies = Composite.allBodies(world);
            bodies.forEach(body => {
                if (body.userData && (body.userData.type === 'letter' || body.userData.type === 'emoji')) {
                    if (body.userData.element) {
                        body.userData.element.classList.add('deletable');
                        body.userData.element.addEventListener('click', handleElementDelete);
                    }
                }
            });
            
            // Disable other functionality while in delete mode
            if (lettersFrozen) {
                document.removeEventListener('mousedown', handleMouseDown);
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
                document.removeEventListener('touchstart', handleTouchStart);
                document.removeEventListener('touchmove', handleTouchMove);
                document.removeEventListener('touchend', handleTouchEnd);
            }
            
        } else {
            // Exit delete mode
            exitDeleteMode();
        }
    }
    
    function exitDeleteMode() {
        deleteMode = false;
        
        const deleteIndicator = document.getElementById('delete-mode-indicator');
        deleteIndicator.classList.add('hidden');
        
        const deleteButton = document.getElementById('delete-button');
        deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i> Delete Character';
        deleteButton.classList.remove('active');
        
        // Remove clickable state from all characters
        const bodies = Composite.allBodies(world);
        bodies.forEach(body => {
            if (body.userData && (body.userData.type === 'letter' || body.userData.type === 'emoji')) {
                if (body.userData.element) {
                    body.userData.element.classList.remove('deletable');
                    body.userData.element.removeEventListener('click', handleElementDelete);
                }
            }
        });
        
        // Re-enable frozen letter dragging if needed
        if (lettersFrozen) {
            document.addEventListener('mousedown', handleMouseDown);
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.addEventListener('touchstart', handleTouchStart, { passive: false });
            document.addEventListener('touchmove', handleTouchMove, { passive: false });
            document.addEventListener('touchend', handleTouchEnd);
        }
    }
    
    function handleElementDelete(e) {
        if (!deleteMode) return;
        
        const element = e.currentTarget;
        const body = findBodyByElement(element);
        
        if (body) {
            // Remove the physics body
            Composite.remove(world, body);
            
            // Remove the DOM element
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
            
            // Add a small visual effect
            const deleteEffect = document.createElement('div');
            deleteEffect.style.position = 'absolute';
            deleteEffect.style.left = element.style.left;
            deleteEffect.style.top = element.style.top;
            deleteEffect.style.width = '30px';
            deleteEffect.style.height = '30px';
            deleteEffect.style.borderRadius = '50%';
            deleteEffect.style.backgroundColor = 'rgba(255, 0, 0, 0.5)';
            deleteEffect.style.zIndex = '1000';
            deleteEffect.style.animation = 'delete-poof 0.5s forwards';
            document.body.appendChild(deleteEffect);
            
            // Clean up the effect after animation
            setTimeout(() => {
                if (deleteEffect.parentNode) {
                    deleteEffect.parentNode.removeChild(deleteEffect);
                }
            }, 500);
            
            e.stopPropagation();
        }
    }

    // Add this to your existing CSS (via JavaScript for convenience)
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes delete-poof {
            0% { transform: scale(1); opacity: 1; }
            100% { transform: scale(2); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // Add Upside Down functionality
    document.getElementById('upside-down-button').addEventListener('click', flipUpsideDown);

    function flipUpsideDown() {
        // Get all bodies
        const bodies = Composite.allBodies(world);
        const screenHeight = window.innerHeight;
        
        // First, make a record of which bodies aren't static
        const nonStaticBodies = bodies.filter(body => 
            !body.isStatic && body.userData
        );
        const nonStaticBodyIds = nonStaticBodies.map(body => body.id);
        
        // Flip each body's position upside down
        nonStaticBodies.forEach(body => {
            // Calculate new Y position (flip vertically)
            const newY = screenHeight - body.position.y;
            
            // Set the new position
            Body.setPosition(body, {
                x: body.position.x,
                y: newY
            });
            
            // Also flip the rotation (180 degrees in radians)
            Body.setAngle(body, body.angle + Math.PI);
            
            // Freeze the body
            Body.setStatic(body, true);
        });
        
        // Create a visual effect
        const flashEffect = document.createElement('div');
        flashEffect.style.position = 'fixed';
        flashEffect.style.top = '0';
        flashEffect.style.left = '0';
        flashEffect.style.width = '100%';
        flashEffect.style.height = '100%';
        flashEffect.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
        flashEffect.style.zIndex = '1000';
        flashEffect.style.transition = 'opacity 0.5s';
        document.body.appendChild(flashEffect);
        
        // Fade out the flash effect
        setTimeout(() => {
            flashEffect.style.opacity = '0';
        }, 100);
        
        // Remove it after transition
        setTimeout(() => {
            if (flashEffect.parentNode) {
                flashEffect.parentNode.removeChild(flashEffect);
            }
        }, 600);
        
        // Unfreeze after 1 second and let everything fall
        setTimeout(() => {
            bodies.forEach(body => {
                // Only unfreeze the bodies that were previously not static
                if (nonStaticBodyIds.includes(body.id)) {
                    Body.setStatic(body, false);
                }
            });
        }, 1000);
    }

    // Handle window resize
    window.addEventListener('resize', () => {
        render.options.width = window.innerWidth;
        render.options.height = window.innerHeight;
        render.canvas.width = window.innerWidth;
        render.canvas.height = window.innerHeight;
    });

    // Initialize physics text
    createPhysicsText();
    createAllLetterSets();
    updateLetterPositions();
    
    // Initialize the modals
    createCustomTextModal();
    createObjectsListModal();
    createSpawnSpecificModal();
    createFontSelectionModal();
    createSizeSelectionModal();
});

// Random Font functionality
document.getElementById('random-font-button').addEventListener('click', applyRandomFont);
    
function applyRandomFont() {
    const randomFont = availableFonts[Math.floor(Math.random() * availableFonts.length)].name;
    applyFontToAllLetters(randomFont);
}
    
function applyFontToAllLetters(fontName) {
    currentFont = fontName;
    const bodies = Composite.allBodies(world);
        
    bodies.forEach(body => {
        if (body.userData && (body.userData.type === 'letter' || body.userData.type === 'emoji')) {
            if (body.userData.element) {
                body.userData.element.style.fontFamily = fontName;
            }
        }
    });
}

// Choose Font functionality
document.getElementById('choose-font-button').addEventListener('click', openFontSelectionModal);
    
function createFontSelectionModal() {
    if (!document.getElementById('font-selection-modal')) {
        const modal = document.createElement('div');
        modal.id = 'font-selection-modal';
        modal.className = 'modal';
        
        modal.innerHTML = `
            <div class="modal-content font-selection-modal">
                <h2><i class="fas fa-font"></i> Choose Font</h2>
                <div class="font-options">
                    ${availableFonts.map(font => `
                        <div class="font-option ${font.name === currentFont ? 'selected' : ''}" data-font="${font.name}">
                            <span class="font-name">${font.name}</span>
                            <span class="font-sample" style="font-family: '${font.name}'">${font.sample}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="modal-buttons">
                    <button id="cancel-font-selection" class="btn-gray">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                    <button id="apply-font-selection" class="btn-green">
                        <i class="fas fa-check"></i> Apply Font
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners
        document.getElementById('cancel-font-selection').addEventListener('click', closeFontSelectionModal);
        document.getElementById('apply-font-selection').addEventListener('click', applySelectedFont);
        
        // Add click event to font options
        const fontOptions = document.querySelectorAll('.font-option');
        fontOptions.forEach(option => {
            option.addEventListener('click', () => {
                // Remove selected class from all options
                fontOptions.forEach(o => o.classList.remove('selected'));
                // Add selected class to clicked option
                option.classList.add('selected');
            });
        });
    }
}
    
function openFontSelectionModal() {
    createFontSelectionModal();
    const modal = document.getElementById('font-selection-modal');
    modal.style.display = 'block';
}
    
function closeFontSelectionModal() {
    const modal = document.getElementById('font-selection-modal');
    modal.style.display = 'none';
}
    
function applySelectedFont() {
    const selectedOption = document.querySelector('.font-option.selected');
    if (selectedOption) {
        const fontName = selectedOption.getAttribute('data-font');
        applyFontToAllLetters(fontName);
    }
    closeFontSelectionModal();
}

// Choose Size functionality
document.getElementById('choose-size-button').addEventListener('click', openSizeSelectionModal);
    
function createSizeSelectionModal() {
    if (!document.getElementById('size-selection-modal')) {
        const modal = document.createElement('div');
        modal.id = 'size-selection-modal';
        modal.className = 'modal';
        
        modal.innerHTML = `
            <div class="modal-content size-selection-modal">
                <h2><i class="fas fa-text-height"></i> Choose Font Size</h2>
                
                <div class="size-preview" style="font-size: ${currentFontSize}px;">
                    Sample Text
                </div>
                <div class="size-slider-container">
                    <input type="range" id="size-slider" class="size-slider" 
                           min="12" max="72" value="${currentFontSize}" step="1">
                    <div id="size-value">${currentFontSize}px</div>
                </div>
                <div class="modal-buttons">
                    <button id="cancel-size-selection" class="btn-gray">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                    <button id="apply-size-selection" class="btn-green">
                        <i class="fas fa-check"></i> Apply Size
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners
        document.getElementById('cancel-size-selection').addEventListener('click', closeSizeSelectionModal);
        document.getElementById('apply-size-selection').addEventListener('click', applySelectedSize);
        
        // Update preview as slider changes
        const sizeSlider = document.getElementById('size-slider');
        const sizeValue = document.getElementById('size-value');
        const sizePreview = document.querySelector('.size-preview');
        
        sizeSlider.addEventListener('input', () => {
            const newSize = sizeSlider.value;
            sizeValue.textContent = `${newSize}px`;
            sizePreview.style.fontSize = `${newSize}px`;
        });
    }
}
    
function openSizeSelectionModal() {
    createSizeSelectionModal();
    const modal = document.getElementById('size-selection-modal');
    modal.style.display = 'block';
}
    
function closeSizeSelectionModal() {
    const modal = document.getElementById('size-selection-modal');
    modal.style.display = 'none';
}
    
function applySelectedSize() {
    const sizeSlider = document.getElementById('size-slider');
    const newSize = parseInt(sizeSlider.value);
    applyFontSizeToAllLetters(newSize);
    closeSizeSelectionModal();
}
    
function applyFontSizeToAllLetters(size) {
    currentFontSize = size;
    const bodies = Composite.allBodies(world);
        
    bodies.forEach(body => {
        if (body.userData && (body.userData.type === 'letter' || body.userData.type === 'emoji')) {
            if (body.userData.element) {
                body.userData.element.style.fontSize = `${size}px`;
                
                // Also resize the physics body to match
                if (body.circleRadius) {
                    // For circular bodies like emojis
                    Body.scale(body, size / body.circleRadius / 2, size / body.circleRadius / 2);
                } else {
                    // For rectangular bodies like letters
                    const scaleX = size / 20;
                    const scaleY = size / 20;
                    Body.scale(body, scaleX, scaleY);
                }
            }
        }
    });
}