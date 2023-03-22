import mongoose, { ObjectId } from "mongoose";


// intetface that describe the prooerti
// that are required to cretae new user
export interface NotificationTemplateAttrs {
  title: string;
  description: string;
  imageUrl: string;
  templateType: string;
  isActive: boolean;
}

// interface for usermodel pass
export interface NotificationTemplateModel
  extends mongoose.Model<NotificationTemplateDoc> {
  build(attrs: NotificationTemplateAttrs): NotificationTemplateDoc;
}

// interface for single user properties
export interface NotificationTemplateDoc extends mongoose.Document {
  title: string;
  description: string;
  imageUrl: string;
  templateType: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const notificationTemplateSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String },
  imageUrl: { type: String },
  templateType: {
    type: String,
    required: true,
    enum: [
      "product",
      "store",
      "business profile",
      "business user",
      "customer user",
      "coupon",
      "deal",
      "category",
      "order",
    ],
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: () => Date.now() },
  updatedAt: { type: Date, default: () => Date.now() },
});

notificationTemplateSchema.pre("save", async function (done) {});

notificationTemplateSchema.statics.build = (
  attrs: NotificationTemplateAttrs
) => {
  return new NotificationTemplate(attrs);
};

const NotificationTemplate = mongoose.model<NotificationTemplateDoc, NotificationTemplateModel>('notificationTemplate', notificationTemplateSchema);

export { NotificationTemplate };