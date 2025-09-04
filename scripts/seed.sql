-- Seed data for Shy Bird Purchasing App

-- Insert locations
INSERT INTO locations (name, code, weekly_sales_target) VALUES
('Shy Bird Kendall', 'SBK', 93000),
('Shy Bird South Boston', 'SBSB', 85000),
('Shy Bird Fenway', 'SBF', 78000);

-- Insert sales distribution for all locations
INSERT INTO sales_distribution (location_id, day_of_week, percentage) 
SELECT l.id, d.day_of_week, d.percentage
FROM locations l
CROSS JOIN (VALUES 
    ('Monday', 0.116),
    ('Tuesday', 0.135),
    ('Wednesday', 0.151),
    ('Thursday', 0.159),
    ('Friday', 0.165),
    ('Saturday', 0.142),
    ('Sunday', 0.132)
) AS d(day_of_week, percentage);

-- Insert purchasing distribution for all locations
INSERT INTO purchasing_distribution (location_id, day_of_week, percentage)
SELECT l.id, d.day_of_week, d.percentage
FROM locations l
CROSS JOIN (VALUES 
    ('Monday', 0.1284),
    ('Tuesday', 0.1547),
    ('Wednesday', 0.1364),
    ('Thursday', 0.1008),
    ('Friday', 0.2572),
    ('Saturday', 0.2225),
    ('Sunday', 0.0000)
) AS d(day_of_week, percentage);

-- Insert vendor configuration for all locations
INSERT INTO vendor_config (location_id, vendor_name, percentage)
SELECT l.id, v.vendor_name, v.percentage
FROM locations l
CROSS JOIN (VALUES 
    ('US Foods', 0.45),
    ('Katsiroubas', 0.145),
    ('Baldor', 0.145),
    ('D''Artagnan', 0.11),
    ('Other Vendors', 0.15)
) AS v(vendor_name, percentage);

-- Insert sample users (passwords will be hashed by the application)
-- Password for all users: 'password123'
INSERT INTO users (username, email, password_hash, role) VALUES
('admin', 'admin@shybird.com', '$2a$10$K.0HX1SN5kFrJbJD4wJxD.YQwLxGcR3V8K2ZGRzN9UqRSvCwdBqPe', 'admin'),
('sbk_manager', 'sbk@shybird.com', '$2a$10$K.0HX1SN5kFrJbJD4wJxD.YQwLxGcR3V8K2ZGRzN9UqRSvCwdBqPe', 'manager'),
('multi_manager', 'manager@shybird.com', '$2a$10$K.0HX1SN5kFrJbJD4wJxD.YQwLxGcR3V8K2ZGRzN9UqRSvCwdBqPe', 'manager');

-- Grant location access
-- Admin gets all locations
INSERT INTO user_locations (user_id, location_id)
SELECT u.id, l.id
FROM users u
CROSS JOIN locations l
WHERE u.username = 'admin';

-- SBK manager gets only Kendall
INSERT INTO user_locations (user_id, location_id)
SELECT u.id, l.id
FROM users u
CROSS JOIN locations l
WHERE u.username = 'sbk_manager' AND l.code = 'SBK';

-- Multi manager gets all locations
INSERT INTO user_locations (user_id, location_id)
SELECT u.id, l.id
FROM users u
CROSS JOIN locations l
WHERE u.username = 'multi_manager';