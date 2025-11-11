package com.digiscrib.service;

import com.digiscrib.entity.SystemLog;
import com.digiscrib.entity.User;
import com.digiscrib.repository.SystemLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminService {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private RecognitionHistoryService recognitionHistoryService;
    
    @Autowired
    private SystemLogRepository systemLogRepository;
    
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("totalUsers", userService.getUserCount());
        stats.put("totalAdmins", userService.getAdminCount());
        stats.put("totalRecognitions", recognitionHistoryService.getTotalRecognitions());
        stats.put("recognitionsToday", recognitionHistoryService.getRecognitionsToday());
        stats.put("accuracyRate", recognitionHistoryService.getAccuracy());
        stats.put("serverTime", LocalDateTime.now().toString());
        
        return stats;
    }
    
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }
    
    public List<SystemLog> getSystemLogs() {
        return systemLogRepository.findByTimestampBetweenOrderByTimestampDesc(
            LocalDateTime.now().minusDays(7), LocalDateTime.now());
    }
    
    public Map<String, Object> getAnalytics() {
        Map<String, Object> analytics = new HashMap<>();
        
        analytics.put("userGrowth", getUserGrowthData());
        analytics.put("recognitionStats", getRecognitionStats());
        analytics.put("systemHealth", getSystemHealth());
        
        return analytics;
    }
    
    private Map<String, Object> getUserGrowthData() {
        Map<String, Object> growth = new HashMap<>();
        growth.put("lastWeek", 15);
        growth.put("lastMonth", 45);
        growth.put("total", userService.getUserCount());
        return growth;
    }
    
    private Map<String, Object> getRecognitionStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("total", recognitionHistoryService.getTotalRecognitions());
        stats.put("today", recognitionHistoryService.getRecognitionsToday());
        stats.put("accuracy", recognitionHistoryService.getAccuracy());
        return stats;
    }
    
    private Map<String, Object> getSystemHealth() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "Healthy");
        health.put("uptime", "99.8%");
        health.put("lastIncident", "None");
        health.put("activeUsers", 5);
        return health;
    }
    
    public void logSystemEvent(String level, String message, String source, String username) {
        SystemLog log = new SystemLog(level, message, source);
        log.setUsername(username);
        systemLogRepository.save(log);
    }
}