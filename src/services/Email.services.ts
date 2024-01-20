import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { envConfig } from '~/constants/Config';
dotenv.config();

class EmailServices {
    async sendEmail(email: string, user_id: string) {
        if (!email) {
            return {
                status: 400,
                msg: 'Email is required',
                data: null,
            };
        }
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: envConfig.EMAIL_USERNAME,
                pass: envConfig.EMAIL_PASSWORD,
            },
        });
        const info = await transporter.sendMail({
            from: '"Nguyễn Thanh Anh 👻" <nguyenthanhanhtp123@gmail.com>', // Địa chỉ người gửi
            to: email, // Danh sách người nhận, có thể là một chuỗi hoặc mảng
            subject: 'Shoes Shop - Đổi mật khẩu tài khoản của bạn', // Tiêu đề email
            text: 'Hello world?', // Nội dung văn bản thông thường
            html: `
            <div style="text-align: center; width: 500px ;background-color: #f0f0f0; padding: 35px; font-size: 18px; border-radius: 10px ;background-color: #dcfce7; font-weight: 600">
              <img src="https://aacable.files.wordpress.com/2018/07/password_en.png?w=584" alt="" style="width: 180px; height: 100px; margin-left: auto; margin-right: auto; display: block">
              <h1 style="color: #333; font-size: 22px">Xin chào bạn tui!</h1>
              <p style="color: #555;">Vui lòng click vào button dưới đây đổi mật khẩu</p>
              <a href="${envConfig.URL_FE}/reset-password/${user_id}" style="background-color: #22c55e; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Đổi mật khẩu</a>
            </div>
         `,
        });
        return {
            status: 200,
            data: info,
            msg: 'Send email successfully',
        };
    }
}

const emailServies = new EmailServices();

export default emailServies;
