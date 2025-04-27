-- Create the role if it doesn't exist
DO
$$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles
      WHERE  rolname = 'taskuser') THEN

      CREATE ROLE taskuser LOGIN PASSWORD 'taskpassword';
   END IF;
END
$$;

-- Create the database if it doesn't exist
-- Note: Connecting as the default 'postgres' user initially might be required for this check
-- Alternatively, just attempt creation and ignore error if it exists.
SELECT 'CREATE DATABASE taskdb' -- Attempt to create DB
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'taskdb');

-- Grant privileges AFTER database is created
GRANT ALL PRIVILEGES ON DATABASE taskdb TO taskuser; 