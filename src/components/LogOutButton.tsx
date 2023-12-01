import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';

function Logout() {
	const router = useRouter();
	const handleClick = () => {
		localStorage.removeItem('authorization');
		router.push('/login');
	};
	return (
		<Button variant="contained" color="secondary" onClick={handleClick}>
			Logout
		</Button>
	);
}

export default Logout;
