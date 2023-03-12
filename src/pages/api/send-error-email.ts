// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

type ResData = {
	error: string;
	message: string;
};

type ReqData = {
	error: string;
};

// Find your credentials here: https://app.mailgun.com/app/sending/domains
const transporter = nodemailer.createTransport({
	host: 'smtp.mailgun.org',
	port: 587,
	secure: false, // true for 465, false for other ports
	auth: {
		user: process.env.MAILGUN_USERNAME,
		pass: process.env.MAILGUN_PASSWORD,
	},
});

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<ResData>
) {
	if (process.env.NODE_ENV === 'development') {
		res
			.status(200)
			.json({ error: null, message: 'Skipping error email in dev' });
	}
	const { error } = req.body as ReqData;
	const message = `
    <div style="white-space: pre-line;">${error}</div>
  `;

	const mailOptions = {
		from: 'destinyloadoutbuilder@gmail.com', // sender address
		to: process.env.EMAIL_ADDRESS, // list of receivers
		subject: `Destiny Loadout Builder Error Email`, // Subject line
		html: message, // plain text body
	};

	transporter.sendMail(mailOptions, function (err, info) {
		if (err) {
			res
				.status(500)
				.json({ error: `Failed to send email: ${err}`, message: null });
		} else {
			res.status(200).json({ error: null, message: JSON.stringify(info) });
		}
	});
}
