package com.digitrecognition.controller;

import com.digitrecognition.entity.Model;
import com.digitrecognition.service.ModelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/models")
@CrossOrigin(origins = "*")
public class ModelController {
    
    @Autowired
    private ModelService modelService;
    
    @GetMapping
    public List<Model> getAllModels() {
        return modelService.getAllModels();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Model> getModelById(@PathVariable Long id) {
        Optional<Model> model = modelService.getModelById(id);
        return model.map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public Model createModel(@RequestBody Model model) {
        return modelService.saveModel(model);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Model> updateModel(@PathVariable Long id, @RequestBody Model modelDetails) {
        Optional<Model> modelOpt = modelService.getModelById(id);
        if (modelOpt.isPresent()) {
            Model model = modelOpt.get();
            model.setModelName(modelDetails.getModelName());
            model.setAccuracy(modelDetails.getAccuracy());
            model.setLoss(modelDetails.getLoss());
            model.setEpochs(modelDetails.getEpochs());
            model.setBatchSize(modelDetails.getBatchSize());
            return ResponseEntity.ok(modelService.saveModel(model));
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteModel(@PathVariable Long id) {
        modelService.deleteModel(id);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/active")
    public ResponseEntity<Model> getActiveModel() {
        Optional<Model> activeModel = modelService.getActiveModel();
        return activeModel.map(ResponseEntity::ok)
                         .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/{id}/activate")
    public ResponseEntity<Model> activateModel(@PathVariable Long id) {
        Model activatedModel = modelService.setActiveModel(id);
        if (activatedModel != null) {
            return ResponseEntity.ok(activatedModel);
        }
        return ResponseEntity.notFound().build();
    }
}