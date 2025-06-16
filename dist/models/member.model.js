"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const AddressSchema = new mongoose_1.Schema({
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, required: true }
});
const PersonalInfoSchema = new mongoose_1.Schema({
    legal_first_name: { type: String, required: true },
    legal_last_name: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
    },
    phone: { type: String, required: true },
    date_of_birth: { type: Date, required: true },
    address: { type: AddressSchema, required: true }
});
const MemberSchema = new mongoose_1.Schema({
    auth0Id: { type: String, required: true, unique: true },
    display_first_name: { type: String, required: true },
    display_last_name: { type: String, required: true },
    personal_info: { type: PersonalInfoSchema, required: true },
    role: {
        type: String,
        required: true,
        enum: ['student', 'coach', 'admin', 'guardian']
    },
    square_customer_id: { type: String },
    guardian_first_name: { type: String, default: '' },
    guardian_last_name: { type: String, default: '' },
    is_waiver_on_file: { type: Boolean, default: false },
    notes: { type: String, default: '' }
}, {
    timestamps: true
});
exports.default = (0, mongoose_1.model)('Member', MemberSchema);
//# sourceMappingURL=member.model.js.map