import mongoose, { ObjectId } from 'mongoose';
import { AdminPermissionsDoc } from './admin-permissions';
import { AdminRoleDoc } from "./admin-role";

interface AdminRoleMappingAttrs {
    roleId:string;
    permissionId:string;
}

interface AdminRoleMappingDoc extends mongoose.Document {
    roleId: AdminRoleDoc;
    permissionId:AdminPermissionsDoc;
}

interface AdminRoleMappingModel extends mongoose.Model<AdminRoleMappingDoc> {
    build(attrs: AdminRoleMappingAttrs): AdminRoleMappingDoc;
}

const AdminRoleMappingSchema = new mongoose.Schema(
    {
        roleId:{type:mongoose.Schema.Types.ObjectId,ref:'AdminRole'},
        permissionId:{type:mongoose.Schema.Types.ObjectId,ref:'adminPermissions'},
        createdAt: { type: Date, default: () => Date.now() },
        updatedAt: { type: Date, default: () => Date.now() },
    },
   
);

AdminRoleMappingSchema.pre('update', async function (done) {
    const currentDate = new Date();
    const updated_at = currentDate.getTime();
    this.set('updatedAt', updated_at);
    done();
})

AdminRoleMappingSchema.statics.build = (attrs: AdminRoleMappingAttrs) => {
    return new AdminRoleMapping(attrs);
};

const AdminRoleMapping = mongoose.model<AdminRoleMappingDoc, AdminRoleMappingModel>('AdminRoleMapping', AdminRoleMappingSchema);


export { AdminRoleMapping };
