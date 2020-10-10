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


$clientdir = realpath(dirname($_SERVER["SCRIPT_FILENAME"]));
define('__LOCALCLIENT_DIR', $clientdir);


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



// Saat pertama site di load tampa parameter, 
// yang akan ditampilkan pertama
$FGTA_STARTMODULE = 'fgta/framework/container';
$ENV_FGTA_STARTMODULE = getenv('FGTA_STARTMODULE');
if ($ENV_FGTA_STARTMODULE != '') {
	$FGTA_STARTMODULE = $ENV_FGTA_STARTMODULE;	
} 
define('__STARTMODULE', $FGTA_STARTMODULE);	



// Default menu yang muncul saat pembuatan group
$FGTA_MENUDEF = 'modules-fgta';
$ENV_FGTA_MENUDEF = getenv('FGTA_MENUDEF');
if ($ENV_FGTA_MENUDEF != '') {
	$FGTA_MENUDEF = $ENV_FGTA_MENUDEF;	
} 
define('__MENUDEF', $FGTA_MENUDEF);	



// Custom Login
$FGTA_LOGIN = 'fgta/framework/login';
$ENV_FGTA_LOGIN = getenv('FGTA_LOGIN');
if ($ENV_FGTA_LOGIN != '') {
	$FGTA_LOGIN = $ENV_FGTA_LOGIN;	
} 
define('__FGTA_LOGIN', $FGTA_LOGIN);	



// Lokasi Direktori lokal database
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


// Lokasi konfigurasi koneksi database
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
	define('__ICON32', strtolower($FGTA_APP_NAME).'icon.png');
	define('__APPDISPLAYNAME', $FGTA_APP_NAME);
} else {
	define('__MANIFESTNAME', 'manifest.json');
	define('__FAVICON', 'favicon.ico');
	define('__ICON32', 'fgtacloudicon.png');
	define('__APPDISPLAYNAME', 'FGTA Dev');
}

define('__APPNAME', $FGTA_APP_NAME);



// Direktori untuk menyimpan mjs yang di obfuscated
$FGTA_OBFUSCATED_DIR = __ROOT_DIR.'/core/database/obfuscated';
$ENV_FGTA_OBFUSCATED_DIR=getenv('FGTA_OBFUSCATED_DIR');
if ($ENV_FGTA_OBFUSCATED_DIR != '') {
	$FGTA_OBFUSCATED_DIR = $ENV_FGTA_OBFUSCATED_DIR;
}
define('__OBFUSCATED_DIR', $FGTA_OBFUSCATED_DIR);


// Template yang digunakan
$FGTA_TEMPLATE = 'fgta-erp';
$ENV_FGTA_TEMPLATE=getenv('FGTA_TEMPLATE');
if ($ENV_FGTA_TEMPLATE != '') {
	$tpldir = __ROOT_DIR . "/public/templates/$ENV_FGTA_TEMPLATE";
	if (!is_dir($tpldir)) {
		die("Template: '$ENV_FGTA_TEMPLATE' not found, please check server environtment setting.");
	} else {
		$FGTA_TEMPLATE = $ENV_FGTA_TEMPLATE;
	}
}
define('__TEMPLATE', $FGTA_TEMPLATE);








define('__LOCAL_PUBLIC_DIR', dirname($_SERVER['SCRIPT_FILENAME']));


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

	$usesession = false;
	$isapps = true;
	try {
		switch ($routeswitch) {

			case 'asset' :
				require_once __ROOT_DIR.'/core/routes/route-asset.php';
				break;
	
			case 'module':
				$usesession = true;
				require_once __ROOT_DIR.'/core/routes/route-module.php';
				break;

			
			case 'printout':
				$usesession = true;
				require_once __ROOT_DIR.'/core/routes/route-printout.php';
				break;


			case 'api' :
				$usesession = true;
				require_once __ROOT_DIR.'/core/routes/route-api.php';
				break;

			case 'download' :
				$usesession = true;
				require_once __ROOT_DIR.'/core/routes/route-download.php';
				break;

			
			case 'jslibs' :
				$isapps = false;
				require_once __ROOT_DIR.'/core/routes/route-jslibs.php';
				break;					

			case 'public' :
				$isapps = false;
				require_once __ROOT_DIR.'/core/routes/route-public.php';				
				break;


			case 'images' :
				$isapps = false;
				require_once __ROOT_DIR.'/core/routes/route-images.php';
				break;	


			case 'favicon.ico' :
				$isapps = false;
				require_once __ROOT_DIR.'/core/routes/route-favicon.php';
				break;	

				
			case 'manifest.json' :
				$isapps = false;
				require_once __ROOT_DIR.'/core/routes/route-manifest.php';
				break;	


			case 'info' :
				phpinfo();
				die();
	
			default :
				$redirectsourcepath = __ROOT_DIR . '/public/redirect.html';
				$redirectsourcepath_local = __LOCAL_PUBLIC_DIR. '/redirect.html';
				if (is_file($redirectsourcepath_local)) {
					$redirectsourcepath = $redirectsourcepath_local;
				}
				require_once $redirectsourcepath;

				$startmodule = __STARTMODULE; 
				echo "<script>location.href='index.php/module/$startmodule'</script>";
				die();
				
		}


		if (!is_object($ROUTER)) {
			$ROUTER = new \FGTA4\routes\Route();
		}


		$ROUTER->configuration = $configuration;
		$ROUTER->SendHeader();

		$reqinfo = $ROUTER->PrepareRequestInfo($reqs, $isapps);

		if ($isapps) {
			//cek apakah ada dbconfig di ovveride di appsgroup
			if (is_file($reqinfo->appgroupdbconfigpath)) {
				include_once $reqinfo->appgroupdbconfigpath;
			}

			$currentapi = $reqinfo->modulefullname."/".$reqinfo->modulerequestinfo;
			$ROUTER->auth = new WebAuth();
			if ($usesession) {
				if ($currentapi!=API_LOGIN_URL) {
					$ROUTER->auth->SessionCheck(); // selain API untuk login, harus dicek session nya
				} 
			}

			if ($reqinfo->moduleconfig->title=='Container') {
				$reqinfo->moduleconfig->title = $configuration->basetitle;
			}
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
