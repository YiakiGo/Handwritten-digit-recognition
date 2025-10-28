package com.digitrecognition.controller;

import com.digitrecognition.dto.TrainRequest;
import com.digitrecognition.entity.TrainingRecord;
import com.digitrecognition.service.PythonMLService;
import com.digitrecognition.service.TrainingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/training")
@CrossOrigin(origins = "*")
public class TrainingController {
    
    @Autowired
    private PythonMLService pythonMLService;
    
    @Autowired
    private TrainingService trainingService;
    
    @PostMapping("/train")
    public ResponseEntity<?> trainModel(@RequestBody TrainRequest trainRequest) {
        return pythonMLService.trainModel(trainRequest);
    }
    
    @GetMapping("/history/{modelId}")
    public List<TrainingRecord> getTrainingHistory(@PathVariable Long modelId) {
        return trainingService.getTrainingHistory(modelId);
    }
    
    @PostMapping("/record")
    public TrainingRecord saveTrainingRecord(@RequestBody TrainingRecord record) {
        return trainingService.saveTrainingRecord(record);
    }
    
    @DeleteMapping("/history/{modelId}")
    public ResponseEntity<Void> deleteTrainingHistory(@PathVariable Long modelId) {
        trainingService.deleteTrainingHistory(modelId);
        return ResponseEntity.ok().build();
    }
}