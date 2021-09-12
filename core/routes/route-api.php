<?php namespace FGTA4\routes;

if (!defined('FGTA4')) {
	die('Forbiden');
}

require_once __ROOT_DIR.'/core/webapi.php';

/**
 * Class untuk memproses request-request dari browser via POST
 * dan megembalikan hasil berupa JSON.
 * class ini digunakan untuk keperluan ajax dari browser.
 * 
 * @category Routing
 * @author Panji Tengkorak <panjitengkorak@null.net>
 * @copyright 2020 Panji Tengkorak
 * @license https://opensource.org/licenses/BSD-3-Clause BSD
 * @link https://www.fgta.net
 * 
 */
class ApiRoute extends Route {

	public $debugoutput = false;


	public function SendHeader() {
		\header('Content-Type: application/json');
	}

	public function ProcessRequest($reqinfo) {
		global $_POST;

		$API = null;
		$reqinfo->apipath = "$reqinfo->moduledir/apis/$reqinfo->modulerequestinfo.php";

		if (count($reqinfo->reqs)<5) {
			throw new \FGTA4\exceptions\WebException("Format Request API salah!", 400);
		}

		if (!is_file($reqinfo->apipath)) {
			throw new \FGTA4\exceptions\WebException("API '$reqinfo->apipath' tidak ditemukan!", 404);
		}
		
		if ($_SERVER['REQUEST_METHOD']!='POST') {
			throw new \FGTA4\exceptions\WebException("API hanya bisa diakses via POST!", 405);
		}

		
		$this->reqinfo = $reqinfo;

		$allowanonymous = false;
		$requested_api = $reqinfo->modulerequestinfo;
		if (property_exists( $reqinfo->moduleconfig->apis, $requested_api)) {
			$apilist = $reqinfo->moduleconfig->apis->$requested_api;
			if (property_exists($apilist, 'allowanonymous')) {
				$allowanonymous = $apilist->allowanonymous;
			}
		}

		if (!$allowanonymous) {
			if (!$this->auth->is_login()) {
				throw new \FGTA4\exceptions\WebException("session telah habis, atau belum login", 401);
			}
		}


		$otp = $_SERVER['HTTP_OTP'];
		if (!$this->isvalidotp($otp)) {
			throw new \FGTA4\exceptions\WebException("OTP tidak valid", 401);
		}


		require_once $reqinfo->apipath;


		if (!is_object($API)) {
			throw new \FGTA4\exceptions\WebException("Object API belum terdefinisi dengan benar!", 500);
		}


		// if (property_exists($API, 'debugoutput')) {
		// 	$this->debugoutput = $API->debugoutput;
		// }

		if (!method_exists($API, 'execute')) {
			throw new \FGTA4\exceptions\WebException("Method 'execute' pada API tidak ditemukan", 500);
		}
		
		//$API->execute();
		$classname = get_class($API);
		$apimethod = new \ReflectionMethod($classname, 'execute');
		$params = $apimethod->getParameters();
		$executingparameters = [];
		foreach ($params as $param) {
			// echo $param->getName();
			$paramname = $param->getName();
			if (array_key_exists($paramname, $_POST)) {
				$paramvalue = json_decode($_POST[$paramname]);
				if (json_last_error()===JSON_ERROR_NONE) {
					$executingparameters[$paramname] = $paramvalue;
				} else {
					$executingparameters[$paramname] = $_POST[$paramname];
				}

				
			} else {
				$executingparameters[$paramname] = null;
				throw new \FGTA4\exceptions\WebException("Eksekusi API membutuhkan POST parameter '$paramname' !", 500);
			}
		}
		

		$API->auth = $this->auth;
		$API->reqinfo = $reqinfo;

		$userdata = $API->auth->session_get_user();
		if ($userdata==null) {
			$ownedgroup = ['public'];
		} else {
			$ownedgroup = property_exists($userdata, 'groups') ? $userdata->groups : ['public'];
		}
		$apis = $API->reqinfo->moduleconfig->apis;
		$apiinfo = property_exists($apis, $requested_api) ? $apis->{$requested_api} : new \stdClass;
		if (!$API->ActionIsAllowedFor($apiinfo, $ownedgroup)) {
			throw new \Exception('[ERROR] Your group authority is not allowed to do this action.');
		}		

		try {
			$this->result = $apimethod->invokeArgs($API, $executingparameters);
			$this->debugoutput = $API->isDebugOutput();
		} catch (\Exception $ex) {
			throw $ex;
		}

	}

	public function ShowResult($content) {
		$res = new \stdClass;
		$res->ajaxsuccess = true;
		$res->errormessage = null;
		$res->result = $this->result;
		$res->output = $content;
		$res->debugoutput = $this->debugoutput;
		echo json_encode($res);
	}

	public function ShowError($ex) {
		$content = ob_get_contents();
		ob_end_clean();
		$res = new \stdClass;
		$res->ajaxsuccess = false;
		$res->errormessage = $ex->getMessage();
		$res->result = null;
		$res->output = $content;
		$res->debugoutput = $this->debugoutput;
		$res->redirecttologin = property_exists($ex, 'redirecttologin') ? $ex->redirecttologin : false;

		if (property_exists($ex, 'errorstatus')) {
			header($_SERVER['SERVER_PROTOCOL'] . $ex->errorstatusmessage, true, $ex->errorstatus);
		} else {
			header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
		}


		echo json_encode($res);
	}


	public function isvalidotp($otp) {
		$DB_CONFIG = DB_CONFIG[$GLOBALS['MAINDB']];
		$DB_CONFIG['param'] = DB_CONFIG_PARAM[$GLOBALS['MAINDBTYPE']];
		$db = new \PDO(
					$DB_CONFIG['DSN'], 
					$DB_CONFIG['user'], 
					$DB_CONFIG['pass'], 
					$DB_CONFIG['param']
		);

		try {

			$db->query("DELETE FROM fgt_otp WHERE expired<CURRENT_TIME");
			$rows = array();
			foreach($db->query("SELECT * FROM fgt_otp WHERE otp='$otp'") as $row) {
				$rows[] = $row;
			};

			if (count($rows)==0) {
				return false;
			}


			$current_token_id = $this->auth->get_tokenid();

			if ($current_token_id!="") {
				if ($row->tokenid!=$this->auth->get_tokenid()) {
					return false;
				}
			}


			$db->query("DELETE FROM fgt_otp WHERE otp='$otp'");			

			return true;
		} catch (Exception $ex) {
			throw new \FGTA4\exceptions\WebException($ex->getMessage(), 500);
		}

	}


}

$ROUTER = new ApiRoute();