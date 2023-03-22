
// import nodemailer, { TransportOptions } from "nodemailer";
// import { google } from "googleapis";
// import { BadRequestError } from "@rx-marketplace/common";


// const clientId =
//   "485945689011-5pps6r44202h4prpafudks08jv8frbd4.apps.googleusercontent.com";
// const clientSecreat = "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";
// const redirect_uri = "https://developers.google.com/oauthplayground";
// const referesh_token =
//   "1//04wjRAdVnZG1BCgYIARAAGAQSNgF-L9IrJwN2-w4s5D1TlwGnYT3lawmFmJXglPibFXmbnHB7-DH4sTciLvymxiLAPlnTktiIqA";


// export class MailService {
//   static async mailTrigger( email: string, subject: string,html:string) {
//     const oAuth2Client = new google.auth.OAuth2(
//       clientId,
//       clientSecreat,
//       redirect_uri
//     );
//     oAuth2Client.setCredentials({ scope: 'offline', refresh_token: referesh_token });

//     oAuth2Client.refreshAccessToken();
//     const accessToken = await oAuth2Client.getAccessToken() as String;


//     var transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         type: 'OAUTH2',
//         user: 'gokaninidhi9521@gmail.com',
//         clientId: clientId,
//         clientSecret: clientSecreat,
//         refreshToken: referesh_token,
//         accessToken: accessToken
//       },
//     } as TransportOptions);

//     var mailOptions = {
//       from: "gokaninidhi9521@gmail.com",
//       to: email,
//       subject: subject,
//       text: "Hello,",
//       html: html,
//     };

//     transporter.sendMail(mailOptions, function (error: any, info: any) {
//       if (error) {
//         console.log(error);
//         throw new BadRequestError(error.message);
//       } else {
//         console.log("Email sent: " + info.response);
//         return true;
//       }
//     });
//   }
// }

import nodemailer from "nodemailer";
export class MailService {
  static async mailTrigger(email: string, subject: string, html: string) {
    const transporter = nodemailer.createTransport({
      host: "mail.mailtest.radixweb.net",
      port: 465,
      secure: true,
      auth: {
        user: "testdotnet@mailtest.radixweb.net",
        pass: "Radix@web#8",
      }
    });
    var mailOptions = {
      from: "testdotnet@mailtest.radixweb.net",
      to: email,
      subject: subject,
      text: "Hello ,",
      html: html
    };
    await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
          reject(error);
        }
        else {
          resolve(true);
        }
      })
    }
    ).catch((error) => { throw new Error(error); });
  }
}
