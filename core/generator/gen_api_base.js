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

		var headertable_name = genconfig.schema.header
		var headertable = genconfig.persistent[headertable_name]
		// var data = headertable.data

		var primarykey = headertable.primarykeys[0]
		
		var add_approval = genconfig.approval===true;
		var add_commiter = add_approval===true ? true : (genconfig.committer===true);
	

		var fields_commit = "";	
		var fields_approve = "";

		if (add_commiter) {
			var fields_commit = `
	protected $field_iscommit = "${genconfig.basename}_iscommit";
	protected $field_commitby = "${genconfig.basename}_commitby";
	protected $field_commitdate = "${genconfig.basename}_commitdate";		
			`;

			if (add_approval) {
				var fields_approve = `
	protected $fields_isapprovalprogress = "${genconfig.basename}_isapprovalprogress";			
	protected $field_isapprove = "${genconfig.basename}_isapproved";
	protected $field_approveby = "${genconfig.basename}_approveby";
	protected $field_approvedate = "${genconfig.basename}_approvedate";
	protected $field_isdecline = "${genconfig.basename}_isdeclined";
	protected $field_declineby = "${genconfig.basename}_declineby";
	protected $field_declinedate = "${genconfig.basename}_declinedate";

	protected $approval_tablename = "mst_${genconfig.basename}appr";
	protected $approval_primarykey = "${genconfig.basename}appr_id";
	protected $approval_field_approve = "${genconfig.basename}appr_isapproved";
	protected $approval_field_approveby = "	${genconfig.basename}appr_by";
	protected $approval_field_approvedate = "${genconfig.basename}appr_date";
	protected $approval_field_decline = "${genconfig.basename}appr_isdeclined";
	protected $approval_field_declineby = "${genconfig.basename}appr_declinedby";
	protected $approval_field_declinedate = "${genconfig.basename}appr_declineddate";
	protected $approval_field_notes = "${genconfig.basename}appr_notes";
	protected $approval_field_version = "${genconfig.basename}_version";

	protected $doc_id = "${genconfig.doc_id}";
			`;
			}
		}



		var mjstpl = path.join(genconfig.GENLIBDIR, 'tpl', 'xapibase.tpl')
		var tplscript = fs.readFileSync(mjstpl).toString()
		tplscript = tplscript.replace(/{__BASENAME__}/g, genconfig.basename);
		tplscript = tplscript.replace(/{__TABLENAME__}/g, headertable_name);
		tplscript = tplscript.replace(/{__MODULEPROG__}/g, genconfig.modulename + '/apis/xapi.base.php');
		tplscript = tplscript.replace(/{__GENDATE__}/g, ((date)=>{var year = date.getFullYear();var month=(1+date.getMonth()).toString();month=month.length>1 ? month:'0'+month;var day = date.getDate().toString();day = day.length > 1 ? day:'0'+day;return day+'/'+month+'/'+year;})(new Date()));
		tplscript = tplscript.replace(/{__PRIMARYID__}/g, primarykey)

		tplscript = tplscript.replace('/*{__FIELDSCOMMIT__}*/', fields_commit)
		tplscript = tplscript.replace('/*{__FIELDSAPPROVE__}*/', fields_approve)

		tplscript = tplscript.replace('/*{__FIELDSAPPROVE__}*/', fields_approve)

		

		fsd.script = tplscript

	} catch (err) {
		throw err
	}
}