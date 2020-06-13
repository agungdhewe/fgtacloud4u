<?php namespace FGTA4\utils;

if (!defined('FGTA4')) {
	die('Forbiden');
}

class SqlUtility {
	
	public static function BuildCriteria($criteriaparams, $rules) {
		try {
			$where_fields = [];
			$where_params = [];
			foreach ($criteriaparams as $rulekey => $value) {
				$where_params[':'.$rulekey] = $value;
				if (array_key_exists($rulekey, $rules)) {
					$where_fields[] = $rules[$rulekey];
				} else {
					throw new \Exception("Criteria untuk '$rulekey' belum didefinisikan. Cek API.");
				}
			}

			if (count($where_fields)>0) {
				$where_sql = " where (" . implode(") AND (", $where_fields) .") ";
			} else {
				$where_sql = "";
			}

			return (object) [
				'sql' => $where_sql,
				'params' => $where_params
			];
		} catch (\Exception $ex) {
			throw $ex;
		}
	}

	public static function Select($tablename, $fields, $where_sql) {
		$fieldssql = implode(', ', $fields);
		return "SELECT $fieldssql FROM $tablename $where_sql ";
	}
	

	public static function CreateSQLInsert($tablename, $obj) {
		$fields = [];
		$values = [];
		$params = [];
		foreach ($obj as $fieldname => $value) {
			$paramname = ":".$fieldname;
			array_push($fields, $fieldname);
			array_push($values, $paramname);


			if (is_bool($value)) {
				$value = $value ? 1 : 0;
			} else if ($value=='--NULL--') {
				$value = null;
			}

			$params[$paramname] = $value;
		}

		$stringfields = implode(", ", $fields);
		$stringvalues = implode(", ", $values);
		
		$sql  = " INSERT INTO $tablename \n";
		$sql .= " (" . $stringfields .") \n";
		$sql .= " VALUES \n";
		$sql .= " (" . $stringvalues .") \n";
		
		$cmd = new \stdClass;
		$cmd->sql    = $sql;
		$cmd->params = $params;

		return $cmd;		

	}

	public static function CreateSQLUpdate($tablename, $obj, $keys) {
		$keyfields = [];
		$updatefields = [];
		$params = [];
		foreach ($obj as $fieldname => $value) {
			$paramname = ":".$fieldname;
			if (property_exists($keys, $fieldname)) {
				array_push($keyfields, "$fieldname = $paramname");
			} else {
				array_push($updatefields, "$fieldname = $paramname");
			}

			if (is_bool($value)) {
				$value = $value ? 1 : 0;
			} else if ($value=='--NULL--') {
				$value = null;
			}

			$params[$paramname] = $value;
		}

		$stringupdates = implode(",\n",  $updatefields);
		$stringkeys    = implode(" AND ", $keyfields);
		
		$sql  = "UPDATE $tablename \n";
		$sql .= "SET \n";
		$sql .= $stringupdates ."\n";
		$sql .= "WHERE \n";
		$sql .= $stringkeys;

	
		$cmd = new \stdClass;
		$cmd->sql    = $sql;
		$cmd->params = $params;

		return $cmd;		
	}


	public static function CreateSQLDelete($tablename, $keys) {
		$keyfields = [];
		$params = [];

		foreach ($keys as $fieldname => $value) {
			$paramname = ":".$fieldname;
			array_push($keyfields, "$fieldname = $paramname");
			$params[$paramname] = $value;
		}

		$stringkeys    = implode(" AND ", $keyfields);
		
		$sql  = "DELETE FROM $tablename \n";
		$sql .= "WHERE \n";
		$sql .= $stringkeys;
		
		$cmd = new \stdClass;
		$cmd->sql    = $sql;
		$cmd->params = $params;

		return $cmd;	

	}


	public static function LookupRow($value, $db, $tablename, $field_id) {
		try {
			$sql = "select * from $tablename where $field_id = :value ";
			
			$stmt = $db->prepare($sql);
			$stmt->execute([
				':value' => $value
			]);
			$row  = $stmt->fetch(\PDO::FETCH_ASSOC);
			return $row;

		} catch (\Exception $ex) {
			throw $ex;
		}		
	}

	
	public static function Lookup($value, $db, $tablename, $field_id, $field_display) {
		try {
			$row = self::LookupRow($value, $db, $tablename, $field_id);
			if (is_array($row)) {
				if (array_key_exists($field_display, $row)) {
					return $row[$field_display];
				} 
			}
			return $value;
			
		} catch (\Exception $ex) {
			throw $ex;
		}
	}


	public static function WriteLog($db, $module, $tablename, $id, $action, $user_id, $logparam) {
		try {
			$rowid = '';
			$logmethod = 'CREATENEWLOG';
			if ($action=='MODIFY' || $action=='MODIFY-DETIL') {
				// apakah paling terakhir masih sama
				$sql = "SELECT * FROM xlog WHERE tablename=:tablename AND id=:id AND (action='MODIFY' or action='MODIFY-DETIL') and timestamp>DATE_ADD(NOW(), INTERVAL -15 MINUTE)  ORDER BY timestamp DESC";
				$stmt = $db->prepare($sql);
				$stmt->execute([
					':tablename' => $tablename,
					':id' => $id
				]);
				$row  = $stmt->fetch(\PDO::FETCH_ASSOC);
				if ($row!=null) {
					$rowid = $row['rowid'];
					$logmethod = 'UPDATEPREVLOG';
				} 
			} 

			if ($logmethod == 'UPDATEPREVLOG') {
				$obj = (object)[
					'rowid' => $rowid,
					'timestamp' => date("Y-m-d H:i:s")
				];
				$key = (object) ['rowid' => $rowid];
				$cmd = self::CreateSQLUpdate('xlog', $obj, $key);
			} else {
				$obj = (object)[
					'module' => $module,
					'tablename' => $tablename,
					'id' => $id,
					'action' => $action,
					'note' => property_exists($logparam, 'note') ? $logparam->note : '',
					'remoteip' => $_SERVER['REMOTE_ADDR'],
					'user_id' => $user_id,
					'rowid' => uniqid()
				];
				$cmd = self::CreateSQLInsert('xlog', $obj);
			}

			$stmt = $db->prepare($cmd->sql);
			$stmt->execute($cmd->params);			



		} catch (\Exception $ex) {
			throw $ex;
		}	
		
		// CREATE TABLE `xlog` (
		// 	`tablename` varchar(90) NOT NULL,
		// 	`id` varchar(90) NOT NULL,
		// 	`action` varchar(30) NOT NULL,
		// 	`note` varchar(255) NOT NULL,
		// 	`remoteip` varchar(15) NOT NULL,
		// 	`user_id` varchar(13) NOT NULL,
		// 	`timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
		//  `rowid` varchar(13) NOT NULL, 
		// 	KEY `idx_xlog_tablename_id` (`tablename`,`id`)
		// ) ENGINE=InnoDB DEFAULT CHARSET=latin1		
	}

}

