<?php namespace FGTA4\apis;

if (!defined('FGTA4')) {
	die('Forbiden');
}

require_once __ROOT_DIR.'/core/sqlutil.php';

// /* Enable Debugging */
// require_once __ROOT_DIR.'/core/debug.php';

use \FGTA4\exceptions\WebException;
// use \FGTA4\debug;




/**
 * fgta/riset/pros02/apis/xapi.base.php
 *
 * pros02Base
 * Kelas dasar untuk keperluan-keperluan api
 * kelas ini harus di-inherit untuk semua api pada modul pros02
 *
 * Agung Nugroho <agung@fgta.net> http://www.fgta.net
 * Tangerang, 26 Maret 2021
 *
 * digenerate dengan FGTA4 generator
 * tanggal 28/03/2021
 */
class pros02Base extends WebAPI {

	protected $main_tablename = "mst_pros";
	protected $main_primarykey = "pros_id";
	protected $main_field_version = "pros_version";	
	
	protected $field_iscommit = "pros_iscommit";
	protected $field_commitby = "pros_commitby";
	protected $field_commitdate = "pros_commitdate";		
			
	
	protected $fields_isapprovalprogress = "pros_isapprovalprogress";			
	protected $field_isapprove = "pros_isapproved";
	protected $field_approveby = "pros_approveby";
	protected $field_approvedate = "pros_approvedate";
	protected $field_isdecline = "pros_isdeclined";
	protected $field_declineby = "pros_declineby";
	protected $field_declinedate = "pros_declinedate";

	protected $approval_tablename = "mst_prosappr";
	protected $approval_primarykey = "prosappr_id";
	protected $approval_field_approve = "prosappr_isapproved";
	protected $approval_field_approveby = "prosappr_by";
	protected $approval_field_approvedate = "prosappr_date";
	protected $approval_field_decline = "prosappr_isdeclined";
	protected $approval_field_declineby = "prosappr_declinedby";
	protected $approval_field_declinedate = "prosappr_declineddate";
	protected $approval_field_notes = "prosappr_notes";
	protected $approval_field_version = "pros_version";

			



	function __construct() {

		// $logfilepath = __LOCALDB_DIR . "/output//*pros02*/.txt";
		// debug::disable();
		// debug::start($logfilepath, "w");

		$DB_CONFIG = DB_CONFIG[$GLOBALS['MAINDB']];
		$DB_CONFIG['param'] = DB_CONFIG_PARAM[$GLOBALS['MAINDBTYPE']];		
		$this->db = new \PDO(
					$DB_CONFIG['DSN'], 
					$DB_CONFIG['user'], 
					$DB_CONFIG['pass'], 
					$DB_CONFIG['param']
		);
	}

	function pre_action_check($data, $action) {
		try {
			return true;
		} catch (\Exception $ex) {
			throw $ex;
		}
	}

	public function get_header_row($id) {
		try {
			$sql = "
				select 
				A.*
				from 
				$this->main_tablename A 
				where 
				A.$this->main_primarykey = :id 
			";
			$stmt = $this->db->prepare($sql);
			$stmt->execute([":id" => $id]);
			$rows = $stmt->fetchall(\PDO::FETCH_ASSOC);
			if (!count($rows)) { throw new \Exception("Data '$id' tidak ditemukan"); }
			return (object)$rows[0];
		} catch (\Exception $ex) {
			throw $ex;
		}
	}

}