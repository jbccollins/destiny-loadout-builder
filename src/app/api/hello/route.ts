// Next.js Route Handlers Docs: https://nextjs.org/docs/app/building-your-application/routing/route-handlers

type Data = {
	name: string;
};

export async function GET(request: Request): Promise<Response> {
	const data: Data = { name: 'John Doe' };
	return Response.json(data);
}
