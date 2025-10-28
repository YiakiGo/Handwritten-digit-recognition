<template>
  <div class="model-list">
    <div class="list-header">
      <h3>Available Models</h3>
      <span class="model-count">{{ models.length }} models</span>
    </div>
    
    <div class="models-container">
      <div
        v-for="model in models"
        :key="model.id"
        :class="['model-item', { active: model.isActive, selected: selectedModel?.id === model.id }]"
        @click="$emit('model-selected', model)"
      >
        <div class="model-header">
          <h4 class="model-name">{{ model.modelName }}</h4>
          <span v-if="model.isActive" class="active-badge">Active</span>
        </div>
        
        <div class="model-stats">
          <div class="stat">
            <span class="label">Accuracy:</span>
            <span class="value">{{ (model.accuracy * 100).toFixed(2) }}%</span>
          </div>
          <div class="stat">
            <span class="label">Epochs:</span>
            <span class="value">{{ model.epochs }}</span>
          </div>
        </div>
        
        <div class="model-actions">
          <button
            v-if="!model.isActive"
            @click.stop="$emit('model-activated', model.id)"
            class="btn btn-sm btn-primary"
          >
            Activate
          </button>
          <button
            @click.stop="$emit('model-deleted', model.id)"
            class="btn btn-sm btn-danger"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
    
    <div v-if="models.length === 0" class="no-models">
      No models available. Train a model first.
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModelList',
  props: {
    models: {
      type: Array,
      required: true
    },
    activeModel: {
      type: Object,
      default: null
    }
  },
  emits: ['model-activated', 'model-deleted', 'model-selected'],
  data() {
    return {
      selectedModel: null
    }
  },
  methods: {
    selectModel(model) {
      this.selectedModel = model
      this.$emit('model-selected', model)
    }
  }
}
</script>

<style scoped>
.model-list {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.list-header h3 {
  color: white;
  margin: 0;
  font-size: 1.3rem;
}

.model-count {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

.models-container {
  max-height: 600px;
  overflow-y: auto;
}

.model-item {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.model-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.model-item.active {
  background: rgba(76, 175, 80, 0.1);
  border-left: 4px solid #4CAF50;
}

.model-item.selected {
  background: rgba(33, 150, 243, 0.1);
}

.model-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.model-name {
  color: white;
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.active-badge {
  background: #4CAF50;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

.model-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.stat {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

.value {
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
}

.model-actions {
  display: flex;
  gap: 0.5rem;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.8rem;
}

.btn-sm {
  padding: 0.4rem 0.8rem;
  font-size: 0.75rem;
}

.btn-primary {
  background: #4CAF50;
  color: white;
}

.btn-primary:hover {
  background: #45a049;
}

.btn-danger {
  background: rgba(244, 67, 54, 0.2);
  color: #f44336;
  border: 1px solid #f44336;
}

.btn-danger:hover {
  background: #f44336;
  color: white;
}

.no-models {
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  padding: 3rem;
  font-style: italic;
}

/* Scrollbar styling */
.models-container::-webkit-scrollbar {
  width: 6px;
}

.models-container::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

.models-container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.models-container::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>