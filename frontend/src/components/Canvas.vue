<template>
  <div class="canvas-container">
    <canvas
      ref="canvas"
      :width="canvasSize"
      :height="canvasSize"
      @mousedown="startDrawing"
      @mousemove="draw"
      @mouseup="stopDrawing"
      @mouseleave="stopDrawing"
      @touchstart="startDrawingTouch"
      @touchmove="drawTouch"
      @touchend="stopDrawing"
    ></canvas>
    <div class="canvas-instructions">
      Draw a digit (0-9) in the canvas above
    </div>
  </div>
</template>

<script>
export default {
  name: 'Canvas',
  emits: ['drawing-complete'],
  data() {
    return {
      canvasSize: 280,
      isDrawing: false,
      lastX: 0,
      lastY: 0,
      ctx: null
    }
  },
  mounted() {
    this.initializeCanvas()
  },
  methods: {
    initializeCanvas() {
      const canvas = this.$refs.canvas
      this.ctx = canvas.getContext('2d')
      
      // Set canvas background
      this.ctx.fillStyle = 'black'
      this.ctx.fillRect(0, 0, this.canvasSize, this.canvasSize)
      
      // Set drawing style
      this.ctx.strokeStyle = 'white'
      this.ctx.lineWidth = 15
      this.ctx.lineCap = 'round'
      this.ctx.lineJoin = 'round'
    },
    
    getCanvasCoordinates(event) {
      const canvas = this.$refs.canvas
      const rect = canvas.getBoundingClientRect()
      const scaleX = canvas.width / rect.width
      const scaleY = canvas.height / rect.height
      
      return {
        x: (event.clientX - rect.left) * scaleX,
        y: (event.clientY - rect.top) * scaleY
      }
    },
    
    startDrawing(event) {
      this.isDrawing = true
      const { x, y } = this.getCanvasCoordinates(event)
      this.lastX = x
      this.lastY = y
    },
    
    startDrawingTouch(event) {
      event.preventDefault()
      this.isDrawing = true
      const touch = event.touches[0]
      const { x, y } = this.getCanvasCoordinates(touch)
      this.lastX = x
      this.lastY = y
    },
    
    draw(event) {
      if (!this.isDrawing) return
      
      const { x, y } = this.getCanvasCoordinates(event)
      
      this.ctx.beginPath()
      this.ctx.moveTo(this.lastX, this.lastY)
      this.ctx.lineTo(x, y)
      this.ctx.stroke()
      
      this.lastX = x
      this.lastY = y
    },
    
    drawTouch(event) {
      event.preventDefault()
      if (!this.isDrawing) return
      
      const touch = event.touches[0]
      const { x, y } = this.getCanvasCoordinates(touch)
      
      this.ctx.beginPath()
      this.ctx.moveTo(this.lastX, this.lastY)
      this.ctx.lineTo(x, y)
      this.ctx.stroke()
      
      this.lastX = x
      this.lastY = y
    },
    
    stopDrawing() {
      if (this.isDrawing) {
        this.isDrawing = false
        this.emitDrawingComplete()
      }
    },
    
    emitDrawingComplete() {
      const canvas = this.$refs.canvas
      const imageData = canvas.toDataURL('image/png')
      this.$emit('drawing-complete', imageData)
    },
    
    clearCanvas() {
      this.ctx.fillStyle = 'black'
      this.ctx.fillRect(0, 0, this.canvasSize, this.canvasSize)
    },
    
    getImageData() {
      return this.$refs.canvas.toDataURL('image/png')
    }
  }
}
</script>

<style scoped>
.canvas-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

canvas {
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  cursor: crosshair;
  background: black;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: border-color 0.3s ease;
}

canvas:hover {
  border-color: rgba(255, 255, 255, 0.6);
}

.canvas-instructions {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  text-align: center;
}

@media (max-width: 768px) {
  canvas {
    width: 250px;
    height: 250px;
  }
}
</style>