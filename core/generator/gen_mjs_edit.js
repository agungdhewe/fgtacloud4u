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


		// console.log(data)
		var slideselectlib = ''
		var slideselects = ''
		var lookupsetvalue = ''
		var setdefaultnow = ''
		var setdefaultcombo = '';
		var skippedfield = '';
		var updateskippedfield = '';
		var nullresultloaded = '';
		var formcomp = []
		for (var fieldname in data) {
			if (fieldexclude.includes(fieldname)) { continue }
			var prefix = data[fieldname].comp.prefix
			var comptype = data[fieldname].comp.comptype
			var recursivetable = false;

			if (data[fieldname].comp.options!==undefined) {
				recursivetable = data[fieldname].comp.options.table===headertable_name ? true : false;
			}


			formcomp.push(`\t${prefix}${fieldname}: $('#pnl_edit-${prefix}${fieldname}')`)

			if (comptype=='datebox') {
				setdefaultnow += `\t\t\tdata.${fieldname} = global.now()\r\n`
			} else if (comptype=='numberbox') {
				setdefaultnow += `\t\t\tdata.${fieldname} = 0\r\n`
			}

			if (comptype=='combo') {
				var options = data[fieldname].comp.options
				var field_display_name = options.field_display;
				if (options.field_display_name!=null) {
					field_display_name = options.field_display_name;
				}
				lookupsetvalue += `\r\n\t\t\t.setValue(obj.${prefix}${fieldname}, result.record.${fieldname}, result.record.${field_display_name})`

				var pilihnone = '';
				var allownull = data[fieldname].null;
				if (allownull) {
					setdefaultcombo += `\t\t\tdata.${fieldname} = '--NULL--'\r\n`
					setdefaultcombo += `\t\t\tdata.${field_display_name} = 'NONE'\r\n`
					nullresultloaded += `\t\tif (result.record.${fieldname}==null) { result.record.${fieldname}='--NULL--'; result.record.${field_display_name}='NONE'; }\r\n`;
					pilihnone = `result.records.unshift({${options.field_value}:'--NULL--', ${options.field_display}:'NONE'});`	
				} else {
					setdefaultcombo += `\t\t\tdata.${fieldname} = '0'\r\n`
					setdefaultcombo += `\t\t\tdata.${field_display_name} = '-- PILIH --'\r\n`
				}				

				hapuspilihansama = '';
				if (recursivetable) {
					skippedfield += `\toptions.skipmappingresponse = ["${fieldname}"];\r\n`;
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
					skippedfield += `\toptions.skipmappingresponse = ["${fieldname}"];\r\n`;
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

				slideselectlib = `import {fgta4slideselect} from  '../../../../../index.php/asset/fgta/framework/fgta4libs/fgta4slideselect.mjs'`
				slideselects += `
	new fgta4slideselect(obj.${prefix}${fieldname}, {
		title: 'Pilih ${fieldname}',
		returnpage: this_page_id,
		api: $ui.apis.load_${fieldname},
		fieldValue: '${fieldname}',
		fieldValueMap: '${options.field_value}',
		fieldDisplay: '${options.field_display}',
		fields: [
			{mapping: '${options.field_value}', text: '${options.field_value}'},
			{mapping: '${options.field_display}', text: '${options.field_display}'},
		]${datasample},
		OnDataLoading: (criteria) => {},
		OnDataLoaded : (result, options) => {
			${hapuspilihansama}${pilihnone}	
		},
		OnSelected: (value, display, record) => {}
	})				
				`;
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

		
		

		fsd.script = tplscript		

	} catch (err) {
		throw err
	}
}