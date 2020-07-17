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
				//$.messager.alert('Login', err.errormessage, 'warning');
				$ui.ShowMessage('[WARNING]'+err.errormessage);
			} else {
				$ui.ShowErrorWindow();
			}
		} else {
			try {
				Cookies.set('tokenid', result.tokenid, {SameSite: "Strict"});
				$('.login-wrapper').html(`
					<div style="display: flex;>
					<div style="width: 30px; margin-right: 5px;"><img src="data:image/gif;base64,R0lGODlhPQASAPIAAMnJydfX17y8vOTk5P///wAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/wtYTVAgRGF0YVhNUDw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpiOTI3OWQwNC00YTNjLTBkNDUtYTk3NS02NTA1ZTc0ZTAxMDYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NzJCNkIwQzMyQkEyMTFFNTk4MjI4NjU1MjYxOUY5Q0YiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NzJCNkIwQzIyQkEyMTFFNTk4MjI4NjU1MjYxOUY5Q0YiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6Y2FkY2RmOTQtODA1NC1hNDQ3LWE2MGMtM2NmNWIwNjU0ZmFiIiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6MTA1MDM3ZTAtMmJhMS0xMWU1LTgzMjAtOGE0YTVlNGUyMmUyIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Af/+/fz7+vn49/b19PPy8fDv7u3s6+rp6Ofm5eTj4uHg397d3Nva2djX1tXU09LR0M/OzczLysnIx8bFxMPCwcC/vr28u7q5uLe2tbSzsrGwr66trKuqqainpqWko6KhoJ+enZybmpmYl5aVlJOSkZCPjo2Mi4qJiIeGhYSDgoGAf359fHt6eXh3dnV0c3JxcG9ubWxramloZ2ZlZGNiYWBfXl1cW1pZWFdWVVRTUlFQT05NTEtKSUhHRkVEQ0JBQD8+PTw7Ojk4NzY1NDMyMTAvLi0sKyopKCcmJSQjIiEgHx4dHBsaGRgXFhUUExIREA8ODQwLCgkIBwYFBAMCAQAAIfkECQoABAAsAAAAAD0AEgAAA4RIStLuK8pJq70v3837zI8CjCTpnRwIEWWLvpXaiK0J34ss0DWgBMBgEIeR8Wo/oZBo0R1dBOUyKgUqBthsNmZk9XzUalJM0Jq5qmdpLGUrr+YtxentuadVazmORYPUNnkBd0N7fH4adUhhbUxzXV9ggo6PaYpQlCd0kZkom1+dml2hNwkAIfkECQoABAAsAAAAAD0AEgAAA4VIutzyELZJq700asx7A2AYKlqkiKinEqhIls/Zgqs30wQcs3fd3YAXTDZTBI5IpI9XzOmILWMyuQQKS9AUYUrdco8Vq3PIjHq/UjRFrBNkXWduWr7ujbFl7Rccn4btbW8jfV17AX9NgXlwhlWAT4uDjT5skGJLFpVkl5h1iZZ2nT6Koh0JACH5BAkKAAQALAAAAAA9ABIAAAOLSLrc3iJK+aq9+M2du1dAKIrKNoHj+H2pSpgU0ZJrN4clLKBzrQTAYJDXysGIqZ9QWFkyZTejCelyDh9WIJWm20F7hGygmd3iXjozQGklt79F9BGeDJex99taPqVX7w5ialIcfjSCeG96hCeGZ4iBeVF8hYt2bzWWXYM+GJppjnudFp9zlqOdm6gMCQAh+QQJCgAEACwAAAAAPQASAAADjEi63P6QiElpvDjfyrX3QCiKClcpY/p96ViaE9qGKzgDLyzPtRL8QOCulTMNVb2g8uiSwARM0mNArVZ9SiHhhnPqtjeIdYzNBqI0rxHMm46vBPMP3X1C2UT3e1DO0osdeEgOe1R9S4JNdn9JcoyLiVI1cmeRaZBcPRmZaoGcmhGcmGGgoaSjbaU9kBoJACH5BAkKAAQALAAAAAA9ABIAAAOISLrc/jAuQWuVOGtn+/4ZII6j0llgCpGseVJqzLCk+8pSoO+7QpeEFwwH4Rl9P4DtBBk4n0+FkSed6pC/pecB7Vat3ymWpkVxu1GC9apej1tBYRPtDB/bYEJSGb+d6XZUeGJ6SWUXRA9rAW81fUyJDouNQEICkSl7h0OYG5qPW50an5aimKULCQAh+QQJCgAEACwAAAAAPQASAAADaEi63P4wykmrvThnwHvX4OWNYTmNngkGbNsq6Kdmbg3HAFS7yuD/P8XuRRiybjGdsQcECpdFKC73MAaYTd9zuN0hUUouIRuMiq1fUhVK1pq9bxthOqNJcXUMeo7P1+l+M4CBJoOEhwsJACH5BAkKAAQALAAAAAA9ABIAAANXSLrc/jDKSau9OOvNu/9gFIwkGUplCqXlKbLjCgfKTBNDruv13MMyIMGm2Bl/LKTqQRz6cEaeU9h0NJtR6fVpfWKzA2VrmmRyXY1q+oxeqNvwuHxOr3MSACH5BAUKAAQALAAAAAA9ABIAAANoSLrc/jDKSau9Dui9sf8EJ4JkJXJlGp0dEbwwrH6spsT47NXAjcuu30sxKBqNPiGEl/w1c4Sj9Blb1qhA4TAqRQaVD+bXOYZ2vdqAlYXdponnQVsdvparuov4nbeI+yp/gCWCg4aHFwkAOw==" height="9px" width="30px"></div>
					<div>loging in ...</div></div>
				`);
				location.reload();
			} catch (err) {
				console.log(err);
			}
		}
	});
}





