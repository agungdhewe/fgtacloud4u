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

	console.log(`-----------------------------------------------`)
	console.log(`Generate HTML Edit Detil...`)


	var headertable_name = genconfig.schema.header
	var headertable = genconfig.persistent[headertable_name]
	var header_primarykey = headertable.primarykeys[0]

	var detil = genconfig.schema.detils[fsd.detilname]
	var tablename = detil.table
	var detiltable = genconfig.persistent[tablename]
	var data = detiltable.data

	var formcomp_script = ''
	
	for (var fieldname in data) {
		if (fieldexclude.includes(fieldname)) { continue }

		var labeltext = data[fieldname].text !== undefined ? data[fieldname].text : fieldname;
		var caption = data[fieldname].caption !== undefined ? data[fieldname].caption : '';
		var section = data[fieldname].section;
		var compclass = data[fieldname].comp.class
		var prefix = data[fieldname].comp.prefix
		var type = data[fieldname].type
		var tips = data[fieldname].tips !== undefined ? data[fieldname].tips : '';
		var tipstype = data[fieldname].tipstype === 'visible' ? 'visible' : 'hidden';
		var hidden = data[fieldname].hidden === true ? true : false;


		var labeltipsclass, tipsvisible, tipshidden
		if (tipstype==='visible') {
			labeltipsclass = '';
			tipsvisible = tips;
			tipshidden = '';
		} else {
			if (tips!=='') {
				labeltipsclass = ' easyui-tooltip';
				tipsvisible = '';
				tipshidden = `title="${tips}"`;
			} else {
				labeltipsclass = '';
				tipsvisible = '';
				tipshidden = '';					
			}
		}

		formrowstyle = '';
		if (hidden) {
			formrowstyle=`style="display: none"`;
		}
		
		var stroptions = ''
		var fdataoptions = data[fieldname].options

		for (var opt_name in fdataoptions) {
			var opt_value;
			if (typeof fdataoptions[opt_name] == 'boolean') {
				opt_value =  fdataoptions[opt_name] ? 'true' : 'false'
			} else if (typeof fdataoptions[opt_name] == 'object') {
				opt_value = "['" + fdataoptions[opt_name].join("', '") + "']"
			} else {
				opt_value = "'" + fdataoptions[opt_name] +"'"
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


			/* SECTION BEGIN --------------------------------------------------- */
			if (section!=null) {
				if (section.position=='begin') {
					var label = section.label;
					var csscboxlassname = section.csscboxlassname != null ? section.csscboxlassname : '' ;
					formcomp_script += `
		<?=$this->Section('${label}', true, true)?>
		<div class="fgta_section_collapsible ${csscboxlassname}" style="display: none">
					`;
				}
			}
			/* SECTION BEGIN --------------------------------------------------- */




		// console.log(compclass + '####################')
			if (compclass=='easyui-checkbox') {
				formcomp_script += `
		<div class="form_row ${fsd.panel}_row ${prefix}${fieldname}" ${formrowstyle}>
			<div class="form_label_col">${caption}</div>
			<div class="form_input_col" style="border: 0px solid black">
				<input id="${fsd.panel}-${prefix}${fieldname}" class="easyui-checkbox c1" mapping="${fieldname}" data-options="label: '${labeltext}', labelPosition: 'after', checked: false ${stroptions}">
			</div>
		</div>\r\n`	


			} else if (compclass=='easyui-combo') {	
				var options = data[fieldname].comp.options

				if (options.table==null || options.field_value==null || options.field_display==null) {
					throw `Component ${fieldname} pada ${tablename} bertipe combo, harus didefinisikan: table, field_value, field_display`
				}

				// console.log('**********************')
				// console.log(dataoptions)
				var validType = '';
				if (fdataoptions.required===true) {
					validType = ` validType="requiredcombo['${fsd.panel}-${prefix}${fieldname}']" `;
					// console.log('===================================')
				} 

				formcomp_script += `
		<div class="form_row ${fsd.panel}_row ${prefix}${fieldname}" ${formrowstyle}>
			<div class="form_label_col${labeltipsclass}" ${tipshidden} style="border: 0px solid black; vertical-align: top; margin-top: 7px;">${labeltext}</div>
			<div class="form_input_col" style="border: 0px solid black">
				<input id="${fsd.panel}-${prefix}${fieldname}" class="easyui-combo" style="width: 400px" mapping="${fieldname}" display="${options.field_display}" data-options="editable:false, valueField:'id', textField:'text' ${stroptions}" ${validType}>
				<div style="margin-top: 3px; margin-bottom: 5px; font-size: 0.75em; font-style: italic; color:#54381d;">${tipsvisible}</div>
			</div>
		</div>\r\n`


			} else if (compclass=='easyui-combobox') {	
				formcomp_script += `
		<div class="form_row ${fsd.panel}_row ${prefix}${fieldname}" ${formrowstyle}>
			<div class="form_label_col${labeltipsclass}" ${tipshidden} style="border: 0px solid black; vertical-align: top; margin-top: 7px;">${labeltext}</div>
			<div class="form_input_col" style="border: 0px solid black">
				<input id="${fsd.panel}-${prefix}${fieldname}" class="easyui-combobox" style="width: 400px" mapping="${fieldname}" display="${fieldname}" data-options="editable:false, valueField:'id', textField:'text' ${stroptions}">
				<div style="margin-top: 3px; margin-bottom: 5px; font-size: 0.75em; font-style: italic; color:#54381d;">${tipsvisible}</div>
			</div>
		</div>\r\n`


			} else if (compclass=='easyui-datebox') {
				formcomp_script += `
		<div class="form_row ${fsd.panel}_row ${prefix}${fieldname}" ${formrowstyle}>
			<div class="form_label_col${labeltipsclass}" ${tipshidden} style="border: 0px solid black; vertical-align: top; margin-top: 7px;">${labeltext}</div>
			<div class="form_input_col" style="border: 0px solid black">
				<input id="${fsd.panel}-${prefix}${fieldname}" class="easyui-datebox" style="width: 400px" mapping="${fieldname}" data-options="editable:false ${stroptions}">
				<div style="margin-top: 3px; margin-bottom: 5px; font-size: 0.75em; font-style: italic; color:#54381d;">${tipsvisible}</div>
			</div>
		</div>\r\n`
				

			} else if (compclass=='easyui-textbox') {
				var $maxlengdcr = ''
				if (type.maxlength!==undefined) {
					$maxlengdcr = `maxlength="${type.maxlength}" `
				}

				var dataoptions = ''
				if (header_primarykey==fieldname) {
					dataoptions = `, disabled: true`
				}

				formcomp_script += `
		<div class="form_row ${fsd.panel}_row ${prefix}${fieldname}" ${formrowstyle}>
			<div class="form_label_col${labeltipsclass}" ${tipshidden} style="border: 0px solid black; vertical-align: top; margin-top: 7px;">${labeltext}</div>
			<div class="form_input_col" style="border: 0px solid black">
				<input id="${fsd.panel}-${prefix}${fieldname}" class="${compclass}" mapping="${fieldname}" ${settouppercase} ${$maxlengdcr} style="width: 400px" data-options="multiline:false ${stroptions} ${dataoptions}">
				<div style="margin-top: 3px; margin-bottom: 5px; font-size: 0.75em; font-style: italic; color:#54381d;">${tipsvisible}</div>
			</div>
		</div>\r\n`	


			} else if (compclass=='easyui-numberbox') {
				
				formcomp_script += `
		<div class="form_row ${fsd.panel}_row ${prefix}${fieldname}" ${formrowstyle}>
			<div class="form_label_col${labeltipsclass}" ${tipshidden} style="border: 0px solid black; vertical-align: top; margin-top: 7px;">${labeltext}</div>
			<div class="form_input_col" style="border: 0px solid black">
				<input id="${fsd.panel}-${prefix}${fieldname}" class="${compclass}" mapping="${fieldname}" style="width: 400px; text-align:right" data-options="precision: ${type.precision}, decimalSeparator:'.', groupSeparator:','  ${stroptions}">
				<div style="margin-top: 3px; margin-bottom: 5px; font-size: 0.75em; font-style: italic; color:#54381d;">${tipsvisible}</div>
			</div>
		</div>\r\n`	

				
			} else if (compclass=='easyui-filebox') {
				formcomp_script += `

		<div class="form_row ${fsd.panel}_row ${prefix}${fieldname}" ${formrowstyle}>
			<div class="form_label_col${labeltipsclass}" ${tipshidden} style="border: 0px solid black; vertical-align: top; margin-top: 7px;">${labeltext}</div>
			<div class="form_input_col" style="border: 0px solid black">
				<input id="${fsd.panel}-${prefix}${fieldname}" class="${compclass}" mapping="${fieldname}" style="width: 400px" data-options="multiline: false ${stroptions} ">
				<div style="display: flex;">
					<a class="filedownloadlink" id="${fsd.panel}-${prefix}${fieldname}_link" style="cursor:pointer; margin-right: 10px; display: none">Download File</a>	
					<div style="margin-top: 3px; margin-bottom: 5px; font-size: 0.75em; font-style: italic; color:#54381d;">${tipsvisible}</div>
				</div>
				<img id="${fsd.panel}-${prefix}${fieldname}_img" style="width: 200px; width: 200px; border: 1px solid: #ccc; display:none">				
			</div>
		</div>\r\n`					


			} else {
				formcomp_script += `
		<div class="form_row ${fsd.panel}_row ${prefix}${fieldname}" ${formrowstyle}>
			<div class="form_label_col${labeltipsclass}" ${tipshidden} style="border: 0px solid black; vertical-align: top; margin-top: 7px;">${labeltext}</div>
			<div class="form_input_col" style="border: 0px solid black">
				<input id="${fsd.panel}-${prefix}${fieldname}" class="${compclass}" mapping="${fieldname}" style="width: 400px" data-options="multiline: false  ${stroptions}">
				<div style="margin-top: 3px; margin-bottom: 5px; font-size: 0.75em; font-style: italic; color:#54381d;">${tipsvisible}</div>
			</div>
		</div>\r\n`				

			}


			/* SECTION END --------------------------------------------------- */
			if (section!=null) {
				if (section.position=='end') {
					formcomp_script += `
		</div>
					`;
				}
			}
			/* SECTION END --------------------------------------------------- */	
			

	}



	var pagetitle = fsd.pagename
	if (detil.title!=undefined) {
		pagetitle = detil.title
	}


	var mjstpl = path.join(genconfig.GENLIBDIR, 'tpl', 'detilform_phtml.tpl')
	var tplscript = fs.readFileSync(mjstpl).toString()
	tplscript = tplscript.replace(/<!--__PANELNAME__-->/g, fsd.panel)
	tplscript = tplscript.replace('<!--__PAGENAME__-->', fsd.pagename)
	tplscript = tplscript.replace('<!--__PAGETITLE__-->', pagetitle)
	tplscript = tplscript.replace('<!--__FORMCOMP__-->', formcomp_script)
	


	fsd.script = tplscript
}