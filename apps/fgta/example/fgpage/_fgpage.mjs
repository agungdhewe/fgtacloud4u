const obj_txt_string = $('#obj_txt_string')
const btn_execute_1 = $('#btn_execute_1')
const btn_execute_2 = $('#btn_execute_2')
const btn_execute_3 = $('#btn_execute_3')


export async function init() {

	btn_execute_1.linkbutton({
		onClick: () => { btn_execute_1_click() }
	})

	btn_execute_2.linkbutton({
		onClick: () => { btn_execute_2_click() }
	})	

	btn_execute_3.linkbutton({
		onClick: () => { btn_execute_3_click() }
	})	
}


function btn_execute_1_click() {
	var text = obj_txt_string.textbox('getText')

	if (text.trim()=='') {
		$ui.ShowMessage('[WARNING] Anda belum menuliskan sesuatu')
		return;
	}

	// Ekekusi API
	var apiurl = 'fgta/example/helloapi/namaapi'
	var args = {
		param1: text
	}	
	api_execute(apiurl, args)

}



function btn_execute_2_click() {
	var text = obj_txt_string.textbox('getText')

	if (text.trim()=='') {
		$ui.ShowMessage('[WARNING] Anda belum menuliskan sesuatu')
		return;
	}

	// Ekekusi API
	var apiurl = 'fgta/example/helloapi/testapi'
	var args = {
		param1: text
	}	
	api_execute(apiurl, args)

}



function btn_execute_3_click() {
	var text = obj_txt_string.textbox('getText')

	if (text.trim()=='') {
		$ui.ShowMessage('[WARNING] Anda belum menuliskan sesuatu')
		return;
	}

	// Ekekusi API
	var apiurl = 'fgta/example/helloapi/limitedapi'
	var args = {
		param1: text
	}	
	api_execute(apiurl, args)

}



async function api_execute(apiurl, args) {
	$ui.mask('executing api...')
	try {
		let result = await $ui.apicall(apiurl, args)
		$ui.ShowMessage(`[INFO] ${result}`)
		$ui.unmask()
	} catch (err) {
		$ui.unmask()
		$ui.ShowMessage(`[ERROR] Eksekusi API Error`)
		console.error(err.errormessage)
	}	
}