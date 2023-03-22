import mongoose, { ObjectId } from "mongoose";

export interface AccountTypeAttrs {
    accountType: string;
}

interface AccountTypeModel extends mongoose.Model<AccountTypeDoc> {
    build(attrs: AccountTypeAttrs): AccountTypeDoc;
}

export interface AccountTypeDoc extends mongoose.Document {
    accountTypeName: string;
}

const AccountTypeSchema = new mongoose.Schema({
    accountType: { type: String, required: true, unique: true},
    createdAt: { type: Date, default: () => Date.now()},
    updatedAt: { type: Date, default: () => Date.now() },
    isDelete: { type: Boolean, default: false }
});

AccountTypeSchema.statics.build = (attrs: AccountTypeAttrs) => {
    return new AccountType(attrs);
}

const AccountType = mongoose.model<AccountTypeDoc, AccountTypeModel>('AccountType', AccountTypeSchema);

export { AccountType };