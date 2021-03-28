const path = require('path')
const fs = require('fs')

const colReset = "\x1b[0m"
const colFgRed = "\x1b[31m"
const colFgGreen = "\x1b[32m"
const colFgYellow = "\x1b[33m"
const colFgBlack = "\x1b[30m"
const colBright = "\x1b[1m"
const BgYellow = "\x1b[43m"

module.exports = async (fsd, genconfig) => {

	var headertable_name = genconfig.schema.header
	var headertable = genconfig.persistent[headertable_name]

	var detil = genconfig.schema.detils[fsd.detilname]
	var isapprovalform = detil.isapprovalform;
	var tablename = detil.table
	var detiltable = genconfig.persistent[tablename]
	var data = detiltable.data

	var primarykey = detiltable.primarykeys[0]
	var primarycomppreix = data[primarykey].comp.prefix

	var header_primarykey = headertable.primarykeys[0]
	var header_primarycomppreix = data[primarykey].comp.prefix

	var headerview_key = primarykey
	if (detil.headerview!==undefined) {
		headerview_key = detil.headerview 
	}


	var pagetitle = fsd.pagename
	if (detil.title!=undefined) {
		pagetitle = detil.title
	}


	var renderrow = ""
	if (isapprovalform) {
		renderrow = `
	var dataid = tr.getAttribute('dataid')
	var record = grd_list.DATA[dataid]
	console.log(record);
	$(tr).find('td').each((i, td) => {
		var mapping = td.getAttribute('mapping')
		if (mapping=='docauth_descr') {
			var gambar = "";
			var authby = "";
			var notes = "";			
			if (record.prosappr_isdeclined=="1") {
				gambar = \`<img src="images/xtiondecl.png" width="20px" height="20px">\`;
				authby = \`<div><span style="font-weight: bold">\${record.prosappr_declinedby}</span> (\${record.prosappr_declineddate})</div>\`
				notes = record.prosappr_notes.replace(/(?:\\r\\n|\\r|\\n)/g, '<br>');
				notes = \`<div style="margin-top: 5px; font-style: italic">\${notes}</div>\`
			} else if (record.prosappr_isapproved=="1") {
				gambar = \`<img src="images/xtionappr.png" width="20px" height="20px">\`;
				authby = \`<div><span style="font-weight: bold">\${record.prosappr_by}</span> (\${record.prosappr_date})</div>\`
			} else {
				gambar = \`<img src="images/xtionwait.png" width="20px" height="20px">\`;
				authby = ""
			}

			var tpl = \`
			<div style="display: flex">		
				<div style="width: 40px">\${gambar}</div>
				<div>
					<div>\${record.auth_name}</div>
					\${authby}
					\${notes}
				</div>
			</div>
			\`	
			td.innerHTML = tpl;
			td.style.width = "400px";
		} 
		});		
		`;
	}



	var mjstpl = path.join(genconfig.GENLIBDIR, 'tpl', 'detilgrid_mjs.tpl')
	var tplscript = fs.readFileSync(mjstpl).toString()
	tplscript = tplscript.replace(/<!--__PANELNAME__-->/g, fsd.panel)
	tplscript = tplscript.replace('<!--__PAGENAME__-->', fsd.pagename)
	tplscript = tplscript.replace('<!--__PAGETITLE__-->', pagetitle)
	tplscript = tplscript.replace(/<!--__DETILNAME__-->/g, fsd.detilname)
	tplscript = tplscript.replace(/<--__PRIMARYKEY__-->/g, `${primarykey}`)
	tplscript = tplscript.replace(/<--__HEADERPRIMARYKEY__-->/g, `${header_primarykey}`)
	tplscript = tplscript.replace(/<--__HEADERVIEWKEY__-->/g, headerview_key)

	tplscript = tplscript.replace('<!--__RENDERROW__-->', renderrow)




	fsd.script = tplscript
}