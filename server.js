
// Import and require mysql2
const mysql = require('mysql2');

const cTable = require('console.table');

const inquirer = require('inquirer');


// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'Lmh2023!',
        database: 'employee_db'
    },
    console.log('Connected to employee_db database.')
);

inquirer
    .prompt([
        {
            type: 'list',
            name: 'options',
            message: 'Choose from the following options.',
            choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role']
        },
    ])
    .then((answers) => {
        // console.log(answers);
        const { options } = answers;
        if (options === 'view all departments') {
            viewDepartments();
        };

        if (options === 'view all roles') {
            viewRoles();
        };

        if (options === 'view all employees') {
            viewEmployees();
        };

        if (options === 'add a department') {
            addDepartment();
        };

        if (options === 'add a role') {
            addRole();
        };

        if (options === 'add an employee') {
            addEmployee();
        };

        if (options === 'update an employee role') {
            updateEmployee();
        };
    });

viewDepartments = async () => {
    const sql = `SELECT id, department_name AS name FROM departments`;

    try {
        const data = await db.promise().query(sql);
        console.table(data[0]);
    }
    catch (err) {
        console.log(err);
    }
};


viewRoles = async () => {
    const sql = `SELECT * FROM roles;`;

    try {
        const data = await db.promise().query(sql);
        console.table(data[0]);
    }
    catch (err) {
        console.log(err);
    }
};


viewEmployees = async () => {
    const sql = `SELECT * FROM employees;`;

    try {
        const data = await db.promise().query(sql);
        console.table(data[0]);
    }
    catch (err) {
        console.log(err);
    }
};

addDepartment = async () => {
    const sql = `INSERT INTO departments (department_name) VALUES (?)`;
    try {
        const response = await inquirer.prompt(
            [{
                type: 'input',
                name: 'name',
                message: 'What is the name of the department being added?'
            }]
        )
        const data = await db.promise().query(sql, response.name);
        console.table(data[0]);
    }
    catch (err) {
        console.log(err);
    }
};

addRole = async () => {
    const sql = `INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?);`;
    const departmentData = await db.promise().query(`SELECT * FROM departments;`);
    const departmentChoices = departmentData[0].map(({ id, department_name }) => ({
        name: department_name,
        value: id
    }))
    try {
        const response = await inquirer.prompt(
            [
                {
                    type: 'input',
                    name: 'name',
                    message: 'What is the name of the role?'
                },
                {
                    type: 'input',
                    name: 'salary',
                    message: 'What is the salary of the role?'
                },
                {
                    type: 'list',
                    name: 'departmentName',
                    message: 'What is the name of the department the role belongs to?',
                    choices: departmentChoices
                }
            ]);
        console.log(response);
        const data = await db.promise().query(sql, [response.name, response.salary, response.departmentName]);
        console.table(data[0]);
    }
    catch (err) {
        console.log(err);
    };
};

addEmployee = async () => {
    const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);`;
    const [roleChoices] = await db.promise().query(`SELECT title as name, id as value FROM roles;`);
    const [managerChoices] = await db.promise().query(`
        SELECT
            CONCAT(first_name, " ", last_name) as name, 
            id as value
            FROM employees;`);
    managerChoices.push({ "name": "None", "value": null });

    try {
        const response = await inquirer.prompt(
            [
                {
                    type: 'input',
                    name: 'firstName',
                    message: 'What is the first name of the employee being added?'
                },
                {
                    type: 'input',
                    name: 'lastName',
                    message: 'What is the last name of the employee being added?'
                },
                {
                    type: 'list',
                    name: 'role',
                    message: 'What is the role of the employee?',
                    choices: roleChoices
                },
                {
                    type: 'list',
                    name: 'manager',
                    message: 'Who is the employees manager?',
                    choices: managerChoices
                }
            ]);
        console.log(response);
        const data = await db.promise().query(sql, [response.firstName, response.lastName, response.role, response.manager]);
        console.table(data[0]);
    }
    catch (err) {
        console.log(err);
    };
};

updateEmployee = async () => {
    const sql = `UPDATE employees SET ?, WHERE ?;`
    const [employeeChoices] = await db.promise().query(`
        SELECT 
            CONCAT(first_name, " ", last_name) as name,
            id as value 
        FROM employees;`);

    const [roleChoices] = await db.promise().query(`
        SELECT 
            title as name,
            id as value
        FROM roles;`);
    
    const [managerChoices] = await db.promise().query(`
        SELECT
            CONCAT(first_name, " ", last_name) as name, 
            id as value
            FROM employees;`);
    managerChoices.push({ "name": "None", "value": null });

    try {
        const response = await inquirer.prompt(
            [
                {
                    type: 'list',
                    name: 'id',
                    message: "Which employee do you want to update?",
                    choices: employeeChoices
                },
                {
                    type: 'list',
                    name: 'role_id',
                    message: 'Which role do you want to assign the selcted employee?',
                    choices: roleChoices
                },
                {
                    type: 'list',
                    name: 'manager_id',
                    message: 'Who is the manager of the employee role?',
                    choices: managerChoices
                }
            ]);
            const {role_id, manager_id, id} = response;
        const data = await db.promise().query(sql, [{ role_id, manager_id }, {id}]);
        console.table(data[0]);
    }
    catch (err) {
        console.log(err);
    };
};

