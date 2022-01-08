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
		console.log(`Generate JSON Config...`)

		var title = genconfig.title
		var icon = genconfig.icon;
		var backcolor = genconfig.backcolor;

		var config_icon = "";
		if (icon!=null) {
			config_icon = `"icon": "${icon}",`;
		}

		var config_backcolor = "";
		if (backcolor!=null) {
			config_backcolor = `"backcolor": "${backcolor}",`
		}


		var variance = "";
		if (genconfig.variance!=null) {
			variance += `\r\n\t\t`;
			for (var vkey in genconfig.variance) {
				variance += `"${vkey}" : ${JSON.stringify(genconfig.variance[vkey])}`
			}
			variance += `\r\n\t`;
		}



		var mjstpl = path.join(genconfig.GENLIBDIR, 'tpl', 'json.tpl')
		var tplscript = fs.readFileSync(mjstpl).toString()
		tplscript = tplscript.replace('__PROGRAM_TITLE__', title)
		tplscript = tplscript.replace('__PROGRAM_ICON__', config_icon)
		tplscript = tplscript.replace('__PROGRAM_BACKCOLOR__', config_backcolor)
		tplscript = tplscript.replace('__PROGRAM_VARIANCE__', variance)



		// console.log(tplscript)		
		fsd.script = tplscript


	} catch (err) {
		throw err
	}
}