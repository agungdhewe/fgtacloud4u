const path = require('path')
const fs = require('fs')

const colReset = "\x1b[0m"
const colFgRed = "\x1b[31m"
const colFgGreen = "\x1b[32m"
const colFgYellow = "\x1b[33m"
const colFgBlack = "\x1b[30m"
const colBright = "\x1b[1m"
const BgYellow = "\x1b[43m"


const DATESERIAL = (new Date()).getTime();

module.exports = async(genconfig) => {
	// siapkan direktori
	try {
		var fsdata = await PrepareFs(genconfig)

		return fsdata
	} catch (err) {
		throw err
	}
}

async function PrepareFs(genconfig) {
	const dbtype = global.dbtype;
	const comp = global.comp;


	var programpath = genconfig.programpath
	var basename = path.basename(programpath);
	var basetableentity = genconfig.basetableentity;

	if (fs.existsSync(path.join(programpath, `${basename}.genlock`))) {
		var genlockfile = path.join(programpath, `${basename}.genlock`);
		var genlockfilecontent = fs.readFileSync(genlockfile)
		throw 'Program sudah di lock, tidak bisa digenerate.\r\n' + genlockfilecontent;
	}

	if (genconfig.approval===true) {
		var tbl_header = genconfig.schema.header;
		var tbl_approval = genconfig.schema.header + 'appr';
		var primarykeys = genconfig.persistent[tbl_header].primarykeys;
		genconfig.schema.detils['approval'] = {title: 'Approval', table: tbl_approval, form: true, headerview: primarykeys, isapprovalform: true}; 
		genconfig.persistent[tbl_approval] = {
			primarykeys: [basetableentity + 'appr_id'],
			comment: 'Approval ' + genconfig.schema.title,
		}

		var data = {}
		data[basetableentity + 'appr_id'] = {text:'ID', type: dbtype.varchar(14), suppresslist: true, null:false}
		data[basetableentity + 'appr_isapproved'] = {text:'Approved', type: dbtype.boolean, null:false, default:'0', suppresslist: true, options:{disabled:true}}
		data[basetableentity + 'appr_by'] = {text:'Approved By', type: dbtype.varchar(14), suppresslist: true, options:{disabled:true}, lookup:'user'}
		data[basetableentity + 'appr_date'] = {text:'Approved Date', type: dbtype.datetime, suppresslist: true, comp:comp.Textbox(), options:{disabled:true}}
		data[basetableentity + '_version'] = {text:'Version', type: dbtype.int(4), null:false, default:'0', suppresslist: true, options:{disabled:true}}
		data[basetableentity + 'appr_isdeclined'] = {text:'Declined', type: dbtype.boolean, null:false, default:'0', suppresslist: true, options:{disabled:true}}
		data[basetableentity + 'appr_declinedby'] = {text:'Declined By', type: dbtype.varchar(14), suppresslist: true, options:{disabled:true}, lookup:'user'}
		data[basetableentity + 'appr_declineddate'] = {text:'Declined Date', type: dbtype.datetime, suppresslist: true, comp:comp.Textbox(), options:{disabled:true}}
		data[basetableentity + 'appr_notes'] = {text:'Notes', type: dbtype.varchar(255), suppresslist: true}
		data[basetableentity + '_id'] = {text:'ID', type: dbtype.varchar(30), null:false, suppresslist: true,}
		data['docauth_descr'] = {text:'Approval', type: dbtype.varchar(90), null:true, uppercase: false, suppresslist: false, options:{disabled: true}}
		data['docauth_order'] = {text:'Order', type: dbtype.int(4), null:false, default:0, suppresslist: true, options:{disabled: true}}
		data['docauth_value'] = {text:'Value', type: dbtype.int(4), null:false, default:100, suppresslist: true, options:{disabled: true}}
		data['docauth_min'] = {text:'Min', type: dbtype.int(4), null:false, default:0, suppresslist: true, options:{disabled: true}}
		data['authlevel_id'] = {text:'LevelId', type: dbtype.varchar(10), null:false, suppresslist: true, options:{disabled: true}}
		data['authlevel_name'] = {text:'Level', type: dbtype.varchar(60), null:false, suppresslist: true, options:{disabled: true}}
		data['auth_id'] = {text:'AuthorisasiId', type: dbtype.varchar(10), null:true, suppresslist: true, options:{disabled: true}}
		data['auth_name'] = {text:'Authorisasi', type: dbtype.varchar(60), null:false, suppresslist: true, options:{disabled: true}}
		
		var uniques = {}
		uniques[basetableentity + '_auth_id'] = [basetableentity + '_id', 'auth_id'] ;

		genconfig.persistent[tbl_approval].data = data;
		genconfig.persistent[tbl_approval].uniques = uniques;
	}



	InitDetilPages(genconfig)

	var fsdata = [
		{name: 'apis', type:'dir'},
		{program:'gen_table', name: `${basename}.sql`},
		{program:'gen_mainphp', name: `${basename}.php`},
		{program:'gen_phtml', name: `${basename}.phtml`},
		{program:'gen_phtml', name: `${basename}.phtml`},
		{program:'gen_mjs', name: `${basename}.mjs`},
		{program:'gen_phtml_list', name: `${basename}-list.phtml`},
		{program:'gen_mjs_list', name: `${basename}-list.mjs`},
		{program:'gen_phtml_edit', name: `${basename}-edit.phtml`},
		{program:'gen_mjs_edit', name: `${basename}-edit.mjs`},
		{program:'gen_mjs_apis', name: `${basename}.apis.mjs`},
		{program:'gen_json', name: `${basename}.json`},
		{program:'gen_api_base', name: path.join('apis', 'xapi.base.php')},
		{program:'gen_api_list', name: path.join('apis', 'list.php')},
		{program:'gen_api_save', name: path.join('apis', 'save.php')},
		{program:'gen_api_open', name: path.join('apis', 'open.php')},
		{program:'gen_api_delete', name: path.join('apis', 'delete.php')},
		{program:'gen_vsworkspace', name: `${basename}.code-workspace`},
	]


	if (genconfig.printing===true) {
		fsdata.push({program:'gen_xprint_css', name: `${basename}.xprint.css`});
		fsdata.push({program:'gen_xprint_mjs', name: `${basename}.xprint.mjs`});
		fsdata.push({program:'gen_xprint_php', name: `${basename}.xprint.php`});
		fsdata.push({program:'gen_xprint_phtml', name: `${basename}.xprint.phtml`});
	}

	var add_approval = genconfig.approval===true;
	var add_commiter = add_approval===true ? true : (genconfig.committer===true);
	if (add_commiter) {
		fsdata.push({program:'gen_xtion_commit', name: path.join('apis', 'xtion-commit.php')});
		fsdata.push({program:'gen_xtion_uncommit', name: path.join('apis', 'xtion-uncommit.php')});
		if (add_approval) {
			fsdata.push({program:'gen_xtion_approve', name: path.join('apis', 'xtion-approve.php')});
		}
	}


	for (var pagename in genconfig.pages) {
		var p = genconfig.pages[pagename]
		if (p.api===true) {
			fsdata.push(p)
		} else {
			var pscrs = ['mjs', 'phtml']
			for (var pscr of pscrs) {
				p[pscr].name = p[pscr].filename
				p[pscr].pagename = pagename
				fsdata.push(p[pscr])
			}
		}
		
	}


	try {

		await PrepareFrameworkDir(genconfig)
		for (let fd of fsdata) {
			if (fd.type==='dir') {
				await PrepareDir(programpath, fd)
			} else {
				await PrepareFile(programpath, fd)
			}
			fd.basename = basename
		}

		return fsdata
	} catch (err) {
		throw err
	}

} 



async function PrepareFrameworkDir(genconfig) {
	//console.log(genconfig)
	// get modulegroup
	var modulename = genconfig.modulename
	var modules = modulename.split('/')
	var modulegroup = modules[0]

	try {
		var framework_dir = path.join(genconfig.dirname, 'apps', modulegroup, 'framework')
		if (!fs.existsSync(framework_dir)) {
			fs.mkdirSync(framework_dir)
		}

		var general_dir = path.join(framework_dir, 'general')
		if (!fs.existsSync(general_dir)) {
			fs.mkdirSync(general_dir)
		}		

		var apis_dir = path.join(general_dir, 'apis')
		if (!fs.existsSync(apis_dir)) {
			fs.mkdirSync(apis_dir)
		}


		var general_json = path.join(general_dir, 'general.json')
		if (!fs.existsSync(general_json)) {
			var tpl = path.join(genconfig.GENLIBDIR, 'tpl', 'general_json.tpl')
			var tplscript = fs.readFileSync(tpl).toString()
			fs.writeFileSync(general_json, tplscript)
		}

		var general_loglist_api = path.join(apis_dir, 'loglist.php')
		if (!fs.existsSync(general_loglist_api)) {
			var tpl = path.join(genconfig.GENLIBDIR, 'tpl', 'general_loglist_api.tpl')
			var tplscript = fs.readFileSync(tpl).toString()
			fs.writeFileSync(general_loglist_api, tplscript)
		}

	} catch (err) {
		
		throw err
	}
}


async function PrepareDir(programpath, fd) {
	var name = fd.name
	var fspath = path.join(programpath, name)

	process.stdout.write(`Cek direktori ${name}... `);
	try {
		if (fs.existsSync(fspath)) {
			process.stdout.write(`${BgYellow}${colFgBlack}exist${colReset} `);
			// direktori sudah ada, cek apakah benar direktori
			if (!fs.lstatSync(fspath).isDirectory()) {
				throw `${colBright}${fspath}${colReset} bukan direktori`
			} else {
				console.log('OK.')
			}
		} else {
			// direktori belum ada, buat baru
			console.log(`-> ${colFgYellow}buat direktori baru${colReset} '${fspath}' `)
			fs.mkdirSync(fspath)
		}

		fd.write = async () => {}
	} catch (err) {
		
		throw err
	}
}

async function PrepareFile(programpath, fd) {
	try {
		fd.programpath = programpath
		fd.write = async () => {
			var fspath = path.join(fd.programpath, fd.name)
			process.stdout.write(`Cek file ${fspath}... `);
			try {
				var fspath_dirname = path.dirname(fspath)
				var fspath_filename = path.basename(fspath)
				
				
				//------------------------------
				// disable disini apabila mau testing, tidak bikin file backup
				// if (fs.existsSync(fspath)) {
				// 	console.log('File Exist')
				// 	process.stdout.write(`Creating backup file `);
				// 	fs.copyFileSync(fspath, path.join(fspath_dirname, `backup [${DATESERIAL}] ${fspath_filename}`))
				// } 
				// console.log('OK.')
				//------------------------------

				process.stdout.write(`Writing script file `);
				fs.writeFileSync(fspath, fd.script)
				console.log('OK.')
		
			} catch (err) {
				throw err
			}			
		}
	} catch (err) {
		throw err
	}
}



function InitDetilPages(genconfig) {
	genconfig.pages = {}

	var gen_api = {
		list: "gen_api_tdetil_list",
		open: "gen_api_tdetil_open",
		save: "gen_api_tdetil_save",
		delete: "gen_api_tdetil_delete"
	}

	for (var detilname in  genconfig.schema.detils) {
		var detil = genconfig.schema.detils[detilname]
		if (detil.form===true) {
			genconfig.pages[`${detilname}grid`] = {
				mjs: {program: 'gen_mjs_detilgrid', panel: `pnl_edit${detilname}grid`,handler: `pEdit${CapFL(detilname)}grid`, filename: `${genconfig.basename}-${detilname}grid.mjs`, detilname: detilname},
				phtml: {program: 'gen_phtml_detilgrid', panel: `pnl_edit${detilname}grid`, filename: `${genconfig.basename}-${detilname}grid.phtml`, detilname: detilname}
			}
			genconfig.pages[`${detilname}form`] = {
				mjs: {program: 'gen_mjs_detilform', panel: `pnl_edit${detilname}form`, handler: `pEdit${CapFL(detilname)}form`, filename: `${genconfig.basename}-${detilname}form.mjs`, detilname: detilname},
				phtml: {program: 'gen_phtml_detilform',  panel: `pnl_edit${detilname}form`, filename: `${genconfig.basename}-${detilname}form.phtml`, detilname: detilname}
			}

			var apis = ['list', 'open', 'save', 'delete']
			for (var api of apis) {
				genconfig.pages[`${detilname}-${api}`] = {
					api: true,
					program: gen_api[api],
					name: path.join('apis', `${detilname}-${api}.php`),
					detilname: detilname
				}
			}

		} else {
			genconfig.pages[detilname] = {
				mjs: {program: 'gen_mjs_blank', panel: `pnl_edit${detilname}`, handler: `pEdit${CapFL(detilname)}`, filename: `${genconfig.basename}-${detilname}.mjs`, detilname: detilname},
				phtml: {program: 'gen_phtml_blank', panel: `pnl_edit${detilname}`, filename: `${genconfig.basename}-${detilname}.phtml`, detilname: detilname}					
			}
		}

	}
}


function CapFL(string) {
	return string[0].toUpperCase() +  string.slice(1);
}