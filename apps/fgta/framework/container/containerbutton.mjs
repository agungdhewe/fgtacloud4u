
export async function CreateModuleShortcut(mdlico, elpnl, OpenModule) {
	let btn = CreateButton(mdlico)
	btn.classList.add('buttonprogramicon');
	btn.style.backgroundColor = mdlico.backcolor;
	btn.setDisabled(mdlico.disabled)
	btn.setText(mdlico.title)
	btn.setTextColor(mdlico.forecolor)
	btn.setImage('index.php/images/icons/' + mdlico.icon)
	btn.setClick(() => { 
		btn.setLoading(true)
		OpenModule({modulefullname:mdlico.modulefullname, variancename:mdlico.variancename, url_param:mdlico.url_param}, ()=>{
			btn.setLoading(false)
		})
	})

	elpnl.appendChild(btn)
}

export async function CreateModuleGroup(mdlico, elpnl, CreateModuleList) {
	let btn = CreateButton(mdlico)
	btn.classList.add('buttonprogramicon')
	btn.style.borderRadius = '14px'
	btn.style.backgroundColor = mdlico.backcolor;
	btn.setDisabled(mdlico.disabled)
	btn.setText(mdlico.title)
	btn.setTextColor(mdlico.forecolor)
	btn.setImage('index.php/images/icons/' + mdlico.icon)
	btn.setClick(() => { 
		CreateModuleList(mdlico)
	})
	
	elpnl.appendChild(btn)
}


function CreateButton(mdlico) {
	// console.log(mdlico);
	let buttoncontainer = document.createElement('div')
	// buttoncontainer.style.marginRight = '10px'
	// buttoncontainer.style.marginBottom = '10px'
	//buttoncontainer.style.border = '1px solid #cccccc'
	//buttoncontainer.style.cssFloat = 'left'
	buttoncontainer.style.cursor = 'pointer'
	buttoncontainer.iconloaded = false
	buttoncontainer.width = '80px'
	buttoncontainer.height = '80px'
	buttoncontainer.classList.add('icon-noselect');

	let buttonwrapper = document.createElement('div')
	buttonwrapper.style.width = '80px'
	buttonwrapper.style.height = '80px'
	buttonwrapper.style.display = 'table'

	let buttoncontent = document.createElement('div')
	buttoncontent.style.display = 'table-cell'
	buttoncontent.style.verticalAlign = 'middle'
	buttoncontent.style.textAlign = 'center'
	buttoncontent.classList.add('menubutton')


	let img = document.createElement('img')
	img.style.height = '32px'
	img.style.width = '32px'
	img.style.display = 'inline-block'
	// img.src = 'templates/asset/icon-loading.gif'

	let imgLoading = new Image()
	imgLoading.src = window.global.iconloading;
	img.src = imgLoading.src;

	
	let imgcontainer = document.createElement('div')
	imgcontainer.style.textAlign = 'center'
	imgcontainer.appendChild(img)
	buttoncontent.appendChild(imgcontainer)


	let buttontext = document.createElement('span')
	buttoncontent.appendChild(buttontext)


	buttonwrapper.appendChild(buttoncontent)
	buttoncontainer.appendChild(buttonwrapper)
	

	let iconimage = new Image()
	iconimage.onload = () => {
		buttoncontainer.iconloaded = true
		img.src = iconimage.src		
	}



	buttoncontainer.setDisabled = (disabled) => {
		if (disabled) {
			buttoncontainer.disabled = disabled
			buttoncontainer.style.cursor = 'default'
			buttoncontainer.style.filter = 'brightness(60%)'			
		}
	}

	buttoncontainer.setClick = (fn) => {
		if (!buttoncontainer.disabled) {
			buttoncontainer.onclick = fn
		}
	}

	buttoncontainer.setText = (text) => {
		buttontext.appendChild(document.createTextNode(text))
	}

	buttoncontainer.setTextColor = (color) => {
		buttontext.style.color = color
	}
	
	buttoncontainer.setImage = (url) => {
		iconimage.src = url
	}


	buttoncontainer.setLoading = (loading) => {
		if (loading) {
			img.src = imgLoading.src	
		} else {
			img.src = iconimage.src 
		}
	}


	return buttoncontainer
}





export async function SwapButtonRight(btn_prev, btn_next) {
	let btn_next_already_showing = false;

	let hide_btn_prev = () => {
		// tombol akan bergeser ke kiri dan menghilang
		return new Promise((resolve) => {
			btn_prev
				.css('opacity', 1)
				.css('margin-left', '0px')
				
			btn_prev.show()	
			btn_prev.animate({opacity: .2, marginRight: '-100px'}, 50, 'linear', ()=>{
				btn_prev.hide()
				resolve(true)
			})			

		})
	}

	let show_btn_next = () => {
		// tombol akan muncul dari kanan dari transparant ke jelas
		if (btn_next_already_showing)
			return

		btn_next_already_showing = true

		return new Promise((resolve) => {
			btn_next
				.css('opacity', 0)
				.css('margin-right', '-200px')
			
			btn_next.show();	
			btn_next.animate({opacity: 1, marginRight: '0px'}, 200, 'linear', ()=>{
				resolve(true)
			})
		})		
		
	}

	if (btn_prev!=null) { 
		hide_btn_prev()
		.then(()=>{
			if (btn_next!=null) {
				show_btn_next()
			}
		})
	}

	if (btn_next!=null) {
		show_btn_next()
	}
}

export async function SwapButtonLeft(btn_prev, btn_next) {
	
	let hide_btn_prev = () => {
		// tombol akan bergeser ke kiri dan menghilang
		return new Promise((resolve) => {
			btn_prev
				.css('opacity', 1)
				.css('margin-left', '0px')			
				.animate({opacity: .2, marginLeft: '-30px'}, 50, 'linear', ()=>{
					btn_prev.hide()
					resolve(true)
				})			

		})
	}

	let show_btn_next = () => {
		// tombol akan muncul dari kiri dari transparant ke jelas
		// console.log('already showing', btn_next_already_showing)
		return new Promise((resolve) => {
			btn_next
				.css('opacity', 0.2)
				.css('margin-left', '-100px')
			
			btn_next.show()
			btn_next.animate({opacity: 1, marginLeft: '0px'}, 200, 'linear', ()=>{
				resolve(true)
			})
		})		
		
	}

	let btn_next_already_showing = false;
	if (btn_prev!=null) { 
		await hide_btn_prev()
		if (btn_next!=null) {
			btn_next_already_showing = true
			await show_btn_next()
		}
	}

	if (btn_next!=null) {
		if (btn_next_already_showing)
			return
		await show_btn_next()
	}

}