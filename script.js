document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM loaded - initializing DriveX");

    // ===================== HERO SLIDESHOW =====================
    const hero = document.querySelector('.hero');
    if (hero) {
        const backgrounds = [
            'url("img/bg.jpg")',
            'url("img/bg-light.jpg")'
        ];
        let current = 0;

        function changeBackground() {
            hero.style.backgroundImage = backgrounds[current];
            current = (current + 1) % backgrounds.length;
        }

        // Initialize first background
        hero.style.backgroundImage = backgrounds[0];
        
        // Change every 2 seconds with 1s transition
        setInterval(changeBackground, 2000);
    }

    // ===================== MOBILE MENU TOGGLE =====================
    const menuToggle = document.createElement('div');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    document.querySelector('nav').appendChild(menuToggle);
    
    menuToggle.addEventListener('click', function() {
        document.querySelector('.menu').classList.toggle('active');
        this.querySelector('i').classList.toggle('fa-times');
    });
    
    // Close menu when clicking on a link
    document.querySelectorAll('.menu a').forEach(link => {
        link.addEventListener('click', function() {
            document.querySelector('.menu').classList.remove('active');
            menuToggle.querySelector('i').classList.remove('fa-times');
        });
    });
    
    // ===================== HEADER SCROLL EFFECT =====================
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            document.querySelector('header').classList.add('scrolled');
        } else {
            document.querySelector('header').classList.remove('scrolled');
        }
    });
    
    // ===================== SEARCH FORM VALIDATION =====================
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        // Set minimum dates for search form
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('pickupDate').min = today;
        document.getElementById('returnDate').min = today;
        
        // Update return date min when pickup date changes
        document.getElementById('pickupDate').addEventListener('change', function() {
            document.getElementById('returnDate').min = this.value;
        });
        
        // Search form submission
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const pickupLocation = this.querySelector('input[type="text"]').value;
            const pickupDate = document.getElementById('pickupDate').value;
            const returnDate = document.getElementById('returnDate').value;
            
            if (!pickupLocation || !pickupDate || !returnDate) {
                alert('Please fill in all fields');
                return;
            }
            
            if (new Date(returnDate) <= new Date(pickupDate)) {
                alert('Return date must be after pickup date');
                return;
            }
            
            alert(`Searching for vehicles in ${pickupLocation} from ${pickupDate} to ${returnDate}`);
        });
    }
    
    // ===================== FLEET DATA AND FILTERING =====================
    const fleetData = [
        {
            id: 1,
            name: "BMW M5",
            category: "luxury",
            type: "Sedan",
            seats: 5,
            transmission: "Automatic",
            fuel: "Gasoline",
            price: 199,
            image: "img/bmw-m5.jpg",
            features: ["Premium Sound", "Leather Seats", "Navigation"]
        },
        {
            id: 2,
            name: "Mercedes GLE",
            category: "suv",
            type: "SUV",
            seats: 7,
            transmission: "Automatic",
            fuel: "Diesel",
            price: 179,
            image: "img/mercedes-gle.jpg",
            features: ["Panoramic Roof", "Heated Seats", "360 Camera"]
        },
        {
            id: 3,
            name: "Porsche 911",
            category: "sports",
            type: "Sports Car",
            seats: 4,
            transmission: "Automatic",
            fuel: "Gasoline",
            price: 299,
            image: "img/porsche-911.jpg",
            features: ["Sport Exhaust", "Carbon Fiber", "Launch Control"]
        },
        {
            id: 4,
            name: "Tesla Model S",
            category: "electric",
            type: "Sedan",
            seats: 5,
            transmission: "Automatic",
            fuel: "Electric",
            price: 229,
            image: "img/tesla-model-s.jpg",
            features: ["Autopilot", "Ludicrous Mode", "Glass Roof"]
        },
        {
            id: 5,
            name: "Range Rover",
            category: "suv",
            type: "Luxury SUV",
            seats: 5,
            transmission: "Automatic",
            fuel: "Diesel",
            price: 249,
            image: "img/range-rover.jpg",
            features: ["Terrain Response", "Massage Seats", "Cooled Seats"]
        },
        {
            id: 6,
            name: "Audi R8",
            category: "sports",
            type: "Supercar",
            seats: 2,
            transmission: "Automatic",
            fuel: "Gasoline",
            price: 399,
            image: "img/audi-r8.jpg",
            features: ["Quattro AWD", "Carbon Ceramics", "Magnetic Ride"]
        },
        {
            id: 7,
            name: "Lexus LS",
            category: "luxury",
            type: "Sedan",
            seats: 5,
            transmission: "Automatic",
            fuel: "Hybrid",
            price: 189,
            image: "img/lexus-ls.jpg",
            features: ["Mark Levinson Audio", "Rear Executive", "Air Suspension"]
        },
        {
            id: 8,
            name: "Tesla Model X",
            category: "electric",
            type: "SUV",
            seats: 7,
            transmission: "Automatic",
            fuel: "Electric",
            price: 279,
            image: "img/tesla-model-x.jpg",
            features: ["Falcon Doors", "Bioweapon Defense", "Autopilot"]
        }
    ];
    
    // Initialize fleet if the element exists
    const fleetGrid = document.getElementById('fleetGrid');
    if (fleetGrid) {
        // Load all vehicles initially
        loadVehicles(fleetData);
        
        // Category filter buttons
        const categoryBtns = document.querySelectorAll('.category-btn');
        if (categoryBtns.length > 0) {
            categoryBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    // Update active button
                    categoryBtns.forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    
                    const category = this.dataset.category;
                    
                    if (category === 'all') {
                        loadVehicles(fleetData);
                    } else {
                        const filteredVehicles = fleetData.filter(vehicle => vehicle.category === category);
                        loadVehicles(filteredVehicles);
                    }
                });
            });
        }
    }
    
    //  VEHICLE LOADING FUNCTION 
    function loadVehicles(vehicles) {
        const fleetGrid = document.getElementById('fleetGrid');
        
        // Double-check fleetGrid exists
        if (!fleetGrid) {
            console.error("Fleet grid container not found!");
            return;
        }
        
        fleetGrid.innerHTML = '';
        
        if (vehicles.length === 0) {
            fleetGrid.innerHTML = '<p class="no-vehicles">No vehicles found in this category.</p>';
            return;
        }
        
        vehicles.forEach(vehicle => {
            const vehicleCard = document.createElement('div');
            vehicleCard.className = 'vehicle-card';
            
            vehicleCard.innerHTML = `
                <div class="vehicle-image">
                    <img src="${vehicle.image}" alt="${vehicle.name}">
                </div>
                <div class="vehicle-info">
                    <h3>${vehicle.name}</h3>
                    <div class="vehicle-specs">
                        <div class="vehicle-spec">
                            <i class="fas fa-car"></i>${vehicle.type}
                        </div>
                        <div class="vehicle-spec">
                            <i class="fas fa-users"></i>${vehicle.seats} seats
                        </div>
                        <div class="vehicle-spec">
                            <i class="fas fa-cog"></i>${vehicle.transmission}
                        </div>
                        <div class="vehicle-spec">
                            <i class="fas fa-gas-pump"></i>${vehicle.fuel}
                        </div>
                    </div>
                    <div class="vehicle-price">
                        <div class="price">$${vehicle.price}<span>/day</span></div>
                        <div> <a href="contact.html" class="btn">Book Now </a></div>
                    </div>
                </div>
            `;
            
            fleetGrid.appendChild(vehicleCard);
        });
        
        // Add event listeners to book buttons
        document.querySelectorAll('.book-vehicle-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const vehicleCard = this.closest('.vehicle-card');
                const vehicleName = vehicleCard.querySelector('h3').textContent;
                alert(`Booking ${vehicleName} - this would redirect to booking page in a real app.`);
            });
        });
    }
    
    //  SMOOTH SCROLLING
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            // Skip if it's the services link (handled separately)
            if (this.getAttribute('href') === '#services') return;
            
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without jumping
                if (history.pushState) {
                    history.pushState(null, null, targetId);
                } else {
                    window.location.hash = targetId;
                }
            }
        });
    });
    
    // Handle anchor links from other pages
    if (window.location.hash) {
        const targetId = window.location.hash;
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            setTimeout(() => {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }, 100);
        }
    }
    
    // FORM HANDLING 
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your message! We will contact you soon.');
            this.reset();
        });
    }
    
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input').value;
            alert(`Thank you for subscribing with ${email}!`);
            this.reset();
        });
    });
});

// Hero background slideshow fallback
const hero = document.querySelector('.hero');
if (hero) {
    const backgrounds = [
        'url(img/bg.jpg)',
        'url(img/bg-light.jpg)'
    ];
    let current = 0;

    function changeBackground() {
        hero.style.backgroundImage = backgrounds[current];
        current = (current + 1) % backgrounds.length;
    }
}