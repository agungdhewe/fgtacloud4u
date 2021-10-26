<?php namespace FGTA4\apis;

if (!defined('FGTA4')) {
	die('Forbiden');
}


require_once __ROOT_DIR.'/core/sqlutil.php';
require_once __DIR__ . '/xapi.base.php';


use \FGTA4\exceptions\WebException;


/**
 * fgta/example/fgpage/apis/delete.php
 *
 * ======
 * Delete
 * ======
 * Menghapus satu baris data/record berdasarkan PrimaryKey
 * pada tabel header fgpage (mst_paymtype)
 *
 * Agung Nugroho <agung@fgta.net> http://www.fgta.net
 * Tangerang, 26 Maret 2021
 *
 * digenerate dengan FGTA4 generator
 * tanggal 21/10/2021
 */
$API = new class extends fgpageBase {
	
	public function execute($data, $options) {
		$tablename = 'mst_paymtype';
		$primarykey = 'paymtype_id';

		$userdata = $this->auth->session_get_user();

		try {

			// cek apakah user boleh mengeksekusi API ini
			if (!$this->RequestIsAllowedFor($this->reqinfo, "delete", $userdata->groups)) {
				throw new \Exception('your group authority is not allowed to do this action.');
			}

			$result = new \stdClass; 
			
			$key = new \stdClass;
			$key->{$primarykey} = $data->{$primarykey};

			$this->db->setAttribute(\PDO::ATTR_AUTOCOMMIT,0);
			$this->db->beginTransaction();

			try {
				
				$tabletodelete = ['mst_paymtype', 'mst_paymtype', 'mst_paymtype'];
				foreach ($tabletodelete as $reftablename) {
					$cmd = \FGTA4\utils\SqlUtility::CreateSQLDelete($reftablename, $key);
					$stmt = $this->db->prepare($cmd->sql);
					$stmt->execute($cmd->params);
				}
		
				$cmd = \FGTA4\utils\SqlUtility::CreateSQLDelete($tablename, $key);
				$stmt = $this->db->prepare($cmd->sql);
				$stmt->execute($cmd->params);

				\FGTA4\utils\SqlUtility::WriteLog($this->db, $this->reqinfo->modulefullname, $tablename, $key->{$primarykey}, 'DELETE', $userdata->username, (object)[]);

				$this->db->commit();

				$result->success = true;
			} catch (\Exception $ex) {
				$result->success = false;
				$this->db->rollBack();
				throw $ex;
			} finally {
				$this->db->setAttribute(\PDO::ATTR_AUTOCOMMIT,1);
			}			

			return $result;
		} catch (\Exception $ex) {
			throw $ex;
		}
	}

};