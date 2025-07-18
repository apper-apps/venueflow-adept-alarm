import { toast } from 'react-toastify';

class TicketService {
  constructor() {
    this.apperClient = null;
    this.tableName = 'ticket';
    this.initializeClient();
  }

  initializeClient() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "seat_id" } },
          { field: { Name: "qr_code" } },
          { field: { Name: "status" } },
          { field: { Name: "purchased_by_first_name" } },
          { field: { Name: "purchased_by_last_name" } },
          { field: { Name: "purchased_by_email" } },
          { field: { Name: "purchased_by_phone" } },
          { field: { Name: "price" } },
          { field: { Name: "purchase_date" } },
          { field: { Name: "scanned_at" } },
          { field: { Name: "event_id" } }
        ],
        orderBy: [
          { fieldName: "purchase_date", sorttype: "DESC" }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      // Transform data to match expected format
      return response.data?.map(ticket => ({
        Id: ticket.Id,
        eventId: ticket.event_id,
        seatId: ticket.seat_id,
        qrCode: ticket.qr_code,
        status: ticket.status,
        purchasedBy: {
          firstName: ticket.purchased_by_first_name,
          lastName: ticket.purchased_by_last_name,
          email: ticket.purchased_by_email,
          phone: ticket.purchased_by_phone
        },
        price: ticket.price,
        purchaseDate: ticket.purchase_date,
        scannedAt: ticket.scanned_at
      })) || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching tickets:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "seat_id" } },
          { field: { Name: "qr_code" } },
          { field: { Name: "status" } },
          { field: { Name: "purchased_by_first_name" } },
          { field: { Name: "purchased_by_last_name" } },
          { field: { Name: "purchased_by_email" } },
          { field: { Name: "purchased_by_phone" } },
          { field: { Name: "price" } },
          { field: { Name: "purchase_date" } },
          { field: { Name: "scanned_at" } },
          { field: { Name: "event_id" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);

      if (!response || !response.data) {
        return null;
      }

      // Transform data to match expected format
      const ticket = response.data;
      return {
        Id: ticket.Id,
        eventId: ticket.event_id,
        seatId: ticket.seat_id,
        qrCode: ticket.qr_code,
        status: ticket.status,
        purchasedBy: {
          firstName: ticket.purchased_by_first_name,
          lastName: ticket.purchased_by_last_name,
          email: ticket.purchased_by_email,
          phone: ticket.purchased_by_phone
        },
        price: ticket.price,
        purchaseDate: ticket.purchase_date,
        scannedAt: ticket.scanned_at
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching ticket with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async getByEventId(eventId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "seat_id" } },
          { field: { Name: "qr_code" } },
          { field: { Name: "status" } },
          { field: { Name: "purchased_by_first_name" } },
          { field: { Name: "purchased_by_last_name" } },
          { field: { Name: "purchased_by_email" } },
          { field: { Name: "price" } },
          { field: { Name: "purchase_date" } },
          { field: { Name: "event_id" } }
        ],
        where: [
          {
            fieldName: "event_id",
            Operator: "EqualTo",
            Values: [eventId]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data?.map(ticket => ({
        Id: ticket.Id,
        eventId: ticket.event_id,
        seatId: ticket.seat_id,
        qrCode: ticket.qr_code,
        status: ticket.status,
        purchasedBy: {
          firstName: ticket.purchased_by_first_name,
          lastName: ticket.purchased_by_last_name,
          email: ticket.purchased_by_email,
          phone: ticket.purchased_by_phone
        },
        price: ticket.price,
        purchaseDate: ticket.purchase_date
      })) || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching tickets for event ${eventId}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async create(ticketData) {
    try {
      const params = {
        records: [
          {
            Name: ticketData.name || `Ticket-${Date.now()}`,
            Tags: ticketData.tags || "",
            seat_id: ticketData.seatId,
            qr_code: ticketData.qrCode || `QR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            status: "valid",
            purchased_by_first_name: ticketData.purchasedBy?.firstName || "",
            purchased_by_last_name: ticketData.purchasedBy?.lastName || "",
            purchased_by_email: ticketData.purchasedBy?.email || "",
            purchased_by_phone: ticketData.purchasedBy?.phone || "",
            price: ticketData.price || 0,
            purchase_date: new Date().toISOString(),
            scanned_at: null,
            event_id: ticketData.eventId
          }
        ]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create ticket ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulRecords.length > 0) {
          const ticket = successfulRecords[0].data;
          return {
            Id: ticket.Id,
            eventId: ticket.event_id,
            seatId: ticket.seat_id,
            qrCode: ticket.qr_code,
            status: ticket.status,
            purchasedBy: {
              firstName: ticket.purchased_by_first_name,
              lastName: ticket.purchased_by_last_name,
              email: ticket.purchased_by_email,
              phone: ticket.purchased_by_phone
            },
            price: ticket.price,
            purchaseDate: ticket.purchase_date,
            scannedAt: ticket.scanned_at
          };
        }
      }
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating ticket:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async update(id, ticketData) {
    try {
      const params = {
        records: [
          {
            Id: id,
            Name: ticketData.name,
            Tags: ticketData.tags || "",
            seat_id: ticketData.seatId,
            qr_code: ticketData.qrCode,
            status: ticketData.status,
            purchased_by_first_name: ticketData.purchasedBy?.firstName,
            purchased_by_last_name: ticketData.purchasedBy?.lastName,
            purchased_by_email: ticketData.purchasedBy?.email,
            purchased_by_phone: ticketData.purchasedBy?.phone,
            price: ticketData.price,
            purchase_date: ticketData.purchaseDate,
            scanned_at: ticketData.scannedAt,
            event_id: ticketData.eventId
          }
        ]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update ticket ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulUpdates.length > 0) {
          const ticket = successfulUpdates[0].data;
          return {
            Id: ticket.Id,
            eventId: ticket.event_id,
            seatId: ticket.seat_id,
            qrCode: ticket.qr_code,
            status: ticket.status,
            purchasedBy: {
              firstName: ticket.purchased_by_first_name,
              lastName: ticket.purchased_by_last_name,
              email: ticket.purchased_by_email,
              phone: ticket.purchased_by_phone
            },
            price: ticket.price,
            purchaseDate: ticket.purchase_date,
            scannedAt: ticket.scanned_at
          };
        }
      }
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating ticket:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [id]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ticket ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successfulDeletions.length > 0;
      }
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting ticket:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }

  async validateQR(qrCode) {
    try {
      const params = {
        fields: [
          { field: { Name: "qr_code" } },
          { field: { Name: "status" } },
          { field: { Name: "purchased_by_first_name" } },
          { field: { Name: "purchased_by_last_name" } },
          { field: { Name: "event_id" } }
        ],
        where: [
          {
            fieldName: "qr_code",
            Operator: "EqualTo",
            Values: [qrCode]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);

      if (!response.success || !response.data || response.data.length === 0) {
        return { valid: false, message: "Invalid QR code" };
      }

      const ticket = response.data[0];

      if (ticket.status === "used") {
        return { 
          valid: false, 
          message: "Ticket already used", 
          ticket: {
            Id: ticket.Id,
            status: ticket.status,
            purchasedBy: {
              firstName: ticket.purchased_by_first_name,
              lastName: ticket.purchased_by_last_name
            }
          }
        };
      }

      return { 
        valid: true, 
        message: "Valid ticket", 
        ticket: {
          Id: ticket.Id,
          status: ticket.status,
          purchasedBy: {
            firstName: ticket.purchased_by_first_name,
            lastName: ticket.purchased_by_last_name
          }
        }
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error validating QR code:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return { valid: false, message: "Error validating ticket" };
    }
  }

  async scanTicket(qrCode) {
    try {
      // First find the ticket
      const validation = await this.validateQR(qrCode);
      
      if (!validation.valid) {
        return { success: false, message: validation.message };
      }

      if (validation.ticket.status !== "valid") {
        return { success: false, message: "Invalid or already used ticket" };
      }

      // Update ticket status to used
      const updateResult = await this.update(validation.ticket.Id, {
        status: "used",
        scannedAt: new Date().toISOString()
      });

      if (updateResult) {
        return { 
          success: true, 
          message: "Ticket scanned successfully", 
          ticket: updateResult 
        };
      } else {
        return { success: false, message: "Failed to update ticket status" };
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error scanning ticket:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return { success: false, message: "Error scanning ticket" };
    }
  }
}

export default new TicketService();