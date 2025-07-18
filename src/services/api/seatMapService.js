import { toast } from "react-toastify";
import React from "react";

class SeatMapService {
  constructor() {
    this.apperClient = null;
    this.tableName = 'seat_map';
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
          { field: { Name: "is_template" } },
          { field: { Name: "venue_id" } },
          { field: { Name: "dimensions" } },
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

// Transform data to match expected format and get zone/seat counts
      const seatMaps = await Promise.all(
        (response.data || []).map(async (seatMap) => {
          const [zones, seats] = await Promise.all([
            this.getZonesByMapId(seatMap.Id),
            this.getSeatsByMapId(seatMap.Id)
          ]);

          return {
            Id: seatMap.Id,
            name: seatMap.Name,
            venueId: seatMap.venue_id,
            isTemplate: seatMap.is_template,
            dimensions: seatMap.dimensions,
            createdAt: seatMap.created_at,
            totalZones: zones.length,
            totalSeats: seats.length
          };
        })
      );

      return seatMaps;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching seat maps:", error?.response?.data?.message);
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
          { field: { Name: "is_template" } },
          { field: { Name: "venue_id" } },
          { field: { Name: "dimensions" } },
          { field: { Name: "created_at" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);

      if (!response || !response.data) {
        return null;
      }

// Transform data to match expected format and get zone/seat data
      const seatMap = response.data;
      const [zones, seats] = await Promise.all([
        this.getZonesByMapId(seatMap.Id),
        this.getSeatsByMapId(seatMap.Id)
      ]);

      return {
        Id: seatMap.Id,
        name: seatMap.Name,
        venueId: seatMap.venue_id,
        isTemplate: seatMap.is_template,
        dimensions: seatMap.dimensions,
        createdAt: seatMap.created_at,
        zones: zones,
        seats: seats
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching seat map with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async getByVenueId(venueId) {
    try {
const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "is_template" } },
          { field: { Name: "venue_id" } },
          { field: { Name: "dimensions" } },
          { field: { Name: "created_at" } }
        ],
        where: [
          {
            fieldName: "venue_id",
            Operator: "EqualTo",
            Values: [venueId]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

return response.data?.map(seatMap => ({
        Id: seatMap.Id,
        name: seatMap.Name,
        venueId: seatMap.venue_id,
        isTemplate: seatMap.is_template,
        dimensions: seatMap.dimensions,
        createdAt: seatMap.created_at
      })) || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching seat maps for venue ${venueId}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async create(seatMapData) {
    try {
const params = {
        records: [
          {
            Name: seatMapData.name,
            Tags: seatMapData.tags || "",
            is_template: seatMapData.isTemplate || false,
            venue_id: seatMapData.venueId || null,
            dimensions: seatMapData.dimensions || "800x600",
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
          console.error(`Failed to create seat map ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

if (successfulRecords.length > 0) {
          const seatMap = successfulRecords[0].data;
          return {
            Id: seatMap.Id,
            name: seatMap.Name,
            venueId: seatMap.venue_id,
            isTemplate: seatMap.is_template,
            dimensions: seatMap.dimensions,
            createdAt: seatMap.created_at
          };
        }
      }
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating seat map:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async update(id, seatMapData) {
    try {
const params = {
        records: [
          {
            Id: id,
            Name: seatMapData.name,
            Tags: seatMapData.tags || "",
            is_template: seatMapData.isTemplate,
            venue_id: seatMapData.venueId,
            dimensions: seatMapData.dimensions || "800x600"
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
          console.error(`Failed to update seat map ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

if (successfulUpdates.length > 0) {
          const seatMap = successfulUpdates[0].data;
          return {
            Id: seatMap.Id,
            name: seatMap.Name,
            venueId: seatMap.venue_id,
            isTemplate: seatMap.is_template,
            dimensions: seatMap.dimensions,
            createdAt: seatMap.created_at
          };
        }
      }
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating seat map:", error?.response?.data?.message);
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
          console.error(`Failed to delete seat map ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successfulDeletions.length > 0;
      }
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting seat map:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }

  async createTemplate(templateData) {
    return await this.create({
      ...templateData,
      isTemplate: true,
      venueId: null
    });
  }

async getTemplates() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "is_template" } },
          { field: { Name: "dimensions" } },
          { field: { Name: "created_at" } }
        ],
        where: [
          {
            fieldName: "is_template",
            Operator: "EqualTo",
            Values: [true]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data?.map(seatMap => ({
        Id: seatMap.Id,
        name: seatMap.Name,
        venueId: null,
        isTemplate: true,
        dimensions: seatMap.dimensions,
        createdAt: seatMap.created_at
      })) || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching seat map templates:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
}
  }

  async getZonesByMapId(mapId) {
    try {
      const zoneService = (await import("@/services/api/zoneService")).default;
      return await zoneService.getByMapId(mapId);
    } catch (error) {
      console.error("Error fetching zones for map:", error);
      return [];
    }
  }

  async getSeatsByMapId(mapId) {
    try {
      const seatService = (await import("@/services/api/seatService")).default;
      return await seatService.getByMapId(mapId);
    } catch (error) {
      console.error("Error fetching seats for map:", error);
      return [];
    }
  }
}

export default new SeatMapService();