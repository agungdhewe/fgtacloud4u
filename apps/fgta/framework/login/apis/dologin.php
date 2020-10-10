<?php namespace FGTA4\apis;

if (!defined('FGTA4')) {
	die('Forbiden');
}

require_once __ROOT_DIR . '/core/webuser.php';
require_once __ROOT_DIR . '/apps/fgta/framework/login/apis/loginexception.php';

use FGTA4\exceptions\WebException;
use FGTA4\exceptions\LoginException;
use FGTA4\WebUser;
use FGTA4\WebAuth;

class DoLogin extends WebAPI {

	function __construct() {
		$this->debugoutput = true;
		$DB_CONFIG = DB_CONFIG[$GLOBALS['MAINDB']];
		$DB_CONFIG['param'] = DB_CONFIG_PARAM[$GLOBALS['MAINDBTYPE']];
		$this->db = new \PDO(
					$DB_CONFIG['DSN'], 
					$DB_CONFIG['user'], 
					$DB_CONFIG['pass'], 
					$DB_CONFIG['param']
		);

	}

	public function execute($username, $password) {
		try {
			// $userdata = $this->simpledb_login($username, md5($password));
			//$userdata = $this->cutirest_login($username, md5($password));
			if ($username=='root' && md5($password)=='6e7fcdd6655c6d3249bfd06c7f9376d2') {
				$userdata = new WebUser();
				$userdata->username = 'root';
				$userdata->userfullname =  'root';
				$userdata->groups = ['public', 'super'];
				$userdata->menu = 'modules-fgta-root.json';
			} else if ($username=='example' && $password='example') {
				$userdata = new WebUser();
				$userdata->username = 'example';
				$userdata->userfullname =  'example';
				$userdata->groups = ['public'];
				$userdata->menu = 'modules-example.json';
			} else if ($username=='riset' && $password='riset') {
				$userdata = new WebUser();
				$userdata->username = 'riset';
				$userdata->userfullname =  'riset';
				$userdata->groups = ['public'];
				$userdata->menu = 'modules-riset.json';				
			} else {
				$userdata = $this->fgta4cloud_login($username, md5($password));
			}

			//login berhasil, cek add on untuk login
			$LoginAddonExecute = null;
			$loginaddonpath = __LOCALCLIENT_DIR . '/loginaddon-employee.php';
			if (is_file($loginaddonpath)) {
				require_once $loginaddonpath;
			} else {
				$loginaddonpath = __DIR__ . '/loginaddon-employee.php';
				if (is_file($loginaddonpath)) {
					require_once $loginaddonpath;
				}				
			}
			if (is_callable($LoginAddonExecute)) {
				$LoginAddonExecute($userdata, $this->db);
			}

			//login berhasil, mulai session
			// $tokenid = uniqid();
			// setcookie('tokenid', $tokenid, 0, '/; samesite=strict');
			$currentCookieParams = session_get_cookie_params(); 
			session_set_cookie_params(
				$currentCookieParams["lifetime"], 
				'/;SameSite=Strict'
			);
			session_start(["name" => 'tokenid']);
			
			$userdata->tokenid = session_id();
			$this->auth->session_user_start($userdata);



			
			return $userdata;
		} catch (\Exception $ex) {
			throw $ex;
		}
	}

	public function fgta4cloud_login($username, $md5password) {
		require_once __ROOT_DIR.'/core/sqlutil.php';

		try {
			$options = new \stdClass;
			$options->criteria = [
				'user_name' => $username,
				'user_disabled' => 0
			];

			$where = \FGTA4\utils\SqlUtility::BuildCriteria(
				$options->criteria,
				[
					"user_name" => " user_name = :user_name ",
					"user_disabled" => " user_disabled = :user_disabled "
				]
			);

			$sql = \FGTA4\utils\SqlUtility::Select('fgt_user', [
				'user_id', 'user_name', 'user_fullname', 'user_email', 'user_password', 'user_disabled', 'group_id' 
			], $where->sql);			

			$stmt = $this->db->prepare($sql);
			$stmt->execute($where->params);
			$row  = $stmt->fetch(\PDO::FETCH_ASSOC);

			if ($row==null) {
				throw new LoginException("Login salah");
			}


			$record = [];
			foreach ($row as $key => $value) {
				$record[$key] = $value;
			}
			


			$user = array_merge($record, [
				'group_menu' => \FGTA4\utils\SqlUtility::Lookup($record['group_id'], $this->db, 'fgt_group', 'group_id', 'group_menu')
			]);			

			if ($user['user_password']!=$md5password) {
				throw new LoginException("Password yang anda masukkkan salah");
			}



			$where = \FGTA4\utils\SqlUtility::BuildCriteria(
				[	
					'user_id' => $user['user_id'],					
					'usergroups_isdisabled' => 0
				],
				[
					"user_id" => "user_id = :user_id ",
					"usergroups_isdisabled" => "usergroups_isdisabled = :usergroups_isdisabled"
				]
			);


			$user_groups = ['public', $user['group_id'] ];
			/* ambil group lain yang dipunyai user ini */
			$sql = \FGTA4\utils\SqlUtility::Select('fgt_usergroups', [
				'group_id'
			], $where->sql);			
			$stmt = $this->db->prepare($sql);
			$stmt->execute($where->params);
			$rows  = $stmt->fetchall(\PDO::FETCH_ASSOC);
			foreach ($rows as $row) {
				if (!in_array($row['group_id'], $user_groups)) {
					$user_groups[] = $row['group_id'];
				}
			}


			/* ambil daftar group yang bisa digunakan */
			$available_groups = ['public'];
			$group_file = __LOCALDB_DIR . "/grouppriv/groups.json";
			$group_file_path = realpath($group_file);

			if (!is_file($group_file_path)) {
				throw new WebException("File '$group_file' tidak ditemukan",  500);
			}

			$group_jsondata = file_get_contents($group_file_path);
			$group_rawdata = (object) json_decode($group_jsondata, true);
			if (json_last_error()) {
				throw new WebException("format json pada file '$group_file_path' salah",  500);
			}
			foreach ($group_rawdata->groups as $group_id) {
				$available_groups[] = $group_id;
			}


			/* ambil real group */ 
			$group_memberof = ['public'];
			foreach ($user_groups as $group_id) {
				$group_id = strtolower($group_id);
				$group_file = __LOCALDB_DIR . "/grouppriv/group.$group_id.json";
				if (is_file($group_file)) {
					$group_file_path = realpath($group_file);
					$group_jsondata = file_get_contents($group_file_path);
					$group_rawdata = (object) json_decode($group_jsondata, true);
					if (json_last_error()) {
						throw new WebException("format json pada file '$group_file_path' salah",  500);
					}
					
					$memberof = $group_rawdata->memberof;
					foreach ($memberof as $priv_group_id) {
						if (!in_array($priv_group_id, $group_memberof)) {
							if (!in_array($priv_group_id, $available_groups)) {
								throw new WebException("Group '$priv_group_id' pada 'group.$group_id.json' tidak terdaftar", 500);
							}
							$group_memberof[] = $priv_group_id;
						}
					}

				}	
			}








			$ret = new WebUser();
			$ret->username = $user['user_id'];
			$ret->userfullname =  $user['user_fullname'];
			$ret->groups = $group_memberof;
			$ret->menu = ($user['group_menu']!='' ? $user['group_menu'] : 'modules-public')  .  '.json';

			return $ret;



		} catch (LoginException $ex) {
			throw $ex;
		} catch (\Exception $ex) {
			throw $ex;
		}
	}


	public function simpledb_login($username, $md5password) {
		$userjsondata = file_get_contents(dirname(__FILE__).'/simpleuserdb.json');
		$userdb = json_decode($userjsondata, true);
		if (json_last_error()) {
			throw new WebException("format json pada file 'simpleuserdb.json' salah",  500);
		}

		if (!array_key_exists($username, $userdb)) {
			throw new LoginException("Login salah");
		}

		$user = (object)$userdb[$username];
		if ($user->md5password!=$md5password) {
			throw new LoginException("Password yang anda masukkkan salah");
		}

		if (!property_exists($user, 'groups')) {
			$user->groups = [];
		}

		if (!in_array('public', $user->groups)) {
			array_push($user->groups, 'public');
		}

		$ret = new WebUser();
		$ret->username = $username;
		$ret->userfullname = $user->fullname;
		$ret->groups = $user->groups;
		$ret->menu = array_key_exists('menu', $user) ? $user->menu : '';

		return $ret;
	}

	
	public function cutirest_login($username, $md5password) {
		$url = "http://cuti.transfashionindonesia.com/cuti/fgta-service.php/coreapps/login/login/dologin";	
		$data = array("user_id" => $username, "user_password" => $md5password, "ismd5"=>"true");                                                                    
		$data_string = json_encode($data); 
		
		$ch = \curl_init($url);                                                                      
		\curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");                                                                     
		\curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);                                                                  
		\curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);                                                                      
		\curl_setopt($ch, CURLOPT_HTTPHEADER, array(                                                                          
			'Content-Type: application/json',
			'custom_authenticator: /userapps/cuti/__employee_authenticator.inc.php',                                                                      
			'Content-Length: ' . strlen($data_string))                                                                       
		);                                                                                                                   
																															
		$result = \curl_exec($ch);
		$obj = \json_decode($result);

		if (\json_last_error() === JSON_ERROR_NONE) {
			if (!\is_object($obj)) {
				throw new LoginException($result );
			} else {
				$ret = new WebUser();
				$ret->username = $obj->user_id;
				$ret->userfullname = $obj->user_name;
				$ret->groups = array();
				$ret->menu = '';
				return $ret;
			}


		} else {
			throw new LoginException($result );
		}
	
	}

}

$API = new DoLogin();