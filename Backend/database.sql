CREATE DATABASE FEEDINGFORWARD;

CREATE TABLE Users (
    id SERIAL PRIMARY KEY,  
    fullname VARCHAR(255) NOT NULL, 
    email VARCHAR(255) UNIQUE NOT NULL,  
    password VARCHAR(255) NOT NULL,  
    role VARCHAR(50) CHECK (role IN ('restaurant', 'caterer', 'event_planner', 'ngo')) NOT NULL,  
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);
CREATE TABLE "TempUsers" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fullname VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE Food_Donations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    donor_id INT NOT NULL, 
    food_name VARCHAR(255) NOT NULL,
    quantity VARCHAR(100) NOT NULL,
    expiry_date DATE NOT NULL,
    status ENUM('available', 'picked_up', 'expired') DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (donor_id) REFERENCES Users(id) ON DELETE CASCADE
);


CREATE TABLE NGOs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    organization_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);


CREATE TABLE Pickups (
    id INT PRIMARY KEY AUTO_INCREMENT,
    food_id INT NOT NULL,
    ngo_id INT NOT NULL,
    pickup_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (food_id) REFERENCES Food_Donations(id) ON DELETE CASCADE,
    FOREIGN KEY (ngo_id) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE Transactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    razorpay_payment_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);
-- Users Table for authentication (restaurants, caterers, event planners, NGOs).
-- Food_Donations Table to track available food donations.
-- NGOs Table to store NGO details.
-- Pickups Table to manage food collections.
-- Transactions Table for payments/donations via Razorpay.
