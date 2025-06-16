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
const isProduction = process.env.NODE_ENV === 'production';
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
if (isProduction) {
    const viteBuildPath = path_1.default.join(__dirname, '../cufc-frontend/dist');
    const herokuBuildPath = path_1.default.join(__dirname, '../../client/build');
    const rootBuildPath = path_1.default.join(__dirname, '../build');
    [viteBuildPath, herokuBuildPath, rootBuildPath].forEach(buildPath => {
        if (fs_1.default.existsSync(path_1.default.join(buildPath, 'index.html'))) {
            console.log(`Serving static files from ${buildPath}`);
            app.use(express_1.default.static(buildPath));
            app.get('*', (_req, res) => {
                res.sendFile(path_1.default.join(buildPath, 'index.html'));
            });
        }
    });
}
app.listen(PORT, () => {
    console.log(`Server is running in ${isProduction ? 'production' : 'development'} mode on port ${PORT}`);
});
exports.default = app;
//# sourceMappingURL=index.js.map