// utils/request.js
const app = getApp();

/**
 * WeChat Mini Program HTTP Request Wrapper
 */
class Request {
  constructor() {
    this.baseURL = 'http://localhost:8081/api';
    this.timeout = 10000;
  }

  /**
   * Main request method
   */
  request(options) {
    const that = this;
    
    return new Promise((resolve, reject) => {
      // Show loading if specified
      if (options.loading !== false) {
        wx.showLoading({
          title: options.loadingText || 'Loading...',
          mask: true
        });
      }

      // Make the request
      wx.request({
        url: that.baseURL + options.url,
        method: options.method || 'GET',
        data: options.data || {},
        header: {
          'Content-Type': 'application/json',
          ...options.header
        },
        timeout: that.timeout,
        success: (res) => {
          // Hide loading
          if (options.loading !== false) {
            wx.hideLoading();
          }

          // Handle different status codes
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(res);
          } else {
            that.handleError(res, reject);
          }
        },
        fail: (err) => {
          // Hide loading
          if (options.loading !== false) {
            wx.hideLoading();
          }
          
          that.handleError(err, reject);
        }
      });
    });
  }

  /**
   * Handle request errors
   */
  handleError(error, reject) {
    console.error('Request failed:', error);
    
    let errorMessage = 'Network error, please try again';
    
    if (error.errMsg) {
      if (error.errMsg.includes('timeout')) {
        errorMessage = 'Request timeout, please check your network';
      } else if (error.errMsg.includes('fail')) {
        errorMessage = 'Network request failed';
      }
    }
    
    if (error.statusCode) {
      switch (error.statusCode) {
        case 400:
          errorMessage = 'Bad request';
          break;
        case 401:
          errorMessage = 'Unauthorized';
          break;
        case 403:
          errorMessage = 'Access denied';
          break;
        case 404:
          errorMessage = 'Service not found';
          break;
        case 500:
          errorMessage = 'Server error';
          break;
        case 502:
          errorMessage = 'Bad gateway';
          break;
        case 503:
          errorMessage = 'Service unavailable';
          break;
        default:
          errorMessage = `Request failed (${error.statusCode})`;
      }
    }
    
    // Show error message
    wx.showToast({
      title: errorMessage,
      icon: 'none',
      duration: 3000
    });
    
    reject(error);
  }

  /**
   * GET request
   */
  get(url, options = {}) {
    return this.request({
      url,
      method: 'GET',
      ...options
    });
  }

  /**
   * POST request
   */
  post(url, data = {}, options = {}) {
    return this.request({
      url,
      method: 'POST',
      data,
      ...options
    });
  }

  /**
   * PUT request
   */
  put(url, data = {}, options = {}) {
    return this.request({
      url,
      method: 'PUT',
      data,
      ...options
    });
  }

  /**
   * DELETE request
   */
  delete(url, options = {}) {
    return this.request({
      url,
      method: 'DELETE',
      ...options
    });
  }

  /**
   * Upload file
   */
  upload(url, filePath, formData = {}, options = {}) {
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: this.baseURL + url,
        filePath: filePath,
        name: options.name || 'file',
        formData: formData,
        header: options.header || {},
        success: (res) => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
              res.data = JSON.parse(res.data);
              resolve(res);
            } catch (e) {
              resolve(res);
            }
          } else {
            this.handleError(res, reject);
          }
        },
        fail: (err) => {
          this.handleError(err, reject);
        }
      });
    });
  }

  /**
   * Set base URL
   */
  setBaseURL(url) {
    this.baseURL = url;
  }

  /**
   * Set timeout
   */
  setTimeout(timeout) {
    this.timeout = timeout;
  }
}

// Create instance and export
const request = new Request();

// Add to global app
app.wxRequest = request.request.bind(request);
app.wxGet = request.get.bind(request);
app.wxPost = request.post.bind(request);
app.wxPut = request.put.bind(request);
app.wxDelete = request.delete.bind(request);
app.wxUpload = request.upload.bind(request);

// Export for use in pages
module.exports = request;