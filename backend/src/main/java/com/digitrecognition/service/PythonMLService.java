package com.digitrecognition.service;

import com.digitrecognition.config.PythonConfig;
import com.digitrecognition.dto.TrainRequest;
import com.digitrecognition.dto.RecognizeRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.ResourceAccessException;

import java.util.HashMap;
import java.util.Map;

@Service
public class PythonMLService {
    
    @Autowired
    private PythonConfig pythonConfig;
    
    @Autowired
    private RestTemplate restTemplate;
    
    public ResponseEntity<?> trainModel(TrainRequest trainRequest) {
        String url = pythonConfig.getMlServiceUrl() + "/train";
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        HttpEntity<TrainRequest> request = new HttpEntity<>(trainRequest, headers);
        
        try {
            return restTemplate.postForEntity(url, request, String.class);
        } catch (HttpClientErrorException e) {
            return ResponseEntity.status(e.getStatusCode()).body(e.getResponseBodyAsString());
        } catch (ResourceAccessException e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body("ML service is not available: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error communicating with ML service: " + e.getMessage());
        }
    }
    
    public ResponseEntity<?> recognizeDigit(RecognizeRequest recognizeRequest) {
        String url = pythonConfig.getMlServiceUrl() + "/recognize";
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        HttpEntity<RecognizeRequest> request = new HttpEntity<>(recognizeRequest, headers);
        
        try {
            return restTemplate.postForEntity(url, request, String.class);
        } catch (HttpClientErrorException e) {
            return ResponseEntity.status(e.getStatusCode()).body(e.getResponseBodyAsString());
        } catch (ResourceAccessException e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body("ML service is not available: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error communicating with ML service: " + e.getMessage());
        }
    }
    
    public ResponseEntity<?> getModelStatus() {
        String url = pythonConfig.getMlServiceUrl() + "/status";
        
        try {
            return restTemplate.getForEntity(url, String.class);
        } catch (HttpClientErrorException e) {
            return ResponseEntity.status(e.getStatusCode()).body(e.getResponseBodyAsString());
        } catch (ResourceAccessException e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body("ML service is not available: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error communicating with ML service: " + e.getMessage());
        }
    }
    
    public ResponseEntity<?> getAvailableModels() {
        String url = pythonConfig.getMlServiceUrl() + "/models";
        
        try {
            return restTemplate.getForEntity(url, String.class);
        } catch (HttpClientErrorException e) {
            return ResponseEntity.status(e.getStatusCode()).body(e.getResponseBodyAsString());
        } catch (ResourceAccessException e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body("ML service is not available: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error communicating with ML service: " + e.getMessage());
        }
    }
}