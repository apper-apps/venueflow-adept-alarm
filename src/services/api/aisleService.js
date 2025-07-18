import { toast } from 'react-toastify';

let apperClient = null;

const initializeClient = () => {
  if (!apperClient) {
    const { ApperClient } = window.ApperSDK;
    apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }
  return apperClient;
};

const aisleService = {
  async getAll() {
    try {
      const client = initializeClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "map_id" } },
          { field: { Name: "x" } },
          { field: { Name: "y" } },
          { field: { Name: "width" } },
          { field: { Name: "length" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } }
        ]
      };
      
      const response = await client.fetchRecords('aisle', params);
      
      if (!response.success) {
        console.error('Error fetching aisles:', response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error('Error fetching aisles:', error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error('Error fetching aisles:', error.message);
        toast.error('Failed to fetch aisles');
      }
      return [];
    }
  },

  async getById(id) {
    try {
      const client = initializeClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "map_id" } },
          { field: { Name: "x" } },
          { field: { Name: "y" } },
          { field: { Name: "width" } },
          { field: { Name: "length" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } }
        ]
      };
      
      const response = await client.getRecordById('aisle', id, params);
      
      if (!response.success) {
        console.error('Error fetching aisle:', response.message);
        toast.error(response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error('Error fetching aisle:', error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error('Error fetching aisle:', error.message);
        toast.error('Failed to fetch aisle');
      }
      return null;
    }
  },

  async getByMapId(mapId) {
    try {
      const client = initializeClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "map_id" } },
          { field: { Name: "x" } },
          { field: { Name: "y" } },
          { field: { Name: "width" } },
          { field: { Name: "length" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } }
        ],
        where: [
          {
            FieldName: "map_id",
            Operator: "EqualTo",
            Values: [mapId]
          }
        ]
      };
      
      const response = await client.fetchRecords('aisle', params);
      
      if (!response.success) {
        console.error('Error fetching aisles by map:', response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error('Error fetching aisles by map:', error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error('Error fetching aisles by map:', error.message);
        toast.error('Failed to fetch aisles');
      }
      return [];
    }
  },

  async create(aisleData) {
    try {
      const client = initializeClient();
      const params = {
        records: [
          {
            Name: aisleData.Name,
            Tags: aisleData.Tags || "",
            Owner: aisleData.Owner || null,
            map_id: aisleData.map_id,
            x: aisleData.x,
            y: aisleData.y,
            width: aisleData.width || 20,
            length: aisleData.length || 100
          }
        ]
      };
      
      const response = await client.createRecord('aisle', params);
      
      if (!response.success) {
        console.error('Error creating aisle:', response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create aisle ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          toast.success('Aisle created successfully');
          return successfulRecords[0].data;
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error('Error creating aisle:', error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error('Error creating aisle:', error.message);
        toast.error('Failed to create aisle');
      }
      return null;
    }
  },

  async update(id, aisleData) {
    try {
      const client = initializeClient();
      const params = {
        records: [
          {
            Id: id,
            Name: aisleData.Name,
            Tags: aisleData.Tags || "",
            Owner: aisleData.Owner || null,
            map_id: aisleData.map_id,
            x: aisleData.x,
            y: aisleData.y,
            width: aisleData.width || 20,
            length: aisleData.length || 100
          }
        ]
      };
      
      const response = await client.updateRecord('aisle', params);
      
      if (!response.success) {
        console.error('Error updating aisle:', response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update aisle ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          toast.success('Aisle updated successfully');
          return successfulUpdates[0].data;
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error('Error updating aisle:', error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error('Error updating aisle:', error.message);
        toast.error('Failed to update aisle');
      }
      return null;
    }
  },

  async delete(id) {
    try {
      const client = initializeClient();
      const params = {
        RecordIds: [id]
      };
      
      const response = await client.deleteRecord('aisle', params);
      
      if (!response.success) {
        console.error('Error deleting aisle:', response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete aisle ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulDeletions.length > 0) {
          toast.success('Aisle deleted successfully');
          return true;
        }
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error('Error deleting aisle:', error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error('Error deleting aisle:', error.message);
        toast.error('Failed to delete aisle');
      }
      return false;
    }
  },

  async deleteByMapId(mapId) {
    try {
      const aisles = await this.getByMapId(mapId);
      const deletePromises = aisles.map(aisle => this.delete(aisle.Id));
      await Promise.all(deletePromises);
      return true;
    } catch (error) {
      console.error('Error deleting aisles by map:', error.message);
      return false;
    }
  }
};

export default aisleService;