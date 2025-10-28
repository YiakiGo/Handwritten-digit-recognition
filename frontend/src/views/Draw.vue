<template>
  <div class="draw">
    <div class="container">
      <h1 class="page-title">Draw & Recognize</h1>
      
      <div class="draw-content">
        <div class="canvas-section">
          <Canvas @drawing-complete="onDrawingComplete" />
          <div class="canvas-controls">
            <button @click="clearCanvas" class="btn btn-secondary">Clear</button>
            <button @click="recognizeDigit" class="btn btn-primary" :disabled="!isDrawingReady">
              Recognize
            </button>
          </div>
        </div>

        <div class="results-section">
          <div class="result-card">
            <h3>Recognition Result</h3>
            <div v-if="recognitionResult" class="result-content">
              <div class="predicted-digit">
                {{ recognitionResult.predicted_digit }}
              </div>
              <div class="confidence">
                Confidence: {{ (recognitionResult.confidence * 100).toFixed(2) }}%
              </div>
              <div class="probabilities">
                <h4>Probabilities:</h4>
                <div class="prob-bar" v-for="(prob, digit) in recognitionResult.probabilities" :key="digit">
                  <span class="digit-label">{{ digit }}:</span>
                  <div class="bar-container">
                    <div class="bar-fill" :style="{ width: (prob * 100) + '%' }"></div>
                    <span class="prob-value">{{ (prob * 100).toFixed(1) }}%</span>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="no-result">
              Draw a digit and click "Recognize"
            </div>
          </div>

          <div class="model-info">
            <h3>Active Model</h3>
            <div v-if="activeModel" class="model-details">
              <p><strong>Name:</strong> {{ activeModel.modelName }}</p>
              <p><strong>Accuracy:</strong> {{ (activeModel.accuracy * 100).toFixed(2) }}%</p>
              <p><strong>Epochs:</strong> {{ activeModel.epochs }}</p>
            </div>
            <div v-else class="no-model">
              No active model selected
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Canvas from '../components/Canvas.vue'
import { api } from '../api/api'

export default {
  name: 'Draw',
  components: {
    Canvas
  },
  data() {
    return {
      isDrawingReady: false,
      recognitionResult: null,
      activeModel: null,
      canvasData: null
    }
  },
  async mounted() {
    await this.loadActiveModel()
  },
  methods: {
    onDrawingComplete(imageData) {
      this.canvasData = imageData
      this.isDrawingReady = true
      this.recognitionResult = null
    },
    
    clearCanvas() {
      this.$refs.canvas?.clearCanvas()
      this.isDrawingReady = false
      this.recognitionResult = null
      this.canvasData = null
    },
    
    async recognizeDigit() {
      if (!this.canvasData) return
      
      try {
        const response = await api.recognizeDigit({
          imageData: this.canvasData,
          modelId: this.activeModel?.id
        })
        
        if (response.data) {
          this.recognitionResult = response.data
        }
      } catch (error) {
        console.error('Recognition error:', error)
        alert('Recognition failed. Please try again.')
      }
    },
    
    async loadActiveModel() {
      try {
        const response = await api.getActiveModel()
        this.activeModel = response.data
      } catch (error) {
        console.error('Error loading active model:', error)
      }
    }
  }
}
</script>

<style scoped>
.draw {
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

.draw-content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;
  align-items: start;
}

.canvas-section {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.canvas-controls {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;
}

.results-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.result-card,
.model-info {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.result-card h3,
.model-info h3 {
  color: white;
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.predicted-digit {
  font-size: 4rem;
  font-weight: bold;
  color: #4CAF50;
  text-align: center;
  margin: 1rem 0;
}

.confidence {
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
}

.probabilities h4 {
  color: white;
  margin-bottom: 1rem;
}

.prob-bar {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  gap: 0.5rem;
}

.digit-label {
  color: white;
  width: 20px;
  font-weight: 600;
}

.bar-container {
  flex: 1;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  height: 20px;
  position: relative;
  overflow: hidden;
}

.bar-fill {
  background: linear-gradient(90deg, #4CAF50, #45a049);
  height: 100%;
  border-radius: 10px;
  transition: width 0.3s ease;
}

.prob-value {
  color: white;
  font-size: 0.8rem;
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
}

.no-result,
.no-model {
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  padding: 2rem;
  font-style: italic;
}

.model-details p {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 0.5rem;
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

.btn-secondary {
  background: transparent;
  color: white;
  border: 2px solid white;
}

.btn-secondary:hover {
  background: white;
  color: #333;
  transform: translateY(-2px);
}

@media (max-width: 968px) {
  .draw-content {
    grid-template-columns: 1fr;
  }
  
  .results-section {
    order: -1;
  }
}

@media (max-width: 768px) {
  .draw {
    padding: 1rem 0;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .canvas-section,
  .result-card,
  .model-info {
    padding: 1rem;
  }
}
</style>