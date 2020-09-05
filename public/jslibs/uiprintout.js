export function RenderBarcode(elname, fn_render_using) {
	var data = {
		el: document.getElementById(elname),
		value: elqrcode.getAttributeNode("value").value,
		size: elqrcode.getAttributeNode("size").value
	}

	fn_render_using(data);
}