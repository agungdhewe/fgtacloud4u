export async function init(opt) {
	$ui.RenderBarcode('elqrcode', (data) => {
		var qr = new QRious({
			element: data.el,
			size: data.size,
			value: data.value
		});

		console.log('init page...');
		adjustPage();
		if (typeof (global.window_fn_print) === 'function') {
			global.window_fn_print();
		}

	});
}


