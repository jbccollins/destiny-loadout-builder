import axios from 'axios';

export const sendErrorEmail = async (error: string): Promise<void> => {
	await axios
		.post(`/api/send-error-email`, { error })
		.then((response) => {
			console.log('response', response);
		})
		.catch(function (error) {
			if (error.response) {
				console.error(error.response.data);
			}
		});
};
