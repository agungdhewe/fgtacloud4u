/**
 * uibase4.mjs
 * fungsi-fungsi dasar dari sebuah modul
 * seluruh mjs modul fungsi dengan pengenal export
 * akan diwarisi oleh semua modul
 *
 * Agung Nugroho <agung@ferrine.com> http://www.ferrine.com
 * Jakarta, 30 Agustus 2019
 *
 */

const uibase = {
	maskshowing: false,
	dlgmaskshowing: false
}

const fgta_output = $('#fgta_output')
const fgta_output_content = $('#fgta_output_content')
const fgta_output_error = $('#fgta_output_error')


var PAGES;
var maskcode;
var LastScroll = 0;

export var events = {
	OnSizeRecalculated: new CustomEvent('OnSizeRecalculated', {detail: {}}),
	OnButtonBack: new CustomEvent('OnButtonBack', {detail: {cancel: false}}),
	OnButtonHome: new CustomEvent('OnButtonHome', {detail: {cancel: false}}),
}



/**
 * ready
 * di panggil pada saat window modul telah selesai dimuat
 */
export async function ready() {
	
	$ui.resizing_ev = null;
	$(window).on("resize", () => {
		clearTimeout($ui.resizing_ev);
		$ui.resizing_ev = setTimeout($ui.iframe_resize, 200)
	})

	let contentsize = $ui.iframe_resize();
	$ui.OnSizeRecalculated(contentsize.width, contentsize.height);


	window.back = (fn_cancel) => {
		events.OnButtonBack.detail.cancel = false
		$ui.triggerevent(events.OnButtonBack, {})
		fn_cancel(events.OnButtonBack.detail.cancel)
	}

	window.home = (fn_cancel) => {
		events.OnButtonHome.detail.cancel = false
		$ui.triggerevent(events.OnButtonHome, {})
		fn_cancel(events.OnButtonHome.detail.cancel)
	}

	console.log(`module ready`)
}


/**
 * init
 * di panggil pada setiap modul selesai dimuat
 * digunakan untuk melakukan inisiasi di tingkat modul
 * pada uibase, fungsi ini kosong
 * apabila akan di gunakan, fungsi ini di ovveride pada modul
 */
export async function init() {
	console.log('module initialization not created yet')
}



export function setPages(pages) {
	PAGES = pages
}

export function getPages() {
	return PAGES
}


/**
 * Menutupi halaman dengan mask transparant untuk keperluan progress blocking
 *
 * @param message pesan yang akan ditampilkan di atas penutup halaman
 */
export function mask(message, code=null) {

	var top = $(window).scrollTop()

	maskcode = code;

	let progressmask = document.createElement('div')
	let progresswaitmask = document.createElement('div')
	let progresswrap = document.createElement('div')
	let progresswaiting = document.createElement('div')

	progressmask.id = '__progressmask__'
	progresswaitmask.id = '__progresswaitmask__'
	progresswaiting.id = '__progresswaiting__'

	Object.assign(progressmask.style, {
		position: 'absolute',
		top: `${top}px`,
		left: '0px',
		width: 'calc(100vw - (100vw - 100%))',
		height: '100vh',
		overflow: 'hidden',
		display: 'table',
		backgroundColor: 'black',
		opacity: 0,
		zIndex: 8998
	});


	Object.assign(progresswaitmask.style, {
		position: 'absolute',
		top: `${top}px`,
		left: '0px',
		width: 'calc(100vw - (100vw - 100%))',
		height: '100vh',
		overflow: 'hidden',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 8999
	});

	Object.assign(progresswrap.style, {
		// width: '414px',
		// height: '100px',		
	})

	Object.assign(progresswaiting.style, {
		margin: 'auto',
		textAlign: 'center',
		backgroundColor: 'rgb(0, 0, 0, 0.3)',
		color: '#ffffff',
		width: '50vh',
		height: '100px',
		padding: '10px 10px 10px 10px',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center'
	})

	uibase.maskshowing = 'showing'; 
	let progresswait = document.getElementById('__progresswaitmask__')
	if (progresswait!==null) {
		let progresswaitingtext = document.getElementById('__progresswaiting__')
		progresswaitingtext.innerHTML = message
	} else {
		let opacity = 0
		progressmask.style.opacity = 0
		progresswaiting.innerHTML = message
		progresswrap.appendChild(progresswaiting)
		progresswaitmask.appendChild(progresswrap)
		document.body.appendChild(progressmask)
		document.body.appendChild(progresswaitmask)
		let fadein = setInterval(() => {
			if (opacity < 7) {
				opacity += 1;
				progressmask.style.opacity = opacity/10
			} else {
				uibase.maskshowing = 'showed'
				
				clearInterval(fadein);
			}
		}, 20)
	}


}

/**
 * Menghilangkan mask halaman
 * 
 */
export function unmask(code=null, fn_maskclear) {

	if (code!=maskcode)
		return;


	maskcode = null;

	let wait = setInterval(() => {
		if (uibase.maskshowing=='showed') {
			clearInterval(wait);

			let progressmask = document.getElementById('__progressmask__')
			let progresswaitmask = document.getElementById('__progresswaitmask__')
			if (progresswaitmask!==null) {
				let fadeout = setInterval(() => {
					if (!progresswaitmask.style.opacity) {
						progresswaitmask.style.opacity = 0.7;
						progressmask.style.opacity = 0.7;
					}
					if (progresswaitmask.style.opacity > 0) {
						progresswaitmask.style.opacity -= 0.1;
						progressmask.style.opacity -= 0.1;
					} else {
						if (progresswaitmask.parentNode!==null)
							progresswaitmask.parentNode.removeChild(progresswaitmask);
		
						if (progressmask.parentNode!==null)
							progressmask.parentNode.removeChild(progressmask);
		
						uibase.maskshowing = 'none'; 	
						clearInterval(fadeout);

						if (typeof fn_maskclear === 'function') {
							fn_maskclear()
						}
					}
				}, 20)
			}
		}
	}, 20)

}



async function getOtp(apipath) {
	let apiurl = `getotp.php?api=${apipath}`
	let ajax_otp = async (apiurl) => {
		return new Promise(function(resolve, reject) {
			let xhr = new XMLHttpRequest();
			xhr.onreadystatechange= function () {
				if (xhr.readyState==4) {
					let otp = {
						success: false,
						value: '',
						encrypt: false,
						password: ''
					}

					try {
						if (xhr.response!==null) {
							if (xhr.response.trim()!='') {
								Object.assign(otp, JSON.parse(xhr.response))
							}
						}
						resolve(otp)
					} catch (err) {
						reject(err)
					}
				}	
			};

			xhr.open("GET", apiurl, true);
			if (Cookies.get('tokenid')!==undefined) {
				xhr.setRequestHeader("tokenid", Cookies.get('tokenid'));
			}
			xhr.send();
		});
	}

	try {

		var otp = await ajax_otp(apiurl);
		if (otp.success!==true) {
			throw 'request OTP error';
		}
		return otp;

	} catch (err) {
		throw err;
	}
}





/**
 * apicall
 * memanggil api di server menggunakan ajax
 *
 * @param api url dari api
 * @param args argumen yang akan dikirimkan ke api
 */
export async function apicall(api, args) {

	fgta_output_content.html('')	
	fgta_output_error.html('')

	let postparams = {}
	for (let paramname in args) {
		// console.log(paramname, typeof args[paramname])
		if (typeof args[paramname] === 'object') {
			postparams[paramname] = JSON.stringify(args[paramname])
		} else {
			postparams[paramname] = args[paramname]
		}
		
	}

	let apiurl = `index.php/api/${api}`
	let ajax = async (apiurl, postparams, otp) => {
		let urlEncodedDataPairs = [];
		for (let postparamname in postparams) {
			urlEncodedDataPairs.push(encodeURIComponent(postparamname) + '=' + encodeURIComponent(postparams[postparamname]));
		}
		let urlEncodedData = urlEncodedDataPairs.join('&').replace(/%20/g, '+');
		

		return new Promise(function(resolve, reject) {
			let xhr = new XMLHttpRequest();
			xhr.onreadystatechange= function () {
				if (xhr.readyState==4) {

					let response = {
						ajaxsuccess: false,
						errormessage: null,
						result: null,
						output: '',
						debugoutput: false
					}

					try {

						if (xhr.response!==null) {
							try {
								Object.assign(response, JSON.parse(xhr.response))
							} catch (err) {
								throw xhr.response
							}
							
						}

						if (response.output.trim()!='') {
							if (response.debugoutput===true) {
								fgta_output_content.html(response.output)	
								fgta_output_error.html('')
								fgta_output.window({
									title:'Output',
									width:600,
									height:400,
									modal:true
								});
							}
						}


						if (xhr.status==200) {
							resolve(response.result)
						} else {
							response.status = xhr.status;
							if (xhr.status==401) {
								// user sessionn ya habis, diredirek ke halaman login
								if (response.redirecttologin==true) {

									$ui.mask(`
										<div class="fgdialog-vf" style="width: 300px; height: 150px; background-color: #fff; color: #000">
											<div style="flex: 1; text-align: left">
												<div style="font-weight: bold; font-size: 1.3em; margin-bottom: 10px">
													Session Expired
												</div>
												<div style="font-size: 0.8em">
													belum login atau session anda telah habis.<br>
													anda akan diredirect ke halaman login.
												</div>
											</div>
											<div style="text-align: right; height: 25px">
												<button class="btn waves-effect blue" onclick="$ui.redirecttologinpage()">Relogin</button>
											</div>
										</div>`
									, 'relogin')

								}
							}
							throw response
						}
						
					} catch (err) {
						reject(err)
					}
				}
			}			



			xhr.open("POST", apiurl, true);
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.setRequestHeader('cache-control', 'no-cache, must-revalidate, post-check=0, pre-check=0');
			xhr.setRequestHeader('cache-control', 'max-age=0');
			xhr.setRequestHeader('expires', '0');
			xhr.setRequestHeader('expires', 'Tue, 01 Jan 1980 1:00:00 GMT');
			xhr.setRequestHeader('pragma', 'no-cache');
			xhr.setRequestHeader('otp', otp.value);

			if (Cookies.get('tokenid')!==undefined) {
				xhr.setRequestHeader("tokenid", Cookies.get('tokenid'));
			}
			
			xhr.send(urlEncodedData);			
		})
	}


	try {
		var otp = await getOtp(api);
		return await ajax(apiurl, postparams, otp)
	} catch (err) {
		if (typeof err == 'string') {
			err = {errormessage: err}
		}

		// fgta_output_content.html('')
		fgta_output_error.html(err.errormessage)
		throw err

	}


}

export function ShowErrorWindow() {
	fgta_output.window({
		title:'Error',
		width:600,
		height:400,
		modal:true
	});	
}


export function triggerevent(event, args) {
	Object.assign(event.detail, args)
	return document.dispatchEvent(event)
}


export function home() {
	if (parent==null)
		return

	if (parent.$ui==null)
		return;	

	if (typeof parent.$ui.OpenHomeMenu == 'function') {
		parent.$ui.OpenHomeMenu();
	}
}


export async function exitconfirm(message) {
	return new Promise((resolve, reject) => {
		$.messager.confirm('Exit', message, (r)=>{
			if (r) {
				resolve(true)
			} else {
				resolve(false)
			}
		})
	})
}



export function iframe_resize() {
	let contentsize = get_content_size(document.body)
	triggerevent(events.OnSizeRecalculated, {
		width: contentsize.width,
		height: contentsize.height
	})

	return contentsize;
}

export function get_content_size(el) {
	let istyle = el.currentStyle || window.getComputedStyle(el)
	let margin = {
		Top: parseInt(istyle.marginTop),
		Bottom: parseInt(istyle.marginBottom),
		Left: parseInt(istyle.marginLeft),
		Right: parseInt(istyle.marginRight)
	}

	let padding = {
		Top: parseInt(istyle.paddingTop),
		Bottom: parseInt(istyle.paddingBottom),
		Left: parseInt(istyle.paddingLeft),
		Right: parseInt(istyle.paddingRight),
	}

	return {
		width: window.innerWidth - margin.Left - margin.Right - padding.Left - padding.Right,
		height: window.innerHeight - margin.Top - margin.Bottom - padding.Top - padding.Right
	}
}

export function OnSizeRecalculated(width, height) {

}


export function redirecttologinpage() {
	if (parent!=null) {
		parent.location.reload()
	} else {
		location.reload()
	}
}



export function ShowMessage(message, buttons) {
	var top = $(window).scrollTop()

	let progressmask = document.createElement('div')
	let progresswaitmask = document.createElement('div')
	let progresswrap = document.createElement('div')
	let progresswaiting = document.createElement('div')
	let progressbuttonbar = document.createElement('div')

	progressmask.id = '__dialogmessage-mask__'
	progresswaitmask.id = '__dialogmessage-waitmask__'
	progresswaiting.id = '__dialogmessage-waiting__'

	Object.assign(progressmask.style, {
		position: 'fixed',
		overflowY: 'scroll',		
		// position: 'absolute',
		top: `0px`,
		left: '0px',
		width: 'calc(100vw - (100vw - 100%))',
		height: '100vh',
		overflow: 'hidden',
		display: 'table',
		backgroundColor: 'black',
		opacity: 0,
		zIndex: 8998
	});


	Object.assign(progresswaitmask.style, {
		position: 'fixed',
		overflowY: 'scroll',
		// position: 'absolute',
		top: `0px`,
		left: '0px',
		width: 'calc(100vw - (100vw - 100%))',
		height: '100vh',
		overflow: 'hidden',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 8999
	});

	Object.assign(progresswrap.style, {
		// width: '414px',
		// height: '100px',		
	})

	Object.assign(progresswaiting.style, {
		margin: 'auto',
		textAlign: 'center',
		backgroundColor: '#ffffff',
		color: '#000000',
		width: '50vh',
		height: '100px',
		padding: '10px 10px 10px 10px',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center'
	})


	if (buttons===undefined) {
		buttons = {
			"OK" : () => {}
		}
	}


	var lbtns = []
	for (var b in buttons) {
		var btnclick = buttons[b]
		var buttontext = b

		let btn = document.createElement('a')
		btn.innerHTML = buttontext
		btn.classList.add('c8')
		Object.assign(btn.style, {
			width: '60px',
			height: '30px',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			marginLeft: '3px',
			marginRight: '3px'		
		})
	
		$(btn).linkbutton({})

		btn.click_handler = btnclick
		btn.button_click = () => {
			if (typeof btnclick === 'function') {
				btn.click_handler()
			}

			if (progressmask.parentNode!=null) {
				progressmask.parentNode.removeChild(progressmask);
			}
			
			if (progresswaitmask.parentNode!=null) {
				progresswaitmask.parentNode.removeChild(progresswaitmask);
			}
			
			uibase.dlgmaskshowing = 'none';
		}


		btn.addEventListener('click', (ev)=>{
			btn.button_click()
			ev.stopPropagation()
		})
		progressbuttonbar.appendChild(btn)

		lbtns.push(btn)
	}

	
	var EnterPressed = (ev) => {
		if (ev.key=='Enter') {
			document.removeEventListener('keyup', EnterPressed)
			lbtns[0].button_click()
			ev.stopPropagation()
		}
	}
	document.addEventListener("keyup", EnterPressed)


	Object.assign(progressbuttonbar.style, {
		height: '40px',
		backgroundColor: '#ffffff',
		color: '#000000',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center'
	})

	if (message.substring(0, 7)==='[ERROR]') {
		var msgori = message.replace('[ERROR]', '')
		message = `<div><div style="display: flex; justify-content: center"><div style="width:32px; height:32px; background: url('images/messager_icons.png') 64px 0;"></div></div><div style="color:red; margin-top: 10px">${msgori}</div></div>`
	} else if (message.substring(0, 9)==='[WARNING]') {
		var msgori = message.replace('[WARNING]', '')
		message = `<div><div style="display: flex; justify-content: center"><div style="width:32px; height:32px; background: url('images/messager_icons.png') 32px 0;"></div></div><div style="margin-top: 10px">${msgori}</div></div>`
	}  else if (message.substring(0, 10)==='[QUESTION]') {
		var msgori = message.replace('[QUESTION]', '')
		message = `<div><div style="display: flex; justify-content: center"><div style="width:32px; height:32px; background: url('images/messager_icons.png') 96px 0;"></div></div><div style="margin-top: 10px">${msgori}</div></div>`
	} else if (message.substring(0, 6)==='[INFO]') {
		var msgori = message.replace('[INFO]', '')
		message = `<div><div style="display: flex; justify-content: center"><div style="width:32px; height:32px; background: url('images/messager_icons.png') 0 0;"></div></div><div style="margin-top: 10px">${msgori}</div></div>`
	} 
	
	uibase.dlgmaskshowing = 'showing'; 
	let progresswait = document.getElementById('__dialogmessage-waitmask__')
	if (progresswait!==null) {
		let progresswaitingtext = document.getElementById('__dialogmessage-waiting__')
		progresswaitingtext.innerHTML = message
	} else {
		let opacity = 0
		progressmask.style.opacity = 0
		progresswaiting.innerHTML = message
		progresswrap.appendChild(progresswaiting)
		progresswrap.appendChild(progressbuttonbar)
		progresswaitmask.appendChild(progresswrap)
		document.body.appendChild(progressmask)
		document.body.appendChild(progresswaitmask)
		let fadein = setInterval(() => {
			if (opacity < 7) {
				opacity += 1;
				progressmask.style.opacity = opacity/10
			} else {
				uibase.dlgmaskshowing = 'showed'
				
				clearInterval(fadein);
			}
		}, 20)
	}

}



export async function fgta_longrun(options) {

	if (options.process_cookie===null || options.process_cookie===undefined) {
		$ui.ShowMessage(`process_cookie belum didefinisikan`)
		return;
	}

	if (options.api_url_start===null || options.api_url_start===undefined) {
		$ui.ShowMessage(`api_url_start belum didefinisikan`)
		return;		
	}

	if (options.api_url_status===null || options.api_url_status===undefined) {
		$ui.ShowMessage(`api_url_status belum didefinisikan`)
		return;		
	}

	var process_cookie = options.process_cookie
	var api_url_start = options.api_url_start
	var api_url_status = options.api_url_status

	var onStarting = typeof options.onStarting === 'function' ? options.onStarting : () => {}
	var onError = typeof options.onError === 'function' ? options.onError : () => {}
	var onProgress = typeof  options.onProgress === 'function' ? options.onProgress : () => {}
	var onFinished = typeof options.onFinished === 'function' ? options.onFinished : () => {}
	var onTick = typeof options.onTick === 'function' ? options.onTick : () => {}

	
	var cookie_uploader_var = process_cookie

	var args = {
		options: {
			process_id: Cookies.get(cookie_uploader_var),
			data: options.data
		}
	}

	
	var apiurl = api_url_start
	
	try {
		var result = await $ui.apicall(apiurl, args)
		if (result.respond===undefined) {
			throw {errormessage:'Tidak ada respond dari microsevice'}
		}

		args.options.process_id = result.process_id
		if (result.respond.started === true) {
			Cookies.set(cookie_uploader_var, result.process_id);

			onStarting(result)
			
			var report = setInterval(async ()=>{
				var statuscekurl = api_url_status
				try {

					var result = await $ui.apicall(statuscekurl, args)
					onTick(result)

					if (result.respond===undefined) {
						Cookies.remove(cookie_uploader_var)
						clearInterval(report)
						throw {errormessage:'Tidak ada respond dari microsevice'}
					}
	
					var status = result.respond
					var finished = status.finished || status.started===false
					var error = status.error
					var errormessage = status.errormessage
	
					if (error) {
						Cookies.remove(cookie_uploader_var)
						clearInterval(report)
						throw {errormessage: errormessage}
					}
	
					if (finished===true) {
						Cookies.remove(cookie_uploader_var)
						clearInterval(report)					
						setTimeout(()=> {
							onFinished(status)
						}, 1000)
					} else {
						onProgress(status)
					}


				} catch (err) {
					clearInterval(report)	
					Cookies.remove(cookie_uploader_var)	
					onError(err)
					if (err.suppresserror!==true) {
						$ui.ShowMessage('[ERROR]' + err.errormessage)
					}
				}

			}, 1000)
		}

	} catch (err) {
		Cookies.remove(cookie_uploader_var)
		onError(err)
		if (err.suppresserror!==true) {
			$ui.ShowMessage('[ERROR]' + err.errormessage)
		}
	}
}


export function KeepScroll() {
	LastScroll = $(window).scrollTop()
}

export function ResumeScroll(fn_callback) {
	setTimeout(()=>{
		$(window).scrollTop(LastScroll)
		if (typeof fn_callback === 'function') {
			fn_callback()
		}
	}, 300)
}