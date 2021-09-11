'use strict'

const dbtype = global.dbtype;
const comp = global.comp;

module.exports = {
	title: "Role",
	autoid: false,

	persistent: {
		'fgt_role': {
			comment: 'Daftar Role',
			primarykeys: ['role_id'],
			data: {
				role_id: { text: 'ID', type: dbtype.varchar(10), uppercase: true, null: false, options: { required: true, invalidMessage: 'ID harus diisi' } },
				role_name: { text: 'Role', type: dbtype.varchar(90), null: false, uppercase: true, options: { required: true, invalidMessage: 'Nama role harus diisi' } },
				role_descr: { text: 'Descr', type: dbtype.varchar(255), suppresslist: true },
			},

			uniques: {
				'role_name': ['role_name']
			},
			defaultsearch: ['role_id', 'role_name'],

			values: [
				{role_id:'UPM', role_name:'UPM'},
				{role_id:'EDI', role_name:'EDITOR'},
				{role_id:'REP', role_name:'REPORTER'},
				{role_id:'CAM', role_name:'CAMERA PERSON'},
				{role_id:'PRO', role_name:'PRODUCER'},
			]
		},

		'fgt_rolepermission' : {
			comment: 'Daftar Permission Role',
			primarykeys: ['rolepermission_id'],
			data: {
				rolepermission_id: {text:'ID', type: dbtype.varchar(14), null:false},
				permission_id: { 
					text: 'Permission', type: dbtype.varchar(20), uppercase: true, null: false, 
					options: { required: true, invalidMessage: 'Permission harus diisi' }, 
					comp: comp.Combo({
						table: 'fgt_permission', 
						field_value: 'permission_id', field_display: 'permission_name', field_display_name: 'permission_name', 
						api: 'fgta/framework/fgpermission/list'})				
				
				},				
				role_id: { text: 'Role', type: dbtype.varchar(10), uppercase: true, null: false },
			},

			uniques: {
				'rolepermission_pair': ['role_id', 'permission_id']
			},			
		}

	},

	schema: {
		header: 'fgt_role',
		detils: {
			'permission': {title: 'Permission', table: 'fgt_rolepermission', form: true, headerview: 'role_name' },
		}
	}


}