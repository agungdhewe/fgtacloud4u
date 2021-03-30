'use strict'

// data.menuhead_showindropdown = 1;
// data.menuhead_showinaccordion = 1;

const dbtype = global.dbtype;
const comp = global.comp;

module.exports = {
	title: "Upload File",
	autoid: true,

	persistent: {
		'mst_upfile' : {
			primarykeys: ['upfile_id'],
			comment: 'Daftar File',
			data: {
				upfile_id: {text:'ID', type: dbtype.varchar(14), null:false},	
				upfile_name: {text:'Name', type: dbtype.varchar(60), null:false, options: {required:true,invalidMessage:'Text menu harus diisi'}},	
				upfile_data01: {text:'File 1', type: dbtype.varchar(60), comp: comp.Filebox(), options: { accept: 'image/*' }},
				upfile_data02: {text:'File 2', type: dbtype.varchar(60), comp: comp.Filebox(), idsuffix:'file2'},	
			},

			defaultsearch: ['upfile_id', 'upfile_name'],
			uniques: {
				'upfile_name' : ['upfile_name']
			}
		},

		'mst_upfiledetil' : {
			primarykeys: ['upfiledetil_id'],
			comment: 'Daftar Detil File',
			data: {
				upfiledetil_id: {text:'ID', type: dbtype.varchar(14), null:false},	
				upfiledetil_name: {text:'Name', type: dbtype.varchar(60), null:false, options: {required:true,invalidMessage:'Text menu harus diisi'}},	
				upfiledetil_data01: {text:'File 1', type: dbtype.varchar(60), comp: comp.Filebox(), options: { accept: 'image/*' }},
				upfiledetil_data02: {text:'File 2', type: dbtype.varchar(60), comp: comp.Filebox(), idsuffix:'file2'},	
				upfile_id: {text:'ID', type: dbtype.varchar(14), null:false},	
			},

			defaultsearch: ['upfiledetil_id', 'upfiledetil_name'],
			uniques: {
				'upfiledetil_name' : ['upfiledetil_name']
			}
		},		
	},

	schema: {
		title: 'Upload File',
		header: 'mst_upfile',
		detils: {
			'detil': {title: 'Detil', table: 'mst_upfiledetil', form: true, headerview: 'upfile_name' }
		}
	}

}