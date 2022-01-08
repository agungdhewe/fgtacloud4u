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

				
				$sql = "select * from fgt_user where user_id = :user_id";
				$stmt = $this->db->prepare($sql);
				$stmt->execute([':user_id'=>$userdata->username]);
				$row  = $stmt->fetch(\PDO::FETCH_ASSOC);	


				$sql_group = "
					select 
					distinct A.group_id,
					(select group_name from fgt_group where group_id = A.group_id) as group_name
					from (
						select group_id from fgt_user where user_id = :user_id
						union
						select group_id from fgt_usergroups where user_id = :user_id
					) A				
				";
				$stmt_group = $this->db->prepare($sql_group);
				$stmt_group->execute([':user_id'=>$userdata->username]);
				$rowgroup  = $stmt_group->fetchall(\PDO::FETCH_ASSOC);	


				$this->db->commit();
				return (object)[
					'success' => true,
					'userinfo' => $row,
					'groupinfo' => $rowgroup
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


