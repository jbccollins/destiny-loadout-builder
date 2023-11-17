// https://gist.github.com/max10rogerio/26573ccf702fe281c40bfc15b4219b87
/**
 * Interface CopyToClipboard params
 */
interface ICopyToClipboard {
	/** HTML reference identifier ```<div id="foo"></div>```  */
	target?: string;
	/** String value */
	value?: string;
	/** (Optional) message to display in snackbar on success */
	message?: string;
}

export const copyToClipboard = async ({ target, value }: ICopyToClipboard) => {
	try {
		let copyValue = '';

		if (!navigator.clipboard) {
			throw new Error("Browser don't have support for native clipboard.");
		}

		if (target) {
			const node = document.querySelector(target);

			if (!node || !node.textContent) {
				throw new Error('Element not found');
			}

			value = node.textContent;
		}

		if (value) {
			copyValue = value;
		}

		await navigator.clipboard.writeText(copyValue);
		// console.log(message ?? "Copied!!!");
	} catch (error) {
		console.log(error.toString());
	}
};
