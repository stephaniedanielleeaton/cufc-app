"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberController = void 0;
const express_validator_1 = require("express-validator");
const member_service_1 = require("../services/member.service");
class MemberController {
    constructor(memberService = new member_service_1.MemberService()) {
        this.memberService = memberService;
    }
    async getMyInfo(req, res) {
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
        }
        catch (error) {
            res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'An error occurred while fetching your info' });
        }
    }
    async updateMyInfo(req, res) {
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
        }
        catch (error) {
            res.status(400).json({ success: false, error: error instanceof Error ? error.message : 'An error occurred while updating your info' });
        }
    }
    async createMember(req, res) {
        const errors = (0, express_validator_1.validationResult)(req);
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
        }
        catch (error) {
            res.status(400).json({
                success: false,
                error: error instanceof Error ? error.message : 'An error occurred while creating the member'
            });
        }
    }
    async getAllMembers(req, res) {
        try {
            const members = await this.memberService.getAllMembers(req.query);
            res.status(200).json({
                success: true,
                count: members.length,
                data: members
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'An error occurred while fetching members'
            });
        }
    }
    async getMemberById(req, res) {
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
        }
        catch (error) {
            res.status(error instanceof Error && error.message === 'Invalid member ID' ? 400 : 500).json({
                success: false,
                error: error instanceof Error ? error.message : 'An error occurred while fetching the member'
            });
        }
    }
    async updateMember(req, res) {
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
        }
        catch (error) {
            res.status(error instanceof Error && error.message === 'Invalid member ID' ? 400 : 500).json({
                success: false,
                error: error instanceof Error ? error.message : 'An error occurred while updating the member'
            });
        }
    }
    async deleteMember(req, res) {
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
        }
        catch (error) {
            res.status(error instanceof Error && error.message === 'Invalid member ID' ? 400 : 500).json({
                success: false,
                error: error instanceof Error ? error.message : 'An error occurred while deleting the member'
            });
        }
    }
}
exports.MemberController = MemberController;
//# sourceMappingURL=member.controller.js.map