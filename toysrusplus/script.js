document.addEventListener('DOMContentLoaded', function() {
    const slider = document.getElementById('year-slider');
    const yearDisplay = document.getElementById('year');
    const building = document.getElementById('building');
    const mainLogo = document.getElementById('main-logo');
    const babiesLogo = document.getElementById('babies-logo');
    const infoTitle = document.getElementById('info-title');
    const infoDescription = document.getElementById('info-description');
    const comparisonOverlay = document.getElementById('comparison-overlay');
    const storeScene = document.querySelector('.store-scene');
    const yearLabels = document.querySelector('.year-labels');
    const languageSelector = document.getElementById('language-selector');

    // Translations object
    const translations = {
        'en': {
            'title': 'Evolution of Toys R Us+',
            'topBanner': 'What will be toys r us in the after life? Play the sequel:',
            'secondaryBanner': 'Make stories for free using Artifical Inteligence:',
            'clickToDissmiss': 'Click to dismiss',
            'yearDescriptions': {}  // Will be populated with year descriptions
        },
        'pt-br': {
            'title': 'Evolução da Toys R Us+',
            'topBanner': 'O que será a Toys R Us na vida após a morte? Jogue a sequência:',
            'secondaryBanner': 'Crie histórias gratuitamente usando Inteligência Artificial:',
            'clickToDissmiss': 'Clique para fechar',
            'yearDescriptions': {}
        },
        'es': {
            'title': 'Evolución de Toys R Us+',
            'topBanner': '¿Qué será Toys R Us en la otra vida? Juega la secuela:',
            'secondaryBanner': 'Crea historias gratis usando Inteligencia Artificial:',
            'clickToDissmiss': 'Haga clic para cerrar',
            'yearDescriptions': {}
        }
    };

    // Function to update language
    function updateLanguage(lang) {
        // Update page title
        document.querySelector('h1').textContent = translations[lang].title;
        
        // Update banners
        const topBanner = document.querySelector('.top-banner');
        const secondaryBanner = document.querySelector('.secondary-banner');
        
        // Keep the links intact, just update the text before them
        const topLink = topBanner.querySelector('a').outerHTML;
        const secondaryLink = secondaryBanner.querySelector('a').outerHTML;
        
        topBanner.innerHTML = translations[lang].topBanner + ' ' + topLink;
        secondaryBanner.innerHTML = translations[lang].secondaryBanner + ' ' + secondaryLink;
        
        // Update overlay text
        document.querySelector('.click-instruction').textContent = translations[lang].clickToDissmiss;
        
        // Update current year information (maintain the year number)
        updateContent();
    }

    // Language selector event listener
    languageSelector.addEventListener('change', function() {
        updateLanguage(this.value);
    });

    // Add Geoffrey mascot to the scene
    const geoffreyMascot = document.createElement('div');
    geoffreyMascot.className = 'geoffrey-mascot';
    storeScene.appendChild(geoffreyMascot);
    
    // Set initial slider value to 2002 (index 24)
    slider.value = 24;

    // Add event listener to close the overlay when clicked
    comparisonOverlay.addEventListener('click', function() {
        comparisonOverlay.style.display = 'none';
    });

    // Update slider max value to include all years (added older years)
    slider.setAttribute('max', '66');

    // Clear existing year labels and prepare for dynamic rendering
    yearLabels.innerHTML = '';

    // Store data for each year
    const yearData = [
        {
            year: 1871,
            buildingClass: 'uk-flag',
            title: '1871: British Colony',
            description: 'This plot of land was colonized by the UK and a flag pole with the British flag was placed here.',
            mainLogo: false,
            babiesLogo: false,
            cars: 'horses'
        },
        {
            year: 1879,
            buildingClass: 'cabin',
            title: '1879: Pioneer Cabin',
            description: 'A small wooden cabin was built on this land by British settlers.',
            mainLogo: false,
            babiesLogo: false,
            cars: 'horses'
        },
        {
            year: 1892,
            buildingClass: 'cabin-fire',
            title: '1892: Cabin Fire',
            description: 'The cabin has caught fire and is burning down.',
            mainLogo: false,
            babiesLogo: false,
            cars: 'horses'
        },
        {
            year: 1893,
            buildingClass: 'burned-ruins',
            title: '1893: Burned Ruins',
            description: 'All that remains are the burned ruins of the cabin.',
            mainLogo: false,
            babiesLogo: false,
            cars: 'horses'
        },
        {
            year: 1895,
            buildingClass: 'usa-ownership',
            title: '1895: US Territory',
            description: 'This land is now owned by the United States of America.',
            mainLogo: false,
            babiesLogo: false,
            cars: 'horses'
        },
        {
            year: 1900,
            buildingClass: 'simple-shop',
            title: '1900: Simple Shop',
            description: 'A simple general store has been built to serve the growing community.',
            mainLogo: false,
            babiesLogo: false,
            cars: 'horses'
        },
        {
            year: 1907,
            buildingClass: 'simple-shop thriving',
            title: '1907: Thriving Shop',
            description: 'The general store is doing well as the town around it grows.',
            mainLogo: false,
            babiesLogo: false,
            cars: 'horses'
        },
        {
            year: 1913,
            buildingClass: 'simple-shop closing',
            title: '1913: Shop Closing',
            description: 'The shop is now closing due to economic hardship.',
            mainLogo: false,
            babiesLogo: false,
            cars: 'horses'
        },
        {
            year: 1917,
            buildingClass: 'for-sale-old',
            title: '1917: Property For Sale',
            description: 'After the shop closed, the property is now up for sale.',
            mainLogo: false,
            babiesLogo: false,
            cars: 'horses'
        },
        {
            year: 1919,
            buildingClass: 'small-plot',
            title: '1919: Small Empty Plot',
            description: 'A small empty plot of land is for sale in what would later become part of Worldgreen Plaza.',
            mainLogo: false,
            babiesLogo: false,
            cars: 'none'
        },
        {
            year: 1925,
            buildingClass: 'house',
            title: '1925: New Family Home',
            description: 'A modest family home has been built on the plot.',
            mainLogo: false,
            babiesLogo: false,
            cars: 'none'
        },
        {
            year: 1928,
            buildingClass: 'house',
            title: '1928: Established Family Home',
            description: 'The family continues to live in the house, which has become a part of the growing neighborhood.',
            mainLogo: false,
            babiesLogo: false,
            cars: 'none'
        },
        {
            year: 1933,
            buildingClass: 'house for-sale',
            title: '1933: House For Sale',
            description: 'After the owner\'s passing, the house is now up for sale.',
            mainLogo: false,
            babiesLogo: false,
            cars: 'none'
        },
        {
            year: 1939,
            buildingClass: 'construction',
            title: '1939: Diner Under Construction',
            description: 'The property has been purchased and is being converted into a diner.',
            mainLogo: false,
            babiesLogo: false,
            cars: 'construction'
        },
        {
            year: 1941,
            buildingClass: 'diner',
            title: '1941: Joe\'s Diner Opens',
            description: 'Joe\'s Diner has opened its doors, offering classic American comfort food to the neighborhood.',
            mainLogo: true,
            babiesLogo: false,
            cars: 'few'
        },
        {
            year: 1946,
            buildingClass: 'diner',
            title: '1946: Popular Local Diner',
            description: 'Joe\'s Diner has become a popular spot for locals, especially after World War II ended.',
            mainLogo: true,
            babiesLogo: false,
            cars: 'many'
        },
        {
            year: 1952,
            buildingClass: 'diner',
            title: '1952: Still in Business',
            description: 'Joe\'s Diner continues to operate successfully throughout the early 1950s.',
            mainLogo: true,
            babiesLogo: false,
            cars: 'many'
        },
        {
            year: 1956,
            buildingClass: 'diner',
            title: '1956: Declining Business',
            description: 'With new restaurants opening nearby, Joe\'s Diner is seeing less foot traffic.',
            mainLogo: true,
            babiesLogo: false,
            cars: 'few'
        },
        {
            year: 1959,
            buildingClass: 'diner going-out-of-business',
            title: '1959: Diner Going Out of Business',
            description: 'After nearly two decades, Joe\'s Diner is closing its doors due to declining business.',
            mainLogo: true,
            babiesLogo: false,
            cars: 'few'
        },
        {
            year: 1960,
            buildingClass: 'for-sale',
            title: '1960: Expanded Plot For Sale',
            description: 'The plot has been expanded and is now for sale with more commercial potential.',
            mainLogo: false,
            babiesLogo: false,
            cars: 'none'
        },
        {
            year: 1965,
            buildingClass: 'corner-store',
            title: '1965: Jeff\'s Corner Store Opens',
            description: 'A new corner store has opened to serve the growing suburban neighborhood.',
            mainLogo: true,
            babiesLogo: false,
            cars: 'few'
        },
        {
            year: 1969,
            buildingClass: 'corner-store',
            title: '1969: Established Corner Store',
            description: 'Jeff\'s Corner Store continues to provide groceries and household items to the local community.',
            mainLogo: true,
            babiesLogo: false,
            cars: 'few'
        },
        {
            year: 1972,
            buildingClass: 'corner-store going-out-of-business',
            title: '1972: Corner Store Struggling',
            description: 'With the rise of supermarkets, the corner store is struggling to compete and has announced its closure.',
            mainLogo: true,
            babiesLogo: false,
            cars: 'few'
        },
        {
            year: 1975,
            buildingClass: 'for-sale',
            title: '1975: Property For Sale',
            description: 'After the corner store closed, the property is once again up for sale.',
            mainLogo: false,
            babiesLogo: false,
            cars: 'none'
        },
        {
            year: 1978,
            buildingClass: 'sold worldgreen-plaza',
            title: '1978: Purchased by Worldgreen Plaza',
            description: 'The property has been acquired as part of the new Worldgreen Plaza commercial development.',
            mainLogo: false,
            babiesLogo: false,
            cars: 'construction'
        },
        {
            year: 1986,
            buildingClass: 'construction worldgreen-plaza',
            title: '1986: Music Store Under Construction',
            description: 'Construction begins on a new rock music store as part of Worldgreen Plaza.',
            mainLogo: false,
            babiesLogo: false,
            cars: 'construction'
        },
        {
            year: 1987,
            buildingClass: 'music-store worldgreen-plaza',
            title: '1987: Rock Music Store Opens',
            description: 'A new rock music store has opened, selling records, tapes, and music merchandise.',
            mainLogo: true,
            babiesLogo: false,
            cars: 'many'
        },
        {
            year: 1992,
            buildingClass: 'music-store worldgreen-plaza',
            title: '1992: Music Store Struggling',
            description: 'With changing music trends and the rise of CDs, the rock-focused store is seeing less business.',
            mainLogo: true,
            babiesLogo: false,
            cars: 'few'
        },
        {
            year: 1995,
            buildingClass: 'music-store going-out-of-business worldgreen-plaza',
            title: '1995: Music Store Closing',
            description: 'The rock music store is having a going-out-of-business sale after years of declining sales.',
            mainLogo: true,
            babiesLogo: false,
            cars: 'many'
        },
        {
            year: 1998,
            buildingClass: 'for-sale worldgreen-plaza',
            title: '1998: Building For Sale',
            description: 'After the music store closed, the building is up for sale within Worldgreen Plaza.',
            mainLogo: false,
            babiesLogo: false,
            cars: 'none'
        },
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
        },
        {
            year: 2030,
            buildingClass: 'ollies empty-ollies',
            title: '2030: Empty Ollie\'s',
            description: 'The Ollie\'s Bargain Outlet has seen a significant drop in foot traffic and is mostly empty now.',
            mainLogo: false,
            babiesLogo: false,
            olliesLogo: true,
            cars: 'none',
            zoom: false
        },
        {
            year: 2032,
            buildingClass: 'ollies-closing',
            title: '2032: Ollie\'s Going Out of Business',
            description: 'Ollie\'s has announced it\'s closing this location with major "Going Out of Business" sales.',
            mainLogo: false,
            babiesLogo: false,
            olliesLogo: true,
            cars: 'few',
            zoom: false
        },
        {
            year: 2033,
            buildingClass: 'closed for-sale',
            title: '2033: Building For Sale Again',
            description: 'After Ollie\'s closure, the building is once again vacant and up for sale.',
            mainLogo: false,
            babiesLogo: false,
            cars: 'none',
            zoom: false
        },
        {
            year: 2036,
            buildingClass: 'walmart',
            title: '2036: Purchased by Walmart',
            description: 'Walmart has purchased the property and is establishing a new store at this location.',
            mainLogo: true,
            babiesLogo: false,
            cars: 'few',
            zoom: false
        },
        {
            year: 2038,
            buildingClass: 'walmart-popular',
            title: '2038: Popular Walmart Location',
            description: 'The Walmart store has become a popular shopping destination in the area.',
            mainLogo: true,
            babiesLogo: false,
            cars: 'many',
            zoom: false
        },
        {
            year: 2045,
            buildingClass: 'walmart-redesign',
            title: '2045: Walmart Redesign',
            description: 'The Walmart store has been redesigned with a more modern look and updated branding.',
            mainLogo: true,
            babiesLogo: false,
            cars: 'many',
            zoom: false
        },
        {
            year: 2048,
            buildingClass: 'walmart switch-release',
            title: '2048: Nintendo Switch 5 Release',
            description: 'The store is packed for the release of the Nintendo Switch 5 console, with promotional banners displayed.',
            mainLogo: true,
            babiesLogo: false,
            cars: 'many',
            zoom: false
        },
        {
            year: 2050,
            buildingClass: 'walmart less-popular',
            title: '2050: Declining Foot Traffic',
            description: 'Due to the rise of online ordering, physical retail locations like this Walmart are seeing less foot traffic.',
            mainLogo: true,
            babiesLogo: false,
            cars: 'few',
            zoom: false
        },
        {
            year: 2056,
            buildingClass: 'walmart closing-announcement',
            title: '2056: Walmart Announces Closure of Physical Stores',
            description: 'Walmart has announced plans to shut down all physical locations, focusing entirely on online retail.',
            mainLogo: true,
            babiesLogo: false,
            cars: 'few',
            zoom: false
        },
        {
            year: 2058,
            buildingClass: 'closed-walmart',
            title: '2058: Walmart Closes',
            description: 'The Walmart store has officially closed following the company\'s shift to online-only operations.',
            mainLogo: false,
            babiesLogo: false,
            cars: 'none',
            zoom: false
        },
        {
            year: 2060,
            buildingClass: 'closed for-sale',
            title: '2060: Building For Sale Once Again',
            description: 'The former Walmart building is now vacant and up for sale.',
            mainLogo: false,
            babiesLogo: false,
            cars: 'none',
            zoom: false
        },
        {
            year: 2065,
            buildingClass: 'sold',
            title: '2065: Purchased by Worldgreen City',
            description: 'The property has been purchased by Worldgreen City for future development.',
            mainLogo: false,
            babiesLogo: false,
            cars: 'few',
            zoom: false
        },
        {
            year: 2068,
            buildingClass: 'roblox-construction',
            title: '2068: Construction of Roblox HQ Begins',
            description: 'Construction has begun on a 50-story skyscraper that will become the new headquarters for Roblox.',
            mainLogo: true,
            babiesLogo: false,
            cars: 'construction',
            zoom: false
        },
        {
            year: 2070,
            buildingClass: 'roblox-10floors',
            title: '2070: Roblox HQ - 10 Stories Complete',
            description: 'The first 10 stories of the Roblox headquarters have been completed. The building is transforming the skyline.',
            mainLogo: true,
            babiesLogo: false,
            cars: 'construction',
            zoom: 'zoomed-out-10'
        },
        {
            year: 2073,
            buildingClass: 'roblox-30floors',
            title: '2073: Roblox HQ - 30 Stories Complete',
            description: 'Construction continues with 30 stories now complete. The skyscraper is becoming a landmark in the city.',
            mainLogo: true,
            babiesLogo: false,
            cars: 'construction',
            zoom: 'zoomed-out-30'
        },
        {
            year: 2075,
            buildingClass: 'roblox-complete',
            title: '2075: Roblox HQ - All 50 Stories Complete',
            description: 'The Roblox HQ skyscraper is now complete at 50 stories. It dominates the Worldgreen City skyline.',
            mainLogo: true,
            babiesLogo: false,
            cars: 'many',
            zoom: 'zoomed-out-50'
        },
        {
            year: 2083,
            buildingClass: 'roblox-complete',
            title: '2083: Roblox HQ Still Going Strong',
            description: 'The Roblox headquarters continues to thrive as a business center and city landmark.',
            mainLogo: true,
            babiesLogo: false,
            cars: 'many',
            zoom: 'zoomed-out-50'
        },
        {
            year: 2087,
            buildingClass: 'metablox-hq',
            title: '2087: Rebranded to Metablox',
            description: 'Roblox has rebranded to "Metablox" to emphasize its focus on metaverse technologies.',
            mainLogo: true,
            babiesLogo: false,
            cars: 'many',
            zoom: 'zoomed-out-50'
        },
        {
            year: 2091,
            buildingClass: 'sued-metablox',
            title: '2091: Metablox Sued by Meta',
            description: 'Metablox is facing a massive lawsuit from Meta (formerly Facebook) over trademark infringement.',
            mainLogo: true,
            babiesLogo: false,
            cars: 'many',
            zoom: 'zoomed-out-50'
        },
        {
            year: 2094,
            buildingClass: 'closing-metablox',
            title: '2094: Metablox Going Out of Business',
            description: 'After losing trillions in the lawsuit with Meta, Metablox is going out of business.',
            mainLogo: true,
            babiesLogo: false,
            cars: 'few',
            zoom: 'zoomed-out-50'
        },
        {
            year: 2100,
            buildingClass: 'demolition',
            title: '2100: Skyscraper Scheduled for Demolition',
            description: 'The once-proud Metablox headquarters is now scheduled for demolition after years of vacancy.',
            mainLogo: false,
            babiesLogo: false,
            cars: 'construction',
            zoom: 'zoomed-out-50'
        },
        {
            year: 2103,
            buildingClass: 'empty-lot',
            title: '2103: Empty Lot For Sale',
            description: 'The skyscraper has been demolished, and the empty lot is now for sale again.',
            mainLogo: false,
            babiesLogo: false,
            cars: 'none',
            zoom: false
        },
        {
            year: 2109,
            buildingClass: 'apartment',
            title: '2109: 10-Story Apartment Building',
            description: 'A new 10-story apartment building called "Worldgreen Residences" has been built on the site.',
            mainLogo: false,
            babiesLogo: false,
            cars: 'few',
            zoom: false
        },
        {
            year: 2110,
            buildingClass: 'apartment-occupied',
            title: '2110: Apartment Building Occupied',
            description: 'The apartment building is now fully occupied with residents.',
            mainLogo: false,
            babiesLogo: false,
            cars: 'many',
            zoom: false
        },
        {
            year: 2119,
            buildingClass: 'apartment-occupied',
            title: '2119: Thriving Residential Building',
            description: 'The apartment building continues to be a popular residential option in Worldgreen City.',
            mainLogo: false,
            babiesLogo: false,
            cars: 'many',
            zoom: false
        },
        {
            year: 2125,
            buildingClass: 'apartment-occupied',
            title: '2125: Still an Apartment Building',
            description: 'The apartment building remains a stable fixture in the neighborhood after many years.',
            mainLogo: false,
            babiesLogo: false,
            cars: 'many',
            zoom: false
        }
    ];

    // Populate translations for each year
    yearData.forEach(data => {
        // Extract just the description part after the year
        const titleParts = data.title.split(': ');
        const yearNum = data.year.toString();
        
        // English is already in the data
        translations['en'].yearDescriptions[yearNum] = {
            title: data.title,
            description: data.description
        };
        
        // For Portuguese and Spanish, we'll add placeholder translations
        // These would ideally be proper translations
        translations['pt-br'].yearDescriptions[yearNum] = {
            title: titleParts[0] + ': ' + translateTitlePT(titleParts[1]),
            description: translateDescriptionPT(data.description)
        };
        
        translations['es'].yearDescriptions[yearNum] = {
            title: titleParts[0] + ': ' + translateTitleES(titleParts[1]),
            description: translateDescriptionES(data.description)
        };
    });
    
    // Simple translation functions (these would be more sophisticated in a real app)
    function translateTitlePT(text) {
        // Map of common English phrases to Portuguese
        const commonPhrases = {
            'British Colony': 'Colônia Britânica',
            'Pioneer Cabin': 'Cabana Pioneira',
            'Cabin Fire': 'Incêndio na Cabana',
            'Burned Ruins': 'Ruínas Queimadas',
            'US Territory': 'Território dos EUA',
            'Simple Shop': 'Loja Simples',
            'Thriving Shop': 'Loja Próspera',
            'Shop Closing': 'Loja Fechando',
            'Property For Sale': 'Propriedade à Venda',
            'Small Empty Plot': 'Pequeno Terreno Vazio',
            'New Family Home': 'Nova Casa Familiar',
            'House For Sale': 'Casa à Venda',
            'Diner Under Construction': 'Lanchonete em Construção',
            'Joe\'s Diner Opens': 'Lanchonete do Joe Abre',
            'Popular Local Diner': 'Lanchonete Local Popular',
            'Still in Business': 'Ainda em Funcionamento',
            'Declining Business': 'Negócio em Declínio',
            'Going Out of Business': 'Encerrando as Atividades',
            'Expanded Plot For Sale': 'Terreno Ampliado à Venda',
            'Jeff\'s Corner Store Opens': 'Mercearia do Jeff Abre',
            'Established Corner Store': 'Mercearia Estabelecida',
            'Corner Store Struggling': 'Mercearia com Dificuldades',
            'Purchased by Worldgreen Plaza': 'Comprado pela Worldgreen Plaza',
            'Music Store Under Construction': 'Loja de Música em Construção',
            'Rock Music Store Opens': 'Loja de Rock Abre',
            'Music Store Struggling': 'Loja de Música com Dificuldades',
            'Music Store Closing': 'Loja de Música Fechando',
            'Building For Sale': 'Edifício à Venda',
            'Former Building For Sale': 'Antigo Edifício à Venda',
            'Land Purchased by Toys R Us': 'Terreno Comprado pela Toys R Us',
            'Toys R Us Coming Soon': 'Toys R Us em Breve',
            'New Construction': 'Nova Construção',
            'Grand Opening': 'Grande Inauguração',
            'Wii Console Release': 'Lançamento do Console Wii',
            'Store Redesign': 'Redesenho da Loja',
            'Babies R Us Added': 'Babies R Us Adicionado',
            'Shutting Down': 'Encerrando',
            'Out of Business & For Sale': 'Fora de Atividade e à Venda',
            'Ollie\'s Coming Soon': 'Ollie\'s em Breve',
            'Ollie\'s Bargain Outlet': 'Outlet de Ofertas do Ollie',
            'Present Day': 'Dias Atuais',
            'Empty Ollie\'s': 'Ollie\'s Vazio',
            'Ollie\'s Going Out of Business': 'Ollie\'s Encerrando as Atividades',
            'Building For Sale Again': 'Edifício à Venda Novamente',
            'Purchased by Walmart': 'Comprado pela Walmart',
            'Popular Walmart Location': 'Localização Popular da Walmart',
            'Walmart Redesign': 'Redesenho da Walmart',
            'Nintendo Switch 5 Release': 'Lançamento do Nintendo Switch 5',
            'Declining Foot Traffic': 'Redução do Tráfego de Pedestres',
            'Walmart Announces Closure': 'Walmart Anuncia Fechamento',
            'Walmart Closes': 'Walmart Fecha',
            'Building For Sale Once Again': 'Edifício à Venda Uma Vez Mais',
            'Purchased by Worldgreen City': 'Comprado pela Cidade Worldgreen',
            'Construction of Roblox HQ Begins': 'Construção do QG da Roblox Começa',
            'Roblox HQ - 10 Stories Complete': 'QG da Roblox - 10 Andares Completos',
            'Roblox HQ - 30 Stories Complete': 'QG da Roblox - 30 Andares Completos',
            'Roblox HQ - All 50 Stories Complete': 'QG da Roblox - Todos os 50 Andares Completos',
            'Roblox HQ Still Going Strong': 'QG da Roblox Ainda Forte',
            'Rebranded to Metablox': 'Renomeado para Metablox',
            'Metablox Sued by Meta': 'Metablox Processado pela Meta',
            'Metablox Going Out of Business': 'Metablox Encerrando as Atividades',
            'Skyscraper Scheduled for Demolition': 'Arranha-céu Programado para Demolição',
            'Empty Lot For Sale': 'Terreno Vazio à Venda',
            '10-Story Apartment Building': 'Edifício de Apartamentos de 10 Andares',
            'Apartment Building Occupied': 'Edifício de Apartamentos Ocupado',
            'Thriving Residential Building': 'Edifício Residencial Próspero',
            'Still an Apartment Building': 'Ainda um Edifício de Apartamentos'
        };
        
        // Check if we have a direct translation
        if (commonPhrases[text]) {
            return commonPhrases[text];
        }
        
        // Otherwise return the original text
        return text;
    }
    
    function translateTitleES(text) {
        // Map of common English phrases to Spanish
        const commonPhrases = {
            'British Colony': 'Colonia Británica',
            'Pioneer Cabin': 'Cabaña Pionera',
            'Cabin Fire': 'Incendio de Cabaña',
            'Burned Ruins': 'Ruinas Quemadas',
            'US Territory': 'Territorio de EE. UU.',
            'Simple Shop': 'Tienda Simple',
            'Thriving Shop': 'Tienda Próspera',
            'Shop Closing': 'Tienda Cerrando',
            'Property For Sale': 'Propiedad en Venta',
            'Small Empty Plot': 'Pequeña Parcela Vacía',
            'New Family Home': 'Nueva Casa Familiar',
            'House For Sale': 'Casa en Venta',
            'Diner Under Construction': 'Restaurante en Construcción',
            'Joe\'s Diner Opens': 'Restaurante de Joe Abre',
            'Popular Local Diner': 'Restaurante Local Popular',
            'Still in Business': 'Todavía en Funcionamiento',
            'Declining Business': 'Negocio en Declive',
            'Going Out of Business': 'Cerrando el Negocio',
            'Expanded Plot For Sale': 'Parcela Ampliada en Venta',
            'Jeff\'s Corner Store Opens': 'Tienda de la Esquina de Jeff Abre',
            'Established Corner Store': 'Tienda de la Esquina Establecida',
            'Corner Store Struggling': 'Tienda de la Esquina con Dificultades',
            'Purchased by Worldgreen Plaza': 'Comprado por Worldgreen Plaza',
            'Music Store Under Construction': 'Tienda de Música en Construcción',
            'Rock Music Store Opens': 'Tienda de Música Rock Abre',
            'Music Store Struggling': 'Tienda de Música con Dificultades',
            'Music Store Closing': 'Tienda de Música Cerrando',
            'Building For Sale': 'Edificio en Venta',
            'Former Building For Sale': 'Antiguo Edificio en Venta',
            'Land Purchased by Toys R Us': 'Terreno Comprado por Toys R Us',
            'Toys R Us Coming Soon': 'Toys R Us Próximamente',
            'New Construction': 'Nueva Construcción',
            'Grand Opening': 'Gran Inauguración',
            'Wii Console Release': 'Lanzamiento de la Consola Wii',
            'Store Redesign': 'Rediseño de la Tienda',
            'Babies R Us Added': 'Babies R Us Añadido',
            'Shutting Down': 'Cerrando',
            'Out of Business & For Sale': 'Fuera de Negocio y en Venta',
            'Ollie\'s Coming Soon': 'Ollie\'s Próximamente',
            'Ollie\'s Bargain Outlet': 'Outlet de Gangas de Ollie',
            'Present Day': 'Actualidad',
            'Empty Ollie\'s': 'Ollie\'s Vacío',
            'Ollie\'s Going Out of Business': 'Ollie\'s Cerrando el Negocio',
            'Building For Sale Again': 'Edificio en Venta Nuevamente',
            'Purchased by Walmart': 'Comprado por Walmart',
            'Popular Walmart Location': 'Ubicación Popular de Walmart',
            'Walmart Redesign': 'Rediseño de Walmart',
            'Nintendo Switch 5 Release': 'Lanzamiento de Nintendo Switch 5',
            'Declining Foot Traffic': 'Disminución del Tráfico Peatonal',
            'Walmart Announces Closure': 'Walmart Anuncia el Cierre',
            'Walmart Closes': 'Walmart Cierra',
            'Building For Sale Once Again': 'Edificio en Venta Una Vez Más',
            'Purchased by Worldgreen City': 'Comprado por Ciudad Worldgreen',
            'Construction of Roblox HQ Begins': 'Comienza la Construcción de la Sede de Roblox',
            'Roblox HQ - 10 Stories Complete': 'Sede de Roblox - 10 Pisos Completos',
            'Roblox HQ - 30 Stories Complete': 'Sede de Roblox - 30 Pisos Completos',
            'Roblox HQ - All 50 Stories Complete': 'Sede de Roblox - Todos los 50 Pisos Completos',
            'Roblox HQ Still Going Strong': 'Sede de Roblox Sigue Fuerte',
            'Rebranded to Metablox': 'Renombrado a Metablox',
            'Metablox Sued by Meta': 'Metablox Demandado por Meta',
            'Metablox Going Out of Business': 'Metablox Cerrando el Negocio',
            'Skyscraper Scheduled for Demolition': 'Rascacielos Programado para Demolición',
            'Empty Lot For Sale': 'Terreno Vacío en Venta',
            '10-Story Apartment Building': 'Edificio de Apartamentos de 10 Pisos',
            'Apartment Building Occupied': 'Edificio de Apartamentos Ocupado',
            'Thriving Residential Building': 'Edifício Residencial Próspero',
            'Still an Apartment Building': 'Sigue Siendo un Edificio de Apartamentos'
        };
        
        if (commonPhrases[text]) {
            return commonPhrases[text];
        }
        
        return text;
    }
    
    function translateDescriptionPT(text) {
        // This would be a more sophisticated translation function in a real app
        // For simplicity, we'll just do some basic replacements
        return text
            .replace('This plot of land', 'Este terreno')
            .replace('Toys R Us', 'Toys R Us')
            .replace('store', 'loja')
            .replace('building', 'edifício')
            .replace('property', 'propriedade')
            .replace('construction', 'construção')
            .replace('business', 'negócio')
            .replace('popular', 'popular')
            .replace('apartment', 'apartamento')
            .replace('skyscraper', 'arranha-céu');
    }
    
    function translateDescriptionES(text) {
        // Basic Spanish translations
        return text
            .replace('This plot of land', 'Esta parcela de tierra')
            .replace('Toys R Us', 'Toys R Us')
            .replace('store', 'tienda')
            .replace('building', 'edificio')
            .replace('property', 'propiedad')
            .replace('construction', 'construcción')
            .replace('business', 'negocio')
            .replace('popular', 'popular')
            .replace('apartment', 'apartamento')
            .replace('skyscraper', 'rascacielos');
    }

    // Make sure walmart, roblox, and metablox classes don't show Toys R Us logo
    const removeTRULogo = index => {
        const data = yearData[index];
        if (data.buildingClass.includes('walmart') || 
            data.buildingClass.includes('roblox') || 
            data.buildingClass.includes('metablox')) {
            data.mainLogo = true; // Keep logo visible but change image via CSS
        }
    };

    // Apply this to relevant years
    for (let i = 0; i < yearData.length; i++) {
        removeTRULogo(i);
    }

    // Function to update visible year labels
    function updateYearLabels() {
        yearLabels.innerHTML = ''; // Clear existing labels
        
        // Get the current slider position
        const currentIndex = parseInt(slider.value);
        const totalYears = yearData.length;
        
        // Determine which years to show (5 before and 5 after current, if available)
        const startIdx = Math.max(0, currentIndex - 5);
        const endIdx = Math.min(totalYears - 1, currentIndex + 5);
        
        // Add all year labels, but only make relevant ones visible
        for (let i = 0; i < totalYears; i++) {
            const yearLabel = document.createElement('span');
            yearLabel.textContent = yearData[i].year;
            
            // Add click event to year labels
            yearLabel.addEventListener('click', function() {
                slider.value = i;
                updateContent();
            });
            
            if (i >= startIdx && i <= endIdx) {
                yearLabel.classList.add('visible');
            }
            
            yearLabels.appendChild(yearLabel);
        }
    }

    // Update content based on slider value
    function updateContent() {
        const index = parseInt(slider.value);
        const data = yearData[index];
        const lang = languageSelector.value;
        
        // Update year display
        yearDisplay.textContent = data.year;
        
        // Update building class
        building.className = 'building ' + data.buildingClass;
        
        // Update logos
        mainLogo.style.opacity = data.mainLogo ? '1' : '0';
        babiesLogo.style.opacity = data.babiesLogo ? '1' : '0';
        
        // Show/hide Geoffrey mascot based on year
        if (data.year >= 2002 && data.year <= 2017) {
            geoffreyMascot.style.opacity = '1';
        } else {
            geoffreyMascot.style.opacity = '0';
        }
        
        // Add vintage filter for years 1871-1931
        if (data.year >= 1871 && data.year <= 1931) {
            storeScene.classList.add('vintage-filter');
        } else {
            storeScene.classList.remove('vintage-filter');
        }
        
        // Change main logo to Ollie's if applicable
        if (data.olliesLogo) {
            mainLogo.style.backgroundImage = 'url("ollies_logo.png")';
            mainLogo.style.opacity = '1';
        } else if (data.buildingClass.includes('walmart')) {
            mainLogo.style.backgroundImage = 'url("walmart_logo.png")';
        } else if (data.buildingClass.includes('roblox')) {
            mainLogo.style.backgroundImage = 'url("roblox_logo.png")';
        } else if (data.buildingClass.includes('metablox')) {
            mainLogo.style.backgroundImage = 'url("metablox_logo.png")';
        } else if (data.buildingClass.includes('diner')) {
            mainLogo.style.backgroundImage = 'url("joes_diner_logo.png")';
        } else if (data.buildingClass.includes('corner-store')) {
            mainLogo.style.backgroundImage = 'url("jeffs_corner_store_logo.png")';
        } else if (data.buildingClass.includes('music-store')) {
            mainLogo.style.backgroundImage = 'url("rock_music_store_logo.png")';
        } else {
            mainLogo.style.backgroundImage = 'url("toysrus_logo.png")';
        }
        
        // Update information panel with translations
        const yearStr = data.year.toString();
        if (translations[lang] && translations[lang].yearDescriptions[yearStr]) {
            infoTitle.textContent = translations[lang].yearDescriptions[yearStr].title;
            infoDescription.textContent = translations[lang].yearDescriptions[yearStr].description;
        } else {
            infoTitle.textContent = data.title;
            infoDescription.textContent = data.description;
        }
        
        // Update zoom level for skyscraper years and apartment buildings
        if (data.zoom) {
            storeScene.classList.add(data.zoom);
        } else if (data.buildingClass.includes('apartment')) {
            storeScene.classList.add('zoomed-out-apartment');
            storeScene.classList.remove('zoomed-out-10', 'zoomed-out-30', 'zoomed-out-50');
        } else {
            storeScene.classList.remove('zoomed-out-10', 'zoomed-out-30', 'zoomed-out-50', 'zoomed-out-apartment');
        }
        
        // Update cars in parking lot
        updateCars(data.cars);
        
        // Update year labels to show relevant years
        updateYearLabels();
    }
    
    // Function to update cars in the parking lot
    function updateCars(carStatus) {
        const parkingLot = document.querySelector('.parking-lot');
        parkingLot.innerHTML = ''; // Clear existing cars
        
        let carCount = 0;
        const currentYear = parseInt(yearDisplay.textContent);
        
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
            case 'horses':
                for (let i = 0; i < 3; i++) {
                    const horse = document.createElement('div');
                    horse.className = 'horse';
                    horse.style.left = (Math.random() * 400 + 50) + 'px';
                    horse.style.bottom = (Math.random() * 30 + 5) + 'px';
                    parkingLot.appendChild(horse);
                }
                break;
        }
        
        // Define car images for different eras
        let carImages;
        
        if (currentYear >= 1871 && currentYear < 1919) {
            // No cars in this era, just horses (handled above)
            carCount = 0;
        } else if (currentYear >= 1939 && currentYear < 1978) {
            // Vintage cars (1939-1978)
            carImages = ['vintage_car1.png', 'vintage_car2.png', 'vintage_car3.png'];
        } else if (currentYear >= 1978 && currentYear < 1999) {
            // Classic cars (1978-1999)
            carImages = ['classic_car1.png', 'classic_car2.png', 'vintage_car3.png'];
        } else if (currentYear >= 1999 && currentYear < 2050) {
            // Modern cars (1999-2050)
            carImages = ['redcar.png', 'bluecar.png', 'blackcar.png', 'whitecar.png', 'jeepcar.png', 'greycar.png', 'bus.png'];
        } else if (currentYear >= 2050 && currentYear < 2087) {
            // Tesla and electric cars (2050-2087)
            carImages = ['tesla_car.png', 'electric_car.png', 'whitecar.png', 'bluecar.png'];
        } else if (currentYear >= 2087) {
            // Flying cars (2087+)
            carImages = ['flying_car1.png', 'flying_car2.png'];
        } else {
            // Default to modern cars
            carImages = ['redcar.png', 'bluecar.png', 'blackcar.png', 'whitecar.png', 'jeepcar.png', 'greycar.png'];
        }
        
        // Add regular cars
        for (let i = 0; i < carCount; i++) {
            const car = document.createElement('div');
            
            const randomCar = carImages[Math.floor(Math.random() * carImages.length)];
            car.className = 'car';
            
            // Add flying class for future cars
            if (currentYear >= 2087) {
                car.className += ' flying-car';
            }
            
            car.style.backgroundImage = `url('${randomCar}')`;
            
            car.style.left = (Math.random() * 400 + 50) + 'px';
            car.style.bottom = (Math.random() * 30 + 5) + 'px';
            
            // Add hover effect for flying cars
            if (currentYear >= 2087) {
                car.style.bottom = (Math.random() * 30 + 25) + 'px'; // Higher position
                // Add animation
                car.style.animation = `hover ${Math.random() * 2 + 2}s infinite ease-in-out`;
            }
            
            const rotation = Math.random() * 10 - 5;
            car.style.transform = `rotate(${rotation}deg)`;
            
            parkingLot.appendChild(car);
        }
    }
    
    // Initialize with default values
    updateYearLabels();
    updateContent();
    
    // Add event listener for slider changes
    slider.addEventListener('input', updateContent);
});