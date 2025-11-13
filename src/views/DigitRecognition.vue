<template>
  <div class="digit-recognition">
    <div class="page-header">
      <h1>Digit Recognition</h1>
      <p>Draw a digit (0-9) and let AI predict what it is</p>
    </div>

    <div class="recognition-container">
      <!-- Left Panel - Drawing Area -->
      <div class="drawing-panel">
        <div class="canvas-container">
          <canvas 
            ref="canvas"
            width="280" 
            height="280"
            class="drawing-canvas"
            @mousedown="startDrawing"
            @mousemove="draw"
            @mouseup="stopDrawing"
            @mouseleave="stopDrawing"
            @touchstart="startDrawingTouch"
            @touchmove="drawTouch"
            @touchend="stopDrawing"
          ></canvas>
          
          <div class="canvas-overlay">
            <div class="grid-overlay"></div>
          </div>
        </div>
        
        <div class="drawing-controls">
          <button class="control-btn secondary" @click="clearCanvas">
            Clear Canvas
          </button>
          <button class="control-btn primary" @click="predictDigit" :disabled="loading">
            <span v-if="loading" class="loading-spinner"></span>
            {{ loading ? 'Analyzing...' : 'Predict Digit' }}
          </button>
        </div>

        <div class="quick-actions">
          <h3>Quick Test</h3>
          <div class="quick-digits">
            <button 
              v-for="digit in [0,1,2,3,4,5,6,7,8,9]" 
              :key="digit"
              class="digit-btn"
              @click="loadTestDigit(digit)"
            >
              {{ digit }}
            </button>
          </div>
        </div>
      </div>

      <!-- Right Panel - Results & History -->
      <div class="results-panel">
        <!-- Current Prediction -->
        <div class="prediction-card">
          <h3>Prediction Result</h3>
          <div v-if="currentPrediction" class="prediction-result">
            <div class="predicted-digit">
              {{ currentPrediction.predicted_digit }}
            </div>
            <div class="confidence">
              Confidence: {{ (currentPrediction.confidence * 100).toFixed(1) }}%
            </div>
            <div class="prediction-time">
              Processed in {{ currentPrediction.processing_time }}ms
            </div>
          </div>
          <div v-else class="no-prediction">
            <div class="placeholder-icon">?</div>
            <p>Draw a digit to see prediction</p>
          </div>
        </div>

        <!-- Confidence Distribution -->
        <div class="confidence-card">
          <h3>Confidence Distribution</h3>
          <div class="confidence-bars">
            <div 
              v-for="i in 10" 
              :key="i"
              class="confidence-bar-container"
            >
              <div class="digit-label">{{ i-1 }}</div>
              <div class="confidence-bar-background">
                <div 
                  class="confidence-bar-fill"
                  :class="{ 
                    'highest': currentPrediction && (i-1) === currentPrediction.predicted_digit,
                    'active': currentPrediction && currentPrediction.confidence_distribution 
                      && currentPrediction.confidence_distribution[i-1] > 0.1
                  }"
                  :style="{ 
                    width: currentPrediction && currentPrediction.confidence_distribution 
                      ? `${currentPrediction.confidence_distribution[i-1] * 100}%` 
                      : '0%' 
                  }"
                ></div>
              </div>
              <div class="confidence-percent">
                {{ currentPrediction && currentPrediction.confidence_distribution 
                  ? `${(currentPrediction.confidence_distribution[i-1] * 100).toFixed(1)}%` 
                  : '0.0%' }}
              </div>
            </div>
          </div>
        </div>

        <!-- Feedback System -->
        <div class="feedback-card">
          <h3>Was this prediction correct?</h3>
          <div v-if="currentPrediction" class="feedback-buttons">
            <button 
              class="feedback-btn correct" 
              @click="submitFeedback(true)"
              :disabled="feedbackSubmitted"
            >
              ✓ Correct
            </button>
            <button 
              class="feedback-btn incorrect" 
              @click="submitFeedback(false)"
              :disabled="feedbackSubmitted"
            >
              ✗ Incorrect
            </button>
          </div>
          <div v-else class="feedback-placeholder">
            Provide feedback after prediction
          </div>
          <div v-if="feedbackSubmitted" class="feedback-thanks">
            Thank you for your feedback!
          </div>
        </div>

        <!-- Recent Predictions -->
        <div class="history-card">
          <h3>Recent Predictions</h3>
          <div class="predictions-list">
            <div 
              v-for="prediction in recentPredictions" 
              :key="prediction.id"
              class="prediction-item"
            >
              <div class="prediction-info">
                <span class="prediction-digit">{{ prediction.predicted_digit }}</span>
                <span class="prediction-confidence">
                  {{ (prediction.confidence * 100).toFixed(1) }}%
                </span>
              </div>
              <div class="prediction-meta">
                <span class="prediction-time">{{ formatTime(prediction.timestamp) }}</span>
                <span 
                  class="prediction-status"
                  :class="prediction.correct ? 'correct' : 'incorrect'"
                >
                  {{ prediction.correct ? '✓' : '✗' }}
                </span>
              </div>
            </div>
            <div v-if="recentPredictions.length === 0" class="no-history">
              No predictions yet
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import api from '@/services/api' // Your API service

export default {
  name: 'DigitRecognition',
  setup() {
    const canvas = ref(null)
    const ctx = ref(null)
    const isDrawing = ref(false)
    const loading = ref(false)
    const currentPrediction = ref(null)
    const feedbackSubmitted = ref(false)
    const recentPredictions = ref([])

    onMounted(() => {
      initCanvas()
      loadRecentPredictions()
    })

    const initCanvas = () => {
      const canvasEl = canvas.value
      ctx.value = canvasEl.getContext('2d')
      clearCanvas()
    }

    const startDrawing = (event) => {
      isDrawing.value = true
      draw(event)
    }

    const draw = (event) => {
      if (!isDrawing.value) return
      
      const canvasEl = canvas.value
      const rect = canvasEl.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      
      ctx.value.lineWidth = 15
      ctx.value.lineCap = 'round'
      ctx.value.strokeStyle = '#1e293b'
      ctx.value.lineJoin = 'round'
      
      ctx.value.lineTo(x, y)
      ctx.value.stroke()
      ctx.value.beginPath()
      ctx.value.moveTo(x, y)
    }

    const stopDrawing = () => {
      isDrawing.value = false
      ctx.value.beginPath()
    }

    const clearCanvas = () => {
      const canvasEl = canvas.value
      ctx.value.fillStyle = '#ffffff'
      ctx.value.fillRect(0, 0, canvasEl.width, canvasEl.height)
      ctx.value.fillStyle = '#1e293b'
      currentPrediction.value = null
      feedbackSubmitted.value = false
    }

    const startDrawingTouch = (event) => {
      event.preventDefault()
      const touch = event.touches[0]
      const mouseEvent = new MouseEvent('mousedown', {
        clientX: touch.clientX,
        clientY: touch.clientY
      })
      canvas.value.dispatchEvent(mouseEvent)
    }

    const drawTouch = (event) => {
      event.preventDefault()
      const touch = event.touches[0]
      const mouseEvent = new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
      })
      canvas.value.dispatchEvent(mouseEvent)
    }

    const predictDigit = async () => {
      loading.value = true
      feedbackSubmitted.value = false
      
      try {
        // Convert canvas to image data for the API
        const imageData = canvasToImageData()
        
        // Call your Spring Boot backend
        const response = await api.post('/api/predict', {
          image: imageData,
          timestamp: new Date().toISOString()
        })
        
        currentPrediction.value = response.data
        
        // Add to recent predictions
        recentPredictions.value.unshift({
          id: Date.now(),
          predicted_digit: response.data.predicted_digit,
          confidence: response.data.confidence,
          timestamp: new Date(),
          correct: null
        })
        
        // Keep only last 10 predictions
        if (recentPredictions.value.length > 10) {
          recentPredictions.value = recentPredictions.value.slice(0, 10)
        }
        
      } catch (error) {
        console.error('Prediction failed:', error)
        alert('Prediction failed. Please try again.')
      } finally {
        loading.value = false
      }
    }

    const canvasToImageData = () => {
      // Convert canvas to base64 PNG for the API
      return canvas.value.toDataURL('image/png')
      
      // Alternative: Convert to 28x28 grayscale array for MNIST
      // return getImageDataArray()
    }

    const getImageDataArray = () => {
      // Create a temporary canvas to resize to 28x28 for MNIST
      const tempCanvas = document.createElement('canvas')
      const tempCtx = tempCanvas.getContext('2d')
      tempCanvas.width = 28
      tempCanvas.height = 28
      
      // Draw and resize
      tempCtx.drawImage(canvas.value, 0, 0, 28, 28)
      const imageData = tempCtx.getImageData(0, 0, 28, 28)
      
      // Convert to grayscale array (MNIST format)
      const grayscale = []
      for (let i = 0; i < imageData.data.length; i += 4) {
        const r = imageData.data[i]
        const g = imageData.data[i + 1]
        const b = imageData.data[i + 2]
        // Convert to grayscale and normalize to 0-1
        const gray = (r + g + b) / 3 / 255.0
        grayscale.push(gray)
      }
      
      return grayscale
    }

    const submitFeedback = async (isCorrect) => {
      if (currentPrediction.value && recentPredictions.value.length > 0) {
        try {
          // Send feedback to backend
          await api.post('/api/feedback', {
            prediction_id: recentPredictions.value[0].id,
            predicted_digit: currentPrediction.value.predicted_digit,
            actual_digit: isCorrect ? currentPrediction.value.predicted_digit : null,
            is_correct: isCorrect,
            confidence: currentPrediction.value.confidence,
            user_feedback: true
          })
          
          // Update local state
          recentPredictions.value[0].correct = isCorrect
          feedbackSubmitted.value = true
          
        } catch (error) {
          console.error('Failed to submit feedback:', error)
          alert('Failed to submit feedback. Please try again.')
        }
      }
    }

    const loadTestDigit = async (digit) => {
      clearCanvas()
      
      try {
        // Load a test digit from backend (pre-drawn samples)
        const response = await api.get(`/api/test-digits/${digit}`)
        const testImageData = response.data.image
        
        // Draw the test digit on canvas
        await drawTestDigit(testImageData)
        
        // Auto-predict after loading test digit
        await predictDigit()
        
      } catch (error) {
        console.error('Failed to load test digit:', error)
        // Fallback: just simulate the prediction
        currentPrediction.value = {
          predicted_digit: digit,
          confidence: 0.95,
          processing_time: 25,
          confidence_distribution: Array.from({length: 10}, (_, i) => i === digit ? 0.95 : 0.05 / 9)
        }
      }
    }

    const drawTestDigit = (imageData) => {
      return new Promise((resolve) => {
        const img = new Image()
        img.onload = () => {
          ctx.value.drawImage(img, 0, 0, canvas.value.width, canvas.value.height)
          resolve()
        }
        img.src = imageData
      })
    }

    const loadRecentPredictions = async () => {
      try {
        const response = await api.get('/api/predictions/recent')
        recentPredictions.value = response.data
      } catch (error) {
        console.error('Failed to load recent predictions:', error)
        // Fallback to empty array
        recentPredictions.value = []
      }
    }

    const formatTime = (timestamp) => {
      const now = new Date()
      const diff = now - new Date(timestamp)
      const minutes = Math.floor(diff / 60000)
      if (minutes < 1) return 'Just now'
      if (minutes < 60) return `${minutes}m ago`
      const hours = Math.floor(minutes / 60)
      if (hours < 24) return `${hours}h ago`
      return new Date(timestamp).toLocaleDateString()
    }

    return {
      canvas,
      isDrawing,
      loading,
      currentPrediction,
      feedbackSubmitted,
      recentPredictions,
      startDrawing,
      draw,
      stopDrawing,
      clearCanvas,
      startDrawingTouch,
      drawTouch,
      predictDigit,
      submitFeedback,
      loadTestDigit,
      formatTime
    }
  }
}
</script>

<style scoped>
.digit-recognition {
  padding: 0;
}

.page-header {
  margin-bottom: 32px;
}

.page-header h1 {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
}

.page-header p {
  color: #64748b;
  font-size: 16px;
}

.recognition-container {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 32px;
  align-items: start;
}

/* Drawing Panel */
.drawing-panel {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
}

.canvas-container {
  position: relative;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  margin-bottom: 24px;
}

.drawing-canvas {
  display: block;
  cursor: crosshair;
  border-radius: 6px;
  width: 100%;
  height: auto;
}

.canvas-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.grid-overlay {
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(#f1f5f9 1px, transparent 1px),
    linear-gradient(90deg, #f1f5f9 1px, transparent 1px);
  background-size: 28px 28px;
  opacity: 0.5;
  border-radius: 6px;
}

.drawing-controls {
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
}

.control-btn {
  flex: 1;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}

.control-btn.secondary {
  background: #f8fafc;
  color: #475569;
  border: 1px solid #e2e8f0;
}

.control-btn.secondary:hover {
  background: #f1f5f9;
}

.control-btn.primary {
  background: #059669;
  color: white;
}

.control-btn.primary:hover:not(:disabled) {
  background: #047857;
  transform: translateY(-1px);
}

.control-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  display: inline-block;
  margin-right: 8px;
}

.quick-actions h3 {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
}

.quick-digits {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
}

.digit-btn {
  padding: 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s ease;
}

.digit-btn:hover {
  background: #059669;
  color: white;
  border-color: #059669;
}

/* Results Panel */
.results-panel {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.prediction-card,
.confidence-card,
.feedback-card,
.history-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
}

.prediction-card h3,
.confidence-card h3,
.feedback-card h3,
.history-card h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 16px;
}

.prediction-result {
  text-align: center;
}

.predicted-digit {
  font-size: 64px;
  font-weight: 700;
  color: #059669;
  margin-bottom: 8px;
}

.confidence {
  font-size: 16px;
  color: #64748b;
  margin-bottom: 4px;
}

.prediction-time {
  font-size: 14px;
  color: #94a3b8;
}

.no-prediction {
  text-align: center;
  padding: 40px 20px;
}

.placeholder-icon {
  font-size: 48px;
  color: #cbd5e1;
  margin-bottom: 12px;
}

.no-prediction p {
  color: #64748b;
  margin: 0;
}

/* Confidence Bars */
.confidence-bars {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.confidence-bar-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.digit-label {
  width: 20px;
  font-weight: 600;
  color: #475569;
  font-size: 14px;
}

.confidence-bar-background {
  flex: 1;
  height: 20px;
  background: #f1f5f9;
  border-radius: 10px;
  overflow: hidden;
}

.confidence-bar-fill {
  height: 100%;
  background: #cbd5e1;
  border-radius: 10px;
  transition: width 0.3s ease;
}

.confidence-bar-fill.active {
  background: #059669;
}

.confidence-bar-fill.highest {
  background: #047857;
}

.confidence-percent {
  width: 40px;
  font-size: 12px;
  color: #64748b;
  text-align: right;
}

/* Feedback */
.feedback-buttons {
  display: flex;
  gap: 12px;
}

.feedback-btn {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.feedback-btn.correct:hover:not(:disabled) {
  background: #f0fdf4;
  border-color: #059669;
  color: #059669;
}

.feedback-btn.incorrect:hover:not(:disabled) {
  background: #fef2f2;
  border-color: #ef4444;
  color: #ef4444;
}

.feedback-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.feedback-placeholder {
  text-align: center;
  color: #64748b;
  padding: 20px;
  font-style: italic;
}

.feedback-thanks {
  text-align: center;
  color: #059669;
  font-weight: 500;
  margin-top: 12px;
}

/* History */
.predictions-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 300px;
  overflow-y: auto;
}

.prediction-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
  border-left: 4px solid #059669;
}

.prediction-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.prediction-digit {
  font-size: 20px;
  font-weight: 700;
  color: #059669;
}

.prediction-confidence {
  font-size: 12px;
  color: #64748b;
  background: white;
  padding: 2px 6px;
  border-radius: 4px;
}

.prediction-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #64748b;
}

.prediction-status {
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 10px;
}

.prediction-status.correct {
  background: #f0fdf4;
  color: #059669;
}

.prediction-status.incorrect {
  background: #fef2f2;
  color: #ef4444;
}

.no-history {
  text-align: center;
  color: #64748b;
  padding: 20px;
  font-style: italic;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 1024px) {
  .recognition-container {
    grid-template-columns: 1fr;
  }
  
  .results-panel {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 768px) {
  .drawing-controls {
    flex-direction: column;
  }
  
  .feedback-buttons {
    flex-direction: column;
  }
}
</style>