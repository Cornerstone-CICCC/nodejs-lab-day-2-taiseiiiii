"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.addUser = exports.loginUser = exports.getUserByUsername = void 0;
const user_model_1 = require("../models/user.model");
const getUserByUsername = (req, res) => {
    var _a;
    const username = (_a = req.session) === null || _a === void 0 ? void 0 : _a.username;
    if (!username) {
        res.status(401).json({ message: "Not authenticated" });
        return;
    }
    const user = (0, user_model_1.findByUsername)(username);
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    res.json({
        id: user.id,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
    });
};
exports.getUserByUsername = getUserByUsername;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).json({ message: "Username and password are required" });
        return;
    }
    const user = yield (0, user_model_1.login)(username, password);
    if (!user) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
    }
    if (req.session) {
        req.session.username = username;
    }
    res.json({
        message: "Login successful",
        user: {
            id: user.id,
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
        },
    });
});
exports.loginUser = loginUser;
const addUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, firstname, lastname } = req.body;
    if (!username || !password || !firstname || !lastname) {
        res.status(400).json({ message: "All fields are required" });
        return;
    }
    if ((0, user_model_1.findByUsername)(username)) {
        res.status(409).json({ message: "Username already exists" });
        return;
    }
    const user = yield (0, user_model_1.create)({ username, password, firstname, lastname });
    res.status(201).json({
        message: "User created",
        user: {
            id: user.id,
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
        },
    });
});
exports.addUser = addUser;
const logout = (req, res) => {
    req.session = null;
    res.json({ message: "Logged out" });
};
exports.logout = logout;
