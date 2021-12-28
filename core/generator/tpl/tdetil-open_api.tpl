<?php namespace FGTA4\apis;

if (!defined('FGTA4')) {
	die('Forbiden');
}

require_once __ROOT_DIR.'/core/sqlutil.php';
require_once __DIR__ . '/xapi.base.php';

if (is_file(__DIR__ .'/data-{__DETILNAME__}-handler.php')) {
	require_once __DIR__ .'/data-{__DETILNAME__}-handler.php';
}


use \FGTA4\exceptions\WebException;



/**
 * {__MODULEPROG__}
 *
 * ==========
 * Detil-Open
 * ==========
 * Menampilkan satu baris data/record sesuai PrimaryKey,
 * dari tabel {__DETILNAME__}} {__BASENAME__} ({__TABLENAME__})
 *
 * Agung Nugroho <agung@fgta.net> http://www.fgta.net
 * Tangerang, 26 Maret 2021
 *
 * digenerate dengan FGTA4 generator
 * tanggal {__GENDATE__}
 */
$API = new class extends {__BASENAME__}Base {

	public function execute($options) {
		$tablename = '/*{__TABLENAME__}*/';
		$primarykey = '/*{__PRIMARYID__}*/';
		$userdata = $this->auth->session_get_user();
		

		$handlerclassname = "\\FGTA4\\apis\\{__BASENAME__}_{__DETILNAME__}Handler";
		if (class_exists($handlerclassname)) {
			$hnd = new {__BASENAME__}_{__DETILNAME__}Handler($data, $options);
			$hnd->caller = $this;
			$hnd->db = $this->db;
			$hnd->auth = $this->auth;
			$hnd->reqinfo = $reqinfo->reqinfo;
		} else {
			$hnd = new \stdClass;
		}

		try {
			$result = new \stdClass; 
			
			$where = \FGTA4\utils\SqlUtility::BuildCriteria(
				$options->criteria,
				[
					"<!--__PRIMARYID__-->" => " <!--__PRIMARYID__--> = :<!--__PRIMARYID__--> "
				]
			);

			$sql = \FGTA4\utils\SqlUtility::Select('/*{__TABLENAME__}*/ A', [
				/*{__FIELDS__}*/ 
			], $where->sql);

			$stmt = $this->db->prepare($sql);
			$stmt->execute($where->params);
			$row  = $stmt->fetch(\PDO::FETCH_ASSOC);

			$record = [];
			foreach ($row as $key => $value) {
				$record[$key] = $value;
			}

			$result->record = array_merge($record, [
/*{__TOJSDATE__}*/					
				// // jikalau ingin menambah atau edit field di result record, dapat dilakukan sesuai contoh sbb: 
				// 'tambahan' => 'dta',
				//'tanggal' => date("d/m/Y", strtotime($record['tanggal'])),
				//'gendername' => $record['gender']

/*{__LOOKUPFIELDS__}*/				
				'_createby' => \FGTA4\utils\SqlUtility::Lookup($record['_createby'], $this->db, $GLOBALS['MAIN_USERTABLE'], 'user_id', 'user_fullname'),
				'_modifyby' => \FGTA4\utils\SqlUtility::Lookup($record['_modifyby'], $this->db, $GLOBALS['MAIN_USERTABLE'], 'user_id', 'user_fullname'),
			]);


			if (is_object($hnd)) {
				if (method_exists(get_class($hnd), 'DataOpen')) {
					$hnd->DataOpen($result->record);
				}
			}

			// $date = DateTime::createFromFormat('d/m/Y', "24/04/2012");
			// echo $date->format('Y-m-d');

/*{__OPENFROMCOUCH__}*/	

			return $result;
		} catch (\Exception $ex) {
			throw $ex;
		}
	}

};