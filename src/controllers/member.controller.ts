import { Request, Response } from 'express';
import { MemberService } from '../services/member.service';

export class MemberController {
  private memberService: MemberService;

  constructor(memberService = new MemberService()) {
    this.memberService = memberService;
  }
  // POST /api/members
  async createMember(req: Request, res: Response): Promise<void> {
    try {
      const member = await this.memberService.createMember(req.body);
      res.status(201).json({
        success: true,
        data: member
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred while creating the member'
      });
    }
  }

  // GET /api/members
  async getAllMembers(req: Request, res: Response): Promise<void> {
    try {
      const members = await this.memberService.getAllMembers(req.query);
      res.status(200).json({
        success: true,
        count: members.length,
        data: members
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred while fetching members'
      });
    }
  }

  // GET /api/members/:id
  async getMemberById(req: Request, res: Response): Promise<void> {
    try {
      const member = await this.memberService.getMemberById(req.params.id);
      
      if (!member) {
        res.status(404).json({
          success: false,
          error: 'Member not found'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        data: member
      });
    } catch (error) {
      res.status(error instanceof Error && error.message === 'Invalid member ID' ? 400 : 500).json({
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred while fetching the member'
      });
    }
  }

  // PUT /api/members/:id
  async updateMember(req: Request, res: Response): Promise<void> {
    try {
      const member = await this.memberService.updateMember(req.params.id, req.body);
      
      if (!member) {
        res.status(404).json({
          success: false,
          error: 'Member not found'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        data: member
      });
    } catch (error) {
      res.status(error instanceof Error && error.message === 'Invalid member ID' ? 400 : 500).json({
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred while updating the member'
      });
    }
  }

  // DELETE /api/members/:id
  async deleteMember(req: Request, res: Response): Promise<void> {
    try {
      const member = await this.memberService.deleteMember(req.params.id);
      
      if (!member) {
        res.status(404).json({
          success: false,
          error: 'Member not found'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        data: {}
      });
    } catch (error) {
      res.status(error instanceof Error && error.message === 'Invalid member ID' ? 400 : 500).json({
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred while deleting the member'
      });
    }
  }
}
