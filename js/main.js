// Initialisatie
document.addEventListener('DOMContentLoaded', async () => {
    await db.initialize(weaponsData);
    renderWeapons(await db.getAll());
    setupEventListeners();
});

// Event listeners
function setupEventListeners() {
    document.getElementById('searchInput').addEventListener('input', handleSearch);
    document.getElementById('periodFilter').addEventListener('change', handleFilters);
    document.getElementById('typeFilter').addEventListener('change', handleFilters);
    document.getElementById('countryFilter').addEventListener('change', handleFilters); // Nieuwe filter
    document.getElementById('backButton').addEventListener('click', showOverview);
}

// Zoek en filter functies
async function handleSearch(e) {
    const query = e.target.value.toLowerCase();
    const results = await db.search(query);
    renderWeapons(results);
}

async function handleFilters() {
    const periode = document.getElementById('periodFilter').value;
    const type = document.getElementById('typeFilter').value;
    const land = document.getElementById('countryFilter').value; // Nieuwe filter
    const results = await db.filter(periode, type, land); // Pas de filterfunctie aan
    renderWeapons(results);
}

// Rendering functies
function renderWeapons(weapons) {
    const grid = document.getElementById('weapons-grid');
    grid.innerHTML = weapons.map(weapon => `
        <div class="weapon-card" onclick="showWeaponDetail(${weapon.id})">
            <img src="${weapon.image}" alt="${weapon.naam}">
            <div class="weapon-card-content">
                <h3>${weapon.naam}</h3>
                <p>${weapon.periode} - ${weapon.jaar}</p>
            </div>
        </div>
    `).join('');
}

async function showWeaponDetail(id) {
    const weapon = await db.getById(id);
    const detail = document.getElementById('weapon-detail');
    const content = document.getElementById('weapon-content');
    
    content.innerHTML = `
        <h2>${weapon.naam}</h2>
        <img src="${weapon.image}" alt="${weapon.naam}">
        <div class="weapon-info">
            <p><strong>Periode:</strong> ${weapon.periode}</p>
            <p><strong>Jaar:</strong> ${weapon.jaar}</p>
            <p><strong>Type:</strong> ${weapon.type}</p> <br>
            <p><strong>Beschrijving:</strong>${weapon.beschrijving}</p> <br>
            <h3>Specificaties:</h3>
            <ul>
                ${Object.entries(weapon.details).map(([key, value]) => `
                    <li><strong>${key}:</strong> ${value}</li>
                `).join('')}
            </ul>
        </div>
    `;

    document.getElementById('weapons-grid').style.display = 'none';
    detail.classList.remove('hidden');
}

function showOverview() {
    document.getElementById('weapon-detail').classList.add('hidden');
    document.getElementById('weapons-grid').style.display = 'grid';
}
