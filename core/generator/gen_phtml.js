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
		console.log(`Generate Main HTML...`)
		

		var add_approval = genconfig.approval===true;
		var add_commiter = add_approval===true ? true : (genconfig.committer===true);

		// pageselector = {}
		for (var tablename in genconfig.persistent) {
			var data = genconfig.persistent[tablename].data;
			for (var fieldname in data) {
				var defcomp = data[fieldname].type.defcomp
				if (data[fieldname].comp===undefined) {
					data[fieldname].comp = defcomp
				}
			}
		}

		
		
		var phtmlrequired = ''
		for (var pagename in genconfig.pages) {
			if (genconfig.pages[pagename].api===true) {
				// console.log(genconfig.pages[pagename])
				continue
			}
			var phtml = genconfig.pages[pagename].phtml
			phtmlrequired += `<?php require_once dirname(__FILE__).'/${phtml.filename}' ?>\r\n`
		}


		var basename = genconfig.basename
		var recordstatus = get_recordstatus(add_commiter, add_approval, genconfig);


		var phtmltpl = path.join(genconfig.GENLIBDIR, 'tpl', 'main_phtml.tpl')
		var tplscript = fs.readFileSync(phtmltpl).toString()
		tplscript = tplscript.replace('<!--__PHTML_REQUIRED__-->', phtmlrequired)
		tplscript = tplscript.replace('<!--__BASENAME__-->', basename)
		tplscript = tplscript.replace('<!--__BASENAME__-->', basename)
		tplscript = tplscript.replace('<!--__RECORDSTATUS__-->', recordstatus)



		fsd.script = tplscript
	} catch (err) {
		throw err
	}
}



function CapFL(string) {
	return string[0].toUpperCase() +  string.slice(1);
}


function get_recordstatus(add_commiter, add_approval, genconfig) {
	if (!add_commiter && !add_approval) {
		return '';
	}

	var recordstatus = "";
	if (add_commiter) {
		recordstatus = `
<div id="pnl_edit_record_custom" style="display: none">
	<div class="form_row">
		<div class="form_label_col">Commit By</div>
		<div class="form_input_col" style="border: 0px solid black">
			<span id="pnl_edit_record-commitby"></span>
		</div>
	</div>	

	<div class="form_row">
		<div class="form_label_col">Commit Date</div>
		<div class="form_input_col" style="border: 0px solid black">
			<span id="pnl_edit_record-commitdate"></span>
		</div>
	</div> 
</div>		
		`;

		if (add_approval) {
			recordstatus = `
<div id="pnl_edit_record_custom" style="display: none">
	<div class="form_row">
		<div class="form_label_col">Commit By</div>
		<div class="form_input_col" style="border: 0px solid black">
			<span id="pnl_edit_record-commitby"></span>
		</div>
	</div>	

	<div class="form_row">
		<div class="form_label_col">Commit Date</div>
		<div class="form_input_col" style="border: 0px solid black">
			<span id="pnl_edit_record-commitdate"></span>
		</div>
	</div> 

	<div class="form_row" style="margin-top: 30px;">
		<div class="form_label_col">Approve By</div>
		<div class="form_input_col" style="border: 0px solid black">
			<span id="pnl_edit_record-approveby"></span>
		</div>
	</div>	

	<div class="form_row">
		<div class="form_label_col">Approve Date</div>
		<div class="form_input_col" style="border: 0px solid black">
			<span id="pnl_edit_record-approvedate"></span>
		</div>
	</div>	

	<div class="form_row" style="margin-top: 30px;">
		<div class="form_label_col">Decline By</div>
		<div class="form_input_col" style="border: 0px solid black">
			<span id="pnl_edit_record-declineby"></span>
		</div>
	</div>	

	<div class="form_row">
		<div class="form_label_col">Decline Date</div>
		<div class="form_input_col" style="border: 0px solid black">
			<span id="pnl_edit_record-declinedate"></span>
		</div>
	</div>	

</div>	
			`;
		}
	}


	return recordstatus;
}
