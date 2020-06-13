<?php namespace FGTA4;


ini_set("session.gc_maxlifetime", "65535");
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL & ~E_DEPRECATED & ~E_STRICT);
date_default_timezone_set('Asia/Jakarta');


define('FGTA4', 1);
define('__ROOT_DIR', realpath(dirname(__FILE__).'/..'));
define('__BASEADDRESS', $_SERVER['REQUEST_SCHEME'] ."://".  $_SERVER['SERVER_NAME'] . rtrim($_SERVER['SCRIPT_NAME'], '/index.php') .'/');
define('API_LOGIN_URL', 'fgta/framework/login/dologin');




define('DB_CONFIG_PARAM', [
	'firebird' => [
		\PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION,
		\PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_OBJ,
		\PDO::ATTR_PERSISTENT=>true		
	],

	'mariadb' => [
		\PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION,
		\PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_OBJ,
		\PDO::ATTR_PERSISTENT=>true			
	],

	'mssql' => [
		\PDO::ATTR_CASE => \PDO::CASE_NATURAL,
		\PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION,
		\PDO::ATTR_ORACLE_NULLS => \PDO::NULL_NATURAL,
		\PDO::ATTR_STRINGIFY_FETCHES => false,	
	]
]);


// untuk remote debugging:
// ssh -R 9000:localhost:9000 agung@ubserver01



ob_start();

$FGTA_LOCALDB_DIR = __ROOT_DIR.'/core/database';
$ENV_FGTA_LOCALDB_DIR = getenv('FGTA_LOCALDB_DIR');
if ($ENV_FGTA_LOCALDB_DIR != '') {
	if (!is_dir($ENV_FGTA_LOCALDB_DIR)) {
		die("LocalDb Path: '$ENV_FGTA_LOCALDB_DIR' not found.");
	} else {
		$FGTA_LOCALDB_DIR = $ENV_FGTA_LOCALDB_DIR;
	}
} 
define('__LOCALDB_DIR', $FGTA_LOCALDB_DIR);	


$FGTA_DBCONF_PATH = __ROOT_DIR.'/public/dbconfig.php';
$ENV_FGTA_DBCONF_PATH=getenv('FGTA_DBCONF_PATH');
if ($ENV_FGTA_DBCONF_PATH != '') {
	if (!is_file(getenv('FGTA_DBCONF_PATH'))) {
		die("Config: '$ENV_FGTA_DBCONF_PATH' not found.");
	} else {
		$FGTA_DBCONF_PATH = $ENV_FGTA_DBCONF_PATH;
	}
}


$FGTA_APP_NAME = '';
$ENV_FGTA_APP_NAME=getenv('FGTA_APP_NAME');
if ($ENV_FGTA_APP_NAME != '') {
	$FGTA_APP_NAME = $ENV_FGTA_APP_NAME;
	define('__MANIFESTNAME', 'manifest-' . strtolower($FGTA_APP_NAME) . '.json');
	define('__FAVICON', 'favicon-' . strtolower($FGTA_APP_NAME) . '.ico');
	define('__APPDISPLAYNAME', $FGTA_APP_NAME);
} else {
	define('__MANIFESTNAME', 'manifest.json');
	define('__FAVICON', 'favicon.ico');
	define('__APPDISPLAYNAME', 'FGTA Dev');
}
define('__APPNAME', $FGTA_APP_NAME);



require_once $FGTA_DBCONF_PATH;
require_once __ROOT_DIR.'/core/webauth.php';
require_once __ROOT_DIR.'/core/webmoduleconfig.php';
require_once __ROOT_DIR.'/core/errorpage.php';
require_once __ROOT_DIR.'/core/routes/route.php';

$ROUTER = null;

try {

	$configuration = new \stdClass;


	$FGTA_APP_TITLE = 'FGTA Development';
	$ENV_FGTA_APP_TITLE=getenv('FGTA_APP_TITLE');
	if ($ENV_FGTA_APP_TITLE != '') {
		$FGTA_APP_TITLE = $ENV_FGTA_APP_TITLE;
	}
	$configuration->basetitle = $FGTA_APP_TITLE;


	if (!array_key_exists('PATH_INFO', $_SERVER)) {
		$_SERVER['PATH_INFO'] = '/';
	} 

	$reqs = explode('/', ltrim($_SERVER['PATH_INFO'], '/'));
	$routeswitch = trim($reqs[0])!='' ? trim($reqs[0]) : 'index';



	try {
		switch ($routeswitch) {

			case 'asset' :
				require_once __ROOT_DIR.'/core/routes/route-asset.php';
				break;
	
			case 'module':
				require_once __ROOT_DIR.'/core/routes/route-module.php';
				break;
				
			case 'api' :
				require_once __ROOT_DIR.'/core/routes/route-api.php';
				break;
			
			case 'info' :
				phpinfo();
				die();
	
			default :
				echo "<html><body>please wait...</body></html>";
				$startmodule = 'fgta/framework/container';

				$FGTA_START_MODULE=getenv('FGTA_START_MODULE');
				if ($FGTA_START_MODULE != '') {
					$startmodule = $FGTA_START_MODULE;
				}				

				echo "<script>location.href='index.php/module/$startmodule'</script>";
				die();
				
		}


		if (!is_object($ROUTER)) {
			$ROUTER = new \FGTA4\routes\Route();
		}


		$ROUTER->configuration = $configuration;

		$ROUTER->SendHeader();

		$reqinfo = $ROUTER->PrepareRequestInfo($reqs);


		//cek apakah ada dbconfig di ovveride di appsgroup
		if (is_file($reqinfo->appgroupdbconfigpath)) {
			include_once $reqinfo->appgroupdbconfigpath;
		}

		$currentapi = $reqinfo->modulefullname."/".$reqinfo->modulerequestinfo;
		$ROUTER->auth = new WebAuth();
		if ($currentapi!=API_LOGIN_URL) {
			$ROUTER->auth->SessionCheck(); // selain API untuk login, harus dicek session nya
		} 

		if ($reqinfo->moduleconfig->title=='Container') {
			$reqinfo->moduleconfig->title = $configuration->basetitle;
		}

		
		if (method_exists($ROUTER, 'ProcessRequest')) {
			$ROUTER->ProcessRequest($reqinfo);
		}

		$content = ob_get_contents();
		ob_end_clean();
		if (method_exists($ROUTER, 'ShowResult')) {
			$ROUTER->ShowResult($content);
		} else {
			echo $content;
		}

	} catch (\Exception $ex) {
		throw $ex;
	}	
} catch (\Exception $ex) {
	if (method_exists($ROUTER, 'ShowError')) {
		$ROUTER->ShowError($ex);
	} else {
		header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
		$content = ob_get_contents();
		ob_end_clean();

		$err = new ErrorPage('Internal Server Error');
		$err->titlestyle = 'color:red; margin-top: 0px';
		$err->content = $content;
		$err->Show($ex->getMessage());
	}
} 
