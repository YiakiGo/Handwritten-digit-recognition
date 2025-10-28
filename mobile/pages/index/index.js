// pages/index/index.js
const app = getApp();

Page({
  data: {
    loading: false,
    modelsCount: 0,
    systemStatus: 'Checking...',
    bestAccuracy: 0,
    activeModel: null
  },

  onLoad() {
    console.log('Index page loaded');
    this.loadSystemStatus();
  },

  onShow() {
    console.log('Index page showed');
    // Refresh data when page is shown
    this.loadSystemStatus();
  },

  onPullDownRefresh() {
    console.log('Pull down refresh');
    this.loadSystemStatus().finally(() => {
      wx.stopPullDownRefresh();
    });
  },

  async loadSystemStatus() {
    this.setData({ loading: true });
    
    try {
      // Load models list
      const modelsResponse = await app.wxRequest({
        url: '/models',
        method: 'GET'
      });

      if (modelsResponse.statusCode === 200) {
        const models = modelsResponse.data || [];
        this.setData({ 
          modelsCount: models.length 
        });

        // Calculate best accuracy
        if (models.length > 0) {
          const bestModel = models.reduce((best, current) => {
            return (current.accuracy > (best?.accuracy || 0)) ? current : best;
          }, null);
          
          this.setData({
            bestAccuracy: bestModel ? Math.round(bestModel.accuracy * 100) : 0
          });
        }

        // Load active model
        const activeModelResponse = await app.wxRequest({
          url: '/models/active',
          method: 'GET'
        });

        if (activeModelResponse.statusCode === 200 && activeModelResponse.data) {
          this.setData({ 
            activeModel: activeModelResponse.data,
            systemStatus: 'Online'
          });
        } else {
          this.setData({ 
            activeModel: null,
            systemStatus: 'No Active Model'
          });
        }
      } else {
        this.setData({ 
          systemStatus: 'Offline',
          activeModel: null 
        });
      }
    } catch (error) {
      console.error('Error loading system status:', error);
      this.setData({ 
        systemStatus: 'Offline',
        activeModel: null 
      });
      app.showError('Failed to load system status');
    } finally {
      this.setData({ loading: false });
    }
  },

  navigateToDraw() {
    wx.navigateTo({
      url: '/pages/draw/draw'
    });
  },

  refreshStatus() {
    this.loadSystemStatus();
    app.showSuccess('Status refreshed');
  },

  formatDate(dateString) {
    if (!dateString) return 'Unknown';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  }
});