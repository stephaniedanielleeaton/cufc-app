"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const member_controller_1 = require("../controllers/member.controller");
const auth0_middleware_1 = require("../middleware/auth0.middleware");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
const memberController = new member_controller_1.MemberController();
const createMemberLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: 'Too many membership submissions from this IP, please try again later.'
});
const createMemberValidation = [
    (0, express_validator_1.body)('firstName').isString().notEmpty().withMessage('First name is required'),
    (0, express_validator_1.body)('lastName').isString().notEmpty().withMessage('Last name is required'),
    (0, express_validator_1.body)('email').isEmail().withMessage('Valid email is required'),
];
router.post('/', createMemberLimiter, createMemberValidation, memberController.createMember.bind(memberController));
router.get('/me', auth0_middleware_1.checkJwt, memberController.getMyInfo.bind(memberController));
router.put('/me', auth0_middleware_1.checkJwt, memberController.updateMyInfo.bind(memberController));
router.get('/', auth0_middleware_1.checkJwt, memberController.getAllMembers.bind(memberController));
router.get('/:id', auth0_middleware_1.checkJwt, memberController.getMemberById.bind(memberController));
router.put('/:id', auth0_middleware_1.checkJwt, memberController.updateMember.bind(memberController));
router.delete('/:id', auth0_middleware_1.checkJwt, memberController.deleteMember.bind(memberController));
exports.default = router;
//# sourceMappingURL=member.routes.js.map