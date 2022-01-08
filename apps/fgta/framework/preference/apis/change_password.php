<?php namespace FGTA4\apis;

if (!defined('FGTA4')) {
	die('Forbiden');
}

require_once __ROOT_DIR.'/core/sqlutil.php';
require_once __ROOT_DIR.'/core/debug.php';
require_once __DIR__ . '/xapi.base.php';

use \FGTA4\exceptions\WebException;


$API = new class extends preferenceBase {

	public function execute($param) {
		$userdata = $this->auth->session_get_user();

		try {

			$this->db->setAttribute(\PDO::ATTR_AUTOCOMMIT,0);
			$this->db->beginTransaction();

			try {

				$password_new = $param->newpassword;
				$password_previous = $param->prevpassword;

				/* cek apakah password lama sama */
				$sql = "select * from fgt_user where user_id = :user_id and user_password = :user_password ";
				$stmt = $this->db->prepare($sql);
				$stmt->execute([':user_id'=>$userdata->username, ':user_password'=>md5($password_previous) ]);
				$rows  = $stmt->fetchall(\PDO::FETCH_ASSOC);	
				if (count($rows)==0) {
					throw new \Exception('Password lama salah');
				}


				$sql_update = "
					update fgt_user
					set 
					user_password = :user_password
					where
					user_id = :user_id
				";
				$stmt_update = $this->db->prepare($sql_update);
				$stmt_update->execute([':user_id'=>$userdata->username, ':user_password'=>md5($password_new) ]);


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


