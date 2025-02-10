const db = {
    weapons: [],

    initialize(data) {
        this.weapons = data;
    },

    getAll() {
        return this.weapons;
    },

    search(query) {
        const normalize = (str) => str.toLowerCase().normalize("NFD").replace(/[-]/g, "");
        const normalizedQuery = normalize(query);
        return this.weapons.filter(weapon =>
            normalize(weapon.naam).includes(normalizedQuery) ||
            normalize(weapon.periode).includes(normalizedQuery) ||
            normalize(weapon.type).includes(normalizedQuery) ||
            normalize(weapon.details.land).includes(normalizedQuery)
        );
    },

    filter(periodes, types, landen) {
        return this.weapons.filter(weapon => {
            // Normalize strings by converting to lowercase and removing diacritics
            const normalize = (str) => str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            
            // Handle multiple countries separated by '/'
            const weaponLanden = weapon.details.land.split('/').map(land => normalize(land.trim()));
            
            const matchesPeriode = !periodes.length || periodes.map(normalize).includes(normalize(weapon.periode));
            const matchesType = !types.length || types.map(normalize).includes(normalize(weapon.type));
            const matchesLand = !landen.length || landen.map(normalize).some(land =>
                weaponLanden.some(weaponLand => weaponLand.includes(normalize(land)))
            );
            
            return matchesPeriode && matchesType && matchesLand;
        });
    },

    getById(id) {
        return this.weapons.find(weapon => weapon.id === id);
    }
};