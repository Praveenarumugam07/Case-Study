package com.ecommerce.model;

import java.time.LocalDateTime;

public class Customer {
    private String customerId;
    private String name;
    private String country;
    private String state;
    private String city;
    private String address1;
    private String address2;
    private String zipCode;
    private String phoneNumber;
    private String email;
    private String password;
    private LocalDateTime createdAt;

    public Customer() {}

    public Customer(String customerId, String name, String country, String state, String city,
                    String address1, String address2, String zipCode, String phoneNumber,
                    String email, String password) {
        this.customerId = customerId;
        this.name = name;
        this.country = country;
        this.state = state;
        this.city = city;
        this.address1 = address1;
        this.address2 = address2;
        this.zipCode = zipCode;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.password = password;
    }

    public String getCustomerId() { return customerId; }
    public void setCustomerId(String customerId) { this.customerId = customerId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getAddress1() { return address1; }
    public void setAddress1(String address1) { this.address1 = address1; }

    public String getAddress2() { return address2; }
    public void setAddress2(String address2) { this.address2 = address2; }

    public String getZipCode() { return zipCode; }
    public void setZipCode(String zipCode) { this.zipCode = zipCode; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
