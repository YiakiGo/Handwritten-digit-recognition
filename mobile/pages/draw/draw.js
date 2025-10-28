// pages/draw/draw.js
const app = getApp();

Page({
  data: {
    canvasContext: null,
    isDrawing: false,
    lastX: 0,
    lastY: 0,
    isDrawingReady: false,
    recognizing: false,
    recognitionResult: null,
    activeModel: null,
    canvasSize: 500
  },

  onLoad() {
    console.log('Draw page loaded');
    this.initCanvas();
    this.loadActiveModel();
  },

  onReady() {
    // Canvas is ready
    this.setData({
      canvasContext: wx.createCanvasContext('digitCanvas', this)
    });
    this.clearCanvas();
  },

  onShow() {
    console.log('Draw page showed');
  },

  initCanvas() {
    // Get system info to adjust canvas size for different screens
    const systemInfo = wx.getSystemInfoSync();
    const screenWidth = systemInfo.screenWidth;
    const canvasSize = Math.min(500, screenWidth - 100);
    
    this.setData({ canvasSize });
  },

  async loadActiveModel() {
    try {
      const response = await app.wxRequest({
        url: '/models/active',
        method: 'GET'
      });

      if (response.statusCode === 200 && response.data) {
        this.setData({ activeModel: response.data });
      } else {
        this.setData({ activeModel: null });
        app.showError('No active model found');
      }
    } catch (error) {
      console.error('Error loading active model:', error);
      this.setData({ activeModel: null });
    }
  },

  onTouchStart(e) {
    if (!this.data.activeModel) {
      app.showError('No active model available');
      return;
    }

    const touch = e.touches[0];
    const { x, y } = this.getCanvasCoordinates(touch);
    
    this.setData({
      isDrawing: true,
      lastX: x,
      lastY: y
    });

    // Start drawing
    this.data.canvasContext.setStrokeStyle('#FFFFFF');
    this.data.canvasContext.setLineWidth(20);
    this.data.canvasContext.setLineCap('round');
    this.data.canvasContext.setLineJoin('round');
    this.data.canvasContext.beginPath();
    this.data.canvasContext.moveTo(x, y);
  },

  onTouchMove(e) {
    if (!this.data.isDrawing) return;

    const touch = e.touches[0];
    const { x, y } = this.getCanvasCoordinates(touch);

    this.data.canvasContext.lineTo(x, y);
    this.data.canvasContext.stroke();
    this.data.canvasContext.draw(true);

    this.setData({
      lastX: x,
      lastY: y,
      isDrawingReady: true
    });
  },

  onTouchEnd() {
    if (this.data.isDrawing) {
      this.data.canvasContext.closePath();
      this.data.canvasContext.draw(true);
      this.setData({ isDrawing: false });
    }
  },

  getCanvasCoordinates(touch) {
    const query = wx.createSelectorQuery();
    return new Promise((resolve) => {
      query.select('#digitCanvas').boundingClientRect((rect) => {
        const x = (touch.x - rect.left) * (this.data.canvasSize / rect.width);
        const y = (touch.y - rect.top) * (this.data.canvasSize / rect.height);
        resolve({ x, y });
      }).exec();
    });
  },

  clearCanvas() {
    if (this.data.canvasContext) {
      this.data.canvasContext.setFillStyle('#000000');
      this.data.canvasContext.fillRect(0, 0, this.data.canvasSize, this.data.canvasSize);
      this.data.canvasContext.draw(true);
      
      this.setData({
        isDrawingReady: false,
        recognitionResult: null
      });
    }
  },

  async recognizeDigit() {
    if (!this.data.isDrawingReady) {
      app.showError('Please draw a digit first');
      return;
    }

    if (!this.data.activeModel) {
      app.showError('No active model available');
      return;
    }

    this.setData({ recognizing: true });

    try {
      // Get canvas image data
      const tempFilePath = await this.canvasToTempFilePath();
      
      if (!tempFilePath) {
        throw new Error('Failed to capture canvas image');
      }

      // Convert image to base64
      const base64Data = await this.imageToBase64(tempFilePath);
      
      // Send to recognition API
      const response = await app.wxRequest({
        url: '/recognition/recognize',
        method: 'POST',
        data: {
          imageData: base64Data,
          modelId: this.data.activeModel.id
        }
      });

      if (response.statusCode === 200 && response.data) {
        const result = response.data;
        
        // Format probabilities for display
        const probabilities = this.formatProbabilities(result.probabilities);
        
        this.setData({
          recognitionResult: {
            ...result,
            probabilities: probabilities
          }
        });
        
        app.showSuccess('Recognition completed');
      } else {
        throw new Error(response.data?.error || 'Recognition failed');
      }

    } catch (error) {
      console.error('Recognition error:', error);
      app.showError('Recognition failed: ' + (error.message || 'Unknown error'));
    } finally {
      this.setData({ recognizing: false });
    }
  },

  canvasToTempFilePath() {
    return new Promise((resolve, reject) => {
      wx.canvasToTempFilePath({
        canvasId: 'digitCanvas',
        success: (res) => {
          resolve(res.tempFilePath);
        },
        fail: (err) => {
          reject(err);
        }
      });
    });
  },

  imageToBase64(tempFilePath) {
    return new Promise((resolve, reject) => {
      wx.getFileSystemManager().readFile({
        filePath: tempFilePath,
        encoding: 'base64',
        success: (res) => {
          resolve('data:image/png;base64,' + res.data);
        },
        fail: (err) => {
          reject(err);
        }
      });
    });
  },

  formatProbabilities(probabilities) {
    if (!probabilities) return [];
    
    // Find maximum probability
    const maxProb = Math.max(...Object.values(probabilities));
    
    // Convert to array format for display
    return Object.entries(probabilities).map(([digit, prob]) => ({
      digit: digit,
      probability: prob,
      percentage: (prob * 100).toFixed(1),
      isMax: prob === maxProb
    }));
  },

  onShareAppMessage() {
    return {
      title: 'Digit Recognition - AI Handwritten Digit Recognition',
      path: '/pages/index/index'
    };
  }
});