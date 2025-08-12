<template>
  <div class="mobile-layout">
    <!-- Main Content -->
    <main class="mobile-content">
      <slot />
    </main>

    <!-- Bottom Navigation -->
    <nav class="mobile-nav">
      <div class="nav-items">
        <nuxt-link
          to="/mobile"
          class="nav-item"
          :class="{ 'nav-active': $route.path === '/mobile' }"
        >
          <Icon name="heroicons:home" class="nav-icon" />
          <span class="nav-label">หน้าหลัก</span>
        </nuxt-link>

        <nuxt-link
          to="/mobile/events"
          class="nav-item"
          :class="{ 'nav-active': $route.path.includes('/mobile/events') }"
        >
          <Icon name="heroicons:calendar-days" class="nav-icon" />
          <span class="nav-label">กิจกรรม</span>
        </nuxt-link>

        <nuxt-link
          to="/mobile/book"
          class="nav-item nav-primary"
          :class="{ 'nav-active': $route.path.includes('/mobile/book') }"
        >
          <Icon name="heroicons:ticket" class="nav-icon" />
          <span class="nav-label">จองตั๋ว</span>
        </nuxt-link>

        <nuxt-link
          to="/mobile/bookings"
          class="nav-item"
          :class="{ 'nav-active': $route.path.includes('/mobile/bookings') }"
        >
          <Icon name="heroicons:clipboard-document-list" class="nav-icon" />
          <span class="nav-label">การจอง</span>
        </nuxt-link>

        <nuxt-link
          to="/mobile/profile"
          class="nav-item"
          :class="{ 'nav-active': $route.path.includes('/mobile/profile') }"
        >
          <Icon name="heroicons:user" class="nav-icon" />
          <span class="nav-label">โปรไฟล์</span>
        </nuxt-link>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
// Mobile layout doesn't need special logic for now
</script>

<style scoped>
.mobile-layout {
  min-height: 100vh;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
}

.mobile-content {
  flex: 1;
  padding-bottom: 6rem; /* Space for bottom nav */
}

.mobile-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid #e5e7eb;
  padding: 0.5rem 0;
  z-index: 50;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

.nav-items {
  display: flex;
  justify-content: space-around;
  align-items: center;
  max-width: 500px;
  margin: 0 auto;
  padding: 0 1rem;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.2s;
  text-decoration: none;
  color: #6b7280;
  min-width: 60px;
}

.nav-item:hover {
  background: #f3f4f6;
  color: #374151;
}

.nav-active {
  color: #3b82f6 !important;
  background: #eff6ff;
}

.nav-primary {
  background: #3b82f6;
  color: white;
  transform: scale(1.1);
  border-radius: 1rem;
}

.nav-primary:hover {
  background: #2563eb;
  color: white;
}

.nav-primary.nav-active {
  background: #1d4ed8;
  color: white;
}

.nav-icon {
  width: 1.5rem;
  height: 1.5rem;
  margin-bottom: 0.25rem;
}

.nav-label {
  font-size: 0.75rem;
  font-weight: 500;
  text-align: center;
  line-height: 1;
}

/* Safe area for devices with notches */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .mobile-nav {
    padding-bottom: calc(0.5rem + env(safe-area-inset-bottom));
  }

  .mobile-content {
    padding-bottom: calc(6rem + env(safe-area-inset-bottom));
  }
}

/* Responsive adjustments */
@media (max-width: 375px) {
  .nav-label {
    font-size: 0.6rem;
  }

  .nav-icon {
    width: 1.25rem;
    height: 1.25rem;
  }
}
</style>
