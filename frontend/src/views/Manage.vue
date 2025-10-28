<template>
  <div class="manage">
    <div class="container">
      <h1 class="page-title">Manage Models</h1>
      
      <div class="manage-content">
        <div class="models-list">
          <ModelList 
            :models="models"
            :active-model="activeModel"
            @model-activated="onModelActivated"
            @model-deleted="onModelDeleted"
          />
        </div>

        <div class="model-details">
          <div class="details-card">
            <h3>Model Details</h3>
            <div v-if="selectedModel" class="model-info">
              <div class="info-item">
                <label>Name:</label>
                <span>{{ selectedModel.modelName }}</span>
              </div>
              <div class="info-item">
                <label>Accuracy:</label>
                <span>{{ (selectedModel.accuracy * 100).toFixed(2) }}%</span>
              </div>
              <div class="info-item">
                <label>Loss:</label>
                <span>{{ selectedModel.loss?.toFixed(4) || 'N/A' }}</span>
              </div>
              <div class="info-item">
                <label>Epochs:</label>
                <span>{{ selectedModel.epochs }}</span>
              </div>
              <div class="info-item">
                <label>Batch Size:</label>
                <span>{{ selectedModel.batchSize }}</span>
              </div>
              <div class="info-item">
                <label>Created:</label>
                <span>{{ formatDate(selectedModel.createdAt) }}</span>
              </div>
              <div class="info-item">
                <label>Status:</label>
                <span :class="['status', selectedModel.isActive ? 'active' : 'inactive']">
                  {{ selectedModel.isActive ? 'Active' : 'Inactive' }}
                </span>
              </div>
            </div>
            <div v-else class="no-selection">
              Select a model to view details
            </div>
          </div>

          <div class="training-history">
            <h3>Training History</h3>
            <div v-if="selectedModel && trainingHistory.length > 0" class="history-chart">
              <TrainingChart :history="trainingHistory" />
            </div>
            <div v-else class="no-history">
              No training history available
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ModelList from '../components/ModelList.vue'
import TrainingChart from '../components/TrainingChart.vue'
import { api } from '../api/api'

export default {
  name: 'Manage',
  components: {
    ModelList,
    TrainingChart
  },
  data() {
    return {
      models: [],
      activeModel: null,
      selectedModel: null,
      trainingHistory: []
    }
  },
  async mounted() {
    await this.loadModels()
    await this.loadActiveModel()
  },
  methods: {
    async loadModels() {
      try {
        const response = await api.getModels()
        this.models = response.data || []
        
        if (this.models.length > 0 && !this.selectedModel) {
          this.selectedModel = this.models[0]
          await this.loadTrainingHistory(this.selectedModel.id)
        }
      } catch (error) {
        console.error('Error loading models:', error)
      }
    },
    
    async loadActiveModel() {
      try {
        const response = await api.getActiveModel()
        this.activeModel = response.data
      } catch (error) {
        console.error('Error loading active model:', error)
      }
    },
    
    async loadTrainingHistory(modelId) {
      try {
        const response = await api.getTrainingHistory(modelId)
        this.trainingHistory = response.data || []
      } catch (error) {
        console.error('Error loading training history:', error)
        this.trainingHistory = []
      }
    },
    
    async onModelActivated(modelId) {
      try {
        await api.activateModel(modelId)
        await this.loadModels()
        await this.loadActiveModel()
        
        // Update selected model if it was activated
        this.selectedModel = this.models.find(m => m.id === modelId) || this.selectedModel
      } catch (error) {
        console.error('Error activating model:', error)
        alert('Failed to activate model')
      }
    },
    
    async onModelDeleted(modelId) {
      if (confirm('Are you sure you want to delete this model?')) {
        try {
          await api.deleteModel(modelId)
          await this.loadModels()
          
          // Clear selection if deleted model was selected
          if (this.selectedModel && this.selectedModel.id === modelId) {
            this.selectedModel = this.models.length > 0 ? this.models[0] : null
            if (this.selectedModel) {
              await this.loadTrainingHistory(this.selectedModel.id)
            } else {
              this.trainingHistory = []
            }
          }
        } catch (error) {
          console.error('Error deleting model:', error)
          alert('Failed to delete model')
        }
      }
    },
    
    formatDate(dateString) {
      if (!dateString) return 'N/A'
      return new Date(dateString).toLocaleDateString()
    }
  },
  watch: {
    async selectedModel(newModel) {
      if (newModel) {
        await this.loadTrainingHistory(newModel.id)
      }
    }
  }
}
</script>

<style scoped>
.manage {
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

.manage-content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;
}

.details-card,
.training-history {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 2rem;
}

.details-card h3,
.training-history h3 {
  color: white;
  margin-bottom: 1.5rem;
  font-size: 1.3rem;
}

.model-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-item {
  display: flex;
  justify-content: between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.info-item label {
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
  min-width: 100px;
}

.info-item span {
  color: white;
  flex: 1;
  text-align: right;
}

.status {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.status.active {
  background: rgba(76, 175, 80, 0.2);
  color: #4CAF50;
  border: 1px solid #4CAF50;
}

.status.inactive {
  background: rgba(244, 67, 54, 0.2);
  color: #f44336;
  border: 1px solid #f44336;
}

.no-selection,
.no-history {
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  padding: 3rem;
  font-style: italic;
}

.history-chart {
  height: 250px;
}

@media (max-width: 968px) {
  .manage-content {
    grid-template-columns: 1fr;
  }
  
  .model-details {
    order: -1;
  }
}

@media (max-width: 768px) {
  .manage {
    padding: 1rem 0;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .details-card,
  .training-history {
    padding: 1rem;
  }
  
  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
  
  .info-item span {
    text-align: left;
  }
}
</style>