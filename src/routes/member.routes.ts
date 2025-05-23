import { Router } from 'express';
import { MemberController } from '../controllers/member.controller';

const router = Router();
const memberController = new MemberController();

router.get('/', memberController.getAllMembers.bind(memberController));
router.get('/:id', memberController.getMemberById.bind(memberController));
router.post('/', memberController.createMember.bind(memberController));
router.put('/:id', memberController.updateMember.bind(memberController));
router.delete('/:id', memberController.deleteMember.bind(memberController));

export default router;
