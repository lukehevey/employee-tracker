INSERT INTO departments (department_name)
VALUES ("Marketing"),
       ("Customer Service"),
       ("IT"),
       ("Accounting");

INSERT INTO roles (title, salary, department_id)
VALUES ("Marketing Manager", 110000, 1),
       ("Market Research", 75000, 1),
       ("Customer Support", 90000, 2),
       ("Customer Service Manager", 120000, 2),
       ("Software Developer", 70000, 3),
       ("IT Director", 100000, 3),
       ("Accounting Manager", 105000, 4),
       ("Accountant", 85000, 4);


INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Mike", "Johnson", 1, null),
       ("George", "Brown", 2, 1),
       ("Deborah", "Williams", 4, null),
       ("Mary", "Jones", 3, 3),
       ("Alexander", "Anderson", 6, null),
       ("Zachary", "Jones", 5, 5),
       ("Elizabeth", "Olson", 7, null),
       ("Stephen", "Miller", 8, 7);
