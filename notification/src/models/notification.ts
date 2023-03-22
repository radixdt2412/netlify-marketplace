import mongoose, { ObjectId } from "mongoose";
import { NotificationTemplateDoc } from "./notification-template";

// intetface that describe the prooerti
// that are required to cretae new user
export interface NotificationAttrs {
  notificationTemplateId: NotificationTemplateDoc;
  // isActive: boolean;
}

// interface for usermodel pass
export interface NotificationModel extends mongoose.Model<NotificationDoc> {
  build(attrs: NotificationAttrs): NotificationDoc;
}

// interface for single user properties
export interface NotificationDoc extends mongoose.Document {
  notificationTemplateId: NotificationTemplateDoc;
  // isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const NotificationSchema = new mongoose.Schema({
  notificationTemplateId: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "NotificationTemplate",
  },
  // isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: () => Date.now() },
  updatedAt: { type: Date, default: () => Date.now() },
});

NotificationSchema.pre("save", async function (done) {});

NotificationSchema.statics.build = (attrs: NotificationAttrs) => {
  return new Notification(attrs);
};

const Notification = mongoose.model<NotificationDoc, NotificationModel>('notification', NotificationSchema);

export { Notification };