import venuesData from "@/services/mockData/venues.json";

class VenueService {
  constructor() {
    this.venues = [...venuesData];
  }

  async getAll() {
    await this.delay();
    return [...this.venues];
  }

  async getById(id) {
    await this.delay();
    return this.venues.find(venue => venue.Id === id) || null;
  }

  async create(venueData) {
    await this.delay();
    const newVenue = {
      Id: Math.max(...this.venues.map(v => v.Id), 0) + 1,
      ...venueData,
      createdAt: new Date().toISOString()
    };
    this.venues.push(newVenue);
    return { ...newVenue };
  }

  async update(id, venueData) {
    await this.delay();
    const index = this.venues.findIndex(venue => venue.Id === id);
    if (index !== -1) {
      this.venues[index] = { ...this.venues[index], ...venueData };
      return { ...this.venues[index] };
    }
    return null;
  }

  async delete(id) {
    await this.delay();
    const index = this.venues.findIndex(venue => venue.Id === id);
    if (index !== -1) {
      this.venues.splice(index, 1);
      return true;
    }
    return false;
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, 300));
  }
}

export default new VenueService();