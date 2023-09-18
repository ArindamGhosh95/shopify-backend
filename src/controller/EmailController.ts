import nodemailer from "nodemailer";

// order shld be exact data{dynamic data}, req, res
interface data {
  to: string;
  text: string;
  subject: string;
  htm: string;
}
export const sendEmail = async (data: data, _req: any, res: any) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL_ID,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  try {
    const info = await transporter.sendMail({
      from: '"Fred Foo 👻" <foo@example.com>', // sender address
      to: data.to, // list of receivers
      subject: data.subject, // Subject line
      text: data.text, // plain text body
      html: data.htm, // html body
    });
  } catch (e) {
    console.log(e);
    res.json(e);
  }
  return;
};
