import mongoose from 'mongoose';

interface AdminRoleAttrs {
    name: string;
}

export interface AdminRoleDoc extends mongoose.Document {
    name: string;
}

interface AdminRoleModel extends mongoose.Model<AdminRoleDoc> {
    build(attrs: AdminRoleAttrs): AdminRoleDoc;
}

const AdminRoleSchema = new mongoose.Schema(
    {
        name: { type: String },
        createdAt: { type: Date, default: () => Date.now() },
        updatedAt: { type: Date, default: () => Date.now() },
    },
);

AdminRoleSchema.pre('update', async function (done) {
    const currentDate = new Date();
    const updatedAt = currentDate.getTime();
    this.set('updatedAt', updatedAt);
    done();
})

AdminRoleSchema.statics.build = (attrs: AdminRoleAttrs) => {
    return new AdminRole(attrs);
};

const AdminRole = mongoose.model<AdminRoleDoc, AdminRoleModel>('AdminRole', AdminRoleSchema);

export { AdminRole };
