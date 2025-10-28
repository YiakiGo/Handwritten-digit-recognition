from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import json
import numpy as np
from datetime import datetime
import base64
import io
from PIL import Image
import cv2

from model_manager import ModelManager
from train_model import ModelTrainer
from recognize import DigitRecognizer

app = Flask(__name__)
CORS(app)

# Initialize components
model_manager = ModelManager()
model_trainer = ModelTrainer()
digit_recognizer = DigitRecognizer()

# Ensure directories exist
os.makedirs('models', exist_ok=True)
os.makedirs('models/archived', exist_ok=True)
os.makedirs('datasets', exist_ok=True)
os.makedirs('static/charts', exist_ok=True)

@app.route('/')
def home():
    return jsonify({
        'message': 'Digit Recognition ML Service',
        'status': 'running',
        'version': '1.0.0'
    })

@app.route('/status')
def status():
    """Get service and model status"""
    try:
        model_info = model_manager.get_current_model_info()
        return jsonify({
            'status': 'healthy',
            'current_model': model_info,
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/models')
def list_models():
    """List all available models"""
    try:
        models = model_manager.get_all_models()
        return jsonify(models)
    except Exception as e:
        return jsonify({
            'error': f'Failed to list models: {str(e)}'
        }), 500

@app.route('/train', methods=['POST'])
def train_model():
    """Train a new model"""
    try:
        data = request.get_json()
        
        # Validate required parameters
        required_params = ['modelName', 'epochs', 'batchSize']
        for param in required_params:
            if param not in data:
                return jsonify({
                    'error': f'Missing required parameter: {param}'
                }), 400
        
        # Extract training parameters
        model_name = data['modelName']
        epochs = data['epochs']
        batch_size = data['batchSize']
        validation_split = data.get('validationSplit', 0.2)
        use_data_augmentation = data.get('useDataAugmentation', False)
        
        print(f"Starting training: {model_name}, epochs: {epochs}, batch_size: {batch_size}")
        
        # Start training
        training_result = model_trainer.train_model(
            model_name=model_name,
            epochs=epochs,
            batch_size=batch_size,
            validation_split=validation_split,
            use_data_augmentation=use_data_augmentation
        )
        
        if training_result['success']:
            # Update model manager with new model
            model_path = training_result['model_path']
            model_manager.update_current_model(
                model_name=model_name,
                model_path=model_path,
                accuracy=training_result['final_accuracy'],
                loss=training_result['final_loss'],
                epochs=epochs,
                batch_size=batch_size
            )
            
            return jsonify({
                'success': True,
                'message': 'Training completed successfully',
                'model_id': training_result['model_id'],
                'final_accuracy': training_result['final_accuracy'],
                'final_loss': training_result['final_loss'],
                'training_time': training_result['training_time'],
                'model_path': model_path,
                'charts': training_result.get('charts', {})
            })
        else:
            return jsonify({
                'success': False,
                'error': training_result['error']
            }), 500
            
    except Exception as e:
        print(f"Training error: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'Training failed: {str(e)}'
        }), 500

@app.route('/recognize', methods=['POST'])
def recognize_digit():
    """Recognize digit from image data"""
    try:
        data = request.get_json()
        
        if 'imageData' not in data:
            return jsonify({
                'error': 'Missing imageData parameter'
            }), 400
        
        # Extract image data (base64 encoded)
        image_data = data['imageData']
        model_id = data.get('modelId')
        
        # Process image and recognize digit
        recognition_result = digit_recognizer.recognize_digit(
            image_data=image_data,
            model_id=model_id
        )
        
        if recognition_result['success']:
            return jsonify({
                'success': True,
                'predicted_digit': int(recognition_result['predicted_digit']),
                'confidence': float(recognition_result['confidence']),
                'probabilities': recognition_result['probabilities'],
                'processed_image_shape': recognition_result.get('processed_image_shape')
            })
        else:
            return jsonify({
                'success': False,
                'error': recognition_result['error']
            }), 400
            
    except Exception as e:
        print(f"Recognition error: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'Recognition failed: {str(e)}'
        }), 500

@app.route('/model/<model_id>')
def get_model_info(model_id):
    """Get information about a specific model"""
    try:
        model_info = model_manager.get_model_info(model_id)
        if model_info:
            return jsonify(model_info)
        else:
            return jsonify({
                'error': 'Model not found'
            }), 404
    except Exception as e:
        return jsonify({
            'error': f'Failed to get model info: {str(e)}'
        }), 500

@app.route('/chart/<chart_name>')
def get_chart(chart_name):
    """Serve training charts"""
    try:
        chart_path = os.path.join('static', 'charts', f'{chart_name}.png')
        if os.path.exists(chart_path):
            return send_file(chart_path, mimetype='image/png')
        else:
            return jsonify({'error': 'Chart not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/current-model', methods=['GET', 'PUT'])
def current_model():
    """Get or set current active model"""
    try:
        if request.method == 'GET':
            model_info = model_manager.get_current_model_info()
            return jsonify(model_info)
        
        elif request.method == 'PUT':
            data = request.get_json()
            model_id = data.get('modelId')
            
            if model_manager.set_current_model(model_id):
                return jsonify({
                    'success': True,
                    'message': f'Model {model_id} set as current'
                })
            else:
                return jsonify({
                    'success': False,
                    'error': 'Failed to set current model'
                }), 400
                
    except Exception as e:
        return jsonify({
            'error': f'Current model operation failed: {str(e)}'
        }), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    print("Starting Digit Recognition ML Service...")
    print("Available models:", model_manager.get_all_models())
    
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True,
        threaded=True
    )