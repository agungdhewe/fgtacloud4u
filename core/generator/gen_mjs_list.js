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
		console.log(`Generate MJS List...`)

		var buttonstate = '';
		if (genconfig.disablenewbutton===true) {
			buttonstate += "\r\n\t" + "btn_new.hide();"
		}
		
		var handlerlib = '';
		var handlerassignment = '';
		var handlercustomsearch = '';
		var handlerrowrender = '';
		var handlercellrender = '';

		if (genconfig.schema.listHandler != undefined) {
			handlerlib = `import * as hnd from  './${genconfig.schema.listHandler}'\r\n`;
			handlerassignment = `\tgrd_list.autoload = true;
	if (typeof hnd.init==='function') {
			hnd.init({
				grd_list: grd_list,
				opt: opt,
			}, ()=>{
				if (grd_list.autoload) {
					btn_load_click();
				}
			})
		} else {
			btn_load_click();
	}`;

			handlercustomsearch = `if (typeof hnd.customsearch === 'function') {
			hnd.customsearch(options);
		}`;

			handlerrowrender = `if (typeof hnd.grd_list_rowrender === 'function') {
			hnd.grd_list_rowrender({tr:tr, td:td, record:record, mapping:mapping, dataid:dataid, i:i});
		}`;


			handlercellrender = `if (typeof hnd.grd_list_cellrender === 'function') {
		hnd.grd_list_cellrender({td:td, mapping:td.mapping, text:td.innerHTML});
	}`;

		}

		// var autoload = '';
		// if (genconfig.schema.autoload!==false) {
		// 	autoload = "\tbtn_load_click()";
		// }



		var mjstpl = path.join(genconfig.GENLIBDIR, 'tpl', 'list_mjs.tpl')
		var tplscript = fs.readFileSync(mjstpl).toString()
		tplscript = tplscript.replace('/*--__BUTTONSTATE__--*/', buttonstate)
		tplscript = tplscript.replace('/*--__HANDLERLIB__--*/', handlerlib)
		tplscript = tplscript.replace('/*--__HANDLERASSIGNMENT__--*/', handlerassignment)
		// tplscript = tplscript.replace('/*--__AUTOLOAD__--*/', autoload)
		tplscript = tplscript.replace('/*--__HANDLERCUSTOMSERACH__--*/', handlercustomsearch)

		tplscript = tplscript.replace('/*--__HANDLERROWRENDER__--*/', handlerrowrender)
		tplscript = tplscript.replace('/*--__HANDLERCELLRENDER__--*/', handlercellrender)

		
		
		
		// console.log(tplscript)		
		fsd.script = tplscript
	} catch (err) {
		throw err
	}
}