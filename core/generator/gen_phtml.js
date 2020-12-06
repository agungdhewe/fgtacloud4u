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
	try {
		console.log(`-----------------------------------------------`)
		console.log(`Generate Main HTML...`)
		

		// genconfig.pages = {
		// 	// list: {
		// 	// 	mjs: {program: 'gen_mjs_list.js', handler: 'pList', filename: `${genconfig.basename}-list.js`},
		// 	// 	phtml: {program: 'gen_phtml_list.js', panel: 'pnl_list', filename: `${genconfig.basename}-list.phtml` }
		// 	// },
		// 	// edit: {
		// 	// 	mjs: {program: 'gen_mjs_edit.js', handler: 'pEdit', filename: `${genconfig.basename}-edit.js`},
		// 	// 	phtml: {program: 'gen_phtml_edit.js', panel: 'pnl_edit', filename: `${genconfig.basename}-edit.phtml`}
		// 	// }
		// }

		// for (var detilname in  genconfig.schema.detils) {
		// 	var detil = genconfig.schema.detils[detilname]
		// 	if (detil.form===true) {
		// 		genconfig.pages[`${detilname}grid`] = {
		// 			mjs: {program: 'gen_mjs_detilgrid', handler: `pEdit${CapFL(detilname)}grid`, filename: `${genconfig.basename}-${detilname}grid.js`},
		// 			phtml: {program: 'gen_phtml_detilgrid', panel: `pnl_edit${detilname}grid`, filename: `${genconfig.basename}-${detilname}grid.phtml`}
		// 		}
		// 		genconfig.pages[`${detilname}form`] = {
		// 			mjs: {program: 'gen_mjs_detilform', handler: `pEdit${CapFL(detilname)}form`, filename: `${genconfig.basename}-${detilname}form.js`},
		// 			phtml: {program: 'gen_phtml_detilform',  panel: `pnl_edit${detilname}form`, filename: `${genconfig.basename}-${detilname}form.phtml`}
		// 		}
			
		// 	} else {
		// 		genconfig.pages[detilname] = {
		// 			mjs: {program: 'gen_mjs_blank', handler: `pEdit${CapFL(detilname)}`, filename: `${genconfig.basename}-${detilname}.js`},
		// 			phtml: {program: 'gen_phtml_blank', panel: `pnl_edit${detilname}`, filename: `${genconfig.basename}-${detilname}.phtml`}					
		// 		}
		// 	}
		// }


		// pageselector = {}
		for (var tablename in genconfig.persistent) {
			var data = genconfig.persistent[tablename].data;
			for (var fieldname in data) {
				var defcomp = data[fieldname].type.defcomp
				if (data[fieldname].comp===undefined) {
					data[fieldname].comp = defcomp
				}

				// var comp = data[fieldname].comp
				// if (comp.comptype=='pageselector') {
				// 	var page = comp.options.page
				// 	if (pageselector[page]===undefined) {
				// 		pageselector[page] = page
				// 	}
				// }

			}
		}

		
		// for (var pagename in pageselector) {
		// 	genconfig.pages[pagename] = {
		// 		mjs: {program: 'gen_mjs_pageselector.js', handler: `pSel${CapFL(pagename)}`, filename: `${genconfig.basename}-${pagename}.js`},
		// 		phtml: {program: 'gen_phtml_pageselector.js', panel: `pnl_sel${pagename}`, filename: `${genconfig.basename}-${pagename}.phtml`}				
		// 	}
		// }

		// console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%')
		// console.log(genconfig.pages)
		// console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%')
		
		var phtmlrequired = ''
		for (var pagename in genconfig.pages) {
			if (genconfig.pages[pagename].api===true) {
				// console.log(genconfig.pages[pagename])
				continue
			}
			var phtml = genconfig.pages[pagename].phtml
			phtmlrequired += `<?php require_once dirname(__FILE__).'/${phtml.filename}' ?>\r\n`
		}


		var basename = genconfig.basename


		var phtmltpl = path.join(genconfig.GENLIBDIR, 'tpl', 'main_phtml.tpl')
		var tplscript = fs.readFileSync(phtmltpl).toString()
		tplscript = tplscript.replace('<!--__PHTML_REQUIRED__-->', phtmlrequired)
		tplscript = tplscript.replace('<!--__BASENAME__-->', basename)
		tplscript = tplscript.replace('<!--__BASENAME__-->', basename)



		fsd.script = tplscript
	} catch (err) {
		throw err
	}
}



function CapFL(string) {
	return string[0].toUpperCase() +  string.slice(1);
}