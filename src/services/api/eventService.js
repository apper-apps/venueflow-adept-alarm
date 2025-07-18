import eventsData from "@/services/mockData/events.json";

class EventService {
  constructor() {
    this.events = [...eventsData];
  }

  async getAll() {
    await this.delay();
    return [...this.events];
  }

  async getById(id) {
    await this.delay();
    return this.events.find(event => event.Id === id) || null;
  }

  async create(eventData) {
    await this.delay();
    const newEvent = {
      Id: Math.max(...this.events.map(e => e.Id), 0) + 1,
      ...eventData,
      ticketsSold: 0,
      revenue: 0,
      status: "draft",
      createdAt: new Date().toISOString()
    };
    this.events.push(newEvent);
    return { ...newEvent };
  }

  async update(id, eventData) {
    await this.delay();
    const index = this.events.findIndex(event => event.Id === id);
    if (index !== -1) {
      this.events[index] = { ...this.events[index], ...eventData };
      return { ...this.events[index] };
    }
    return null;
  }

  async delete(id) {
    await this.delay();
    const index = this.events.findIndex(event => event.Id === id);
    if (index !== -1) {
      this.events.splice(index, 1);
      return true;
    }
    return false;
  }

  async getUpcoming(limit = 5) {
    await this.delay();
    const now = new Date();
    return this.events
      .filter(event => new Date(event.date) > now)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, limit);
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, 300));
  }
}

export default new EventService();