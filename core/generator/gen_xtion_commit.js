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
		console.log(`Generate API Base ...`)

		var dept_id_field = genconfig.dept_id_field;

		var headertable_name = genconfig.schema.header
		var headertable = genconfig.persistent[headertable_name]
		var data = headertable.data
		var primarykey = headertable.primarykeys[0]
		var basename = genconfig.basename

		var add_approval = genconfig.approval===true;
		var add_commiter = add_approval===true ? true : (genconfig.committer===true);

		var approval_require = "";
		var approval_use = "";
		var approval_execute = "";
		var approval_function = "";
		if (add_approval) {

			var fn_dept_param = `'dept_id'`;
			if (dept_id_field!=null) {
				fn_dept_param = `'${dept_id_field}'`
			}

			approval_require = "require_once __ROOT_DIR.'/core/approval.php';";
			approval_use = "use \FGTA4\StandartApproval;";
			approval_execute = `			$this->set_approval($currentdata);`
			approval_function = `
	public function set_approval($currentdata) {
		try {
			StandartApproval::copy(
				$this->db, 
				$currentdata,
				$this->approval_tablename, 
				["$this->main_primarykey"=> $currentdata->header->{$this->main_primarykey}, "$this->approval_primarykey"=>null],
				$currentdata->header->doc_id,
				${fn_dept_param}
			);

		} catch (\Exception $ex) {
			throw $ex;
		}		
	}			
			`;
		}



		var lookupfields = ''
		for (var fieldname in data) {
			var comptype = data[fieldname].comp.comptype
			if (comptype=='datebox') {
				lookupfields += `\t\t\t\t\t'${fieldname}' => date("d/m/Y", strtotime($record['${fieldname}'])),\r\n`;
			} else if (comptype=='combo') {
				var options = data[fieldname].comp.options
				var field_display_name = options.field_display;
				if (options.field_display_name!=null) {
					field_display_name = options.field_display_name;
				}				
				lookupfields += `\t\t\t\t\t'${field_display_name}' => \\FGTA4\\utils\\SqlUtility::Lookup($record['${fieldname}'], $this->db, '${options.table}', '${options.field_value}', '${options.field_display}'),\r\n`
			}  else if  (data[fieldname].lookup==='user') {
				lookupfields += `\t\t\t\t\t'${fieldname}' => \\FGTA4\\utils\\SqlUtility::Lookup($record['${fieldname}'], $this->db, $GLOBALS['MAIN_USERTABLE'], 'user_id', 'user_fullname'),\r\n`
			}
		}


		var mjstpl = path.join(genconfig.GENLIBDIR, 'tpl', 'xtion-commit.tpl')
		var tplscript = fs.readFileSync(mjstpl).toString()
		tplscript = tplscript.replace(/{__BASENAME__}/g, genconfig.basename);
		tplscript = tplscript.replace(/{__MODULEPROG__}/g, genconfig.modulename + '/apis/xtion-commit.php');
		tplscript = tplscript.replace(/{__GENDATE__}/g, ((date)=>{var year = date.getFullYear();var month=(1+date.getMonth()).toString();month=month.length>1 ? month:'0'+month;var day = date.getDate().toString();day = day.length > 1 ? day:'0'+day;return day+'/'+month+'/'+year;})(new Date()));

		tplscript = tplscript.replace('/*--__APPROVALREQUIRE__--*/', approval_require);
		tplscript = tplscript.replace('/*--__APPROVALUSE__--*/', approval_use);
		tplscript = tplscript.replace('/*--__APPROVALEXECUTE__--*/', approval_execute);
		tplscript = tplscript.replace('/*--__APPROVALFUNCTION__--*/', approval_function);

		tplscript = tplscript.replace('/*{__TABLENAME__}*/', headertable_name)
		tplscript = tplscript.replace('/*{__PRIMARYID__}*/', primarykey)
		tplscript = tplscript.replace('/*{__LOOKUPFIELD__}*/', lookupfields)


		fsd.script = tplscript

	} catch (err) {
		throw err
	}
}