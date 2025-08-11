# Enhanced Authentication System Documentation

## Overview

The boxing ticket frontend has been updated to integrate with the new authentication API that provides enhanced security features including device tracking, token expiration management, and multi-device logout capabilities.

## New Features

### 1. Device Information Collection
- Automatically collects device and browser information during login
- Tracks IP address, device name, browser type, and platform
- Provides better security monitoring and audit trails

### 2. Token Expiration Management
- Supports JWT tokens with configurable expiration times
- Automatic logout when tokens expire
- Client-side token validation and cleanup
- Background monitoring for token expiration

### 3. Multi-Device Logout
- **Regular Logout**: Logs out from current device only
- **Logout All Devices**: Invalidates all active sessions across all devices
- Enhanced UI with dropdown options for logout choices

### 4. Enhanced Security
- Automatic token cleanup on expiration
- Improved authentication middleware
- Better error handling for authentication failures

## API Integration

### Login Endpoint
```
POST /auth/login
Content-Type: application/json

Request Body:
{
  "username": "user@example.com",
  "password": "password123",
  "deviceInfo": {
    "deviceName": "iPhone 13 - Chrome 91",
    "ipAddress": "192.168.1.1",
    "userAgent": "Mozilla/5.0...",
    "platform": "iPhone",
    "browser": "Chrome 91",
    "os": "iOS 15.0"
  }
}

Response:
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 86400
}
```

### Logout Endpoints
```
POST /auth/logout
Authorization: Bearer <token>

POST /auth/logout-all
Authorization: Bearer <token>
```

## Implementation Files

### New Files Created

#### 1. `utils/deviceInfo.ts`
- Device detection utilities
- Browser and OS identification
- IP address collection
- Device name generation

#### 2. `composables/useAuth.ts`
- Enhanced authentication composable
- Token management with expiration
- Device-aware login/logout
- Automatic session cleanup

#### 3. `plugins/auth-init.client.ts`
- Authentication system initialization
- Background token monitoring
- Automatic cleanup on expiration

### Updated Files

#### 1. `pages/login.vue`
- Updated to use new authentication API
- Enhanced error handling
- Device information collection
- Better user feedback

#### 2. `components/Navbar.vue`
- Added logout options dropdown
- Support for "Logout All Devices"
- Enhanced mobile UI for logout options
- Visual indicators for logout types

#### 3. `stores/auth.ts`
- Added token expiration handling
- Enhanced logout functionality
- Better state management

#### 4. `middleware/auth.global.ts`
- Token expiration checking
- Enhanced authentication validation
- Automatic cleanup for expired sessions

#### 5. `composables/useApi.ts`
- Token validation in API calls
- Automatic cleanup for expired tokens
- Enhanced error handling

## Usage Examples

### Basic Login
```typescript
import { useAuth } from '@/composables/useAuth';

const auth = useAuth();

// Login with username and password
await auth.login({
  username: 'user@example.com',
  password: 'password123'
});
```

### Logout Options
```typescript
// Regular logout (current device only)
await auth.logout();

// Logout from all devices
await auth.logoutAllDevices();
```

### Token Management
```typescript
// Check if token is expired
const isExpired = auth.isTokenExpired();

// Get time until expiration (in seconds)
const timeLeft = auth.getTimeUntilExpiration();

// Get current token
const token = auth.getToken();
```

### Authentication Status
```typescript
// Check if user is authenticated
const isAuthenticated = auth.isAuthenticated;

// Initialize auth system
auth.initializeAuth();
```

## User Interface Updates

### Desktop Logout Dropdown
- Click on logout button shows dropdown with two options
- "ออกจากระบบ" (Logout) - current device only
- "ออกจากทุกอุปกรณ์" (Logout All Devices) - all devices

### Mobile Logout Options
- Two separate buttons for logout options
- Clear visual distinction between logout types
- Descriptions for each option

## Error Handling

### Authentication Errors
- **401 Unauthorized**: Invalid credentials
- **429 Too Many Requests**: Rate limiting
- **500+ Server Errors**: Backend issues
- **Token Expired**: Automatic cleanup and redirect

### User Feedback
- Toast notifications for success/error states
- Console logging for debugging
- Visual feedback during loading states

## Security Considerations

### Token Storage
- Tokens stored in localStorage with expiration timestamps
- Automatic cleanup on expiration
- Secure transmission over HTTPS

### Device Tracking
- IP address collection for security monitoring
- Device fingerprinting for audit trails
- Browser and OS detection

### Session Management
- Configurable token expiration (default: 24 hours)
- Background monitoring for expired sessions
- Multi-device session invalidation

## Configuration

### Environment Variables
Ensure your `nuxt.config.ts` includes the API base URL:

```typescript
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || 'http://localhost:3001'
    }
  }
});
```

### Token Expiration
The system automatically handles token expiration based on the `expiresIn` value from the API response. Default is 86400 seconds (24 hours).

## Testing Checklist

### Login Functionality
- [x] Login with valid credentials
- [x] Login with invalid credentials
- [x] Device information collection
- [x] Token storage with expiration
- [x] User data persistence

### Logout Functionality
- [x] Regular logout (current device)
- [x] Logout all devices
- [x] Token cleanup
- [x] Redirect to login page
- [x] UI feedback

### Token Management
- [x] Token expiration detection
- [x] Automatic logout on expiration
- [x] Background monitoring
- [x] API call authentication
- [x] Middleware protection

### User Interface
- [x] Desktop logout dropdown
- [x] Mobile logout options
- [x] Loading states
- [x] Error messages
- [x] Success feedback

## Migration Notes

### Backward Compatibility
The new system maintains backward compatibility with existing authentication flows while adding enhanced features. Existing users will need to re-login to take advantage of the new device tracking features.

### Database Considerations
The backend should store device information and manage active sessions for the multi-device logout functionality to work properly.

## Troubleshooting

### Common Issues

1. **Token not persisting**: Check localStorage access and HTTPS configuration
2. **Device info not collected**: Verify browser permissions and API availability
3. **Logout all devices not working**: Ensure backend implements the `/auth/logout-all` endpoint
4. **Token expiration issues**: Check system clock synchronization

### Debug Information
Enable authentication debugging by checking browser console logs. All authentication operations include detailed logging with 🔐, 🚪, 🕒, and other emojis for easy identification.

## Future Enhancements

- [ ] Biometric authentication support
- [ ] Remember device functionality
- [ ] Advanced device management UI
- [ ] Session activity monitoring
- [ ] Security notifications for new device logins
