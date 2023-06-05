import store from '@dlb/redux/store';
import '@dlb/styles/globals.css';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Analytics } from '@vercel/analytics/react';
import type { AppProps } from 'next/app';
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

export default function MyApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<Provider store={store}>
				<ThemeProvider theme={darkTheme}>
					<CssBaseline />
					<Component {...pageProps} />
				</ThemeProvider>
			</Provider>
			<Analytics />
		</>
	);
}
