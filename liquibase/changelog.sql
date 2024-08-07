-- changeset raypras:1
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    sku VARCHAR(255) NOT NULL UNIQUE,
    image VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    stock INT DEFAULT 0
);

CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    sku VARCHAR(255) NOT NULL,
    qty INT NOT NULL,
    amount DECIMAL(10, 2),
    FOREIGN KEY (sku) REFERENCES products(sku) ON DELETE CASCADE
);

CREATE UNIQUE INDEX unique_sku ON products (sku);
