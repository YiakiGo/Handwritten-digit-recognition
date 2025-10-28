package com.digitrecognition.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class PythonConfig {
    
    @Value("${python.ml.service.url:http://localhost:5000}")
    private String mlServiceUrl;
    
    @Value("${python.ml.service.timeout:30000}")
    private int timeout;
    
    public String getMlServiceUrl() {
        return mlServiceUrl;
    }
    
    public int getTimeout() {
        return timeout;
    }
}