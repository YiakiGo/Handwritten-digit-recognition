package com.digiscrib.dto;

public class RecognitionResponse {
    private Integer predictedDigit;
    private Double confidence;
    private Long historyId;
    private String message;

    // Constructors
    public RecognitionResponse() {}
    public RecognitionResponse(Integer predictedDigit, Double confidence, Long historyId, String message) {
        this.predictedDigit = predictedDigit;
        this.confidence = confidence;
        this.historyId = historyId;
        this.message = message;
    }

    // Getters and Setters
    public Integer getPredictedDigit() { return predictedDigit; }
    public void setPredictedDigit(Integer predictedDigit) { this.predictedDigit = predictedDigit; }
    public Double getConfidence() { return confidence; }
    public void setConfidence(Double confidence) { this.confidence = confidence; }
    public Long getHistoryId() { return historyId; }
    public void setHistoryId(Long historyId) { this.historyId = historyId; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}