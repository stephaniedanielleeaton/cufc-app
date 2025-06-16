/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/inferschematype" />
/// <reference types="mongoose/types/inferrawdoctype" />
import { HydratedDocument } from 'mongoose';
export interface IMember {
    auth0Id: string;
    display_first_name: string;
    display_last_name: string;
    personal_info: {
        legal_first_name: string;
        legal_last_name: string;
        email: string;
        phone: string;
        date_of_birth: Date;
        address: {
            street: string;
            city: string;
            state: string;
            zip: string;
            country: string;
        };
    };
    role: string;
    square_customer_id?: string;
    guardian_first_name?: string;
    guardian_last_name?: string;
    is_waiver_on_file: boolean;
    notes?: string;
}
export type MemberDocument = HydratedDocument<IMember>;
declare const _default: import("mongoose").Model<IMember, {}, {}, {}, import("mongoose").Document<unknown, {}, IMember, {}> & IMember & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>;
export default _default;
