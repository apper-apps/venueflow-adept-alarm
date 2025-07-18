import { toast } from 'react-toastify';

class TenantService {
  constructor() {
    this.apperClient = null;
    this.tableName = 'tenant';
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
          { field: { Name: "subdomain" } },
          { field: { Name: "logo" } },
          { field: { Name: "settings_currency" } },
          { field: { Name: "settings_timezone" } },
          { field: { Name: "settings_features" } },
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
      return response.data?.map(tenant => ({
        Id: tenant.Id,
        name: tenant.Name,
        subdomain: tenant.subdomain,
        logo: tenant.logo,
        settings: {
          currency: tenant.settings_currency,
          timezone: tenant.settings_timezone,
          features: tenant.settings_features ? tenant.settings_features.split(',') : []
        },
        createdAt: tenant.created_at
      })) || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching tenants:", error?.response?.data?.message);
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
          { field: { Name: "subdomain" } },
          { field: { Name: "logo" } },
          { field: { Name: "settings_currency" } },
          { field: { Name: "settings_timezone" } },
          { field: { Name: "settings_features" } },
          { field: { Name: "created_at" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);

      if (!response || !response.data) {
        return null;
      }

      // Transform data to match expected format
      const tenant = response.data;
      return {
        Id: tenant.Id,
        name: tenant.Name,
        subdomain: tenant.subdomain,
        logo: tenant.logo,
        settings: {
          currency: tenant.settings_currency,
          timezone: tenant.settings_timezone,
          features: tenant.settings_features ? tenant.settings_features.split(',') : []
        },
        createdAt: tenant.created_at
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching tenant with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async create(tenantData) {
    try {
      const params = {
        records: [
          {
            Name: tenantData.name,
            Tags: tenantData.tags || "",
            subdomain: tenantData.subdomain,
            logo: tenantData.logo || "",
            settings_currency: tenantData.settings?.currency || "USD",
            settings_timezone: tenantData.settings?.timezone || "America/New_York",
            settings_features: Array.isArray(tenantData.settings?.features) ? tenantData.settings.features.join(',') : "",
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
          console.error(`Failed to create tenant ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulRecords.length > 0) {
          const tenant = successfulRecords[0].data;
          return {
            Id: tenant.Id,
            name: tenant.Name,
            subdomain: tenant.subdomain,
            logo: tenant.logo,
            settings: {
              currency: tenant.settings_currency,
              timezone: tenant.settings_timezone,
              features: tenant.settings_features ? tenant.settings_features.split(',') : []
            },
            createdAt: tenant.created_at
          };
        }
      }
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating tenant:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async update(id, tenantData) {
    try {
      const params = {
        records: [
          {
            Id: id,
            Name: tenantData.name,
            Tags: tenantData.tags || "",
            subdomain: tenantData.subdomain,
            logo: tenantData.logo || "",
            settings_currency: tenantData.settings?.currency,
            settings_timezone: tenantData.settings?.timezone,
            settings_features: Array.isArray(tenantData.settings?.features) ? tenantData.settings.features.join(',') : ""
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
          console.error(`Failed to update tenant ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulUpdates.length > 0) {
          const tenant = successfulUpdates[0].data;
          return {
            Id: tenant.Id,
            name: tenant.Name,
            subdomain: tenant.subdomain,
            logo: tenant.logo,
            settings: {
              currency: tenant.settings_currency,
              timezone: tenant.settings_timezone,
              features: tenant.settings_features ? tenant.settings_features.split(',') : []
            },
            createdAt: tenant.created_at
          };
        }
      }
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating tenant:", error?.response?.data?.message);
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
          console.error(`Failed to delete tenant ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successfulDeletions.length > 0;
      }
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting tenant:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }
}

export default new TenantService();