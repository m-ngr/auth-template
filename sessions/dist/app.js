"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_session_1 = __importDefault(require("express-session"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const profile_1 = __importDefault(require("./routes/profile"));
const auth_1 = __importDefault(require("./routes/auth"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const port = process.env.PORT || 4000;
const mongoClientP = mongoose_1.default
    .connect(process.env.MONGO_URI)
    .then((m) => m.connection.getClient())
    .catch((err) => {
    console.error("Failed to connect to the database", err);
    process.exit(1);
});
const sessionStore = connect_mongo_1.default.create({
    clientPromise: mongoClientP,
    stringify: false,
});
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
    },
}));
app.set("views", path_1.default.join(__dirname, "/views"));
app.set("view engine", "ejs");
app.use(express_1.default.static(__dirname + "/public"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(auth_1.default);
app.use(profile_1.default);
app.get("/", (req, res) => {
    if (req.session.userID)
        return res.redirect("/profile");
    res.redirect("/login");
});
app.use((err, req, res, next) => {
    res.status(500).json({ error: err });
});
app.listen(port, () => {
    console.log("Server is listening on port", port);
});
