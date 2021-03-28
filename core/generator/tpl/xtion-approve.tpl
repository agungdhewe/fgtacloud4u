<?php namespace FGTA4\apis;

if (!defined('FGTA4')) {
	die('Forbiden');
}

require_once __ROOT_DIR.'/core/sqlutil.php';
require_once __ROOT_DIR.'/core/debug.php';
require_once __ROOT_DIR.'/core/approval.php';
// require_once __ROOT_DIR.'/core/currency.php';
require_once __ROOT_DIR.'/apps/fgta/framework/fgta4libs/apis/otp.php';
require_once __DIR__ . '/xapi.base.php';

use \FGTA4\exceptions\WebException;
use \FGTA4\debug;
use \FGTA4\StandartApproval;
use FGTA4\utils\Currency;

/**
 * {__MODULEPROG__}
 *
 * =======
 * Approve
 * =======
 * Melakukan approve/decline dokumen,
 * sesuai dengan authorisasi yang di setting pada modul ent/organisation/doc
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

		$param->approvalsource = [
			'id' => $id,
			'userdata' => $userdata,
			'date' => date("Y-m-d H:i:s"),
			'tablename_head' => $this->main_tablename,
			'tablename_appr' => $this->approval_tablename,
			'field_id' => $this->main_primarykey,
			'field_id_detil' => $this->approval_primarykey,

			'flag_head_isapprovalprogress' => $this->fields_isapprovalprogress,
			'flag_head_approve' => $this->field_isapprove,
			'flag_head_approveby' => $this->field_approveby,
			'flag_head_approvedate' => $this->field_approvedate,
			'flag_head_decline' => $this->field_isdecline,
			'flag_head_declineby' => $this->field_declineby,
			'flag_head_declinedate' => $this->field_declinedate,
			'flag_appr' => $this->approval_field_approve,
			'flag_decl' => $this->approval_field_decline,
			'appr_by' => $this->approval_field_approveby,
			'appr_date' => $this->approval_field_approvedate,
			'decl_by' => $this->approval_field_declineby,
			'decl_date' => $this->approval_field_declinedate,
			'notes' => $this->approval_field_notes,
			'approval_version' => $this->approval_field_version,
			'document_version' => $this->main_field_version
		];


		try {

			$useotp = property_exists($this, 'useotp') ? $this->useotp : true;
			if ($useotp) {
				$otp = \property_exists($param, 'otp') ?	$param->otp : '';
				$otpcode = \property_exists($param, 'otpcode') ? $param->otpcode : ''; 		
				try {
					OTP::Verify($this->db, $otp, $otpcode);
				} catch (\Exception $ex) {
					throw new WebException('OTP yang anda masukkan salah', 403);
				}
			}

			// $this->CURR = new Currency($this->db);
			$currentdata = (object)[
				'header' => $this->get_header_row($id),
				'user' => $userdata
			];

			$this->pre_action_check($currentdata, $param->approve ? 'approve' : 'decline');


			$this->db->setAttribute(\PDO::ATTR_AUTOCOMMIT,0);
			$this->db->beginTransaction();

			try {

				$ret = $this->approve($currentdata, $param);

				$record = []; $row = $this->get_header_row($id);
				foreach ($row as $key => $value) { $record[$key] = $value; }
				$dataresponse = (object) array_merge($record, [
					//  untuk lookup atau modify response ditaruh disini
/*{__LOOKUPFIELD__}*/
					'_createby' => \FGTA4\utils\SqlUtility::Lookup($record['_createby'], $this->db, $GLOBALS['MAIN_USERTABLE'], 'user_id', 'user_fullname'),
					'_modifyby' => \FGTA4\utils\SqlUtility::Lookup($record['_modifyby'], $this->db, $GLOBALS['MAIN_USERTABLE'], 'user_id', 'user_fullname'),
				]);


				if ( $param->approve) {
					if ($ret->isfinalapproval) {
						\FGTA4\utils\SqlUtility::WriteLog($this->db, $this->reqinfo->modulefullname, $tablename, $id, 'FINAL APPROVAL', $userdata->username, (object)[]);
					} else {
						\FGTA4\utils\SqlUtility::WriteLog($this->db, $this->reqinfo->modulefullname, $tablename, $id, 'APPROVE', $userdata->username, (object)[]);
					}
				} else {
					\FGTA4\utils\SqlUtility::WriteLog($this->db, $this->reqinfo->modulefullname, $tablename, $id, 'DECLINE', $userdata->username, (object)[]);
				}


				$this->db->commit();
				return (object)[
					'success' => true,
					'isfinalapproval' => $ret->isfinalapproval,
					'dataresponse' => $dataresponse
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



	public function approve($currentdata, $param) {
		try {
			StandartApproval::CheckAuthoriryToApprove($this->db, $param);	
			StandartApproval::CheckPendingApproval($this->db, $param);

			$ret = (object)['isfinalapproval'=>false];
			if ($param->approve) {
				// echo "approving...\r\n";
				$ret = StandartApproval::Approve($this->db, $param);
			} else {
				// echo "declining...\r\n";
				StandartApproval::Decline($this->db, $param);
			}

			return $ret;
		} catch (\Exception $ex) {
			throw $ex;
		}		
	}




};


