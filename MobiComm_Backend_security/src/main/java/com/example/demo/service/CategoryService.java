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
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private PlanRepository planRepository;

    // Category CRUD operations
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Optional<Category> getCategoryById(Long id) {
        return categoryRepository.findById(id);
    }

    public String addCategory(String categoryName) {
        if (categoryRepository.existsByName(categoryName)) {
            return "Category already exists!";
        }
        Category category = new Category();
        category.setName(categoryName);
        categoryRepository.save(category);
        return "Category added successfully!";
    }

    public String editCategory(Long id, String newName) {
        Optional<Category> existingCategory = categoryRepository.findById(id);
        if (existingCategory.isPresent()) {
            if (categoryRepository.existsByName(newName) && 
                !existingCategory.get().getName().equals(newName)) {
                return "Category name already exists!";
            }
            Category category = existingCategory.get();
            category.setName(newName);
            categoryRepository.save(category);
            return "Category updated successfully!";
        }
        return "Category not found!";
    }

    public String deleteCategory(Long id) {
        if (categoryRepository.existsById(id)) {
            categoryRepository.deleteById(id);
            return "Category and associated plans deleted successfully!";
        }
        return "Category not found!";
    }

    // Plan operations within a category
    public String addPlanToCategory(Long categoryId, Plan plan) {
        Optional<Category> categoryOpt = categoryRepository.findById(categoryId);
        if (categoryOpt.isPresent()) {
            Category category = categoryOpt.get();
            plan.setCategory(category);
            planRepository.save(plan);
            return "Plan added to category successfully!";
        }
        return "Category not found!";
    }

    public String editPlanInCategory(Long planId, Plan updatedPlan) {
        Optional<Plan> existingPlan = planRepository.findById(planId);
        if (existingPlan.isPresent()) {
            Plan plan = existingPlan.get();
            plan.setName(updatedPlan.getName());
            plan.setPrice(updatedPlan.getPrice());
            plan.setValidityDays(updatedPlan.getValidityDays());
            plan.setDataPerDay(updatedPlan.getDataPerDay());
            // Category can be changed if needed
            if (updatedPlan.getCategory() != null && 
                updatedPlan.getCategory().getId() != null) {
                Optional<Category> newCategory = 
                    categoryRepository.findById(updatedPlan.getCategory().getId());
                newCategory.ifPresent(plan::setCategory);
            }
            planRepository.save(plan);
            return "Plan updated successfully!";
        }
        return "Plan not found!";
    }

    public String deletePlanFromCategory(Long planId) {
        if (planRepository.existsById(planId)) {
            planRepository.deleteById(planId);
            return "Plan deleted successfully!";
        }
        return "Plan not found!";
    }

    public List<Plan> getPlansByCategory(Long categoryId) {
        Optional<Category> category = categoryRepository.findById(categoryId);
        return category.map(planRepository::findByCategory)
                      .orElseGet(ArrayList::new);
    }

    public List<Plan> searchPlans(Integer validity, String data) {
        return planRepository.findByValidityDaysOrDataPerDay(validity, data);
    }
}