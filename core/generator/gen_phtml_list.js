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
		console.log(`Generate HTML List...`)

		var headertable_name = genconfig.schema.header
		var headertable = genconfig.persistent[headertable_name]
		var data = headertable.data

		// console.log(data)
		var headermap_script = ''
		var headerrow_script = ''
		for (var fieldname in data) {
			if (fieldexclude.includes(fieldname)) { continue }

			var suppresslist = data[fieldname].suppresslist===true ? true : false;
			if (suppresslist) { continue }
			
			var comptype = data[fieldname].comp.comptype
			var compclass = data[fieldname].comp.class
			if (comptype=='combo') {
				var options = data[fieldname].comp.options
				var labeltext = data[fieldname].text !== undefined ? data[fieldname].text : options.field_display;

				var combodisplay = options.field_display;
				var field_display_name = options.field_display_name;
				if (field_display_name!=null) {
					combodisplay = field_display_name
				}

				headermap_script += `\t\t\t\t\t<th mapping="${combodisplay}">${combodisplay}</th>\r\n`
				headerrow_script += `\t\t\t\t\t<td class="fgtable-head" style="width: 100px; border-bottom: 1px solid #000000">${labeltext}</td>\r\n`
			} else {
				var labeltext = data[fieldname].text !== undefined ? data[fieldname].text : fieldname;
				if (compclass=='easyui-checkbox') {
					headermap_script += `\t\t\t\t\t<th mapping="${fieldname}" type="checkbox">${fieldname}</th>\r\n`
					headerrow_script += `\t\t\t\t\t<td class="fgtable-head" style="width: 100px; border-bottom: 1px solid #000000; text-align: center">${labeltext}</td>\r\n`
				// } else {
				// 	headermap_script += `\t\t\t\t\t<th mapping="${fieldname}">${fieldname}</th>\r\n`
				// 	headerrow_script += `\t\t\t\t\t<td class="fgtable-head" style="width: 100px; border-bottom: 1px solid #000000;">${labeltext}</td>\r\n`
				// }
				} else if (compclass=='easyui-numberbox') {
					headermap_script += `\t\t\t\t\t<th mapping="${fieldname}" style="text-align: right"  formatter="row_format_number">${fieldname}</th>\r\n`
					headerrow_script += `\t\t\t\t\t<td class="fgtable-head" style="width: 100px; text-align: right; border-bottom: 1px solid #000000">${labeltext}</td>\r\n`
				} else {
					headermap_script += `\t\t\t\t\t<th mapping="${fieldname}">${fieldname}</th>\r\n`
					headerrow_script += `\t\t\t\t\t<td class="fgtable-head" style="width: 100px; border-bottom: 1px solid #000000">${labeltext}</td>\r\n`
				}	
			}

		}


		// console.log(headermap_script)
		var pagetitle = genconfig.title
		if (genconfig.schema.title!=null) {
			pagetitle = genconfig.schema.title
		}


		

		var phtmltpl = path.join(genconfig.GENLIBDIR, 'tpl', 'list_phtml.tpl')
		var tplscript = fs.readFileSync(phtmltpl).toString()
		tplscript = tplscript.replace('<!--__HEADERMAP__-->', headermap_script)
		tplscript = tplscript.replace('<!--__HEADERROW__-->', headerrow_script)
		tplscript = tplscript.replace('<!--__PAGETITLE__-->', pagetitle)
		tplscript = tplscript.replace('<!--__CUSTOMVIEWINC__-->', `${genconfig.basename}-list-customview.phtml`)
		tplscript = tplscript.replace('<!--__CUSTOMSEARCHINC__-->', `${genconfig.basename}-list-customsearch.phtml`)
		
		


		fsd.script = tplscript

	} catch (err) {
		throw err
	}
}