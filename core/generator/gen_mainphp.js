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
		console.log(`Generate Main Module Base ...`)


		var add_approval = genconfig.approval===true;
		var add_commiter = add_approval===true ? true : (genconfig.committer===true);
		var doc_id = genconfig.doc_id;

		var defdocid = "";
		if (add_approval) {
			defdocid = "\r\n\t\t\t" + `'doc_id' => '${doc_id}',`
		}

		var mjstpl = path.join(genconfig.GENLIBDIR, 'tpl', 'mainphp.tpl')
		var tplscript = fs.readFileSync(mjstpl).toString()
		tplscript = tplscript.replace(/{__BASENAME__}/g, genconfig.basename);
		tplscript = tplscript.replace(/{__MODULEPROG__}/g, genconfig.modulename + '/' + genconfig.basename + '.php');
		tplscript = tplscript.replace(/{__GENDATE__}/g, ((date)=>{var year = date.getFullYear();var month=(1+date.getMonth()).toString();month=month.length>1 ? month:'0'+month;var day = date.getDate().toString();day = day.length > 1 ? day:'0'+day;return day+'/'+month+'/'+year;})(new Date()));

		tplscript = tplscript.replace('/*--__DEFDOCID__--*/', defdocid);

		fsd.script = tplscript

	} catch (err) {
		throw err
	}
}