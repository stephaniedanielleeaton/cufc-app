"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberService = void 0;
const member_model_1 = __importDefault(require("../models/member.model"));
const mongoose_1 = __importDefault(require("mongoose"));
class MemberService {
    async getMemberByAuth0Id(auth0Id) {
        try {
            return await member_model_1.default.findOne({ auth0Id });
        }
        catch (error) {
            throw this.handleError(error);
        }
    }
    async updateMemberByAuth0Id(auth0Id, updateData) {
        try {
            return await member_model_1.default.findOneAndUpdate({ auth0Id }, updateData, { new: true, runValidators: true });
        }
        catch (error) {
            throw this.handleError(error);
        }
    }
    async createMember(memberData) {
        try {
            const member = new member_model_1.default(memberData);
            return await member.save();
        }
        catch (error) {
            throw this.handleError(error);
        }
    }
    async getAllMembers(query = {}) {
        try {
            return await member_model_1.default.find(query);
        }
        catch (error) {
            throw this.handleError(error);
        }
    }
    async getMemberById(id) {
        try {
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                throw new Error('Invalid member ID');
            }
            return await member_model_1.default.findById(id);
        }
        catch (error) {
            throw this.handleError(error);
        }
    }
    async updateMember(id, updateData) {
        try {
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                throw new Error('Invalid member ID');
            }
            return await member_model_1.default.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        }
        catch (error) {
            throw this.handleError(error);
        }
    }
    async deleteMember(id) {
        try {
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                throw new Error('Invalid member ID');
            }
            return await member_model_1.default.findByIdAndDelete(id);
        }
        catch (error) {
            throw this.handleError(error);
        }
    }
    handleError(error) {
        if (error.name === 'ValidationError') {
            return new Error(`Validation Error: ${error.message}`);
        }
        if (error.code === 11000) {
            return new Error('Duplicate key error: A member with this email already exists');
        }
        return error instanceof Error ? error : new Error('An unknown error occurred');
    }
}
exports.MemberService = MemberService;
//# sourceMappingURL=member.service.js.map