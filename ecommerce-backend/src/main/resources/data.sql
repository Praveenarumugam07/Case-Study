-- Seed Admin User (password: Admin@1234 — auto BCrypt-encoded at startup by AdminService)
INSERT INTO ADMIN (admin_id, username, password)
VALUES ('ADMIN001', 'Admin', 'Admin@1234');

-- Seed sample products
INSERT INTO PRODUCT (product_name, product_image, product_price, product_category, product_description, quantity_available, product_status, is_deleted)
VALUES
('Laptop Pro 15', '', 75000.00, 'Electronics', 'High performance laptop with 15-inch display', 10, 'Active', FALSE),
('Wireless Headphones', '', 3500.00, 'Electronics', 'Noise cancelling Bluetooth headphones', 25, 'Active', FALSE),
('Cotton T-Shirt', '', 599.00, 'Fashion', 'Comfortable cotton t-shirt in multiple colors', 50, 'Active', FALSE),
('Running Shoes', '', 2999.00, 'Fashion', 'Lightweight running shoes with cushioned sole', 30, 'Active', FALSE),
('Notebook Set', '', 149.00, 'Stationary', 'Pack of 5 ruled notebooks A4 size', 100, 'Active', FALSE),
('Ballpoint Pens', '', 49.00, 'Stationary', 'Pack of 10 smooth writing pens', 200, 'Active', FALSE),
('Decorative Lamp', '', 1299.00, 'Home Decor', 'Modern LED decorative lamp for living room', 15, 'Active', FALSE),
('Wall Clock', '', 799.00, 'Home Decor', 'Elegant wooden wall clock', 20, 'Active', FALSE),
('Smartphone X12', '', 45000.00, 'Electronics', 'Latest model with 5G support and 128GB storage', 5, 'Active', FALSE),
('Coffee Mug Set', '', 499.00, 'Home Decor', 'Set of 6 ceramic coffee mugs', 0, 'Active', FALSE);
