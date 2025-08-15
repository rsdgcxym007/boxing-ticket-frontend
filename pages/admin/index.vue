<template>
  <div class="admin-dashboard">
    <h1>Admin Dashboard</h1>
    <div class="dashboard-grid">
      <NuxtLink to="/admin/dashboard" class="dashboard-card">
        <Icon icon="mdi:view-dashboard" />
        <span>Dashboard</span>
      </NuxtLink>

      <NuxtLink to="/admin/orders" class="dashboard-card">
        <Icon icon="mdi:ticket" />
        <span>Orders</span>
      </NuxtLink>

      <NuxtLink to="/admin/staff" class="dashboard-card">
        <Icon icon="mdi:account-group" />
        <span>Staff</span>
      </NuxtLink>

      <NuxtLink to="/admin/analytics" class="dashboard-card">
        <Icon icon="mdi:chart-line" />
        <span>Analytics</span>
      </NuxtLink>

      <NuxtLink to="/admin/settings" class="dashboard-card">
        <Icon icon="mdi:cog" />
        <span>Settings</span>
      </NuxtLink>

      <NuxtLink to="/admin/audit" class="dashboard-card">
        <Icon icon="mdi:security" />
        <span>Audit</span>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.admin-dashboard {
  padding: 2rem;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
}

.dashboard-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-decoration: none;
  color: #333;
  transition: transform 0.2s;
}

.dashboard-card:hover {
  transform: translateY(-2px);
}

.dashboard-card svg {
  width: 3rem;
  height: 3rem;
  color: #e10600;
}
</style>
