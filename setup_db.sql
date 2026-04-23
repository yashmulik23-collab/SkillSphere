CREATE DATABASE IF NOT EXISTS skillsphere_db;
USE skillsphere_db;

-- The tables will be created automatically by Hibernate, 
-- but you can run these if you want to be sure:

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    bio TEXT,
    skills TEXT,
    experience TEXT,
    links TEXT,
    education TEXT,
    availability VARCHAR(255),
    role VARCHAR(50)
);
