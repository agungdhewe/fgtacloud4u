'use strict'

const dbtype = global.dbtype;
const comp = global.comp;

module.exports = {
	title: "Proses 02",
	autoid: true,
	idprefix: 'PRO-02-', 
	printing: true,	
	committer: true,
	approval: true,
	doc_id: 'COBA',

	persistent: {
		'mst_pros' : {
			primarykeys: ['pros_id'],
			comment: 'Daftar Dokumen',
			data: {
				pros_id: {text:'ID', type: dbtype.varchar(16), null:false, uppercase: true, options:{required:true,invalidMessage:'ID harus diisi'}},	
				pros_name: {text:'Name', type: dbtype.varchar(60), null:false, uppercase: true, suppresslist: false, options:{required:true,invalidMessage:'Nama harus diisi'}},	
				pros_iscommit: {text:'Commit', type: dbtype.boolean, null:false, default:'0', unset:true, options:{disabled:true}},
				pros_commitby: {text:'CommitBy', type: dbtype.varchar(14), suppresslist: true, unset:true, options:{disabled:true}, hidden: true, lookup:'user'},
				pros_commitdate: {text:'CommitDate', type: dbtype.datetime, suppresslist: true, unset:true, comp:comp.Textbox(), options:{disabled:true}, hidden: true},	
				pros_version: {text:'Version', type: dbtype.int(4), null:false, default:'0', suppresslist: true, options:{disabled:true}},

				pros_isapprovalprogress: {text:'Progress', type: dbtype.boolean, null:false, default:'0', unset:true, options:{disabled:true}, hidden: true},
				pros_isapproved: { text: 'Approved', type: dbtype.boolean, null: false, default: '0', unset:true, options: { disabled: true } },
				pros_approveby: { text: 'Approve By', type: dbtype.varchar(14), suppresslist: true, unset:true, options: { disabled: true }, hidden: true, lookup:'user' },
				pros_approvedate: { text: 'Approve Date', type: dbtype.datetime, suppresslist: true, unset:true, comp: comp.Textbox(), options: { disabled: true }, hidden: true },
				pros_isdeclined: { text: 'Declined', type: dbtype.boolean, null: false, default: '0', unset:true, options: { disabled: true } },
				pros_declineby: { text: 'Decline By', type: dbtype.varchar(14), suppresslist: true, unset:true, options: { disabled: true }, hidden: true, lookup:'user' },
				pros_declinedate: { text: 'Decline Date', type: dbtype.datetime, suppresslist: true, unset:true, comp: comp.Textbox(), options: { disabled: true }, hidden: true },

				doc_id: {
					text:'Doc', type: dbtype.varchar(30), null:false, uppercase: true, 
					options: {required:true, invalidMessage:'ID harus diisi' },
					comp: comp.Combo({
						table: 'mst_doc',
						field_value: 'doc_id', field_display: 'doc_name', field_display_name: 'doc_name',
						api: 'ent/organisation/docs/list'
					})				
				},


				dept_id: {
					text: 'Dept', type: dbtype.varchar(30), null: false,
					options: { required: true, invalidMessage: 'Departmen Harus diisi', prompt: '-- PILIH --' },
					comp: comp.Combo({
						table: 'mst_dept',
						field_value: 'dept_id', field_display: 'dept_name',
						api: 'ent/organisation/dept/list'
					})
				},				
			},
			defaultsearch: ['pros_id', 'pros_name'],
			uniques: {
				'pros_name' : ['pros_name']
			}
		}

	},

	schema: {
		title: 'Proses 02',
		header: 'mst_pros',
		detils: {
        }
	}	
}