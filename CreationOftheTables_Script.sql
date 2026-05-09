CREATE TABLE Role (
    role_id INT PRIMARY KEY IDENTITY,
    role_name VARCHAR(50) NOT NULL
);

CREATE TABLE [User] (
    user_id INT PRIMARY KEY IDENTITY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    role_id INT,
    created_at DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (role_id) REFERENCES Role(role_id)
);

CREATE TABLE ParkingArea (
    area_id INT PRIMARY KEY IDENTITY,
    name VARCHAR(100),
    total_rows INT,
    total_columns INT
);

CREATE TABLE ParkingSlot (
    slot_id INT PRIMARY KEY IDENTITY,
    area_id INT,
    slot_number VARCHAR(50),
    row_number INT,
    column_number INT,
    status VARCHAR(20), -- Available, Reserved, Occupied

    FOREIGN KEY (area_id) REFERENCES ParkingArea(area_id)
);

CREATE TABLE ParkingRate (
    rate_id INT PRIMARY KEY IDENTITY,
    area_id INT,
    price_per_entry DECIMAL(10,2),
    effective_from DATETIME,
    effective_to DATETIME,

    FOREIGN KEY (area_id) REFERENCES ParkingArea(area_id)
);

CREATE TABLE Reservation (
    reservation_id INT PRIMARY KEY IDENTITY,
    user_id INT,
    slot_id INT,
    start_time DATETIME,
    end_time DATETIME,
    total_amount DECIMAL(10,2),
    status VARCHAR(20), -- Reserved, CheckedIn, Completed

    FOREIGN KEY (user_id) REFERENCES [User](user_id),
    FOREIGN KEY (slot_id) REFERENCES ParkingSlot(slot_id)
);

CREATE TABLE Payment (
    payment_id INT PRIMARY KEY IDENTITY,
    reservation_id INT,
    amount DECIMAL(10,2),
    payment_date DATETIME,
    status VARCHAR(20),

    FOREIGN KEY (reservation_id) REFERENCES Reservation(reservation_id)
);

CREATE TABLE QRScanLog (
    log_id INT PRIMARY KEY IDENTITY,
    user_id INT,
    slot_id INT,
    scan_time DATETIME DEFAULT GETDATE(),
    action VARCHAR(20), -- CheckIn / CheckOut

    FOREIGN KEY (user_id) REFERENCES [User](user_id),
    FOREIGN KEY (slot_id) REFERENCES ParkingSlot(slot_id)
);