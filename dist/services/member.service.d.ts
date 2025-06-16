import { IMember, MemberDocument } from '../models/member.model';
export declare class MemberService {
    getMemberByAuth0Id(auth0Id: string): Promise<MemberDocument | null>;
    updateMemberByAuth0Id(auth0Id: string, updateData: Partial<IMember>): Promise<MemberDocument | null>;
    createMember(memberData: Partial<IMember>): Promise<MemberDocument>;
    getAllMembers(query?: any): Promise<MemberDocument[]>;
    getMemberById(id: string): Promise<MemberDocument | null>;
    updateMember(id: string, updateData: Partial<IMember>): Promise<MemberDocument | null>;
    deleteMember(id: string): Promise<MemberDocument | null>;
    private handleError;
}
