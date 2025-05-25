import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { MemberService } from '../services/member.service';

export class MemberController {
  private readonly memberService: MemberService;

  constructor(memberService = new MemberService()) {
    this.memberService = memberService;
  }

  // GET /api/members/me
  async getMyInfo(req: Request & { auth?: any }, res: Response): Promise<void> {
    const auth0Id = req.auth?.sub;
    if (!auth0Id) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }
    try {
      const member = await this.memberService.getMemberByAuth0Id(auth0Id);
      if (!member) {
        res.status(404).json({ success: false, error: 'Member not found' });
        return;
      }
      res.status(200).json({ success: true, data: member });
    } catch (error) {
      res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'An error occurred while fetching your info' });
    }
  }

  // PUT /api/members/me
  async updateMyInfo(req: Request & { auth?: any }, res: Response): Promise<void> {
    const auth0Id = req.auth?.sub;
    if (!auth0Id) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }
    try {
      const updated = await this.memberService.updateMemberByAuth0Id(auth0Id, req.body);
      if (!updated) {
        res.status(404).json({ success: false, error: 'Member not found' });
        return;
      }
      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      res.status(400).json({ success: false, error: error instanceof Error ? error.message : 'An error occurred while updating your info' });
    }
  }
 
  // POST /api/members
  async createMember(req: Request, res: Response): Promise<void> {
    // Handle validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({
        success: false,
        errors: errors.array()
      });
      return;
    }
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
