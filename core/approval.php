<?php
namespace FGTA4;

require_once __ROOT_DIR.'/core/debug.php';

use \FGTA4\debug;

class StandartApproval {

	static function getUserApprovalData($db, $param) {
		$id = $param->approvalsource['id'];
		$userdata = $param->approvalsource['userdata'];
		$tablename_head = $param->approvalsource['tablename_head'];
		$tablename_appr = $param->approvalsource['tablename_appr'];
		$field_id = $param->approvalsource['field_id'];
		$field_id_detil = $param->approvalsource['field_id_detil'];
		$flag_appr = $param->approvalsource['flag_appr'];

		try {
			$sql = "
				select
				D.$field_id_detil, D.docauth_order
				from (
									
					select 
					A.$field_id_detil, A.docauth_order 
					from $tablename_appr A where 
						A.$field_id = :field_id
					and A.auth_id IN (
						select auth_id from mst_auth where empl_id = (select empl_id from mst_empluser where user_id = :user_id)
					)
					
					UNION 
					
					select 
					A.$field_id_detil, A.docauth_order
					from $tablename_appr A inner join $tablename_head B on B.$field_id = A.$field_id 
					where 
						A.$field_id = :field_id
					and A.auth_id is null
					and A.authlevel_id  IN (
						select authlevel_id from mst_auth where empl_id = (select empl_id from mst_empluser where user_id = :user_id)
					)
					and B.dept_id = (select dept_id from mst_empl where empl_isdisabled = 0 and empl_id = (select empl_id from mst_empluser where user_id = :user_id))
				) D
				order by D.docauth_order
		
			";


			$sqlparam = [
				':field_id' => $id,
				':user_id' => $userdata->username
			];

			$stmt = $db->prepare($sql);
			$stmt->execute($sqlparam);
			$rows = $stmt->fetchall(\PDO::FETCH_ASSOC);	
			
			return $rows;
		} catch (\Exception $ex) {
			throw $ex;
		}		
	}


	static function getDownlinePendingApprovalData($db, $param) {
		$id = $param->approvalsource['id'];
		$userdata = $param->approvalsource['userdata'];
		$tablename_head = $param->approvalsource['tablename_head'];
		$tablename_appr = $param->approvalsource['tablename_appr'];
		$field_id = $param->approvalsource['field_id'];
		$field_id_detil = $param->approvalsource['field_id_detil'];
		$flag_appr = $param->approvalsource['flag_appr'];


		try {
			$sql = "
				select count(*) as pending_approve
				from $tablename_appr
				where
					$field_id = :field_id
				and $flag_appr = 0	
				and docauth_order < (
									
					select
					D.docauth_order
					from (
										
						select 
						A.docauth_order 
						from $tablename_appr A where 
							A.$field_id = :field_id
						and A.auth_id IN (
							select auth_id from mst_auth where empl_id = (select empl_id from mst_empluser where user_id = :user_id)
						)
						
						UNION 
						
						select 
						A.docauth_order
						from $tablename_appr A inner join $tablename_head B on B.$field_id = A.$field_id 
						where 
							A.$field_id = :field_id
						and A.auth_id is null
						and A.authlevel_id  IN (
							select authlevel_id from mst_auth where empl_id = (select empl_id from mst_empluser where user_id = :user_id)
						)
						and B.dept_id = (select dept_id from mst_empl where empl_isdisabled = 0 and empl_id = (select empl_id from mst_empluser where user_id = :user_id))
					) D
					order by D.docauth_order
					limit 1
					
				)
			";

			$sqlparam = [
				':field_id' => $id,
				':user_id' => $userdata->username
			];
			$stmt = $db->prepare($sql);
			$stmt->execute($sqlparam);
			$rows = $stmt->fetchall(\PDO::FETCH_ASSOC);	

			return $rows;
			// if (count($rows)==0) {
			// 	throw new \Exception("Tidak bisa approve/decline document '$id', cek fail.");
			// }

			// $pending_approve = $rows[0]['pending_approve'];
			// return $pending_approve;		

		} catch (\Exception $ex) {
			throw $ex;
		}
	}

	static function Approve($db, $param) {

		$id = $param->approvalsource['id'];
		$userdata = $param->approvalsource['userdata'];
		$tablename_head = $param->approvalsource['tablename_head'];
		$tablename_appr = $param->approvalsource['tablename_appr'];
		$field_id = $param->approvalsource['field_id'];
		$field_id_detil = $param->approvalsource['field_id_detil'];
		$flag_appr = $param->approvalsource['flag_appr'];
		$appr_by = $param->approvalsource['appr_by'];
		$appr_date = $param->approvalsource['appr_date'];
		$flag_decl = $param->approvalsource['flag_decl'];
		$decl_by = $param->approvalsource['decl_by'];
		$decl_date = $param->approvalsource['decl_date'];
		$notes = $param->approvalsource['notes'];
		$approval_note = $param->approval_note;

		try {
			$sql = "
				update $tablename_appr
				set
				$flag_appr = 1,
				$appr_by = :user_id,
				$appr_date = :date,
				$flag_decl = 0,
				$decl_by = null,
				$decl_date = null,
				$notes = :notes
				where
				$field_id_detil = :id	
			";
			$stmt = $db->prepare($sql);

			debug::log('approve');
			$rows = self::getUserApprovalData($db, $param);
			try {
				$db->setAttribute(\PDO::ATTR_AUTOCOMMIT,0);
				$db->beginTransaction();
				foreach ($rows as $row) {
					$stmt->execute([
						':id' => $row[$field_id_detil],
						':user_id' => $userdata->username,
						':date' => date("Y-m-d H:i:s"),
						':notes' => $approval_note 						
					]);
				}

				self::DoFinalApproval($db, $param);
				$db->commit();
			} catch (\Exception $ex) {
				$db->rollBack();
				throw $ex;
			} finally {
				$db->setAttribute(\PDO::ATTR_AUTOCOMMIT,1);
			}

		} catch (\Exception $ex) {
			throw $ex;
		}
	}

	static function Decline($db, $param) {
		$id = $param->approvalsource['id'];
		$userdata = $param->approvalsource['userdata'];
		$tablename_head = $param->approvalsource['tablename_head'];
		$tablename_appr = $param->approvalsource['tablename_appr'];
		$field_id = $param->approvalsource['field_id'];
		$field_id_detil = $param->approvalsource['field_id_detil'];
		$flag_appr = $param->approvalsource['flag_appr'];
		$appr_by = $param->approvalsource['appr_by'];
		$appr_date = $param->approvalsource['appr_date'];
		$flag_decl = $param->approvalsource['flag_decl'];
		$decl_by = $param->approvalsource['decl_by'];
		$decl_date = $param->approvalsource['decl_date'];
		$notes = $param->approvalsource['notes'];
		$approval_note = $param->approval_note;

		try {
			$sql = "
				update $tablename_appr
				set
				$flag_appr = 0,
				$appr_by = null,
				$appr_date = null,
				$flag_decl = 1,
				$decl_by = :user_id,
				$decl_date = :date,
				$notes = :notes
				where
				$field_id_detil = :id	
			";
			$stmt = $db->prepare($sql);

			debug::log('decline');
			$rows = self::getUserApprovalData($db, $param);
			try {
				$db->setAttribute(\PDO::ATTR_AUTOCOMMIT,0);
				$db->beginTransaction();
				foreach ($rows as $row) {
					$stmt->execute([
						':id' => $row[$field_id_detil],
						':user_id' => $userdata->username,
						':date' => date("Y-m-d H:i:s"),
						':notes' => $approval_note 						
					]);
				}

				self::DoFinalApproval($db, $param);
				$db->commit();
			} catch (\Exception $ex) {
				$db->rollBack();
				throw $ex;
			} finally {
				$db->setAttribute(\PDO::ATTR_AUTOCOMMIT,1);
			}

		} catch (\Exception $ex) {
			throw $ex;
		}
	}


	static function DoFinalApproval($db, $param) {
		$id = $param->approvalsource['id'];
		$userdata = $param->approvalsource['userdata'];
		$tablename_head = $param->approvalsource['tablename_head'];
		$tablename_appr = $param->approvalsource['tablename_appr'];
		$field_id = $param->approvalsource['field_id'];
		$field_id_detil = $param->approvalsource['field_id_detil'];
		$flag_head = $param->approvalsource['flag_head'];
		$flag_appr = $param->approvalsource['flag_appr'];
		$flag_decl = $param->approvalsource['flag_decl'];

		try {

			// cek apakah sudah approve semua
			$sql = "
				select 
				count(*) as task,
				(select count(*) from $tablename_appr where $field_id = :field_id and $flag_appr=1) as completed
				from $tablename_appr 
				where 
				$field_id = :field_id		
			";
			$stmt = $db->prepare($sql);
			$stmt->execute([
				':field_id' => $id,
			]);
			$rows = $stmt->fetchall(\PDO::FETCH_ASSOC);	
			if (count($rows)==0) {
				throw new \Exception("Tidak ada data approval di '$id'");
			}


			$task = $rows[0]['task'];
			$completed = $rows[0]['completed'];
			$sql = "
				update $tablename_head
				set
				$flag_head = :approved
				where
				$field_id = :field_id
			";
			$stmt = $db->prepare($sql);
			if ($completed==$task) {
				$stmt->execute([
					':field_id' => $id,
					':approved' => 1
				]);
			} else {
				$stmt->execute([
					':field_id' => $id,
					':approved' => 0
				]);
			}

		} catch (\Exception $ex) {
			throw $ex;
		}
	}


	static function CheckAuthoriryToApprove($db, $param) {
		$id = $param->approvalsource['id'];
		try {
			$rows = self::getUserApprovalData($db, $param);
			if (count($rows)==0) {
				throw new \Exception("Tidak ada otoritas untuk approve/decline document '$id'");
			}

		} catch (\Exception $ex) {
			throw $ex;
		}
	}

	static function CheckPendingApproval($db, $param) {

		$id = $param->approvalsource['id'];

		try {
			$rows = self::getDownlinePendingApprovalData($db, $param);	
			if (count($rows)==0) {
				throw new \Exception("Tidak bisa approve/decline document '$id', cek fail.");
			}
			$pending_approve = $rows[0]['pending_approve'];
			if ($pending_approve>0) {
				throw new \Exception("Tidak bisa approve/decline document '$id', masih ada authorisasi sebelumnya di dokumen ini yang belum approve.");
			}			

		} catch (\Exception $ex) {
			throw $ex;
		}

	}


	static function SkipApprovedOrDeclinedRow($db, $row, $options, $userdata) {
		
		$userdata = $options->approvalsource['userdata'];
		$tablename_head = $options->approvalsource['tablename_head'];
		$tablename_appr = $options->approvalsource['tablename_appr'];
		$field_id = $options->approvalsource['field_id'];
		$field_id_detil = $options->approvalsource['field_id_detil'];
		$flag_head = $options->approvalsource['flag_head'];
		$flag_appr = $options->approvalsource['flag_appr'];
		$flag_decl = $options->approvalsource['flag_decl'];
		$id = $row[$field_id];

		$param = new \stdClass;
		$param->approvalsource = [
			'id' => $id,
			'userdata' => $userdata,
			'tablename_head' => $tablename_head,
			'tablename_appr' => $tablename_appr,
			'field_id' => $field_id,
			'field_id_detil' => $field_id_detil,
			'flag_head' => $flag_head,
			'flag_appr' =>  $flag_appr,
			'flag_decl' =>  $flag_decl,
		];

		try {
			// skip kalai gak punya otoritas
			$rows = self::getUserApprovalData($db, $param);
			if (count($rows)==0) {
				return true;
			}

			// skip kalau masih ada pending di downline
			$rows = self::getDownlinePendingApprovalData($db, $param);	
			debug::log(print_r($rows, true));
			if (count($rows)>0) {
				$pending_approve = $rows[0]['pending_approve'];
				if ($pending_approve>0) {
					return true;
				}						
			}			

			// skip kalau sudah tidak ada outstanding approval take action
			$sql = "
				select
				D.$field_id_detil, D.docauth_order
				from (
									
					select 
					A.$field_id_detil, A.docauth_order 
					from $tablename_appr A where 
						A.$field_id = :field_id
					and A.auth_id IN (
						select auth_id from mst_auth where empl_id = (select empl_id from mst_empluser where user_id = :user_id)
					)
					and $flag_appr = 0
					and $flag_decl = 0
					
					UNION 
					
					select 
					A.$field_id_detil, A.docauth_order
					from $tablename_appr A inner join $tablename_head B on B.$field_id = A.$field_id 
					where 
						A.$field_id = :field_id
					and A.auth_id is null
					and A.authlevel_id  IN (
						select authlevel_id from mst_auth where empl_id = (select empl_id from mst_empluser where user_id = :user_id)
					)
					and B.dept_id = (select dept_id from mst_empl where empl_isdisabled = 0 and empl_id = (select empl_id from mst_empluser where user_id = :user_id))
					and $flag_appr = 0
					and $flag_decl = 0

				) D
				order by D.docauth_order
			";

			$sqlparam = [
				':field_id' => $id,
				':user_id' => $userdata->username
			];

			$stmt = $db->prepare($sql);
			$stmt->execute($sqlparam);
			$rows = $stmt->fetchall(\PDO::FETCH_ASSOC);
			if (count($rows)==0) {
				// sudah take action dengan dokumen ini
				return true;	
			}

		} catch (\Exception $ex) {
			throw $ex;
		}
	}
}

