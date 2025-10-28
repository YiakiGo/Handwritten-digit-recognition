import numpy as np
import tensorflow as tf
from tensorflow import keras
import cv2
import base64
from PIL import Image
import io
import os

class DigitRecognizer:
    def __init__(self, models_dir='models'):
        self.models_dir = models_dir
        self.current_model = None
        self.current_model_path = None
        
    def load_model(self, model_path=None):
        """Load a trained model"""
        try:
            if model_path is None:
                model_path = os.path.join(self.models_dir, 'current_model.h5')
            
            if not os.path.exists(model_path):
                return False, "Model file not found"
            
            self.current_model = keras.models.load_model(model_path)
            self.current_model_path = model_path
            print(f"Model loaded from: {model_path}")
            return True, "Model loaded successfully"
            
        except Exception as e:
            return False, f"Error loading model: {str(e)}"
    
    def preprocess_image(self, image_data):
        """Preprocess image for digit recognition"""
        try:
            # Remove data URL prefix if present
            if ',' in image_data:
                image_data = image_data.split(',')[1]
            
            # Decode base64 image
            image_bytes = base64.b64decode(image_data)
            image = Image.open(io.BytesIO(image_bytes)).convert('L')  # Convert to grayscale
            
            # Convert to numpy array
            image_array = np.array(image)
            
            # Invert colors if background is white (MNIST has white digits on black background)
            if np.mean(image_array) > 127:
                image_array = 255 - image_array
            
            # Resize to 28x28 (MNIST format)
            image_resized = cv2.resize(image_array, (28, 28), interpolation=cv2.INTER_AREA)
            
            # Normalize to [0, 1] range
            image_normalized = image_resized.astype('float32') / 255.0
            
            # Add batch and channel dimensions
            image_processed = np.expand_dims(image_normalized, axis=0)  # Add batch dimension
            image_processed = np.expand_dims(image_processed, axis=-1)  # Add channel dimension
            
            return True, image_processed
            
        except Exception as e:
            return False, f"Error preprocessing image: {str(e)}"
    
    def recognize_digit(self, image_data, model_id=None):
        """Recognize digit from image data"""
        try:
            # Load model if not loaded or if different model requested
            model_path = None
            if model_id:
                model_path = os.path.join(self.models_dir, f'{model_id}.h5')
            
            success, message = self.load_model(model_path)
            if not success:
                return {
                    'success': False,
                    'error': message
                }
            
            # Preprocess image
            success, processed_image = self.preprocess_image(image_data)
            if not success:
                return {
                    'success': False,
                    'error': processed_image  # In this case, processed_image contains the error message
                }
            
            # Make prediction
            predictions = self.current_model.predict(processed_image, verbose=0)
            predicted_digit = np.argmax(predictions[0])
            confidence = np.max(predictions[0])
            
            # Get probabilities for all digits
            probabilities = {
                str(i): float(predictions[0][i]) for i in range(10)
            }
            
            return {
                'success': True,
                'predicted_digit': int(predicted_digit),
                'confidence': float(confidence),
                'probabilities': probabilities,
                'processed_image_shape': processed_image.shape
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': f'Recognition error: {str(e)}'
            }
    
    def batch_recognize(self, image_data_list):
        """Recognize digits from multiple images"""
        try:
            results = []
            for image_data in image_data_list:
                result = self.recognize_digit(image_data)
                results.append(result)
            return results
        except Exception as e:
            return {
                'success': False,
                'error': f'Batch recognition error: {str(e)}'
            }
    
    def get_model_info(self):
        """Get information about the currently loaded model"""
        if self.current_model is None:
            return None
        
        try:
            model_config = self.current_model.get_config()
            return {
                'layers': len(model_config['layers']),
                'input_shape': model_config['layers'][0]['config']['batch_input_shape'],
                'output_shape': model_config['layers'][-1]['config']['units'],
                'trainable_params': self.current_model.count_params(),
                'model_path': self.current_model_path
            }
        except:
            return {
                'model_path': self.current_model_path,
                'loaded': True
            }