<template>
  <div class="training-chart">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

export default {
  name: 'TrainingChart',
  props: {
    history: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.renderChart()
  },
  beforeUnmount() {
    if (this.chart) {
      this.chart.destroy()
    }
  },
  watch: {
    history: {
      handler: 'renderChart',
      deep: true
    }
  },
  methods: {
    renderChart() {
      if (this.chart) {
        this.chart.destroy()
      }

      if (!this.history || this.history.length === 0) {
        return
      }

      const ctx = this.$refs.chartCanvas.getContext('2d')
      
      const epochs = this.history.map(record => record.epoch)
      const accuracy = this.history.map(record => record.accuracy)
      const valAccuracy = this.history.map(record => record.val_accuracy)
      const loss = this.history.map(record => record.loss)
      const valLoss = this.history.map(record => record.val_loss)

      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: epochs,
          datasets: [
            {
              label: 'Training Accuracy',
              data: accuracy,
              borderColor: '#4CAF50',
              backgroundColor: 'rgba(76, 175, 80, 0.1)',
              tension: 0.4,
              fill: false
            },
            {
              label: 'Validation Accuracy',
              data: valAccuracy,
              borderColor: '#2196F3',
              backgroundColor: 'rgba(33, 150, 243, 0.1)',
              tension: 0.4,
              fill: false
            },
            {
              label: 'Training Loss',
              data: loss,
              borderColor: '#FF9800',
              backgroundColor: 'rgba(255, 152, 0, 0.1)',
              tension: 0.4,
              fill: false,
              yAxisID: 'y1'
            },
            {
              label: 'Validation Loss',
              data: valLoss,
              borderColor: '#F44336',
              backgroundColor: 'rgba(244, 67, 54, 0.1)',
              tension: 0.4,
              fill: false,
              yAxisID: 'y1'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: 'index',
            intersect: false
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Epoch',
                color: 'white'
              },
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              },
              ticks: {
                color: 'white'
              }
            },
            y: {
              type: 'linear',
              display: true,
              position: 'left',
              title: {
                display: true,
                text: 'Accuracy',
                color: 'white'
              },
              min: 0,
              max: 1,
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              },
              ticks: {
                color: 'white',
                callback: function(value) {
                  return (value * 100).toFixed(0) + '%'
                }
              }
            },
            y1: {
              type: 'linear',
              display: true,
              position: 'right',
              title: {
                display: true,
                text: 'Loss',
                color: 'white'
              },
              grid: {
                drawOnChartArea: false
              },
              ticks: {
                color: 'white'
              }
            }
          },
          plugins: {
            legend: {
              labels: {
                color: 'white',
                usePointStyle: true
              }
            },
            tooltip: {
              mode: 'index',
              intersect: false,
              callbacks: {
                label: function(context) {
                  let label = context.dataset.label || ''
                  if (label) {
                    label += ': '
                  }
                  if (context.dataset.label.includes('Accuracy')) {
                    label += (context.parsed.y * 100).toFixed(2) + '%'
                  } else {
                    label += context.parsed.y.toFixed(4)
                  }
                  return label
                }
              }
            }
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.training-chart {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>