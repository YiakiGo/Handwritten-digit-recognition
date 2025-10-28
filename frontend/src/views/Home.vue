<template>
  <div class="home">
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">Digit Recognition System</h1>
        <p class="hero-subtitle">
          An intelligent system that recognizes handwritten digits using machine learning
        </p>
        <div class="hero-buttons">
          <router-link to="/draw" class="btn btn-primary">Try Recognition</router-link>
          <router-link to="/train" class="btn btn-secondary">Train Model</router-link>
        </div>
      </div>
    </div>

    <div class="features-section">
      <div class="container">
        <h2 class="section-title">Features</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🎨</div>
            <h3>Draw & Recognize</h3>
            <p>Draw digits on canvas and get instant recognition results with confidence scores</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🧠</div>
            <h3>Model Training</h3>
            <p>Train custom models with different parameters and visualize training progress</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📊</div>
            <h3>Performance Analytics</h3>
            <p>Monitor model performance with detailed charts and metrics</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">⚙️</div>
            <h3>Model Management</h3>
            <p>Manage multiple models, set active models, and compare performance</p>
          </div>
        </div>
      </div>
    </div>

    <div class="stats-section">
      <div class="container">
        <h2 class="section-title">System Status</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">{{ modelsCount }}</div>
            <div class="stat-label">Trained Models</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ activeModel ? 'Online' : 'Offline' }}</div>
            <div class="stat-label">ML Service</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ accuracy }}%</div>
            <div class="stat-label">Best Accuracy</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { api } from '../api/api'

export default {
  name: 'Home',
  data() {
    return {
      modelsCount: 0,
      activeModel: null,
      accuracy: 0
    }
  },
  async mounted() {
    await this.loadStats()
  },
  methods: {
    async loadStats() {
      try {
        const modelsResponse = await api.getModels()
        if (modelsResponse.data) {
          this.modelsCount = modelsResponse.data.length
          
          // Find best accuracy
          const bestModel = modelsResponse.data.reduce((best, current) => {
            return (current.accuracy > (best?.accuracy || 0)) ? current : best
          }, null)
          
          this.accuracy = bestModel ? Math.round(bestModel.accuracy * 100) : 0
        }

        const activeModelResponse = await api.getActiveModel()
        this.activeModel = activeModelResponse.data
      } catch (error) {
        console.error('Error loading stats:', error)
      }
    }
  }
}
</script>

<style scoped>
.home {
  min-height: 100vh;
}

.hero-section {
  background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 4rem 2rem;
  margin-bottom: 3rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.hero-title {
  color: white;
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.hero-subtitle {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.2rem;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 0.75rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

.btn-primary {
  background: #4CAF50;
  color: white;
}

.btn-primary:hover {
  background: #45a049;
  transform: translateY(-2px);
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

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section-title {
  color: white;
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  font-weight: 600;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.feature-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 15px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  color: white;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.feature-card p {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 15px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.stat-value {
  color: white;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .btn {
    width: 200px;
  }
  
  .section-title {
    font-size: 2rem;
  }
}
</style>