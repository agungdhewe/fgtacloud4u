import * as fgta4pageslider from '../../../../../index.php/asset/fgta/framework/fgta4libs/fgta4pageslider.mjs'

import * as cbutton from './containerbutton.mjs'


const btn_apps_back = $('#btn_apps_back')
const btn_menu_back = $('#btn_menu_back')
const btn_home = $('#btn_home')
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
		console.log('load module');
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

		Cookies.set('last_opened_module', modulefullname)
		Cookies.set('last_opened_module_variance', variancename)
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

function init_btn_preference() {
	btn_preference.on('click', ()=>{
		btn_preference_click();
	})
}

function init_pnl_iframe() {
	pnl_iframe.hide();
}

function open_last_module() {
	let last_opened_module = Cookies.get('last_opened_module')
	let last_opened_module_variance = Cookies.get('last_opened_module_variance')
	if (last_opened_module!=null) {
		if (last_opened_module_variance!=null) {
			OpenModule({
				modulefullname: last_opened_module,
				variancename: last_opened_module_variance
			})
		} else {
			OpenModule({
				modulefullname: last_opened_module
			})
		}

	}

}


function OpenModule(module, fn_loaded) {
	CurrentState.LastMenuTitle = obj_txt_title.html()
	btn_preference.hide();

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

	pnl_iframe.contents().find("body").html("");
	pnl_iframe.attr('src', './index.php/module/' + module.modulefullname + '?variancename=' + (module.variancename===undefined ? '' : module.variancename))
	pnl_iframe.frameloaded = () => { 
		if (typeof fn_loaded === 'function') {
			fn_loaded();
		}
	}

	pnl_iframe.frameunloaded = () => {
		Cookies.remove('last_opened_module');
		Cookies.remove('last_opened_module_variance');
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
	let logout = await $ui.exitconfirm('Anda yakin mau logout ?');
	if (logout) {
		Cookies.remove('tokenid');
		location.reload();

		//TODO: buat ajax agar saat logout menghapus session di server
	}
}


async function btn_home_click() {
	console.log('home')
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

	pnl_menu.html('loading medule list...')
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
				CreateModuleList(mdlist)
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

