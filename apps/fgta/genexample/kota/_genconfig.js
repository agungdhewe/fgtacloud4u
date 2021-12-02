'use strict'

const dbtype = global.dbtype;
const comp = global.comp;

module.exports = {
	title: "Kota",
	autoid: false,

	persistent: {
		'mst_kota' : {
			primarykeys: ['kota_id'],
			comment: 'Daftar Tipe Brand',
			data: {
				kota_id: {text:'ID', type: dbtype.varchar(10), null:false, uppercase: true},
				kota_name: {text:'Nama Kota', type: dbtype.varchar(60), null:false, uppercase: true},
			},
			
			uniques: {
				'kota_name' : ['kota_name']
			},

			values: [
				{kota_id:'MGL' ,kota_name:'MAGELANG' },
				{kota_id:'JKT' ,kota_name:'JAKARTA' },
			]			

		},
	},

	schema: {
		title: 'Kota',
		header: 'mst_kota',
		detils: {}
	}
}

