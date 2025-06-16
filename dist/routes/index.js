"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const member_routes_1 = __importDefault(require("./member.routes"));
const config_routes_1 = __importDefault(require("./config.routes"));
const router = (0, express_1.Router)();
router.use('/members', member_routes_1.default);
router.use('/config', config_routes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map