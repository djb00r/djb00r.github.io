document.addEventListener('DOMContentLoaded', function() {
    const yearSlider = document.getElementById('year-slider');
    const currentYearDisplay = document.getElementById('current-year');
    const storeLogo = document.getElementById('store-logo');
    const storeStatus = document.getElementById('store-status');
    const storeDetails = document.getElementById('store-details');
    const storeContainer = document.querySelector('.store-container');
    const newsTicker = document.getElementById('news-ticker');
    const infoYear = document.getElementById('info-year');
    const infoText = document.getElementById('info-text');
    
    // Cover image click handler
    const mallCover = document.getElementById('mall-cover');
    if (mallCover) {
        mallCover.addEventListener('click', function() {
            mallCover.style.display = 'none';
        });
    }
    
    // Create a poster element and add it to the store window
    const closingPoster = document.createElement('img');
    closingPoster.id = 'closing-poster';
    closingPoster.src = 'going_out_of_business.png';
    closingPoster.alt = 'Going Out of Business';
    closingPoster.style.display = 'none';
    document.querySelector('.store-window').appendChild(closingPoster);
    
    // Timeline data for each year
    const timelineData = {
        2018: {
            logo: 'bedandbeyond_logo.png',
            status: 'OPEN',
            statusClass: 'status-open',
            details: 'Bed Bath & Beyond is operating normally',
            containerClass: '',
            news: 'BREAKING NEWS: Toys R Us announces nationwide closures...',
            info: 'News is spreading about Toys R Us closing all stores nationwide. This location in Orangeland Mall is currently a Bed Bath & Beyond.'
        },
        2019: {
            logo: 'bedandbeyond_logo.png',
            status: 'OPEN',
            statusClass: 'status-open',
            details: 'Bed Bath & Beyond is operating normally',
            containerClass: '',
            news: 'Retail market continues to face challenges as more stores move online...',
            info: 'Bed Bath & Beyond continues to operate at Orangeland Mall as the retail landscape shifts.'
        },
        2020: {
            logo: 'bedandbeyond_logo.png',
            status: 'CLOSING SALE',
            statusClass: 'status-closing',
            details: 'Everything must go! Up to 70% off',
            containerClass: 'year-2020',
            news: 'COVID-19 pandemic accelerates retail closures across the country...',
            info: 'Bed Bath & Beyond is going out of business with closing sale posters throughout the store.',
            showPoster: true
        },
        2021: {
            logo: '',
            status: 'VACANT',
            statusClass: 'status-empty',
            details: 'Store space is empty',
            containerClass: 'year-2021',
            news: 'Mall vacancies reach record high as pandemic continues...',
            info: 'The store space is now empty after Bed Bath & Beyond closed its doors permanently.'
        },
        2022: {
            logo: '',
            status: 'VACANT',
            statusClass: 'status-empty',
            details: 'Store space remains empty',
            containerClass: 'year-2021',
            news: 'Retail spaces struggle to find new tenants in changing market...',
            info: 'The former Bed Bath & Beyond space remains vacant with no new tenant in sight.'
        },
        2023: {
            logo: '',
            status: 'VACANT',
            statusClass: 'status-empty',
            details: 'Store space remains empty',
            containerClass: 'year-2021',
            news: 'Malls seek alternative uses for vacant retail spaces...',
            info: 'The retail space continues to sit empty as Orangeland Mall struggles to find a new tenant.'
        },
        2024: {
            logo: '',
            status: 'FOR LEASE',
            statusClass: 'status-abandoned',
            details: 'BUY THIS ORANGELAND MALL AREA',
            containerClass: 'year-2024',
            news: 'BREAKING: Toys R Us announces comeback plan with new store concepts...',
            info: 'The building in the mall is now abandoned with "Buy This Orangeland Mall Area" signs. News surfaces about Toys R Us coming back to retail locations.'
        },
        2025: {
            logo: 'toysrus_logo.png',
            status: 'GRAND OPENING',
            statusClass: 'status-open',
            details: 'We\'re back! Visit the all-new Toys R Us experience',
            containerClass: 'year-2025',
            news: 'Toys R Us makes triumphant return to Orangeland Mall as part of nationwide revival...',
            info: 'Toys R Us has bought the space and reopened! The iconic toy retailer makes its comeback to Orangeland Mall.'
        },
        2026: {
            logo: 'toysrus_logo.png',
            status: 'OPEN',
            statusClass: 'status-open',
            details: 'Toys R Us is thriving in its new location',
            containerClass: 'year-2025',
            news: 'Toys R Us reports strong sales in first full year after comeback...',
            info: 'Toys R Us continues to operate successfully after its return to physical retail.'
        },
        2027: {
            logo: 'toysrus_logo.png',
            status: 'OPEN',
            statusClass: 'status-open',
            details: 'Toys R Us is a mall anchor once again',
            containerClass: 'year-2025',
            news: 'Physical toy stores see resurgence as families seek interactive shopping experiences...',
            info: 'Toys R Us has established itself as a key tenant in Orangeland Mall, drawing steady foot traffic.'
        },
        2028: {
            logo: 'toysrus_logo.png',
            status: 'NINTENDO SWITCH 3 AVAILABLE NOW!',
            statusClass: 'status-open',
            details: 'Huge lines for the latest gaming console',
            containerClass: 'year-2028',
            news: 'Nintendo Switch 3 launches to massive demand; Toys R Us sees record-breaking sales...',
            info: 'Toys R Us still owns the space and is experiencing huge excitement with the Nintendo Switch 3 release.'
        },
        2029: {
            logo: 'toysrus_logo.png',
            status: 'OPEN',
            statusClass: 'status-open',
            details: 'Toys R Us continues strong performance',
            containerClass: 'year-2028',
            news: 'Traditional toy retailers adapt to changing market with hybrid shopping experiences...',
            info: 'Toys R Us continues to be a strong performer at Orangeland Mall.'
        },
        2030: {
            logo: 'toysrus_logo.png',
            status: 'OPEN',
            statusClass: 'status-open',
            details: 'Toys R Us is a mall favorite',
            containerClass: 'year-2028',
            news: 'Retail experts predict future of successful stores will blend physical and digital experiences...',
            info: 'Toys R Us continues to operate successfully by adapting to changing retail landscapes.'
        },
        2031: {
            logo: 'toysrus_logo.png',
            status: 'OPEN',
            statusClass: 'status-open',
            details: 'Toys R Us begins partnership talks',
            containerClass: 'year-2028',
            news: 'Major online retailers seeking brick-and-mortar partnerships to expand reach...',
            info: 'Rumors begin to circulate about potential partnerships between Toys R Us and online retailers.'
        },
        2032: {
            logo: 'toysrus_logo.png',
            status: 'OPEN',
            statusClass: 'status-open',
            details: 'Toys R Us exploring new business models',
            containerClass: 'year-2028',
            news: 'Traditional retailers increasingly partner with tech giants to remain competitive...',
            info: 'Toys R Us begins exploring partnership opportunities with major online retailers.'
        },
        2033: {
            logo: 'toysrus_logo.png',
            status: 'UNDER NEW MANAGEMENT SOON',
            statusClass: 'status-open',
            details: 'Big changes coming to your favorite toy store',
            containerClass: 'year-2028',
            news: 'Amazon announces major acquisition plans in the toy retail sector...',
            info: 'Toys R Us announces upcoming management changes and a potential rebranding.'
        },
        2034: {
            logo: 'amazon_toys_logo.png',
            status: 'NOW OPEN',
            statusClass: 'status-open',
            details: 'Toys R Us is now Amazon Toys',
            containerClass: 'year-2034',
            news: 'Amazon completes rebranding of Toys R Us locations to Amazon Toys; offers same-day delivery...',
            info: 'Toys R Us has rebranded to Amazon Toys, marking a major shift in the toy retail landscape.'
        },
        2035: {
            logo: 'amazon_toys_logo.png',
            status: 'OPEN',
            statusClass: 'status-open',
            details: 'Amazon Toys combines online and in-store shopping',
            containerClass: 'year-2034',
            news: 'Hybrid shopping models become the new normal for retail success...',
            info: 'Amazon Toys operates as a showroom and pickup point for online orders, with a selection of in-store merchandise.'
        },
        2036: {
            logo: 'amazon_toys_logo.png',
            status: 'OPEN',
            statusClass: 'status-open',
            details: 'Amazon Toys focuses more on online ordering',
            containerClass: 'year-2034',
            news: 'Physical retail continues to transform as digital integration deepens...',
            info: 'Amazon Toys begins to reduce in-store inventory in favor of display models and digital ordering.'
        },
        2037: {
            logo: 'amazon_toys_logo.png',
            status: 'OPEN',
            statusClass: 'status-open',
            details: 'Store becoming more of a showroom',
            containerClass: 'year-2034',
            news: 'Amazon announces strategic shift to focus on "experience centers" rather than traditional retail...',
            info: 'Amazon Toys continues to shift focus from traditional retail to becoming primarily a showroom for online orders.'
        },
        2038: {
            logo: 'amazon_toys_logo.png',
            status: 'CLOSING - MOVING ONLINE',
            statusClass: 'status-closing',
            details: 'Visit Amazon.com for all your toy needs',
            containerClass: 'year-2038',
            news: 'Amazon Toys announces closure of physical locations to focus on online sales...',
            info: 'Amazon Toys is closing due to the company focusing more on online sales channels.',
            showPoster: true
        },
        2039: {
            logo: 'amazon_toys_logo.png',
            status: 'FINAL CLEARANCE',
            statusClass: 'status-closing',
            details: 'Last chance - Everything must go!',
            containerClass: 'year-2038',
            news: 'Last remaining Amazon Toys locations prepare for final closure...',
            info: 'Amazon Toys is in its final weeks of operation, with clearance sales throughout the store.',
            showPoster: true
        },
        2040: {
            logo: '',
            status: 'CLOSED PERMANENTLY',
            statusClass: 'status-empty',
            details: 'Amazon Toys has moved online only',
            containerClass: 'year-2021',
            news: 'Era ends as last physical Amazon Toys locations close their doors...',
            info: 'Amazon Toys is gone for good from physical retail, now operating exclusively online.'
        },
        2041: {
            logo: '',
            status: 'FOR SALE',
            statusClass: 'status-for-sale',
            details: 'Prime retail space available',
            containerClass: 'year-2024',
            news: 'Former retail spaces seek new purpose in evolving mall landscape...',
            info: 'The former Amazon Toys space is now for sale, seeking a new tenant.'
        },
        2042: {
            logo: '',
            status: 'FOR SALE',
            statusClass: 'status-for-sale',
            details: 'Prime retail space available',
            containerClass: 'year-2024',
            news: 'Malls reinvent themselves as lifestyle and entertainment destinations...',
            info: 'The retail space remains for sale as Orangeland Mall works to attract new types of tenants.'
        },
        2043: {
            logo: '',
            status: 'FOR SALE',
            statusClass: 'status-for-sale',
            details: 'Prime retail space available',
            containerClass: 'year-2024',
            news: 'New wave of experiential retailers begins to emerge in shopping centers...',
            info: 'The space continues to be marketed to potential tenants as the mall seeks to diversify its offerings.'
        },
        2044: {
            logo: '',
            status: 'FOR SALE',
            statusClass: 'status-for-sale',
            details: 'Prime retail space available',
            containerClass: 'year-2024',
            news: 'Food and entertainment venues become mall anchors as retail landscape evolves...',
            info: 'The former toy store space remains available as mall management focuses on attracting food and entertainment businesses.'
        },
        2045: {
            logo: '',
            status: 'FOR SALE',
            statusClass: 'status-for-sale',
            details: 'Prime retail space available',
            containerClass: 'year-2024',
            news: 'Specialty food retailers see growth in mall locations...',
            info: 'Interest in the vacant space begins to grow from specialty food retailers and experience-based businesses.'
        },
        2046: {
            logo: '',
            status: 'UNDER CONTRACT',
            statusClass: 'status-construction',
            details: 'Coming Soon',
            containerClass: 'year-2024',
            news: 'Artisanal food experiences become the new trend in mall retail...',
            info: 'A sale is pending for the retail space, with rumors of a specialty food business moving in.'
        },
        2047: {
            logo: 'icecream_logo.png',
            status: 'GRAND OPENING',
            statusClass: 'status-open',
            details: 'Visit Ice Cold Ice Cream for a sweet treat!',
            containerClass: 'year-2047',
            news: 'Ice Cold Ice Cream opens flagship store in Orangeland Mall, featuring interactive ice cream experiences...',
            info: 'The area was bought by an ice cream store called Ice Cold Ice Cream, offering artisanal frozen treats.'
        },
        2048: {
            logo: 'icecream_logo.png',
            status: 'OPEN',
            statusClass: 'status-open',
            details: 'Ice Cold Ice Cream is a mall favorite',
            containerClass: 'year-2047',
            news: 'Experience-based retailers continue to thrive in mall environments...',
            info: 'Ice Cold Ice Cream has become a popular destination at Orangeland Mall, known for its unique flavors and interactive experiences.'
        },
        2049: {
            logo: 'icecream_logo.png',
            status: 'OPEN',
            statusClass: 'status-open',
            details: 'Ice Cold Ice Cream expands menu',
            containerClass: 'year-2047',
            news: 'Food retailers find success with immersive experiences and quality products...',
            info: 'Ice Cold Ice Cream expands its offerings to include more dessert options while maintaining its core ice cream business.'
        },
        2050: {
            logo: 'icecream_logo.png',
            status: 'OPEN',
            statusClass: 'status-open',
            details: 'Ice Cold Ice Cream celebrates 3 years!',
            containerClass: 'year-2050',
            news: 'Local businesses prove resilient in evolving retail landscape...',
            info: 'Ice Cold Ice Cream continues to operate successfully, having established itself as a long-term tenant at Orangeland Mall.'
        },
        2043: {
            logo: 'spirit_christmas_logo.png',
            status: 'SEASONAL STORE OPEN',
            statusClass: 'status-open',
            details: 'Holiday shopping destination - Open until Dec 26',
            containerClass: 'year-2043',
            news: 'Seasonal retailers fill vacant spaces during holiday shopping season...',
            info: 'Spirit Christmas has opened a temporary holiday store in the former toy retailer space, selling Christmas decorations and gifts.'
        },
        2044: {
            logo: 'spirit_christmas_logo.png',
            status: 'SEASONAL STORE OPEN',
            statusClass: 'status-open',
            details: 'Holiday shopping destination - Back for another year',
            containerClass: 'year-2043',
            news: 'Pop-up retail continues to grow as solution for mall vacancies...',
            info: 'Spirit Christmas has returned for a second holiday season, offering expanded inventory of Christmas merchandise.'
        },
        2045: {
            logo: 'spirit_halloween_logo.png',
            status: 'SEASONAL STORE OPEN',
            statusClass: 'status-open',
            details: 'Halloween costumes, decorations & more!',
            containerClass: 'year-2045',
            news: 'Seasonal retailers expand from single holiday focus to year-round pop-up concepts...',
            info: 'The same company behind Spirit Christmas has opened a Spirit Halloween store in the space for the fall season.'
        },
        2046: {
            logo: '',
            status: 'SOLD',
            statusClass: 'status-construction',
            details: 'Purchased by Ice Cold Ice Cream',
            containerClass: 'year-2046',
            news: 'Artisanal food experiences become the new trend in mall retail as Ice Cold Ice Cream finalizes purchase...',
            info: 'After years of seasonal retail use, the space has been sold to Ice Cold Ice Cream, which plans to open a permanent location.'
        }
    };
    
    // Update display based on selected year
    function updateDisplay(year) {
        currentYearDisplay.textContent = year;
        infoYear.textContent = year;
        
        const yearData = timelineData[year];
        
        // Update store logo
        if (yearData.logo) {
            storeLogo.src = yearData.logo;
            storeLogo.style.display = 'block';
        } else {
            storeLogo.style.display = 'none';
        }
        
        // Update store status
        storeStatus.textContent = yearData.status;
        storeStatus.className = yearData.statusClass;
        
        // Update store details
        storeDetails.textContent = yearData.details;
        
        // Update container class for year-specific styling
        storeContainer.className = 'store-container ' + yearData.containerClass;
        
        // Update news ticker
        newsTicker.textContent = yearData.news;
        
        // Update info text
        infoText.textContent = yearData.info;
        
        // Show or hide the closing poster
        closingPoster.style.display = yearData.showPoster ? 'block' : 'none';
    }
    
    // Initialize with default year (2018)
    updateDisplay(2018);
    
    // Update when slider changes
    yearSlider.addEventListener('input', function() {
        const year = parseInt(this.value);
        updateDisplay(year);
    });
});