import axios from 'axios'

const API_BASE_URL = 'http://localhost:8081/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`)
    return config
  },
  (error) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error('Response error:', error)
    
    if (error.response) {
      // Server responded with error status
      console.error('Error data:', error.response.data)
      console.error('Error status:', error.response.status)
    } else if (error.request) {
      // Request made but no response received
      console.error('No response received:', error.request)
    } else {
      // Something else happened
      console.error('Error:', error.message)
    }
    
    return Promise.reject(error)
  }
)

export const apiService = {
  // Model management
  getModels() {
    return api.get('/models')
  },
  
  getModelById(id) {
    return api.get(`/models/${id}`)
  },
  
  createModel(modelData) {
    return api.post('/models', modelData)
  },
  
  updateModel(id, modelData) {
    return api.put(`/models/${id}`, modelData)
  },
  
  deleteModel(id) {
    return api.delete(`/models/${id}`)
  },
  
  getActiveModel() {
    return api.get('/models/active')
  },
  
  activateModel(id) {
    return api.put(`/models/${id}/activate`)
  },
  
  // Training
  trainModel(trainingConfig) {
    return api.post('/training/train', trainingConfig)
  },
  
  getTrainingHistory(modelId) {
    return api.get(`/training/history/${modelId}`)
  },
  
  saveTrainingRecord(record) {
    return api.post('/training/record', record)
  },
  
  deleteTrainingHistory(modelId) {
    return api.delete(`/training/history/${modelId}`)
  },
  
  // Recognition
  recognizeDigit(recognitionData) {
    return api.post('/recognition/recognize', recognitionData)
  },
  
  // ML Service status
  getMLServiceStatus() {
    return api.get('/training/status')
  }
}

export { api }