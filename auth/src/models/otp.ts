import mongoose from 'mongoose';

interface otpAttrs {
    type: string;
    phoneNumber?: Number;
    email?: string;
    userId?: string;
    code: String;
}

interface otpDoc extends mongoose.Document {
    phoneNumber: Number;
    email: string;
    userId: string;
    code: String;
    createdat: Number;
    updatedat: Number;
}

interface otpModel extends mongoose.Model<otpDoc> {
    build(attrs: otpAttrs): otpDoc;
}

const otpSchema = new mongoose.Schema(
    {
        type: { type: String, enum: ['customer', 'business', 'admin', 'email', 'phoneNumber'] },
        userId: { type: String },
        phoneNumber: { type: Number },
        email: { type: String },
        code: { type: String },
        createdAt: { type: Date, default: () => Date.now() },
        updatedAt: { type: Date, default: () => Date.now() },
    },
);

otpSchema.pre('update', async function (done) {
    const currentDate = new Date();
    const updated_at = currentDate.getTime();
    this.set('updatedAt', updated_at);
    done();
})
otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 });

otpSchema.statics.build = (attrs: otpAttrs) => {
    return new otp(attrs);
};

const otp = mongoose.model<otpDoc, otpModel>('otp', otpSchema);

export { otp };
