const sql = require("./db");

// Constructor
//TODO create an interface for the user type and replace "any" with that new interface.
const User = function (this: any, user: { name: string; role: string; email: string; password: string; }) {
    this.name = user.name;
    this.role = user.role;
    this.email = user.email;
    this.password = user.password;
};

User.create = (newUser: any, result: (arg0: null, arg1: null) => void) => {

    var connection = sql.createNewConnection();

    connection.connect();

    connection.query("INSERT INTO user SET ?", newUser, (err: any, res: { insertId: any; }) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("Created user: ", { id: res.insertId, ...newUser });
        result(null, { id: res.insertId, ...newUser });
    });

    connection.end();
};

User.getAll = (result: (arg0: null, arg1: any) => void) => {

    var connection = sql.createNewConnection();

    connection.connect();

    connection.query("SELECT * FROM user", (err: any, res: any[]) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log("Retrieved the following users: ", res);
        result(null, res);
    });

    connection.end();
};

User.findById = (userID: number, result: any) => {

    var connection = sql.createNewConnection();

    connection.connect();

    connection.query(`SELECT * FROM user WHERE userID = ${userID}`, (err: any, res: any[]) => {
        if (err) {
            console.log("Error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("Found user by ID: ", res);
            result(null, res);
            return;
        }

        // no user found with the userID
        result({ kind: "not_found" }, null);
    });

    connection.end();
};

User.findByIdAuth = (email: string, password: string, result: any) => {

    var connection = sql.createNewConnection();

    connection.connect();

    connection.query("SELECT * FROM user WHERE email = ? AND password = ?", [email, password], (err: any, res: any[]) => {
        if (err) {
            console.log("Error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("Found user with the given credentials: ", res);
            result(null, res);
            return;
        }

        // no user found with specified email and password
        result({ kind: "not_found" }, null);
    });

    connection.end();
};

User.updateById = (userID: number, user: any, result: any) => {

    var connection = sql.createNewConnection();

    connection.connect();

    connection.query(
        "UPDATE user SET name = ?, role = ?, email = ?, password = ? WHERE userID = ?",
        [user.name, user.role, user.email, user.password, userID],
        (err: any, res: { affectedRows: number; }) => {
            if (err) {
                console.log("Error: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                // no user found with the id
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("Updated user: ", { userID: userID, ...user });
            result(null, { userID: userID, ...user });
        }
    );

    connection.end();
};

User.remove = (userID: number, result: any) => {

    var connection = sql.createNewConnection();

    connection.connect();

    connection.query("DELETE FROM user WHERE userID = ?", userID, (err: any, res: { affectedRows: number; }) => {
        if (err) {
            console.log("Error: ", err);
            result(null, err);
            return;
        }

        if (res.affectedRows == 0) {
            // no user found with the id
            result({ kind: "not_found" }, null);
            return;
        }

        console.log("Deleted user with userID: ", userID);
        result(null, res);
    });

    connection.end();
};

User.removeAll = (result: (arg0: null, arg1: any) => void) => {

    var connection = sql.createNewConnection();

    connection.connect();
    
    connection.query("DELETE FROM user", (err: any, res: { affectedRows: any; }) => {
        if (err) {
            console.log("Error: ", err);
            result(null, err);
            return;
        }

        console.log(`Deleted ${res.affectedRows} users.`);
        result(null, res);
    });

    connection.query("ALTER TABLE user AUTO_INCREMENT = 1");

    connection.end();
};

module.exports = User;