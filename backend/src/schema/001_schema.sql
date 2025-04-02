-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Table: roles
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP(6) DEFAULT now(),
  updated_at TIMESTAMP(6) DEFAULT now()
);

-- Table: users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  hashed_password TEXT NOT NULL,
  created_at TIMESTAMP(6) DEFAULT now(),
  updated_at TIMESTAMP(6) DEFAULT now(),
  role_id UUID DEFAULT uuid_generate_v4(),
  CONSTRAINT fk_role_id FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Table: levels
CREATE TABLE levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  input_data JSON NOT NULL,
  created_at TIMESTAMP(6) DEFAULT now(),
  updated_at TIMESTAMP(6) DEFAULT now()
);

-- Table: submissions
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  level_id UUID NOT NULL,
  submission_data JSON NOT NULL,
  created_at TIMESTAMP(6) DEFAULT now(),
  updated_at TIMESTAMP(6) DEFAULT now(),
  submitted_at TIMESTAMP(6) DEFAULT now(),
  CONSTRAINT fk_submission_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_submission_level FOREIGN KEY (level_id) REFERENCES levels(id) ON DELETE CASCADE,
  CONSTRAINT uq_user_level_submission UNIQUE (user_id, level_id)
);

-- Table: user_progress
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  level_id UUID NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  current_solution TEXT,
  test_case_results JSON NOT NULL,
  attempts INT DEFAULT 0,
  created_at TIMESTAMP(6) DEFAULT now(),
  updated_at TIMESTAMP(6) DEFAULT now(),
  last_attempt_at TIMESTAMP(6),
  CONSTRAINT fk_progress_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_progress_level FOREIGN KEY (level_id) REFERENCES levels(id) ON DELETE CASCADE,
  CONSTRAINT uq_user_level_progress UNIQUE (user_id, level_id)
);
