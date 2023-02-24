const mysql = require("mysql2");
const inquirer = require("inquirer");
const cTable = require("console.table");

const addEmployeeQs = require("./lib/addEmployeeQs");
const addRoleQs = require("./lib/addRoleQs");
const addDepartmentQs = require("./lib/addDepartmentQs");
const menuQs = require("./lib/menuQs");

require("dotenv").config();

// Connect to database
const db = mysql.createConnection({
  host: "localhost",
  port: "3306",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "employee_db",
});

db.connect((err) => {
  if (err) {
    console.error(err);
  } else {
    console.log(
      `%c
         ______                 _
        |  ____|               | |
        | |__   _ __ ___  _ __ | | ___  _   _  ___  ___
        |  __| | '_ \` _ \\| '_ \\| |/ _ \\| | | |/ _ \\\/ _ \\
        | |____| | | | | | |_) | | (_) | |_| |  __/  __/
        |______|_| |_| |_| .__/|_|\\___/ \\__, |\\___|\\___|
                         | |             __/ |
                         |_|            |___/
         __  __
        |  \\/  |
        | \\  / | __ _ _ __   __ _  __ _  ___ _ __
        | |\\/| |/ _\` | '_ \\ / _\` |/ _\` |/ _ \\ '__|
        | |  | | (_| | | | | (_| | (_| |  __/ |
        |_|  |_|\\__,_|_| |_|\\__,_|\\__, |\\___|_|
                                   __/ |
                                  |___/\n`,
      "font-family:monospace"
    );
    init();
  }
});

viewDepartments = () => {
  db.query(`SELECT * FROM department ORDER BY id ASC;`, (err, res) => {
    if (err) {
      console.error(err);
    } else {
      console.table("\n", res);
      init();
    }
  });
};

viewRoles = () => {
  db.query(`SELECT * FROM role ORDER BY id ASC;`, (err, res) => {
    if (err) {
      console.error(err);
    } else {
      console.table("\n", res);
      init();
    }
  });
};

viewEmployees = () => {
  db.query(`SELECT * FROM employee ORDER BY id ASC;`, (err, res) => {
    if (err) {
      console.error(err);
    } else {
      console.table("\n", res);
      init();
    }
  });
};

addDepartment = () => {
  inquirer.prompt(addDepartmentQs).then(function (data) {
    db.query(
      `INSERT INTO department SET ?`,
      {
        name: data.department,
      },
      (err, res) => {
        if (err) throw err;
        console.log(`\nAdded ${data.department} to the database\n`);
        init();
      }
    );
  });
};

addRole = () => {
  db.query(`SELECT * FROM department;`, (err, res) => {
    if (err) throw err;
    let departments = res.map((data) => ({
      name: data.name,
      value: data.id,
    }));
    inquirer.prompt(addRoleQs).then(function (data) {
      inquirer
        .prompt([
          {
            type: "list",
            name: "role_department",
            message: "Which department does the role belong to? ",
            choices: departments,
          },
        ])
        .then(function (response) {
          db.query(
            `INSERT INTO role SET ?`,
            {
              title: data.role_name,
              salary: data.role_salary,
              department_id: response.role_department,
            },
            (err, res) => {
              if (err) throw err;
              console.log(`\n Added ${data.role_name} to the database\n`);
              init();
            }
          );
        });
    });
  });
};

addEmployee = () => {
  db.query(`SELECT * FROM role;`, (err, res) => {
    if (err) throw err;
    let roles = res.map((data) => ({
      name: data.title,
      value: data.id,
    }));
    db.query(`SELECT * FROM employee;`, (err, res) => {
      if (err) throw err;
      let managers = res.map((data) => ({
        name: data.first_name + " " + data.last_name,
        value: data.id,
      }));
      inquirer.prompt(addEmployeeQs).then(function (data) {
        inquirer
          .prompt([
            {
              type: "list",
              name: "employee_role",
              message: "What is the employee's role? ",
              choices: roles,
            },
            {
              type: "list",
              name: "employee_manager",
              message: "Who is the employee's manager? ",
              choices: managers,
            },
          ])
          .then(function (response) {
            db.query(
              `INSERT INTO employee SET ?`,
              {
                first_name: data.employee_first_name,
                last_name: data.employee_last_name,
                role_id: response.employee_role,
                manager_id: response.employee_manager,
              },
              (err, res) => {
                if (err) throw err;
                console.log(
                  `\n Added ${data.employee_first_name} ${data.employee_last_name} to the database\n`
                );
                init();
              }
            );
          });
      });
    });
  });
};

updateEmployee = () => {
  db.query(`SELECT * FROM employee;`, (err, res) => {
    if (err) throw err;
    let employees = res.map((data) => ({
      name: data.first_name + " " + data.last_name,
      value: data.id,
    }));
    inquirer
      .prompt([
        {
          type: "list",
          name: "employee_list",
          message: "Which employee's role do you want to update? ",
          choices: employees,
        },
      ])
      .then(function (data) {
        db.query(`SELECT * FROM role;`, (err, res) => {
          if (err) throw err;
          let roles = res.map((data) => ({
            name: data.title,
            value: data.id,
          }));
          inquirer
            .prompt([
              {
                type: "list",
                name: "role_list",
                message:
                  "Which role do you want to assign to the selected employee? ",
                choices: roles,
              },
            ])
            .then(function (response) {
              db.query(`UPDATE employee SET ? WHERE ?`, [
                { role_id: response.role_list },
                { id: data.employee_list },
              ]);
              console.log("Updated employee's role");
              init();
            });
        });
      });
  });
};

init = () => {
  inquirer.prompt(menuQs).then(function (data) {
    switch (data.main_menu) {
      case "View all departments":
        viewDepartments();
        break;
      case "View all roles":
        viewRoles();
        break;
      case "View all employees":
        viewEmployees();
        break;
      case "Add a department":
        addDepartment();
        break;
      case "Add a role":
        addRole();
        break;
      case "Add an employee":
        addEmployee();
        break;
      case "Update an employee role":
        updateEmployee();
        break;
      case "Quit":
        db.end();
        console.log("Bye!");
        break;
    }
  });
};
