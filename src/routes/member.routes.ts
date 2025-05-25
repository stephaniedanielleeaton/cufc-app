import { Router } from 'express';
import { MemberController } from '../controllers/member.controller';
import { checkJwt } from '../middleware/auth0.middleware';
import rateLimit from 'express-rate-limit';
import { body } from 'express-validator';

const router = Router();
const memberController = new MemberController();

// Rate limiter for creating members (e.g., 5 requests per IP per hour)
const createMemberLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: 'Too many membership submissions from this IP, please try again later.'
});

// Validation for member creation (customize fields as needed)
const createMemberValidation = [
  body('firstName').isString().notEmpty().withMessage('First name is required'),
  body('lastName').isString().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  // Add more field validations as needed
];

// Public route: anyone can create a member, but with validation and rate limiting
router.post(
  '/',
  createMemberLimiter,
  createMemberValidation,
  memberController.createMember.bind(memberController)
);

// Self-service routes: authenticated members can view and update their own info
router.get('/me', checkJwt, memberController.getMyInfo.bind(memberController));
router.put('/me', checkJwt, memberController.updateMyInfo.bind(memberController));

// Protected routes: only authenticated users can access
router.get('/', checkJwt, memberController.getAllMembers.bind(memberController));
router.get('/:id', checkJwt, memberController.getMemberById.bind(memberController));
router.put('/:id', checkJwt, memberController.updateMember.bind(memberController));
router.delete('/:id', checkJwt, memberController.deleteMember.bind(memberController));

export default router;
