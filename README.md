# e-commerce backend API

### Prerequisites

- Node.js
- PostgreSQL
- Liquibase

### Steps
1. Install dependencies:

    ```sh
    npm install
    ```

2. Set up environment variables:

    Create a `.env` file in the root directory and add the following:

    ```env
    DB_USER=your_db_user
    DB_PASSWORD=your_db_password
    DB_HOST=your_db_host
    DB_PORT=your_db_port
    DB_NAME=your_db_name
    SERVER_PORT=your_port
    SERVER_HOST=your_host
    ```

    also create liquibase.properties if you want to do the migration with liquibase
    ```env
    changeLogFile=liquibase/changelog.sql
    url=jdbc:postgresql://your-host:5432/your-db-name
    username=your-username
    password=your-pass
    driver=org.postgresql.Driver
    ```

3. Run database migrations:

    you can run this DDL
    ```sh
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

    ```

    if you are using liquibase you can run with this
    ```sh
    liquibase update
    ```

4. Start the server:

    ```sh
    npm start
    ```

The server will run on http://localhost:3000.

you can also view the API documentation at [postman](https://solar-space-890075.postman.co/workspace/My-Workspace~da0f713e-59fe-4be1-88d2-7ae333b1fd51/collection/10601820-68035859-377c-445d-a7c7-399919ea8bef/overview?action=share&creator=10601820)
