import mongoose, { ObjectId } from 'mongoose';

export interface AdminAttrs {
  userName: string;
  email?: string | null;
  password: string;
  phoneNumber?: number | null;
  createdBy?: string | null;
  allowChangePassword:boolean;
  roleId:string,
}

interface AdminDoc extends mongoose.Document {
  userName: string;
  email: string;
  password: string;
  phoneNumber: number;
  isMfa: boolean;
  isEmailVerified: boolean;
  isMobileVerified: boolean;
  imageUrl: string;
  isSuperAdmin: boolean;
  //permissionId :
  roleId:string;
  createdBy: string;
  updatedBy: string;
  isActive: boolean;
  refreshToken: string;
  createdAt: Date;
  updatedAt: Date;
  allowChangePassword:boolean;
}

interface AdminModel extends mongoose.Model<AdminDoc> {
  build(attrs: AdminAttrs): AdminDoc;
}

const AdminSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    email: { type: String,  },
    password: { type: String, required: true },
    phoneNumber: { type: Number },
    isMfa: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },
    isMobileVerified: { type: Boolean, default: false },
    imageUrl: { type: String,  },
    isSuperAdmin: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, default: null, ref:'admin' },
    updatedBy: { type: String, },
    isActive: { type: Boolean, default: true },
    refreshToken: { type: String },
    allowChangePassword:{type:Boolean,default:true},
    roleId:{type:mongoose.Schema.Types.ObjectId,ref:'AdminRole'},
    createdAt: { type: Date, default: () => Date.now() },
    updatedAt: { type: Number, default: () => Date.now() }
  },
);

AdminSchema.statics.build = (attrs: AdminAttrs) => {
  return new Admin(attrs);
};

const Admin = mongoose.model<AdminDoc, AdminModel>('Admin',AdminSchema);

export { Admin };
