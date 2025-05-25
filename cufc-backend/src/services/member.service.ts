import Member, { IMember, MemberDocument } from '../models/member.model';
import mongoose from 'mongoose';

export class MemberService {

  async getMemberByAuth0Id(auth0Id: string): Promise<MemberDocument | null> {
    try {
      return await Member.findOne({ auth0Id });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateMemberByAuth0Id(auth0Id: string, updateData: Partial<IMember>): Promise<MemberDocument | null> {
    try {
      return await Member.findOneAndUpdate(
        { auth0Id },
        updateData,
        { new: true, runValidators: true }
      );
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createMember(memberData: Partial<IMember>): Promise<MemberDocument> {
    try {
      const member = new Member(memberData);
      return await member.save();
    } catch (error) {
      throw this.handleError(error);
    }
  }


  async getAllMembers(query: any = {}): Promise<MemberDocument[]> {
    try {
      return await Member.find(query);
    } catch (error) {
      throw this.handleError(error);
    }
  }


  async getMemberById(id: string): Promise<MemberDocument | null> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid member ID');
      }
      return await Member.findById(id);
    } catch (error) {
      throw this.handleError(error);
    }
  }


  async updateMember(id: string, updateData: Partial<IMember>): Promise<MemberDocument | null> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid member ID');
      }
      return await Member.findByIdAndUpdate(
        id, 
        updateData, 
        { new: true, runValidators: true }
      );
    } catch (error) {
      throw this.handleError(error);
    }
  }


  async deleteMember(id: string): Promise<MemberDocument | null> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid member ID');
      }
      return await Member.findByIdAndDelete(id);
    } catch (error) {
      throw this.handleError(error);
    }
  }


  private handleError(error: any): Error {
    if (error.name === 'ValidationError') {
      return new Error(`Validation Error: ${error.message}`);
    }
    if (error.code === 11000) {
      return new Error('Duplicate key error: A member with this email already exists');
    }
    return error instanceof Error ? error : new Error('An unknown error occurred');
  }
}
