async function konfirmasi(text) {
	return new Promise((resolve, reject)) {
		bootbox.confirm({
			...
			calback: function (result) {
				resolve(result);
			}
		});
	}
}