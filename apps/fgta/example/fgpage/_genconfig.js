'use strict'

const dbtype = global.dbtype;
const comp = global.comp;

module.exports = {
	title: "FG Page",
	autoid: false,

	persistent: {
	
		'mst_paymtype': {
			comment: 'Daftar Tipe-tipe pembayaran',
			primarykeys: ['paymtype_id'],
			data: {
				paymtype_id: { text: 'ID', type: dbtype.varchar(10), uppercase: true, null: false, options: { required: true, invalidMessage: 'ID harus diisi' } },
				paymtype_name: { text: 'Type', type: dbtype.varchar(30), uppercase: true, null: false, options: { required: true, invalidMessage: 'Type harus diisi' } },
				paymtype_descr: { text: 'Descr', type: dbtype.varchar(30), null: true },
				paymtype_iscash: { text: 'Cash', type: dbtype.boolean, null: false, default: '0' },
				paymtype_isdisabled: { text: 'Disabled', type: dbtype.boolean, null: false, default: '0' },
			},

			uniques: {
				'paymtype_name': ['paymtype_name']
			},
		 	defaultsearch: ['paymtype_id', 'paymtype_name'],
		 
			values: [
				{paymtype_id:'CA', paymtype_name:'CASH'},
				{paymtype_id:'GI', paymtype_name:'GIRO'},
		 	]
		}	
	},

  schema: {
    header: 'mst_paymtype',
    detils: {
		'page1': {title: 'Page 1', table: 'mst_paymtype', form: false },
		'page2': {title: 'Page 2', table: 'mst_paymtype', form: false },
		'page3': {title: 'Page 3', table: 'mst_paymtype', form: false },
    }
  }
}