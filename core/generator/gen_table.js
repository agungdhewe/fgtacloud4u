'use strict'


const path = require('path')
const fs = require('fs')

const dbtype = global.dbtype;
const comp = global.comp;


const colReset = "\x1b[0m"
const colFgRed = "\x1b[31m"
const colFgGreen = "\x1b[32m"
const colFgYellow = "\x1b[33m"
const colFgBlack = "\x1b[30m"
const colBright = "\x1b[1m"
const BgYellow = "\x1b[43m"

const field_props = ['type', 'null', 'default', 'comp', 'reference', 'uppercase', 'lowercase', 'text', 'caption', 'section', 'suppresslist', 'options', 'unset', 'tips', 'tipstype', 'initialvalue', 'hidden', 'lookup', 'idsuffix']
const detil_props = ['table', 'form', 'headerview', 'title', 'isapprovalform']


module.exports = async (fsd, genconfig) => {
	var dbtype = genconfig.dbtype
	var comp = genconfig.comp


	var headertable_name = genconfig.schema.header
	var headertable = genconfig.persistent[headertable_name]
	var headerprimarykey = headertable.primarykeys[0]
	
	var script = '-- SET FOREIGN_KEY_CHECKS=0;'
	try {
		console.log(`-----------------------------------------------`)
		console.log(`Generate DDL...`)
		// var headertable_keys = {}
		// var headertable_name = genconfig.schema.header

		script += "\r\n\r\n";
		for (var tablename in  genconfig.persistent) {
			script += `-- drop table if exists \`${tablename}\`;\r\n`;
		}
		script += "\r\n\r\n";

		for (var tablename in  genconfig.persistent) {
			// if (tablename==headertable_name) {
			// 	var headertable_fields = genconfig.persistent[headertable_name].data
			// 	headertable_fields['_createby'] = {type: dbtype.varchar(13), null:false}
			// 	headertable_fields['_createdate'] = {type: dbtype.datetime, null:false, default:'current_timestamp()', comp: comp.Textbox()}
			// 	headertable_fields['_modifyby'] = {type: dbtype.varchar(13)}
			// 	headertable_fields['_modifydate'] = {type: dbtype.datetime, comp: comp.Textbox()}				
			// }

			var fields = genconfig.persistent[tablename].data
			fields['_createby'] = {type: dbtype.varchar(13), null:false}
			fields['_createdate'] = {type: dbtype.datetime, null:false, default:'current_timestamp()', comp: comp.Textbox()}
			fields['_modifyby'] = {type: dbtype.varchar(13)}
			fields['_modifydate'] = {type: dbtype.datetime, comp: comp.Textbox()}



			genconfig.persistent[tablename].keys = {}
			script += await CreateTableScript(tablename, genconfig.persistent[tablename], headertable_name, headerprimarykey)
			script += '\r\n\r\n\r\n'
		}

		

		var childtable = {}
		for (var detilname in genconfig.schema.detils) {

			if (genconfig.schema.detils[detilname].table!==undefined) {
				var detiltable = genconfig.schema.detils[detilname].table
				if (genconfig.persistent[detiltable]===undefined) {
					throw `detil '${colFgYellow}${detilname}${colReset}' belum didefinisikan di persistent`
				}

				for (var propname in genconfig.schema.detils[detilname]) {
					if (!detil_props.includes(propname)) {
						throw `Property '${colFgYellow}${propname}${colReset}' pada detil '${detilname}' tidak dikenal`
					}
				}

				childtable[detiltable] = genconfig.persistent[detiltable]
			}
		}

		// cek apakah primary key sudah ada di masing-masing table detil
		// for (var key of genconfig.persistent[headertable_name].primarykeys) {
		// 	for (var tablename in childtable) {
		// 		if (childtable[tablename].keys[key]===undefined) {
		// 			throw `table '${colFgYellow}${tablename}${colReset}' tidak punya key ${key} yang merefernsi ke table ${headertable_name}`
		// 		}
		// 		var dbtype_header = genconfig.persistent[headertable_name].data[key].type.name
		// 		var dbtype_detil = childtable[tablename].keys[key].type.name

		// 		if (dbtype_detil!=dbtype_header) {
		// 			throw `tipe data '${tablename}.${colFgYellow}${key}${colReset}' (${dbtype_detil}) berbeda dengan table ${headertable_name}.${key} (${dbtype_header})`
		// 		}

		// 	}
		// }




		fsd.script = script
	} catch (err) {
		throw err
	}
}


function FieldName(fieldname) {
	return '`' + fieldname + '`'
}


async function CreateTableScript(tablename, options, headertable_name, headerprimarykey) {
	try {
		var primarykeys = options.primarykeys
		var comment = options.comment === undefined ? '' : options.comment
		for(var key of primarykeys) {
			if (options.data[key]===undefined) {
				throw `Primary Key '${colFgYellow}${key}${colReset}' belum didefinisikan di table '${colBright}${tablename}${colReset}'.`
			}
			options.keys[key] = options.data[key] 
		}

		var fks = [];

		var ddl_keys = ''
		var ddl_constraint = ''
		var ddl_fields = ''
		for (var fieldname in options.data) {
			var field = options.data[fieldname]
			console.log(`${tablename} ${fieldname}`)
			for (var propname in field) {
				if (!field_props.includes(propname)) {
					throw `table: '${tablename}', property '${colFgYellow}${propname}${colReset}' pada field '${colBright}${fieldname}${colReset}' tidak dikenal!`
				}
			}

			if (field.type===undefined) {
				throw `${colBright}dbtype${colReset} untuk field '${colFgYellow}${fieldname}${colReset}' belum didefinisikan dengan benar.`
			}
			// console.log(field)

			var field_def = `${FieldName(fieldname)} ${field.type.name} ${field.null===false ? 'NOT NULL' : ''} ${field.default!==undefined? 'DEFAULT ' + field.default : ''}`
			ddl_fields += `	${field_def}, \r\n`
			// ddl_fields.push(field_def)
			// console.log(field_def)


			// if (fieldname=='deptgroup_level') {
			// 	console.log(options.data[fieldname].type.defcomp);
			// }

			// console.log(options.data[fieldname])
			// // Buat Reference
			var comp = options.data[fieldname].type.defcomp
			if (options.data[fieldname].comp!==undefined) {
				comp = options.data[fieldname].comp
			}

			var comptype = comp.comptype
			if (comptype=='combo') {
				var opt = comp.options
				var fkname = "fk_" + tablename + "_" + opt.table ;
				var usefkname = fkname;
				//console.log(options)
				// 	// ${options.table}', '${options.field_value}', '${options.field_display}
				if (fks[fkname]==null) {
					fks[fkname] = 1
				} else {
					fks[fkname]++;
					usefkname = fkname + '_' + fks[fkname];
				}

				ddl_keys += "ALTER TABLE `"+ tablename +"` ADD KEY `"+fieldname+"` (`"+fieldname+"`);\r\n"
				ddl_constraint += "ALTER TABLE `"+ tablename +"` ADD CONSTRAINT `"+ usefkname +"` FOREIGN KEY (`"+fieldname+"`) REFERENCES `" + opt.table + "` (`" + opt.field_value + "`);\r\n"
			} else {

				var reference = options.data[fieldname].reference
				if (reference!=undefined) {
					var ref_table = reference.table
					var ref_field_value = reference.field_value
					var fkname = "fk_" + tablename + "_" + ref_table ;
					var usefkname = fkname;
					if (fks[fkname]==null) {
						fks[fkname] = 1
					} else {
						fks[fkname]++;
						usefkname = fkname + '_' + fks[fkname];
					}

					ddl_keys += "ALTER TABLE `"+ tablename +"` ADD KEY `"+fieldname+"` (`"+fieldname+"`);\r\n"
					ddl_constraint += "ALTER TABLE `"+ tablename +"` ADD CONSTRAINT `"+ usefkname +"` FOREIGN KEY (`"+fieldname+"`) REFERENCES `" +ref_table + "` (`" + ref_field_value + "`);\r\n"
				}


			}


			if (headertable_name!=tablename) {
				if (fieldname==headerprimarykey) {
					ddl_keys += "ALTER TABLE `"+ tablename +"` ADD KEY `"+fieldname+"` (`"+fieldname+"`);\r\n"
					ddl_constraint += "ALTER TABLE `"+ tablename +"` ADD CONSTRAINT `fk_" + tablename + "_" + headertable_name + "` FOREIGN KEY (`"+fieldname+"`) REFERENCES `" + headertable_name + "` (`" + headerprimarykey + "`);\r\n"

				}
			}

		}	

		var sql = `CREATE TABLE \`${tablename}\` (\r\n`
		sql += ddl_fields

		// uniques
		for (var uniquekeyname in options.uniques) {
			var uniquefields = options.uniques[uniquekeyname]
			sql += '	UNIQUE KEY `' + uniquekeyname + '` (`' + uniquefields.join('`, `') + '`),\r\n'
		}

		sql += '	PRIMARY KEY (`' + primarykeys.join('`, `') + '`)\r\n'
		sql += ') \r\n'
		sql += 'ENGINE=InnoDB\r\n'
		sql += `COMMENT='${comment}';\r\n\r\n`

		sql += ddl_keys
		sql += "\r\n"
		sql += ddl_constraint
		sql += "\r\n\r\n"


		if (options.values==null) { options.values = [] }
	
		for (var row of  options.values) {

			row['_createby'] = 'root'
			row['_createdate'] = 'NOW()'

			var cols = []
			var vals = []
			for (var colname in row) {
				cols.push(colname)

				if (colname=='_createdate') {
					vals.push('NOW()')
				} else {
					if (row[colname]==null) {
						vals.push(`null`)
					} else {
						vals.push(`'${row[colname]}'`)
					}
				}
			}


			var insql = 'INSERT INTO ' + tablename + ' (`'
			insql += cols.join('`, `')
			insql += "`) VALUES ("
			insql += vals.join(', ')
			insql += ");"

			sql += insql
			sql += "\r\n"
		}

		

		return sql
	} catch (err) {
		throw err
	}
}




    // CREATE TABLE `fgt_formdev` (
	// 	`id` varchar(30) NOT NULL,
	// 	`nama` varchar(90) NOT NULL,
	// 	`alamat` varchar(255) NOT NULL,
	// 	`disabled` tinyint(1) NOT NULL DEFAULT 1,
	// 	`tanggal` date NOT NULL,
	// 	`gender` varchar(1) NOT NULL,
	// 	`_createby` varchar(30) DEFAULT NULL,
	// 	`_createdate` datetime NOT NULL DEFAULT current_timestamp(),
	// 	`_modifyby` varchar(30) DEFAULT NULL,
	// 	`_modifydate` datetime DEFAULT NULL,
	// 	PRIMARY KEY (`id`)
	//    ) ENGINE=InnoDB DEFAULT CHARSET=latin1
	