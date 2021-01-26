var express = require('express');
var router = express.Router();
const user = require("../controllers/user.controller");

// Create a new user.
router.post("/", function (req: any, res: any, next: any) {
    user.create(req, res);
});

// Retrieve all users.
router.get("/", function (req: any, res: any, next: any) {
    user.getAll(req, res);
});

// Retrieve a single user with userID.
router.get("/:userID", function (req: any, res: any, next: any) {
    user.findOne(req, res);
});

// Retrieve a single user with email and password.
router.get("/auth/:email/:password", function (req: any, res: any, next: any) {
    user.findOneAuth(req, res);
});

// Update a user with userID.
router.put("/:userID", function (req: any, res: any, next: any) {
    user.update(req, res);
});

// Delete a user with userID.
router.delete("/:userID", function (req: any, res: any, next: any) {
    user.delete(req, res);
});

// Delete all users.
router.delete("/", function (req: any, res: any, next: any) {
    user.deleteAll(req, res);
});

module.exports = router;