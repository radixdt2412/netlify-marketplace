import mongoose from 'mongoose';

export interface AdminPermissionsAttrs {
  tableName: string;
  isCreate: boolean;
  isDelete: boolean;
  isUpdate: boolean;
  isRead: boolean;
}

export interface AdminPermissionsDoc extends mongoose.Document {
  tableName: string;
  isCreate: boolean;
  isDelete: boolean;
  isUpdate: boolean;
  isRead: boolean;
}

interface AdminPermissionsModel extends mongoose.Model<AdminPermissionsDoc> {
  build(attrs: AdminPermissionsAttrs): AdminPermissionsDoc;
}

const adminPermissionSchema = new mongoose.Schema(
  {
    tableName: { type: String, required: true, enum:['product','store','business profile','business user','customer user','coupon','deal','category','order']},
    isCreate: { type: Boolean, required: true, default: true },
    isDelete: { type: Boolean, required: true, default: true },
    isUpdate: { type: Boolean, required: true, default: true },
    isRead: { type: Boolean, required: true, default: true },
  }
);

adminPermissionSchema.statics.build = (attrs: AdminPermissionsAttrs) => {
  return new AdminPermissions(attrs);
};

const AdminPermissions = mongoose.model<AdminPermissionsDoc,AdminPermissionsModel>('AdminPermissions', adminPermissionSchema);

export { AdminPermissions };
