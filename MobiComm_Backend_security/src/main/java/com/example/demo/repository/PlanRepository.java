package com.example.demo.repository;

import com.example.demo.model.Category;
import com.example.demo.model.Plan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlanRepository extends JpaRepository<Plan, Long> {
    List<Plan> findByValidityDaysOrDataPerDay(Integer validityDays, String dataPerDay);
    List<Plan> findByCategory(Category category);
}