<template>
  <nav class="top-navigation">
    <div class="nav-left">
      <button class="sidebar-toggle" @click="$emit('toggle-sidebar')">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>
      <div class="breadcrumb">
        <span class="page-title">{{ currentPageTitle }}</span>
      </div>
    </div>
    
    <div class="nav-right">
      <div class="nav-items">
        <button class="nav-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <circle cx="12" cy="12" r="4"/>
            <line x1="21.17" y1="8" x2="12" y2="8"/>
            <line x1="3.95" y1="6.06" x2="8.54" y2="14"/>
            <line x1="10.88" y1="21.94" x2="15.46" y2="14"/>
          </svg>
        </button>
        
        <button class="nav-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <span class="notification-badge">3</span>
        </button>
        
        <div class="user-menu">
          <button class="user-trigger" @click="showUserMenu = !showUserMenu">
            <div class="user-avatar">
              {{ userInitials }}
            </div>
            <span class="user-name">{{ userName }}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          
          <div v-if="showUserMenu" class="user-dropdown">
            <div class="user-info">
              <div class="user-avatar large">
                {{ userInitials }}
              </div>
              <div class="user-details">
                <div class="user-name">{{ userName }}</div>
                <div class="user-email">{{ userEmail }}</div>
              </div>
            </div>
            <div class="dropdown-divider"></div>
            <a href="#" class="dropdown-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              Profile
            </a>
            <a href="#" class="dropdown-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
              Settings
            </a>
            <div class="dropdown-divider"></div>
            <a href="#" class="dropdown-item text-danger" @click="handleLogout">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Sign Out
            </a>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'TopNavigation',
  emits: ['toggle-sidebar'],
  setup() {
    const router = useRouter()
    const showUserMenu = ref(false)
    
    // Mock user data - replace with actual user data from your auth system
    const userData = ref({
      name: 'John Doe',
      email: 'john.doe@example.com'
    })
    
    const userInitials = computed(() => {
      return userData.value.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
    })
    
    const userName = computed(() => userData.value.name)
    const userEmail = computed(() => userData.value.email)
    const currentPageTitle = computed(() => {
      // This would be dynamic based on current route
      return 'Dashboard'
    })
    
    const handleLogout = () => {
      // Handle logout logic
      router.push('/')
    }
    
    return {
      showUserMenu,
      userInitials,
      userName,
      userEmail,
      currentPageTitle,
      handleLogout
    }
  }
}
</script>

<style scoped>
.top-navigation {
  height: 70px;
  background: white;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.sidebar-toggle {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  color: #64748b;
  transition: all 0.2s ease;
}

.sidebar-toggle:hover {
  background: #f1f5f9;
  color: #334155;
}

.breadcrumb {
  display: flex;
  align-items: center;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
}

.nav-right {
  display: flex;
  align-items: center;
}

.nav-items {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-item {
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  color: #64748b;
  transition: all 0.2s ease;
}

.nav-item:hover {
  background: #f1f5f9;
  color: #334155;
}

.notification-badge {
  position: absolute;
  top: 4px;
  right: 4px;
  background: #ef4444;
  color: white;
  font-size: 10px;
  padding: 2px 4px;
  border-radius: 8px;
  min-width: 16px;
  text-align: center;
}

.user-menu {
  position: relative;
  margin-left: 8px;
}

.user-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.user-trigger:hover {
  background: #f1f5f9;
}

.user-avatar {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #059669, #047857);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 12px;
}

.user-avatar.large {
  width: 48px;
  height: 48px;
  font-size: 16px;
}

.user-name {
  font-weight: 500;
  color: #334155;
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  min-width: 240px;
  z-index: 1000;
}

.user-info {
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-details {
  flex: 1;
}

.user-details .user-name {
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 2px;
}

.user-email {
  font-size: 12px;
  color: #64748b;
}

.dropdown-divider {
  height: 1px;
  background: #e2e8f0;
  margin: 8px 0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  color: #64748b;
  text-decoration: none;
  transition: all 0.2s ease;
  font-size: 14px;
}

.dropdown-item:hover {
  background: #f8fafc;
  color: #1e293b;
}

.dropdown-item.text-danger {
  color: #ef4444;
}

.dropdown-item.text-danger:hover {
  background: #fef2f2;
  color: #dc2626;
}
</style>