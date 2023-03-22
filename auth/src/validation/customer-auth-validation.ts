import { body, oneOf } from 'express-validator';

export class CustomerAuthValidation {
  static SignupValidation = [
    body('name').trim().notEmpty().withMessage('Please provide a name.'),
    body('password')
      .trim()
      .isLength({ min: 8, max: 20 })
      .withMessage('password must be between 8 and 20 characters'),
    body('confirmPassword')
      .trim()
      .isLength({ min: 8, max: 20 })
      .withMessage('password must be between 8 and 20 characters'),
    body('email').isEmail().withMessage('email must be valid').optional(),
    body('deviceId').trim().notEmpty().withMessage("deviceId must be required"),
    body('fcmToken').trim().notEmpty().withMessage("fcmToken must be required"),
    body('deviceType').trim().notEmpty().withMessage("deviceType must be required"),
    body('phoneNumber')
      .trim()
      .matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im)
      .withMessage('phone number must be valid')
      .optional(),
    oneOf(
      [body('email').notEmpty(), body('phoneNumber').notEmpty()],
      'One Of field is Require Email or PhoneNumber'
    ),
  ];
  static signInValidation = [
    body('email').isEmail().withMessage('email must be valid').optional(),
    body('phoneNumber')
      .trim()
      .matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im)
      .withMessage('phone number must be valid')
      .optional(),
    body('deviceId').trim().notEmpty().withMessage("deviceId must be required"),
    body('fcmToken').trim().notEmpty().withMessage("fcmToken must be required"),
    body('deviceType').trim().notEmpty().withMessage("deviceType must be required"),
    body('password')
      .trim()
      .isLength({ min: 8, max: 20 })
      .withMessage('password must be between 8 and 20 characters'),
    oneOf(
      [body('email').notEmpty(), body('phoneNumber').notEmpty()],
      'One Of field is Require Email or PhoneNumber'
    ),
  ];
  static forgotPasswordCodeVerify=[
    body('password')
    .trim()
    .isLength({ min: 8, max: 20 })
    .withMessage('password must be between 8 and 20 characters'),
  body('confirmPassword')
    .trim()
    .isLength({ min: 8, max: 20 })
    .withMessage('password must be between 8 and 20 characters'),
  body('email').isEmail().withMessage('email must be valid'),
  body('code').trim().notEmpty().withMessage('code must be entered'),
  ]

  static forgotPasswordMailTrigger=[
   
  body('email').isEmail().withMessage('email must be valid'),
  
  ]
  static updateUser=[
    body('email').isEmail().withMessage('email must be valid').optional(),
    body('phoneNumber')
      .trim()
      .matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im)
      .withMessage('phone number must be valid')
      .optional(),
    body('firstName').trim().notEmpty().withMessage('firstName must be valid'),
    body('lastName').trim().notEmpty().withMessage('lastName must be valid'),
    body('gender').trim().notEmpty().isIn(['female', 'male']).withMessage('gender must be valid'),
  ]
}
