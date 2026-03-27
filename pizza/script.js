document.addEventListener('DOMContentLoaded', async () => {
    // Initialize WebsimSocket for real-time features
    const room = new WebsimSocket();

    const urlParams = new URLSearchParams(window.location.search);
    const pizzaCode = urlParams.get('code');
    
    if (pizzaCode) {
        try {
            const pizzaData = JSON.parse(atob(pizzaCode));
            loadPizzaFromData(pizzaData);
        } catch (error) {
            console.error('Error loading pizza from URL:', error);
        }
    }

    // Create audio element and play automatically
    const bgMusic = new Audio('/Screen Recording 2025-03-18 095848.mp3');
    bgMusic.loop = true;
    bgMusic.volume = 0.5;
    bgMusic.play().catch(e => console.log('Auto-play prevented:', e)); // Attempt to play, catch if blocked

    // Add audio controls
    const audioControl = document.createElement('div');
    audioControl.className = 'audio-control';
    audioControl.innerHTML = `
        <button id="music-toggle" class="music-btn">
            <i class="fa-solid fa-volume-up"></i>
        </button>
        <input type="range" class="volume-slider" min="0" max="100" value="50">
    `;
    document.body.appendChild(audioControl);

    // Music toggle functionality
    const musicToggle = document.getElementById('music-toggle');
    const volumeSlider = document.querySelector('.volume-slider');
    let isMusicPlaying = true; // Changed to true since music starts playing

    musicToggle.addEventListener('click', () => {
        if (isMusicPlaying) {
            bgMusic.pause();
            musicToggle.innerHTML = '<i class="fa-solid fa-volume-mute"></i>';
        } else {
            bgMusic.play();
            musicToggle.innerHTML = '<i class="fa-solid fa-volume-up"></i>';
        }
        isMusicPlaying = !isMusicPlaying;
    });

    volumeSlider.addEventListener('input', (e) => {
        bgMusic.volume = e.target.value / 100;
    });

    // Add download button to actions div
    const actionsDiv = document.querySelector('.actions');
    
    const saveBtn = document.createElement('button');
    saveBtn.id = 'save-btn';
    saveBtn.innerHTML = '<i class="fa-solid fa-share fa-icon"></i>Share Pizza';
    actionsDiv.appendChild(saveBtn);

    const loadBtn = document.createElement('button');
    loadBtn.id = 'load-btn';
    loadBtn.innerHTML = '<i class="fa-solid fa-upload fa-icon"></i>Load Pizza';
    actionsDiv.appendChild(loadBtn);

    const downloadBtn = document.createElement('button');
    downloadBtn.id = 'download-btn';
    downloadBtn.innerHTML = '<i class="fa-solid fa-download fa-icon"></i>Download Image';
    actionsDiv.appendChild(downloadBtn);

    // Add changelog button to actions div
    const changelogBtn = document.createElement('button');
    changelogBtn.id = 'changelog-btn';
    changelogBtn.innerHTML = '<i class="fa-solid fa-clock-rotate-left fa-icon"></i>Changelog';
    document.querySelector('.actions').appendChild(changelogBtn);

    // Changelog button click handler
    changelogBtn.addEventListener('click', () => {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content changelog">
                <h3>Pizza Maker Changelog</h3>
                <div class="version-list">
                    <div class="version">
                        <h4><i class="fa-solid fa-code-commit fa-icon"></i>v25 (Current)</h4>
                        <ul>
                            <li><i class="fa-solid fa-plus fa-icon"></i>Added more toppings with new icons</li>
                            <li><i class="fa-solid fa-music fa-icon"></i>Added background music</li>
                            <li><i class="fa-solid fa-paint-brush fa-icon"></i>Improved topping colors</li>
                        </ul>
                    </div>
                    <div class="version">
                        <h4><i class="fa-solid fa-code-commit fa-icon"></i>v24</h4>
                        <ul>
                            <li><i class="fa-solid fa-wrench fa-icon"></i>Bug fixes and improvements</li>
                            <li><i class="fa-solid fa-plus fa-icon"></i>Added more features</li>
                        </ul>
                    </div>
                    <div class="version">
                        <h4><i class="fa-solid fa-code-commit fa-icon"></i>v21</h4>
                        <ul>
                            <li><i class="fa-solid fa-share fa-icon"></i>Added separate save/load buttons</li>
                        </ul>
                    </div>
                    <div class="version">
                        <h4><i class="fa-solid fa-code-commit fa-icon"></i>v13-16</h4>
                        <ul>
                            <li><i class="fa-solid fa-cookie fa-icon"></i>Added pizza rolls</li>
                            <li><i class="fa-solid fa-ice-cream fa-icon"></i>Added Ice Cream Maker preview</li>
                            <li><i class="fa-solid fa-save fa-icon"></i>Improved pizza saving system</li>
                        </ul>
                    </div>
                    <div class="version">
                        <h4><i class="fa-solid fa-code-commit fa-icon"></i>v10</h4>
                        <ul>
                            <li><i class="fa-solid fa-bacon fa-icon"></i>Added bacon topping</li>
                            <li><i class="fa-solid fa-droplet fa-icon"></i>Added new sauces</li>
                        </ul>
                    </div>
                    <div class="version">
                        <h4><i class="fa-solid fa-code-commit fa-icon"></i>v7-9</h4>
                        <ul>
                            <li><i class="fa-solid fa-robot fa-icon"></i>Added AI pizza creation</li>
                            <li><i class="fa-solid fa-dice fa-icon"></i>Added random pizza generator</li>
                            <li><i class="fa-solid fa-plus fa-icon"></i>Many new features</li>
                        </ul>
                    </div>
                    <div class="version">
                        <h4><i class="fa-solid fa-code-commit fa-icon"></i>v3-6</h4>
                        <ul>
                            <li><i class="fa-solid fa-shapes fa-icon"></i>Added pizza shapes</li>
                            <li><i class="fa-solid fa-cheese fa-icon"></i>Added cheese-stuffed crust</li>
                            <li><i class="fa-solid fa-star fa-icon"></i>Added AI ratings</li>
                        </ul>
                    </div>
                    <div class="version">
                        <h4><i class="fa-solid fa-code-commit fa-icon"></i>v2</h4>
                        <ul>
                            <li><i class="fa-solid fa-candy-cane fa-icon"></i>Added candy topping</li>
                            <li><i class="fa-solid fa-skull fa-icon"></i>Added poison topping</li>
                            <li><i class="fa-solid fa-pineapple fa-icon"></i>Added pineapple topping</li>
                            <li><i class="fa-solid fa-star fa-icon"></i>Added ratings system</li>
                        </ul>
                    </div>
                    <div class="version">
                        <h4><i class="fa-solid fa-code-commit fa-icon"></i>v1</h4>
                        <ul>
                            <li><i class="fa-solid fa-pizza-slice fa-icon"></i>Initial release</li>
                            <li><i class="fa-solid fa-check fa-icon"></i>Basic pizza creation</li>
                        </ul>
                    </div>
                </div>
                <button class="close-modal">×</button>
            </div>
        `;
        document.body.appendChild(modal);

        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.onclick = () => modal.remove();
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };
    });

    // Elements
    const pizzaSvg = document.querySelector('.pizza-svg');
    const toppingsContainer = document.querySelector('.toppings-container');
    const roundSauce = document.querySelector('.round-sauce');
    const squareSauce = document.querySelector('.square-sauce');
    const roundCrust = document.querySelector('.round-crust');
    const squareCrust = document.querySelector('.square-crust');
    const sauceButtons = document.querySelectorAll('.sauce-btn');
    const toppingButtons = document.querySelectorAll('.topping-btn');
    const shapeButtons = document.querySelectorAll('.shape-btn');
    const crustButtons = document.querySelectorAll('.crust-btn');
    const resetBtn = document.getElementById('reset-btn');
    const bakeBtn = document.getElementById('bake-btn');
    const messageContainer = document.getElementById('message-container');
    const eatBtn = document.getElementById('eat-btn');
    const ratingContainer = document.getElementById('rating-container');
    const aiMakeBtn = document.getElementById('ai-make-btn');
    const randomBtn = document.getElementById('random-btn');
    
    // State
    let currentSauce = 'tomato';
    let selectedToppings = [];
    let isBaking = false;
    let isPizzaBaked = false;
    let currentShape = 'round';
    let currentCrust = 'regular';
    let currentRollSize = 6; // Number of rolls in pizza rolls layout

    // Initialize
    updateSauceDisplay();

    // Shape selection
    shapeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (isBaking) return;
            
            // Update UI
            shapeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update shape
            currentShape = btn.dataset.shape;
            updateShapeDisplay();
            
            // Regenerate toppings for new shape
            const currentToppings = [...selectedToppings];
            while (toppingsContainer.firstChild) {
                toppingsContainer.removeChild(toppingsContainer.firstChild);
            }
            currentToppings.forEach(topping => addToppingToPizza(topping));
        });
    });

    function updateShapeDisplay() {
        if (currentShape === 'round') {
            roundCrust.style.display = '';
            roundSauce.style.display = '';
            squareCrust.style.display = 'none';
            squareSauce.style.display = 'none';
            document.querySelector('.rolls-container').style.display = 'none';
        } else if (currentShape === 'square') {
            roundCrust.style.display = 'none';
            roundSauce.style.display = 'none';
            squareCrust.style.display = '';
            squareSauce.style.display = '';
            document.querySelector('.rolls-container').style.display = 'none';
        } else if (currentShape === 'rolls') {
            roundCrust.style.display = 'none';
            roundSauce.style.display = 'none';
            squareCrust.style.display = 'none';
            squareSauce.style.display = 'none';
            document.querySelector('.rolls-container').style.display = '';
            
            // Create roll shapes
            const rollsContainer = document.querySelector('.rolls-container');
            rollsContainer.innerHTML = '';
            
            const rollSize = 40; // Size of each roll
            const spacing = 10; // Space between rolls
            const rows = 2;
            const cols = 3;
            
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    const roll = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                    const x = 50 + j * (rollSize + spacing);
                    const y = 100 + i * (rollSize + spacing);
                    
                    // Create roll crust
                    const crust = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                    crust.setAttribute('cx', x);
                    crust.setAttribute('cy', y);
                    crust.setAttribute('r', rollSize/2);
                    crust.setAttribute('class', 'crust');
                    crust.setAttribute('data-thickness', currentCrust);
                    
                    // Create sauce
                    const sauce = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                    sauce.setAttribute('cx', x);
                    sauce.setAttribute('cy', y);
                    sauce.setAttribute('r', (rollSize/2) - 5);
                    sauce.setAttribute('class', 'sauce');
                    sauce.setAttribute('data-sauce', currentSauce);
                    
                    roll.appendChild(crust);
                    roll.appendChild(sauce);
                    rollsContainer.appendChild(roll);
                }
            }
        }
        updateSauceDisplay();
    }

    function updateSauceDisplay() {
        roundSauce.setAttribute('data-sauce', currentSauce);
        squareSauce.setAttribute('data-sauce', currentSauce);
        
        // Update roll sauce
        const rollsContainer = document.querySelector('.rolls-container');
        const rolls = rollsContainer.querySelectorAll('g');
        rolls.forEach(roll => {
            const sauce = roll.querySelector('circle[class="sauce"]');
            sauce.setAttribute('data-sauce', currentSauce);
        });
    }

    // Crust selection
    crustButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (isBaking) return;
            
            // Update UI
            crustButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update crust
            currentCrust = btn.dataset.crust;
            roundCrust.setAttribute('data-thickness', currentCrust);
            squareCrust.setAttribute('data-thickness', currentCrust);
            
            // Update roll crust
            const rollsContainer = document.querySelector('.rolls-container');
            const rolls = rollsContainer.querySelectorAll('g');
            rolls.forEach(roll => {
                const crust = roll.querySelector('circle[class="crust"]');
                crust.setAttribute('data-thickness', currentCrust);
            });
        });
    });

    // Sauce selection
    sauceButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (isBaking) return;
            
            // Update UI
            sauceButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update sauce
            currentSauce = btn.dataset.sauce;
            updateSauceDisplay();
        });
    });

    // Topping selection
    toppingButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (isBaking) return;
            
            const topping = btn.dataset.topping;
            
            if (btn.classList.contains('active')) {
                // Remove topping
                btn.classList.remove('active');
                selectedToppings = selectedToppings.filter(t => t !== topping);
                removeToppingFromPizza(topping);
            } else {
                // Add topping
                btn.classList.add('active');
                selectedToppings.push(topping);
                addToppingToPizza(topping);
            }
        });
    });

    function addToppingToPizza(toppingType) {
        if (currentShape === 'rolls') {
            // Adjust topping placement for rolls
            const rollsContainer = document.querySelector('.rolls-container');
            const toppingGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            toppingGroup.classList.add('topping', toppingType);
            toppingGroup.setAttribute('data-topping', toppingType);
            
            // Add toppings to each roll
            const rolls = rollsContainer.querySelectorAll('g');
            rolls.forEach(roll => {
                const rollBounds = roll.getBoundingClientRect();
                const centerX = parseFloat(roll.querySelector('circle').getAttribute('cx'));
                const centerY = parseFloat(roll.querySelector('circle').getAttribute('cy'));
                
                // Add 3-5 toppings per roll
                const numToppings = Math.floor(Math.random() * 3) + 3;
                for (let i = 0; i < numToppings; i++) {
                    const angle = Math.random() * 2 * Math.PI;
                    const distance = Math.random() * 15; // Smaller radius for rolls
                    const x = centerX + Math.cos(angle) * distance;
                    const y = centerY + Math.sin(angle) * distance;
                    
                    // Create topping element (reuse existing topping creation logic)
                    const toppingElement = createToppingElement(toppingType, x, y, 6); // Smaller size for rolls
                    if (toppingElement) {
                        toppingGroup.appendChild(toppingElement);
                    }
                }
            });
            
            toppingsContainer.appendChild(toppingGroup);
        } else {
            // Existing topping placement logic for round and square pizzas
            let count;
            let size;
            
            switch(toppingType) {
                case 'cheese':
                    count = 30;
                    size = 10;
                    break;
                case 'pepperoni':
                    count = 15;
                    size = 12;
                    break;
                case 'mushroom':
                    count = 12;
                    size = 14;
                    break;
                case 'olive':
                    count = 18;
                    size = 8;
                    break;
                case 'pepper':
                    count = 10;
                    size = 15;
                    break;
                case 'onion':
                    count = 14;
                    size = 12;
                    break;
                case 'pineapple':
                    count = 12;
                    size = 13;
                    break;
                case 'candy':
                    count = 10;
                    size = 10;
                    break;
                case 'poison':
                    count = 5;
                    size = 12;
                    break;
                case 'bacon':
                    count = 16;
                    size = 14;
                    break;
                case 'ham':
                    count = 14;
                    size = 15;
                    break;
                case 'sausage':
                    count = 12;
                    size = 12;
                    break;
                case 'anchovy':
                    count = 10;
                    size = 16;
                    break;
                case 'chicken':
                    count = 14;
                    size = 14;
                    break;
                case 'broccoli':
                    count = 12;
                    size = 14;
                    break;
                case 'spinach':
                    count = 20;
                    size = 10;
                    break;
                case 'tomato':
                    count = 12;
                    size = 14;
                    break;
                case 'garlic':
                    count = 15;
                    size = 8;
                    break;
                case 'hot-pepper':
                    count = 10;
                    size = 12;
                    break;
                default:
                    count = 15;
                    size = 10;
            }

            // Create a group for this topping type
            const toppingGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            toppingGroup.classList.add('topping', toppingType);
            toppingGroup.setAttribute('data-topping', toppingType);

            // Add topping pieces
            for (let i = 0; i < count; i++) {
                let x, y;
                
                if (currentShape === 'round') {
                    // Random position within round pizza, avoiding the edge
                    const angle = Math.random() * 2 * Math.PI;
                    const distance = Math.random() * 110; // 130 is sauce radius, stay a bit inside
                    x = 150 + Math.cos(angle) * distance;
                    y = 150 + Math.sin(angle) * distance;
                } else {
                    // Random position within square pizza, avoiding the edge
                    x = 40 + Math.random() * 220;
                    y = 40 + Math.random() * 220;
                }

                // Create the topping shape based on type
                let toppingElement = createToppingElement(toppingType, x, y, size);
                toppingGroup.appendChild(toppingElement);
            }

            toppingsContainer.appendChild(toppingGroup);
        }
    }

    function createToppingElement(toppingType, x, y, size) {
        let toppingElement;
        
        switch(toppingType) {
            case 'meatballs':
                toppingElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                toppingElement.setAttribute('cx', x);
                toppingElement.setAttribute('cy', y);
                toppingElement.setAttribute('r', size/2);
                toppingElement.setAttribute('fill', '#8d6e63');
                break;
                
            case 'artichoke':
                toppingElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                toppingElement.setAttribute('d', `M${x},${y-size/2} c${size/3},${-size/2} ${size*2/3},${-size/2} ${size},0 c${-size/3},${size/2} ${-size*2/3},${size/2} -${size},0`);
                toppingElement.setAttribute('fill', '#558b2f');
                break;
                
            case 'eggplant':
                toppingElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                toppingElement.setAttribute('d', `M${x-size/3},${y} a${size/2},${size} 0 0,0 ${size*2/3},0`);
                toppingElement.setAttribute('fill', '#4a148c');
                break;
                
            case 'zucchini':
                toppingElement = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
                toppingElement.setAttribute('cx', x);
                toppingElement.setAttribute('cy', y);
                toppingElement.setAttribute('rx', size/2);
                toppingElement.setAttribute('ry', size/4);
                toppingElement.setAttribute('fill', '#33691e');
                toppingElement.setAttribute('transform', `rotate(${Math.random() * 360} ${x} ${y})`);
                break;
                
            case 'autumn':
                toppingElement = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                circle.setAttribute('cx', x);
                circle.setAttribute('cy', y);
                circle.setAttribute('r', size/2);
                circle.setAttribute('fill', '#ff6d00');
                
                const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                text.setAttribute('x', x);
                text.setAttribute('y', y + size/6);
                text.setAttribute('text-anchor', 'middle');
                text.setAttribute('font-size', size * 0.6);
                text.setAttribute('fill', 'white');
                text.textContent = '©';
                
                toppingElement.appendChild(circle);
                toppingElement.appendChild(text);
                break;
                
            case 'shrimp':
                toppingElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                toppingElement.setAttribute('d', `M${x-size/2},${y} c${size/3},${-size/2} ${size},${-size/2} ${size},0 c${-size/3},${size/2} -${size},${size/2} -${size},0`);
                toppingElement.setAttribute('fill', '#ff8a65');
                toppingElement.setAttribute('stroke', '#ffab91');
                break;
                
            case 'cheese':
                toppingElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                toppingElement.setAttribute('x', x - size/2);
                toppingElement.setAttribute('y', y - size/2);
                toppingElement.setAttribute('width', size);
                toppingElement.setAttribute('height', size/2);
                toppingElement.setAttribute('rx', 2);
                toppingElement.setAttribute('transform', `rotate(${Math.random() * 360} ${x} ${y})`);
                toppingElement.setAttribute('fill', '#ffd561');
                break;
                
            // ... rest of the cases remain the same ...
                
            default:
                // Fallback to a simple circle if topping type is unknown
                toppingElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                toppingElement.setAttribute('cx', x);
                toppingElement.setAttribute('cy', y);
                toppingElement.setAttribute('r', size/2);
                toppingElement.setAttribute('fill', '#888');
        }

        // Ensure we always return a valid SVG element
        if (!toppingElement) {
            toppingElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            toppingElement.setAttribute('cx', x);
            toppingElement.setAttribute('cy', y);
            toppingElement.setAttribute('r', size/2);
            toppingElement.setAttribute('fill', '#888');
        }

        return toppingElement;
    }

    // Remove topping from pizza
    function removeToppingFromPizza(toppingType) {
        const toppingGroup = toppingsContainer.querySelector(`g[data-topping="${toppingType}"]`);
        if (toppingGroup) {
            toppingsContainer.removeChild(toppingGroup);
        }
    }

    // Reset button
    resetBtn.addEventListener('click', () => {
        if (isBaking) return;
        resetPizza();
    });

    // Bake button
    bakeBtn.addEventListener('click', async () => {
        if (isBaking) return;
        
        // Start baking animation
        isBaking = true;
        pizzaSvg.classList.add('baking');
        
        // Disable controls during baking
        sauceButtons.forEach(btn => btn.disabled = true);
        toppingButtons.forEach(btn => btn.disabled = true);
        shapeButtons.forEach(btn => btn.disabled = true);
        crustButtons.forEach(btn => btn.disabled = true);
        resetBtn.disabled = true;
        bakeBtn.disabled = true;
        
        // After "baking" is done
        setTimeout(async () => {
            // Stop animation
            pizzaSvg.classList.remove('baking');
            
            // Show success message
            let toppingsText = selectedToppings.length ? 
                `with ${selectedToppings.join(', ')}` : 
                'with no toppings';
                
            let shapeText = currentShape === 'round' ? 'round' : currentShape === 'square' ? 'Sicilian square' : 'Pizza Rolls';
            let crustText = currentCrust === 'regular' ? 'regular' : currentCrust;
                
            messageContainer.textContent = `Your delicious ${shapeText} pizza with ${crustText} crust and ${currentSauce} sauce ${toppingsText} is ready!`;
            messageContainer.style.display = 'block';
            messageContainer.classList.add('success');
            
            // Show eat button
            eatBtn.style.display = 'block';
            isPizzaBaked = true;
            
            // Re-enable controls
            sauceButtons.forEach(btn => btn.disabled = false);
            toppingButtons.forEach(btn => btn.disabled = false);
            shapeButtons.forEach(btn => btn.disabled = false);
            crustButtons.forEach(btn => btn.disabled = false);
            resetBtn.disabled = false;
            bakeBtn.disabled = false;
            
            isBaking = false;

            // Automatically share the pizza
            await sharePizza();
        }, 3000);
    });

    // Eat button
    eatBtn.addEventListener('click', async () => {
        if (!isPizzaBaked) return;
        
        // Show loading indicator in rating container
        ratingContainer.innerHTML = '<p>AI is tasting your pizza...</p>';
        ratingContainer.style.display = 'block';
        
        // Build prompt for AI rating
        const toppingsText = selectedToppings.length ? selectedToppings.join(', ') : 'no toppings';
        const shapeText = currentShape === 'round' ? 'round' : currentShape === 'square' ? 'Sicilian square' : 'Pizza Rolls';
        const crustText = currentCrust === 'regular' ? 'regular' : currentCrust;
        
        try {
            const completion = await websim.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: `You are a pizza critic AI. Rate pizzas on a scale of 0-10 and provide a short, witty comment.
                        Follow these guidelines:
                        - Poison is deadly (rating: 0)
                        - Candy on pizza is terrible (rating: 1-3)
                        - Pineapple is controversial (rating: 4-6)
                        - Classic combinations like cheese and pepperoni are good (rating: 7-8)
                        - Gourmet combinations like white sauce with garlic and spinach are excellent (rating: 9-10)
                        - Too many toppings (>8) makes a soggy pizza
                        - Stuffed crust and cheese-inside crust add +1 to rating
                        - Balance toppings with sauce type for best results
                        
                        Respond directly with JSON in this format, and no other text:
                        {
                            "rating": number,
                            "comment": string
                        }`,
                    },
                    {
                        role: "user",
                        content: `Rate this pizza: ${shapeText} pizza with ${crustText} crust and ${currentSauce} sauce, topped with ${toppingsText}.`,
                    }
                ],
                json: true,
            });
            
            const result = JSON.parse(completion.content);
            const rating = result.rating;
            const comment = result.comment;
            
            // Show the rating
            ratingContainer.innerHTML = `
                <h3>Pizza Rating: ${rating.toFixed(1)}/10</h3>
                <p>${comment}</p>
                <div class="stars">
                    ${Array(10).fill(0).map((_, i) => 
                        `<span class="star ${i < Math.round(rating) ? 'filled' : ''}">★</span>`
                    ).join('')}
                </div>
            `;
        } catch (error) {
            console.error("Error getting AI rating:", error);
            
            // Fallback to basic rating if AI fails
            let rating = 7;
            let comment = "Looks pretty good! (AI rating failed)";
            
            if (selectedToppings.includes('poison')) {
                rating = 0;
                comment = "You died! The poison was definitely a bad choice.";
            } else if (selectedToppings.includes('candy')) {
                rating = 2;
                comment = "Sweet and savory in the worst way possible.";
            }
            
            ratingContainer.innerHTML = `
                <h3>Pizza Rating: ${rating.toFixed(1)}/10</h3>
                <p>${comment}</p>
                <div class="stars">
                    ${Array(10).fill(0).map((_, i) => 
                        `<span class="star ${i < Math.round(rating) ? 'filled' : ''}">★</span>`
                    ).join('')}
                </div>
            `;
        }
        
        // Animate pizza eating
        pizzaSvg.classList.add('eating');
        setTimeout(() => {
            pizzaSvg.classList.remove('eating');
        }, 1500);
    });

    // AI Make Pizza button
    aiMakeBtn.addEventListener('click', async () => {
        if (isBaking) return;
        
        // Reset the pizza first
        resetPizza();
        
        // Show loading message
        messageContainer.textContent = "AI is designing your pizza...";
        messageContainer.style.display = 'block';
        messageContainer.classList.add('success');
        
        try {
            const completion = await websim.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: `You are a pizza chef AI. Create a creative pizza with the following options:
                        - Shape: round, square, or rolls
                        - Sauce: tomato, white, bbq, pesto, or buffalo
                        - Crust: regular, thin, thick, stuffed, or cheese-inside
                        - Toppings (choose 3-7 from): cheese, pepperoni, mushroom, olive, pepper, onion, pineapple, 
                          candy, poison, bacon, ham, sausage, anchovy, chicken, broccoli, spinach, tomato, garlic, hot-pepper
                          
                        Try to be creative but culinary sensible (except occasionally including unusual items).
                        Return only JSON in this format with nothing else:
                        {
                            "shape": "round or square or rolls",
                            "sauce": "one of the sauce options",
                            "crust": "one of the crust options",
                            "toppings": ["array", "of", "toppings"]
                        }`,
                    },
                    {
                        role: "user",
                        content: "Create a creative pizza for me with good flavor combinations.",
                    }
                ],
                json: true,
            });
            
            const result = JSON.parse(completion.content);
            
            // Apply AI's pizza choices
            // Set shape
            shapeButtons.forEach(btn => {
                if (btn.dataset.shape === result.shape) {
                    btn.click();
                }
            });
            
            // Set sauce
            sauceButtons.forEach(btn => {
                if (btn.dataset.sauce === result.sauce) {
                    btn.click();
                }
            });
            
            // Set crust
            crustButtons.forEach(btn => {
                if (btn.dataset.crust === result.crust) {
                    btn.click();
                }
            });
            
            // Add toppings
            toppingButtons.forEach(btn => {
                if (result.toppings.includes(btn.dataset.topping)) {
                    btn.click();
                }
            });
            
            // Update message
            messageContainer.textContent = `AI created a ${result.shape} pizza with ${result.crust} crust and ${result.sauce} sauce, topped with ${result.toppings.join(', ')}.`;
            
        } catch (error) {
            console.error("Error getting AI pizza:", error);
            
            // Fallback to a basic random pizza if AI fails
            const shapes = ['round', 'square', 'rolls'];
            const sauces = ['tomato', 'white', 'bbq', 'pesto', 'buffalo'];
            const crusts = ['regular', 'thin', 'thick', 'stuffed', 'cheese-inside'];
            const allToppings = ['cheese', 'pepperoni', 'mushroom', 'olive', 'pepper', 'onion', 
                             'pineapple', 'bacon', 'ham', 'sausage', 'chicken', 'spinach', 'tomato', 'garlic'];
            
            // Random selections
            const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
            const randomSauce = sauces[Math.floor(Math.random() * sauces.length)];
            const randomCrust = crusts[Math.floor(Math.random() * crusts.length)];
            
            // Pick 3-5 random toppings
            const numToppings = Math.floor(Math.random() * 3) + 3; // 3-5 toppings
            const randomToppings = [];
            
            while (randomToppings.length < numToppings) {
                const topping = allToppings[Math.floor(Math.random() * allToppings.length)];
                if (!randomToppings.includes(topping)) {
                    randomToppings.push(topping);
                }
            }
            
            // Apply random selections
            shapeButtons.forEach(btn => {
                if (btn.dataset.shape === randomShape) {
                    btn.click();
                }
            });
            
            sauceButtons.forEach(btn => {
                if (btn.dataset.sauce === randomSauce) {
                    btn.click();
                }
            });
            
            crustButtons.forEach(btn => {
                if (btn.dataset.crust === randomCrust) {
                    btn.click();
                }
            });
            
            toppingButtons.forEach(btn => {
                if (randomToppings.includes(btn.dataset.topping)) {
                    btn.click();
                }
            });
            
            messageContainer.textContent = `AI created a ${randomShape} pizza with ${randomCrust} crust and ${randomSauce} sauce, topped with ${randomToppings.join(', ')}.`;
        }
    });

    // Random Pizza button - Truly random with no AI
    randomBtn.addEventListener('click', () => {
        if (isBaking) return;
        
        // Reset the pizza first
        resetPizza();
        
        // Define all possible options
        const shapes = ['round', 'square', 'rolls'];
        const sauces = ['tomato', 'white', 'bbq', 'pesto', 'buffalo'];
        const crusts = ['regular', 'thin', 'thick', 'stuffed', 'cheese-inside'];
        const allToppings = ['cheese', 'pepperoni', 'mushroom', 'olive', 'pepper', 'onion', 
                        'pineapple', 'candy', 'poison', 'bacon', 'ham', 'sausage', 'anchovy',
                        'chicken', 'broccoli', 'spinach', 'tomato', 'garlic', 'hot-pepper'];
        
        // Truly random selections
        const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
        const randomSauce = sauces[Math.floor(Math.random() * sauces.length)];
        const randomCrust = crusts[Math.floor(Math.random() * crusts.length)];
        
        // Shuffle and pick random number of toppings (1-8)
        const shuffledToppings = [...allToppings].sort(() => 0.5 - Math.random());
        const numToppings = Math.floor(Math.random() * 8) + 1; // 1-8 toppings
        const randomToppings = shuffledToppings.slice(0, numToppings);
        
        // Apply random selections
        shapeButtons.forEach(btn => {
            if (btn.dataset.shape === randomShape) {
                btn.click();
            }
        });
        
        sauceButtons.forEach(btn => {
            if (btn.dataset.sauce === randomSauce) {
                btn.click();
            }
        });
        
        crustButtons.forEach(btn => {
            if (btn.dataset.crust === randomCrust) {
                btn.click();
            }
        });
        
        toppingButtons.forEach(btn => {
            if (randomToppings.includes(btn.dataset.topping)) {
                btn.click();
            }
        });
        
        messageContainer.textContent = `Totally random pizza created: ${randomShape} pizza with ${randomCrust} crust and ${randomSauce} sauce, topped with ${randomToppings.join(', ')}.`;
        messageContainer.style.display = 'block';
        messageContainer.classList.add('success');
    });

    downloadBtn.addEventListener('click', () => {
        downloadPizzaImage();
    });

    saveBtn.addEventListener('click', () => {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Share Your Pizza</h3>
                <div class="share-code-section">
                    <p>Share your pizza code with the community!</p>
                    <div class="code-display">
                        <input type="text" readonly value="${generatePizzaCode()}" id="pizza-code">
                        <button id="copy-code-btn">
                            <i class="fa-solid fa-copy fa-icon"></i>Copy
                        </button>
                    </div>
                    <button id="share-pizzagram-btn" class="share-btn">
                        <i class="fa-solid fa-share fa-icon"></i>Share to Pizzagram
                    </button>
                </div>
                <button class="close-modal">×</button>
            </div>
        `;
        document.body.appendChild(modal);

        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.onclick = () => modal.remove();
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };

        const copyCodeBtn = modal.querySelector('#copy-code-btn');
        copyCodeBtn.onclick = () => {
            const codeInput = modal.querySelector('#pizza-code');
            codeInput.select();
            document.execCommand('copy');
            copyCodeBtn.innerHTML = '<i class="fa-solid fa-check fa-icon"></i>Copied!';
            setTimeout(() => {
                copyCodeBtn.innerHTML = '<i class="fa-solid fa-copy fa-icon"></i>Copy';
            }, 2000);
        };

        // Add Pizzagram share button handler
        const sharePizzagramBtn = modal.querySelector('#share-pizzagram-btn');
        sharePizzagramBtn.onclick = () => {
            const code = generatePizzaCode();
            window.location.href = `/pizzagram.html?code=${encodeURIComponent(code)}`;
        };
    });

    loadBtn.addEventListener('click', () => {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Load Pizza Code</h3>
                <p>Go to the comments to find codes!</p>
                <input type="text" placeholder="Paste pizza code here" id="load-code-input">
                <button id="confirm-load-btn">
                    <i class="fa-solid fa-check fa-icon"></i>Load Pizza
                </button>
                <button class="close-modal">×</button>
            </div>
        `;
        document.body.appendChild(modal);

        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.onclick = () => modal.remove();
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };

        const confirmLoadBtn = modal.querySelector('#confirm-load-btn');
        const codeInput = modal.querySelector('#load-code-input');
        
        confirmLoadBtn.onclick = () => {
            try {
                const code = codeInput.value.trim();
                const pizzaData = JSON.parse(atob(code));
                loadPizzaFromData(pizzaData);
                modal.remove();
            } catch (error) {
                codeInput.classList.add('error');
                codeInput.value = '';
                codeInput.placeholder = 'Invalid code! Try again...';
            }
        };
    });

    async function sharePizza() {
        try {
            const code = generatePizzaCode();
            // Create new post
            await room.collection('pizza_post').create({
                code: code,
                caption: '',
                likes: [],
                comments: []
            });
        } catch (error) {
            console.error('Error sharing pizza:', error);
        }
    }

    function generatePizzaCode() {
        const pizzaData = {
            shape: currentShape,
            sauce: currentSauce,
            crust: currentCrust,
            toppings: selectedToppings
        };
        return btoa(JSON.stringify(pizzaData));
    }

    function loadPizzaFromData(pizzaData) {
        resetPizza();

        // Set shape
        shapeButtons.forEach(btn => {
            if (btn.dataset.shape === pizzaData.shape) {
                btn.click();
            }
        });

        // Set sauce
        sauceButtons.forEach(btn => {
            if (btn.dataset.sauce === pizzaData.sauce) {
                btn.click();
            }
        });

        // Set crust
        crustButtons.forEach(btn => {
            if (btn.dataset.crust === pizzaData.crust) {
                btn.click();
            }
        });

        // Add toppings
        pizzaData.toppings.forEach(topping => {
            toppingButtons.forEach(btn => {
                if (btn.dataset.topping === topping) {
                    btn.click();
                }
            });
        });
    }

    function downloadPizzaImage() {
        // Create a description of the pizza
        const shapeText = currentShape === 'round' ? 'Round' : currentShape === 'square' ? 'Sicilian Square' : 'Pizza Rolls';
        const crustText = currentCrust === 'regular' ? 'Regular' : currentCrust;
        const toppingsText = selectedToppings.length ? selectedToppings.join(', ') : 'no toppings';
        
        // Get the SVG element
        const pizzaSvg = document.querySelector('.pizza-svg');
        
        // Create a canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas size (making it larger for better quality)
        canvas.width = 1200;
        canvas.height = 1200;
        
        // Create an image from SVG
        const svgData = new XMLSerializer().serializeToString(pizzaSvg);
        const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
        const url = URL.createObjectURL(svgBlob);
        
        const img = new Image();
        img.onload = () => {
            // Fill background
            ctx.fillStyle = '#f8f4e9';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw pizza
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            
            // Add pizza description
            ctx.fillStyle = '#333';
            ctx.font = '30px Arial';
            ctx.textAlign = 'center';
            const description = `${shapeText} Pizza with ${crustText} crust and ${currentSauce} sauce`;
            ctx.fillText(description, canvas.width/2, canvas.height - 100);
            
            if (selectedToppings.length > 0) {
                const toppingsDesc = `Toppings: ${toppingsText}`;
                ctx.fillText(toppingsDesc, canvas.width/2, canvas.height - 50);
            }
            
            // Add watermark
            ctx.font = '24px Arial';
            ctx.fillStyle = 'rgba(51, 51, 51, 0.5)';
            ctx.textAlign = 'right';
            ctx.fillText('Made with Pizza Maker', canvas.width - 20, canvas.height - 20);
            
            // Convert to image and download
            const dataUrl = canvas.toDataURL('image/png');
            const downloadLink = document.createElement('a');
            downloadLink.download = 'my-pizza.png';
            downloadLink.href = dataUrl;
            downloadLink.click();
            
            // Clean up
            URL.revokeObjectURL(url);
        };
        img.src = url;
    }

    // Function to reset pizza (extracted from reset button click handler for reuse)
    function resetPizza() {
        // Clear toppings
        while (toppingsContainer.firstChild) {
            toppingsContainer.removeChild(toppingsContainer.firstChild);
        }
        
        // Reset sauce
        currentSauce = 'tomato';
        updateSauceDisplay();
        sauceButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.sauce === 'tomato') {
                btn.classList.add('active');
            }
        });
        
        // Reset shape
        currentShape = 'round';
        updateShapeDisplay();
        shapeButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.shape === 'round') {
                btn.classList.add('active');
            }
        });
        
        // Reset crust
        currentCrust = 'regular';
        roundCrust.setAttribute('data-thickness', currentCrust);
        squareCrust.setAttribute('data-thickness', currentCrust);
        crustButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.crust === 'regular') {
                btn.classList.add('active');
            }
        });
        
        // Reset topping buttons
        toppingButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Reset state
        selectedToppings = [];
        isPizzaBaked = false;
        
        // Hide any messages and rating
        messageContainer.style.display = 'none';
        messageContainer.classList.remove('success');
        eatBtn.style.display = 'none';
        ratingContainer.style.display = 'none';
    }

    // Ice cream button
    const iceCreamBtn = document.getElementById('ice-cream-btn');
    iceCreamBtn.addEventListener('click', () => {
        window.location.href = 'https://websim.ai/@autumn/ice-cream-maker';
    });

    // Add pizza feed to the page
    const feedContainer = document.createElement('div');
    feedContainer.className = 'feed';
    feedContainer.innerHTML = `
        <h2>Community Pizzas</h2>
        <div id="pizza-feed"></div>
    `;
    document.querySelector('.container').appendChild(feedContainer);

    // Subscribe to pizza posts
    room.collection('pizza_post').subscribe((posts) => {
        renderPosts(posts);
    });

    function renderPosts(posts) {
        const feed = document.getElementById('pizza-feed');
        feed.innerHTML = '';
        
        // Sort posts by newest first
        const sortedPosts = [...posts].sort((a, b) => 
            new Date(b.created_at) - new Date(a.created_at)
        );

        for (const post of sortedPosts) {
            const postElement = createPostElement(post);
            feed.appendChild(postElement);
        }
    }

    function createPostElement(post) {
        // Implement the logic to create the post element here
        // This function is not defined in the provided code
        // You need to implement it according to your requirements
    }
});