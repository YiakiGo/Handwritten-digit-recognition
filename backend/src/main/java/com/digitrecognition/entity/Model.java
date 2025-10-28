package com.digitrecognition.entity;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "models")
public class Model {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "model_name", nullable = false)
    private String modelName;
    
    @Column(name = "model_path", nullable = false)
    private String modelPath;
    
    @Column(name = "accuracy")
    private Double accuracy;
    
    @Column(name = "loss")
    private Double loss;
    
    @Column(name = "epochs")
    private Integer epochs;
    
    @Column(name = "batch_size")
    private Integer batchSize;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "is_active")
    private Boolean isActive;
    
    // Constructors
    public Model() {
        this.createdAt = LocalDateTime.now();
        this.isActive = false;
    }
    
    public Model(String modelName, String modelPath) {
        this();
        this.modelName = modelName;
        this.modelPath = modelPath;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getModelName() { return modelName; }
    public void setModelName(String modelName) { this.modelName = modelName; }
    
    public String getModelPath() { return modelPath; }
    public void setModelPath(String modelPath) { this.modelPath = modelPath; }
    
    public Double getAccuracy() { return accuracy; }
    public void setAccuracy(Double accuracy) { this.accuracy = accuracy; }
    
    public Double getLoss() { return loss; }
    public void setLoss(Double loss) { this.loss = loss; }
    
    public Integer getEpochs() { return epochs; }
    public void setEpochs(Integer epochs) { this.epochs = epochs; }
    
    public Integer getBatchSize() { return batchSize; }
    public void setBatchSize(Integer batchSize) { this.batchSize = batchSize; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
}