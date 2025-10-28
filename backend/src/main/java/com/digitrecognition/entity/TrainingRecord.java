package com.digitrecognition.entity;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "training_records")
public class TrainingRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "model_id")
    private Long modelId;
    
    @Column(name = "epoch")
    private Integer epoch;
    
    @Column(name = "accuracy")
    private Double accuracy;
    
    @Column(name = "loss")
    private Double loss;
    
    @Column(name = "val_accuracy")
    private Double valAccuracy;
    
    @Column(name = "val_loss")
    private Double valLoss;
    
    @Column(name = "training_time")
    private Long trainingTime; // in seconds
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    // Constructors
    public TrainingRecord() {
        this.createdAt = LocalDateTime.now();
    }
    
    public TrainingRecord(Long modelId, Integer epoch) {
        this();
        this.modelId = modelId;
        this.epoch = epoch;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getModelId() { return modelId; }
    public void setModelId(Long modelId) { this.modelId = modelId; }
    
    public Integer getEpoch() { return epoch; }
    public void setEpoch(Integer epoch) { this.epoch = epoch; }
    
    public Double getAccuracy() { return accuracy; }
    public void setAccuracy(Double accuracy) { this.accuracy = accuracy; }
    
    public Double getLoss() { return loss; }
    public void setLoss(Double loss) { this.loss = loss; }
    
    public Double getValAccuracy() { return valAccuracy; }
    public void setValAccuracy(Double valAccuracy) { this.valAccuracy = valAccuracy; }
    
    public Double getValLoss() { return valLoss; }
    public void setValLoss(Double valLoss) { this.valLoss = valLoss; }
    
    public Long getTrainingTime() { return trainingTime; }
    public void setTrainingTime(Long trainingTime) { this.trainingTime = trainingTime; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}