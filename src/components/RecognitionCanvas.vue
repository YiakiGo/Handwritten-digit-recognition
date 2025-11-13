<template>
  <div class="recognition-canvas">
    <div class="canvas-container">
      <canvas 
        ref="canvas"
        @mousedown="startDrawing"
        @mousemove="draw"
        @mouseup="stopDrawing"
        @mouseleave="stopDrawing"
        @touchstart="startDrawing"
        @touchmove="draw"
        @touchend="stopDrawing"
      ></canvas>
      <div class="canvas-controls">
        <button @click="clearCanvas" class="btn-outline">清除</button>
        <button @click="predictDigit" class="btn-primary" :disabled="predicting">
          <span v-if="predicting" class="loading-spinner-small"></span>
          {{ predicting ? '识别中...' : '识别数字' }}
        </button>
      </div>
    </div>
    
    <div class="prediction-results" v-if="prediction">
      <h3>识别结果</h3>
      <div class="result-card">
        <div class="predicted-digit">{{ prediction.digit }}</div>
        <div class="confidence">
          置信度: {{ (prediction.confidence * 100).toFixed(1) }}%
        </div>
        <div class="prediction-time">
          处理时间: {{ prediction.processingTime }}ms
        </div>
      </div>
      
      <div class="feedback-section">
        <h4>反馈</h4>
        <div class="feedback-buttons">
          <button 
            @click="submitFeedback(true)" 
            class="btn-success"
            :disabled="feedbackSubmitted"
          >
            ✓ 正确
          </button>
          <button 
            @click="submitFeedback(false)" 
            class="btn-danger"
            :disabled="feedbackSubmitted"
          >
            ✗ 不正确
          </button>
        </div>
        <div v-if="feedbackSubmitted" class="feedback-thanks">
          感谢您的反馈！
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import mlService from '@/services/mlService'

export default {
  name: 'RecognitionCanvas',
  setup() {
    const canvas = ref(null)
    const ctx = ref(null)
    const isDrawing = ref(false)
    const predicting = ref(false)
    const prediction = ref(null)
    const feedbackSubmitted = ref(false)

    onMounted(() => {
      initializeCanvas()
    })

    const initializeCanvas = () => {
      const canvasEl = canvas.value
      ctx.value = canvasEl.getContext('2d')
      
      // Set canvas size
      canvasEl.width = 280
      canvasEl.height = 280
      
      // Set drawing style
      ctx.value.strokeStyle = '#000000'
      ctx.value.lineWidth = 15
      ctx.value.lineCap = 'round'
      ctx.value.lineJoin = 'round'
      
      // Clear canvas
      clearCanvas()
    }

    const startDrawing = (e) => {
      isDrawing.value = true
      const { offsetX, offsetY } = getCoordinates(e)
      ctx.value.beginPath()
      ctx.value.moveTo(offsetX, offsetY)
    }

    const draw = (e) => {
      if (!isDrawing.value) return
      
      e.preventDefault()
      const { offsetX, offsetY } = getCoordinates(e)
      ctx.value.lineTo(offsetX, offsetY)
      ctx.value.stroke()
    }

    const stopDrawing = () => {
      isDrawing.value = false
      ctx.value.beginPath()
    }

    const getCoordinates = (e) => {
      const canvasEl = canvas.value
      const rect = canvasEl.getBoundingClientRect()
      
      if (e.type.includes('touch')) {
        return {
          offsetX: e.touches[0].clientX - rect.left,
          offsetY: e.touches[0].clientY - rect.top
        }
      } else {
        return {
          offsetX: e.offsetX,
          offsetY: e.offsetY
        }
      }
    }

    const clearCanvas = () => {
      const canvasEl = canvas.value
      ctx.value.fillStyle = '#ffffff'
      ctx.value.fillRect(0, 0, canvasEl.width, canvasEl.height)
      prediction.value = null
      feedbackSubmitted.value = false
    }

    const getImageData = () => {
      const canvasEl = canvas.value
      // Create a temporary canvas to process the image
      const tempCanvas = document.createElement('canvas')
      const tempCtx = tempCanvas.getContext('2d')
      
      // Resize to 28x28 for MNIST model
      tempCanvas.width = 28
      tempCanvas.height = 28
      
      // Draw and process the image
      tempCtx.drawImage(canvasEl, 0, 0, 28, 28)
      const imageData = tempCtx.getImageData(0, 0, 28, 28)
      
      // Convert to grayscale array
      const grayscale = []
      for (let i = 0; i < imageData.data.length; i += 4) {
        const r = imageData.data[i]
        const g = imageData.data[i + 1]
        const b = imageData.data[i + 2]
        // Convert to grayscale (simple average)
        const gray = (r + g + b) / 3
        grayscale.push(gray / 255) // Normalize to 0-1
      }
      
      return grayscale
    }

    const predictDigit = async () => {
      try {
        predicting.value = true
        const imageData = getImageData()
        
        const startTime = performance.now()
        const result = await mlService.predictDigit(imageData)
        const processingTime = Math.round(performance.now() - startTime)
        
        prediction.value = {
          digit: result.prediction,
          confidence: result.confidence,
          processingTime: processingTime
        }
        
        feedbackSubmitted.value = false
      } catch (error) {
        console.error('Prediction failed:', error)
        alert('识别失败，请重试')
      } finally {
        predicting.value = false
      }
    }

    const submitFeedback = async (isCorrect) => {
      try {
        await api.post('/feedback', {
          predictionId: prediction.value?.id,
          actualDigit: isCorrect ? prediction.value.digit : null, // In real app, let user input correct digit
          isCorrect: isCorrect,
          timestamp: new Date().toISOString()
        })
        
        feedbackSubmitted.value = true
      } catch (error) {
        console.error('Feedback submission failed:', error)
      }
    }

    return {
      canvas,
      isDrawing,
      predicting,
      prediction,
      feedbackSubmitted,
      startDrawing,
      draw,
      stopDrawing,
      clearCanvas,
      predictDigit,
      submitFeedback
    }
  }
}
</script>

<style scoped>
.recognition-canvas {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  align-items: start;
}

.canvas-container {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
}

canvas {
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  cursor: crosshair;
  display: block;
  margin: 0 auto;
}

.canvas-controls {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  justify-content: center;
}

.btn-primary, .btn-outline {
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background: #059669;
  color: white;
  border: none;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-outline {
  background: white;
  color: #475569;
  border: 1px solid #d1d5db;
}

.btn-outline:hover {
  border-color: #059669;
}

.prediction-results {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
}

.result-card {
  text-align: center;
  padding: 24px;
  background: #f0fdf4;
  border-radius: 8px;
  margin-bottom: 24px;
}

.predicted-digit {
  font-size: 48px;
  font-weight: 700;
  color: #059669;
  margin-bottom: 8px;
}

.confidence, .prediction-time {
  color: #64748b;
  font-size: 14px;
}

.feedback-section h4 {
  margin-bottom: 12px;
  color: #374151;
}

.feedback-buttons {
  display: flex;
  gap: 12px;
}

.btn-success, .btn-danger {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-success {
  background: #d1fae5;
  color: #065f46;
}

.btn-success:hover:not(:disabled) {
  background: #a7f3d0;
}

.btn-danger {
  background: #fef2f2;
  color: #991b1b;
}

.btn-danger:hover:not(:disabled) {
  background: #fecaca;
}

.btn-success:disabled, .btn-danger:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.feedback-thanks {
  text-align: center;
  color: #059669;
  font-weight: 500;
  margin-top: 12px;
}

.loading-spinner-small {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  display: inline-block;
  margin-right: 8px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .recognition-canvas {
    grid-template-columns: 1fr;
  }
}
</style>