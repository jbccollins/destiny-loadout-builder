// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

type ResData = {
	name: string;
	code: string;
};

type ReqData = {
	code: string;
};

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<ResData>
) {
	const { code } = req.query as ReqData;
	res.status(200).json({ name: 'John Dop 2', code });
}
