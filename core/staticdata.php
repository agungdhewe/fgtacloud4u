<?php namespace FGTA4\utils;

class StaticData {
	public static function get($id, $name, $key) {
		global $GLOBALS;
		
		// cek apakah ada static data
		if (!array_key_exists('STATICDATA', $GLOBALS)) {
			return '--null--';
		}

		$STATICDATA =  $GLOBALS['STATICDATA'];
		if (array_key_exists($name, $STATICDATA)) {
			$data = $STATICDATA[$name];
			if (array_key_exists($id, $data)) {
				$row = $data[$id];
				if (array_key_exists($key, $row)) {
					return $row[$key];
				} else {
					return $id;
				}
			} else {
				return '--null--';
			}
		} else {
			return '--null--';
		}
	}

	public static function data($name, $idname) {
		global $GLOBALS;

		// cek apakah ada static data
		if (!array_key_exists('STATICDATA', $GLOBALS)) {
			return '--null--';
		}

		$STATICDATA = $GLOBALS['STATICDATA'];
		if (array_key_exists($name, $STATICDATA)) {
			$data = $STATICDATA[$name];
			$records = array();
			foreach ($data as $id=>$row) {
				$record = array();
				$record[$idname] = $id;
				foreach ($row as $fieldname => $value) {
					$record[$fieldname] = $value;
				}
				$records[] = $record;
			}
			return $records;
		} else {
			return [];
		}
	}
}