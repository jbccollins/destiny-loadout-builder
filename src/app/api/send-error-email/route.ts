// Next.js Route Handlers Docs: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
// (NOT_TESTED)

import nodemailer from 'nodemailer';

type ResData = {
	error: string | null;
	message: string | null;
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

export async function GET(request: Request): Promise<Response> {
	if (process.env.NODE_ENV === 'development') {
		return Response.json(
			{ error: null, message: 'Skipping error email in dev' },
			{
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			}
		);
	}

	const reqData: ReqData = await request.json();
	const error = reqData.error;
	const message = `<div style="white-space: pre-line;">${error}</div>`;

	const mailOptions = {
		from: 'destinyloadoutbuilder@gmail.com', // sender address
		to: process.env.EMAIL_ADDRESS, // list of receivers
		subject: `Destiny Loadout Builder Error Email`, // Subject line
		html: message, // HTML body
	};

	try {
		const info = await transporter.sendMail(mailOptions);
		return Response.json(
			{ error: null, message: JSON.stringify(info) },
			{
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			}
		);
	} catch (err) {
		return Response.json(
			{ error: `Failed to send email: ${err}`, message: null },
			{
				status: 500,
				headers: { 'Content-Type': 'application/json' },
			}
		);
	}
}
