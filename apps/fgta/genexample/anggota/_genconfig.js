'use strict'

const dbtype = global.dbtype;
const comp = global.comp;

module.exports = {
	title: "Anggota",
	autoid: true,

	persistent: {
		'mst_anggota' : {
			primarykeys: ['anggota_id'],
			comment: 'Daftar Anggota',
			data: {
				anggota_id: {text:'ID', type: dbtype.varchar(14), null:false, uppercase: true},
				anggota_name: {text:'Unit', type: dbtype.varchar(60), null:false, uppercase: true},
				kota_id: {
					text:'Kota', type: dbtype.varchar(10), null:false, 
                    options:{required:true,invalidMessage:'Kota harus diisi', prompt:'-- PILIH --'},
					comp: comp.Combo({
						table: 'mst_kota', 
						field_value: 'kota_id', field_display: 'kota_name', 
						api: 'latihan/crud/kota/list'})
				}

			},
						
			defaultsearch: ['anggota_id', 'anggota_name']
		
		},
	},

	schema: {
		title: 'Anggota',
		header: 'mst_anggota',
		detils: {}
	}
}



