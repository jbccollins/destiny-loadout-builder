"use client";

import CloseIcon from '@mui/icons-material/Close';
import { DialogContent, IconButton } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import * as React from 'react';

export interface CustomDialogProps {
	open: boolean;
	onClose: () => void;
	children: React.ReactNode;
	title: string;
}

export default function CustomDialog(props: CustomDialogProps) {
	const { onClose, open, children, title } = props;

	return (
		<Dialog onClose={onClose} open={open}>
			<DialogTitle>{title}</DialogTitle>
			<IconButton
				aria-label="close"
				onClick={onClose}
				sx={{
					position: 'absolute',
					right: 8,
					top: 8,
					color: (theme) => theme.palette.grey[500],
				}}
			>
				<CloseIcon />
			</IconButton>
			<DialogContent dividers>{children}</DialogContent>
		</Dialog>
	);
}
