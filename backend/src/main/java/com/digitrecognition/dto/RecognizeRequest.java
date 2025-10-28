package com.digitrecognition.dto;

public class RecognizeRequest {
    private String imageData; // Base64 encoded image data
    private Long modelId;
    
    // Constructors
    public RecognizeRequest() {}
    
    public RecognizeRequest(String imageData) {
        this.imageData = imageData;
    }
    
    // Getters and Setters
    public String getImageData() { return imageData; }
    public void setImageData(String imageData) { this.imageData = imageData; }
    
    public Long getModelId() { return modelId; }
    public void setModelId(Long modelId) { this.modelId = modelId; }
}