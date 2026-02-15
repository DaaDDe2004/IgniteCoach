-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    subscription_tier VARCHAR(50) DEFAULT 'starter',
    subscription_status VARCHAR(50) DEFAULT 'active'
);

-- User profiles
CREATE TABLE user_profiles (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    age INTEGER,
    weight DECIMAL(5,2),
    height DECIMAL(5,2),
    fitness_goal VARCHAR(100),
    experience_level VARCHAR(50),
    available_equipment TEXT[],
    workout_days INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Workouts
CREATE TABLE workouts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    exercises JSONB NOT NULL,
    duration INTEGER,
    difficulty VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Workout logs
CREATE TABLE workout_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    workout_id INTEGER REFERENCES workouts(id),
    exercises JSONB NOT NULL,
    duration INTEGER,
    notes TEXT,
    completed_at TIMESTAMP DEFAULT NOW()
);

-- Personal records
CREATE TABLE personal_records (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    exercise_name VARCHAR(255) NOT NULL,
    weight DECIMAL(6,2) NOT NULL,
    reps INTEGER,
    achieved_at TIMESTAMP DEFAULT NOW()
);

-- Body measurements
CREATE TABLE body_measurements (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    weight DECIMAL(5,2),
    body_fat DECIMAL(4,2),
    chest DECIMAL(5,2),
    waist DECIMAL(5,2),
    arms DECIMAL(5,2),
    thighs DECIMAL(5,2),
    measured_at TIMESTAMP DEFAULT NOW()
);

-- Nutrition logs
CREATE TABLE nutrition_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    meal_type VARCHAR(50),
    foods JSONB,
    total_calories INTEGER,
    protein DECIMAL(5,2),
    carbs DECIMAL(5,2),
    fats DECIMAL(5,2),
    logged_at TIMESTAMP DEFAULT NOW()
);

-- AI coach conversations
CREATE TABLE coach_conversations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    context JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_workouts_user_id ON workouts(user_id);
CREATE INDEX idx_workout_logs_user_id ON workout_logs(user_id);
CREATE INDEX idx_workout_logs_completed_at ON workout_logs(completed_at);
CREATE INDEX idx_personal_records_user_id ON personal_records(user_id);