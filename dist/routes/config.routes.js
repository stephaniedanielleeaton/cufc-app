"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const config_controller_1 = require("../controllers/config.controller");
const router = (0, express_1.Router)();
const configController = new config_controller_1.ConfigController();
router.get('/', configController.getPublicConfig);
exports.default = router;
//# sourceMappingURL=config.routes.js.map