import mongoose from 'mongoose';

interface adminSwitchesAttrs {
  name:string;
  status:boolean;
}

interface adminSwitchesDoc extends mongoose.Document {
    name:string;
    status:boolean;
}

interface adminSwitchesModel extends mongoose.Model<adminSwitchesDoc> {
  build(attrs: adminSwitchesAttrs): adminSwitchesDoc;
}

const adminSwitchesSchema = new mongoose.Schema(
  {
   name:{type:String},
   status:{type:Boolean},
   createdAt: { type: Date, default: () => Date.now() },
   updatedAt: { type: Date, default: () => Date.now() },
  },
 
);

adminSwitchesSchema.pre('update', async function (done) {
    const currentDate = new Date();
    const updated_at = currentDate.getTime();
    this.set('updatedAt', updated_at);
    done();
})

adminSwitchesSchema.statics.build = (attrs: adminSwitchesAttrs) => {
  return new adminSwitches(attrs);
};

const adminSwitches = mongoose.model<adminSwitchesDoc, adminSwitchesModel>('AdminSwitches', adminSwitchesSchema);


export { adminSwitches };
