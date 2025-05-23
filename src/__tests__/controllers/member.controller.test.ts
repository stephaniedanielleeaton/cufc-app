import { MemberController } from '../../controllers/member.controller';
import { MemberService } from '../../services/member.service';
import { Request, Response } from 'express';
import { IMember, MemberDocument } from '../../models/member.model';

jest.mock('../../services/member.service');

describe('MemberController', () => {
  let controller: MemberController;
  let memberServiceMock: jest.Mocked<MemberService>;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  const mockMember: IMember = {
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

  describe('createMember', () => {
    it('should create a new member and return 201', async () => {
      memberServiceMock.createMember.mockResolvedValue(mockMember as MemberDocument);
      req.body = mockMember;
      await controller.createMember(req as Request, res as Response);
      expect(memberServiceMock.createMember).toHaveBeenCalledWith(mockMember);
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({ success: true, data: mockMember });
    });

    it('should handle errors and return 400 for non-Error thrown', async () => {
      memberServiceMock.createMember.mockRejectedValue({}); // not an Error instance
      req.body = mockMember;
      await controller.createMember(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ success: false, error: 'An error occurred while creating the member' });
    });

    it('should handle non-Error thrown in getAllMembers', async () => {
      memberServiceMock.getAllMembers.mockRejectedValue({});
      req.query = {};
      await controller.getAllMembers(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ success: false, error: 'An error occurred while fetching members' });
    });

    it('should handle non-Error thrown in getMemberById', async () => {
      memberServiceMock.getMemberById.mockRejectedValue({});
      req.params = { id: '1' };
      await controller.getMemberById(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ success: false, error: 'An error occurred while fetching the member' });
    });

    it('should handle non-Error thrown in updateMember', async () => {
      memberServiceMock.updateMember.mockRejectedValue({});
      req.params = { id: '1' };
      req.body = mockMember;
      await controller.updateMember(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ success: false, error: 'An error occurred while updating the member' });
    });

    it('should handle non-Error thrown in deleteMember', async () => {
      memberServiceMock.deleteMember.mockRejectedValue({});
      req.params = { id: '1' };
      await controller.deleteMember(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ success: false, error: 'An error occurred while deleting the member' });
    });

    it('should handle errors and return 400', async () => {
      memberServiceMock.createMember.mockRejectedValue(new Error('Validation error'));
      req.body = mockMember;
      await controller.createMember(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ success: false, error: 'Validation error' });
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

    it('should handle errors and return 500', async () => {
      memberServiceMock.getAllMembers.mockRejectedValue(new Error('Database error'));
      req.query = {};
      await controller.getAllMembers(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ success: false, error: 'Database error' });
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
      memberServiceMock.getMemberById.mockRejectedValue(new Error('Database error'));
      req.params = { id: '1' };
      await controller.getMemberById(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ success: false, error: 'Database error' });
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
      memberServiceMock.updateMember.mockRejectedValue(new Error('Database error'));
      req.params = { id: '1' };
      req.body = mockMember;
      await controller.updateMember(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ success: false, error: 'Database error' });
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
      memberServiceMock.deleteMember.mockRejectedValue(new Error('Database error'));
      req.params = { id: '1' };
      await controller.deleteMember(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ success: false, error: 'Database error' });
    });
  });
});
