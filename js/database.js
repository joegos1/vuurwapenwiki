const db = {
    weapons: [],

    initialize(data) {
        this.weapons = data;
    },

    getAll() {
        return this.weapons;
    },

    search(query) {
        return this.weapons.filter(weapon =>
            weapon.naam.toLowerCase().includes(query) ||
            weapon.periode.toLowerCase().includes(query) ||
            weapon.type.toLowerCase().includes(query)
        );
    },

    filter(periode, type, land) {
        return this.weapons.filter(weapon => {
            return (!periode || weapon.periode === periode) &&
                   (!type || weapon.type === type) &&
                   (!land || weapon.details.land === land);
        });
    },

    getById(id) {
        return this.weapons.find(weapon => weapon.id === id);
    }
};