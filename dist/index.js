"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const database_1 = require("./utils/database");
const routes_1 = __importDefault(require("./routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT ?? 3001;
(0, database_1.connectDB)()
    .then(() => console.log('MongoDB connection established'))
    .catch(err => console.error('MongoDB connection error:', err));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/api', routes_1.default);
app.get('/api/test', (_req, res) => {
    res.json({ value: 'Hello from backend!' });
});
const staticPath = path_1.default.join(process.cwd(), 'cufc-frontend', 'dist');
console.log('Serving static files from:', staticPath);
console.log('Path exists:', fs_1.default.existsSync(staticPath));
console.log('Files inside:', fs_1.default.readdirSync(staticPath));
console.log('Serving static files from:', staticPath);
if (!fs_1.default.existsSync(path_1.default.join(staticPath, 'index.html'))) {
    console.error('❌ index.html not found. Did you run `npm run build` in cufc-frontend?');
}
else {
    app.use(express_1.default.static(staticPath));
    app.get('/*', (_req, res) => {
        res.sendFile(path_1.default.join(staticPath, 'index.html'));
    });
}
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
exports.default = app;
//# sourceMappingURL=index.js.map