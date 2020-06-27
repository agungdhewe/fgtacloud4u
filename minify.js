'use strict'


const JavaScriptObfuscator = require('javascript-obfuscator');


const colReset = "\x1b[0m"
const colFgRed = "\x1b[31m"
const colFgGreen = "\x1b[32m"
const colFgYellow = "\x1b[33m"
const colBright = "\x1b[1m"

const path = require('path')
const fs = require('fs')
const readline = require('readline');

var programgroupname = process.argv[2]
var targetdir = process.argv[3]

var programgrouppath = path.join(__dirname, 'apps', programgroupname)


// 
// home/agung/Development/fgtacloud4u/server_data/obfuscated/crm
// node minify crm /home/agung/Development/fgtacloud4u/server_data/obfuscated/crm

console.log('FGTA4 Program Obfuscate & Minificator')
console.log('=====================================')

;(async () => {
	try {

		if (!fs.existsSync(programgrouppath)) {
			throw Error(`program group ${programgroupname} tidak ada`)
		}

		if (!fs.existsSync(targetdir)) {
			throw Error(`target direktori ${targetdir} tidak ada`)
		}


		// loop ke programgroupname
		var dir = fs.readdirSync(programgrouppath);
		for (var programdirname of dir) {
			var programdirpath = path.join(programgrouppath, programdirname)
			if (!fs.lstatSync(programdirpath).isDirectory()) {
				continue;
			}

			if (programdirname=='.git') {
				continue;
			}

			var moduledir = fs.readdirSync(programdirpath);
			for (var modulename of moduledir) {

				var scriptdirpath = path.join(programdirpath, modulename)
				var scriptdir = fs.readdirSync(scriptdirpath);
				//console.log(scriptdir)
				for (var scriptname of scriptdir) {
					//console.log(programgroupname, programdirname, modulename, scriptname)
					if (path.extname(scriptname)!='.mjs') {
						continue;
					}

					var original_scriptpath = path.join(scriptdirpath, scriptname)
					var new_scriptname = path.basename(scriptname, '.mjs');
					var new_targetscript = programdirname + '%D%' + modulename + '%D%' + new_scriptname + '.min.mjs'
					var new_targetscriptpath = path.join(targetdir, new_targetscript)
					console.log(new_targetscriptpath)

					var contentbuff = fs.readFileSync(original_scriptpath)
					var content = Buffer.from(contentbuff);
					var obfuscationResult = JavaScriptObfuscator.obfuscate(
						content.toString(),
						{
							compact: true,
							controlFlowFlattening: true,
							selfDefending: true
							
						}
					);

					fs.writeFileSync(new_targetscriptpath, obfuscationResult.getObfuscatedCode());
				}

			}

		}


	} catch (err) {
		console.log(`${colFgRed}Error.${colReset}`)		
		console.log(err.message)
		process.exit(0)
	} finally {
		console.log("\n\n\n")
		
	}		
})();
