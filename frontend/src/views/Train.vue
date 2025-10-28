<template>
  <div class="train">
    <div class="container">
      <h1 class="page-title">Train Model</h1>
      
      <div class="train-content">
        <div class="training-config">
          <div class="config-card">
            <h3>Training Configuration</h3>
            <form @submit.prevent="startTraining" class="training-form">
              <div class="form-group">
                <label for="modelName">Model Name</label>
                <input
                  id="modelName"
                  v-model="trainingConfig.modelName"
                  type="text"
                  required
                  placeholder="Enter model name"
                >
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="epochs">Epochs</label>
                  <input
                    id="epochs"
                    v-model.number="trainingConfig.epochs"
                    type="number"
                    min="1"
                    max="100"
                    required
                  >
                </div>
                
                <div class="form-group">
                  <label for="batchSize">Batch Size</label>
                  <input
                    id="batchSize"
                    v-model.number="trainingConfig.batchSize"
                    type="number"
                    min="1"
                    max="128"
                    required
                  >
                </div>
              </div>
              
              <div class="form-group">
                <label for="validationSplit">Validation Split</label>
                <input
                  id="validationSplit"
                  v-model.number="trainingConfig.validationSplit"
                  type="number"
                  min="0.1"
                  max="0.5"
                  step="0.1"
                  required
                >
              </div>
              
              <div class="form-group checkbox-group">
                <label class="checkbox-label">
                  <input
                    v-model="trainingConfig.useDataAugmentation"
                    type="checkbox"
                  >
                  Use Data Augmentation
                </label>
              </div>
              
              <button
                type="submit"
                class="btn btn-primary train-btn"
                :disabled="isTraining"
              >
                {{ isTraining ? 'Training...' : 'Start Training' }}
              </button>
            </form>
          </div>
        </div>

        <div class="training-visualization">
          <div class="visualization-card">
            <h3>Training Progress</h3>
            <div v-if="isTraining" class="training-progress">
              <div class="progress-bar">
                <div
                  class="progress-fill"
                  :style="{ width: trainingProgress + '%' }"
                ></div>
              </div>
              <div class="progress-text">{{ trainingProgress }}%</div>
            </div>
            <div v-else-if="trainingHistory.length > 0" class="charts-container">
              <TrainingChart :history="trainingHistory" />
            </div>
            <div v-else class="no-data">
              Start training to see progress charts
            </div>
          </div>

          <div class="training-log">
            <h3>Training Log</h3>
            <div class="log-content">
              <div
                v-for="(log, index) in trainingLogs"
                :key="index"
                class="log-entry"
                :class="log.type"
              >
                {{ log.message }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TrainingChart from '../components/TrainingChart.vue'
import { api } from '../api/api'

export default {
  name: 'Train',
  components: {
    TrainingChart
  },
  data() {
    return {
      isTraining: false,
      trainingProgress: 0,
      trainingConfig: {
        modelName: '',
        epochs: 10,
        batchSize: 32,
        validationSplit: 0.2,
        useDataAugmentation: false
      },
      trainingHistory: [],
      trainingLogs: []
    }
  },
  methods: {
    async startTraining() {
      if (this.isTraining) return
      
      this.isTraining = true
      this.trainingProgress = 0
      this.trainingLogs = []
      
      this.addLog('Starting model training...', 'info')
      
      try {
        const response = await api.trainModel(this.trainingConfig)
        
        if (response.status === 200) {
          this.addLog('Training started successfully', 'success')
          this.simulateProgress()
          
          // In a real application, you would set up WebSocket or polling
          // to get real-time training progress
          setTimeout(() => {
            this.completeTraining()
          }, 5000)
          
        } else {
          throw new Error(response.data || 'Training failed')
        }
      } catch (error) {
        console.error('Training error:', error)
        this.addLog('Training failed: ' + error.message, 'error')
        this.isTraining = false
      }
    },
    
    simulateProgress() {
      const interval = setInterval(() => {
        if (this.trainingProgress < 90) {
          this.trainingProgress += 10
          this.addLog(`Training progress: ${this.trainingProgress}%`, 'info')
        } else {
          clearInterval(interval)
        }
      }, 1000)
    },
    
    completeTraining() {
      this.trainingProgress = 100
      this.isTraining = false
      this.addLog('Training completed successfully!', 'success')
      
      // Load sample training history (in real app, fetch from API)
      this.loadSampleHistory()
    },
    
    loadSampleHistory() {
      // Sample data for demonstration
      this.trainingHistory = [
        { epoch: 1, accuracy: 0.85, loss: 0.45, val_accuracy: 0.82, val_loss: 0.48 },
        { epoch: 2, accuracy: 0.91, loss: 0.28, val_accuracy: 0.89, val_loss: 0.32 },
        { epoch: 3, accuracy: 0.94, loss: 0.18, val_accuracy: 0.92, val_loss: 0.24 },
        { epoch: 4, accuracy: 0.96, loss: 0.12, val_accuracy: 0.93, val_loss: 0.19 },
        { epoch: 5, accuracy: 0.97, loss: 0.09, val_accuracy: 0.94, val_loss: 0.16 },
        { epoch: 6, accuracy: 0.98, loss: 0.07, val_accuracy: 0.95, val_loss: 0.14 },
        { epoch: 7, accuracy: 0.98, loss: 0.06, val_accuracy: 0.95, val_loss: 0.13 },
        { epoch: 8, accuracy: 0.99, loss: 0.05, val_accuracy: 0.96, val_loss: 0.12 },
        { epoch: 9, accuracy: 0.99, loss: 0.04, val_accuracy: 0.96, val_loss: 0.11 },
        { epoch: 10, accuracy: 0.99, loss: 0.03, val_accuracy: 0.96, val_loss: 0.10 }
      ]
    },
    
    addLog(message, type = 'info') {
      this.trainingLogs.push({
        message,
        type,
        timestamp: new Date().toLocaleTimeString()
      })
      
      // Keep only last 50 logs
      if (this.trainingLogs.length > 50) {
        this.trainingLogs.shift()
      }
    }
  }
}
</script>

<style scoped>
.train {
  min-height: 100vh;
  padding: 2rem 0;
}

.page-title {
  color: white;
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  font-weight: 600;
}

.train-content {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 2rem;
}

.config-card,
.visualization-card,
.training-log {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.config-card h3,
.visualization-card h3,
.training-log h3 {
  color: white;
  margin-bottom: 1.5rem;
  font-size: 1.3rem;
}

.training-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  color: white;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

input[type="text"],
input[type="number"] {
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
}

input[type="text"]::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

input[type="text"]:focus,
input[type="number"]:focus {
  outline: none;
  border-color: #4CAF50;
}

.checkbox-group {
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  margin-bottom: 0;
}

input[type="checkbox"] {
  width: 18px;
  height: 18px;
}

.train-btn {
  padding: 1rem;
  font-size: 1.1rem;
  margin-top: 1rem;
}

.training-progress {
  text-align: center;
  padding: 2rem;
}

.progress-bar {
  width: 100%;
  height: 20px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4CAF50, #45a049);
  border-radius: 10px;
  transition: width 0.3s ease;
}

.progress-text {
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
}

.no-data {
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  padding: 3rem;
  font-style: italic;
}

.charts-container {
  height: 300px;
}

.training-log {
  margin-top: 2rem;
}

.log-content {
  max-height: 300px;
  overflow-y: auto;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  padding: 1rem;
}

.log-entry {
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.9rem;
}

.log-entry.info {
  color: #64b5f6;
  background: rgba(100, 181, 246, 0.1);
}

.log-entry.success {
  color: #4CAF50;
  background: rgba(76, 175, 80, 0.1);
}

.log-entry.error {
  color: #f44336;
  background: rgba(244, 67, 54, 0.1);
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.btn-primary {
  background: #4CAF50;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #45a049;
  transform: translateY(-2px);
}

.btn-primary:disabled {
  background: #666;
  cursor: not-allowed;
  transform: none;
}

@media (max-width: 968px) {
  .train-content {
    grid-template-columns: 1fr;
  }
  
  .config-card {
    order: 2;
  }
  
  .training-visualization {
    order: 1;
  }
}

@media (max-width: 768px) {
  .train {
    padding: 1rem 0;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .config-card,
  .visualization-card,
  .training-log {
    padding: 1rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>