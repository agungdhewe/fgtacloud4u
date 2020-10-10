'use strict'

const dbtype = global.dbtype;
const comp = global.comp;

module.exports = {
	title: "Permission",
	autoid: false,

	persistent: {
		'fgt_permission': {
			comment: 'Daftar Permission',
			primarykeys: ['permission_id'],
			data: {
				permission_id: { text: 'Code', type: dbtype.varchar(20), uppercase: true, null: false, options: { required: true, invalidMessage: 'Code harus diisi' } },
				permission_name: { text: 'Permission', type: dbtype.varchar(90), null: false, uppercase: true, options: { required: true, invalidMessage: 'Nama permission harus diisi' } },
				permission_descr: { text: 'Descr', type: dbtype.varchar(255), suppresslist: true },
			},

			uniques: {
				'permission_name': ['permission_name']
			},
			defaultsearch: ['permission_id', 'permission_name'],

			values: [
				{permission_id:'ASSET_BOOK_ALLOW', permission_name:'ASSET_BOOK_ALLOW'}
			]
		},

	},

	schema: {
		header: 'fgt_permission',
		detils: {
		}
	}


}