package com.digitrecognition.service;

import com.digitrecognition.entity.Model;
import com.digitrecognition.repository.ModelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ModelService {
    
    @Autowired
    private ModelRepository modelRepository;
    
    public List<Model> getAllModels() {
        return modelRepository.findAll();
    }
    
    public Optional<Model> getModelById(Long id) {
        return modelRepository.findById(id);
    }
    
    public Model saveModel(Model model) {
        return modelRepository.save(model);
    }
    
    public void deleteModel(Long id) {
        modelRepository.deleteById(id);
    }
    
    public Optional<Model> getActiveModel() {
        return modelRepository.findByIsActiveTrue();
    }
    
    public Model setActiveModel(Long id) {
        // Deactivate all models first
        List<Model> allModels = modelRepository.findAll();
        for (Model model : allModels) {
            model.setIsActive(false);
            modelRepository.save(model);
        }
        
        // Activate the selected model
        Optional<Model> modelToActivate = modelRepository.findById(id);
        if (modelToActivate.isPresent()) {
            Model model = modelToActivate.get();
            model.setIsActive(true);
            return modelRepository.save(model);
        }
        return null;
    }
    
    public Model updateModelMetrics(Long id, Double accuracy, Double loss) {
        Optional<Model> modelOpt = modelRepository.findById(id);
        if (modelOpt.isPresent()) {
            Model model = modelOpt.get();
            model.setAccuracy(accuracy);
            model.setLoss(loss);
            return modelRepository.save(model);
        }
        return null;
    }
}