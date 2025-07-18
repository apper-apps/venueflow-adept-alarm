import tenantsData from "@/services/mockData/tenants.json";

class TenantService {
  constructor() {
    this.tenants = [...tenantsData];
  }

  async getAll() {
    await this.delay();
    return [...this.tenants];
  }

  async getById(id) {
    await this.delay();
    return this.tenants.find(tenant => tenant.Id === id) || null;
  }

  async create(tenantData) {
    await this.delay();
    const newTenant = {
      Id: Math.max(...this.tenants.map(t => t.Id), 0) + 1,
      ...tenantData,
      createdAt: new Date().toISOString()
    };
    this.tenants.push(newTenant);
    return { ...newTenant };
  }

  async update(id, tenantData) {
    await this.delay();
    const index = this.tenants.findIndex(tenant => tenant.Id === id);
    if (index !== -1) {
      this.tenants[index] = { ...this.tenants[index], ...tenantData };
      return { ...this.tenants[index] };
    }
    return null;
  }

  async delete(id) {
    await this.delay();
    const index = this.tenants.findIndex(tenant => tenant.Id === id);
    if (index !== -1) {
      this.tenants.splice(index, 1);
      return true;
    }
    return false;
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, 300));
  }
}

export default new TenantService();