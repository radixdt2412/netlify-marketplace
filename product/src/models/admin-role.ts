import mongoose from 'mongoose';

// An interface that describe the properties
// that are required to create AdminRole
interface AdminRoleAttrs {
    name: string;
}

// An interface that describe the properties
// that AdminRole document has
export interface AdminRoleDoc extends mongoose.Document {
    name: string;
}

// An interface that describe the properties
// that AdminRole model has
interface AdminRoleModel extends mongoose.Model<AdminRoleDoc> {
    build(attrs: AdminRoleAttrs): AdminRoleDoc;
}

// Schema
const AdminRoleSchema = new mongoose.Schema(
    {
        name: { type: String },
        createdAt: { type: Date, default: () => Date.now() },
        updatedAt: { type: Date, default: () => Date.now() },
    },
    
);

// This is middleware function
AdminRoleSchema.pre('update', async function (done) {
    const currentDate = new Date();
    const updatedAt = currentDate.getTime();
    this.set('updatedAt', updatedAt);
    done();
})

// Adding statics property in schema
AdminRoleSchema.statics.build = (attrs: AdminRoleAttrs) => {
    return new AdminRole(attrs);
};

// Model
const AdminRole = mongoose.model<AdminRoleDoc, AdminRoleModel>('AdminRole', AdminRoleSchema);


export { AdminRole };
