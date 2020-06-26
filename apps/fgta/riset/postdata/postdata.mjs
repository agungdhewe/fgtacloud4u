const btn_submit = $('#btn_submit');
const obj_nama = $('#obj_nama');
const obj_alamat = $('#obj_alamat');

export function init(opt) {

	obj_nama.textbox('setText', 'agung');
	obj_alamat.textbox('setText', 'jakarta');


	btn_submit.linkbutton({
		onClick: () => {
			btn_submit_click();
		}
	})	
}


async function btn_submit_click() {	
	var nama = obj_nama.textbox('getText');
	var alamat = obj_alamat.textbox('getText');


	// console.log(`submit '${nama}' & '${alamat}'`);

	var apiurl = 'fgta/riset/postdata/testapi';
	var args = {
		nama: nama,
		alamat: alamat
	}

	$ui.mask('executing api...')
	try {
		let result = await $ui.apicall(apiurl, args);
		console.log(result);
		$('#result').html(result.yangdikirim);
		$ui.unmask()
	} catch (err) {
		console.error(err);
		$ui.unmask()
		$ui.ShowMessage(`[ERROR] Eksekusi API Error`);
		$('#result').html(err.errormessage);
	}

}