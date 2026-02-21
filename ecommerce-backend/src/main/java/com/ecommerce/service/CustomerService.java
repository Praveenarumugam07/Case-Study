package com.ecommerce.service;

import com.ecommerce.model.Customer;
import com.ecommerce.repository.CustomerRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public String generateCustomerId() {
        String prefix = "CUST";
        long count = customerRepository.count() + 1;
        return prefix + String.format("%04d", count);
    }

    public Customer register(Customer customer) {
        customer.setCustomerId(generateCustomerId());
        customer.setPassword(passwordEncoder.encode(customer.getPassword()));
        customerRepository.save(customer);
        return customer;
    }

    public Optional<Customer> login(String customerId, String rawPassword) {
        Optional<Customer> cust = customerRepository.findById(customerId);
        if (cust.isPresent() && passwordEncoder.matches(rawPassword, cust.get().getPassword())) {
            return cust;
        }
        return Optional.empty();
    }

    public boolean isEmailUnique(String email) {
        return !customerRepository.existsByEmail(email);
    }

    public Optional<Customer> findById(String customerId) {
        return customerRepository.findById(customerId);
    }

    public List<Customer> findAll() {
        return customerRepository.findAll();
    }

    public void updateProfile(Customer customer) {
        Optional<Customer> existing = customerRepository.findById(customer.getCustomerId());
        if (existing.isPresent()) {
            Customer c = existing.get();
            // Only encode password if changed (doesn't start with $2a$)
            if (customer.getPassword() != null && !customer.getPassword().startsWith("$2a$")) {
                customer.setPassword(passwordEncoder.encode(customer.getPassword()));
            } else {
                customer.setPassword(c.getPassword());
            }
            customerRepository.update(customer);
        }
    }
}
