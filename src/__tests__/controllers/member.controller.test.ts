import { MemberController } from '../../controllers/member.controller';
import { MemberService } from '../../services/member.service';
import { Request, Response } from 'express';
import { IMember, MemberDocument } from '../../models/member.model';
import { validationResult } from 'express-validator';

jest.mock('../../services/member.service');
jest.mock('express-validator');

describe('MemberController', () => {
  let controller: MemberController;
  let memberServiceMock: jest.Mocked<MemberService>;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  const mockMember: IMember = {
    auth0Id: 'auth0|test',
    display_first_name: 'John',
    display_last_name: 'Doe',
    personal_info: {
      legal_first_name: 'John',
      legal_last_name: 'Doe',
      email: 'john@example.com',
      phone: '123-456-7890',
      date_of_birth: new Date('1990-01-01'),
      address: {
        street: '123 Main St',
        city: 'Anytown',
        state: 'OH',
        zip: '12345',
        country: 'USA',
      },
    },
    role: 'student',
    is_waiver_on_file: true,
    square_customer_id: 'cust_123',
    guardian_first_name: 'Jane',
    guardian_last_name: 'Doe',
    notes: 'Test member',
  };

  beforeEach(() => {
    memberServiceMock = new MemberService() as jest.Mocked<MemberService>;
    controller = new MemberController(memberServiceMock);
    statusMock = jest.fn().mockReturnThis();
    jsonMock = jest.fn();
    req = {};
    res = { status: statusMock, json: jsonMock } as any;

  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getMyInfo', () => {
    it('should return 401 if not authenticated', async () => {
      (req as any).auth = undefined;
      await controller.getMyInfo(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({ success: false, error: 'Unauthorized' });
    });
    it('should return 404 if member not found', async () => {
      (req as any).auth = { sub: 'auth0|test' };
      memberServiceMock.getMemberByAuth0Id.mockResolvedValue(null);
      await controller.getMyInfo(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ success: false, error: 'Member not found' });
    });
    it('should return 200 and member if found', async () => {
      (req as any).auth = { sub: 'auth0|test' };
      memberServiceMock.getMemberByAuth0Id.mockResolvedValue(mockMember as MemberDocument);
      await controller.getMyInfo(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ success: true, data: mockMember });
    });
    it('should handle thrown Error and return 500', async () => {
      (req as any).auth = { sub: 'auth0|test' };
      memberServiceMock.getMemberByAuth0Id.mockRejectedValue(new Error('fail'));
      await controller.getMyInfo(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ success: false, error: 'fail' });
    });
    it('should handle thrown non-Error and return 500', async () => {
      (req as any).auth = { sub: 'auth0|test' };
      memberServiceMock.getMemberByAuth0Id.mockRejectedValue('fail');
      await controller.getMyInfo(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ success: false, error: 'An error occurred while fetching your info' });
    });
  });

  describe('updateMyInfo', () => {
    it('should return 401 if not authenticated', async () => {
      (req as any).auth = undefined;
      await controller.updateMyInfo(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({ success: false, error: 'Unauthorized' });
    });
    it('should return 404 if member not found', async () => {
      (req as any).auth = { sub: 'auth0|test' };
      memberServiceMock.updateMemberByAuth0Id.mockResolvedValue(null);
      await controller.updateMyInfo(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ success: false, error: 'Member not found' });
    });
    it('should return 200 and updated member if found', async () => {
      (req as any).auth = { sub: 'auth0|test' };
      memberServiceMock.updateMemberByAuth0Id.mockResolvedValue(mockMember as MemberDocument);
      await controller.updateMyInfo(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ success: true, data: mockMember });
    });
    it('should handle thrown Error and return 400', async () => {
      (req as any).auth = { sub: 'auth0|test' };
      memberServiceMock.updateMemberByAuth0Id.mockRejectedValue(new Error('fail'));
      await controller.updateMyInfo(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ success: false, error: 'fail' });
    });
    it('should handle thrown non-Error and return 400', async () => {
      (req as any).auth = { sub: 'auth0|test' };
      memberServiceMock.updateMemberByAuth0Id.mockRejectedValue('fail');
      await controller.updateMyInfo(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ success: false, error: 'An error occurred while updating your info' });
    });
  });

  describe('createMember', () => {
    it('should handle validation errors and return 422', async () => {
      jest.spyOn(require('express-validator'), 'validationResult').mockReturnValue({ isEmpty: () => false, array: () => [{ msg: 'Validation failed' }] } as any);
      await controller.createMember(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(422);
      expect(jsonMock).toHaveBeenCalledWith({ success: false, errors: [{ msg: 'Validation failed' }] });
    });
    it('should create a new member and return 201', async () => {
      jest.spyOn(require('express-validator'), 'validationResult').mockReturnValue({ isEmpty: () => true } as any);
      memberServiceMock.createMember.mockResolvedValue(mockMember as MemberDocument);
      req.body = mockMember;
      await controller.createMember(req as Request, res as Response);
      expect(memberServiceMock.createMember).toHaveBeenCalledWith(mockMember);
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({ success: true, data: mockMember });
    });
    it('should handle errors and return 400 for thrown Error', async () => {
      jest.spyOn(require('express-validator'), 'validationResult').mockReturnValue({ isEmpty: () => true } as any);
      memberServiceMock.createMember.mockRejectedValue(new Error('fail'));
      req.body = mockMember;
      await controller.createMember(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ success: false, error: 'fail' });
    });
    it('should handle errors and return 400 for thrown non-Error', async () => {
      jest.spyOn(require('express-validator'), 'validationResult').mockReturnValue({ isEmpty: () => true } as any);
      memberServiceMock.createMember.mockRejectedValue('fail');
      req.body = mockMember;
      await controller.createMember(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ success: false, error: 'An error occurred while creating the member' });
    });
  });

  describe('getAllMembers', () => {
    it('should return all members with 200', async () => {
      memberServiceMock.getAllMembers.mockResolvedValue([mockMember as MemberDocument]);
      req.query = {};
      await controller.getAllMembers(req as Request, res as Response);
      expect(memberServiceMock.getAllMembers).toHaveBeenCalledWith({});
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ success: true, count: 1, data: [mockMember] });
    });
    it('should handle errors and return 500 for thrown Error', async () => {
      memberServiceMock.getAllMembers.mockRejectedValue(new Error('fail'));
      req.query = {};
      await controller.getAllMembers(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ success: false, error: 'fail' });
    });
    it('should handle errors and return 500 for thrown non-Error', async () => {
      memberServiceMock.getAllMembers.mockRejectedValue('fail');
      req.query = {};
      await controller.getAllMembers(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ success: false, error: 'An error occurred while fetching members' });
    });
  });

  describe('getMemberById', () => {
    it('should return member data with 200', async () => {
      memberServiceMock.getMemberById.mockResolvedValue(mockMember as MemberDocument);
      req.params = { id: '1' };
      await controller.getMemberById(req as Request, res as Response);
      expect(memberServiceMock.getMemberById).toHaveBeenCalledWith('1');
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ success: true, data: mockMember });
    });
    it('should return 404 if member not found', async () => {
      memberServiceMock.getMemberById.mockResolvedValue(null);
      req.params = { id: '1' };
      await controller.getMemberById(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ success: false, error: 'Member not found' });
    });
    it('should return 400 for invalid member id', async () => {
      memberServiceMock.getMemberById.mockRejectedValue(new Error('Invalid member ID'));
      req.params = { id: 'badid' };
      await controller.getMemberById(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ success: false, error: 'Invalid member ID' });
    });
    it('should handle other errors and return 500', async () => {
      memberServiceMock.getMemberById.mockRejectedValue(new Error('fail'));
      req.params = { id: '1' };
      await controller.getMemberById(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ success: false, error: 'fail' });
    });
    it('should handle thrown non-Error and return 500', async () => {
      memberServiceMock.getMemberById.mockRejectedValue('fail');
      req.params = { id: '1' };
      await controller.getMemberById(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ success: false, error: 'An error occurred while fetching the member' });
    });
  });

  describe('updateMember', () => {
    it('should update member and return 200', async () => {
      memberServiceMock.updateMember.mockResolvedValue(mockMember as MemberDocument);
      req.params = { id: '1' };
      req.body = mockMember;
      await controller.updateMember(req as Request, res as Response);
      expect(memberServiceMock.updateMember).toHaveBeenCalledWith('1', mockMember);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ success: true, data: mockMember });
    });
    it('should return 404 if member not found', async () => {
      memberServiceMock.updateMember.mockResolvedValue(null);
      req.params = { id: '1' };
      req.body = mockMember;
      await controller.updateMember(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ success: false, error: 'Member not found' });
    });
    it('should return 400 for invalid member id', async () => {
      memberServiceMock.updateMember.mockRejectedValue(new Error('Invalid member ID'));
      req.params = { id: 'badid' };
      req.body = mockMember;
      await controller.updateMember(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ success: false, error: 'Invalid member ID' });
    });
    it('should handle other errors and return 500', async () => {
      memberServiceMock.updateMember.mockRejectedValue(new Error('fail'));
      req.params = { id: '1' };
      req.body = mockMember;
      await controller.updateMember(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ success: false, error: 'fail' });
    });
    it('should handle thrown non-Error and return 500', async () => {
      memberServiceMock.updateMember.mockRejectedValue('fail');
      req.params = { id: '1' };
      req.body = mockMember;
      await controller.updateMember(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ success: false, error: 'An error occurred while updating the member' });
    });
  });

  describe('deleteMember', () => {
    it('should delete member and return 200', async () => {
      memberServiceMock.deleteMember.mockResolvedValue(mockMember as MemberDocument);
      req.params = { id: '1' };
      await controller.deleteMember(req as Request, res as Response);
      expect(memberServiceMock.deleteMember).toHaveBeenCalledWith('1');
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ success: true, data: {} });
    });
    it('should return 404 if member not found', async () => {
      memberServiceMock.deleteMember.mockResolvedValue(null);
      req.params = { id: '1' };
      await controller.deleteMember(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ success: false, error: 'Member not found' });
    });
    it('should return 400 for invalid member id', async () => {
      memberServiceMock.deleteMember.mockRejectedValue(new Error('Invalid member ID'));
      req.params = { id: 'badid' };
      await controller.deleteMember(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ success: false, error: 'Invalid member ID' });
    });
    it('should handle other errors and return 500', async () => {
      memberServiceMock.deleteMember.mockRejectedValue(new Error('fail'));
      req.params = { id: '1' };
      await controller.deleteMember(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ success: false, error: 'fail' });
    });
    it('should handle thrown non-Error and return 500', async () => {
      memberServiceMock.deleteMember.mockRejectedValue('fail');
      req.params = { id: '1' };
      await controller.deleteMember(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ success: false, error: 'An error occurred while deleting the member' });
    });
  });
});
