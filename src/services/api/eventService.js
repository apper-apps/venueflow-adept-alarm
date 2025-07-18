import { toast } from 'react-toastify';

class EventService {
  constructor() {
    this.apperClient = null;
    this.tableName = 'event';
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
          { field: { Name: "tenant_id" } },
          { field: { Name: "venue_name" } },
          { field: { Name: "description" } },
          { field: { Name: "date" } },
          { field: { Name: "end_date" } },
          { field: { Name: "status" } },
          { field: { Name: "tickets_sold" } },
          { field: { Name: "capacity" } },
          { field: { Name: "revenue" } },
          { field: { Name: "image" } },
          { field: { Name: "pricing_orchestra" } },
          { field: { Name: "pricing_mezzanine" } },
          { field: { Name: "pricing_balcony" } },
          { field: { Name: "pricing_vip" } },
          { field: { Name: "pricing_general" } },
          { field: { Name: "venue_id" } },
          { field: { Name: "created_at" } }
        ],
        orderBy: [
          { fieldName: "created_at", sorttype: "DESC" }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      // Transform data to match expected format
      return response.data?.map(event => ({
        Id: event.Id,
        name: event.Name,
        tenantId: event.tenant_id,
        venueId: event.venue_id,
        venueName: event.venue_name,
        description: event.description,
        date: event.date,
        endDate: event.end_date,
        status: event.status,
        ticketsSold: event.tickets_sold || 0,
        capacity: event.capacity || 0,
        revenue: event.revenue || 0,
        image: event.image,
        pricing: {
          Orchestra: event.pricing_orchestra,
          Mezzanine: event.pricing_mezzanine,
          Balcony: event.pricing_balcony,
          VIP: event.pricing_vip,
          General: event.pricing_general
        },
        createdAt: event.created_at
      })) || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching events:", error?.response?.data?.message);
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
          { field: { Name: "tenant_id" } },
          { field: { Name: "venue_name" } },
          { field: { Name: "description" } },
          { field: { Name: "date" } },
          { field: { Name: "end_date" } },
          { field: { Name: "status" } },
          { field: { Name: "tickets_sold" } },
          { field: { Name: "capacity" } },
          { field: { Name: "revenue" } },
          { field: { Name: "image" } },
          { field: { Name: "pricing_orchestra" } },
          { field: { Name: "pricing_mezzanine" } },
          { field: { Name: "pricing_balcony" } },
          { field: { Name: "pricing_vip" } },
          { field: { Name: "pricing_general" } },
          { field: { Name: "venue_id" } },
          { field: { Name: "created_at" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);

      if (!response || !response.data) {
        return null;
      }

      // Transform data to match expected format
      const event = response.data;
      return {
        Id: event.Id,
        name: event.Name,
        tenantId: event.tenant_id,
        venueId: event.venue_id,
        venueName: event.venue_name,
        description: event.description,
        date: event.date,
        endDate: event.end_date,
        status: event.status,
        ticketsSold: event.tickets_sold || 0,
        capacity: event.capacity || 0,
        revenue: event.revenue || 0,
        image: event.image,
        pricing: {
          Orchestra: event.pricing_orchestra,
          Mezzanine: event.pricing_mezzanine,
          Balcony: event.pricing_balcony,
          VIP: event.pricing_vip,
          General: event.pricing_general
        },
        createdAt: event.created_at
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching event with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async create(eventData) {
    try {
      const params = {
        records: [
          {
            Name: eventData.name,
            Tags: eventData.tags || "",
            tenant_id: eventData.tenantId || 1,
            venue_name: eventData.venueName || "",
            description: eventData.description || "",
            date: eventData.date,
            end_date: eventData.endDate,
            status: eventData.status || "draft",
            tickets_sold: 0,
            capacity: eventData.capacity || 0,
            revenue: 0,
            image: eventData.image || "",
            pricing_orchestra: eventData.pricing?.Orchestra || 0,
            pricing_mezzanine: eventData.pricing?.Mezzanine || 0,
            pricing_balcony: eventData.pricing?.Balcony || 0,
            pricing_vip: eventData.pricing?.VIP || 0,
            pricing_general: eventData.pricing?.General || 0,
            venue_id: eventData.venueId,
            created_at: new Date().toISOString()
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
          console.error(`Failed to create event ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulRecords.length > 0) {
          const event = successfulRecords[0].data;
          return {
            Id: event.Id,
            name: event.Name,
            tenantId: event.tenant_id,
            venueId: event.venue_id,
            venueName: event.venue_name,
            description: event.description,
            date: event.date,
            endDate: event.end_date,
            status: event.status,
            ticketsSold: event.tickets_sold || 0,
            capacity: event.capacity || 0,
            revenue: event.revenue || 0,
            image: event.image,
            pricing: {
              Orchestra: event.pricing_orchestra,
              Mezzanine: event.pricing_mezzanine,
              Balcony: event.pricing_balcony,
              VIP: event.pricing_vip,
              General: event.pricing_general
            },
            createdAt: event.created_at
          };
        }
      }
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating event:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async update(id, eventData) {
    try {
      const params = {
        records: [
          {
            Id: id,
            Name: eventData.name,
            Tags: eventData.tags || "",
            tenant_id: eventData.tenantId,
            venue_name: eventData.venueName,
            description: eventData.description || "",
            date: eventData.date,
            end_date: eventData.endDate,
            status: eventData.status,
            tickets_sold: eventData.ticketsSold,
            capacity: eventData.capacity,
            revenue: eventData.revenue,
            image: eventData.image || "",
            pricing_orchestra: eventData.pricing?.Orchestra || 0,
            pricing_mezzanine: eventData.pricing?.Mezzanine || 0,
            pricing_balcony: eventData.pricing?.Balcony || 0,
            pricing_vip: eventData.pricing?.VIP || 0,
            pricing_general: eventData.pricing?.General || 0,
            venue_id: eventData.venueId
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
          console.error(`Failed to update event ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulUpdates.length > 0) {
          const event = successfulUpdates[0].data;
          return {
            Id: event.Id,
            name: event.Name,
            tenantId: event.tenant_id,
            venueId: event.venue_id,
            venueName: event.venue_name,
            description: event.description,
            date: event.date,
            endDate: event.end_date,
            status: event.status,
            ticketsSold: event.tickets_sold || 0,
            capacity: event.capacity || 0,
            revenue: event.revenue || 0,
            image: event.image,
            pricing: {
              Orchestra: event.pricing_orchestra,
              Mezzanine: event.pricing_mezzanine,
              Balcony: event.pricing_balcony,
              VIP: event.pricing_vip,
              General: event.pricing_general
            },
            createdAt: event.created_at
          };
        }
      }
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating event:", error?.response?.data?.message);
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
          console.error(`Failed to delete event ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successfulDeletions.length > 0;
      }
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting event:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }

  async getUpcoming(limit = 5) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "venue_name" } },
          { field: { Name: "date" } },
          { field: { Name: "status" } },
          { field: { Name: "tickets_sold" } },
          { field: { Name: "capacity" } },
          { field: { Name: "revenue" } }
        ],
        where: [
          {
            fieldName: "date",
            Operator: "GreaterThan",
            Values: [new Date().toISOString()]
          }
        ],
        orderBy: [
          { fieldName: "date", sorttype: "ASC" }
        ],
        pagingInfo: {
          limit: limit,
          offset: 0
        }
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data?.map(event => ({
        Id: event.Id,
        name: event.Name,
        venueName: event.venue_name,
        date: event.date,
        status: event.status,
        ticketsSold: event.tickets_sold || 0,
        capacity: event.capacity || 0,
        revenue: event.revenue || 0
      })) || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching upcoming events:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }
}

export default new EventService();