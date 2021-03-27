'use strict'

const dbtype = global.dbtype;
const comp = global.comp;

module.exports = {
	title: "Proses 01",
	autoid: true,
	idprefix: 'PRO-01-', 
	printing: true,	
	committer: true,
	doc_id: 'COBA',

	persistent: {
		'mst_pros01' : {
			primarykeys: ['pros01_id'],
			comment: 'Daftar Dokumen',
			data: {
				pros01_id: {text:'ID', type: dbtype.varchar(16), null:false, uppercase: true, options:{required:true,invalidMessage:'ID harus diisi'}},	
				pros01_name: {text:'Name', type: dbtype.varchar(60), null:false, uppercase: true, suppresslist: false, options:{required:true,invalidMessage:'Nama harus diisi'}},	
				pros01_iscommit: {text:'Commit', type: dbtype.boolean, null:false, default:'0', unset:true, options:{disabled:true}},
				pros01_commitby: {text:'CommitBy', type: dbtype.varchar(14), suppresslist: true, unset:true, options:{disabled:true}, hidden: true, lookup:'user'},
				pros01_commitdate: {text:'CommitDate', type: dbtype.datetime, suppresslist: true, unset:true, comp:comp.Textbox(), options:{disabled:true}, hidden: true},	
				pros01_version: {text:'Version', type: dbtype.int(4), null:false, default:'0', suppresslist: true, options:{disabled:true}},
			},
			defaultsearch: ['pros01_id', 'pros01_name'],
			uniques: {
				'pros01_name' : ['pros01_name']
			}
		}

	},

	schema: {
		title: 'Proses 01',
		header: 'mst_pros01',
		detils: {
        }
	}	
}