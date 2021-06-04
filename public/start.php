<?php

define('__LOCAL_CURR',  'IDR');

ini_set("session.gc_maxlifetime", "65535");
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL & ~E_DEPRECATED & ~E_STRICT);
date_default_timezone_set('Asia/Jakarta');

define('__ROOT_DIR', realpath(dirname(__FILE__).'/..'));
define('__BASEADDRESS', $_SERVER['REQUEST_SCHEME'] ."://".  $_SERVER['SERVER_NAME'] . rtrim($_SERVER['SCRIPT_NAME'], '/index.php') .'/');
define('API_LOGIN_URL', 'fgta/framework/login/dologin');


$clientdir = realpath(dirname($_SERVER["SCRIPT_FILENAME"]));
define('__LOCALCLIENT_DIR', $clientdir);

