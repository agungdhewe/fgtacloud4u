<?php namespace FGTA4\routes;

if (!defined('FGTA4')) {
	die('Forbiden');
}

require_once __ROOT_DIR.'/core/webexception.php';
require_once __ROOT_DIR.'/core/webmodulesetting.php';
require_once __ROOT_DIR.'/core/debug.php';


use FGTA4\WebModuleConfig;
use FGTA4\WebModuleSetting;
use FGTA4\exceptions\WebException;
use \FGTA4\debug;

/**
 * Base Class untuk membuat routing ke modul-modul FGTA
 * 
 * @category Routing
 * @author Panji Tengkorak <panjitengkorak@null.net>
 * @copyright 2020 Panji Tengkorak
 * @license https://opensource.org/licenses/BSD-3-Clause BSD
 * @link https://www.fgta.net
 * 
 */
class Route {

	function __construct() {
		// $logfilepath = __LOCALDB_DIR . "/output/route.txt";
		// debug::start($logfilepath, "w");
	}


	/**
	 * Mengolah input request halaman dari url
	 * 
	 * @param array $reqs array request yang dikrimkan dari url
	 * @param bool $isapps flag  untuk menandai apabila apps, request info akan diproses
	 * 
	 * @return object informasi mengenai request
	 */
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
			$reqinfo->url_param = '';


			/* patch module name: add parameter */
			$modpar = explode('?', $reqinfo->modulename);
			if (count($modpar)>1) {
				$reqinfo->modulename = $modpar[0];
				$reqinfo->url_param = $modpar[1];
			}

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


	/**
	 * Fungsi ini akan diimplementasi di class turunan
	 * untuk memproses request url dan mengembalikan hasil ke browser
	 * 
	 * @param array $reqs array request yang dikrimkan dari url
	 * 
	 * @return void
	 */
	public /*virtual*/ function ProcessRequest($reqs) {
		// $reqinfo = $this->GetRequestInfo($reqs);
	}

	/**
	 * Fungsi ini akan diimplementasi di class turunan
	 * untuk mengirimkan header ke browser
	 * 
	 * @return void 
	 */
	public /*virtual*/ function SendHeader() {
		
	}

}



//https://www.google.com/maps?saddr=My+Location&daddr=-6.189324050997315,106.79654239440968