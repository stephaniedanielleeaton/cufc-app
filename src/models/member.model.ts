import { Schema, model, HydratedDocument } from 'mongoose';

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

const AddressSchema = new Schema<IMember['personal_info']['address']>({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true },
  country: { type: String, required: true }
});

const PersonalInfoSchema = new Schema<IMember['personal_info']>({
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

const MemberSchema = new Schema<IMember>({
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

export type MemberDocument = HydratedDocument<IMember>;
export default model<IMember>('Member', MemberSchema);
