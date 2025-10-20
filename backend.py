from flask import Flask, request, jsonify
import numpy as np
import tensorflow as tf
from tensorflow import keras
import base64
import io
from PIL import Image
import os

app = Flask(__name__)

print("🚀 Initializing MNIST Digit Recognition API...")

# Load or create MNIST model
def load_model():
    try:
        # Try to load existing model
        model = keras.models.load_model('mnist_cnn_model.h5')
        print("✅ Pre-trained model loaded successfully")
        return model
    except:
        print("⚠️  No pre-trained model found. Creating a new model...")
        # Create and train a simple CNN model
        (x_train, y_train), (x_test, y_test) = keras.datasets.mnist.load_data()
        
        # Preprocess the data
        x_train = x_train.reshape(-1, 28, 28, 1).astype('float32') / 255.0
        x_test = x_test.reshape(-1, 28, 28, 1).astype('float32') / 255.0
        
        # Create model
        model = keras.Sequential([
            keras.layers.Conv2D(32, (3, 3), activation='relu', input_shape=(28, 28, 1)),
            keras.layers.MaxPooling2D((2, 2)),
            keras.layers.Conv2D(64, (3, 3), activation='relu'),
            keras.layers.MaxPooling2D((2, 2)),
            keras.layers.Flatten(),
            keras.layers.Dense(128, activation='relu'),
            keras.layers.Dropout(0.5),
            keras.layers.Dense(10, activation='softmax')
        ])
        
        model.compile(optimizer='adam',
                     loss='sparse_categorical_crossentropy',
                     metrics=['accuracy'])
        
        # Train quickly for demo purposes
        print("📚 Training model on MNIST data...")
        model.fit(x_train, y_train, epochs=1, batch_size=128, validation_split=0.1, verbose=1)
        
        # Save the model
        model.save('mnist_cnn_model.h5')
        print("✅ Model trained and saved successfully")
        return model

# Load the model
model = load_model()

@app.route('/')
def home():
    return jsonify({
        "message": "MNIST Digit Recognition API",
        "status": "running",
        "endpoints": {
            "GET /": "API information",
            "GET /health": "Health check",
            "POST /predict": "Recognize digit from image",
            "GET /test": "Test connection"
        },
        "usage": "Send POST request to /predict with {'image': 'base64_image_data'}"
    })

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy", 
        "model_loaded": True,
        "message": "MNIST Digit Recognition API is running"
    })

@app.route('/test', methods=['GET'])
def test_endpoint():
    return jsonify({
        "success": True,
        "message": "✅ Flask API is working! Java app can connect successfully.",
        "endpoints": {
            "/predict": "POST - Send base64 image for digit recognition",
            "/health": "GET - API health status"
        }
    })

@app.route('/predict', methods=['POST'])
def predict_digit():
    """Main endpoint for digit recognition - matches Java app expectation"""
    try:
        # Get JSON data from request
        data = request.get_json()
        
        if not data:
            return jsonify({
                "status": "error",
                "error": "No JSON data received"
            }), 400
            
        if 'image' not in data:
            return jsonify({
                "status": "error", 
                "error": "No 'image' field in request"
            }), 400
        
        # Extract base64 image data
        image_data = data['image']
        print("📸 Received image data, length:", len(image_data))
        
        # Remove data URL prefix if present
        if image_data.startswith('data:image'):
            image_data = image_data.split(',')[1]
            print("🔧 Removed data URL prefix")
        
        # Decode base64 image
        try:
            image_bytes = base64.b64decode(image_data)
            image = Image.open(io.BytesIO(image_bytes))
            print("✅ Image decoded successfully")
        except Exception as e:
            return jsonify({
                "status": "error",
                "error": f"Failed to decode image: {str(e)}"
            }), 400
        
        # Convert to grayscale
        image = image.convert('L')
        print("🎨 Converted to grayscale")
        
        # Resize to 28x28 (MNIST format)
        image = image.resize((28, 28))
        print("📐 Resized to 28x28")
        
        # Convert to numpy array and normalize
        image_array = np.array(image)
        image_array = image_array.astype('float32') / 255.0
        
        # Invert colors if needed (MNIST has white digits on black background)
        if np.mean(image_array) > 0.5:  # If image is mostly white
            image_array = 1.0 - image_array
            print("🔄 Inverted colors for MNIST compatibility")
        
        # Reshape for model (add batch and channel dimensions)
        image_array = image_array.reshape(1, 28, 28, 1)
        
        # Make prediction
        print("🧠 Making prediction...")
        predictions = model.predict(image_array, verbose=0)
        predicted_digit = int(np.argmax(predictions[0]))
        confidence = float(np.max(predictions[0]))
        
        print(f"✅ Prediction: {predicted_digit} with {confidence*100:.2f}% confidence")
        
        # Get top 3 predictions
        top_3_indices = np.argsort(predictions[0])[-3:][::-1]
        top_3_predictions = [
            {
                "digit": int(idx), 
                "confidence": float(predictions[0][idx]),
                "percentage": f"{predictions[0][idx]*100:.1f}%"
            } 
            for idx in top_3_indices
        ]
        
        response = {
            "status": "success",
            "predicted_digit": predicted_digit,
            "confidence": f"{confidence * 100:.2f}%",
            "raw_confidence": confidence,
            "all_predictions": top_3_predictions,
            "message": f"Predicted digit: {predicted_digit} with {confidence*100:.1f}% confidence"
        }
        
        print("📤 Sending response:", response)
        return jsonify(response)
        
    except Exception as e:
        print("❌ Error:", str(e))
        return jsonify({
            "status": "error", 
            "error": str(e)
        }), 500

@app.route('/api/recognize', methods=['POST'])
def api_recognize():
    """Alternative endpoint for broader compatibility"""
    try:
        data = request.get_json()
        
        if not data or 'image' not in data:
            return jsonify({
                "success": False,
                "error": "No image data provided"
            }), 400
        
        image_data = data['image']
        
        # Remove data URL prefix if present
        if image_data.startswith('data:image'):
            image_data = image_data.split(',')[1]
        
        # Decode and process image
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes))
        image = image.convert('L').resize((28, 28))
        
        image_array = np.array(image).astype('float32') / 255.0
        
        # Invert if needed
        if np.mean(image_array) > 0.5:
            image_array = 1.0 - image_array
        
        image_array = image_array.reshape(1, 28, 28, 1)
        
        # Make prediction
        predictions = model.predict(image_array, verbose=0)
        predicted_digit = int(np.argmax(predictions[0]))
        confidence = float(np.max(predictions[0]))
        
        return jsonify({
            "success": True,
            "text": str(predicted_digit),
            "confidence": f"{(confidence * 100):.2f}%",
            "message": f"AI predicts this is digit {predicted_digit} with {confidence*100:.1f}% confidence",
            "predicted_digit": predicted_digit,
            "raw_confidence": confidence
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

if __name__ == '__main__':
    print("\n" + "="*50)
    print("🚀 MNIST Digit Recognition API Starting...")
    print("📍 Server URL: http://localhost:5000")
    print("🧠 Model: Convolutional Neural Network")
    print("📚 Available Endpoints:")
    print("   GET  /              - API information")
    print("   GET  /health        - Health check")
    print("   GET  /test          - Test connection")
    print("   POST /predict       - Recognize digit (main endpoint)")
    print("   POST /api/recognize - Alternative endpoint")
    print("="*50)
    print("\n⚡ Ready to accept requests from Java app!")
    print("   Make sure your Java app uses: http://localhost:5000/predict")
    print("\n")
    
    app.run(debug=True, host='0.0.0.0', port=5000)