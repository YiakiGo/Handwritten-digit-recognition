import api from './api';

class MLService {
  // Predict digit from image data
  async predictDigit(imageData) {
    try {
      const response = await api.post('/ml/predict', {
        image: imageData,
        timestamp: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      console.error('Prediction error:', error);
      throw new Error('Failed to predict digit');
    }
  }

  // Batch prediction for multiple images
  async batchPredict(imagesData) {
    try {
      const response = await api.post('/ml/predict/batch', {
        images: imagesData,
        timestamp: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      console.error('Batch prediction error:', error);
      throw new Error('Failed to perform batch prediction');
    }
  }

  // Get model information
  async getModelInfo() {
    try {
      const response = await api.get('/ml/model/info');
      return response.data;
    } catch (error) {
      console.error('Model info error:', error);
      throw new Error('Failed to get model information');
    }
  }

  // Retrain model with new data
  async retrainModel(trainingData) {
    try {
      const response = await api.post('/ml/retrain', trainingData);
      return response.data;
    } catch (error) {
      console.error('Retraining error:', error);
      throw new Error('Failed to retrain model');
    }
  }

  // Get training progress
  async getTrainingProgress(modelId) {
    try {
      const response = await api.get(`/ml/training/progress/${modelId}`);
      return response.data;
    } catch (error) {
      console.error('Training progress error:', error);
      throw new Error('Failed to get training progress');
    }
  }
}

export default new MLService();