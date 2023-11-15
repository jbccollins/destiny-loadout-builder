'use client';

import CssBaseline from '@mui/material/CssBaseline';
import { ReactNode } from 'react';
import store from '@dlb/redux/store';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';

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
