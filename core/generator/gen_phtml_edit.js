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


		// console.log(data)
		var formcomp_script = ''
		for (var fieldname in data) {
			if (fieldexclude.includes(fieldname)) { continue }

			var labeltext = data[fieldname].text !== undefined ? data[fieldname].text : fieldname;
			var compclass = data[fieldname].comp.class
			var prefix = data[fieldname].comp.prefix
			var type = data[fieldname].type

			var stroptions = ''
			var dataoptions = data[fieldname].options
			for (var opt_name in dataoptions) {
				var opt_value;
				if (typeof dataoptions[opt_name] == 'boolean') {
					opt_value =  dataoptions[opt_name] ? 'true' : 'false'
				} else if (typeof dataoptions[opt_name] == 'object') {
					opt_value = "['" + dataoptions[opt_name].join("', '") + "']"
	
				} else {
					opt_value = "'" + dataoptions[opt_name] +"'"
				}
				stroptions += `, ${opt_name}: ${opt_value}`
			}

			var settouppercase = ''
			var uppercase = data[fieldname].uppercase
			var lowercase = data[fieldname].lowercase;
			if (uppercase===true) {
				settouppercase = 'uppercase="true"'
			} else if (lowercase===true) {
				settouppercase = 'lowercase="true"'
			}
			

			if (compclass=='easyui-checkbox') {
				formcomp_script += `
		<div class="form_row">
			<div class="form_label_col"></div>
			<div class="form_input_col" style="border: 0px solid black">
				<input id="pnl_edit-${prefix}${fieldname}" class="easyui-checkbox c1" mapping="${fieldname}" data-options="label: '${labeltext}', labelPosition: 'after', disabled:false, checked: false ${stroptions}">
			</div>
		</div>\r\n`	


			} else if (compclass=='easyui-combo') {
				var options = data[fieldname].comp.options

				if (options.table==null || options.field_value==null || options.field_display==null) {
					throw `Component ${fieldname} pada ${headertable_name} bertipe combo, harus didefinisikan: table, field_value, field_display`
				}

				formcomp_script += `
		<div class="form_row">
			<div class="form_label_col">${labeltext}</div>
			<div class="form_input_col" style="border: 0px solid black">
				<input id="pnl_edit-${prefix}${fieldname}" class="easyui-combo" style="width: 400px" mapping="${fieldname}" display="${options.field_display}" data-options="editable:false, valueField:'id', textField:'text' ${stroptions}">
			</div>
		</div>\r\n`


			} else if (compclass=='easyui-combobox') {	
				formcomp_script += `
		<div class="form_row">
			<div class="form_label_col">${labeltext}</div>
			<div class="form_input_col" style="border: 0px solid black">
				<input id="pnl_edit-${prefix}${fieldname}" class="easyui-combobox" style="width: 400px" mapping="${fieldname}" display="${fieldname}" data-options="editable:false, valueField:'id', textField:'text' ${stroptions}">
			</div>
		</div>\r\n`


			} else if (compclass=='easyui-datebox') {
				formcomp_script += `
		<div class="form_row">
			<div class="form_label_col">${labeltext}</div>
			<div class="form_input_col" style="border: 0px solid black">
				<input id="pnl_edit-${prefix}${fieldname}" class="easyui-datebox" style="width: 400px" mapping="${fieldname}" data-options="editable:false ${stroptions}">
			</div>
		</div>\r\n`
				

			} else if (compclass=='easyui-textbox') {
				var $maxlengdcr = ''
				if (type.maxlength!==undefined) {
					$maxlengdcr = `maxlength="${type.maxlength}"`
				}


				formcomp_script += `
		<div class="form_row">
			<div class="form_label_col">${labeltext}</div>
			<div class="form_input_col" style="border: 0px solid black">
				<input id="pnl_edit-${prefix}${fieldname}" class="${compclass}" mapping="${fieldname}" ${settouppercase} ${$maxlengdcr} style="width: 400px" data-options="multiline: false ${stroptions} ">
			</div>
		</div>\r\n`	

			} else if (compclass=='easyui-numberbox') {
						
				formcomp_script += `
		<div class="form_row">
			<div class="form_label_col">${labeltext}</div>
			<div class="form_input_col" style="border: 0px solid black">
				<input id="pnl_edit-${prefix}${fieldname}" class="${compclass}" mapping="${fieldname}" style="width: 400px" data-options="precision: ${type.precision}, decimalSeparator:'.', groupSeparator:','  ${stroptions}">
			</div>
		</div>\r\n`	



			} else {
				formcomp_script += `
		<div class="form_row">
			<div class="form_label_col">${labeltext}</div>
			<div class="form_input_col" style="border: 0px solid black">
				<input id="pnl_edit-${prefix}${fieldname}" class="${compclass}" mapping="${fieldname}" style="width: 400px" data-options="multiline: false ${stroptions} ">
			</div>
		</div>\r\n`				

			}

		}


		var detilpanel_script = ''
		if (Object.keys(genconfig.schema.detils).length>0) {
			var detilrow = ''
			for (var detilname in genconfig.schema.detils) {
				var detil = genconfig.schema.detils[detilname]
				var detiltitle = detil.title!=null ? detil.title : detilname;
				if (detil.form===true) {
					detilrow += `\t\t\t\t<div class="fgtable-head-drow" style="height: 25px; padding: 5px 0px 0px 5px" onclick="$ui.getPages().ITEMS['pnl_edit'].handler.detil_open('pnl_edit${detilname}grid')">${detiltitle}</div>\r\n`
				} else {
					detilrow += `\t\t\t\t<div class="fgtable-head-drow" style="height: 25px; padding: 5px 0px 0px 5px" onclick="$ui.getPages().ITEMS['pnl_edit'].handler.detil_open('pnl_edit${detilname}')">${detiltitle}</div>\r\n`
				}
			}

			// Detil
			detilpanel_script = `
		<div id="pnl_edit-detil" class="form_row" style="margin-top: 30px">
			<div class="form_label_col"></div>
			<div class="form_input_col" style="border: 0px solid black">
				<div class="fgtable-head" style="height: 25px; padding: 5px 0px 0px 5px">Detil Informations</div>
${detilrow}
			</div>		
		</div>		
		
		`

		} 


		// console.log(headermap_script)
		var pagetitle = genconfig.title
		if (genconfig.schema.title!=null) {
			pagetitle = genconfig.schema.title
		}


		var phtmltpl = path.join(genconfig.GENLIBDIR, 'tpl', 'edit_phtml.tpl')
		var tplscript = fs.readFileSync(phtmltpl).toString()
		tplscript = tplscript.replace('<!--__FORMCOMP__-->', formcomp_script)
		tplscript = tplscript.replace('<!--__DETILPANEL__-->', detilpanel_script)
		tplscript = tplscript.replace('<!--__PAGETITLE__-->', pagetitle)

		fsd.script = tplscript		


	} catch (err) {
		throw err
	}
}