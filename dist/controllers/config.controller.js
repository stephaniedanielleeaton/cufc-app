"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigController = void 0;
class ConfigController {
    async getPublicConfig(_req, res) {
        const publicConfig = {
            testVar: process.env.WEB_CLIENT_TEST_VAR || 'default_test_value',
            environment: process.env.NODE_ENV || 'development'
        };
        res.json(publicConfig);
    }
}
exports.ConfigController = ConfigController;
//# sourceMappingURL=config.controller.js.map