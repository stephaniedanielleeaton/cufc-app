import { Request, Response } from 'express';
import { MemberService } from '../services/member.service';
export declare class MemberController {
    private readonly memberService;
    constructor(memberService?: MemberService);
    getMyInfo(req: Request & {
        auth?: any;
    }, res: Response): Promise<void>;
    updateMyInfo(req: Request & {
        auth?: any;
    }, res: Response): Promise<void>;
    createMember(req: Request, res: Response): Promise<void>;
    getAllMembers(req: Request, res: Response): Promise<void>;
    getMemberById(req: Request, res: Response): Promise<void>;
    updateMember(req: Request, res: Response): Promise<void>;
    deleteMember(req: Request, res: Response): Promise<void>;
}
