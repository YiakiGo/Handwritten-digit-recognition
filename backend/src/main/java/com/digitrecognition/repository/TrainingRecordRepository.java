package com.digitrecognition.repository;

import com.digitrecognition.entity.TrainingRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrainingRecordRepository extends JpaRepository<TrainingRecord, Long> {
    List<TrainingRecord> findByModelIdOrderByEpochAsc(Long modelId);
    
    @Query("SELECT tr FROM TrainingRecord tr WHERE tr.modelId = :modelId ORDER BY tr.epoch DESC")
    List<TrainingRecord> findTopByModelIdOrderByEpochDesc(@Param("modelId") Long modelId, 
                                                         @Param("limit") Integer limit);
}