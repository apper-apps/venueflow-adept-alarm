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

const entryExitService = {
  async getAll() {
    try {
      const client = initializeClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "venue_id" } },
          { field: { Name: "x" } },
          { field: { Name: "y" } },
          { field: { Name: "capacity" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } }
        ]
      };
      
      const response = await client.fetchRecords('entry_exit', params);
      
      if (!response.success) {
        console.error('Error fetching entry exits:', response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error('Error fetching entry exits:', error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error('Error fetching entry exits:', error.message);
        toast.error('Failed to fetch entry exits');
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
          { field: { Name: "venue_id" } },
          { field: { Name: "x" } },
          { field: { Name: "y" } },
          { field: { Name: "capacity" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } }
        ]
      };
      
      const response = await client.getRecordById('entry_exit', id, params);
      
      if (!response.success) {
        console.error('Error fetching entry exit:', response.message);
        toast.error(response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error('Error fetching entry exit:', error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error('Error fetching entry exit:', error.message);
        toast.error('Failed to fetch entry exit');
      }
      return null;
    }
  },

  async getByVenueId(venueId) {
    try {
      const client = initializeClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "venue_id" } },
          { field: { Name: "x" } },
          { field: { Name: "y" } },
          { field: { Name: "capacity" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } }
        ],
        where: [
          {
            FieldName: "venue_id",
            Operator: "EqualTo",
            Values: [venueId]
          }
        ]
      };
      
      const response = await client.fetchRecords('entry_exit', params);
      
      if (!response.success) {
        console.error('Error fetching entry exits by venue:', response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error('Error fetching entry exits by venue:', error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error('Error fetching entry exits by venue:', error.message);
        toast.error('Failed to fetch entry exits');
      }
      return [];
    }
  },

  async create(entryExitData) {
    try {
      const client = initializeClient();
      const params = {
        records: [
          {
            Name: entryExitData.Name,
            Tags: entryExitData.Tags || "",
            Owner: entryExitData.Owner || null,
            venue_id: entryExitData.venue_id,
            x: entryExitData.x,
            y: entryExitData.y,
            capacity: entryExitData.capacity || 100
          }
        ]
      };
      
      const response = await client.createRecord('entry_exit', params);
      
      if (!response.success) {
        console.error('Error creating entry exit:', response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create entry exit ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          toast.success('Entry exit created successfully');
          return successfulRecords[0].data;
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error('Error creating entry exit:', error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error('Error creating entry exit:', error.message);
        toast.error('Failed to create entry exit');
      }
      return null;
    }
  },

  async update(id, entryExitData) {
    try {
      const client = initializeClient();
      const params = {
        records: [
          {
            Id: id,
            Name: entryExitData.Name,
            Tags: entryExitData.Tags || "",
            Owner: entryExitData.Owner || null,
            venue_id: entryExitData.venue_id,
            x: entryExitData.x,
            y: entryExitData.y,
            capacity: entryExitData.capacity || 100
          }
        ]
      };
      
      const response = await client.updateRecord('entry_exit', params);
      
      if (!response.success) {
        console.error('Error updating entry exit:', response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update entry exit ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          toast.success('Entry exit updated successfully');
          return successfulUpdates[0].data;
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error('Error updating entry exit:', error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error('Error updating entry exit:', error.message);
        toast.error('Failed to update entry exit');
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
      
      const response = await client.deleteRecord('entry_exit', params);
      
      if (!response.success) {
        console.error('Error deleting entry exit:', response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete entry exit ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulDeletions.length > 0) {
          toast.success('Entry exit deleted successfully');
          return true;
        }
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error('Error deleting entry exit:', error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error('Error deleting entry exit:', error.message);
        toast.error('Failed to delete entry exit');
      }
      return false;
    }
  },

  async deleteByVenueId(venueId) {
    try {
      const entryExits = await this.getByVenueId(venueId);
      const deletePromises = entryExits.map(entryExit => this.delete(entryExit.Id));
      await Promise.all(deletePromises);
      return true;
    } catch (error) {
      console.error('Error deleting entry exits by venue:', error.message);
      return false;
    }
  }
};

export default entryExitService;