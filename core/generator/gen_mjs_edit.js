const path = require('path')
const fs = require('fs')

const colReset = "\x1b[0m"
const colFgRed = "\x1b[31m"
const colFgGreen = "\x1b[32m"
const colFgYellow = "\x1b[33m"
const colFgBlack = "\x1b[30m"
const colBright = "\x1b[1m"
const BgYellow = "\x1b[43m"


const fieldexclude = ['_createby', '_createdate', '_modifyby', '_modifydate']


module.exports = async (fsd, genconfig) => {
	try {

		console.log(`-----------------------------------------------`)
		console.log(`Generate Edit PHTML...`)



		var headertable_name = genconfig.schema.header
		var headertable = genconfig.persistent[headertable_name]
		var data = headertable.data

		var primarykey = headertable.primarykeys[0]
		var primarycomppreix = data[primarykey].comp.prefix

		var add_approval = genconfig.approval===true;
		var add_commiter = add_approval===true ? true : (genconfig.committer===true);


		// console.log(data)
		var slideselectlib = ''
		var slideselects = ''
		var lookupsetvalue = ''
		var setdefaultnow = ''
		var setdefaultcombo = '';
		var skippedfield = '';
		var updateskippedfield = '';
		var nullresultloaded = '';
		var formcomp = [];
		var uploadconst = '';
		var uploadevent = ''; 
		var uploadopened = '';
		var uploadcreatenew = '';

		for (var fieldname in data) {
			if (fieldexclude.includes(fieldname)) { continue }
			var prefix = data[fieldname].comp.prefix
			var comptype = data[fieldname].comp.comptype
			
			var recursivetable = false;
			var initialvalue =  data[fieldname].initialvalue;

			

			if (data[fieldname].comp.options!==undefined) {
				recursivetable = data[fieldname].comp.options.table===headertable_name ? true : false;
			}


			formcomp.push(`\t${prefix}${fieldname}: $('#pnl_edit-${prefix}${fieldname}')`)

			if (comptype=='datebox') {
				setdefaultnow += `\t\tdata.${fieldname} = global.now()\r\n`
			} else if (comptype=='numberbox') {
				setdefaultnow += `\t\tdata.${fieldname} = 0\r\n`
			} else if (comptype=='textbox') {
				if (typeof initialvalue === 'string') {
					if (initialvalue.startsWith('global.setup')) {
						setdefaultnow += `\t\tdata.${fieldname} = ${initialvalue}\r\n`
					} else {
						setdefaultnow += `\t\tdata.${fieldname} = '${initialvalue}'\r\n`
					}
					
				}
			} else if (comptype=='checkbox') {
				if (data[fieldname].default!==undefined) {
					setdefaultnow += `\t\tdata.${fieldname} = '${data[fieldname].default}'\r\n`
				}
			}

			if (comptype=='combo') {
				
				var options = data[fieldname].comp.options
				var field_display_name = options.field_display;
				if (options.field_display_name!=null) {
					field_display_name = options.field_display_name;
				}
				lookupsetvalue += `\r\n\t\t\t.setValue(obj.${prefix}${fieldname}, record.${fieldname}, record.${field_display_name})`

				var pilihnone = '';
				// var allownull = data[fieldname].null;
				var allownull = true;
				if (data[fieldname].null==false) {
					allownull = false;
				} else if (data[fieldname].options!=null) {
					if (data[fieldname].options.required==true) {
						allownull = false;
					}
				}

				if (allownull) {
					if (typeof initialvalue === 'object') { 
						setdefaultcombo += `\t\tdata.${fieldname} = ${initialvalue.id}\r\n`
						setdefaultcombo += `\t\tdata.${field_display_name} = ${initialvalue.name}\r\n`
					} else {
						setdefaultcombo += `\t\tdata.${fieldname} = '--NULL--'\r\n`
						setdefaultcombo += `\t\tdata.${field_display_name} = 'NONE'\r\n`
					}

					nullresultloaded += `\t\tif (result.record.${fieldname}==null) { result.record.${fieldname}='--NULL--'; result.record.${field_display_name}='NONE'; }\r\n`;
					pilihnone = `result.records.unshift({${options.field_value}:'--NULL--', ${options.field_display}:'NONE'});`	
				} else {
					if (typeof initialvalue === 'object') { 
						setdefaultcombo += `\t\tdata.${fieldname} = ${initialvalue.id}\r\n`
						setdefaultcombo += `\t\tdata.${field_display_name} = ${initialvalue.name}\r\n`
					} else if (add_approval && fieldname=='doc_id') {
						setdefaultcombo += `\t\tdata.${fieldname} = global.setup.doc_id\r\n`
						setdefaultcombo += `\t\tdata.${field_display_name} = global.setup.doc_id\r\n`
					} else if (initialvalue!=null) {
						setdefaultcombo += `\t\tdata.${fieldname} = '${initialvalue.id}'\r\n`
						setdefaultcombo += `\t\tdata.${field_display_name} = '${initialvalue.display}'\r\n`
					} else {
						setdefaultcombo += `\t\tdata.${fieldname} = '0'\r\n`
						setdefaultcombo += `\t\tdata.${field_display_name} = '-- PILIH --'\r\n`
					}
				}				

				hapuspilihansama = '';
				if (recursivetable) {
					//  skippedfield += `\toptions.skipmappingresponse = ["${fieldname}"];\r\n`;
					skippedfield += `${fieldname}, `;
					updateskippedfield += `\tform.setValue(obj.${prefix}${fieldname}, result.dataresponse.${field_display_name}!=='--NULL--' ? result.dataresponse.${fieldname} : '--NULL--', result.dataresponse.${field_display_name}!=='--NULL--'?result.dataresponse.${field_display_name}:'NONE')\r\n`;
					hapuspilihansama = `
			// hapus pilihan yang sama dengan data saat ini
			var id = obj.${primarycomppreix}${primarykey}.textbox('getText')
			var i = 0; var idx = -1;
			for (var d of result.records) {
				if (d.${primarykey}==id) { idx = i; }
				i++;
			}
			if (idx>=0) { result.records.splice(idx, 1); }					
			
			`;	

				} else if (allownull) {
					// skippedfield += `\toptions.skipmappingresponse = ["${fieldname}"];\r\n`;
					skippedfield += `'${fieldname}', `;
					updateskippedfield += `\tform.setValue(obj.${prefix}${fieldname}, result.dataresponse.${field_display_name}!=='--NULL--' ? result.dataresponse.${fieldname} : '--NULL--', result.dataresponse.${field_display_name}!=='--NULL--'?result.dataresponse.${field_display_name}:'NONE')\r\n`;
				}

				var datasample = ''
				if (options.api===undefined) {
					datasample = `,

		// hanya untuk contoh
		data: [
			{${fieldname}:'${fieldname}-satu', ${options.field_display}:'${options.field_display}-satu'},
			{${fieldname}:'${fieldname}-dua',  ${options.field_display}:'${options.field_display}-dua'},
			{${fieldname}:'${fieldname}-tiga', ${options.field_display}:'${options.field_display}-tiga'},
		]
					`;
				}
				
				var apiloader = `$ui.apis.load_${fieldname}`;
				if (options.api.startsWith("local:")) {
					var apiloadername =  options.api.replace("local:", '').trim();
					apiloader = '`${global.modulefullname}/' + apiloadername + '`';
				}

				var OnSelectedScript =  data[fieldname].comp.options.OnSelectedScript===undefined? '' : data[fieldname].comp.options.OnSelectedScript;
				// console.log( data[fieldname].comp);
				// console.log('-----------')
				// console.log(OnSelectedScript)
				// console.log('-----------')

				var fieldMappings = '';
				if (data[fieldname].comp.options.field_mappings!==undefined) {
					fieldMappings = "\r\n";
					for (var mp of data[fieldname].comp.options.field_mappings) {
						fieldMappings += "\t\t\t" + mp + ',\r\n'
					}
				} 

				var staticfilter = options.staticfilter!=null ? options.staticfilter.trim() : '';

				slideselectlib = `import {fgta4slideselect} from  '../../../../../index.php/asset/fgta/framework/fgta4libs/fgta4slideselect.mjs'`
				slideselects += `
	new fgta4slideselect(obj.${prefix}${fieldname}, {
		title: 'Pilih ${fieldname}',
		returnpage: this_page_id,
		api: ${apiloader},
		fieldValue: '${fieldname}',
		fieldValueMap: '${options.field_value}',
		fieldDisplay: '${options.field_display}',
		fields: [
			{mapping: '${options.field_value}', text: '${options.field_value}'},
			{mapping: '${options.field_display}', text: '${options.field_display}'},${fieldMappings}
		]${datasample},
		OnDataLoading: (criteria) => {
			${staticfilter}			
		},
		OnDataLoaded : (result, options) => {
			${hapuspilihansama}${pilihnone}	
		},
		OnSelected: (value, display, record, args) => {
			if (value!=args.PreviousValue ) {${OnSelectedScript}				
			}
		}
	})				
				`;
			}



			if (comptype=='filebox') {

				// start uploadconst
				uploadconst += `
const ${prefix}${fieldname}_img = $('#pnl_edit-${prefix}${fieldname}_img');
const ${prefix}${fieldname}_lnk = $('#pnl_edit-${prefix}${fieldname}_link');				
				`;
				// end uploadconst


				// start uploadevent
				uploadevent += `
	obj.${prefix}${fieldname}.filebox({
		onChange: function(value) {
			var files = obj.${prefix}${fieldname}.filebox('files');
			var f = files[0];
			var reader = new FileReader();
			reader.onload = (function(loaded) {
				return function(e) {
					if (loaded.type.startsWith('image')) {
						var image = new Image();
						image.src = e.target.result;
						image.onload = function() {
							${prefix}${fieldname}_img.attr('src', e.target.result);
							${prefix}${fieldname}_img.show();
							${prefix}${fieldname}_lnk.hide();
						}
					} else {
						${prefix}${fieldname}_img.hide();
						${prefix}${fieldname}_lnk.hide();
					}
				}
			})(f);
			if (f!==undefined) { reader.readAsDataURL(f) }
		}
	})				
				`;
				// end uploadevent


				// start uploadopened
				uploadopened += `
		obj.${prefix}${fieldname}.filebox('clear');			
		if (record.${fieldname}_doc!=undefined) {
			if (record.${fieldname}_doc.type.startsWith('image')) {
				${prefix}${fieldname}_lnk.hide();
				${prefix}${fieldname}_img.show();
				${prefix}${fieldname}_img.attr('src', record.${fieldname}_doc.attachmentdata);
			} else {
				${prefix}${fieldname}_img.hide();
				${prefix}${fieldname}_lnk.show();
				${prefix}${fieldname}_lnk[0].onclick = () => {
					${prefix}${fieldname}_lnk.attr('download', record.${fieldname}_doc.name);
					${prefix}${fieldname}_lnk.attr('href', record.${fieldname}_doc.attachmentdata);
				}
			}	
		} else {
			${prefix}${fieldname}_img.hide();
			${prefix}${fieldname}_lnk.hide();			
		}				
				`;
				// end uploadopened
				


				// start uploadcreatenew
				uploadcreatenew += `
		${prefix}${fieldname}_img.hide();
		${prefix}${fieldname}_lnk.hide();	
		obj.${prefix}${fieldname}.filebox('clear');		
				`;
				// end uploadcreatenew


				
			}


		} /// END LOOP



		var autoid = genconfig.autoid


		var detil_createnew_script = ''
		if (Object.keys(genconfig.schema.detils).length>0) {
			for (var detilname in genconfig.schema.detils) {
				var detil = genconfig.schema.detils[detilname]
				if (detil.form===true) {
					detil_createnew_script += `\t\t$ui.getPages().ITEMS['pnl_edit${detilname}grid'].handler.createnew(data, options)\r\n`
				}
			}
		}


		var basename = genconfig.basename
		var add_printfunction = genconfig.printing;
		var printbutton = '';
		var printfunction = '';
		var printhandlerassignment = '';
		if (add_printfunction) {
			printbutton = `const btn_print = $('#pnl_edit-btn_print');`;
			printfunction = get_print_fn(basename, primarykey);
			printhandlerassignment = get_print_handlerassignment();
		} 


		var commitbutton = '';
		var commithandlerassignment = '';
		var approvebutton = '';
		var approvehandlerassignment = '';
		if (add_commiter) {
			cek_commiter(genconfig);
			commitbutton = `
const btn_commit = $('#pnl_edit-btn_commit')
const btn_uncommit = $('#pnl_edit-btn_uncommit')
			`;
			commithandlerassignment = `
	btn_commit.linkbutton({ onClick: () => { btn_action_click({ action: 'commit' }); } });
	btn_uncommit.linkbutton({ onClick: () => { btn_action_click({ action: 'uncommit' }); } });			
			`;
			if (add_approval) {
				cek_approval(genconfig);
				approvebutton = `
const btn_approve = $('#pnl_edit-btn_approve')
const btn_decline = $('#pnl_edit-btn_decline')			
				`;
	approvehandlerassignment = `
	btn_approve.linkbutton({ onClick: () => { btn_action_click({ action: 'approve' }); } });
	btn_decline.linkbutton({ onClick: () => {
		var id = 'pnl_edit-reason_' + Date.now().toString();
		$ui.ShowMessage(\`
			<div style="display: block;  margin-bottom: 10px">
				<div style="font-weight: bold; margin-bottom: 10px">Reason</div>
				<div">
					<input id="\${id}" class="easyui-textbox" style="width: 300px; height: 60px;" data-options="multiline: true">
				</div>
			</div>
		\`, {
			'Decline': () => {
				var reason = $(\`#\${id}\`).textbox('getValue');
				btn_action_click({ action: 'decline', reason: reason }); 
			},
			'Cancel': () => {
			} 
		}, ()=>{
			var obj_reason = $(\`#\${id}\`);
			var txt = obj_reason.textbox('textbox');
			txt[0].maxLength = 255;
			txt[0].classList.add('declinereasonbox');
			txt[0].addEventListener('keyup', (ev)=>{
				if (ev.key=='Enter') {
					ev.stopPropagation();
				}
			});
			txt.css('text-align', 'center');
			txt.focus();
		})
	}});				
				`;
			}
		}


		var actionfunction = get_action_function(add_commiter, add_approval, genconfig);
		var actionbuttonstate = get_action_buttonstate (add_commiter, add_approval, genconfig);
		var actionbuttoninitstate = get_action_buttoninitstate (add_commiter, add_approval, genconfig);
		var actionupdategrid = get_action_updategrid (add_commiter, add_approval, genconfig);
		var statuscreated = get_statuscreated (add_commiter, add_approval, genconfig);
		var recordstatus = get_recordstatus (add_commiter, add_approval, genconfig);
		var recordstatusdataopen = get_recordstatusdataopen(add_commiter, add_approval, genconfig) 
		var recordstatusnew =  get_recordstatusnew(add_commiter, add_approval, genconfig) 


		var buttonstate = "\t" + '//button state';
		if (genconfig.disablenewbutton===true) {
			buttonstate += "\r\n\t" + "btn_edit.hide();"
			buttonstate += "\r\n\t" + "btn_save.hide();"
			buttonstate += "\r\n\t" + "btn_delete.hide();"
		}

		
		var phtmltpl = path.join(genconfig.GENLIBDIR, 'tpl', 'edit_mjs.tpl')
		var tplscript = fs.readFileSync(phtmltpl).toString()
		tplscript = tplscript.replace('/*--__FORMCOMP__--*/', formcomp.join(`,\r\n`))
		tplscript = tplscript.replace('/*--__FORMCOMPID__--*/', `${primarycomppreix}${primarykey}`)
		tplscript = tplscript.replace('/*--__FORMCOMPID__--*/', `${primarycomppreix}${primarykey}`)
		tplscript = tplscript.replace('/*--__SETDEFAULTNOW__--*/', setdefaultnow)
		tplscript = tplscript.replace('/*--__AUTOID__--*/', autoid===true ? 'true' : 'false')
		tplscript = tplscript.replace('/*--__CREATENEW__--*/', detil_createnew_script)
		tplscript = tplscript.replace('/*--__LOOKUPSETVALUE__--*/', lookupsetvalue)
		tplscript = tplscript.replace('/*--__SETDEFAULTCOMBO__--*/', setdefaultcombo)

		tplscript = tplscript.replace('/*--__SKIPPEDFIELD__--*/', skippedfield)
		tplscript = tplscript.replace('/*--__UPDATESKIPPEDFIELD__--*/', updateskippedfield)
		tplscript = tplscript.replace('/*--__NULLRESULTLOADED__--*/', nullresultloaded)


		
		tplscript = tplscript.replace('/*--__SLIDESELECTLIB__--*/', slideselectlib)
		tplscript = tplscript.replace('/*--__SLIDESELECS__--*/', slideselects)
		tplscript = tplscript.replace('/*--__LOGVIEW__--*/', headertable_name)

		tplscript = tplscript.replace('/*--__PRINTBUTTON__--*/', printbutton)
		tplscript = tplscript.replace('/*--__PRINTFUNCTION__--*/', printfunction)
		tplscript = tplscript.replace('/*--__PRINTHANDLERASSIGNMENT__--*/', printhandlerassignment)
		tplscript = tplscript.replace('/*--__COMMITBUTTON__--*/', commitbutton)
		tplscript = tplscript.replace('/*--__COMMITHANDLERASSIGNMENT__--*/', commithandlerassignment)
		tplscript = tplscript.replace('/*--__APPROVEBUTTON__--*/', approvebutton)
		tplscript = tplscript.replace('/*--__APPROVEHANDLERASSIGNMENT__--*/', approvehandlerassignment)

		tplscript = tplscript.replace('/*--__ACTIONFUNCTION__--*/', actionfunction);
		tplscript = tplscript.replace('/*--__ACTIONBUTTONSTATE__--*/', actionbuttonstate);
		tplscript = tplscript.replace('/*--__ACTIONBUTTONINITSTATE__--*/', actionbuttoninitstate);
		tplscript = tplscript.replace('/*--__ACTIONUPDATEGRID__--*/', actionupdategrid);

		tplscript = tplscript.replace('/*--__STATUSCREATED__--*/', statuscreated);
		tplscript = tplscript.replace('/*--__RECORDSTATUS__--*/', recordstatus);
		tplscript = tplscript.replace('/*--__RECORDSTATUSDATAOPEN__--*/', recordstatusdataopen);
		tplscript = tplscript.replace('/*--__RECORDSTATUSNEW__--*/', recordstatusnew);


		tplscript = tplscript.replace('/*--__UPLOADCONST__--*/', uploadconst);
		tplscript = tplscript.replace('/*--__UPLOADEVENT__--*/', uploadevent);

		tplscript = tplscript.replace('/*--__UPLOADOPENED__--*/', uploadopened);
		tplscript = tplscript.replace('/*--__UPLOADCREATENEW__--*/', uploadcreatenew);

		tplscript = tplscript.replace('/*--__BUTTONSTATE__--*/', buttonstate)
		 
		
		

		 /*--__RECORDSTATUSDATAOPEN__--*/   /*--__RECORDSTATUSNEW__--*/

		fsd.script = tplscript		

	} catch (err) {
		throw err
	}
}



function get_print_handlerassignment() {
	return `

	btn_print.linkbutton({
		onClick: () => {
			btn_print_click();
		}
	});	
	
	`
}




function get_print_fn(basename, primarykey) {
	return `

function btn_print_click() {

	if (form.isDataChanged() || !form.isInViewMode()) {
		$ui.ShowMessage('Simpan dulu perubahan datanya.');
		return;
	}

	var id = obj.txt_${primarykey}.textbox('getValue');
	var printurl = 'index.php/printout/' + window.global.modulefullname + '/${basename}.xprint?id=' + id;

	var print_to_new_window = global.setup.print_to_new_window;
	var debug = false;
	var debug = false;
	if (debug || print_to_new_window) {
		var w = window.open(printurl);
		w.onload = () => {
			window.onreadytoprint(() => {
				iframe.contentWindow.print();
			});
		}
	} else {
		$ui.mask('wait...');
		var iframe_id = 'fgta_printelement';
		var iframe = document.getElementById(iframe_id);
		if (iframe) {
			iframe.parentNode.removeChild(iframe);
			iframe = null;
		}

		if (!iframe) {
			iframe = document.createElement('iframe');
			iframe.id = iframe_id;
			iframe.style.visibility = 'hidden';
			iframe.style.height = '10px';
			iframe.style.widows = '10px';
			document.body.appendChild(iframe);

			iframe.onload = () => {
				$ui.unmask();
				iframe.contentWindow.OnPrintCommand(() => {
					console.log('start print');
					iframe.contentWindow.print();
				});
				iframe.contentWindow.preparemodule();
			}
		}
		iframe.src = printurl + '&iframe=1';

	}

}	


`;
}



function cek_commiter(genconfig) {
	var headertable_name = genconfig.schema.header
	var headertable = genconfig.persistent[headertable_name]
	var data = headertable.data
	var basetableentity = genconfig.basetableentity;

	try {
		var iscommit = basetableentity + '_iscommit';
		var commitby = basetableentity + '_commitby';
		var commitdate = basetableentity + '_commitdate';
		var version = basetableentity + '_version';
		if (data[iscommit]==null) { throw `Belum ada field '${iscommit}' di table header`; }
		if (data[commitby]==null) { throw `Belum ada field '${commitby}' di table header`; }
		if (data[commitdate]==null) { throw `Belum ada field '${commitdate}' di table header`; }
		if (data[version]==null) { throw `Belum ada field '${version}' di table header`; }
	} catch (err) {
		throw err
	}
}




function cek_approval(genconfig) {
	var headertable_name = genconfig.schema.header
	var headertable = genconfig.persistent[headertable_name]
	var data = headertable.data
	var basetableentity = genconfig.basetableentity;

	try {
		if (genconfig.doc_id=== undefined) {
			throw 'doc_id belum didefinisikan di genconfig';
		}

		var isapproved = basetableentity + '_isapproved';
		var approveby = basetableentity + '_approveby';
		var approvedate = basetableentity + '_approvedate';
		var isapprovalprogress = basetableentity + '_isapprovalprogress';
		var isdeclined = basetableentity + '_isdeclined';
		var declineby = basetableentity + '_declineby';
		var declinedate = basetableentity + '_declinedate';
		if (data[isapproved]==null) { throw `Belum ada field '${isapproved}' di table header`; }
		if (data[approveby]==null) { throw `Belum ada field '${approveby}' di table header`; }
		if (data[approvedate]==null) { throw `Belum ada field '${approvedate}' di table header`; }
		if (data[isapprovalprogress]==null) { throw `Belum ada field '${isapprovalprogress}' di table header`; }
		if (data[isdeclined]==null) { throw `Belum ada field '${isdeclined}' di table header`; }
		if (data[declineby]==null) { throw `Belum ada field '${declineby}' di table header`; }
		if (data[declinedate]==null) { throw `Belum ada field '${declinedate}' di table header`; }
		if (data['doc_id']==null) { throw `Belum ada field 'doc_id' di table header`; }

		if (data['dept_id']==null) {
			if (genconfig.dept_id_field==null) {
				{ throw `Belum ada field 'dept_id' di table header, atau belum mendefinisikan 'dept_id_field' pada konfigurasi`; }
			}
		} 

	} catch (err) {
		throw err
	}
}


function get_action_function(add_commiter, add_approval, genconfig) {
	if (!add_commiter && !add_approval) {
		return '';
	}

	var varapprove = '';
	var basetableentity = genconfig.basetableentity;
	var resultcommit_appr = '';
	var resultuncommit_appr = '';
	var optioncaseapproval = '';
	if (add_approval) {
		varapprove = `
	var chk_isapprovalprogress = obj.chk_${basetableentity}_isapprovalprogress;	
	var chk_isapprove = obj.chk_${basetableentity}_isapproved;
	var chk_isdeclined = obj.chk_${basetableentity}_isdeclined;
		`;
		resultcommit_appr = `
			chk_isapprove.checkbox('uncheck');
		`;
		resultuncommit_appr = `
			chk_isapprove.checkbox('uncheck');
			chk_isdeclined.checkbox('uncheck');
		`;
		optioncaseapproval = `
		case 'approve' :
			args.act_url = \`\${global.modulefullname}/xtion-approve\`;
			args.act_msg_quest = \`Apakah anda yakin akan <b>\${args.action}</b> \${docname} no \${args.id} ?\`;
			args.act_msg_result = \`\${docname} no \${args.id} telah di \${args.action}.\`;
			args.use_otp = true;
			args.otp_title = 'Approval Code';
			args.param = {
				approve: true,
				approval_note: ''
			}
			args.act_do = (result) => {
				chk_iscommit.checkbox('check');
				chk_isapprovalprogress.checkbox('check');
				chk_isapprove.checkbox(result.isfinalapproval ? "check" : "uncheck");
				chk_isdeclined.checkbox('uncheck');
				form.commit();
			}
			break;

		case 'decline' :
			args.act_url = \`\${global.modulefullname}/xtion-approve\`;
			args.act_msg_quest = '', //\`Apakah anda yakin akan <b>\${args.action}</b> \${docname} no \${args.id} ?\`;
			args.act_msg_result = \`\${docname} no \${args.id} telah di \${args.action}.\`;
			args.use_otp = true;
			args.otp_title = 'Decline Code';
			args.param = {
				approve: false,
				approval_note: args.reason
			}
			args.act_do = (result) => {
				chk_iscommit.checkbox('check');
				chk_isapprove.checkbox('uncheck');
				chk_isdeclined.checkbox('check');
				form.commit();
			}
			break;		
		`;

	}

	return `
async function btn_action_click(args) {
	if (form.isDataChanged() || !form.isInViewMode()) {
		$ui.ShowMessage('[WARNING]Simpan dulu perubahan data, dan tidak sedang dalam mode edit.');
		return;
	}


	var docname = '${genconfig.schema.title}'
	var txt_version = obj.txt_${basetableentity}_version;
	var chk_iscommit = obj.chk_${basetableentity}_iscommit;
	${varapprove}
	
	var id = form.getCurrentId();

	Object.assign(args, {
		id: id,
		act_url: null,
		act_msg_quest: null,
		act_msg_result: null,
		act_do: null,
		use_otp: false,
		otp_message: \`Berikut adalah code yang harus anda masukkan untuk melakukan \${args.action} \${docname} dengan no id \${id}\`,
	});

	switch (args.action) {
		case 'commit' :
			args.act_url = \`\${global.modulefullname}/xtion-\${args.action}\`;
			args.act_msg_quest = \`Apakah anda yakin akan <b>\${args.action}</b> \${docname} no \${args.id} ?\`;
			args.act_msg_result = \`\${docname} no \${args.id} telah di \${args.action}.\`;
			args.act_do = (result) => {
				chk_iscommit.checkbox('check');
				${resultcommit_appr}
				form.commit();
			}
			break;

		case 'uncommit' :
			args.act_url = \`\${global.modulefullname}/xtion-\${args.action}\`;
			args.act_msg_quest = \`Apakah anda yakin akan <b>\${args.action}</b> \${docname} no \${args.id} ?\`;
			args.act_msg_result = \`\${docname} no \${args.id} telah di \${args.action}.\`;
			args.act_do = (result) => {
				chk_iscommit.checkbox('uncheck');
				${resultuncommit_appr}
				form.setValue(txt_version, result.version);
				form.commit();
			}
			break;

		${optioncaseapproval}	
	}


	try {
		$ui.mask('wait..');
		var { doAction } = await import('../../../../../index.php/asset/fgta/framework/fgta4libs/fgta4xtion.mjs');
		await doAction(args, (err, result) => {
			if (err) {
				$ui.ShowMessage('[WARNING]' + err.message);	
			} else {
				updaterecordstatus(result.dataresponse);
				args.act_do(result);
				updatebuttonstate(result.dataresponse);
				updategridstate(result.dataresponse);
				if (args.act_msg_result!=='') $ui.ShowMessage('[INFO]' + args.act_msg_result);	
			}
		});
	} catch (err) {
		console.error(err);
		$ui.ShowMessage('[ERROR]' + err.message);
	} finally {
		$ui.unmask();
	}
}	
	
	`;

}



function get_action_buttonstate (add_commiter, add_approval, genconfig) {
	if (!add_commiter && !add_approval) {
		return '';
	}

	var basetableentity = genconfig.basetableentity;
	var buttonstate = "";
	if (add_commiter) {
		buttonstate = `
		/* action button */
		var button_commit_on = false;
		var button_uncommit_on = false;	
		
		if (record.${basetableentity}_iscommit=="1") {
			button_commit_on = false;
			button_uncommit_on = true;
			form.lock(true);		
		} else {
			button_commit_on = true;
			button_uncommit_on = false;
			form.lock(false);
		} 
		btn_commit.linkbutton(button_commit_on ? 'enable' : 'disable');
		btn_uncommit.linkbutton(button_uncommit_on ? 'enable' : 'disable');		
		`;


		if (add_approval) {
			buttonstate = `
		/* action button */
		var button_commit_on = false;
		var button_uncommit_on = false;
		var button_approve_on = false;
		var button_decline_on = false;

		
		if (record.${basetableentity}_isfirm=="1") {
			button_commit_on = false;
			button_uncommit_on = false;
			button_approve_on = false;
			button_decline_on = false;
			form.lock(true);	
		} else if (record.${basetableentity}_isdeclined=="1" || record.${basetableentity}_isuseralreadydeclined=="1") {
			button_commit_on = false;
			button_uncommit_on = true;
			button_approve_on = true;
			button_decline_on = false;
			form.lock(true);	
		} else if (record.${basetableentity}_isapproved=="1" || record.${basetableentity}_isuseralreadyapproved=="1") {
			button_commit_on = false;
			button_uncommit_on = false;
			button_approve_on = false;
			button_decline_on = true;	
			form.lock(true);	
		} else if (record.${basetableentity}_isapprovalprogress=="1") {
			button_commit_on = false;
			button_uncommit_on = false;
			button_approve_on = true;
			button_decline_on = true;
			form.lock(true);	
		} else if (record.${basetableentity}_iscommit=="1") {
			button_commit_on = false;
			button_uncommit_on = true;
			button_approve_on = true;
			button_decline_on = true;
			form.lock(true);		
		} else {
			button_commit_on = true;
			button_uncommit_on = false;
			button_approve_on = false;
			button_decline_on = false;
			form.lock(false);
		} 
	
		btn_commit.linkbutton(button_commit_on ? 'enable' : 'disable');
		btn_uncommit.linkbutton(button_uncommit_on ? 'enable' : 'disable');
		btn_approve.linkbutton(button_approve_on ? 'enable' : 'disable');
		btn_decline.linkbutton(button_decline_on ? 'enable' : 'disable');		
			`;
		}
	}

	return buttonstate
}


function get_action_buttoninitstate (add_commiter, add_approval, genconfig) {
	if (!add_commiter && !add_approval) {
		return '';
	}

	var basetableentity = genconfig.basetableentity;
	var buttonstate = "";
	if (add_commiter) {
		buttonstate = `
	var button_commit_on = true;
	var button_uncommit_on = false;
	btn_commit.linkbutton(button_commit_on ? 'enable' : 'disable');
	btn_uncommit.linkbutton(button_uncommit_on ? 'enable' : 'disable');
		`
		if (add_approval) {
			buttonstate = `
		var button_commit_on = true;
		var button_uncommit_on = false;
		var button_approve_on = false;
		var button_decline_on = false;
		btn_commit.linkbutton(button_commit_on ? 'enable' : 'disable');
		btn_uncommit.linkbutton(button_uncommit_on ? 'enable' : 'disable');
		btn_approve.linkbutton(button_approve_on ? 'enable' : 'disable');
		btn_decline.linkbutton(button_decline_on ? 'enable' : 'disable');
			`;
		}

	}

	return buttonstate;
}



function get_statuscreated (add_commiter, add_approval, genconfig) {
	if (add_commiter) {
		return `
		$('#pnl_edit_record_custom').detach().appendTo("#pnl_edit_record");
		$('#pnl_edit_record_custom').show();		
		`;
	}
}


function get_recordstatus (add_commiter, add_approval, genconfig) {
	var recordstatus = "";
	if (add_commiter) {
		recordstatus = `
const rec_commitby = $('#pnl_edit_record-commitby');
const rec_commitdate = $('#pnl_edit_record-commitdate');		
		`

		if (add_approval) {
			recordstatus += `
const rec_approveby = $('#pnl_edit_record-approveby');
const rec_approvedate = $('#pnl_edit_record-approvedate');			
const rec_declineby = $('#pnl_edit_record-declineby');
const rec_declinedate = $('#pnl_edit_record-declinedate');			
			`
		}
	}

	return recordstatus;
}


function get_recordstatusdataopen(add_commiter, add_approval, genconfig) {
	var basetableentity = genconfig.basetableentity;
	var recordstatus = "";
	if (add_commiter) {
		recordstatus = `
		rec_commitby.html(record.${basetableentity}_commitby);
		rec_commitdate.html(record.${basetableentity}_commitdate);
		`;
		if (add_approval) {
			recordstatus += `
		rec_approveby.html(record.${basetableentity}_approveby);
		rec_approvedate.html(record.${basetableentity}_approvedate);
		rec_declineby.html(record.${basetableentity}_declineby);
		rec_declinedate.html(record.${basetableentity}_declinedate);
			`
		}
	}
	return recordstatus
}


function get_recordstatusnew(add_commiter, add_approval, genconfig) {
	var basetableentity = genconfig.basetableentity
	var recordstatus = "";
	if (add_commiter) {
		recordstatus = `
		rec_commitby.html('');
		rec_commitdate.html('');
		`;
		if (add_approval) {
			recordstatus += `
		rec_approveby.html('');
		rec_approvedate.html('');
		rec_declineby.html('');
		rec_declinedate.html('');
		`;
		}
	}
	return recordstatus
}


function get_action_updategrid(add_commiter, add_approval, genconfig) {
	var basetableentity = genconfig.basetableentity;
	var gridupdatersyn = "";
	if (add_commiter) {
		gridupdatersyn += `


	var updategriddata = {}

	var col_commit = '${basetableentity}_iscommit';
	updategriddata[col_commit] = record.${basetableentity}_iscommit;	
	`;

		if (add_approval) {
			gridupdatersyn += `
	var col_approveprogress = '${basetableentity}_isapprovalprogress';
	var col_approve = '${basetableentity}_isapprove'
	var col_decline = "${basetableentity}_isdeclined"
	updategriddata[col_approveprogress] = record.${basetableentity}_isapprovalprogress;
	updategriddata[col_approve] = record.${basetableentity}_isapproved;
	updategriddata[col_decline] = record.${basetableentity}_isdeclined;				
			`;
		}

		gridupdatersyn += `
	$ui.getPages().ITEMS['pnl_list'].handler.updategrid(updategriddata, form.rowid);
		`;
	}



	return gridupdatersyn

}