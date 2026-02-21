-- =============================================
-- E-Commerce Database Schema (H2)
-- =============================================

DROP TABLE IF EXISTS FEEDBACK;
DROP TABLE IF EXISTS INVOICE;
DROP TABLE IF EXISTS ORDER_ITEMS;
DROP TABLE IF EXISTS ORDERS;
DROP TABLE IF EXISTS CART_ITEMS;
DROP TABLE IF EXISTS CART;
DROP TABLE IF EXISTS PRODUCT;
DROP TABLE IF EXISTS ADMIN;
DROP TABLE IF EXISTS CUSTOMER;

-- CUSTOMER TABLE
CREATE TABLE CUSTOMER (
    customer_id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    country VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    address1 TEXT NOT NULL,
    address2 TEXT,
    zip_code VARCHAR(20) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ADMIN TABLE
CREATE TABLE ADMIN (
    admin_id VARCHAR(20) PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- PRODUCT TABLE
CREATE TABLE PRODUCT (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(50) NOT NULL UNIQUE,
    product_image VARCHAR(500),
    product_price DECIMAL(10,2) NOT NULL,
    product_category VARCHAR(100) NOT NULL,
    product_description TEXT NOT NULL,
    quantity_available INT NOT NULL DEFAULT 0,
    product_status VARCHAR(20) NOT NULL DEFAULT 'Active',
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- CART TABLE
CREATE TABLE CART (
    cart_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id VARCHAR(20) NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES CUSTOMER(customer_id)
);

-- CART_ITEMS TABLE
CREATE TABLE CART_ITEMS (
    cart_item_id INT AUTO_INCREMENT PRIMARY KEY,
    cart_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    FOREIGN KEY (cart_id) REFERENCES CART(cart_id),
    FOREIGN KEY (product_id) REFERENCES PRODUCT(product_id)
);

-- ORDERS TABLE
CREATE TABLE ORDERS (
    order_id VARCHAR(20) PRIMARY KEY,
    customer_id VARCHAR(20) NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    arriving_date TIMESTAMP,
    total_price DECIMAL(10,2) NOT NULL,
    order_status VARCHAR(30) NOT NULL DEFAULT 'Confirmed',
    shipping_address TEXT,
    cancel_reason TEXT,
    cancelled_date TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES CUSTOMER(customer_id)
);

-- ORDER_ITEMS TABLE
CREATE TABLE ORDER_ITEMS (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(20) NOT NULL,
    product_id INT NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    product_category VARCHAR(100),
    product_price DECIMAL(10,2) NOT NULL,
    product_description TEXT,
    quantity INT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES ORDERS(order_id)
);

-- INVOICE TABLE
CREATE TABLE INVOICE (
    invoice_id INT AUTO_INCREMENT PRIMARY KEY,
    transaction_id VARCHAR(50) NOT NULL,
    order_id VARCHAR(20) NOT NULL,
    customer_id VARCHAR(20) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_mode VARCHAR(50) NOT NULL,
    payment_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- FEEDBACK TABLE
CREATE TABLE FEEDBACK (
    feedback_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(20) NOT NULL,
    customer_id VARCHAR(20) NOT NULL,
    feedback_description TEXT NOT NULL,
    rating INT NOT NULL CHECK(rating >= 1 AND rating <= 5),
    feedback_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES ORDERS(order_id),
    FOREIGN KEY (customer_id) REFERENCES CUSTOMER(customer_id)
);
