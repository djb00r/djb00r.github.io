// State management for the ice cream maker app
import config from './config.js';

class IceCreamState {
    constructor() {
        this.coneType = config.defaultConeType;
        this.scoopCount = config.defaultScoopCount;
        this.flavors = {
            1: config.defaultFlavor,
            2: config.defaultFlavor,
            3: config.defaultFlavor
        };
        this.selectedToppings = [];
        this.isServing = false;
        this.hasPoison = false;
        this.currentScoopSelection = 1;
    }
    
    setConeType(type) {
        this.coneType = type;
    }
    
    setScoopCount(count) {
        this.scoopCount = count;
    }
    
    setFlavorForScoop(scoopNumber, flavor) {
        this.flavors[scoopNumber] = flavor;
    }
    
    addTopping(topping) {
        if (!this.selectedToppings.includes(topping)) {
            this.selectedToppings.push(topping);
            
            if (topping === 'poison') {
                this.hasPoison = true;
            }
        }
    }
    
    removeTopping(topping) {
        this.selectedToppings = this.selectedToppings.filter(t => t !== topping);
        
        if (topping === 'poison') {
            this.hasPoison = false;
        }
    }
    
    setCurrentScoopSelection(scoopNumber) {
        this.currentScoopSelection = scoopNumber;
    }
    
    reset() {
        this.coneType = config.defaultConeType;
        this.scoopCount = config.defaultScoopCount;
        this.flavors = {
            1: config.defaultFlavor,
            2: config.defaultFlavor,
            3: config.defaultFlavor
        };
        this.selectedToppings = [];
        this.isServing = false;
        this.hasPoison = false;
        this.currentScoopSelection = 1;
    }
    
    getFlavorForCurrentScoop() {
        return this.flavors[this.currentScoopSelection];
    }
    
    generateRandomIceCream() {
        // Random cone type
        const coneTypes = ['triangle', 'waffle-cup', 'cup'];
        this.coneType = coneTypes[Math.floor(Math.random() * coneTypes.length)];
        
        // Random scoop count
        this.scoopCount = Math.floor(Math.random() * 3) + 1;
        
        // Random flavors for each scoop
        const flavors = [
            'vanilla', 'chocolate', 'strawberry', 'mint', 'coffee', 
            'bubblegum', 'pistachio', 'mango', 'blueberry', 'cotton-candy',
            'pumpkin', 'black-sesame', 'birthday-cake'
        ];
        
        for (let i = 1; i <= this.scoopCount; i++) {
            this.flavors[i] = flavors[Math.floor(Math.random() * flavors.length)];
        }
        
        // Random toppings (1-3)
        this.selectedToppings = [];
        this.hasPoison = false;
        
        const allToppings = [
            'sprinkles', 'chocolate-chips', 'cookie', 'cherry', 'nuts',
            'caramel', 'gummy-bears', 'oreo', 'marshmallow', 'brownie',
            'waffle', 'fruit', 'coconut', 'm&ms', 'honey', 'cinnamon'
        ];
        
        const numToppings = Math.floor(Math.random() * 3) + 1;
        const shuffledToppings = [...allToppings].sort(() => 0.5 - Math.random());
        
        for (let i = 0; i < numToppings; i++) {
            this.selectedToppings.push(shuffledToppings[i]);
        }
    }
}

// Create and export a singleton instance
const iceCreamState = new IceCreamState();
export default iceCreamState;