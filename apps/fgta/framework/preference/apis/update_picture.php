<?php namespace FGTA4\apis;

if (!defined('FGTA4')) {
	die('Forbiden');
}

require_once __ROOT_DIR.'/core/sqlutil.php';
require_once __ROOT_DIR.'/core/debug.php';
require_once __DIR__ . '/xapi.base.php';

use \FGTA4\exceptions\WebException;


$API = new class extends preferenceBase {

	public function execute($param, $files) {
		$userdata = $this->auth->session_get_user();

		try {

			$this->db->setAttribute(\PDO::ATTR_AUTOCOMMIT,0);
			$this->db->beginTransaction();



			try {

				$profile_dir = __LOCALDB_DIR . '/userprofiles';
				if (!\is_dir($profile_dir)) {
					\mkdir($profile_dir);
				}

				$fieldname = 'profile_picture';	
				if (property_exists($files, $fieldname)) {

					$file_id = $userdata->username;
					$doc = $files->{$fieldname};
					// $file_base64data = $doc->data;
					// unset($doc->data);

					$filepath = $profile_dir . '/' . $file_id . '.json';
					$fp = fopen($filepath, 'w');
					fwrite($fp, json_encode($doc));
					fclose($fp);

					// $overwrite = true;
					// $res = $this->cdb->addAttachment($file_id, $doc, 'filedata', $file_base64data, $overwrite);	
					// $rev = $res->asObject()->rev;

					// $key->{$primarykey} = $obj->{$primarykey};
					
					// $obj = new \stdClass;
					// $obj->{$primarykey} = $key->{$primarykey};
					// $obj->merchitem_picture = $rev;
					// $cmd = \FGTA4\utils\SqlUtility::CreateSQLUpdate($tablename, $obj, $key);
					// $stmt = $this->db->prepare($cmd->sql);
					// $stmt->execute($cmd->params);
				}				


				$this->db->commit();
				return (object)[
					'success' => true,

				];
			} catch (\Exception $ex) {
				$this->db->rollBack();
				throw $ex;
			} finally {
				$this->db->setAttribute(\PDO::ATTR_AUTOCOMMIT,1);
			}


		} catch (\Exception $ex) {
			throw $ex;
		}
	}


};


