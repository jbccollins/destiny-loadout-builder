// Next.js Route Handlers Docs: https://nextjs.org/docs/app/building-your-application/routing/route-handlers

type ResData = {
	name: string;
	code: string;
};

type ReqData = {
	code: string;
};

export async function GET(request: Request): Promise<Response> {
	const { searchParams } = new URL(request.url);
	const code = searchParams.get('code') as ReqData['code'];

	const data: ResData = { name: 'John Doe 2', code };
	return Response.json(data);
}
