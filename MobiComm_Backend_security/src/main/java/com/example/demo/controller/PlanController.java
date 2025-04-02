package com.example.demo.controller;

import com.example.demo.model.Category;
import com.example.demo.model.Plan;
import com.example.demo.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = { "http://localhost:5500", "http://127.0.0.1:5501","http://127.0.0.1:5500" })
public class PlanController {

    @Autowired
    private CategoryService categoryService;

    
    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    @GetMapping("/categories/{id}")
    public ResponseEntity<Category> getCategoryById(@PathVariable Long id) {
        Optional<Category> category = categoryService.getCategoryById(id);
        return category.map(ResponseEntity::ok)
                      .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/categories")
    public ResponseEntity<String> addCategory(@RequestParam String name) {
        return ResponseEntity.ok(categoryService.addCategory(name));
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<String> updateCategory(@PathVariable Long id, 
                                               @RequestParam String name) {
        return ResponseEntity.ok(categoryService.editCategory(id, name));
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<String> deleteCategory(@PathVariable Long id) {
        return ResponseEntity.ok(categoryService.deleteCategory(id));
    }

   
    @GetMapping("/categories/{categoryId}/plans")
    public ResponseEntity<List<Plan>> getPlansByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(categoryService.getPlansByCategory(categoryId));
    }

    @PostMapping("/categories/{categoryId}/plans")
    public ResponseEntity<String> addPlanToCategory(@PathVariable Long categoryId, 
                                                  @RequestBody Plan plan) {
        return ResponseEntity.ok(categoryService.addPlanToCategory(categoryId, plan));
    }

    @PutMapping("/plans/{planId}")
    public ResponseEntity<String> updatePlan(@PathVariable Long planId, 
                                           @RequestBody Plan plan) {
        return ResponseEntity.ok(categoryService.editPlanInCategory(planId, plan));
    }

    @DeleteMapping("/plans/{planId}")
    public ResponseEntity<String> deletePlan(@PathVariable Long planId) {
        return ResponseEntity.ok(categoryService.deletePlanFromCategory(planId));
    }

    @GetMapping("/plans/search")
    public ResponseEntity<List<Plan>> searchPlans(@RequestParam(required = false) Integer validity,
                                                @RequestParam(required = false) String data) {
        return ResponseEntity.ok(categoryService.searchPlans(validity, data));
    }
}