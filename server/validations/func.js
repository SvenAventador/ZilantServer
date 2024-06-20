const nodemailer = require('nodemailer');
const path = require('path');
const {v4} = require('uuid');

const transporter = nodemailer.createTransport({
    host: 'smtp.mail.ru',
    port: 465,
    secure: true,
    auth: {
        user: process.env.CLUB_EMAIL,
        pass: process.env.CLUB_PASSWORD,
    },
    from: process.env.CLUB_EMAIL
});

async function sendEmailWithImages(imagePaths, merchandiseList, recipientEmail, userName, fullPrice) {
    try {
        const attachments = imagePaths.map(imagePath => ({
            filename: path.basename(imagePath),
            path: imagePath,
            cid: v4()
        }));

        const merchandiseItems = merchandiseList.map(item => `
            <div style="border: 1px solid #ddd; padding: 10px; margin-bottom: 10px;">
                <p><strong>${item.merchandiseName}</strong></p>
                <p>Цена: ${item.merchandisePrice}</p>
            </div>
        `).join('');

        const mailOptions = {
            from: process.env.CLUB_EMAIL,
            to: recipientEmail,
            subject: 'Информация о доставке',
            html: `
                <h1>Уважаемый ${userName},</h1>
                <p>Ваш заказ успешно доставлен по адресу Большая красная 55, в кабинет 116.</p>
                <h2>Ваш список товаров:</h2>
                ${merchandiseItems}
                <h2>Сумма заказа: ${fullPrice}</h2>
            `,
            attachments: attachments
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        throw new Error(`Failed to send email with images: ${error.message}`);
    }
}


module.exports = {
    sendEmailWithImages
}
