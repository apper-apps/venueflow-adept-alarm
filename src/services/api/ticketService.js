import ticketsData from "@/services/mockData/tickets.json";

class TicketService {
  constructor() {
    this.tickets = [...ticketsData];
  }

  async getAll() {
    await this.delay();
    return [...this.tickets];
  }

  async getById(id) {
    await this.delay();
    return this.tickets.find(ticket => ticket.Id === id) || null;
  }

  async getByEventId(eventId) {
    await this.delay();
    return this.tickets.filter(ticket => ticket.eventId === eventId);
  }

  async create(ticketData) {
    await this.delay();
    const newTicket = {
      Id: Math.max(...this.tickets.map(t => t.Id), 0) + 1,
      ...ticketData,
      status: "valid",
      purchaseDate: new Date().toISOString(),
      scannedAt: null
    };
    this.tickets.push(newTicket);
    return { ...newTicket };
  }

  async update(id, ticketData) {
    await this.delay();
    const index = this.tickets.findIndex(ticket => ticket.Id === id);
    if (index !== -1) {
      this.tickets[index] = { ...this.tickets[index], ...ticketData };
      return { ...this.tickets[index] };
    }
    return null;
  }

  async delete(id) {
    await this.delay();
    const index = this.tickets.findIndex(ticket => ticket.Id === id);
    if (index !== -1) {
      this.tickets.splice(index, 1);
      return true;
    }
    return false;
  }

  async validateQR(qrCode) {
    await this.delay();
    const ticket = this.tickets.find(t => t.qrCode === qrCode);
    
    if (!ticket) {
      return { valid: false, message: "Invalid QR code" };
    }

    if (ticket.status === "used") {
      return { valid: false, message: "Ticket already used", ticket };
    }

    return { valid: true, message: "Valid ticket", ticket };
  }

  async scanTicket(qrCode) {
    await this.delay();
    const ticket = this.tickets.find(t => t.qrCode === qrCode);
    
    if (!ticket || ticket.status !== "valid") {
      return { success: false, message: "Invalid or already used ticket" };
    }

    ticket.status = "used";
    ticket.scannedAt = new Date().toISOString();
    
    return { success: true, message: "Ticket scanned successfully", ticket };
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, 300));
  }
}

export default new TicketService();