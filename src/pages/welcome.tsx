function Welcome() {
	console.log('WELCOME,', process.env, process.env.NEXT_PUBLIC_BNET_API_KEY);
	return <div>Welcome</div>;
}

export default Welcome;
