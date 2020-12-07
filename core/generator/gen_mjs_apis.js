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
		console.log(`Generate API Config MJS...`)

		var apivar = [];

		var apis = ''
		var headertable_name = genconfig.schema.header
		var headertable = genconfig.persistent[headertable_name]
		var datahead = headertable.data
		for (var fieldname in datahead) {
			if (fieldexclude.includes(fieldname)) { continue }
			var comptype = datahead[fieldname].comp.comptype
			if (comptype=='combo') {
				var options = datahead[fieldname].comp.options
				if (!apivar.includes(fieldname)) {
					apivar.push(fieldname);
					if (options.api!==undefined) {
						apis += `export const load_${fieldname} = '${options.api}'\r\n`
					} else {
						apis += `export const load_${fieldname} = ''\r\n`
					}
				}
			}
		}


		
		for (var detilname in  genconfig.schema.detils) {
			var detil = genconfig.schema.detils[detilname]
			var tablename = detil.table
			var detiltable = genconfig.persistent[tablename]
			var datadetil = detiltable.data
			for (var fieldname in datadetil) {
				if (fieldexclude.includes(fieldname)) { continue }
				var comptype = datadetil[fieldname].comp.comptype
				if (comptype=='combo') {
					var options = datadetil[fieldname].comp.options
					if (!apivar.includes(fieldname)) {
						apivar.push(fieldname);
						if (options.api!==undefined) {
							apis += `export const load_${fieldname} = '${options.api}'\r\n`
						} else {
							apis += `export const load_${fieldname} = ''\r\n`
						}
					}

				}
			}
	
		}




		var mjstpl = path.join(genconfig.GENLIBDIR, 'tpl', 'apis_mjs.tpl')
		var tplscript = fs.readFileSync(mjstpl).toString()
		tplscript = tplscript.replace('/*--__APIS__--*/', apis)


		// console.log(tplscript)		
		fsd.script = tplscript

	} catch (err) {
		throw err
	}
}