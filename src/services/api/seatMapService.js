import seatMapsData from "@/services/mockData/seatMaps.json";

class SeatMapService {
  constructor() {
    this.seatMaps = [...seatMapsData];
  }

  async getAll() {
    await this.delay();
    return [...this.seatMaps];
  }

  async getById(id) {
    await this.delay();
    return this.seatMaps.find(map => map.Id === id) || null;
  }

  async getByVenueId(venueId) {
    await this.delay();
    return this.seatMaps.filter(map => map.venueId === venueId);
  }

  async create(seatMapData) {
    await this.delay();
    const newSeatMap = {
      Id: Math.max(...this.seatMaps.map(m => m.Id), 0) + 1,
      ...seatMapData,
      createdAt: new Date().toISOString()
    };
    this.seatMaps.push(newSeatMap);
    return { ...newSeatMap };
  }

  async update(id, seatMapData) {
    await this.delay();
    const index = this.seatMaps.findIndex(map => map.Id === id);
    if (index !== -1) {
      this.seatMaps[index] = { ...this.seatMaps[index], ...seatMapData };
      return { ...this.seatMaps[index] };
    }
    return null;
  }

  async delete(id) {
    await this.delay();
    const index = this.seatMaps.findIndex(map => map.Id === id);
    if (index !== -1) {
      this.seatMaps.splice(index, 1);
      return true;
    }
    return false;
  }

  async createTemplate(templateData) {
    await this.delay();
    const template = {
      Id: Math.max(...this.seatMaps.map(m => m.Id), 0) + 1,
      ...templateData,
      isTemplate: true,
      venueId: null,
      createdAt: new Date().toISOString()
    };
    this.seatMaps.push(template);
    return { ...template };
  }

  async getTemplates() {
    await this.delay();
    return this.seatMaps.filter(map => map.isTemplate);
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, 300));
  }
}

export default new SeatMapService();