import os
import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import matplotlib.pyplot as plt
from datetime import datetime
import time
import json

class ModelTrainer:
    def __init__(self, models_dir='models', charts_dir='static/charts'):
        self.models_dir = models_dir
        self.charts_dir = charts_dir
        os.makedirs(self.charts_dir, exist_ok=True)
        
        # MNIST dataset parameters
        self.num_classes = 10
        self.input_shape = (28, 28, 1)
        
        # Initialize dataset
        self._load_dataset()
    
    def _load_dataset(self):
        """Load and preprocess MNIST dataset"""
        print("Loading MNIST dataset...")
        
        # Load MNIST dataset
        (x_train, y_train), (x_test, y_test) = keras.datasets.mnist.load_data()
        
        # Scale images to [0, 1] range
        x_train = x_train.astype("float32") / 255
        x_test = x_test.astype("float32") / 255
        
        # Make sure images have shape (28, 28, 1)
        x_train = np.expand_dims(x_train, -1)
        x_test = np.expand_dims(x_test, -1)
        
        # Convert class vectors to binary class matrices
        y_train = keras.utils.to_categorical(y_train, self.num_classes)
        y_test = keras.utils.to_categorical(y_test, self.num_classes)
        
        self.x_train = x_train
        self.y_train = y_train
        self.x_test = x_test
        self.y_test = y_test
        
        print(f"Training data shape: {x_train.shape}")
        print(f"Training labels shape: {y_train.shape}")
        print(f"Test data shape: {x_test.shape}")
        print(f"Test labels shape: {y_test.shape}")
    
    def _create_model(self, model_name):
        """Create a CNN model for digit recognition"""
        model = keras.Sequential([
            keras.Input(shape=self.input_shape),
            
            # First convolutional block
            layers.Conv2D(32, kernel_size=(3, 3), activation="relu"),
            layers.MaxPooling2D(pool_size=(2, 2)),
            layers.Dropout(0.25),
            
            # Second convolutional block
            layers.Conv2D(64, kernel_size=(3, 3), activation="relu"),
            layers.MaxPooling2D(pool_size=(2, 2)),
            layers.Dropout(0.25),
            
            # Classification block
            layers.Flatten(),
            layers.Dense(128, activation="relu"),
            layers.Dropout(0.5),
            layers.Dense(self.num_classes, activation="softmax")
        ])
        
        model.compile(
            loss="categorical_crossentropy",
            optimizer="adam",
            metrics=["accuracy"]
        )
        
        return model
    
    def _create_advanced_model(self, model_name):
        """Create a more advanced CNN model"""
        model = keras.Sequential([
            keras.Input(shape=self.input_shape),
            
            # First convolutional block
            layers.Conv2D(32, (3, 3), activation='relu', padding='same'),
            layers.BatchNormalization(),
            layers.Conv2D(32, (3, 3), activation='relu', padding='same'),
            layers.BatchNormalization(),
            layers.MaxPooling2D((2, 2)),
            layers.Dropout(0.25),
            
            # Second convolutional block
            layers.Conv2D(64, (3, 3), activation='relu', padding='same'),
            layers.BatchNormalization(),
            layers.Conv2D(64, (3, 3), activation='relu', padding='same'),
            layers.BatchNormalization(),
            layers.MaxPooling2D((2, 2)),
            layers.Dropout(0.25),
            
            # Third convolutional block
            layers.Conv2D(128, (3, 3), activation='relu', padding='same'),
            layers.BatchNormalization(),
            layers.Dropout(0.25),
            
            # Classification block
            layers.Flatten(),
            layers.Dense(256, activation='relu'),
            layers.BatchNormalization(),
            layers.Dropout(0.5),
            layers.Dense(128, activation='relu'),
            layers.BatchNormalization(),
            layers.Dropout(0.5),
            layers.Dense(self.num_classes, activation='softmax')
        ])
        
        model.compile(
            loss="categorical_crossentropy",
            optimizer=keras.optimizers.Adam(learning_rate=0.001),
            metrics=["accuracy"]
        )
        
        return model
    
    def _create_data_augmentation(self):
        """Create data augmentation pipeline"""
        return keras.Sequential([
            layers.RandomRotation(0.1),
            layers.RandomZoom(0.1),
            layers.RandomTranslation(0.1, 0.1),
        ])
    
    def _plot_training_history(self, history, model_id):
        """Plot training history and save charts"""
        try:
            # Accuracy chart
            plt.figure(figsize=(12, 4))
            
            plt.subplot(1, 2, 1)
            plt.plot(history.history['accuracy'], label='Training Accuracy')
            plt.plot(history.history['val_accuracy'], label='Validation Accuracy')
            plt.title('Model Accuracy')
            plt.xlabel('Epoch')
            plt.ylabel('Accuracy')
            plt.legend()
            plt.grid(True)
            
            plt.subplot(1, 2, 2)
            plt.plot(history.history['loss'], label='Training Loss')
            plt.plot(history.history['val_loss'], label='Validation Loss')
            plt.title('Model Loss')
            plt.xlabel('Epoch')
            plt.ylabel('Loss')
            plt.legend()
            plt.grid(True)
            
            plt.tight_layout()
            accuracy_chart_path = os.path.join(self.charts_dir, f'{model_id}_accuracy.png')
            plt.savefig(accuracy_chart_path, dpi=150, bbox_inches='tight')
            plt.close()
            
            # Confusion matrix (simplified - in practice, you'd compute actual confusion matrix)
            plt.figure(figsize=(8, 6))
            
            # For demonstration, show a sample of predictions
            predictions = history.model.predict(self.x_test)
            predicted_classes = np.argmax(predictions, axis=1)
            true_classes = np.argmax(self.y_test, axis=1)
            
            from sklearn.metrics import confusion_matrix
            cm = confusion_matrix(true_classes, predicted_classes)
            
            plt.imshow(cm, interpolation='nearest', cmap=plt.cm.Blues)
            plt.title('Confusion Matrix')
            plt.colorbar()
            plt.xlabel('Predicted Label')
            plt.ylabel('True Label')
            
            confusion_chart_path = os.path.join(self.charts_dir, f'{model_id}_confusion.png')
            plt.savefig(confusion_chart_path, dpi=150, bbox_inches='tight')
            plt.close()
            
            return {
                'accuracy_chart': f'{model_id}_accuracy.png',
                'confusion_matrix': f'{model_id}_confusion.png'
            }
            
        except Exception as e:
            print(f"Error creating charts: {str(e)}")
            return {}
    
    def train_model(self, model_name, epochs=10, batch_size=32, validation_split=0.2, use_data_augmentation=False):
        """Train a new model"""
        try:
            print(f"Starting model training: {model_name}")
            start_time = time.time()
            
            # Create model
            if use_data_augmentation:
                model = self._create_advanced_model(model_name)
            else:
                model = self._create_model(model_name)
            
            # Print model summary
            model.summary()
            
            # Prepare callbacks
            callbacks = [
                keras.callbacks.EarlyStopping(
                    monitor='val_loss',
                    patience=5,
                    restore_best_weights=True
                ),
                keras.callbacks.ReduceLROnPlateau(
                    monitor='val_loss',
                    factor=0.2,
                    patience=3,
                    min_lr=0.0001
                )
            ]
            
            # Prepare training data
            if use_data_augmentation:
                data_augmentation = self._create_data_augmentation()
                
                # Create augmented dataset
                train_dataset = tf.data.Dataset.from_tensor_slices((self.x_train, self.y_train))
                train_dataset = train_dataset.shuffle(1000).batch(batch_size)
                train_dataset = train_dataset.map(
                    lambda x, y: (data_augmentation(x, training=True), y),
                    num_parallel_calls=tf.data.AUTOTUNE
                )
                train_dataset = train_dataset.prefetch(tf.data.AUTOTUNE)
                
                # Train with augmented data
                history = model.fit(
                    train_dataset,
                    epochs=epochs,
                    validation_data=(self.x_test, self.y_test),
                    callbacks=callbacks,
                    verbose=1
                )
            else:
                # Train without data augmentation
                history = model.fit(
                    self.x_train, self.y_train,
                    batch_size=batch_size,
                    epochs=epochs,
                    validation_split=validation_split,
                    callbacks=callbacks,
                    verbose=1
                )
            
            # Evaluate model
            test_loss, test_accuracy = model.evaluate(self.x_test, self.y_test, verbose=0)
            print(f"Test accuracy: {test_accuracy:.4f}")
            print(f"Test loss: {test_loss:.4f}")
            
            # Generate model ID and save model
            model_id = f"{model_name}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
            model_path = os.path.join(self.models_dir, f'{model_id}.h5')
            model.save(model_path)
            print(f"Model saved to: {model_path}")
            
            # Create training charts
            charts = self._plot_training_history(history, model_id)
            
            training_time = time.time() - start_time
            
            return {
                'success': True,
                'model_id': model_id,
                'model_path': model_path,
                'final_accuracy': test_accuracy,
                'final_loss': test_loss,
                'training_time': training_time,
                'charts': charts,
                'training_history': {
                    'accuracy': history.history['accuracy'],
                    'val_accuracy': history.history['val_accuracy'],
                    'loss': history.history['loss'],
                    'val_loss': history.history['val_loss']
                }
            }
            
        except Exception as e:
            print(f"Training error: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def continue_training(self, model_path, additional_epochs=5):
        """Continue training an existing model"""
        try:
            if not os.path.exists(model_path):
                return {'success': False, 'error': 'Model file not found'}
            
            # Load existing model
            model = keras.models.load_model(model_path)
            
            # Continue training
            history = model.fit(
                self.x_train, self.y_train,
                batch_size=32,
                epochs=additional_epochs,
                validation_split=0.2,
                verbose=1
            )
            
            # Evaluate updated model
            test_loss, test_accuracy = model.evaluate(self.x_test, self.y_test, verbose=0)
            
            # Save updated model
            updated_model_path = model_path.replace('.h5', '_continued.h5')
            model.save(updated_model_path)
            
            return {
                'success': True,
                'updated_model_path': updated_model_path,
                'final_accuracy': test_accuracy,
                'final_loss': test_loss,
                'additional_epochs': additional_epochs
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }