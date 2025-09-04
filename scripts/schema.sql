-- Shy Bird Purchasing App PostgreSQL Schema

-- Drop existing tables if they exist
DROP TABLE IF EXISTS daily_actuals CASCADE;
DROP TABLE IF EXISTS weekly_data CASCADE;
DROP TABLE IF EXISTS vendor_config CASCADE;
DROP TABLE IF EXISTS purchasing_distribution CASCADE;
DROP TABLE IF EXISTS sales_distribution CASCADE;
DROP TABLE IF EXISTS user_locations CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS locations CASCADE;

-- Locations table
CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    code VARCHAR(10) NOT NULL UNIQUE,
    weekly_sales_target DECIMAL(10, 2) DEFAULT 93000,
    food_cost_target DECIMAL(3, 2) DEFAULT 0.28,
    food_sales_ratio DECIMAL(3, 2) DEFAULT 0.78,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sales distribution by day of week for each location
CREATE TABLE sales_distribution (
    id SERIAL PRIMARY KEY,
    location_id INTEGER NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    day_of_week VARCHAR(10) NOT NULL,
    percentage DECIMAL(5, 4) NOT NULL,
    UNIQUE(location_id, day_of_week)
);

-- Purchasing distribution by day of week for each location
CREATE TABLE purchasing_distribution (
    id SERIAL PRIMARY KEY,
    location_id INTEGER NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    day_of_week VARCHAR(10) NOT NULL,
    percentage DECIMAL(5, 4) NOT NULL,
    UNIQUE(location_id, day_of_week)
);

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User location access
CREATE TABLE user_locations (
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    location_id INTEGER NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    can_view BOOLEAN DEFAULT true,
    can_edit BOOLEAN DEFAULT true,
    PRIMARY KEY (user_id, location_id)
);

-- Weekly purchasing data
CREATE TABLE weekly_data (
    id SERIAL PRIMARY KEY,
    location_id INTEGER NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    week_start DATE NOT NULL,
    weekly_sales_forecast DECIMAL(10, 2) NOT NULL,
    created_by INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(location_id, week_start)
);

-- Daily actual data
CREATE TABLE daily_actuals (
    id SERIAL PRIMARY KEY,
    weekly_data_id INTEGER NOT NULL REFERENCES weekly_data(id) ON DELETE CASCADE,
    day_of_week VARCHAR(10) NOT NULL,
    date DATE NOT NULL,
    actual_sales DECIMAL(10, 2),
    actual_purchasing DECIMAL(10, 2),
    updated_by INTEGER REFERENCES users(id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(weekly_data_id, day_of_week)
);

-- Vendor configuration for each location
CREATE TABLE vendor_config (
    id SERIAL PRIMARY KEY,
    location_id INTEGER NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    vendor_name VARCHAR(255) NOT NULL,
    percentage DECIMAL(5, 4) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    UNIQUE(location_id, vendor_name)
);

-- Create indexes for better performance
CREATE INDEX idx_weekly_data_location_week ON weekly_data(location_id, week_start);
CREATE INDEX idx_daily_actuals_weekly ON daily_actuals(weekly_data_id);
CREATE INDEX idx_user_locations_user ON user_locations(user_id);

-- Create update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON locations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_weekly_data_updated_at BEFORE UPDATE ON weekly_data
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_actuals_updated_at BEFORE UPDATE ON daily_actuals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();