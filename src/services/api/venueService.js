import { toast } from 'react-toastify';

class VenueService {
  constructor() {
    this.apperClient = null;
    this.tableName = 'venue';
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
          { field: { Name: "address_street" } },
          { field: { Name: "address_city" } },
          { field: { Name: "address_state" } },
          { field: { Name: "address_zip_code" } },
          { field: { Name: "address_country" } },
          { field: { Name: "capacity" } },
          { field: { Name: "description" } },
          { field: { Name: "amenities" } },
          { field: { Name: "seat_map_id" } },
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
      return response.data?.map(venue => ({
        Id: venue.Id,
        name: venue.Name,
        tenantId: venue.tenant_id,
        address: {
          street: venue.address_street,
          city: venue.address_city,
          state: venue.address_state,
          zipCode: venue.address_zip_code,
          country: venue.address_country
        },
        capacity: venue.capacity,
        seatMapId: venue.seat_map_id,
        description: venue.description,
        amenities: venue.amenities ? venue.amenities.split(',') : [],
        createdAt: venue.created_at
      })) || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching venues:", error?.response?.data?.message);
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
          { field: { Name: "address_street" } },
          { field: { Name: "address_city" } },
          { field: { Name: "address_state" } },
          { field: { Name: "address_zip_code" } },
          { field: { Name: "address_country" } },
          { field: { Name: "capacity" } },
          { field: { Name: "description" } },
          { field: { Name: "amenities" } },
          { field: { Name: "seat_map_id" } },
          { field: { Name: "created_at" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);

      if (!response || !response.data) {
        return null;
      }

      // Transform data to match expected format
      const venue = response.data;
      return {
        Id: venue.Id,
        name: venue.Name,
        tenantId: venue.tenant_id,
        address: {
          street: venue.address_street,
          city: venue.address_city,
          state: venue.address_state,
          zipCode: venue.address_zip_code,
          country: venue.address_country
        },
        capacity: venue.capacity,
        seatMapId: venue.seat_map_id,
        description: venue.description,
        amenities: venue.amenities ? venue.amenities.split(',') : [],
        createdAt: venue.created_at
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching venue with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async create(venueData) {
    try {
      const params = {
        records: [
          {
            Name: venueData.name,
            Tags: venueData.tags || "",
            tenant_id: venueData.tenantId || 1,
            address_street: venueData.address?.street || "",
            address_city: venueData.address?.city || "",
            address_state: venueData.address?.state || "",
            address_zip_code: venueData.address?.zipCode || "",
            address_country: venueData.address?.country || "",
            capacity: venueData.capacity || 0,
            description: venueData.description || "",
            amenities: Array.isArray(venueData.amenities) ? venueData.amenities.join(',') : "",
            seat_map_id: venueData.seatMapId || null,
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
          console.error(`Failed to create venue ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulRecords.length > 0) {
          const venue = successfulRecords[0].data;
          return {
            Id: venue.Id,
            name: venue.Name,
            tenantId: venue.tenant_id,
            address: {
              street: venue.address_street,
              city: venue.address_city,
              state: venue.address_state,
              zipCode: venue.address_zip_code,
              country: venue.address_country
            },
            capacity: venue.capacity,
            seatMapId: venue.seat_map_id,
            description: venue.description,
            amenities: venue.amenities ? venue.amenities.split(',') : [],
            createdAt: venue.created_at
          };
        }
      }
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating venue:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async update(id, venueData) {
    try {
      const params = {
        records: [
          {
            Id: id,
            Name: venueData.name,
            Tags: venueData.tags || "",
            tenant_id: venueData.tenantId,
            address_street: venueData.address?.street || "",
            address_city: venueData.address?.city || "",
            address_state: venueData.address?.state || "",
            address_zip_code: venueData.address?.zipCode || "",
            address_country: venueData.address?.country || "",
            capacity: venueData.capacity,
            description: venueData.description || "",
            amenities: Array.isArray(venueData.amenities) ? venueData.amenities.join(',') : "",
            seat_map_id: venueData.seatMapId
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
          console.error(`Failed to update venue ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulUpdates.length > 0) {
          const venue = successfulUpdates[0].data;
          return {
            Id: venue.Id,
            name: venue.Name,
            tenantId: venue.tenant_id,
            address: {
              street: venue.address_street,
              city: venue.address_city,
              state: venue.address_state,
              zipCode: venue.address_zip_code,
              country: venue.address_country
            },
            capacity: venue.capacity,
            seatMapId: venue.seat_map_id,
            description: venue.description,
            amenities: venue.amenities ? venue.amenities.split(',') : [],
            createdAt: venue.created_at
          };
        }
      }
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating venue:", error?.response?.data?.message);
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
          console.error(`Failed to delete venue ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successfulDeletions.length > 0;
      }
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting venue:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }
}

export default new VenueService();