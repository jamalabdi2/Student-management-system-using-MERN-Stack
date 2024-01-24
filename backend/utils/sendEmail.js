import nodemailer from "nodemailer";
import path from "path";
import fs from "fs/promises";
import handlebars from "handlebars";

// Get the directory path using import.meta.url
const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

const sendEmail = async (email, subject, templateName,replacements) => {
  try {
    const filePath = path.join(__dirname, `templates/${templateName}`);
    const source = await fs.readFile(filePath, 'utf-8');
    const template = handlebars.compile(source);
    const htmlToSend = template(replacements);
    console.log("___html to send___");
    console.log(htmlToSend);

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.USERNAME,
        pass: process.env.PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.USERNAME,
      to: email,
      subject: subject,
      html: htmlToSend,
    });

    console.log("email sent successfully");
  } catch (error) {
    console.log("email not sent");
    console.error(error.message);
  }
};

export { sendEmail };
