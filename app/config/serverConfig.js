/**
 * Server Configuration
 *
 * Configure your server connection settings here
 * Replace with your actual server IP address and port
 */

// Example configurations - uncomment and modify the one you need

// === LOCAL DEVELOPMENT ===
// For testing locally on your computer
export const LOCAL_CONFIG = {
  springBoot: 'http://localhost:8080/api',
  flask: 'http://localhost:5000/api',
};

// === NETWORK IP CONFIGURATION ===
// Replace with your server's actual IP address

// Example: Your server is at IP 192.168.1.100
export const NETWORK_CONFIG = {
  springBoot: 'http://192.168.1.100:8080/api',
  flask: 'http://192.168.1.100:5000/api',
};

// Example: Your server is at IP 10.0.0.5
export const OFFICE_NETWORK_CONFIG = {
  springBoot: 'http://10.0.0.5:8080/api',
  flask: 'http://10.0.0.5:5000/api',
};

// === ACTIVE CONFIGURATION ===
// Change this to use different configurations
export const ACTIVE_CONFIG = NETWORK_CONFIG;

// === HOW TO FIND YOUR SERVER IP ===
/*
1. On Windows: Open Command Prompt, type: ipconfig
   Look for "IPv4 Address" under your network adapter

2. On Mac/Linux: Open Terminal, type: ifconfig or ip addr
   Look for "inet" address (not 127.0.0.1)

3. On your phone (same network):
   - Android: Settings → About → Status → IP address
   - iPhone: Settings → Wi-Fi → tap your network → IP address

4. Make sure your phone and server are on the same Wi-Fi network!
*/

// === TROUBLESHOOTING ===
/*
If connection fails:
1. Check if server is running on the correct IP/port
2. Ensure firewall allows connections on that port
3. Verify phone and server are on same network
4. Test with: http://YOUR_IP:PORT in browser
5. Check server logs for incoming connections
*/

// === SECURITY NOTES ===
/*
For production:
1. Use HTTPS instead of HTTP
2. Add authentication headers
3. Use environment variables for sensitive data
4. Implement rate limiting
5. Add CORS configuration on server
*/

export default ACTIVE_CONFIG;