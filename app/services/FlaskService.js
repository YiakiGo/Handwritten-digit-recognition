/**
 * Flask Server Connection Template
 *
 * This service provides methods to connect to a Python Flask backend
 * for handwriting recognition processing.
 * Configure with your server's IP address and port.
 */

// Configuration - Replace with your server's IP address and port
const SERVER_CONFIG = {
  // Example: 'http://192.168.1.100:5000/api'
  // Example: 'http://10.0.0.5:5000/api'
  // Example: 'http://localhost:5000/api' (for local testing)
  baseURL: 'http://YOUR_SERVER_IP:5000/api', // Change this to your server's IP

  // Alternative: Use environment variables for security
  // baseURL: process.env.FLASK_SERVER_URL || 'http://localhost:5000/api',
};

const FLASK_BASE_URL = SERVER_CONFIG.baseURL;

class FlaskService {
  constructor() {
    this.baseURL = FLASK_BASE_URL;
    this.timeout = 30000; // 30 seconds
  }

  /**
   * Send handwriting data to Flask server for recognition using TensorFlow/ML
   * @param {Object} handwritingData - The handwriting canvas data
   * @returns {Promise} Recognition result
   */
  async recognizeHandwriting(handwritingData) {
    try {
      const response = await fetch(`${this.baseURL}/recognize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          strokes: handwritingData.paths,
          bounds: handwritingData.bounds,
          canvas_size: handwritingData.canvasSize,
          preprocessing: {
            normalize: true,
            smoothen: true,
            remove_noise: true,
          },
          model_params: {
            model_type: 'cnn_lstm',
            confidence_threshold: 0.8,
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
      console.error('Flask recognition error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Process handwriting image using OpenCV and ML models
   * @param {string} base64Image - Base64 encoded image
   * @param {Object} options - Processing options
   * @returns {Promise} Processing result
   */
  async processImage(base64Image, options = {}) {
    try {
      const response = await fetch(`${this.baseURL}/process_image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_data: base64Image,
          format: 'base64',
          processing_options: {
            denoise: options.denoise || true,
            binarize: options.binarize || true,
            skeletonize: options.skeletonize || false,
            normalize: options.normalize || true,
            ...options,
          },
          output_format: 'json',
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Flask image processing error:', error);
      throw error;
    }
  }

  /**
   * Train custom model with user data
   * @param {Array} trainingData - Training samples
   * @param {Object} trainingParams - Training parameters
   * @returns {Promise} Training result
   */
  async trainModel(trainingData, trainingParams = {}) {
    try {
      const response = await fetch(`${this.baseURL}/train`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          training_data: trainingData,
          model_type: trainingParams.modelType || 'custom_cnn',
          epochs: trainingParams.epochs || 10,
          batch_size: trainingParams.batchSize || 32,
          learning_rate: trainingParams.learningRate || 0.001,
          validation_split: trainingParams.validationSplit || 0.2,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Flask training error:', error);
      throw error;
    }
  }

  /**
   * Get model predictions for multiple samples
   * @param {Array} samples - Array of handwriting samples
   * @returns {Promise} Predictions
   */
  async batchPredict(samples) {
    try {
      const response = await fetch(`${this.baseURL}/batch_predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          samples: samples,
          batch_size: Math.min(samples.length, 32),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Flask batch prediction error:', error);
      throw error;
    }
  }

  /**
   * Get model information and performance metrics
   * @returns {Promise} Model info
   */
  async getModelInfo() {
    try {
      const response = await fetch(`${this.baseURL}/model_info`, {
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
      console.error('Flask model info error:', error);
      throw error;
    }
  }

  /**
   * Get MNIST dataset samples
   * @param {number} digit - Specific digit (0-9) or 'all'
   * @param {number} count - Number of samples to retrieve
   * @returns {Promise} MNIST samples
   */
  async getMNISTSamples(digit = 'all', count = 10) {
    try {
      const response = await fetch(`${this.baseURL}/mnist_samples?digit=${digit}&count=${count}`, {
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
      console.error('Flask MNIST samples error:', error);
      throw error;
    }
  }

  /**
   * Get real-time model performance metrics
   * @returns {Promise} Performance metrics
   */
  async getPerformanceMetrics() {
    try {
      const response = await fetch(`${this.baseURL}/metrics`, {
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
      console.error('Flask metrics error:', error);
      throw error;
    }
  }

  /**
   * Health check for Flask server
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
      console.error('Flask health check error:', error);
      return { status: 'error', error: error.message };
    }
  }

  /**
   * Export model for mobile deployment
   * @param {string} format - Export format (tflite, onnx, etc.)
   * @returns {Promise} Export result
   */
  async exportModel(format = 'tflite') {
    try {
      const response = await fetch(`${this.baseURL}/export_model`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          format: format,
          optimize_for_mobile: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Flask model export error:', error);
      throw error;
    }
  }
}

// Usage example:
const flaskService = new FlaskService();

// Example: Recognize handwriting with ML model
export const recognizeHandwritingML = async (handwritingData) => {
  return await flaskService.recognizeHandwriting(handwritingData);
};

// Example: Process handwriting image
export const processHandwritingImage = async (base64Image, options) => {
  return await flaskService.processImage(base64Image, options);
};

// Example: Get MNIST samples
export const getMNISTSamples = async (digit, count) => {
  return await flaskService.getMNISTSamples(digit, count);
};

// Example: Get model performance
export const getModelPerformance = async () => {
  return await flaskService.getPerformanceMetrics();
};

export default flaskService;