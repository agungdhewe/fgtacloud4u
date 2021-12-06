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
		console.log(`Generate API Save...`)


		var headertable_name = genconfig.schema.header
		var headertable = genconfig.persistent[headertable_name]
		var data = headertable.data

		// console.log(data)
		var fields = []
		for (var fieldname in data) {
			fields.push(fieldname)
		}


		var primarykey = headertable.primarykeys[0]




		// get all data detil
		var tabletodelete = [];
		if (Object.keys(genconfig.schema.detils).length>0) {
			for (var detilname in genconfig.schema.detils) {
				var detil = genconfig.schema.detils[detilname]
				var tablename = detil.table
				if (tablename!=null) {
					if (tablename != headertable_name+'appr') {
						tabletodelete.push(tablename)
					}
				}
			}
		}

		var tablelist = tabletodelete.length > 0 ? `['${tabletodelete.join("', '")}']` : '[]'; 
		var deletereference = `
				$tabletodelete = ${tablelist};
				foreach ($tabletodelete as $reftablename) {
					$cmd = \\FGTA4\\utils\\SqlUtility::CreateSQLDelete($reftablename, $key);
					$stmt = $this->db->prepare($cmd->sql);
					$stmt->execute($cmd->params);
				}
		`;


	

		var mjstpl = path.join(genconfig.GENLIBDIR, 'tpl', 'delete_api.tpl')
		var tplscript = fs.readFileSync(mjstpl).toString()
		tplscript = tplscript.replace('/*{__TABLENAME__}*/', headertable_name)
		tplscript = tplscript.replace('/*{__PRIMARYID__}*/', primarykey)
		tplscript = tplscript.replace('/*{__DELETE_REFERENCE__}*/', deletereference)
		tplscript = tplscript.replace(/{__BASENAME__}/g, genconfig.basename);
		tplscript = tplscript.replace(/{__TABLENAME__}/g, headertable_name)
		tplscript = tplscript.replace(/{__MODULEPROG__}/g, genconfig.modulename + '/apis/delete.php');
		tplscript = tplscript.replace(/{__GENDATE__}/g, ((date)=>{var year = date.getFullYear();var month=(1+date.getMonth()).toString();month=month.length>1 ? month:'0'+month;var day = date.getDate().toString();day = day.length > 1 ? day:'0'+day;return day+'/'+month+'/'+year;})(new Date()));



		fsd.script = tplscript
	} catch (err) {
		throw err
	}
}