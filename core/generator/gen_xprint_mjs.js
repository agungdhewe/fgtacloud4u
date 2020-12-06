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
		console.log(`Generate XPRINT MJS...`)

		// var import_script = ''
		// var pageinit_script = []
		// var paneldeclare_script = ''
		// for (var pagename in genconfig.pages) {
		// 	if (genconfig.pages[pagename].api===true) {
		// 		continue
		// 	}			
		// 	var mjs = genconfig.pages[pagename].mjs
		// 	var phtml = genconfig.pages[pagename].phtml
		// 	import_script += `import * as ${mjs.handler} from './${mjs.filename}'\r\n`
		// 	paneldeclare_script += `const ${phtml.panel} = $('#${phtml.panel}')\r\n`
		// 	pageinit_script.push(`\t\t\t{panel: ${phtml.panel}, handler: ${mjs.handler}}`)
		// }

		//console.log(import_script)
		// console.log(paneldeclare_script)
		// console.log(pageinit_script.join(',\r\n'))

		var basename = genconfig.basename

		var mjstpl = path.join(genconfig.GENLIBDIR, 'tpl', 'xprint_mjs.tpl')
		var tplscript = fs.readFileSync(mjstpl).toString()
		// tplscript = tplscript.replace('/*{__IMPORT_SCRIPT__}*/', import_script)
		// tplscript = tplscript.replace('/*{__PANELDECLARE_SCRIPT__}*/', paneldeclare_script)
		// tplscript = tplscript.replace('/*{__PAGEINIT_SCRIPT__}*/', ',\r\n' + pageinit_script.join(',\r\n'))
		// tplscript = tplscript.replace('{__BASENAME__}', basename)
		// tplscript = tplscript.replace('{__BASENAME__}', basename)
		// tplscript = tplscript.replace('{__BASENAME__}', basename)

		
		// console.log(tplscript)		
		fsd.script = tplscript

	} catch (err) {
		throw err
	}
}