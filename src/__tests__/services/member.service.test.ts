import Member, { IMember, MemberDocument } from '../../models/member.model';
import { MemberService } from '../../services/member.service';
import mongoose from 'mongoose';

jest.mock('../../models/member.model');

const mockMemberData: IMember = {
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

describe('MemberService', () => {
  let service: MemberService;
  let memberModelMock: jest.Mocked<typeof Member>;
  let memberInstanceMock: Partial<MemberDocument>;

  beforeEach(() => {
    service = new MemberService();
    memberModelMock = Member as any;
    memberInstanceMock = {
      save: jest.fn().mockResolvedValue({ ...mockMemberData, _id: '507f1f77bcf86cd799439011' }),
      toObject: jest.fn().mockReturnValue(mockMemberData),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handleError', () => {
    it('should return duplicate key error for code 11000', () => {
      const service = new MemberService();
      const error = 'some string error';
      const result = (service as any).handleError(error);
      expect(result).toBeInstanceOf(Error);
      expect(result.message).toBe('An unknown error occurred');
    });

    it('should return duplicate key error for code 11000', () => {
      const service = new MemberService();
      const error = { code: 11000 };
      const result = (service as any).handleError(error);
      expect(result).toBeInstanceOf(Error);
      expect(result.message).toBe('Duplicate key error: A member with this email already exists');
    });
  });

  describe('createMember', () => {
    it('should create and save a new member', async () => {
      const saveMock = jest.fn().mockResolvedValue({ ...mockMemberData, _id: '507f1f77bcf86cd799439011' });
      (Member as any).mockImplementation(() => ({ ...mockMemberData, save: saveMock }));
      const result = await service.createMember(mockMemberData);
      expect(saveMock).toHaveBeenCalled();
      expect(result).toMatchObject({ ...mockMemberData, _id: expect.anything() });
    });

    it('should throw a validation error', async () => {
      (Member as any).mockImplementation(() => ({ save: jest.fn().mockRejectedValue({ name: 'ValidationError', message: 'Invalid' }) }));
      await expect(service.createMember(mockMemberData)).rejects.toThrow('Validation Error: Invalid');
    });
  });

  describe('getAllMembers', () => {
    it('should return all members', async () => {
      memberModelMock.find = jest.fn().mockResolvedValue([mockMemberData]);
      const result = await service.getAllMembers();
      expect(memberModelMock.find).toHaveBeenCalledWith({});
      expect(result).toEqual([mockMemberData]);
    });

    it('should handle errors', async () => {
      memberModelMock.find = jest.fn().mockRejectedValue(new Error('Database error'));
      await expect(service.getAllMembers()).rejects.toThrow('Database error');
    });
  });

  describe('getMemberById', () => {
    it('should return a member by id', async () => {
      memberModelMock.findById = jest.fn().mockResolvedValue(mockMemberData);
      jest.spyOn(mongoose.Types.ObjectId, 'isValid').mockReturnValue(true);
      const result = await service.getMemberById('507f1f77bcf86cd799439011');
      expect(memberModelMock.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(result).toEqual(mockMemberData);
    });

    it('should throw error for invalid id', async () => {
      jest.spyOn(mongoose.Types.ObjectId, 'isValid').mockReturnValue(false);
      await expect(service.getMemberById('badid')).rejects.toThrow('Invalid member ID');
    });

    it('should handle errors', async () => {
      memberModelMock.findById = jest.fn().mockRejectedValue(new Error('Database error'));
      jest.spyOn(mongoose.Types.ObjectId, 'isValid').mockReturnValue(true);
      await expect(service.getMemberById('507f1f77bcf86cd799439011')).rejects.toThrow('Database error');
    });
  });

  describe('updateMember', () => {
    it('should update and return the member', async () => {
      memberModelMock.findByIdAndUpdate = jest.fn().mockResolvedValue(mockMemberData);
      jest.spyOn(mongoose.Types.ObjectId, 'isValid').mockReturnValue(true);
      const result = await service.updateMember('507f1f77bcf86cd799439011', { display_first_name: 'Jane' });
      expect(memberModelMock.findByIdAndUpdate).toHaveBeenCalledWith('507f1f77bcf86cd799439011', { display_first_name: 'Jane' }, { new: true, runValidators: true });
      expect(result).toEqual(mockMemberData);
    });

    it('should throw error for invalid id', async () => {
      jest.spyOn(mongoose.Types.ObjectId, 'isValid').mockReturnValue(false);
      await expect(service.updateMember('badid', {})).rejects.toThrow('Invalid member ID');
    });

    it('should handle errors', async () => {
      memberModelMock.findByIdAndUpdate = jest.fn().mockRejectedValue(new Error('Database error'));
      jest.spyOn(mongoose.Types.ObjectId, 'isValid').mockReturnValue(true);
      await expect(service.updateMember('507f1f77bcf86cd799439011', {})).rejects.toThrow('Database error');
    });
  });

  describe('deleteMember', () => {
    it('should delete and return the member', async () => {
      memberModelMock.findByIdAndDelete = jest.fn().mockResolvedValue(mockMemberData);
      jest.spyOn(mongoose.Types.ObjectId, 'isValid').mockReturnValue(true);
      const result = await service.deleteMember('507f1f77bcf86cd799439011');
      expect(memberModelMock.findByIdAndDelete).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(result).toEqual(mockMemberData);
    });

    it('should throw error for invalid id', async () => {
      jest.spyOn(mongoose.Types.ObjectId, 'isValid').mockReturnValue(false);
      await expect(service.deleteMember('badid')).rejects.toThrow('Invalid member ID');
    });

    it('should handle errors', async () => {
      memberModelMock.findByIdAndDelete = jest.fn().mockRejectedValue(new Error('Database error'));
      jest.spyOn(mongoose.Types.ObjectId, 'isValid').mockReturnValue(true);
      await expect(service.deleteMember('507f1f77bcf86cd799439011')).rejects.toThrow('Database error');
    });
  });
});
