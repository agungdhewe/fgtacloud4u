<?php namespace FGTA4\utils;

if (!defined('FGTA4')) {
	die('Forbiden');
}

class SqlUtility {
	
	static $MONTHS = [1=>'JAN','FEB','MAR','APR','MEI','JUN','JUL','AGS','SEP','OKT','NOV','DES'];

	public static function BuildCriteria($criteriaparams, $rules) {
		try {
			$where_fields = [];
			$where_params = [];
			foreach ($criteriaparams as $rulekey => $value) {
				if (array_key_exists($rulekey, $rules)) {
					if ($rules[$rulekey]=='--') {
						$where_params[':'.$rulekey] = $value;
					} else if ($rules[$rulekey]!='') {
						$where_fields[] = $rules[$rulekey];
						$varname = ":$rulekey"; 
						if(strpos($rules[$rulekey], $varname) !== false){
							$where_params[':'.$rulekey] = $value;
						}
					}
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
		$arrfields = array();
		foreach ($fields as $f) {
			if (\is_string($f)) {
				$arrfields[] = '`'.$f.'`';
			} else if (\is_array($f)) {
				$arrfields[] = $f[0];
			}
		}
		$fieldssql = implode(', ', $arrfields);
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
			} else if (is_numeric($value)) {
				$value = $value ? $value : 0;
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
			} else if ($value === '--NULL--' ) {
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


	public static function LookupRow($value, $db, $tablename, $field_id=null) {
		try {
			if (is_object($value)) {
				$keyfields = [];
				$params = [];
				foreach ($value as $fieldparamname => $fieldvalue) {
					$sqlparamname = ":".$fieldparamname;
					array_push($keyfields, "$fieldparamname = $sqlparamname");
					$params[$sqlparamname] = $fieldvalue;
				}
				$stringkeys    = implode(" AND ", $keyfields);
				$sql = "select * from $tablename where $stringkeys";
				$stmt = $db->prepare($sql);
				$stmt->execute($params);
			} else {
				$sql = "select * from $tablename where $field_id = :value ";
				$stmt = $db->prepare($sql);
				$stmt->execute([
					':value' => $value
				]);
			}
			$row  = $stmt->fetch(\PDO::FETCH_ASSOC);
			return $row;
		} catch (\Exception $ex) {
			throw $ex;
		}		
	}

	
	public static function Lookup($value, $db, $tablename, $field_id, $field_display, $valueifnull='NONE') {
		try {
			$row = self::LookupRow($value, $db, $tablename, $field_id);
			if (is_array($row)) {
				if (array_key_exists($field_display, $row)) {
					return $row[$field_display];
				} else {
					throw new \Exception("kolom $field_display tidak ditemukan pada  $tablename");
				}
			} else {
				if ($value==null || $value=='--NULL--') {
					return $valueifnull;
				} else {
					return  "## DATA BROKEN ### ($value)";
				}
			}
			
		} catch (\Exception $ex) {
			throw $ex;
		}
	}


	public static function WriteLog($db, $module, $tablename, $id, $action, $user_id, $logparam) {
		try {
			$rowid = '';
			$logmethod = 'CREATENEWLOG';
			$interval15 = property_exists($logparam, 'interval15') ? $logparam->interval15 : false;
			if ($action=='MODIFY' || $action=='MODIFY-DETIL' || $interval15) {
				// apakah paling terakhir masih sama
				if ($interval15) {
					$sql = "SELECT * FROM xlog WHERE tablename=:tablename AND id=:id AND (action='$action') and timestamp>DATE_ADD(NOW(), INTERVAL -15 MINUTE)  ORDER BY timestamp DESC";
				} else {
					$sql = "SELECT * FROM xlog WHERE tablename=:tablename AND id=:id AND (action='MODIFY' or action='MODIFY-DETIL') and timestamp>DATE_ADD(NOW(), INTERVAL -15 MINUTE)  ORDER BY timestamp DESC";
				}
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
					'timestamp' => date("Y-m-d H:i:s"),
					'note' => property_exists($logparam, 'note') ? $logparam->note : '',
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
					'remoteip' => array_key_exists('REMOTE_ADDR', $_SERVER) ? $_SERVER['REMOTE_ADDR'] : '-',
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


	public static function setDefaultCriteria(&$criteria, $name, $defaultvalue) {
		if (!\property_exists($criteria, $name)) {
			$criteria->{$name} = $defaultvalue;
		}
	}

	public static function getMonthName($mo) {
		return self::$MONTHS[$mo];
	}

}

