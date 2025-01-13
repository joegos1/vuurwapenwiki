// Simpele in-memory database implementatie
class Database {
    constructor() {
        this.data = null;
    }

    async initialize(data) {
        this.data = data;
    }

    async getAll() {
        return this.data;
    }

    async getById(id) {
        return this.data.find(item => item.id === id);
    }

    async search(query) {
        query = query.toLowerCase();
        return this.data.filter(item => 
            item.naam.toLowerCase().includes(query) ||
            item.periode.toLowerCase().includes(query) ||
            item.type.toLowerCase().includes(query)
        );
    }

    async filter(periode, type) {
        return this.data.filter(item => {
            const periodeMatch = !periode || item.periode === periode;
            const typeMatch = !type || item.type === type;
            return periodeMatch && typeMatch;
        });
    }
}

const db = new Database();