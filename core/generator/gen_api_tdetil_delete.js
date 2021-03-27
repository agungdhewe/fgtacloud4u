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
	var header_primarykey = headertable.primarykeys[0]


	var detil = genconfig.schema.detils[fsd.detilname]
	var tablename = detil.table
	var detiltable = genconfig.persistent[tablename]
	var data = detiltable.data

	var primarykey = detiltable.primarykeys[0]
	var primarycomppreix = data[primarykey].comp.prefix
	
	var mjstpl = path.join(genconfig.GENLIBDIR, 'tpl', 'tdetil-delete_api.tpl')
	var tplscript = fs.readFileSync(mjstpl).toString()
	tplscript = tplscript.replace('/*{__TABLENAME__}*/', tablename)
	tplscript = tplscript.replace(/<!--__PRIMARYID__-->/g, primarykey)
	tplscript = tplscript.replace('/*{__HEADERTABLE__}*/', headertable_name)
	tplscript = tplscript.replace('/*{__HEADERPRIMARYKEY__}*/', header_primarykey)
	tplscript = tplscript.replace(/{__BASENAME__}/g, genconfig.basename);
	tplscript = tplscript.replace(/{__TABLENAME__}/g, headertable_name)
	tplscript = tplscript.replace(/{__MODULEPROG__}/g, genconfig.modulename + '/' + fsd.name);
	tplscript = tplscript.replace(/{__GENDATE__}/g, ((date)=>{var year = date.getFullYear();var month=(1+date.getMonth()).toString();month=month.length>1 ? month:'0'+month;var day = date.getDate().toString();day = day.length > 1 ? day:'0'+day;return day+'/'+month+'/'+year;})(new Date()));
	tplscript = tplscript.replace(/{__DETILNAME__}/g, fsd.detilname);

	fsd.script = tplscript
}