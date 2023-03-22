import mongoose, { ObjectId } from "mongoose";

import { NotificationDoc } from "./notification";

// intetface that describe the prooerti
// that are required to cretae new user
export interface UserNotificationMappingAttrs {
  notificationId: string;
  customerId: string;
  isRead: boolean;
  // isActive: boolean;
}

// interface for usermodel pass
export interface UserNotificationMappingModel
  extends mongoose.Model<UserNotificationMappingDoc> {
  build(attrs: UserNotificationMappingAttrs): UserNotificationMappingDoc;
}

// interface for single user properties
export interface UserNotificationMappingDoc extends mongoose.Document {
  notificationId: NotificationDoc;
  customerId: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const UserNotificationMappingSchema = new mongoose.Schema({
  notificationId: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "Notification",
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "CustomerUser",
  },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: () => Date.now() },
  updatedAt: { type: Date, default: () => Date.now() },
});

UserNotificationMappingSchema.pre("save", async function (done) {});

UserNotificationMappingSchema.statics.build = (
  attrs: UserNotificationMappingAttrs
) => {
  return new UserNotificationMapping(attrs);
};

const UserNotificationMapping = mongoose.model<UserNotificationMappingDoc, UserNotificationMappingModel>('usernotificationmapping', UserNotificationMappingSchema);

export { UserNotificationMapping };