// ======= Constants & Templates =======
const TEMPLATES = {
    weaponCard: (weapon) => `
        <div class="weapon-card" onclick="showWeaponDetail(${weapon.id})">
            <img class="lazy-image" data-src="${weapon.image}" alt="${weapon.naam}" width="250" height="200">
            <div class="weapon-card-content">
                <h3>${weapon.naam}</h3>
                <p>${weapon.periode} - ${weapon.jaar}</p>
            </div>
        </div>
    `,
    weaponDetail: (weapon) => `
        <h2>${weapon.naam}</h2>
        <img src="${weapon.image}" alt="${weapon.naam}" width="500" height="350" style="max-width: 100%; height: auto;">
        <div class="weapon-info">
            <p><strong>Periode:</strong> ${weapon.periode}</p>
            <p><strong>Jaar:</strong> ${weapon.jaar}</p>
            <p><strong>Type:</strong> ${weapon.type}</p>
            <br>
            <p><strong>Beschrijving:</strong> ${weapon.beschrijving}</p>
            <br>
            <h3>Specificaties:</h3>
            <ul>
                ${Object.entries(weapon.details).map(([key, value]) => 
                    `<li><strong>${key}:</strong> ${value}</li>`
                ).join('')}
            </ul>
        </div>
    `
};

// ======= URL Parameter Handling =======
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        periodes: params.getAll('periode'),
        types: params.getAll('type'),
        landen: params.getAll('land')
    };
}

function updateUrlParams(filters) {
    const params = new URLSearchParams();
    
    filters.periodes.forEach(periode => params.append('periode', periode));
    filters.types.forEach(type => params.append('type', type));
    filters.landen.forEach(land => params.append('land', land));
    
    const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    window.history.pushState({}, '', newUrl);
}

function applyFiltersFromUrl() {
    const params = getUrlParams();
    
    // Helper function to check checkboxes based on URL params
    const setCheckboxes = (filterId, values) => {
        document.querySelectorAll(`#${filterId} input[type="checkbox"]`).forEach(cb => {
            cb.checked = values.includes(cb.value);
        });
    };

    setCheckboxes('periodFilter', params.periodes);
    setCheckboxes('typeFilter', params.types);
    setCheckboxes('countryFilter', params.landen);
    
    return params;
}

// ======= Initialization =======
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await db.initialize(weaponsData);
        const weapons = await db.getAll();
        renderWeapons(weapons);
        setupEventListeners();
        
        // Apply filters from URL if present
        const urlFilters = applyFiltersFromUrl();
        if (urlFilters.periodes.length || urlFilters.types.length || urlFilters.landen.length) {
            handleFilters();
        }
        
        // Initialize lazy loading
        initLazyLoading('.lazy-image');
    } catch (error) {
        console.error('Initialization failed:', error);
    }
});

// ======= Event Listeners =======
function setupEventListeners() {
    const elements = {
        search: document.getElementById('searchInput'),
        period: document.getElementById('periodFilter'),
        type: document.getElementById('typeFilter'),
        country: document.getElementById('countryFilter'),
        back: document.getElementById('backButton')
    };

    elements.search.addEventListener('input', handleSearch);
    elements.period.addEventListener('change', handleFilters);
    elements.type.addEventListener('change', handleFilters);
    elements.country.addEventListener('change', handleFilters);
    elements.back.addEventListener('click', showOverview);

    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
        applyFiltersFromUrl();
        handleFilters();
    });
}

// ======= Search & Filter Functions =======
async function handleSearch(e) {
    try {
        const query = e.target.value.toLowerCase();
        const results = await db.search(query);
        renderWeapons(results);
    } catch (error) {
        console.error('Search failed:', error);
    }
}

async function handleFilters() {
    try {
        const getSelectedValues = (filterId) => {
            const checkboxes = document.querySelectorAll(`#${filterId} input[type="checkbox"]:checked`);
            return Array.from(checkboxes).map(cb => cb.value);
        };

        const filters = {
            periodes: getSelectedValues('periodFilter'),
            types: getSelectedValues('typeFilter'),
            landen: getSelectedValues('countryFilter')
        };
        
        // Update URL with current filters
        updateUrlParams(filters);
        
        const results = await db.filter(filters.periodes, filters.types, filters.landen);
        renderWeapons(results);
    } catch (error) {
        console.error('Filter failed:', error);
    }
}

// ======= Render Functions =======
function renderWeapons(weapons) {
    const grid = document.getElementById('weapons-grid');
    grid.innerHTML = weapons.map(weapon => TEMPLATES.weaponCard(weapon)).join('');
    
    // Initialize lazy loading for new images
    initLazyLoading('.lazy-image');
}

// Enhance the showWeaponDetail function to prevent layout shifts

async function showWeaponDetail(id) {
    try {
        const weapon = await db.getById(id);
        const detail = document.getElementById('weapon-detail');
        const content = document.getElementById('weapon-content');
        const filters = document.getElementById('filters');
        
        // Pre-allocate height before content change to reduce CLS
        const currentHeight = content.offsetHeight;
        content.style.minHeight = `${currentHeight}px`;
        
        content.innerHTML = TEMPLATES.weaponDetail(weapon);
        document.getElementById('weapons-grid').style.display = 'none';
        detail.classList.remove('hidden');
        filters.style.display = 'none';
        
        // Optimize images in the detail view
        optimizeDetailImage(content);
        
        // Adjust main grid to single column when showing detail
        document.querySelector('main').style.gridTemplateColumns = '1fr';
        
        // Reset min-height after content is loaded
        setTimeout(() => {
            content.style.minHeight = '';
        }, 300);
    } catch (error) {
        console.error('Failed to show weapon detail:', error);
    }
}

function showOverview() {
    document.getElementById('weapon-detail').classList.add('hidden');
    document.getElementById('weapons-grid').style.display = 'grid';
    document.getElementById('filters').style.display = 'block';
    
    // Restore main grid to original layout
    document.querySelector('main').style.gridTemplateColumns = '250px 1fr';
}

// Add this function to handle layout shifts during image loading

function initLazyLoading(selector) {
    const images = document.querySelectorAll(selector);
    
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading
        images.forEach(img => {
            img.loading = 'lazy';
            // Set width and height if not already set
            if (!img.width && !img.height && img.dataset.width && img.dataset.height) {
                img.width = img.dataset.width;
                img.height = img.dataset.height;
            }
        });
    } else {
        // Fallback for browsers that don't support native lazy loading
        const lazyLoadObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy-image');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => {
            lazyLoadObserver.observe(img);
        });
    }
}

// Enhance the existing optimizeDetailImage function
function optimizeDetailImage(container) {
    const images = container.querySelectorAll('img');
    
    images.forEach(img => {
        // Add width and height attributes for proper aspect ratio
        if (img.naturalWidth && img.naturalHeight) {
            img.setAttribute('width', img.naturalWidth);
            img.setAttribute('height', img.naturalHeight);
        } else {
            // Default dimensions if natural dimensions aren't available
            img.setAttribute('width', '640');
            img.setAttribute('height', '480');
        }
        
        // Add loading="lazy" for images not in viewport
        img.loading = 'lazy';
    });
}
