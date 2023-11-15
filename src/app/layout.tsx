import { ReactNode } from 'react';
import '@dlb/styles/globals.css';
import store from '@dlb/redux/store';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Analytics } from '@vercel/analytics/react';
import { Provider } from 'react-redux';

const darkTheme = createTheme({
	palette: {
		mode: 'dark',
		primary: {
			main: '#FFFFFF',
		},
		secondary: {
			main: '#FFFFFF',
		},
	},
});

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en">
			<body>
				<Provider store={store}>
					<ThemeProvider theme={darkTheme}>
						<CssBaseline />
						{children}
					</ThemeProvider>
				</Provider>
				<Analytics />
			</body>
		</html>
	);
}
