package com.digitrecognition.dto;

public class TrainRequest {
    private String modelName;
    private Integer epochs;
    private Integer batchSize;
    private Double validationSplit;
    private Boolean useDataAugmentation;
    
    // Constructors
    public TrainRequest() {}
    
    public TrainRequest(String modelName, Integer epochs, Integer batchSize) {
        this.modelName = modelName;
        this.epochs = epochs;
        this.batchSize = batchSize;
        this.validationSplit = 0.2;
        this.useDataAugmentation = false;
    }
    
    // Getters and Setters
    public String getModelName() { return modelName; }
    public void setModelName(String modelName) { this.modelName = modelName; }
    
    public Integer getEpochs() { return epochs; }
    public void setEpochs(Integer epochs) { this.epochs = epochs; }
    
    public Integer getBatchSize() { return batchSize; }
    public void setBatchSize(Integer batchSize) { this.batchSize = batchSize; }
    
    public Double getValidationSplit() { return validationSplit; }
    public void setValidationSplit(Double validationSplit) { this.validationSplit = validationSplit; }
    
    public Boolean getUseDataAugmentation() { return useDataAugmentation; }
    public void setUseDataAugmentation(Boolean useDataAugmentation) { this.useDataAugmentation = useDataAugmentation; }
}