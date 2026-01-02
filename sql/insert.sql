INSERT INTO AccountRole (Name) VALUES ('customer'), ('employee');

INSERT INTO Person (FirstName, LastName, Email, Phone) VALUES
    ('Customer', 'One', 'customer1@cust.omer', 123456789),
    ('Customer', 'Two', 'customer2@cust.omer', 987654321),
    ('Employee', 'One', 'employee1@emplo.yee', 123456789);

INSERT INTO Product (Name, Description, Price) VALUES
    ('FirstProductName', 'A very interesting and detailed description of the first product.', 999),
    ('SecondProductName', 'A very interesting and detailed description of the second product.', 123);

INSERT INTO "Order" (Quantity, OrderAt, Person_ID, Product_ID) VALUES
    (10, 2026-01-02, 1, 1),
    (20, 2026-01-02, 1, 2),
    (1, 2026-01-02, 2, 2);

INSERT INTO Account (Person_ID, Username, Password, AccountRole_ID) VALUES
    (1, 'Cust1', '$2b$10$FXq1ApHQpi7LK48fxvjkueiOcwjaeGeS4Y8ZSYoF/idBMXBjPbmVC', 1), -- Login: Cust1, Password: asdasd
    (2, 'Cust2', '$2b$10$hyVpPgST7KQOS9JhLGf3F.m9ic0ZS.m19lXN.ywA1EVcDPDLX.buy', 1), -- Login: Cust2, Password: asdasd
    (3, 'Emp1', '$2b$10$JgJqBzT.LPMwSBkdtRtEtu6JqPOupIPc.RYPkDLmRlDD/shP7OeaG', 2); -- Login: Emp1, Password: asdasd