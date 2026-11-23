-- Schema for Haniforge PC Builder Database (Neon PostgreSQL)

-- 1. Table: components
CREATE TABLE IF NOT EXISTS components (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'cpu', 'motherboard', 'ram', 'gpu', 'storage', 'psu', 'casing', 'cooler'
    price BIGINT NOT NULL,
    image_url TEXT,
    description TEXT,
    specifications JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Table: builds
CREATE TABLE IF NOT EXISTS builds (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    budget BIGINT NOT NULL DEFAULT 0,
    total_price BIGINT NOT NULL DEFAULT 0,
    compatibility_status VARCHAR(50) NOT NULL DEFAULT 'compatible', -- 'compatible', 'warning', 'incompatible'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Table: build_items
CREATE TABLE IF NOT EXISTS build_items (
    id SERIAL PRIMARY KEY,
    build_id INTEGER NOT NULL REFERENCES builds(id) ON DELETE CASCADE,
    component_id INTEGER NOT NULL REFERENCES components(id) ON DELETE RESTRICT,
    category VARCHAR(50) NOT NULL,
    price_at_selection BIGINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_components_category ON components(category);
CREATE INDEX IF NOT EXISTS idx_components_brand ON components(brand);
CREATE INDEX IF NOT EXISTS idx_components_price ON components(price);
CREATE INDEX IF NOT EXISTS idx_build_items_build_id ON build_items(build_id);
