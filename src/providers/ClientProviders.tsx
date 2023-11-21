'use client';
import store from '@dlb/redux/store';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ReactNode } from 'react';
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

export default function ClientProviders({ children }: { children: ReactNode }) {
	return (
		<Provider store={store}>
			<ThemeProvider theme={darkTheme}>
				{children}
				<CssBaseline />
			</ThemeProvider>
		</Provider>
	);
}
