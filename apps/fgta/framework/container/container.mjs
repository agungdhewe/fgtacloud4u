import * as fgta4pageslider from '../../../../../index.php/asset/fgta/framework/fgta4libs/fgta4pageslider.mjs'

import * as cbutton from './containerbutton.mjs'


const btn_apps_back = $('#btn_apps_back')
const btn_menu_back = $('#btn_menu_back')
const btn_home = $('#btn_home')
const btn_reload = $('#btn_reload');
const btn_logout = $('#btn_logout')
const btn_preference = $('#btn_preference')
const pnl_menu = $('#pnl_menu')
const obj_txt_title = $('#obj_txt_title')


const el_pnl_iframe = document.getElementById("pnl_iframe")
const api = {
	listmodules: 'fgta/framework/container/listmodules'
}



var pnl_iframe = $('#pnl_iframe')

export const CurrentState = {
	MenuLevel: 1,
	ContainerTitle: "---",
	LastMenuTitle: "",
	LastMenuParentId: null,
	SlowLoading: false
}

export const ModuleShortcuts = []




export async function init() {
	init_btn_testmenu()
	init_btn_home()
	init_btn_reload();
	init_btn_apps_back()
	init_btn_menu_back()
	init_btn_logout()
	init_btn_preference()
	init_pnl_iframe();
	init_document_event()

	init_data()

	// ambil base title
	$ui.basetitle = $('meta[name=basetitle]').attr("content");
	$(document).attr("title", $ui.basetitle);


	pnl_iframe.on("load", function() {
		// console.log('load module');
		let iframetitletext = pnl_iframe.contents().find("title").html()
		obj_txt_title.html(iframetitletext)
		$(document).attr("title", iframetitletext + ' - ' + $ui.basetitle);

		let meta_el_modulefullname  = pnl_iframe.contents().find("meta[name=modulefullname]"); 
		let modulefullname = meta_el_modulefullname.attr("content")
		if (modulefullname===undefined) {
			$ui.unmask()
			return
		}

		let meta_el_variancename  = pnl_iframe.contents().find("meta[name=variancename]"); 
		let variancename = meta_el_variancename.attr("content")
		
		let meta_el_urlparam = pnl_iframe.contents().find("meta[name=url_param]"); 
		let url_param = meta_el_urlparam.attr("content")

		Cookies.set('last_opened_module', modulefullname, {SameSite: "Strict"})
		Cookies.set('last_opened_module_variance', variancename, {SameSite: "Strict"})
		Cookies.set('last_opened_module_urlparam', url_param, {SameSite: "Strict"})
		if (typeof pnl_iframe.frameloaded === 'function') {
			pnl_iframe.frameloaded()
		}

		$ui.unmask()
		module_enter()

		CurrentState.SlowLoading = false
	})

	open_last_module()
}

export function OnSizeRecalculated(width, height) {
	// console.log(width, height);
}

export function iframe_focus(fn_callback) {
	setTimeout(()=>{
		pnl_iframe[0].contentWindow.focus();
		if (typeof fn_callback === 'function') {
			fn_callback(pnl_iframe);
		}
	}, 100)
}


export function getTitle() {
	return obj_txt_title.html();
}

export function setTitle(text) {
	obj_txt_title.html(text);
}


async function module_enter() {
	fgta4pageslider.SlidePanelLeft(pnl_menu, pnl_iframe)
}

async function module_exit() {
	if (typeof pnl_iframe.frameunloaded === 'function') {
		pnl_iframe.frameunloaded()
	}
	fgta4pageslider.SlidePanelRight(pnl_iframe, pnl_menu)
}


function init_document_event() {
	let windowtitletext = $(document).attr("title")
	CurrentState.ContainerTitle = windowtitletext;
	document.addEventListener('OnSizeRecalculated', (ev) => {
		OnSizeRecalculated(ev.detail.width, ev.detail.height)
	})
}




function init_btn_testmenu() {
	let btn_testmenu = $('#btn_testmenu')
	btn_testmenu.linkbutton({
		onClick: () => { 
			// buka url module di iframe
			OpenModule({
				modulefullname: 'appsgroup/appsname/modulename'
			})
		}
	})
}



function init_btn_home() {
	btn_home.hide()
	btn_home.linkbutton({
		onClick: () => { btn_home_click() }
	})
}

function init_btn_apps_back() {
	btn_apps_back.hide()
	btn_apps_back.linkbutton({
		onClick: () => { btn_apps_back_click() }
	})
}


function init_btn_menu_back() {
	btn_menu_back.hide()
	btn_menu_back.linkbutton({
		onClick: () => { btn_menu_back_click() }
	})	
}

function init_btn_logout() {
	btn_logout.show();
	btn_logout.linkbutton({
		onClick: () => { btn_logout_click() }
	})
}

function init_btn_reload() {
	btn_reload.linkbutton({
		onClick: () => { btn_reload_click() }
	})
}

function init_btn_preference() {
	btn_preference.on('click', ()=>{
		btn_preference_click();
	})
}

function init_pnl_iframe() {
	pnl_iframe.hide();
}

function open_last_module() {
	let last_opened_module = Cookies.get('last_opened_module');
	let last_opened_module_variance = Cookies.get('last_opened_module_variance');
	let last_opened_module_urlparam = Cookies.get('last_opened_module_urlparam');
	if (last_opened_module!=null) {
		pnl_menu.hide();
		if (last_opened_module_variance!=null) {
			OpenModule({
				modulefullname:last_opened_module,
				variancename:last_opened_module_variance,
				url_param:last_opened_module_urlparam
			}, ()=>{})
		} else {
			OpenModule({
				modulefullname: last_opened_module
			}, ()=>{})
		}

	}

}


export function OpenModule(module, fn_loaded) {
	CurrentState.LastMenuTitle = obj_txt_title.html()
	btn_preference.hide();


	btn_reload.show();
	cbutton.SwapButtonRight(btn_logout, btn_home)
	cbutton.SwapButtonLeft(btn_menu_back, btn_apps_back)

	// panel
	// menu --------> apps
	CurrentState.SlowLoading = true
	setTimeout(()=>{
		// slow loading akan berisi false apabila iframe sudah muncul
		// apabila frame belum muncul dalam 5 detik, munculkan loading
		if (CurrentState.SlowLoading) {
			$ui.mask(`<div style="color:white">
				<img src="${window.global.iconloading}" width="32px" height="32px"><br>
				opening ${module.modulefullname},<br>
				this is take more time than ussual, please wait...
				</div>`)
		}		
	}, 5*1000)

	var module_url = './index.php/module/' + module.modulefullname + '?variancename=' + (module.variancename===undefined ? '' : module.variancename);
	el_pnl_iframe.module_url = module_url;
	if (module.url_param!=undefined) {
		module_url += '&' + module.url_param;
	}
	
	pnl_iframe.contents().find("body").html("");
	pnl_iframe.attr('src', module_url)
	pnl_iframe.frameloaded = () => { 
		if (typeof fn_loaded === 'function') {
			fn_loaded();
		}
		iframe_focus();
	}

	pnl_iframe.frameunloaded = () => {
		Cookies.remove('last_opened_module');
		Cookies.remove('last_opened_module_variance');
		Cookies.remove('last_opened_module_urlparam');

		var event = new CustomEvent('OnUnload', {})
		pnl_iframe[0].contentWindow.document.dispatchEvent(event)

		// pnl_iframe.attr('src', 'about:blank')
		// setTimeout(function(){
		// 	pnl_iframe = null
		// 	pnl_iframe = $('#pnl_iframe')
		// }, 1000);

	}

}


export async function OpenHomeMenu() {

	$(document).attr("title", $ui.basetitle);
	obj_txt_title.html(CurrentState.LastMenuTitle)
	
	btn_preference.show();

	btn_reload.hide();	
	cbutton.SwapButtonRight(btn_home, btn_logout)

	if (CurrentState.MenuLevel==1) {
		cbutton.SwapButtonLeft(btn_apps_back, null)
	} else {
		cbutton.SwapButtonLeft(btn_apps_back, btn_menu_back)
	}

	// panel
	// menu <-------- apps
	module_exit()
	// Cookies.remove('last_opened_module');
}



async function btn_logout_click() {
	$ui.ShowMessage('Apakah anda mau logout ?', {
		Ya: () => {
			Cookies.remove('tokenid');
			location.reload();
			//TODO: buat ajax agar saat logout menghapus session di server
		},
		Tidak: () => {

		}
	})

}


async function btn_home_click() {
	console.log('home')
	btn_home.linkbutton({text:'Home'});
	let iframecontent = el_pnl_iframe.contentWindow
	if (typeof iframecontent.home === 'function') {
		iframecontent.home((cancel) => {
			if (!cancel) {
				OpenHomeMenu()
			}
		})		
	} else {
		OpenHomeMenu()
	}
}


async function btn_apps_back_click() {

	let iframecontent = el_pnl_iframe.contentWindow
	if (typeof iframecontent.back === 'function') {
		iframecontent.back((cancel) => {
			if (!cancel) {
				OpenHomeMenu()
			}
		})		
	} else {
		OpenHomeMenu()
	}

}

async function btn_menu_back_click() {
	// kembali ke menu sebelumnya

	console.log('menu back')
	if (CurrentState.LastMenuParentId!=undefined) {
		let mdlist = ModuleShortcuts[CurrentState.LastMenuParentId]
		CreateModuleList(mdlist)
	}


}


async function btn_preference_click() {
	OpenModule({
		modulefullname: 'fgta/framework/preference'
	})
}


async function init_data() {

	let ajax_args = {
		username: window.userdata.username
	}

	let ajax_listmodules = async (args, fn_callback) => {
		let apiurl = api.listmodules
		try {
			let result = await $ui.apicall(apiurl, args)
			fn_callback(null, result)
		} catch (err) {
			fn_callback(err)
		}
	}

	pnl_menu.html(`<div style="display: flex; width: 100%">
	<div style="width: 32px"><img src="data:image/gif;base64,R0lGODlhPQASAPIAAMnJydfX17y8vOTk5P///wAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/wtYTVAgRGF0YVhNUDw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpiOTI3OWQwNC00YTNjLTBkNDUtYTk3NS02NTA1ZTc0ZTAxMDYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NzJCNkIwQzMyQkEyMTFFNTk4MjI4NjU1MjYxOUY5Q0YiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NzJCNkIwQzIyQkEyMTFFNTk4MjI4NjU1MjYxOUY5Q0YiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6Y2FkY2RmOTQtODA1NC1hNDQ3LWE2MGMtM2NmNWIwNjU0ZmFiIiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6MTA1MDM3ZTAtMmJhMS0xMWU1LTgzMjAtOGE0YTVlNGUyMmUyIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Af/+/fz7+vn49/b19PPy8fDv7u3s6+rp6Ofm5eTj4uHg397d3Nva2djX1tXU09LR0M/OzczLysnIx8bFxMPCwcC/vr28u7q5uLe2tbSzsrGwr66trKuqqainpqWko6KhoJ+enZybmpmYl5aVlJOSkZCPjo2Mi4qJiIeGhYSDgoGAf359fHt6eXh3dnV0c3JxcG9ubWxramloZ2ZlZGNiYWBfXl1cW1pZWFdWVVRTUlFQT05NTEtKSUhHRkVEQ0JBQD8+PTw7Ojk4NzY1NDMyMTAvLi0sKyopKCcmJSQjIiEgHx4dHBsaGRgXFhUUExIREA8ODQwLCgkIBwYFBAMCAQAAIfkECQoABAAsAAAAAD0AEgAAA4RIStLuK8pJq70v3837zI8CjCTpnRwIEWWLvpXaiK0J34ss0DWgBMBgEIeR8Wo/oZBo0R1dBOUyKgUqBthsNmZk9XzUalJM0Jq5qmdpLGUrr+YtxentuadVazmORYPUNnkBd0N7fH4adUhhbUxzXV9ggo6PaYpQlCd0kZkom1+dml2hNwkAIfkECQoABAAsAAAAAD0AEgAAA4VIutzyELZJq700asx7A2AYKlqkiKinEqhIls/Zgqs30wQcs3fd3YAXTDZTBI5IpI9XzOmILWMyuQQKS9AUYUrdco8Vq3PIjHq/UjRFrBNkXWduWr7ujbFl7Rccn4btbW8jfV17AX9NgXlwhlWAT4uDjT5skGJLFpVkl5h1iZZ2nT6Koh0JACH5BAkKAAQALAAAAAA9ABIAAAOLSLrc3iJK+aq9+M2du1dAKIrKNoHj+H2pSpgU0ZJrN4clLKBzrQTAYJDXysGIqZ9QWFkyZTejCelyDh9WIJWm20F7hGygmd3iXjozQGklt79F9BGeDJex99taPqVX7w5ialIcfjSCeG96hCeGZ4iBeVF8hYt2bzWWXYM+GJppjnudFp9zlqOdm6gMCQAh+QQJCgAEACwAAAAAPQASAAADjEi63P6QiElpvDjfyrX3QCiKClcpY/p96ViaE9qGKzgDLyzPtRL8QOCulTMNVb2g8uiSwARM0mNArVZ9SiHhhnPqtjeIdYzNBqI0rxHMm46vBPMP3X1C2UT3e1DO0osdeEgOe1R9S4JNdn9JcoyLiVI1cmeRaZBcPRmZaoGcmhGcmGGgoaSjbaU9kBoJACH5BAkKAAQALAAAAAA9ABIAAAOISLrc/jAuQWuVOGtn+/4ZII6j0llgCpGseVJqzLCk+8pSoO+7QpeEFwwH4Rl9P4DtBBk4n0+FkSed6pC/pecB7Vat3ymWpkVxu1GC9apej1tBYRPtDB/bYEJSGb+d6XZUeGJ6SWUXRA9rAW81fUyJDouNQEICkSl7h0OYG5qPW50an5aimKULCQAh+QQJCgAEACwAAAAAPQASAAADaEi63P4wykmrvThnwHvX4OWNYTmNngkGbNsq6Kdmbg3HAFS7yuD/P8XuRRiybjGdsQcECpdFKC73MAaYTd9zuN0hUUouIRuMiq1fUhVK1pq9bxthOqNJcXUMeo7P1+l+M4CBJoOEhwsJACH5BAkKAAQALAAAAAA9ABIAAANXSLrc/jDKSau9OOvNu/9gFIwkGUplCqXlKbLjCgfKTBNDruv13MMyIMGm2Bl/LKTqQRz6cEaeU9h0NJtR6fVpfWKzA2VrmmRyXY1q+oxeqNvwuHxOr3MSACH5BAUKAAQALAAAAAA9ABIAAANoSLrc/jDKSau9Dui9sf8EJ4JkJXJlGp0dEbwwrH6spsT47NXAjcuu30sxKBqNPiGEl/w1c4Sj9Blb1qhA4TAqRQaVD+bXOYZ2vdqAlYXdponnQVsdvparuov4nbeI+yp/gCWCg4aHFwkAOw==" height="9px" width="30px"></div>
	<div>loading dashboards & module list...</div></div>`)
	ajax_listmodules(ajax_args,  (err, result) => {
		if (err) {
			console.log(err)
			if (err.errormessage!=null) pnl_menu.html(err.errormessage)
		} else {
			try {
				let mdlist = {
					id: 0,
					level: 1,
					title: "Menu",
					type: 'topparent',
					MODULES: result				
				}

				ModuleShortcuts.push(mdlist)
				composemodulelist(mdlist)
				//CreateModuleList(mdlist)
				InitFrontPage(mdlist)
			} catch (err) {
				console.log(err);
			}
		}
	});	
}


async function composemodulelist(mdlist) {
	if (mdlist == null) {
		return;
	}

	if (!('MODULES' in mdlist)) {
		return;
	}	

	if ( typeof mdlist.MODULES[Symbol.iterator] !== 'function') {
		return;
	}


	for (let mdlico of mdlist.MODULES) {
		mdlico.level = mdlist.level+1
		mdlico.id = ModuleShortcuts.length
		ModuleShortcuts.push(mdlico)
		mdlico.parent_id = mdlist.id
		if (mdlico.type==='modulegroup') {
			composemodulelist(mdlico)
		}
	}
}


async function CreateModuleList(mdlist) {
	if (mdlist == null) {
		return;
	}

	if (!('MODULES' in mdlist)) {
		return;
	}	

	if ( typeof mdlist.MODULES[Symbol.iterator] !== 'function') {
		return;
	}



	let prev_level = CurrentState.MenuLevel
	let next_level = mdlist.level

	CurrentState.MenuLevel = mdlist.level;
	CurrentState.LastMenuTitle = mdlist.title;
	CurrentState.LastMenuParentId = mdlist.parent_id;
	obj_txt_title.html(mdlist.title)


	if (mdlist.level > 1) {
		// munculkan tombol back menu
		if (mdlist.level==2) {
			cbutton.SwapButtonLeft(null, btn_menu_back)
		} else {
			cbutton.SwapButtonLeft(btn_menu_back, btn_menu_back)
		}

		
	} else {
		cbutton.SwapButtonLeft(btn_menu_back, null)
	}


		

	let prev_elpnl = pnl_menu[0].children[0]
	let next_elpnl = document.createElement('div')  //pnl_menu[0]

	// next_elpnl.classList.add('main-bgmenu');

	$(next_elpnl).css('display', 'flex')
	$(next_elpnl).css('flex-direction', 'row')
	$(next_elpnl).css('flex-wrap', 'wrap')

	for (let mdlico of mdlist.MODULES) {
		if (mdlico.type=='module') {
			cbutton.CreateModuleShortcut(mdlico, next_elpnl, OpenModule)
		} else {
			cbutton.CreateModuleGroup(mdlico, next_elpnl, CreateModuleList)
		}
	}

	if (prev_elpnl===undefined) {
		pnl_menu.html('')
		pnl_menu[0].appendChild(next_elpnl)
	} else {
		let pnl_prev = $(prev_elpnl)
		let pnl_next = $(next_elpnl)

		pnl_next.hide();
		pnl_menu[0].appendChild(next_elpnl)

		if (next_level>prev_level) {
			fgta4pageslider.SlidePanelLeft(pnl_prev, pnl_next, true, ()=>{
				if (document.activeElement instanceof HTMLElement) {
					document.activeElement.blur();
				}
			})
		} else {
			fgta4pageslider.SlidePanelRight(pnl_prev, pnl_next, true, ()=>{
				if (document.activeElement instanceof HTMLElement) {
					document.activeElement.blur();
				}
			})
		}
	}
}


function btn_reload_click() {
	// var params = new URLSearchParams(el_pnl_iframe.contentWindow.location.search)
	var module_url = el_pnl_iframe.module_url;
	el_pnl_iframe.contentWindow.location.href = module_url;
}



function InitFrontPage(mdlist) {
	var frontpage = 'menu';   // dashboard || menu

	if (frontpage=='dashboard') {
		pnl_menu.hide();
		$('.container-bar .row').hide();
		// $('.container-bar .column.right').hide();
		CreateModuleList(mdlist)
		OpenModule({modulefullname: 'finact/dashboards/dash01'}, () => {
			btn_apps_back.hide();
			btn_menu_back.hide();
			btn_reload.hide();
			// btn_home.hide();
			$('.container-bar .row').show();
			// $('.container-bar .column.right').show();
		})
	} else {
		btn_home.linkbutton({text:'Home'});
		CreateModuleList(mdlist);
	}


}