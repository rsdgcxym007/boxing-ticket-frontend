<template>
  <div class="debug-routing-page">
    <div class="debug-container">
      <h1>🔧 Routing Debug Center</h1>
      
      <!-- Current State -->
      <div class="debug-section">
        <h2>📊 Current State</h2>
        <div class="state-display">
          <div class="state-item">
            <strong>Current URL:</strong> {{ currentUrl }}
          </div>
          <div class="state-item">
            <strong>Path:</strong> {{ currentPath }}
          </div>
          <div class="state-item">
            <strong>Protocol:</strong> {{ currentProtocol }}
          </div>
          <div class="state-item">
            <strong>Auth Status:</strong> 
            <span :class="authStatus.authenticated ? 'status-success' : 'status-error'">
              {{ authStatus.authenticated ? 'Authenticated' : 'Not Authenticated' }}
            </span>
          </div>
          <div class="state-item">
            <strong>User Role:</strong> {{ authStatus.role || 'None' }}
          </div>
        </div>
      </div>

      <!-- Session/Local Storage -->
      <div class="debug-section">
        <h2>💾 Storage Contents</h2>
        <div class="storage-tabs">
          <button 
            @click="activeStorageTab = 'local'" 
            :class="['tab-btn', { active: activeStorageTab === 'local' }]"
          >
            Local Storage
          </button>
          <button 
            @click="activeStorageTab = 'session'" 
            :class="['tab-btn', { active: activeStorageTab === 'session' }]"
          >
            Session Storage
          </button>
        </div>
        
        <div class="storage-content">
          <div v-if="activeStorageTab === 'local'" class="storage-items">
            <div v-for="item in localStorageItems" :key="item.key" class="storage-item">
              <strong>{{ item.key }}:</strong> 
              <span class="storage-value">{{ item.value }}</span>
            </div>
          </div>
          
          <div v-if="activeStorageTab === 'session'" class="storage-items">
            <div v-for="item in sessionStorageItems" :key="item.key" class="storage-item">
              <strong>{{ item.key }}:</strong> 
              <span class="storage-value">{{ item.value }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="debug-section">
        <h2>🛠️ Debug Actions</h2>
        <div class="action-grid">
          <button @click="clearAllStorage" class="btn btn-danger">
            🧹 Clear All Storage
          </button>
          <button @click="clearRoutingCache" class="btn btn-warning">
            🔄 Clear Routing Cache
          </button>
          <button @click="fixAdminRedirect" class="btn btn-info">
            🔧 Fix Admin Redirect
          </button>
          <button @click="refreshPage" class="btn btn-secondary">
            ↻ Refresh Page
          </button>
          <button @click="testCameraAccess" class="btn btn-success">
            📸 Test Camera Access
          </button>
          <button @click="testHttpsStatus" class="btn btn-primary">
            🔒 Test HTTPS Status
          </button>
        </div>
      </div>

      <!-- Navigation Test -->
      <div class="debug-section">
        <h2>🧭 Navigation Test</h2>
        <div class="nav-grid">
          <button @click="navigateTo('/')" class="btn nav-btn">
            🏠 Home
          </button>
          <button @click="navigateTo('/login')" class="btn nav-btn">
            🔐 Desktop Login
          </button>
          <button @click="navigateTo('/mobile/login')" class="btn nav-btn">
            📱 Mobile Login
          </button>
          <button @click="navigateTo('/mobile')" class="btn nav-btn">
            📱 Mobile Dashboard
          </button>
          <button @click="navigateTo('/mobile/scanner')" class="btn nav-btn">
            🔍 QR Scanner
          </button>
          <button @click="navigateTo('/admin')" class="btn nav-btn">
            👨‍💼 Admin Panel
          </button>
        </div>
      </div>

      <!-- Test Results -->
      <div class="debug-section">
        <h2>🧪 Test Results</h2>
        <div class="test-results">
          <div v-for="(result, index) in testResults" :key="index" 
               :class="['test-result', `result-${result.type}`]">
            <span class="test-time">{{ result.time }}</span>
            <span class="test-message">{{ result.message }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Composables
const router = useRouter()
const authStore = useAuthStore()

// Reactive state
const activeStorageTab = ref('local')
const localStorageItems = ref([])
const sessionStorageItems = ref([])
const testResults = ref([])

// Computed properties
const currentUrl = computed(() => {
  return process.client ? window.location.href : 'Server-side'
})

const currentPath = computed(() => {
  return process.client ? window.location.pathname : 'Server-side'
})

const currentProtocol = computed(() => {
  return process.client ? window.location.protocol : 'Server-side'
})

const authStatus = computed(() => {
  return {
    authenticated: authStore.isAuthenticated,
    role: authStore.user?.role || null
  }
})

// Methods
const addTestResult = (type, message) => {
  testResults.value.unshift({
    type,
    message,
    time: new Date().toLocaleTimeString()
  })
  
  // Keep only last 10 results
  if (testResults.value.length > 10) {
    testResults.value = testResults.value.slice(0, 10)
  }
}

const updateStorageItems = () => {
  if (!process.client) return
  
  // Local Storage
  localStorageItems.value = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    localStorageItems.value.push({
      key,
      value: localStorage.getItem(key)
    })
  }
  
  // Session Storage
  sessionStorageItems.value = []
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i)
    sessionStorageItems.value.push({
      key,
      value: sessionStorage.getItem(key)
    })
  }
}

const clearAllStorage = () => {
  if (!process.client) return
  
  localStorage.clear()
  sessionStorage.clear()
  authStore.logout()
  
  updateStorageItems()
  addTestResult('success', 'All storage cleared')
}

const clearRoutingCache = () => {
  if (!process.client) return
  
  // Clear session storage
  sessionStorage.clear()
  
  // Clear any cached redirects
  if (typeof window.history !== 'undefined') {
    window.history.replaceState(null, '', window.location.pathname)
  }
  
  addTestResult('info', 'Routing cache cleared')
  updateStorageItems()
}

const fixAdminRedirect = () => {
  if (!process.client) return
  
  addTestResult('info', 'Checking admin redirect issue...')
  
  if (window.location.pathname.includes('/admin')) {
    if (!authStore.isAuthenticated) {
      addTestResult('warning', 'Not authenticated, redirecting to login')
      window.location.href = '/login'
      return
    }
    
    if (!['admin', 'staff'].includes(authStore.user?.role)) {
      addTestResult('warning', 'Insufficient role, redirecting to home')
      window.location.href = '/'
      return
    }
    
    addTestResult('success', 'Admin access validated')
  }
}

const refreshPage = () => {
  if (process.client) {
    window.location.reload()
  }
}

const testCameraAccess = async () => {
  if (!process.client) return
  
  addTestResult('info', 'Testing camera access...')
  
  try {
    // Check if getUserMedia is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Camera access not supported')
    }
    
    // Check HTTPS
    if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
      throw new Error('HTTPS required for camera access')
    }
    
    // Test camera permission
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { facingMode: 'environment' }
    })
    
    // Stop the stream immediately
    stream.getTracks().forEach(track => track.stop())
    
    addTestResult('success', 'Camera access granted ✅')
    
  } catch (error) {
    addTestResult('error', `Camera access failed: ${error.message}`)
  }
}

const testHttpsStatus = () => {
  if (!process.client) return
  
  const protocol = window.location.protocol
  const hostname = window.location.hostname
  
  if (protocol === 'https:') {
    addTestResult('success', 'HTTPS connection ✅')
  } else if (hostname === 'localhost' || hostname === '127.0.0.1') {
    addTestResult('info', 'HTTP on localhost (OK for development)')
  } else {
    addTestResult('error', 'HTTPS required for production')
  }
}

const navigateTo = (path) => {
  addTestResult('info', `Navigating to: ${path}`)
  router.push(path)
}

// Lifecycle
onMounted(() => {
  authStore.initialize()
  updateStorageItems()
  addTestResult('info', 'Debug page loaded')
})

// Page meta
definePageMeta({
  layout: 'default'
})
</script>

<style scoped>
.debug-routing-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  padding: 1rem;
  color: white;
  font-family: 'Monaco', 'Menlo', monospace;
}

.debug-container {
  max-width: 1200px;
  margin: 0 auto;
}

.debug-container h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: #60a5fa;
  font-size: 2.5rem;
  text-shadow: 0 0 20px rgba(96, 165, 250, 0.5);
}

.debug-section {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  backdrop-filter: blur(10px);
}

.debug-section h2 {
  color: #fbbf24;
  margin-bottom: 1rem;
  border-bottom: 2px solid rgba(251, 191, 36, 0.3);
  padding-bottom: 0.5rem;
}

.state-display {
  display: grid;
  gap: 0.5rem;
}

.state-item {
  background: rgba(0, 0, 0, 0.3);
  padding: 0.75rem;
  border-radius: 8px;
  border-left: 4px solid #60a5fa;
}

.status-success {
  color: #10b981;
  font-weight: bold;
}

.status-error {
  color: #ef4444;
  font-weight: bold;
}

.storage-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.tab-btn {
  padding: 0.5rem 1rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-btn.active {
  background: #60a5fa;
  color: white;
  border-color: #60a5fa;
}

.storage-items {
  max-height: 300px;
  overflow-y: auto;
}

.storage-item {
  background: rgba(0, 0, 0, 0.2);
  padding: 0.5rem;
  border-radius: 6px;
  margin-bottom: 0.25rem;
  word-break: break-all;
}

.storage-value {
  color: #a78bfa;
  font-family: monospace;
}

.action-grid, .nav-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.btn {
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-primary { background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; }
.btn-secondary { background: linear-gradient(135deg, #6b7280, #4b5563); color: white; }
.btn-success { background: linear-gradient(135deg, #10b981, #059669); color: white; }
.btn-warning { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; }
.btn-danger { background: linear-gradient(135deg, #ef4444, #dc2626); color: white; }
.btn-info { background: linear-gradient(135deg, #06b6d4, #0891b2); color: white; }

.nav-btn {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: white;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.test-results {
  max-height: 300px;
  overflow-y: auto;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  padding: 1rem;
}

.test-result {
  display: flex;
  gap: 1rem;
  padding: 0.5rem;
  border-radius: 4px;
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
}

.result-info { border-left: 3px solid #60a5fa; }
.result-success { border-left: 3px solid #10b981; }
.result-warning { border-left: 3px solid #f59e0b; }
.result-error { border-left: 3px solid #ef4444; }

.test-time {
  color: #9ca3af;
  font-size: 0.8rem;
  min-width: 80px;
}

.test-message {
  color: white;
}

/* Custom scrollbar */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.2); border-radius: 3px; }
::-webkit-scrollbar-thumb { background: rgba(96, 165, 250, 0.5); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: rgba(96, 165, 250, 0.7); }
</style>
