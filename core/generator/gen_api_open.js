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
		console.log(`Generate API Open...`)


		var headertable_name = genconfig.schema.header
		var headertable = genconfig.persistent[headertable_name]
		var data = headertable.data;

		var add_approval = genconfig.approval===true;
		var add_commiter = add_approval===true ? true : (genconfig.committer===true);

		var usecdb = false;
		var fileboxopen = '';
		var lookupfields = ''
		var tojsdate = ''
		var fields = []
		for (var fieldname in data) {
			fields.push("'" + fieldname+ "'")

			var comptype = data[fieldname].comp.comptype
			if (comptype=='datebox') {
				tojsdate += `\t\t\t\t'${fieldname}' => date("d/m/Y", strtotime($record['${fieldname}'])),\r\n`
			}		
			
			// untuk componen yang tienya combo, tambah lookup
			if (comptype=='combo') {
				var options = data[fieldname].comp.options
				var field_display_name = options.field_display;
				if (options.field_display_name!=null) {
					field_display_name = options.field_display_name;
				}				
				lookupfields += `\t\t\t\t'${field_display_name}' => \\FGTA4\\utils\\SqlUtility::Lookup($record['${fieldname}'], $this->db, '${options.table}', '${options.field_value}', '${options.field_display}'),\r\n`
			} else if  (data[fieldname].lookup==='user') {
				lookupfields += `\t\t\t\t'${fieldname}' => \\FGTA4\\utils\\SqlUtility::Lookup($record['${fieldname}'], $this->db, $GLOBALS['MAIN_USERTABLE'], 'user_id', 'user_fullname'),\r\n`
			}
			
			if (comptype=='filebox') {
				usecdb = true;
				var idsuffix = data[fieldname].idsuffix;
				var fileid = idsuffix===undefined || idsuffix=='' ? '$result->record[$primarykey]' : `$result->record[$primarykey] . "|${idsuffix}"`;
				fileboxopen += "\t\t\t\t" + `try { $result->record['${fieldname}_doc'] = $this->cdb->getAttachment(${fileid}, 'filedata'); } catch (\\Exception $ex) {}\r\n`;
			}
			
		}


		var primarykey = headertable.primarykeys[0]
	
		var lookupuserapproval = "";
		var lookupusermerge = "";
		if (add_approval) {
			lookupuserapproval = `
			\$approverow = \\FGTA4\\utils\\SqlUtility::LookupRow((object)["$this->main_primarykey"=>$record[$this->main_primarykey], "$this->approval_field_approveby"=>$userdata->username, "$this->approval_field_approve"=>'1'], $this->db, $this->approval_tablename);
			\$declinerow = \\FGTA4\\utils\\SqlUtility::LookupRow((object)["$this->main_primarykey"=>$record[$this->main_primarykey], "$this->approval_field_declineby"=>$userdata->username, "$this->approval_field_decline"=>'1'], $this->db, "$this->approval_tablename");
			`;

			lookupusermerge = `
				'pros_isuseralreadyapproved' => $approverow!=null ? '1' : '0',
				'pros_isuseralreadydeclined' => $declinerow!=null ? '1' : '0',
			`;
		}


		var openfromcouch = "";
		if ( usecdb) {
			openfromcouch = fileboxopen;
		}

		var mjstpl = path.join(genconfig.GENLIBDIR, 'tpl', 'open_api.tpl')
		var tplscript = fs.readFileSync(mjstpl).toString()
		tplscript = tplscript.replace('/*{__FIELDS__}*/', fields.join(', '))
		tplscript = tplscript.replace('/*{__TABLENAME__}*/', headertable_name)
		tplscript = tplscript.replace('/*{__TABLENAME__}*/', headertable_name)
		tplscript = tplscript.replace('/*{__PRIMARYID__}*/', primarykey)
		tplscript = tplscript.replace('/*{__PRIMARYID__}*/', primarykey)
		tplscript = tplscript.replace('/*{__PRIMARYID__}*/', primarykey)
		tplscript = tplscript.replace('/*{__PRIMARYID__}*/', primarykey)
		tplscript = tplscript.replace('/*{__TOJSDATE__}*/', tojsdate)
		tplscript = tplscript.replace('/*{__LOOKUPFIELDS__}*/', lookupfields)

		tplscript = tplscript.replace('/*{__LOOKUPUSERAPPROVAL__}*/', lookupuserapproval)
		tplscript = tplscript.replace('/*{__LOOKUPUSERMERGE__}*/', lookupusermerge)
		
		
		tplscript = tplscript.replace('/*{__OPENFROMCOUCH__}*/', openfromcouch)


		

		tplscript = tplscript.replace(/{__BASENAME__}/g, genconfig.basename);
		tplscript = tplscript.replace(/{__TABLENAME__}/g, headertable_name)
		tplscript = tplscript.replace(/{__MODULEPROG__}/g, genconfig.modulename + '/apis/open.php');
		tplscript = tplscript.replace(/{__GENDATE__}/g, ((date)=>{var year = date.getFullYear();var month=(1+date.getMonth()).toString();month=month.length>1 ? month:'0'+month;var day = date.getDate().toString();day = day.length > 1 ? day:'0'+day;return day+'/'+month+'/'+year;})(new Date()));
		

		fsd.script = tplscript

	} catch (err) {
		throw err
	}
}