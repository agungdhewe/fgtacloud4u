export async function init(opt) {
	$ui.RenderBarcode('elqrcode', (data) =>{
		new QRious({
			element: data.el,
			size: data.size,
			value: data.value
		});
	});
}


