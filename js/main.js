// ======= Constants & Templates =======
const TEMPLATES = {
    weaponCard: (weapon) => `
        <div class="weapon-card" onclick="showWeaponDetail(${weapon.id})">
            <img src="${weapon.image}" alt="${weapon.naam}">
            <div class="weapon-card-content">
                <h3>${weapon.naam}</h3>
                <p>${weapon.periode} - ${weapon.jaar}</p>
            </div>
        </div>
    `,
    weaponDetail: (weapon) => `
        <h2>${weapon.naam}</h2>
        <img src="${weapon.image}" alt="${weapon.naam}">
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

// ======= Initialization =======
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await db.initialize(weaponsData);
        const weapons = await db.getAll();
        renderWeapons(weapons);
        setupEventListeners();
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
        const filters = {
            periode: document.getElementById('periodFilter').value,
            type: document.getElementById('typeFilter').value,
            land: document.getElementById('countryFilter').value
        };
        
        const results = await db.filter(filters.periode, filters.type, filters.land);
        renderWeapons(results);
    } catch (error) {
        console.error('Filter failed:', error);
    }
}

// ======= Render Functions =======
function renderWeapons(weapons) {
    const grid = document.getElementById('weapons-grid');
    grid.innerHTML = weapons.map(weapon => TEMPLATES.weaponCard(weapon)).join('');
}

async function showWeaponDetail(id) {
    try {
        const weapon = await db.getById(id);
        const detail = document.getElementById('weapon-detail');
        const content = document.getElementById('weapon-content');
        
        content.innerHTML = TEMPLATES.weaponDetail(weapon);
        document.getElementById('weapons-grid').style.display = 'none';
        detail.classList.remove('hidden');
    } catch (error) {
        console.error('Failed to show weapon detail:', error);
    }
}

function showOverview() {
    document.getElementById('weapon-detail').classList.add('hidden');
    document.getElementById('weapons-grid').style.display = 'grid';
}
