// UI interaction for the ice cream maker app
import iceCreamState from './iceCreamState.js';
import config from './config.js';

document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const iceCreamSvg = document.querySelector('.ice-cream-svg');
    const toppingsContainer = document.querySelector('.toppings-container');
    const scoops = document.querySelectorAll('.scoop');
    const cones = document.querySelectorAll('.cone');
    
    const coneButtons = document.querySelectorAll('.cone-btn');
    const scoopButtons = document.querySelectorAll('.scoop-btn');
    const flavorButtons = document.querySelectorAll('.flavor-btn');
    const toppingButtons = document.querySelectorAll('.topping-btn');
    const scoopLabels = document.querySelectorAll('.scoop-label');
    
    const resetBtn = document.getElementById('reset-btn');
    const serveBtn = document.getElementById('serve-btn');
    const randomBtn = document.getElementById('random-btn');
    const eatBtn = document.getElementById('eat-btn');
    const messageContainer = document.getElementById('message-container');
    const ratingContainer = document.getElementById('rating-container');

    // Initialize UI based on initial state
    updateUI();

    // Event Listeners
    
    // Cone selection
    coneButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (iceCreamState.isServing) return;
            
            coneButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            iceCreamState.setConeType(btn.dataset.cone);
            updateConeDisplay();
        });
    });
    
    // Scoop count selection
    scoopButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (iceCreamState.isServing) return;
            
            scoopButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const scoopCount = parseInt(btn.dataset.scoops);
            iceCreamState.setScoopCount(scoopCount);
            updateScoopDisplay();
            updateScoopLabelVisibility();
        });
    });
    
    // Scoop selection for flavor
    scoopLabels.forEach(label => {
        label.addEventListener('click', () => {
            if (iceCreamState.isServing) return;
            
            scoopLabels.forEach(l => l.classList.remove('active'));
            label.classList.add('active');
            
            const scoopNumber = parseInt(label.dataset.scoop);
            iceCreamState.setCurrentScoopSelection(scoopNumber);
            updateFlavorButtonsForCurrentScoop();
        });
    });
    
    // Flavor selection
    flavorButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (iceCreamState.isServing) return;
            
            flavorButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const flavor = btn.dataset.flavor;
            const currentScoop = iceCreamState.currentScoopSelection;
            iceCreamState.setFlavorForScoop(currentScoop, flavor);
            updateScoopFlavors();
        });
    });
    
    // Topping selection
    toppingButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (iceCreamState.isServing) return;
            
            const topping = btn.dataset.topping;
            
            if (btn.classList.contains('active')) {
                // Remove topping
                btn.classList.remove('active');
                iceCreamState.removeTopping(topping);
                removeToppingFromIceCream(topping);
                
                if (topping === 'poison') {
                    iceCreamSvg.classList.remove('poison-effect');
                }
            } else {
                // Add topping
                btn.classList.add('active');
                iceCreamState.addTopping(topping);
                addToppingToIceCream(topping);
                
                if (topping === 'poison') {
                    iceCreamSvg.classList.add('poison-effect');
                }
            }
        });
    });
    
    // Reset button
    resetBtn.addEventListener('click', () => {
        if (iceCreamState.isServing) return;
        resetIceCream();
    });
    
    // Random button
    randomBtn.addEventListener('click', () => {
        if (iceCreamState.isServing) return;
        
        // Generate random ice cream
        iceCreamState.generateRandomIceCream();
        
        // Update UI to match new state
        resetUI();
        updateUI();
        
        // Apply random toppings
        toppingButtons.forEach(btn => {
            const topping = btn.dataset.topping;
            if (iceCreamState.selectedToppings.includes(topping)) {
                btn.classList.add('active');
                addToppingToIceCream(topping);
            } else {
                btn.classList.remove('active');
            }
        });
    });

    // Serve button
    serveBtn.addEventListener('click', () => {
        if (iceCreamState.isServing) return;
        
        // Start serving animation
        iceCreamState.isServing = true;
        iceCreamSvg.classList.add('serving');
        
        // Disable controls
        disableControls(true);
        
        // After "serving" is done
        setTimeout(() => {
            // Stop animation
            iceCreamSvg.classList.remove('serving');
            
            // Show success message
            let toppingsText = iceCreamState.selectedToppings.length ? 
                `with ${iceCreamState.selectedToppings.join(', ')}` : 
                'with no toppings';
                
            let scoopDescription = '';
            if (iceCreamState.scoopCount === 1) {
                scoopDescription = iceCreamState.flavors[1];
            } else {
                let flavorsList = [];
                for (let i = 1; i <= iceCreamState.scoopCount; i++) {
                    flavorsList.push(iceCreamState.flavors[i]);
                }
                scoopDescription = flavorsList.join(', ');
            }
                
            messageContainer.textContent = `Your delicious ${scoopDescription} ice cream ${toppingsText} is ready to enjoy!`;
            messageContainer.style.display = 'block';
            messageContainer.classList.add('success');
            
            // Re-enable controls
            disableControls(false);
            
            iceCreamState.isServing = false;
        }, config.servingDuration);
    });
    
    // Eat button
    eatBtn.addEventListener('click', () => {
        if (iceCreamState.isServing) return;
        
        // Hide previous messages
        messageContainer.style.display = 'none';
        
        // Check for poison
        if (iceCreamState.hasPoison) {
            ratingContainer.innerHTML = `<h3>Ice Cream Rating</h3>
                <p>Uh oh! That poison topping was a bad idea... 💀</p>
                <p>Rating: 0/5 stars</p>
                <div class="rating-stars">☠️☠️☠️☠️☠️</div>
                <p>Please try again without the poison!</p>`;
            ratingContainer.style.display = 'block';
            return;
        }
        
        // Generate a rating based on combination
        let baseScore = Math.floor(Math.random() * 3) + 3; // Base 3-5 score
        let comments = [];
        
        // Adjust for selected items
        if (iceCreamState.selectedToppings.length === 0) {
            baseScore = Math.max(baseScore - 1, 1);
            comments.push("A bit plain with no toppings.");
        }
        
        if (iceCreamState.selectedToppings.length > 5) {
            baseScore = Math.max(baseScore - 1, 1);
            comments.push("Whoa, that's a lot of toppings!");
        }
        
        // Adjust for scoop count
        if (iceCreamState.scoopCount > 1) {
            comments.push(`Impressive ${iceCreamState.scoopCount}-scoop ice cream tower!`);
            if (iceCreamState.scoopCount === 3) {
                baseScore = Math.min(baseScore + 1, 5);
            }
        }
        
        // Adjust for cone type
        if (iceCreamState.coneType === 'waffle-cup') {
            comments.push("The waffle cup adds a nice touch.");
        } else if (iceCreamState.coneType === 'cup') {
            comments.push("A cup keeps it neat and tidy.");
        } else {
            comments.push("Classic waffle cone - always a winner!");
        }
        
        // Flavor combinations
        if (iceCreamState.scoopCount > 1) {
            let flavorSet = new Set();
            for (let i = 1; i <= iceCreamState.scoopCount; i++) {
                flavorSet.add(iceCreamState.flavors[i]);
            }
            
            if (flavorSet.size === 1) {
                comments.push(`The ${iceCreamState.flavors[1]} scoops work well together.`);
            } else if (
                (flavorSet.has('chocolate') && flavorSet.has('mint')) ||
                (flavorSet.has('coffee') && flavorSet.has('chocolate')) ||
                (flavorSet.has('strawberry') && flavorSet.has('vanilla'))
            ) {
                comments.push("Great flavor combination!");
                baseScore = Math.min(baseScore + 1, 5);
            }
        }
        
        // Topping combinations
        if (iceCreamState.selectedToppings.includes('cherry') && iceCreamState.selectedToppings.includes('chocolate-chips')) {
            comments.push("Cherry and chocolate - a perfect combo!");
            baseScore = Math.min(baseScore + 1, 5);
        }
        
        if (iceCreamState.selectedToppings.includes('caramel') && iceCreamState.selectedToppings.includes('nuts')) {
            comments.push("Caramel and nuts together are amazing!");
            baseScore = Math.min(baseScore + 1, 5);
        }
        
        // Random interesting comment
        const funComments = [
            "I'd definitely order this again!",
            "Creative combination!",
            "This would be perfect on a hot day.",
            "Texture and flavor balance is nice.",
            "A very photogenic ice cream!"
        ];
        
        comments.push(funComments[Math.floor(Math.random() * funComments.length)]);
        
        // Create the rating stars
        let stars = '';
        for (let i = 0; i < 5; i++) {
            stars += i < baseScore ? '⭐' : '☆';
        }
        
        // Display the rating
        ratingContainer.innerHTML = `<h3>Ice Cream Rating</h3>
            <p>${comments[0]}</p>
            <p>${comments.length > 1 ? comments[1] : ''}</p>
            <p>Rating: ${baseScore}/5 stars</p>
            <div class="rating-stars">${stars}</div>
            <p>${comments.length > 2 ? comments[2] : ''}</p>`;
        ratingContainer.style.display = 'block';
    });
    
    // Helper functions
    
    function updateUI() {
        updateConeDisplay();
        updateScoopDisplay();
        updateScoopFlavors();
        updateScoopLabelVisibility();
        updateFlavorButtonsForCurrentScoop();
    }
    
    function updateConeDisplay() {
        cones.forEach(cone => {
            cone.style.display = 'none';
        });
        
        const activeCone = document.querySelector(`.${iceCreamState.coneType}-cone`);
        if (activeCone) {
            activeCone.style.display = 'block';
        }
    }
    
    function updateScoopDisplay() {
        scoops.forEach((scoop, index) => {
            const scoopNumber = index + 1;
            scoop.style.display = scoopNumber <= iceCreamState.scoopCount ? 'block' : 'none';
        });
    }
    
    function updateScoopFlavors() {
        scoops.forEach((scoop, index) => {
            const scoopNumber = index + 1;
            scoop.setAttribute('data-flavor', iceCreamState.flavors[scoopNumber]);
        });
    }
    
    function updateScoopLabelVisibility() {
        scoopLabels.forEach(label => {
            const scoopNumber = parseInt(label.dataset.scoop);
            label.style.display = scoopNumber <= iceCreamState.scoopCount ? 'block' : 'none';
            
            // Make sure we're not selecting a hidden scoop
            if (iceCreamState.currentScoopSelection > iceCreamState.scoopCount) {
                iceCreamState.setCurrentScoopSelection(1);
                scoopLabels.forEach(l => l.classList.remove('active'));
                document.querySelector('.scoop-label[data-scoop="1"]').classList.add('active');
            }
        });
    }
    
    function updateFlavorButtonsForCurrentScoop() {
        const currentFlavor = iceCreamState.getFlavorForCurrentScoop();
        flavorButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.flavor === currentFlavor) {
                btn.classList.add('active');
            }
        });
    }
    
    function resetUI() {
        // Clear toppings
        while (toppingsContainer.firstChild) {
            toppingsContainer.removeChild(toppingsContainer.firstChild);
        }
        
        // Reset UI elements to match default state
        coneButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.cone === iceCreamState.coneType) {
                btn.classList.add('active');
            }
        });
        
        scoopButtons.forEach(btn => {
            btn.classList.remove('active');
            if (parseInt(btn.dataset.scoops) === iceCreamState.scoopCount) {
                btn.classList.add('active');
            }
        });
        
        scoopLabels.forEach(label => {
            label.classList.remove('active');
            if (parseInt(label.dataset.scoop) === iceCreamState.currentScoopSelection) {
                label.classList.add('active');
            }
        });
        
        // Hide any messages
        messageContainer.style.display = 'none';
        messageContainer.classList.remove('success');
        ratingContainer.style.display = 'none';
        
        // Reset poison effect
        iceCreamSvg.classList.remove('poison-effect');
    }
    
    function resetIceCream() {
        iceCreamState.reset();
        resetUI();
        updateUI();
        
        // Reset all topping buttons
        toppingButtons.forEach(btn => {
            btn.classList.remove('active');
        });
    }
    
    function disableControls(disabled) {
        coneButtons.forEach(btn => btn.disabled = disabled);
        scoopButtons.forEach(btn => btn.disabled = disabled);
        flavorButtons.forEach(btn => btn.disabled = disabled);
        toppingButtons.forEach(btn => btn.disabled = disabled);
        resetBtn.disabled = disabled;
        serveBtn.disabled = disabled;
        randomBtn.disabled = disabled;
        eatBtn.disabled = disabled;
    }
    
    // Copied and slightly modified from the original script.js
    function addToppingToIceCream(toppingType) {
        // Define number of topping pieces based on type
        let count;
        let size;
        
        switch(toppingType) {
            case 'sprinkles':
                count = 30;
                size = 5;
                break;
            case 'chocolate-chips':
                count = 15;
                size = 6;
                break;
            case 'cookie':
                count = 10;
                size = 10;
                break;
            case 'cherry':
                count = 1;
                size = 15;
                break;
            case 'nuts':
                count = 18;
                size = 8;
                break;
            case 'caramel':
                count = 6;
                size = 15;
                break;
            case 'poison':
                count = 8;
                size = 7;
                break;
            case 'gummy-bears':
                count = 12;
                size = 12;
                break;
            case 'oreo':
                count = 14;
                size = 8;
                break;
            case 'marshmallow':
                count = 10;
                size = 12;
                break;
            case 'brownie':
                count = 12;
                size = 10;
                break;
            case 'waffle':
                count = 8;
                size = 15;
                break;
            case 'fruit':
                count = 15;
                size = 9;
                break;
            case 'coconut':
                count = 25;
                size = 4;
                break;
            case 'm&ms':
                count = 20;
                size = 6;
                break;
            case 'honey':
                count = 5;
                size = 12;
                break;
            case 'cinnamon':
                count = 22;
                size = 3;
                break;
            default:
                count = 15;
                size = 8;
        }

        // Create a group for this topping type
        const toppingGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        toppingGroup.classList.add('topping', toppingType);
        toppingGroup.setAttribute('data-topping', toppingType);

        // Adjust position based on scoop count
        let yOffset = 100;
        if (iceCreamState.scoopCount === 2) {
            yOffset = 70;
        } else if (iceCreamState.scoopCount === 3) {
            yOffset = 40;
        }

        // Add topping pieces
        if (toppingType === 'cherry') {
            // Single cherry on top
            const cherry = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            cherry.setAttribute('cx', 150);
            cherry.setAttribute('cy', yOffset - 30);
            cherry.setAttribute('r', size/2);
            
            const stem = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            stem.setAttribute('d', `M150,${yOffset-30} C150,${yOffset-40} 160,${yOffset-50} 170,${yOffset-55}`);
            stem.setAttribute('stroke', '#006400');
            stem.setAttribute('stroke-width', 2);
            stem.setAttribute('fill', 'none');
            
            toppingGroup.appendChild(cherry);
            toppingGroup.appendChild(stem);
        } else if (toppingType === 'poison') {
            // Poison droplets
            for (let i = 0; i < count; i++) {
                const x = 150 + (Math.random() - 0.5) * 80;
                const y = yOffset + (Math.random() - 0.5) * 40;
                
                const droplet = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                droplet.setAttribute('d', `M${x},${y-size/2} C${x+size/2},${y-size/4} ${x+size/2},${y+size/4} ${x},${y+size/2} C${x-size/2},${y+size/4} ${x-size/2},${y-size/4} ${x},${y-size/2}Z`);
                toppingGroup.appendChild(droplet);
            }
        } else if (toppingType === 'honey' || toppingType === 'caramel') {
            // Dripping pattern
            for (let i = 0; i < count; i++) {
                const startX = 150 - 40 + Math.random() * 80;
                const startY = yOffset - 20;
                const endY = yOffset + 20;
                
                const drip = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                drip.setAttribute('d', `M${startX},${startY} C${startX+10},${startY+15} ${startX-10},${endY-15} ${startX},${endY}`);
                drip.setAttribute('stroke', toppingType === 'honey' ? '#FFA500' : '#cd853f');
                drip.setAttribute('stroke-width', 3);
                drip.setAttribute('fill', 'none');
                
                toppingGroup.appendChild(drip);
            }
        } else {
            for (let i = 0; i < count; i++) {
                // Position within ice cream
                const x = 150 + (Math.random() - 0.5) * 80;
                const y = yOffset + (Math.random() - 0.5) * 40;

                // Create the topping shape based on type
                let toppingElement;
                
                if (toppingType === 'sprinkles') {
                    toppingElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                    toppingElement.setAttribute('x', x - size/2);
                    toppingElement.setAttribute('y', y - size/4);
                    toppingElement.setAttribute('width', size);
                    toppingElement.setAttribute('height', size/2);
                    toppingElement.setAttribute('rx', 1);
                    toppingElement.setAttribute('transform', `rotate(${Math.random() * 360} ${x} ${y})`);
                } else if (['chocolate-chips', 'm&ms'].includes(toppingType)) {
                    toppingElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                    toppingElement.setAttribute('cx', x);
                    toppingElement.setAttribute('cy', y);
                    toppingElement.setAttribute('r', size/2);
                } else if (['cookie', 'brownie', 'waffle'].includes(toppingType)) {
                    toppingElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                    toppingElement.setAttribute('x', x - size/2);
                    toppingElement.setAttribute('y', y - size/2);
                    toppingElement.setAttribute('width', size);
                    toppingElement.setAttribute('height', size);
                    toppingElement.setAttribute('rx', toppingType === 'waffle' ? 0 : 2);
                    toppingElement.setAttribute('transform', `rotate(${Math.random() * 360} ${x} ${y})`);
                } else if (['nuts', 'gummy-bears'].includes(toppingType)) {
                    toppingElement = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
                    toppingElement.setAttribute('cx', x);
                    toppingElement.setAttribute('cy', y);
                    toppingElement.setAttribute('rx', size/2);
                    toppingElement.setAttribute('ry', size/3);
                    toppingElement.setAttribute('transform', `rotate(${Math.random() * 360} ${x} ${y})`);
                } else if (['oreo', 'marshmallow', 'fruit', 'coconut', 'cinnamon'].includes(toppingType)) {
                    if (toppingType === 'oreo') {
                        // Oreo cookie shape
                        toppingElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                        toppingElement.setAttribute('cx', x);
                        toppingElement.setAttribute('cy', y);
                        toppingElement.setAttribute('r', size/2);
                    } else if (toppingType === 'marshmallow') {
                        // Marshmallow shape
                        toppingElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                        toppingElement.setAttribute('x', x - size/2);
                        toppingElement.setAttribute('y', y - size/2);
                        toppingElement.setAttribute('width', size);
                        toppingElement.setAttribute('height', size);
                        toppingElement.setAttribute('rx', size/3);
                    } else if (toppingType === 'fruit') {
                        // Fruit shape
                        toppingElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                        toppingElement.setAttribute('cx', x);
                        toppingElement.setAttribute('cy', y);
                        toppingElement.setAttribute('r', size/2);
                    } else if (toppingType === 'coconut') {
                        // Coconut flake shape
                        toppingElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                        toppingElement.setAttribute('x', x - size/2);
                        toppingElement.setAttribute('y', y - size/4);
                        toppingElement.setAttribute('width', size);
                        toppingElement.setAttribute('height', size/2);
                        toppingElement.setAttribute('rx', 1);
                        toppingElement.setAttribute('transform', `rotate(${Math.random() * 360} ${x} ${y})`);
                    } else if (toppingType === 'cinnamon') {
                        // Cinnamon shape
                        toppingElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                        toppingElement.setAttribute('x', x - size/2);
                        toppingElement.setAttribute('y', y - size/4);
                        toppingElement.setAttribute('width', size);
                        toppingElement.setAttribute('height', size/4);
                        toppingElement.setAttribute('transform', `rotate(${Math.random() * 360} ${x} ${y})`);
                    }
                }

                toppingGroup.appendChild(toppingElement);
            }
        }

        toppingsContainer.appendChild(toppingGroup);
    }

    // Copied from original script.js
    function removeToppingFromIceCream(toppingType) {
        const toppingGroup = toppingsContainer.querySelector(`g[data-topping="${toppingType}"]`);
        if (toppingGroup) {
            toppingsContainer.removeChild(toppingGroup);
        }
    }
});