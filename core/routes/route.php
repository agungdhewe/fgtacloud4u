<?php namespace FGTA4\routes;

if (!defined('FGTA4')) {
	die('Forbiden');
}

require_once __ROOT_DIR.'/core/webexception.php';
require_once __ROOT_DIR.'/core/webmodulesetting.php';


use FGTA4\WebModuleConfig;
use FGTA4\WebModuleSetting;
use FGTA4\exceptions\WebException;

class Route {


	public function PrepareRequestInfo($reqs, $isapps) {
		$reqinfo = new \stdClass;
		if ($isapps) {

			if (count($reqs)<4) {
				throw new WebException("Format request salah", 400);
			}
		
			$reqinfo->reqs = $reqs;
			$reqinfo->routeswitch = $reqs[0];
			$reqinfo->appsgroup = $reqs[1];
			$reqinfo->appsname = $reqs[2];
			$reqinfo->modulename = $reqs[3];
			$reqinfo->modulefullname = "$reqinfo->appsgroup/$reqinfo->appsname/$reqinfo->modulename";
			$reqinfo->modulerequest = "/$reqinfo->routeswitch/$reqinfo->appsgroup/$reqinfo->appsname/$reqinfo->modulename";
			$reqinfo->modulerequestinfo = ltrim(str_replace($reqinfo->modulerequest,  '', $_SERVER['PATH_INFO']), '/');
			$reqinfo->moduledir = __ROOT_DIR . "/apps/$reqinfo->appsgroup/$reqinfo->appsname/$reqinfo->modulename";
			$reqinfo->moduleconfigpath = "$reqinfo->moduledir/$reqinfo->modulename.json";
			$reqinfo->pathinfo = $_SERVER['PATH_INFO'];
			$reqinfo->appgroupdbconfigpath =  __ROOT_DIR . "/apps/$reqinfo->appsgroup/dbconfig.php";
			$reqinfo->rootpath = __ROOT_DIR;
	
			$moduleconfigpath = $reqinfo->moduleconfigpath ;
			$moduleconfigpath_override = __ROOT_DIR . "/core/database/progaccess/".str_replace("/", "#", $reqinfo->modulefullname) . ".json";
			if (is_file($moduleconfigpath_override)) {
				$reqinfo->moduleconfigpath = $moduleconfigpath_override;
			}
	
			$reqinfo->moduleconfig =  new WebModuleConfig($reqinfo->moduleconfigpath);

			$modulesettingpath = __LOCALDB_DIR . "/settings/" . str_replace("/", "#", $reqinfo->modulefullname) . ".json";
			$reqinfo->modulesetting =  new WebModuleSetting($modulesettingpath);

		} else {

		}


		$this->reqinfo = $reqinfo;
		return $reqinfo;
	}


	public /*virtual*/ function ProcessRequest($reqs) {
		$reqinfo = $this->GetRequestInfo($reqs);
	}

	public /*virtual*/ function SendHeader() {
		
	}

}