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

    filter(periodes, types, landen) {
        return this.weapons.filter(weapon => {
            const matchesPeriode = !periodes.length || periodes.includes(weapon.periode);
            const matchesType = !types.length || types.includes(weapon.type);
            const matchesLand = !landen.length || landen.includes(weapon.details.land);
            return matchesPeriode && matchesType && matchesLand;
        });
    },

    getById(id) {
        return this.weapons.find(weapon => weapon.id === id);
    }
};