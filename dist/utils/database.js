"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectDB = exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("../config");
const options = {
    autoIndex: true,
    autoCreate: true
};
const connectDB = async () => {
    try {
        if (!config_1.config.mongo.uri) {
            throw new Error('MongoDB URI is not defined in environment variables');
        }
        const connection = await mongoose_1.default.connect(config_1.config.mongo.uri, options);
        console.log(`MongoDB Connected: ${connection.connection.host}`);
    }
    catch (error) {
        console.error(`Error connecting to MongoDB: ${error instanceof Error ? error.message : 'Unknown error'}`);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
const disconnectDB = async () => {
    try {
        await mongoose_1.default.disconnect();
        console.log('MongoDB Disconnected');
    }
    catch (error) {
        console.error(`Error disconnecting from MongoDB: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};
exports.disconnectDB = disconnectDB;
//# sourceMappingURL=database.js.map