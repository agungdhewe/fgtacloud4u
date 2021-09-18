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

		var add_approval = genconfig.approval===true;
		var add_commiter = add_approval===true ? true : (genconfig.committer===true);

		// console.log(data)
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
			var dataoptions = data[fieldname].options

			if (add_approval) {
				if (fieldname=='doc_id') {
					dataoptions['disabled']=true;
				}
			}

			// console.log(fieldname);
			// console.log(dataoptions);

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



			if (compclass=='easyui-checkbox') {

				formcomp_script += `
		<div class="form_row" ${formrowstyle}>
			<div class="form_label_col">${caption}</div>
			<div class="form_input_col" style="border: 0px solid black">
				<input id="pnl_edit-${prefix}${fieldname}" class="easyui-checkbox c1" mapping="${fieldname}" data-options="label: '${labeltext}', labelPosition: 'after', checked: false ${stroptions}">
			</div>
		</div>\r\n`	


			} else if (compclass=='easyui-combo') {
				var options = data[fieldname].comp.options

				if (options.table==null || options.field_value==null || options.field_display==null) {
					throw `Component ${fieldname} pada ${headertable_name} bertipe combo, harus didefinisikan: table, field_value, field_display`
				}

				var validType = '';
				if (dataoptions.required===true) {
					validType = ` validType="requiredcombo['pnl_edit-${prefix}${fieldname}']" `;
				} 

				var combodisplay = options.field_display;
				var field_display_name = options.field_display_name;
				if (field_display_name!=null) {
					combodisplay = field_display_name
				}

				formcomp_script += `
		<div class="form_row" ${formrowstyle}>
			<div class="form_label_col${labeltipsclass}" ${tipshidden} style="border: 0px solid black; vertical-align: top; margin-top: 7px;">${labeltext}</div>
			<div class="form_input_col" style="border: 0px solid black">
				<input id="pnl_edit-${prefix}${fieldname}" class="easyui-combo" style="width: 400px" mapping="${fieldname}" display="${combodisplay}" data-options="editable:false, valueField:'id', textField:'text' ${stroptions}"  ${validType}>
				<div style="margin-top: 3px; margin-bottom: 5px; font-size: 0.75em; font-style: italic; color:#54381d;">${tipsvisible}</div>
			</div>
		</div>\r\n`


			} else if (compclass=='easyui-combobox') {	
				formcomp_script += `
		<div class="form_row" ${formrowstyle}>
			<div class="form_label_col${labeltipsclass}" ${tipshidden} style="border: 0px solid black; vertical-align: top; margin-top: 7px;">${labeltext}</div>
			<div class="form_input_col" style="border: 0px solid black">
				<input id="pnl_edit-${prefix}${fieldname}" class="easyui-combobox" style="width: 400px" mapping="${fieldname}" display="${fieldname}" data-options="editable:false, valueField:'id', textField:'text' ${stroptions}">
				<div style="margin-top: 3px; margin-bottom: 5px; font-size: 0.75em; font-style: italic; color:#54381d;">${tipsvisible}</div>
			</div>
		</div>\r\n`


			} else if (compclass=='easyui-datebox') {
				formcomp_script += `
		<div class="form_row" ${formrowstyle}>
			<div class="form_label_col${labeltipsclass}" ${tipshidden} style="border: 0px solid black; vertical-align: top; margin-top: 7px;">${labeltext}</div>
			<div class="form_input_col" style="border: 0px solid black">
				<input id="pnl_edit-${prefix}${fieldname}" class="easyui-datebox" style="width: 400px" mapping="${fieldname}" data-options="editable:false ${stroptions}">
				<div style="margin-top: 3px; margin-bottom: 5px; font-size: 0.75em; font-style: italic; color:#54381d;">${tipsvisible}</div>
			</div>
		</div>\r\n`
				

			} else if (compclass=='easyui-textbox') {
				var $maxlengdcr = ''
				if (type.maxlength!==undefined) {
					$maxlengdcr = `maxlength="${type.maxlength}"`
				}


				formcomp_script += `
		<div class="form_row" ${formrowstyle}>
			<div class="form_label_col${labeltipsclass}" ${tipshidden} style="border: 0px solid black; vertical-align: top; margin-top: 7px;">${labeltext}</div>
			<div class="form_input_col" style="border: 0px solid black">
				<input id="pnl_edit-${prefix}${fieldname}" class="${compclass}" mapping="${fieldname}" ${settouppercase} ${$maxlengdcr} style="width: 400px" data-options="multiline: false ${stroptions} ">
				<div style="margin-top: 3px; margin-bottom: 5px; font-size: 0.75em; font-style: italic; color:#54381d;">${tipsvisible}</div>
			</div>
		</div>\r\n`	

			} else if (compclass=='easyui-numberbox') {
						
				formcomp_script += `
		<div class="form_row" ${formrowstyle}>
			<div class="form_label_col${labeltipsclass}" ${tipshidden} style="border: 0px solid black; vertical-align: top; margin-top: 7px;">${labeltext}</div>
			<div class="form_input_col" style="border: 0px solid black">
				<input id="pnl_edit-${prefix}${fieldname}" class="${compclass}" mapping="${fieldname}" style="width: 400px; text-align:right" data-options="precision: ${type.precision}, decimalSeparator:'.', groupSeparator:','  ${stroptions}">
				<div style="margin-top: 3px; margin-bottom: 5px; font-size: 0.75em; font-style: italic; color:#54381d;">${tipsvisible}</div>
			</div>
		</div>\r\n`	



			} else if (compclass=='easyui-filebox') {
				formcomp_script += `

		<div class="form_row" ${formrowstyle}>
			<div class="form_label_col${labeltipsclass}" ${tipshidden} style="border: 0px solid black; vertical-align: top; margin-top: 7px;">${labeltext}</div>
			<div class="form_input_col" style="border: 0px solid black">
				<input id="pnl_edit-${prefix}${fieldname}" class="${compclass}" mapping="${fieldname}" style="width: 400px" data-options="multiline: false ${stroptions} ">
				<div style="display: flex;">
					<a class="filedownloadlink" id="pnl_edit-${prefix}${fieldname}_link" style="cursor:pointer; margin-right: 10px; display: none">Download File</a>	
					<div style="margin-top: 3px; margin-bottom: 5px; font-size: 0.75em; font-style: italic; color:#54381d;">${tipsvisible}</div>
				</div>
				<img id="pnl_edit-${prefix}${fieldname}_img" style="width: 200px; width: 200px; border: 1px solid: #ccc; display:none">				
			</div>
		</div>\r\n`					


			} else {
				formcomp_script += `
		<div class="form_row" ${formrowstyle}>
			<div class="form_label_col${labeltipsclass}" ${tipshidden} style="border: 0px solid black; vertical-align: top; margin-top: 7px;">${labeltext}</div>
			<div class="form_input_col" style="border: 0px solid black">
				<input id="pnl_edit-${prefix}${fieldname}" class="${compclass}" mapping="${fieldname}" style="width: 400px" data-options="multiline: false ${stroptions} ">
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


		var detilpanel_script = ''
		if (Object.keys(genconfig.schema.detils).length>0) {
			var detilrow = ''
			for (var detilname in genconfig.schema.detils) {
				var detil = genconfig.schema.detils[detilname]
				var detiltitle = detil.title!=null ? detil.title : detilname;
				if (detil.form===true) {
					detilrow += `\t\t\t\t<div class="fgtable-head-drow" style="height: 25px; padding: 5px 5px 0px 5px" onclick="$ui.getPages().ITEMS['pnl_edit'].handler.detil_open('pnl_edit${detilname}grid')">\r\n`;
					detilrow += `\t\t\t\t\t<div id="pnl_edit-txt_${detilname}_title" class="detilgrid-text">${detiltitle}</div>\r\n`;
					detilrow += `\t\t\t\t\t<div id="pnl_edit-txt_${detilname}_value" class="detilgrid-value">&nbsp;</div>\r\n`;
					detilrow += `\t\t\t\t</div>\r\n`;
				} else {
					detilrow += `\t\t\t\t<div class="fgtable-head-drow" style="height: 25px; padding: 5px 5px 0px 5px" onclick="$ui.getPages().ITEMS['pnl_edit'].handler.detil_open('pnl_edit${detilname}')">\r\n`;
					detilrow += `\t\t\t\t\t<div id="pnl_edit-txt_${detilname}_title" class="detilgrid-text">${detiltitle}</div>\r\n`;
					detilrow += `\t\t\t\t\t<div id="pnl_edit-txt_${detilname}_value" class="detilgrid-value">&nbsp;</div>\r\n`;
					detilrow += `\t\t\t\t</div>\r\n`;
				}
			}

			// Detil
			detilpanel_script = `
		<div id="pnl_edit-detil" class="form_row" style="margin-top: 30px">
			<div class="form_label_col"></div>
			<div class="form_input_col detilbox" style="border: 0px solid black">
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



		// print button
		var add_printfunction = genconfig.printing;
		var printbutton = '';
		if (add_printfunction) {
			printbutton = `<a id="pnl_edit-btn_print" href="javascript:void(0)" class="easyui-linkbutton c8" style="margin-left:10px; margin-bottom: 10px;" data-options="iconCls:'icon-print'">print</a>`;
		}


		var commitbutton = '';
		var approvebutton = '';
		if (add_commiter) {
			commitbutton = `
			<a id="pnl_edit-btn_commit" href="javascript:void(0)" class="easyui-linkbutton c8" style="margin-left:10px; margin-bottom: 10px;" data-options="iconCls:'fgta-icon-commit'">Commit</a>			
			<a id="pnl_edit-btn_uncommit" href="javascript:void(0)" class="easyui-linkbutton c8" style="margin-left:10px; margin-bottom: 10px;" data-options="iconCls:'fgta-icon-uncommit'">UnCommit</a>
			`;
			if (add_approval) {
				approvebutton = `
				<a id="pnl_edit-btn_approve" href="javascript:void(0)" class="easyui-linkbutton c8" style="margin-left:10px; margin-bottom: 10px;" data-options="plain:true,iconCls:'fgta-icon-posting'">Approve</a>
				<a id="pnl_edit-btn_decline" href="javascript:void(0)" class="easyui-linkbutton c8" style="margin-left:10px; margin-bottom: 10px;" data-options="plain:true,iconCls:'fgta-icon-unposting'">Decline</a>
				`;
			}
		}		

		var phtmltpl = path.join(genconfig.GENLIBDIR, 'tpl', 'edit_phtml.tpl')
		var tplscript = fs.readFileSync(phtmltpl).toString()
		tplscript = tplscript.replace('<!--__FORMCOMP__-->', formcomp_script)
		tplscript = tplscript.replace('<!--__DETILPANEL__-->', detilpanel_script)
		tplscript = tplscript.replace('<!--__PAGETITLE__-->', pagetitle)
		tplscript = tplscript.replace('	<!--__PRINTBUTTON__-->', printbutton)
		tplscript = tplscript.replace('	<!--__COMMITBUTTON__-->', commitbutton)
		tplscript = tplscript.replace('	<!--__APPROVEBUTTON__-->', approvebutton)


		fsd.script = tplscript		


	} catch (err) {
		throw err
	}
}