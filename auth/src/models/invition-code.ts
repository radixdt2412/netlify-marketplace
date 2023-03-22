import mongoose from 'mongoose';

interface invitionCodeAttrs {
    type: string;
    phoneNumber?: Number;
    email?: string;
    userId?:string;
    code: String;
    expirationDays?: Number;
}

interface invitionCodeDoc extends mongoose.Document {
    type: string;
    phoneNumber: Number;
    email: string;
    userId:string;
    code: String;
    created_By:string;
    created_at: Number;
    updated_at: Number;
    expirationDays: Number;
}

interface invitionCodeModel extends mongoose.Model<invitionCodeDoc> {
    build(attrs: invitionCodeAttrs): invitionCodeDoc;
}

const invitionCodeSchema = new mongoose.Schema(
    {
        type: { type: String, enum: ['customer','business','admin','email','phoneNumber']},
        userId: {type: String },
        phoneNumber: { type: Number },
        email:{type:String},
        code: { type: String },
        isUsed:{type:Boolean,defaul:false},
        expirationDays: { type: Number, default: 10 },
        createdBy:{type:String},
        createdAt: { type: Date, default: () => Date.now() },
        updatedAt: { type: Date, default: () => Date.now() },
    },
);

invitionCodeSchema.pre('update', async function (done) {
    const currentDate = new Date();
    const updated_at = currentDate.getTime();
    this.set('updatedAt', updated_at);
    done();
})
invitionCodeSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 });

invitionCodeSchema.statics.build = (attrs: invitionCodeAttrs) => {
    return new invitionCode(attrs);
};

const invitionCode = mongoose.model<invitionCodeDoc, invitionCodeModel>('InvitionCode', invitionCodeSchema);

export { invitionCode };
