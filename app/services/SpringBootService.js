/**
 * Spring Boot + Vue Server Connection Template
 *
 * This service provides methods to connect to a Spring Boot backend
 * with Vue.js frontend for handwriting recognition processing.
 * Configure with your server's IP address and port.
 */

// Configuration - Replace with your server's IP address and port
const SERVER_CONFIG = {
  // Example: 'http://192.168.1.100:8080/api'
  // Example: 'http://10.0.0.5:8080/api'
  // Example: 'http://localhost:8080/api' (for local testing)
  baseURL: 'http://YOUR_SERVER_IP:8080/api', // Change this to your server's IP

  // Alternative: Use environment variables for security
  // baseURL: process.env.SPRING_BOOT_SERVER_URL || 'http://localhost:8080/api',
};

const SPRING_BOOT_BASE_URL = SERVER_CONFIG.baseURL;

class SpringBootService {
  constructor() {
    this.baseURL = SPRING_BOOT_BASE_URL;
    this.timeout = 30000; // 30 seconds
  }

  /**
   * Send handwriting data to Spring Boot server for recognition
   * @param {Object} handwritingData - The handwriting canvas data
   * @returns {Promise} Recognition result
   */
  async recognizeHandwriting(handwritingData) {
    try {
      const response = await fetch(`${this.baseURL}/recognition/handwriting`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          paths: handwritingData.paths,
          bounds: handwritingData.bounds,
          timestamp: new Date().toISOString(),
          deviceInfo: {
            platform: 'react-native',
            screenWidth: handwritingData.canvasSize?.width,
            screenHeight: handwritingData.canvasSize?.height,
          }
        }),
        timeout: this.timeout,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error('Spring Boot recognition error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Save recognition result to Spring Boot backend
   * @param {Object} resultData - Recognition result data
   * @returns {Promise} Save result
   */
  async saveRecognitionResult(resultData) {
    try {
      const response = await fetch(`${this.baseURL}/recognition/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalText: resultData.originalText,
          recognizedText: resultData.recognizedText,
          confidence: resultData.confidence,
          processingTime: resultData.processingTime,
          language: resultData.language,
          userId: resultData.userId,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Spring Boot save error:', error);
      throw error;
    }
  }

  /**
   * Get user collections from Spring Boot backend
   * @param {string} userId - User identifier
   * @returns {Promise} User collections
   */
  async getUserCollections(userId) {
    try {
      const response = await fetch(`${this.baseURL}/collections/${userId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Spring Boot collections error:', error);
      throw error;
    }
  }

  /**
   * Get MNIST database information
   * @returns {Promise} MNIST data
   */
  async getMNISTData() {
    try {
      const response = await fetch(`${this.baseURL}/database/mnist`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Spring Boot MNIST error:', error);
      throw error;
    }
  }

  /**
   * Health check for Spring Boot server
   * @returns {Promise} Health status
   */
  async healthCheck() {
    try {
      const response = await fetch(`${this.baseURL}/health`, {
        method: 'GET',
        timeout: 5000,
      });

      if (!response.ok) {
        return { status: 'unhealthy', code: response.status };
      }

      return { status: 'healthy', code: 200 };
    } catch (error) {
      console.error('Spring Boot health check error:', error);
      return { status: 'error', error: error.message };
    }
  }

  /**
   * Upload handwriting image for processing
   * @param {string} base64Image - Base64 encoded image
   * @param {Object} metadata - Image metadata
   * @returns {Promise} Processing result
   */
  async uploadHandwritingImage(base64Image, metadata = {}) {
    try {
      const response = await fetch(`${this.baseURL}/recognition/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Image,
          metadata: metadata,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Spring Boot upload error:', error);
      throw error;
    }
  }
}

// Usage example:
const springBootService = new SpringBootService();

// Example: Recognize handwriting
export const recognizeHandwriting = async (handwritingData) => {
  return await springBootService.recognizeHandwriting(handwritingData);
};

// Example: Save result
export const saveRecognitionResult = async (resultData) => {
  return await springBootService.saveRecognitionResult(resultData);
};

// Example: Get collections
export const getUserCollections = async (userId) => {
  return await springBootService.getUserCollections(userId);
};

export default springBootService;