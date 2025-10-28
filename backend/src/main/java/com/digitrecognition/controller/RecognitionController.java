package com.digitrecognition.controller;

import com.digitrecognition.dto.RecognizeRequest;
import com.digitrecognition.service.PythonMLService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/recognition")
@CrossOrigin(origins = "*")
public class RecognitionController {
    
    @Autowired
    private PythonMLService pythonMLService;
    
    @PostMapping("/recognize")
    public ResponseEntity<?> recognizeDigit(@RequestBody RecognizeRequest recognizeRequest) {
        return pythonMLService.recognizeDigit(recognizeRequest);
    }
}