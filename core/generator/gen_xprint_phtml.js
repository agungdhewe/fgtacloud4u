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
		console.log(`Generate XPRINT PHP...`)

		var headertable_name = genconfig.schema.header
		var headertable = genconfig.persistent[headertable_name]
		// var data = headertable.data
		var primarykey = headertable.primarykeys[0]
		var basename = genconfig.basename

		var mjstpl = path.join(genconfig.GENLIBDIR, 'tpl', 'xprint_phtml.tpl')
		var tplscript = fs.readFileSync(mjstpl).toString()
		tplscript = tplscript.replace(/{__BASENAME__}/g, basename)
		tplscript = tplscript.replace(/{__PRIMARYID__}/g, primarykey) 
		tplscript = tplscript.replace(/{__TABLENAME__}/g, headertable_name)

	
		fsd.script = tplscript

	} catch (err) {
		throw err
	}
}