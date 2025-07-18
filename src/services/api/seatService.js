import { toast } from 'react-toastify';

class SeatService {
  constructor() {
    this.apperClient = null;
    this.tableName = 'seat';
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
          { field: { Name: "zone_id" } },
          { field: { Name: "map_id" } },
          { field: { Name: "row" } },
          { field: { Name: "number" } },
          { field: { Name: "x" } },
          { field: { Name: "y" } },
          { field: { Name: "type" } },
          { field: { Name: "status" } }
        ],
        orderBy: [
          { fieldName: "row", sorttype: "ASC" },
          { fieldName: "number", sorttype: "ASC" }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data?.map(seat => ({
        Id: seat.Id,
        id: seat.Id,
        name: seat.Name,
        zoneId: seat.zone_id,
        mapId: seat.map_id,
        row: seat.row,
        number: seat.number,
        x: seat.x,
        y: seat.y,
        type: seat.type,
        status: seat.status
      })) || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching seats:", error?.response?.data?.message);
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
          { field: { Name: "zone_id" } },
          { field: { Name: "map_id" } },
          { field: { Name: "row" } },
          { field: { Name: "number" } },
          { field: { Name: "x" } },
          { field: { Name: "y" } },
          { field: { Name: "type" } },
          { field: { Name: "status" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);

      if (!response || !response.data) {
        return null;
      }

      const seat = response.data;
      return {
        Id: seat.Id,
        id: seat.Id,
        name: seat.Name,
        zoneId: seat.zone_id,
        mapId: seat.map_id,
        row: seat.row,
        number: seat.number,
        x: seat.x,
        y: seat.y,
        type: seat.type,
        status: seat.status
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching seat with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async getByMapId(mapId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "zone_id" } },
          { field: { Name: "map_id" } },
          { field: { Name: "row" } },
          { field: { Name: "number" } },
          { field: { Name: "x" } },
          { field: { Name: "y" } },
          { field: { Name: "type" } },
          { field: { Name: "status" } }
        ],
        where: [
          {
            fieldName: "map_id",
            Operator: "EqualTo",
            Values: [mapId]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data?.map(seat => ({
        Id: seat.Id,
        id: seat.Id,
        name: seat.Name,
        zoneId: seat.zone_id,
        mapId: seat.map_id,
        row: seat.row,
        number: seat.number,
        x: seat.x,
        y: seat.y,
        type: seat.type,
        status: seat.status
      })) || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching seats for map ${mapId}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async getByZoneId(zoneId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "zone_id" } },
          { field: { Name: "map_id" } },
          { field: { Name: "row" } },
          { field: { Name: "number" } },
          { field: { Name: "x" } },
          { field: { Name: "y" } },
          { field: { Name: "type" } },
          { field: { Name: "status" } }
        ],
        where: [
          {
            fieldName: "zone_id",
            Operator: "EqualTo",
            Values: [zoneId]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data?.map(seat => ({
        Id: seat.Id,
        id: seat.Id,
        name: seat.Name,
        zoneId: seat.zone_id,
        mapId: seat.map_id,
        row: seat.row,
        number: seat.number,
        x: seat.x,
        y: seat.y,
        type: seat.type,
        status: seat.status
      })) || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching seats for zone ${zoneId}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async create(seatData) {
    try {
      const params = {
        records: [
          {
            Name: seatData.name || `${seatData.row}-${seatData.number}`,
            Tags: seatData.tags || "",
            zone_id: seatData.zoneId,
            map_id: seatData.mapId,
            row: seatData.row,
            number: seatData.number,
            x: seatData.x,
            y: seatData.y,
            type: seatData.type,
            status: seatData.status
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
          console.error(`Failed to create seat ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulRecords.length > 0) {
          const seat = successfulRecords[0].data;
          return {
            Id: seat.Id,
            id: seat.Id,
            name: seat.Name,
            zoneId: seat.zone_id,
            mapId: seat.map_id,
            row: seat.row,
            number: seat.number,
            x: seat.x,
            y: seat.y,
            type: seat.type,
            status: seat.status
          };
        }
      }
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating seat:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async createBulk(seatsData) {
    try {
      const params = {
        records: seatsData.map(seatData => ({
          Name: seatData.name || `${seatData.row}-${seatData.number}`,
          Tags: seatData.tags || "",
          zone_id: seatData.zoneId,
          map_id: seatData.mapId,
          row: seatData.row,
          number: seatData.number,
          x: seatData.x,
          y: seatData.y,
          type: seatData.type,
          status: seatData.status
        }))
      };

      const response = await this.apperClient.createRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create seats ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        return successfulRecords.map(result => {
          const seat = result.data;
          return {
            Id: seat.Id,
            id: seat.Id,
            name: seat.Name,
            zoneId: seat.zone_id,
            mapId: seat.map_id,
            row: seat.row,
            number: seat.number,
            x: seat.x,
            y: seat.y,
            type: seat.type,
            status: seat.status
          };
        });
      }
      return [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating seats:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async update(id, seatData) {
    try {
      const params = {
        records: [
          {
            Id: id,
            Name: seatData.name || `${seatData.row}-${seatData.number}`,
            Tags: seatData.tags || "",
            zone_id: seatData.zoneId,
            map_id: seatData.mapId,
            row: seatData.row,
            number: seatData.number,
            x: seatData.x,
            y: seatData.y,
            type: seatData.type,
            status: seatData.status
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
          console.error(`Failed to update seat ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulUpdates.length > 0) {
          const seat = successfulUpdates[0].data;
          return {
            Id: seat.Id,
            id: seat.Id,
            name: seat.Name,
            zoneId: seat.zone_id,
            mapId: seat.map_id,
            row: seat.row,
            number: seat.number,
            x: seat.x,
            y: seat.y,
            type: seat.type,
            status: seat.status
          };
        }
      }
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating seat:", error?.response?.data?.message);
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
          console.error(`Failed to delete seat ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successfulDeletions.length > 0;
      }
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting seat:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }

  async deleteByMapId(mapId) {
    try {
      const seats = await this.getByMapId(mapId);
      const seatIds = seats.map(seat => seat.Id);
      
      if (seatIds.length === 0) {
        return true;
      }

      const params = {
        RecordIds: seatIds
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        return false;
      }

      return true;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting seats by map ID:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }

  async deleteByZoneId(zoneId) {
    try {
      const seats = await this.getByZoneId(zoneId);
      const seatIds = seats.map(seat => seat.Id);
      
      if (seatIds.length === 0) {
        return true;
      }

      const params = {
        RecordIds: seatIds
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        return false;
      }

      return true;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting seats by zone ID:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }
}

export default new SeatService();