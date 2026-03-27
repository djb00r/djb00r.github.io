document.addEventListener('DOMContentLoaded', function() {
    const slider = document.getElementById('year-slider');
    const yearDisplay = document.getElementById('year');
    const building = document.getElementById('building');
    const mainLogo = document.getElementById('main-logo');
    const babiesLogo = document.getElementById('babies-logo');
    const infoTitle = document.getElementById('info-title');
    const infoDescription = document.getElementById('info-description');
    const comparisonOverlay = document.getElementById('comparison-overlay');

    // Add event listener to close the overlay when clicked
    comparisonOverlay.addEventListener('click', function() {
        comparisonOverlay.style.display = 'none';
    });

    // Store data for each year
    const yearData = [
        {
            year: 1999,
            buildingClass: 'brick-building worldgreen-plaza',
            title: '1999: Former Building For Sale',
            description: 'An old red brick building is for sale in the Worldgreen Plaza, which was established in 1978.',
            mainLogo: false,
            babiesLogo: false,
            cars: 'none'
        },
        {
            year: 2000,
            buildingClass: 'sold worldgreen-plaza',
            title: '2000: Land Purchased by Toys R Us',
            description: 'Toys R Us has purchased this plot in the Worldgreen Plaza for future development.',
            mainLogo: false,
            babiesLogo: false,
            cars: 'construction'
        },
        {
            year: 2002,
            buildingClass: 'construction coming-soon worldgreen-plaza',
            title: '2002: Toys R Us Coming Soon',
            description: 'Construction is underway with a "Coming Soon" banner. Toys R Us will be opening at this location in the Worldgreen Plaza.',
            mainLogo: false,
            babiesLogo: false,
            cars: 'construction'
        },
        {
            year: 2003,
            buildingClass: 'construction worldgreen-plaza',
            title: '2003: New Construction',
            description: 'Something new is being built. The foundation is laid for a future Toys R Us store in the Worldgreen Plaza.',
            mainLogo: false,
            babiesLogo: false,
            cars: 'some'
        },
        {
            year: 2005,
            buildingClass: 'completed worldgreen-plaza',
            title: '2005: Grand Opening',
            description: 'The Toys R Us store is now finished and open for business with its iconic blue facade in the Worldgreen Plaza.',
            mainLogo: true,
            babiesLogo: false,
            cars: 'some'
        },
        {
            year: 2007,
            buildingClass: 'completed wii-release worldgreen-plaza',
            title: '2007: Wii Console Release',
            description: 'The store is packed with shoppers for the Nintendo Wii release. Special banners and promotional displays line the store entrance.',
            mainLogo: true,
            babiesLogo: false,
            cars: 'many'
        },
        {
            year: 2012,
            buildingClass: 'redesigned',
            title: '2012: Store Redesign',
            description: 'The Toys R Us store has been redesigned with a more modern look and white facade.',
            mainLogo: true,
            babiesLogo: false,
            cars: 'some'
        },
        {
            year: 2013,
            buildingClass: 'redesigned',
            title: '2013: Babies R Us Added',
            description: 'A Babies R Us section has been added to the store, expanding its offerings.',
            mainLogo: true,
            babiesLogo: true,
            cars: 'few'
        },
        {
            year: 2017,
            buildingClass: 'shutting-down',
            title: '2017: Shutting Down',
            description: 'The store is now shutting down with "Going Out of Business" signs as the company faces financial difficulties.',
            mainLogo: true,
            babiesLogo: true,
            cars: 'many'
        },
        {
            year: 2018,
            buildingClass: 'closed for-sale',
            title: '2018: Out of Business & For Sale',
            description: 'Toys R Us has gone out of business. The store is empty and for sale again.',
            mainLogo: false,
            babiesLogo: false,
            cars: 'none'
        },
        {
            year: 2019,
            buildingClass: 'ollies-coming-soon',
            title: '2019: Ollie\'s Coming Soon',
            description: 'The property has been purchased by Ollie\'s Bargain Outlet. A "Coming Soon" banner indicates the new store is on its way.',
            mainLogo: false,
            babiesLogo: false,
            olliesLogo: true,
            cars: 'construction'
        },
        {
            year: 2020,
            buildingClass: 'ollies',
            title: '2020: Ollie\'s Bargain Outlet',
            description: 'The former Toys R Us location has now been converted into an Ollie\'s Bargain Outlet store with a red roof and branded design.',
            mainLogo: false,
            babiesLogo: false,
            olliesLogo: true,
            cars: 'quarter'
        },
        {
            year: 2025,
            buildingClass: 'ollies',
            title: '2025: Present Day',
            description: 'The Ollie\'s Bargain Outlet continues to operate at this location to this day.',
            mainLogo: false,
            babiesLogo: false,
            olliesLogo: true,
            cars: 'quarter'
        }
    ];

    // Update content based on slider value
    function updateContent() {
        const index = parseInt(slider.value);
        const data = yearData[index];
        
        // Update year display
        yearDisplay.textContent = data.year;
        
        // Update building class
        building.className = 'building ' + data.buildingClass;
        
        // Update logos
        mainLogo.style.opacity = data.mainLogo ? '1' : '0';
        babiesLogo.style.opacity = data.babiesLogo ? '1' : '0';
        
        // Change main logo to Ollie's if applicable
        if (data.olliesLogo) {
            mainLogo.style.backgroundImage = 'url("ollies_logo.png")';
            mainLogo.style.opacity = '1';
        } else {
            mainLogo.style.backgroundImage = 'url("toysrus_logo.png")';
        }
        
        // Update information panel
        infoTitle.textContent = data.title;
        infoDescription.textContent = data.description;
        
        // Update cars in parking lot
        updateCars(data.cars);
    }
    
    // Function to update cars in the parking lot
    function updateCars(carStatus) {
        const parkingLot = document.querySelector('.parking-lot');
        parkingLot.innerHTML = ''; // Clear existing cars
        
        let carCount = 0;
        
        switch(carStatus) {
            case 'none':
                carCount = 0;
                break;
            case 'construction':
                for (let i = 0; i < 3; i++) {
                    const constructionVehicle = document.createElement('div');
                    constructionVehicle.className = 'car construction-vehicle';
                    constructionVehicle.style.backgroundImage = 'url("constructioncar.png")';
                    constructionVehicle.style.left = (Math.random() * 400 + 50) + 'px';
                    constructionVehicle.style.bottom = (Math.random() * 30 + 5) + 'px';
                    parkingLot.appendChild(constructionVehicle);
                }
                break;
            case 'some':
                carCount = 6;
                break;
            case 'few':
                carCount = 4;
                break;
            case 'many':
                carCount = 12;
                break;
            case 'quarter':
                carCount = 3;
                break;
        }
        
        // Add regular cars
        for (let i = 0; i < carCount; i++) {
            const car = document.createElement('div');
            
            const carImages = ['redcar.png', 'bluecar.png', 'blackcar.png', 'whitecar.png', 'jeepcar.png', 'greycar.png', 'bus.png'];
            const randomCar = carImages[Math.floor(Math.random() * carImages.length)];
            car.className = 'car';
            car.style.backgroundImage = `url('${randomCar}')`;
            
            car.style.left = (Math.random() * 400 + 50) + 'px';
            car.style.bottom = (Math.random() * 30 + 5) + 'px';
            
            const rotation = Math.random() * 10 - 5;
            car.style.transform = `rotate(${rotation}deg)`;
            
            parkingLot.appendChild(car);
        }
    }
    
    // Initialize with default values
    updateContent();
    
    // Add event listener for slider changes
    slider.addEventListener('input', updateContent);
});