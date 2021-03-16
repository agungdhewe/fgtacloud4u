<?php
namespace FGTA4;

require_once __ROOT_DIR.'/core/debug.php';

use \FGTA4\debug;

class StandartApproval {

	const AUTHLEVEL_BUDGETOWNER = 'BUDOWN';


	static function remove($db, $currentdata, $tablename, $keys, $doc_id) {
		try {
			$keydata = array();
			foreach ($keys as $keyname=>$value) {
				$keydata[] = (object)[
					'name' => $keyname,
					'value' => $value
				];
			}
			$field_id = $keydata[0]->name;
			$field_idline = $keydata[1]->name;

			$sql = "
				delete from $tablename where $field_id = :$field_id
			";

			$stmt = $db->prepare($sql);
			$stmt->execute([
				':' . $field_id => $keydata[0]->value
			]);

		} catch (\Exception $ex) {
			throw $ex;	
		}			

	}


	static function copy($db, $currentdata, $tablename, $keys, $doc_id) {
		try {
			$keydata = array();
			foreach ($keys as $keyname=>$value) {
				$keydata[] = (object)[
					'name' => $keyname,
					'value' => $value
				];
			}
			$field_id = $keydata[0]->name;
			$field_idline = $keydata[1]->name;


			$auths = array();
			$rows = self::getDeptHiearchy($db, $currentdata->header->dept_id);
			foreach ($rows as $row) {
				$authlevel_id = $row['authlevel_id'];
				if (!\array_key_exists($authlevel_id, $auths)) {
					$auths[$authlevel_id] = $row;
				}


			}

			$stmt_insert = $db->prepare("
				insert into $tablename
				( $field_id,  $field_idline,  docauth_descr,  docauth_order,  docauth_value,  docauth_min,  authlevel_id,  authlevel_name,  auth_id,  auth_name,  _createby,  _createdate)
				values
				(:$field_id, :$field_idline, :docauth_descr, :docauth_order, :docauth_value, :docauth_min, :authlevel_id, :authlevel_name, :auth_id, :auth_name, :_createby, :_createdate)
			");



			$sql = "
				select 
				A.docauth_descr,
				A.docauth_order,
				A.docauth_value,
				A.docauth_min,
				A.authlevel_id,
				(select authlevel_name from mst_authlevel where authlevel_id=A.authlevel_id) as authlevel_name,
				A.auth_id,
				(select auth_name from mst_auth where auth_id=A.auth_id) as auth_name
				from mst_docauth A
				where
				A.doc_id = :doc_id
			";

			$stmt = $db->prepare($sql);
			$stmt->execute([
				':doc_id' => $doc_id
			]);
			$rows = $stmt->fetchall(\PDO::FETCH_ASSOC);
			foreach ($rows as $row) {
				// debug::log(print_r($row, true));

				$authlevel_id = $row['authlevel_id'];
				$param = [
					':' . $field_id => $keydata[0]->value,
					':' . $field_idline => uniqid(),
					':docauth_descr' => $row['docauth_descr'],
					':docauth_order' => $row['docauth_order'],
					':docauth_value' => $row['docauth_value'],
					':docauth_min' => $row['docauth_min'],
					':authlevel_id' => $row['authlevel_id'],
					':authlevel_name' => $row['authlevel_name'],
					':auth_id' => $row['auth_id'],
					':auth_name' => $row['auth_name'],
					':_createby' => $currentdata->user->username,
					':_createdate' => date("Y-m-d H:i:s"),
				];

				if ($row['auth_id']=='') {
					if ($row['authlevel_id']==self::AUTHLEVEL_BUDGETOWNER) {
						// based on projbudget_id
					} else {
						if (\array_key_exists($authlevel_id, $auths)) {
							$param[':auth_id'] = $auths[$authlevel_id]['auth_id'];
							$param[':auth_name'] = $auths[$authlevel_id]['auth_name'];
						}	
					}
				}
			
				$stmt_insert->execute($param);	

			}			


		} catch (\Exception $ex) {
			throw $ex;	
		}
	}


	static function getDeptHiearchy($db, $dept_id) {
		try {
			$sql = "
				SELECT
				B.dept_id, B.dept_name, B.auth_id, C.auth_name, C.authlevel_id 
				FROM 
				(
					SELECT 
						@r AS _dept_id, 
						(SELECT @r := dept_parent FROM mst_dept WHERE dept_id = _dept_id) AS dept_parent
					FROM 
						(SELECT @r := :dept_id, @l := 0) vars, 
						mst_dept h 
					WHERE @r is not NULL 
				) A inner join mst_dept B on B.dept_id = A._dept_id 
					inner join mst_auth C on C.auth_id = B.auth_id 			
			";


			$stmt = $db->prepare($sql);
			$stmt->execute([
				':dept_id' => $dept_id
			]);
			$rows = $stmt->fetchall(\PDO::FETCH_ASSOC);
			
			return $rows;

		} catch (\Exception $ex) {
			throw $ex;
		}
	}

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

	static function getUplineApprovedData($db, $param) {
		$id = $param->approvalsource['id'];
		$userdata = $param->approvalsource['userdata'];
		$tablename_head = $param->approvalsource['tablename_head'];
		$tablename_appr = $param->approvalsource['tablename_appr'];
		$field_id = $param->approvalsource['field_id'];
		$field_id_detil = $param->approvalsource['field_id_detil'];
		$flag_appr = $param->approvalsource['flag_appr'];
		$flag_decl = $param->approvalsource['flag_decl'];


		try {
			$sql = "
				select count(*) as already_approved
				from $tablename_appr
				where
					$field_id = :field_id
				and ($flag_appr=1 or $flag_decl=1)	
				and docauth_order > (
									
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


			// echo $sql;

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

			// debug::log('approve');
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

				$isfinalapproval = self::DoFinalApproval($db, $param);
				$db->commit();


				$ret = (object)['isfinalapproval'=>false];
				if ($isfinalapproval) {
					$ret->isfinalapproval = true;
				}

				return $ret;
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

			// debug::log('decline');
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
				return true;
			} else {
				$stmt->execute([
					':field_id' => $id,
					':approved' => 0
				]);
				return false;
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
			
			// Dowline pending
			$rows = self::getDownlinePendingApprovalData($db, $param);	
			if (count($rows)==0) {
				throw new \Exception("Tidak bisa approve/decline document '$id', cek fail.");
			}
			$pending_approve = $rows[0]['pending_approve'];
			if ($pending_approve>0) {
				throw new \Exception("Tidak bisa approve/decline document '$id', masih ada authorisasi sebelumnya di dokumen ini yang belum approve.");
			}		
			
			// Upline Approval
			$rows = self::getUplineApprovedData($db, $param);	
			if (count($rows)==0) {
				throw new \Exception("Tidak bisa approve/decline document '$id', cek fail.");
			}
			$pending_approve = $rows[0]['already_approved'];
			if ($pending_approve>0) {
				throw new \Exception("Tidak bisa approve/decline document '$id', sudah ada authorisasi lebih tinggi yang melakukan approval/decline.");
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

