package com.digitrecognition.service;

import com.digitrecognition.entity.TrainingRecord;
import com.digitrecognition.repository.TrainingRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TrainingService {
    
    @Autowired
    private TrainingRecordRepository trainingRecordRepository;
    
    public List<TrainingRecord> getTrainingHistory(Long modelId) {
        return trainingRecordRepository.findByModelIdOrderByEpochAsc(modelId);
    }
    
    public TrainingRecord saveTrainingRecord(TrainingRecord record) {
        return trainingRecordRepository.save(record);
    }
    
    public void deleteTrainingHistory(Long modelId) {
        List<TrainingRecord> records = trainingRecordRepository.findByModelIdOrderByEpochAsc(modelId);
        trainingRecordRepository.deleteAll(records);
    }
    
    public List<TrainingRecord> getLatestTrainingRecords(Long modelId, Integer limit) {
        return trainingRecordRepository.findTopByModelIdOrderByEpochDesc(modelId, limit);
    }
}