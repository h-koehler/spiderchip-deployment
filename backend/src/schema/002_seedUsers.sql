-- Create default roles
INSERT INTO roles (id, name, description, created_at, updated_at)
VALUES
  (uuid_generate_v4(), 'admin', 'Administrator role', now(), now()),
  (uuid_generate_v4(), 'user', 'Standard user role', now(), now());

-- Create users with required fields
INSERT INTO users (id, username, email, hashed_password, role_id, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'admin',
  'admin@spiderchip.com',
  '$2b$10$9PjhDrW/Brc0dm9cd1kTSOzhwJGpDk2s/Qkg8.64aSbXAgdvB4bWe', -- Admin123
  (SELECT id FROM roles WHERE name = 'admin'),
  now(),
  now()
);

INSERT INTO users (id, username, email, hashed_password, role_id, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'user',
  'user@spiderchip.com',
  '$2b$10$4wtJliuSm2ZVqm89Ed6lE.2CIGziElxCPyTgZXaWJyoRLL5481gea', -- Spiderchipuser123
  (SELECT id FROM roles WHERE name = 'user'),
  now(),
  now()
);
