// app.js
App({
  onLaunch() {
    console.log('Digit Recognition Mini Program launched');
    
    // Check system info
    this.getSystemInfo();
    
    // Initialize global data
    this.globalData = {
      baseURL: 'http://localhost:8081/api',
      currentModel: null,
      userInfo: null
    };
  },

  onShow() {
    console.log('Digit Recognition Mini Program showed');
  },

  onHide() {
    console.log('Digit Recognition Mini Program hid');
  },

  getSystemInfo() {
    const that = this;
    wx.getSystemInfo({
      success: (res) => {
        that.globalData.systemInfo = res;
        console.log('System info:', res);
      },
      fail: (err) => {
        console.error('Failed to get system info:', err);
      }
    });
  },

  // Show loading toast
  showLoading(message = 'Loading...') {
    wx.showLoading({
      title: message,
      mask: true
    });
  },

  // Hide loading
  hideLoading() {
    wx.hideLoading();
  },

  // Show success message
  showSuccess(message) {
    wx.showToast({
      title: message,
      icon: 'success',
      duration: 2000
    });
  },

  // Show error message
  showError(message) {
    wx.showToast({
      title: message,
      icon: 'none',
      duration: 3000
    });
  },

  // Global error handler
  handleApiError(error) {
    console.error('API Error:', error);
    let errorMsg = 'Network error, please try again';
    
    if (error.errMsg && error.errMsg.includes('timeout')) {
      errorMsg = 'Request timeout, please check network';
    } else if (error.statusCode === 404) {
      errorMsg = 'Service not found';
    } else if (error.statusCode === 500) {
      errorMsg = 'Server error';
    } else if (error.data && error.data.message) {
      errorMsg = error.data.message;
    }
    
    this.showError(errorMsg);
  }
});