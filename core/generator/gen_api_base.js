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
		var data = headertable.data

		var hdat = headertable_name.split('_')
		var headertable_prefix = hdat[0];

		var primarykey = headertable.primarykeys[0]
		
		var add_approval = genconfig.approval===true;
		var add_commiter = add_approval===true ? true : (genconfig.committer===true);

		var basetableentity = genconfig.basetableentity;

		var fields_commit = "";	
		var fields_approve = "";

		if (add_commiter) {
			var fields_commit = `
	protected $field_iscommit = "${basetableentity}_iscommit";
	protected $field_commitby = "${basetableentity}_commitby";
	protected $field_commitdate = "${basetableentity}_commitdate";		
			`;

			if (add_approval) {
				var fields_approve = `
	protected $fields_isapprovalprogress = "${basetableentity}_isapprovalprogress";			
	protected $field_isapprove = "${basetableentity}_isapproved";
	protected $field_approveby = "${basetableentity}_approveby";
	protected $field_approvedate = "${basetableentity}_approvedate";
	protected $field_isdecline = "${basetableentity}_isdeclined";
	protected $field_declineby = "${basetableentity}_declineby";
	protected $field_declinedate = "${basetableentity}_declinedate";

	protected $approval_tablename = "${headertable_prefix}_${basetableentity}appr";
	protected $approval_primarykey = "${basetableentity}appr_id";
	protected $approval_field_approve = "${basetableentity}appr_isapproved";
	protected $approval_field_approveby = "${basetableentity}appr_by";
	protected $approval_field_approvedate = "${basetableentity}appr_date";
	protected $approval_field_decline = "${basetableentity}appr_isdeclined";
	protected $approval_field_declineby = "${basetableentity}appr_declinedby";
	protected $approval_field_declinedate = "${basetableentity}appr_declineddate";
	protected $approval_field_notes = "${basetableentity}appr_notes";
	protected $approval_field_version = "${basetableentity}_version";

			`;
			}
		}


		var usecdb = false;
		// cek file upload di header
		for (var fieldname in data) {
			var comptype = data[fieldname].comp.comptype;
			if (comptype=='filebox') {
				usecdb = true;
			}
		}

		// cek file upload di detil
		for (var detilname in genconfig.schema.detils) {
			var detil = genconfig.schema.detils[detilname];
			var tablename = detil.table
			var detiltable = genconfig.persistent[tablename]
			var data = detiltable.data
			for (var fieldname in data) {
				var comptype = data[fieldname].comp.comptype;
				if (comptype=='filebox') {
					usecdb = true;
				}
			}
		}


		var cdbconnect = "";
		var cdbrequire = "";
		var cdblibuse = "";
		if (usecdb) {
			cdbconnect = "$this->cdb = new CouchDbClient((object)DB_CONFIG['FGTAFS']);"
			cdbrequire = "require_once __ROOT_DIR.'/core/couchdbclient.php';"
			cdblibuse = "use \\FGTA4\\CouchDbClient;";
		}



		var mjstpl = path.join(genconfig.GENLIBDIR, 'tpl', 'xapibase.tpl')
		var tplscript = fs.readFileSync(mjstpl).toString()
		tplscript = tplscript.replace(/{__BASENAME__}/g, genconfig.basename);
		tplscript = tplscript.replace(/{__BASETABLEENTITY__}/g, genconfig.basetableentity);
		tplscript = tplscript.replace(/{__TABLENAME__}/g, headertable_name);
		tplscript = tplscript.replace(/{__MODULEPROG__}/g, genconfig.modulename + '/apis/xapi.base.php');
		tplscript = tplscript.replace(/{__GENDATE__}/g, ((date)=>{var year = date.getFullYear();var month=(1+date.getMonth()).toString();month=month.length>1 ? month:'0'+month;var day = date.getDate().toString();day = day.length > 1 ? day:'0'+day;return day+'/'+month+'/'+year;})(new Date()));
		tplscript = tplscript.replace(/{__PRIMARYID__}/g, primarykey)

		tplscript = tplscript.replace('/*{__FIELDSCOMMIT__}*/', fields_commit)
		tplscript = tplscript.replace('/*{__FIELDSAPPROVE__}*/', fields_approve)

		tplscript = tplscript.replace('/*{__CDBCONNECT__}*/', cdbconnect)
		tplscript = tplscript.replace('/*{__CDBREQUIRE__}*/', cdbrequire)
		tplscript = tplscript.replace('/*{__CDBLIBUSE__}*/', cdblibuse)

		

		fsd.script = tplscript

	} catch (err) {
		throw err
	}
}