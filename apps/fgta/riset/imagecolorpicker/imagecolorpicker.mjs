const el_viewimage = document.getElementById('obj_viewimage');
const el_canvas = document.getElementById('obj_canvas');
const el_color = document.getElementById('el_color');


export function init() {
	console.log('coba imagecolorpick');



	el_viewimage.addEventListener('click', (e) => {
		el_viewimage_click(e)
	})

}


export function uploadimage() {
	console.log('test upload image');
}

export function updatepicture(obj) {
	var url = obj.value;

	var ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
	if (obj.files && obj.files[0]&& (ext == "gif" || ext == "png" || ext == "jpeg" || ext == "jpg")) {
        var reader = new FileReader();
        reader.onload = function (e) {
			el_viewimage.src = e.target.result;
        }
        reader.readAsDataURL(obj.files[0]);
	}
		
}


function el_viewimage_click(e) {
	if (el_viewimage.src=='') {
		return;
	}

	var x, y;
	if(e.offsetX) {
		x = e.offsetX;
		y = e.offsetY; 
	}
	else if(e.layerX) {
		x = e.layerX;
		y = e.layerY;
	}

	useCanvas(el_canvas, el_viewimage, (width, height)=>{
		var i=-4;
		var count=0;
		var p = el_canvas.getContext('2d').getImageData(x, y, 10, 10).data;
		var length = p.length;
		var rgb = {r:0,g:0,b:0}

		while ( (i+=4) < length ) {
			++count;
			rgb.r += p[i];
			rgb.g += p[i+1];
			rgb.b += p[i+2];
		}

		rgb.r = ~~(rgb.r/count);
		rgb.g = ~~(rgb.g/count);
		rgb.b = ~~(rgb.b/count);		
		

		//console.log(rgb);

		var color = rgbToHex(rgb.r,rgb.g,rgb.b);
		el_color.style.backgroundColor = color;

	})
}


function useCanvas(el,image,callback){
	el.width = image.width;
	el.height = image.height; 
	el.getContext('2d').drawImage(image, 0, 0, image.width, image.height);
	return callback(image.width, image.height);
}




function rgbToHex(r, g, b) {
	return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}


function componentToHex(c) {
	var hex = c.toString(16);
	return hex.length == 1 ? "0" + hex : hex;
}
