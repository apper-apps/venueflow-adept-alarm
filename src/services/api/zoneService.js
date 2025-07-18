import { toast } from 'react-toastify';

class ZoneService {
  constructor() {
    this.apperClient = null;
    this.tableName = 'zone';
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
          { field: { Name: "map_id" } },
          { field: { Name: "price" } },
          { field: { Name: "color" } }
        ],
        orderBy: [
          { fieldName: "Name", sorttype: "ASC" }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data?.map(zone => ({
        Id: zone.Id,
        id: zone.Id,
        name: zone.Name,
        mapId: zone.map_id,
        price: zone.price,
        color: zone.color
      })) || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching zones:", error?.response?.data?.message);
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
          { field: { Name: "map_id" } },
          { field: { Name: "price" } },
          { field: { Name: "color" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);

      if (!response || !response.data) {
        return null;
      }

      const zone = response.data;
      return {
        Id: zone.Id,
        id: zone.Id,
        name: zone.Name,
        mapId: zone.map_id,
        price: zone.price,
        color: zone.color
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching zone with ID ${id}:`, error?.response?.data?.message);
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
          { field: { Name: "map_id" } },
          { field: { Name: "price" } },
          { field: { Name: "color" } }
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

      return response.data?.map(zone => ({
        Id: zone.Id,
        id: zone.Id,
        name: zone.Name,
        mapId: zone.map_id,
        price: zone.price,
        color: zone.color
      })) || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching zones for map ${mapId}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async create(zoneData) {
    try {
      const params = {
        records: [
          {
            Name: zoneData.name,
            Tags: zoneData.tags || "",
            map_id: zoneData.mapId,
            price: zoneData.price,
            color: zoneData.color
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
          console.error(`Failed to create zone ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulRecords.length > 0) {
          const zone = successfulRecords[0].data;
          return {
            Id: zone.Id,
            id: zone.Id,
            name: zone.Name,
            mapId: zone.map_id,
            price: zone.price,
            color: zone.color
          };
        }
      }
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating zone:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async update(id, zoneData) {
    try {
      const params = {
        records: [
          {
            Id: id,
            Name: zoneData.name,
            Tags: zoneData.tags || "",
            map_id: zoneData.mapId,
            price: zoneData.price,
            color: zoneData.color
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
          console.error(`Failed to update zone ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulUpdates.length > 0) {
          const zone = successfulUpdates[0].data;
          return {
            Id: zone.Id,
            id: zone.Id,
            name: zone.Name,
            mapId: zone.map_id,
            price: zone.price,
            color: zone.color
          };
        }
      }
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating zone:", error?.response?.data?.message);
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
          console.error(`Failed to delete zone ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successfulDeletions.length > 0;
      }
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting zone:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }

  async deleteByMapId(mapId) {
    try {
      const zones = await this.getByMapId(mapId);
      const zoneIds = zones.map(zone => zone.Id);
      
      if (zoneIds.length === 0) {
        return true;
      }

      const params = {
        RecordIds: zoneIds
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        return false;
      }

      return true;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting zones by map ID:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }
}

export default new ZoneService();