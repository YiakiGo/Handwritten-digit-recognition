import os
import json
import shutil
from datetime import datetime
import h5py
import numpy as np

class ModelManager:
    def __init__(self, models_dir='models'):
        self.models_dir = models_dir
        self.current_model_file = os.path.join(models_dir, 'current_model.h5')
        self.metadata_file = os.path.join(models_dir, 'models_metadata.json')
        self._ensure_directories()
        self._load_metadata()
    
    def _ensure_directories(self):
        """Ensure required directories exist"""
        os.makedirs(self.models_dir, exist_ok=True)
        os.makedirs(os.path.join(self.models_dir, 'archived'), exist_ok=True)
    
    def _load_metadata(self):
        """Load models metadata from JSON file"""
        if os.path.exists(self.metadata_file):
            with open(self.metadata_file, 'r') as f:
                self.metadata = json.load(f)
        else:
            self.metadata = {
                'models': {},
                'current_model': None,
                'next_model_id': 1
            }
            self._save_metadata()
    
    def _save_metadata(self):
        """Save models metadata to JSON file"""
        with open(self.metadata_file, 'w') as f:
            json.dump(self.metadata, f, indent=2)
    
    def _generate_model_id(self):
        """Generate a new model ID"""
        model_id = f"model_{self.metadata['next_model_id']}"
        self.metadata['next_model_id'] += 1
        return model_id
    
    def get_current_model_info(self):
        """Get information about the current model"""
        if not self.metadata['current_model']:
            return None
        
        current_model_id = self.metadata['current_model']
        return self.metadata['models'].get(current_model_id, None)
    
    def get_model_info(self, model_id):
        """Get information about a specific model"""
        return self.metadata['models'].get(model_id, None)
    
    def get_all_models(self):
        """Get list of all models"""
        return list(self.metadata['models'].values())
    
    def update_current_model(self, model_name, model_path, accuracy, loss, epochs, batch_size):
        """Update the current model with new training results"""
        model_id = self._generate_model_id()
        
        model_info = {
            'id': model_id,
            'modelName': model_name,
            'modelPath': model_path,
            'accuracy': float(accuracy),
            'loss': float(loss),
            'epochs': int(epochs),
            'batchSize': int(batch_size),
            'createdAt': datetime.now().isoformat(),
            'isActive': True
        }
        
        # Archive previous current model if it exists
        if self.metadata['current_model']:
            old_model_id = self.metadata['current_model']
            if old_model_id in self.metadata['models']:
                self.metadata['models'][old_model_id]['isActive'] = False
                
                # Move old model to archived directory
                old_model_path = self.metadata['models'][old_model_id]['modelPath']
                if os.path.exists(old_model_path):
                    archived_path = os.path.join(
                        self.models_dir, 
                        'archived', 
                        f"{old_model_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.h5"
                    )
                    shutil.move(old_model_path, archived_path)
                    self.metadata['models'][old_model_id]['modelPath'] = archived_path
        
        # Update current model
        self.metadata['models'][model_id] = model_info
        self.metadata['current_model'] = model_id
        
        # Copy the new model to current_model.h5
        if os.path.exists(model_path) and model_path != self.current_model_file:
            shutil.copy2(model_path, self.current_model_file)
            model_info['modelPath'] = self.current_model_file
        
        self._save_metadata()
        return model_id
    
    def set_current_model(self, model_id):
        """Set a specific model as current"""
        if model_id not in self.metadata['models']:
            return False
        
        # Deactivate all models
        for mid, model_info in self.metadata['models'].items():
            model_info['isActive'] = False
        
        # Activate the selected model
        self.metadata['models'][model_id]['isActive'] = True
        self.metadata['current_model'] = model_id
        
        # Update current_model.h5 file
        model_path = self.metadata['models'][model_id]['modelPath']
        if os.path.exists(model_path) and model_path != self.current_model_file:
            shutil.copy2(model_path, self.current_model_file)
            self.metadata['models'][model_id]['modelPath'] = self.current_model_file
        
        self._save_metadata()
        return True
    
    def get_current_model_path(self):
        """Get the path to the current model file"""
        return self.current_model_file
    
    def delete_model(self, model_id):
        """Delete a model"""
        if model_id not in self.metadata['models']:
            return False
        
        # Don't allow deletion of current model
        if self.metadata['current_model'] == model_id:
            return False
        
        # Remove model file
        model_path = self.metadata['models'][model_id]['modelPath']
        if os.path.exists(model_path) and model_path != self.current_model_file:
            os.remove(model_path)
        
        # Remove from metadata
        del self.metadata['models'][model_id]
        
        self._save_metadata()
        return True
    
    def get_model_architecture(self, model_path):
        """Get information about model architecture"""
        try:
            with h5py.File(model_path, 'r') as f:
                # Try to get model configuration
                if 'model_config' in f.attrs:
                    model_config = json.loads(f.attrs['model_config'])
                    return {
                        'layers': len(model_config['config']['layers']),
                        'trainable_params': self._count_trainable_params(model_config)
                    }
        except:
            pass
        
        return {'layers': 'Unknown', 'trainable_params': 'Unknown'}
    
    def _count_trainable_params(self, model_config):
        """Count trainable parameters from model configuration"""
        try:
            total_params = 0
            for layer in model_config['config']['layers']:
                if 'config' in layer and 'trainable' in layer['config']:
                    if layer['config']['trainable']:
                        # Simple estimation - in practice, you'd want more detailed calculation
                        if 'units' in layer['config']:
                            total_params += layer['config']['units']
            return total_params
        except:
            return 'Unknown'