package com.ecommerce.service;

import com.ecommerce.model.Admin;
import com.ecommerce.repository.AdminRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AdminService {

    private final AdminRepository adminRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public AdminService(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    /**
     * On startup, if the admin password stored in DB is not already a BCrypt hash
     * (i.e. data.sql stores plain text), encode it and update it.
     */
    @PostConstruct
    public void encodeAdminPasswordsIfNeeded() {
        Optional<Admin> adminOpt = adminRepository.findById("ADMIN001");
        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            String storedPassword = admin.getPassword();
            if (!storedPassword.startsWith("$2a$") && !storedPassword.startsWith("$2b$")) {
                String encoded = passwordEncoder.encode(storedPassword);
                adminRepository.updatePassword(admin.getAdminId(), encoded);
            }
        }
    }

    public Optional<Admin> login(String adminId, String password) {
        Optional<Admin> admin = adminRepository.findById(adminId);
        if (admin.isPresent() && passwordEncoder.matches(password, admin.get().getPassword())) {
            return admin;
        }
        return Optional.empty();
    }
}
