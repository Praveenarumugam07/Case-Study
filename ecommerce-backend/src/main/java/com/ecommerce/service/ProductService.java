package com.ecommerce.service;

import com.ecommerce.model.Product;
import com.ecommerce.repository.ProductRepository;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStreamReader;
import java.io.Reader;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public Product addProduct(Product product) {
        productRepository.save(product);
        List<Product> all = productRepository.findAll();
        // Return the newly added product (last inserted)
        return all.stream()
                .filter(p -> p.getProductName().equalsIgnoreCase(product.getProductName()))
                .findFirst()
                .orElse(product);
    }

    public List<Product> getAllActive() {
        return productRepository.findAllActive();
    }

    public List<Product> getAll() {
        return productRepository.findAll();
    }

    public Optional<Product> findById(Integer id) {
        return productRepository.findById(id);
    }

    public List<Product> searchByName(String name) {
        return productRepository.findByNameContaining(name);
    }

    public List<Product> getByCategory(String category) {
        return productRepository.findByCategory(category);
    }

    public List<String> getCategories() {
        return productRepository.findDistinctCategories();
    }

    public boolean isNameUnique(String name) {
        return !productRepository.existsByName(name);
    }

    public void update(Product product) {
        productRepository.update(product);
    }

    public boolean softDelete(Integer productId) {
        Optional<Product> p = productRepository.findById(productId);
        if (p.isEmpty()) return false;
        productRepository.softDelete(productId);
        return true;
    }

    public boolean restore(Integer productId) {
        Optional<Product> p = productRepository.findById(productId);
        if (p.isEmpty()) return false;
        productRepository.restoreProduct(productId);
        return true;
    }

    public List<String> bulkUploadCsv(MultipartFile file) throws Exception {
        List<String> errors = new ArrayList<>();
        try (Reader reader = new InputStreamReader(file.getInputStream());
             CSVParser parser = new CSVParser(reader, CSVFormat.DEFAULT.withFirstRecordAsHeader())) {
            for (CSVRecord record : parser) {
                try {
                    Product p = new Product();
                    p.setProductName(record.get("product_name"));
                    p.setProductPrice(Double.parseDouble(record.get("product_price")));
                    p.setProductCategory(record.get("product_category"));
                    p.setProductDescription(record.get("product_description"));
                    p.setQuantityAvailable(Integer.parseInt(record.get("quantity_available")));
                    p.setProductStatus(record.get("product_status"));
                    p.setProductImage("");
                    if (!productRepository.existsByName(p.getProductName())) {
                        productRepository.save(p);
                    } else {
                        errors.add("Duplicate: " + p.getProductName());
                    }
                } catch (Exception e) {
                    errors.add("Row error: " + e.getMessage());
                }
            }
        }
        return errors;
    }

    public List<String> bulkUploadExcel(MultipartFile file) throws Exception {
        List<String> errors = new ArrayList<>();
        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            Row header = sheet.getRow(0);
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                try {
                    Row row = sheet.getRow(i);
                    if (row == null) continue;
                    Product p = new Product();
                    p.setProductName(getCellValue(row.getCell(0)));
                    p.setProductPrice(Double.parseDouble(getCellValue(row.getCell(1))));
                    p.setProductCategory(getCellValue(row.getCell(2)));
                    p.setProductDescription(getCellValue(row.getCell(3)));
                    p.setQuantityAvailable(Integer.parseInt(getCellValue(row.getCell(4))));
                    p.setProductStatus(getCellValue(row.getCell(5)));
                    p.setProductImage("");
                    if (!productRepository.existsByName(p.getProductName())) {
                        productRepository.save(p);
                    } else {
                        errors.add("Duplicate: " + p.getProductName());
                    }
                } catch (Exception e) {
                    errors.add("Row " + i + " error: " + e.getMessage());
                }
            }
        }
        return errors;
    }

    private String getCellValue(Cell cell) {
        if (cell == null) return "";
        return switch (cell.getCellType()) {
            case STRING -> cell.getStringCellValue().trim();
            case NUMERIC -> String.valueOf((long) cell.getNumericCellValue());
            case BOOLEAN -> String.valueOf(cell.getBooleanCellValue());
            default -> "";
        };
    }
}
