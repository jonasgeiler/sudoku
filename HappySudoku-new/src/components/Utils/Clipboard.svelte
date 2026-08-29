<script>
	let textArea;

	export const copyText = function (text) {
		if (navigator.clipboard) return navigator.clipboard.writeText(text);

		textArea.value = text;

		const selected = document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false;

		textArea.select();

		let success = false;
		try {
			success = document.execCommand('copy');
		} catch (e) {
		}

		if (selected) {
			document.getSelection().removeAllRanges();
			document.getSelection().addRange(selected);
		}

		return success
				? Promise.resolve()
				: Promise.reject();
	};
</script>

<textarea readonly="readonly" style="position: absolute; left: -9999px;" bind:this={textArea}></textarea>