package com.ecommerce.controller;

import com.ecommerce.model.ApiResponse;
import com.ecommerce.model.Product;
import com.ecommerce.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/product")
@CrossOrigin(origins = "http://localhost:4200")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<?>> addProduct(@RequestBody Product product) {
        if (product.getProductName() == null || product.getProductName().trim().isEmpty())
            return ResponseEntity.badRequest().body(ApiResponse.error("Invalid product name"));
        if (!productService.isNameUnique(product.getProductName()))
            return ResponseEntity.badRequest().body(ApiResponse.error("Product Name must be unique"));
        if (product.getProductPrice() == null || product.getProductPrice() <= 0)
            return ResponseEntity.badRequest().body(ApiResponse.error("Invalid Price"));
        if (product.getProductCategory() == null || product.getProductCategory().trim().isEmpty())
            return ResponseEntity.badRequest().body(ApiResponse.error("Invalid Category"));
        if (product.getProductDescription() == null || product.getProductDescription().trim().isEmpty())
            return ResponseEntity.badRequest().body(ApiResponse.error("Invalid description"));
        if (product.getQuantityAvailable() == null || product.getQuantityAvailable() < 0)
            return ResponseEntity.badRequest().body(ApiResponse.error("Invalid count"));

        Product saved = productService.addProduct(product);
        return ResponseEntity.ok(ApiResponse.success("Product Added Successfully", saved));
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<Product>>> getAllActive() {
        return ResponseEntity.ok(ApiResponse.success("Products retrieved", productService.getAllActive()));
    }

    @GetMapping("/admin/all")
    public ResponseEntity<ApiResponse<List<Product>>> getAllAdmin() {
        return ResponseEntity.ok(ApiResponse.success("All products retrieved", productService.getAll()));
    }

    @GetMapping("/{productId}")
    public ResponseEntity<ApiResponse<?>> getById(@PathVariable Integer productId) {
        Optional<Product> p = productService.findById(productId);
        if (p.isPresent()) return ResponseEntity.ok(ApiResponse.success("Product found", p.get()));
        return ResponseEntity.badRequest().body(ApiResponse.error("Product ID not found"));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<?>> search(@RequestParam(required = false) Integer productId,
                                                  @RequestParam(required = false) String productName) {
        if (productId != null) {
            Optional<Product> p = productService.findById(productId);
            if (p.isPresent()) return ResponseEntity.ok(ApiResponse.success("Product found", p.get()));
            return ResponseEntity.badRequest().body(ApiResponse.error("Product ID not found"));
        }
        if (productName != null && !productName.isEmpty()) {
            List<Product> results = productService.searchByName(productName);
            if (results.isEmpty())
                return ResponseEntity.badRequest().body(ApiResponse.error("No products found matching the entered product name"));
            return ResponseEntity.ok(ApiResponse.success("Search results", results));
        }
        return ResponseEntity.badRequest().body(ApiResponse.error("Please provide productId or productName"));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<ApiResponse<List<Product>>> getByCategory(@PathVariable String category) {
        return ResponseEntity.ok(ApiResponse.success("Products by category", productService.getByCategory(category)));
    }

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<String>>> getCategories() {
        return ResponseEntity.ok(ApiResponse.success("Categories", productService.getCategories()));
    }

    @PutMapping("/{productId}")
    public ResponseEntity<ApiResponse<?>> updateProduct(@PathVariable Integer productId, @RequestBody Product product) {
        product.setProductId(productId);
        if (product.getProductName() == null || product.getProductName().trim().isEmpty())
            return ResponseEntity.badRequest().body(ApiResponse.error("Invalid product name"));
        if (product.getProductPrice() == null || product.getProductPrice() <= 0)
            return ResponseEntity.badRequest().body(ApiResponse.error("Invalid Price"));
        productService.update(product);
        return ResponseEntity.ok(ApiResponse.success("Product Updated Successfully", product));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<ApiResponse<?>> softDelete(@PathVariable Integer productId) {
        Optional<Product> p = productService.findById(productId);
        if (p.isEmpty()) return ResponseEntity.badRequest().body(ApiResponse.error("Product deletion failed, incorrect Product ID"));
        boolean deleted = productService.softDelete(productId);
        if (deleted) {
            return ResponseEntity.ok(ApiResponse.success("Product deleted successfully",
                    Map.of("productId", productId, "productName", p.get().getProductName())));
        }
        return ResponseEntity.badRequest().body(ApiResponse.error("Product deletion failed"));
    }

    @PutMapping("/{productId}/restore")
    public ResponseEntity<ApiResponse<?>> restore(@PathVariable Integer productId) {
        boolean restored = productService.restore(productId);
        if (restored) return ResponseEntity.ok(ApiResponse.success("Product restored successfully", null));
        return ResponseEntity.badRequest().body(ApiResponse.error("Product not found"));
    }

    @PostMapping("/bulk-upload")
    public ResponseEntity<ApiResponse<?>> bulkUpload(@RequestParam("file") MultipartFile file) {
        try {
            String filename = file.getOriginalFilename() != null ? file.getOriginalFilename().toLowerCase() : "";
            List<String> errors;
            if (filename.endsWith(".csv")) {
                errors = productService.bulkUploadCsv(file);
            } else if (filename.endsWith(".xlsx") || filename.endsWith(".xls")) {
                errors = productService.bulkUploadExcel(file);
            } else {
                return ResponseEntity.badRequest().body(ApiResponse.error("Only .csv or .xlsx files are supported"));
            }
            if (errors.isEmpty()) return ResponseEntity.ok(ApiResponse.success("Bulk upload successful", null));
            return ResponseEntity.ok(ApiResponse.success("Bulk upload completed with some errors", errors));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Bulk upload failed: " + e.getMessage()));
        }
    }
}
