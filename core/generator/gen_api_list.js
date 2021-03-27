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
		console.log(`Generate API List...`)


		var headertable_name = genconfig.schema.header
		var headertable = genconfig.persistent[headertable_name]
		var data = headertable.data

		// console.log(data)
		var lookupfields = ''
		var fields = []
		for (var fieldname in data) {
			fields.push(fieldname)

			var comptype = data[fieldname].comp.comptype

			// untuk componen yang tienya combo, tambah lookup
			if (comptype=='combo') {
				var options = data[fieldname].comp.options
				var field_display_name = options.field_display;
				if (options.field_display_name!=null) {
					field_display_name = options.field_display_name;
				}
				lookupfields += `\t\t\t\t\t'${field_display_name}' => \\FGTA4\\utils\\SqlUtility::Lookup($record['${fieldname}'], $this->db, '${options.table}', '${options.field_value}', '${options.field_display}'),\r\n`
			}			
		}



		var primarykey = headertable.primarykeys[0]
	


		var defaultsearch = headertable.defaultsearch;

		if (defaultsearch==null) {
			defaultsearch = [primarykey]
		}

		if (defaultsearch.length==0) {
			defaultsearch = [primarykey]
		}


		var srclines = [];
		for (var srcfield of defaultsearch) {
			srclines.push(`A.${srcfield} LIKE CONCAT('%', :search, '%')`)
		}
		var scrsqlline = srclines.join(' OR ');





		var mjstpl = path.join(genconfig.GENLIBDIR, 'tpl', 'list_api.tpl')
		var tplscript = fs.readFileSync(mjstpl).toString()
		tplscript = tplscript.replace('/*{__FIELDS__}*/', fields.join(', '))
		tplscript = tplscript.replace('/*{__TABLENAME__}*/', headertable_name)
		tplscript = tplscript.replace('/*{__TABLENAME__}*/', headertable_name)
		tplscript = tplscript.replace('/*{__PRIMARYID__}*/', primarykey)
		tplscript = tplscript.replace('/*{__LOOKUPFIELDS__}*/', lookupfields)
		tplscript = tplscript.replace('/*{__SEARCHSQLLINE__}*/', scrsqlline)
		tplscript = tplscript.replace(/{__BASENAME__}/g, genconfig.basename);
		tplscript = tplscript.replace(/{__TABLENAME__}/g, headertable_name)
		tplscript = tplscript.replace(/{__MODULEPROG__}/g, genconfig.modulename + '/apis/list.php');
		tplscript = tplscript.replace(/{__GENDATE__}/g, ((date)=>{var year = date.getFullYear();var month=(1+date.getMonth()).toString();month=month.length>1 ? month:'0'+month;var day = date.getDate().toString();day = day.length > 1 ? day:'0'+day;return day+'/'+month+'/'+year;})(new Date()));

		fsd.script = tplscript

	} catch (err) {
		throw err
	}
}