INSERT INTO department (name)
VALUES  ("Sales"),
        ("Management"),
        ("Service");

INSERT INTO role (title, salary, department_id)
VALUES  ("Sales Lead", 100000, 1),
        ("Salesperson", 80000, 1),
        ("Management Lead", 200000, 2),
        ("General Manager", 90000, 2),
        ("Customer Service Lead", 70000, 3),
        ("Customer Service Representative", 40000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ("John", "Smith", 1, null),
        ("Alpha", "Beta", 2, null),
        ("Charlie", "Delta", 3, null),
        ("Echo", "Foxtrot", 4, null),
        ("Golf", "Hotel", 5, null),
        ("India", "Juliet", 6, null),
        ("Kilo", "Lima", 7, null),
        ("Mike", "November", 8, null),
        ("Oscar", "Papa", 9, null);