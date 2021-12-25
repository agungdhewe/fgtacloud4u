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
	console.log(`Generate HTML Grid Detil...`)

	var headertable_name = genconfig.schema.header
	var headertable = genconfig.persistent[headertable_name]
	var header_primarykey = headertable.primarykeys[0]

	var detil = genconfig.schema.detils[fsd.detilname]
	var isapprovalform = detil.isapprovalform;
	var tablename = detil.table
	var detiltable = genconfig.persistent[tablename]
	var data = detiltable.data
	var primarykey = detiltable.primarykeys[0]

	var headermap_script = ''
	var headerrow_script = ''
	for (var fieldname in data) {
		if (fieldexclude.includes(fieldname)) { continue }

		var suppresslist = data[fieldname].suppresslist===true ? true : false;
		if (suppresslist) { continue }
		if (fieldname==header_primarykey) { continue }

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
			} else if (compclass=='easyui-numberbox') {
				headermap_script += `\t\t\t\t\t<th mapping="${fieldname}" style="text-align: right" formatter="row_format_number">${fieldname}</th>\r\n`
				headerrow_script += `\t\t\t\t\t<td class="fgtable-head" style="width: 100px; text-align: right; border-bottom: 1px solid #000000">${labeltext}</td>\r\n`
			} else {
				headermap_script += `\t\t\t\t\t<th mapping="${fieldname}">${fieldname}</th>\r\n`
				headerrow_script += `\t\t\t\t\t<td class="fgtable-head" style="width: 100px; border-bottom: 1px solid #000000">${labeltext}</td>\r\n`
			}	
		}
	}


	var pagetitle = fsd.pagename
	if (detil.title!=undefined) {
		pagetitle = detil.title
	}

	var mjstpl = path.join(genconfig.GENLIBDIR, 'tpl', 'detilgrid_phtml.tpl')
	var tplscript = fs.readFileSync(mjstpl).toString()
	tplscript = tplscript.replace(/<!--__PANELNAME__-->/g, fsd.panel)
	tplscript = tplscript.replace('<!--__PAGENAME__-->', fsd.pagename)
	tplscript = tplscript.replace('<!--__PAGETITLE__-->', pagetitle)
	tplscript = tplscript.replace('<!--__HEADERMAP__-->', headermap_script)
	tplscript = tplscript.replace('<!--__HEADERROW__-->', headerrow_script)


	if (isapprovalform===true) {
		tplscript = tplscript.replace('<!--__HEADERMAPCHK__-->', '')
		tplscript = tplscript.replace('<!--__HEADERROWCHK__-->', '')
	} else {
		tplscript = tplscript.replace('<!--__HEADERMAPCHK__-->', '<th type="check">chk</th>')
		tplscript = tplscript.replace('<!--__HEADERROWCHK__-->', '<td class="fgtable-head" style="width: 30px; border-bottom: 1px solid #000000; text-align: center">*</td>')
	}

	tplscript = tplscript.replace('<!--__CUSTOMVIEWINC__-->', `${genconfig.basename}-${fsd.detilname}grid-customview.phtml`)


	fsd.script = tplscript
}