const User = require("../models/user.model");

// Create and save a new user in the database.
exports.create = (req: { body: { name: string; role: string; email: string; password: string; }; }, res: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: { message: any; }): void; new(): any; }; }; send: (arg0: null) => void; }) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    // Create a user.
    //TODO create an interface for the user type and replace "as any" with that new interface.
    const user = new (User as any)({
        name: req.body.name,
        role: req.body.role,
        email: req.body.email,
        password: req.body.password
    });

    // Save user in the database.
    User.create(user, (err: any, data: any) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the user."
            });
        else res.send(data);
    });
};

// Retrieve all users from the database.
exports.getAll = (req: any, res: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: { message: any; }): void; new(): any; }; }; send: (arg0: any) => void; }) => {
    User.getAll((err: any, data: any) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        else res.send(data);
    });
};

// Find a single user with a userID.
exports.findOne = (req: { params: { userID: number; }; }, res: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: { message: string; }): void; new(): any; }; }; send: (arg0: any) => void; }) => {
    User.findById(req.params.userID, (err: { kind: string; }, data: any) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `No user found with userID ${req.params.userID}.`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving user with userID " + req.params.userID + "."
                });
            }
        } else res.send(data);
    });
};

// Find a single user with a email and password.
exports.findOneAuth = (req: { params: { email: string; password: string; }; }, res: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: { message: string; }): void; new(): any; }; }; send: (arg0: any) => void; }) => {
    User.findByIdAuth(req.params.email, req.params.password, (err: { kind: string; }, data: any) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Login info not found.`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving login info."
                });
            }
        } else res.send(data);
    });
};

// Update a user identified by the userID in the request.
exports.update = (req: { body: { name: string; role: string; email: string; password: string; }; params: { userID: number; }; }, res: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: { message: string; }): void; new(): any; }; }; send: (arg0: any) => void; }) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    User.updateById(
        req.params.userID,
        new (User as any)(req.body),
        (err: { kind: string; }, data: any) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `No user found with id ${req.params.userID}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating user with userID " + req.params.userID + "."
                    });
                }
            } else res.send(data);
        }
    );
};

// Delete a user with the specified userID in the request.
exports.delete = (req: { params: { userID: number; }; }, res: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: { message: string; }): void; new(): any; }; }; send: (arg0: { message: string; }) => void; }) => {
    User.remove(req.params.userID, (err: { kind: string; }, data: any) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `No user found with userID ${req.params.userID}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete user with userID " + req.params.userID + "."
                });
            }
        } else res.send({ message: `User was deleted successfully!` });
    });
};

// Delete all users from the database.
exports.deleteAll = (req: any, res: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: { message: any; }): void; new(): any; }; }; send: (arg0: { message: string; }) => void; }) => {
    User.removeAll((err: any, data: any) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all users."
            });
        else res.send({ message: `All users were deleted successfully!` });
    });
};