import { fgta4slideselect } from '../../../../../index.php/asset/fgta/framework/fgta4libs/fgta4slideselect.mjs'
import { fgta4ParallelProcess } from '../../../../../index.php/asset/fgta/framework/fgta4libs/fgta4parallel.mjs'



var this_page_id;
var pnl_form = $('#pnl_editpage2-form'); 


export async function init(opt) {
	this_page_id = opt.id
	



	document.addEventListener('OnButtonBack', (ev) => {
		if ($ui.getPages().getCurrentPage()==this_page_id) {
			ev.detail.cancel = true;
			$ui.getPages().show('pnl_editpage1')
		}
	})

	document.addEventListener('OnButtonHome', (ev) => {
		if ($ui.getPages().getCurrentPage()==this_page_id) {
			ev.detail.cancel = true;
		}
	})

	document.addEventListener('OnSizeRecalculated', (ev) => {
		OnSizeRecalculated(ev.detail.width, ev.detail.height)
	})	
}


export function OnSizeRecalculated(width, height) {
}



export function OpenDetil(data) {
}


export function FormatPage() {
	// clear form
	pnl_form.html('');


	// ambil checklist dari API
	var checklist = {
		satu: {caption: 'Pertanyaan pertama', type: 'text'},
		dua: {caption: 'Pertanyaan keDua', type: 'combo', combo:{api:'ent/organisation/dept/list', fieldValue:'dept_id', fieldValueMap:'dept_id', fieldDisplay:'dept_name' }},
		tiga: {caption: 'Pertanyaan keTiga', type: 'radio', options:[{caption:'pilihan 1', value:'pilihan1'}, {caption:'pilihan 2', value:'pilihan2'}, {caption:'pilihan 3', value:'pilihan3'}]},
	}

	var objchecklist = {};
	for (var cname in checklist) {
		var item = checklist[cname];
		
		switch (item.type) {
			case "radio":
				var html_options = '';
				var rdo_name = 'pnl_editpage1-rdo_' + cname + '_options';
				var i = 0;
				for (var rdo of item.options) {
					i++;
					var id = 'pnl_editpage1-rdo_' + cname + "-" + i;
					html_options += `
						<input id="${id}" class="easyui-radiobutton" name="${rdo_name}" value="${rdo.value}" label="${rdo.caption}" data-options="labelPosition:'after'">
					`;
				}

				
				var html = `
					<div class="fgpage-row">
						<div class="fgpage-label">${item.caption}</div>
						<div>		
							${html_options}
						</div>
					</div>
				`
				$(html).appendTo(pnl_form);
				var i = 0;
				for (var rdo of item.options) {
					i++;
					var id = 'pnl_editpage1-rdo_' + cname + "-" + i;
					objchecklist[id] = $('#' + id);
					objchecklist[id].item = item;	
				}
				break;


			case "combo":
				var id = 'pnl_editpage1-cbo_' + cname;
				var html = `
					<div class="fgpage-row">
						<div class="fgpage-label">${item.caption}</div>
						<div>		
							<input id="${id}" class="easyui-combo" options:"width: 200px">
						</div>
					</div>
				`	
				$(html).appendTo(pnl_form)
				objchecklist[id] = $('#' + id);
				objchecklist[id].item = item;			
				break;

			default:
				var id = 'pnl_editpage1-cbo_' + cname;
				var html = `
					<div class="fgpage-row">
						<div class="fgpage-label">${item.caption}</div>
						<div>		
							<input id="${id}" class="easyui-textbox" options:"width: 200px">
						</div>
					</div>
				`;
				$(html).appendTo(pnl_form)
				objchecklist[id] = $('#' + id);
				objchecklist[id].item = item;
		}

	}

	FormatPage_Init(objchecklist);

}


async function FormatPage_Init(objchecklist) {
	$.parser.parse('#pnl_editpage2-form');


	console.log(objchecklist);

	for (var id in objchecklist) {
		let objcl = objchecklist[id];

		console.log(objcl.item.type);
		if (objcl.item.type === 'combo') {
			console.log(id);
			
			objcl.name = id	
			new fgta4slideselect(objcl, {
				title: 'Pilih ' + objcl.item.caption,
				returnpage: this_page_id,
				api: objcl.item.combo.api,
		
				fieldValue: objcl.item.combo.fieldValue,
				fieldValueMap: objcl.item.combo.fieldValueMap,
				fieldDisplay: objcl.item.combo.fieldDisplay,
				fields: [
					{ mapping: objcl.item.combo.fieldValueMap, text: objcl.item.combo.fieldValueMap },
					{ mapping: objcl.item.combo.fieldDisplay, text: objcl.item.combo.fieldDisplay }
				],
				OnDataLoading: (criteria) => {
					// console.log('loading...');
				},
				OnDataLoaded: (result, options) => {
					var firstrecord = {}

					console.log(objcl.item.combo)

					firstrecord[objcl.item.combo.fieldValueMap] = '--NULL--';
					firstrecord[objcl.item.combo.fieldDisplay] = 'NONE';
					result.records.unshift(firstrecord);
				},
				OnSelected: (value, display, record, options) => {
					// TODO: panggil save api untuk simpan variable ini 
					console.log('combo: panggil save api ')

				},
				OnCreated: () => {
					objcl.combo('setValue', '--NULL--');
					objcl.combo('setText', 'NONE');
				}
			});



		} else if (objcl.item.type === 'radio') {
			console.log('set event radio')
			console.log(objcl);
			objcl.radiobutton({
				onChange: (checked) => {
					console.log('radio: panggil save api ')
				}
			})

		} else if (objcl.item.type === 'text') {
			console.log('set event text')
			objcl.textbox({
				onChange: () => {
					console.log('textbox: panggil save api ')
				}
			})
		}
	}


} 