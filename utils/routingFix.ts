import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Clear routing cache และแก้ปัญหา persistent redirects
export const clearRoutingCache = () => {
  if (process.client) {
    console.log("🧹 Clearing routing cache...")
    
    // Clear session storage
    sessionStorage.clear()
    
    // Clear any cached redirects
    if (typeof window.history !== 'undefined') {
      // Replace current history state
      window.history.replaceState(null, '', window.location.pathname)
    }
    
    // Clear any vue-router cache
    const router = useRouter()
    if (router && typeof router.replace === 'function') {
      // Force replace current route to prevent cache
      router.replace(window.location.pathname)
    }
    
    console.log("✅ Routing cache cleared")
  }
}

// แก้ปัญหา admin redirect loop
export const fixAdminRedirect = () => {
  if (process.client && window.location.pathname.includes('/admin')) {
    console.log("🔄 Fixing admin redirect issue...")
    
    const authStore = useAuthStore()
    
    // ถ้าไม่ได้ login ให้ไป login
    if (!authStore.isAuthenticated) {
      console.log("❌ Not authenticated, redirecting to login")
      window.location.href = '/login'
      return
    }
    
    // ถ้า login แล้วแต่ไม่ใช่ admin/staff ให้ไปหน้าแรก  
    if (!['admin', 'staff'].includes(authStore.user?.role)) {
      console.log("❌ Insufficient role, redirecting to home")
      window.location.href = '/'
      return
    }
    
    console.log("✅ Admin access validated")
  }
}
