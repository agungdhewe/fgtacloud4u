'use strict'

const pnl_exitbar = $('#pnl_exitbar');
const btn_exit = $('#btn_exit');
const el_btn_login = document.getElementById('btn_login')

const obj = {
	el_txt_username: document.getElementById('txt_username'),
	el_txt_password: document.getElementById('txt_password'),
	el_chk_rememberme: document.getElementById('chk_rememberme')
}

const api = {
	dologin: 'fgta/framework/login/dologin'
}



export async function init() {

	obj.el_txt_username.addEventListener('keypress', (evt)=>{
		txt_username_keypress(evt)
	})	

	obj.el_txt_password.addEventListener('keypress', (evt)=>{
		txt_password_keypress(evt)
	})	

	btn_login.addEventListener('click', ()=>{ 
		btn_login_click() 
	})

}


function txt_username_keypress(evt) {
	let username = obj.el_txt_username.value
	if (evt.key==='Enter') {
		if (username.trim()!=='') {
			obj.el_txt_password.focus();
		}
	}
}

function txt_password_keypress(evt) {
	let password = obj.el_txt_password.value
	if (evt.key==='Enter') {
		btn_login_click()
	}	
}



function btn_login_click() {
	let username = obj.el_txt_username.value
	let password = obj.el_txt_password.value

	let ajax_args = {
		username: username,
		password: password
	}

	let ajax_dologin = async (args, fn_callback) => {
		let apiurl = api.dologin
		try {
			let result = await $ui.apicall(apiurl, args)
			fn_callback(null, result)
		} catch (err) {
			fn_callback(err)
		}
	}

	$ui.mask('login...')
	ajax_dologin(ajax_args,  (err, result) => {
		$ui.unmask();
		if (err) {
			if (err.status==401) {
				$.messager.alert('Login', err.errormessage, 'warning');
			} else {
				$ui.ShowErrorWindow();
			}
		} else {
			try {
				Cookies.set('tokenid', result.tokenid);
				location.reload();
			} catch (err) {
				console.log(err);
			}
		}
	});
}





