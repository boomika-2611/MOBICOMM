package com.example.demo.service;

import com.example.demo.model.Category;
import com.example.demo.model.Plan;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.repository.PlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class PlanService {

    @Autowired
    private PlanRepository planRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public List<Plan> getAllPlans() {
        return planRepository.findAll();
    }

    public Optional<Plan> getPlanById(Long id) {
        return planRepository.findById(id);
    }

    public List<Plan> searchPlans(String categoryName, Integer validity, String data) {
        List<Plan> plans;

    
        if (categoryName != null && !categoryName.isEmpty()) {
            Optional<Category> category = Optional.ofNullable(categoryRepository.findByName(categoryName));
            plans = category.map(planRepository::findByCategory)
                           .orElseGet(ArrayList::new);
        } else {
            plans = planRepository.findAll();
        }

     
        if (validity != null || (data != null && !data.isEmpty())) {
            plans = plans.stream()
                         .filter(plan -> (validity == null || plan.getValidityDays() == validity) && // Changed to direct comparison
                                        (data == null || data.isEmpty() || (plan.getDataPerDay() != null && plan.getDataPerDay().equalsIgnoreCase(data))))
                         .toList();
        }

        return plans;
    }
}