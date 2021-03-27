<?php namespace FGTA4\apis;

if (!defined('FGTA4')) {
	die('Forbiden');
}


require_once __ROOT_DIR.'/core/sqlutil.php';
require_once __ROOT_DIR.'/core/debug.php';
/*--__APPROVALREQUIRE__--*/
require_once __DIR__ . '/xapi.base.php';

use \FGTA4\exceptions\WebException;
/*--__APPROVALUSE__--*/
use \FGTA4\StandartApproval;



/**
 * {__MODULEPROG__}
 *
 * ========
 * UnCommit
 * ========
 * UnCommit dokumen, mengembalikan status dokumen ke draft 
 *
 * Agung Nugroho <agung@fgta.net> http://www.fgta.net
 * Tangerang, 26 Maret 2021
 *
 * digenerate dengan FGTA4 generator
 * tanggal {__GENDATE__}
 */
$API = new class extends {__BASENAME__}Base {

	public function execute($id, $param) {
		$tablename = '/*{__TABLENAME__}*/';
		$primarykey = '/*{__PRIMARYID__}*/';
		$userdata = $this->auth->session_get_user();

		try {
			$currentdata = (object)[
				'header' => $this->get_header_row($id),
				'user' => $userdata
			];

			$this->pre_action_check($currentdata, 'uncommit');
/*--__APPROVALEXECUTE__--*/
			$this->save_and_set_uncommit_flag($id, $currentdata);


			$record = []; $row = $this->get_header_row($id);
			foreach ($row as $key => $value) { $record[$key] = $value; }
			$dataresponse = (object) array_merge($record, [
				//  untuk lookup atau modify response ditaruh disini
/*{__LOOKUPFIELD__}*/
				'_createby' => \FGTA4\utils\SqlUtility::Lookup($record['_createby'], $this->db, $GLOBALS['MAIN_USERTABLE'], 'user_id', 'user_fullname'),
				'_modifyby' => \FGTA4\utils\SqlUtility::Lookup($record['_modifyby'], $this->db, $GLOBALS['MAIN_USERTABLE'], 'user_id', 'user_fullname'),
			]);

			return (object)[
				'success' => true,
				'version' => $currentdata->header->{$this->main_field_version},
				'dataresponse' => $dataresponse
			];
		} catch (\Exception $ex) {
			throw $ex;
		}
	}

/*--__APPROVALFUNCTION__--*/

	public function save_and_set_uncommit_flag($id, $currentdata) {
		$currentdata->header->{$this->main_field_version}++;
		try {
			$sql = " 
				update $this->main_tablename
				set 
				$this->field_iscommit = 0,
				$this->field_commitby = null,
				$this->field_commitdate = null,
				$this->main_field_version = :version
				where
				$this->main_primarykey = :id
			";

			$stmt = $this->db->prepare($sql);
			$stmt->execute([
				":id" => $currentdata->header->{$this->main_primarykey},
				":version" => $currentdata->header->{$this->main_field_version}
			]);

		} catch (\Exception $ex) {
			throw $ex;
		}	
	}	
};


