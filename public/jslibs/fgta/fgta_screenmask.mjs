export var ScreenMask = {
	Create: function(maskid) {
		var elmask = document.getElementById(maskid);
		if (elmask==null) {
			elmask = document.createElement('div');
			elmask.id = maskid;
			elmask.style.cssText = `
				display: flex;
				justify-content: center;
				align-items: center;
				position:fixed;
				top:0px;
				width: 100vw;
				height: 100vh;
				color: white;
				background-color: rgba(0,0,0, 0.6);
				z-index: 99999
			`;
			document.body.appendChild(elmask);
		} 
	
		if (typeof elmask.Close !== 'function') {
			elmask.Close = function() {
				elmask.parentNode.removeChild(elmask);
			}
		}

		if (typeof elmask.Hide !== 'function') {
			elmask.Hide = function() {
				elmask.style.display = 'none';
			}
		}

		return elmask;
	}
}


