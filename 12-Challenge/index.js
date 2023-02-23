const mysql = require("mysql2");
const inquirer = require("inquirer");

const Employee = require("./lib/employee");
const Role = require("./lib/role");
const Department = require("./lib/department");

const addEmployeeQs = require("./lib/addEmployeeQs");
const addRoleQs = require("./lib/addRoleQs");
const addDepartmentQs = require("./lib/addDepartmentQs");
const updateEmployeeQs = require("./lib/updateEmployeeQs");
const menuQs = require("./lib/menuQs");

function viewDepartments() {
    
};

function viewRoles() {

};

function viewEmployees() {

};

function addDepartment() {
    inquirer.prompt(addDepartmentQs)
    .then(function(data) {
    });
};

function addRole() {
    inquirer.prompt(addRoleQs)
    .then(function(data) {
    });
};

function addEmployee() {
    inquirer.prompt(addEmployeeQs)
    .then(function(data) {
    });
};

function updateEmployee() {
    inquirer.prompt(updateEmployeeQs)
    .then(function(data) {
    });
};

function init() {
    inquirer.prompt(menuQs)
    .then(function(data) {
        switch (data.selections) {
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
                break;
        };
    });
};

init();
