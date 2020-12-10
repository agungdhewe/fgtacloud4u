<?php namespace FGTA4\routes;

if (!defined('FGTA4')) {
	die('Forbiden');
}

require_once __ROOT_DIR.'/core/webmodule.php';


class ModuleRoute extends Route {

	public function ProcessRequest($reqinfo) {
		$MODULE = null;
		$reqinfo->modulecontrollerpath = $reqinfo->modulerequestinfo == '' ? "$reqinfo->moduledir/$reqinfo->modulename.php" : "$reqinfo->moduledir/$reqinfo->modulerequestinfo.php";
		$reqinfo->moduleviewpath = $reqinfo->modulerequestinfo == '' ? "$reqinfo->moduledir/$reqinfo->modulename.phtml" : "$reqinfo->moduledir/$reqinfo->modulerequestinfo.phtml";
		$reqinfo->modulejspath = $reqinfo->modulerequestinfo == '' ? "$reqinfo->moduledir/$reqinfo->modulename.mjs" : "$reqinfo->moduledir/$reqinfo->modulerequestinfo.mjs";
		$reqinfo->modulejsurl = $reqinfo->modulerequestinfo == '' ? "./index.php/asset/$reqinfo->modulefullname/$reqinfo->modulename.mjs" : "./index.php/asset/$reqinfo->modulefullname/$reqinfo->modulerequestinfo.mjs";
		$reqinfo->modulecsspath = $reqinfo->modulerequestinfo == '' ? "$reqinfo->moduledir/$reqinfo->modulename.css" : "$reqinfo->moduledir/$reqinfo->modulerequestinfo.css";
		$reqinfo->modulecssurl = $reqinfo->modulerequestinfo == '' ? "./index.php/asset/$reqinfo->modulefullname/$reqinfo->modulename.css" : "./index.php/asset/$reqinfo->modulefullname/$reqinfo->modulerequestinfo.css";

		
		if (array_key_exists('variancename', $_GET)) {
			$reqinfo->variancename = $_GET['variancename'];
			if (property_exists($reqinfo->moduleconfig, 'variance')) {
				if (property_exists($reqinfo->moduleconfig->variance, $reqinfo->variancename)) {
					$variancedata = $reqinfo->moduleconfig->variance->{$reqinfo->variancename};
					if (property_exists($variancedata, 'title')) {
						$reqinfo->moduleconfig->title = $variancedata->title;
					}
					if (property_exists($variancedata, 'allowedgroups')) {
						$reqinfo->moduleconfig->allowedgroups = $variancedata->allowedgroups;
					}					
				}
			}


		} else {
			$reqinfo->variancename = '';
		}

		$this->reqinfo = $reqinfo;

		if (!$reqinfo->moduleconfig->allowanonymous) {
			if (!$this->auth->is_login()) {
				$reqinfo->moduledir = __ROOT_DIR . "/apps/" . __FGTA_LOGIN;
				$reqinfo->modulecontrollerpath = "$reqinfo->moduledir/login.php";
				$reqinfo->moduleviewpath = "$reqinfo->moduledir/login.phtml";
				$reqinfo->modulejspath = "$reqinfo->moduledir/login.mjs";
				$reqinfo->modulejsurl = "./index.php/asset/". __FGTA_LOGIN ."/login.mjs";
			} else {
				// check apakah group yang dimiliki diperolehkan
				$allowed = false;
				foreach ($this->auth->get_groups() as $groupname) {
					if (in_array($groupname, $reqinfo->moduleconfig->allowedgroups)) {
						$allowed = true;
					}
				}
				if (!$allowed) { throw new \FGTA4\exceptions\WebException("Group yang anda miliki tidak diperbolehkan untuk mengakses ".$reqinfo->moduleconfig->title, 401);	 }
			}
		}


		if (!is_file($reqinfo->modulecontrollerpath)) {
			$MODULE = new \FGTA4\module\WebModule();
			$MODULE->LoadPage = function() { 
				return; 
			};
		} else {
			require_once $reqinfo->modulecontrollerpath;
			
			if (!is_object($MODULE)) {
				throw new \FGTA4\exceptions\WebException("Object MODULE belum terdefinisi dengan benar!", 500);		
			}

			if (!method_exists($MODULE, 'LoadPage')) {
				throw new \FGTA4\exceptions\WebException("Method 'LoadPage' pada MODULE '$reqinfo->modulecontrollerpath' tidak ditemukan", 500);
			}				
		}

		if (!is_file($reqinfo->moduleviewpath)) {
			throw new \FGTA4\exceptions\WebException("Module '$reqinfo->moduleviewpath' tidak ditemukan!", 500);
		}


		if (!method_exists($MODULE, 'Render')) {
			throw new \FGTA4\exceptions\WebException("Method 'Render' pada MODULE '$reqinfo->modulecontrollerpath' tidak ditemukan", 500);		
		}





		//$API->execute();
		$classname = get_class($MODULE);
		$apimethod = new \ReflectionMethod($classname, 'LoadPage');
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
				throw new \FGTA4\exceptions\WebException("Eksekusi Module membutuhkan POST parameter '$paramname' !", 500);
			}
		}

		if (count($params)>0) {
			if ($_SERVER['REQUEST_METHOD']!='POST') {
				throw new \FGTA4\exceptions\WebException("Module ini hanya bisa diakses via POST!", 405);
			}
		}


		$this->MODULE = $MODULE;
		$this->MODULE->configuration = $this->configuration;
		$this->MODULE->reqinfo = $reqinfo;
		$this->MODULE->title = $reqinfo->moduleconfig->title;

		$this->MODULE->auth = $this->auth;
		// $this->MODULE->LoadPage($executingparameters);
		$apimethod->invokeArgs($this->MODULE, $executingparameters);
		
	}

	public function ShowResult($content) {
		$this->MODULE->Render($content, __ROOT_DIR.'/public/templates/fgta-printout/appstemplate.phtml');
	}

	public function ShowError($ex) {
		$content = ob_get_contents();
		ob_end_clean();

		if (!property_exists($ex, 'errorstatusmessage')) {
			$ex->errorstatusmessage = $ex->getMessage();
			$ex->errorstatus = 500;
		}

		$err = new \FGTA4\ErrorPage($ex->errorstatusmessage, $ex->errorstatus);
		$err->content = $content;
		$err->Show($ex->getMessage());		
	}

}

$ROUTER = new ModuleRoute();