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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLogout = exports.postLogin = exports.getLogin = exports.postSignup = exports.getSignup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = __importDefault(require("../models/user"));
const getSignup = (req, res) => {
    res.render("signup");
};
exports.getSignup = getSignup;
const postSignup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const user = new user_1.default({ username, password: hashedPassword });
        yield user.save();
        res.redirect("/login");
    }
    catch (error) {
        console.error(error);
        res.redirect("/signup");
    }
});
exports.postSignup = postSignup;
const getLogin = (req, res) => {
    res.render("login");
};
exports.getLogin = getLogin;
const postLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const user = yield user_1.default.findOne({ username });
        if (!user || !(yield bcrypt_1.default.compare(password, user.password))) {
            return res.redirect("/login");
        }
        req.session.userID = user.id;
        res.redirect("/profile");
    }
    catch (error) {
        console.error(error);
        res.redirect("/login");
    }
});
exports.postLogin = postLogin;
const getLogout = (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
};
exports.getLogout = getLogout;
