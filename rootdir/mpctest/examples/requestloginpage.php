<?php
/**
 * 
 * Nyoba library TransFashion\MPC -> Halaman Login
 * 
 * Testing untuk mendapatkan secure page halaman login
 * output berupa url, yang akan dipanggil dari browser sebagai halaman login
 * setelah login berhasil, halaman akan di redirect ke callback url
 *
 */


\date_default_timezone_set('Asia/Jakarta');

require_once __DIR__ . '/_config.php';
require_once __DIR__ . '/../mpcconnector.php';

use \TransFashion\MPC\MPCConnector;


try {
	$mpc = new MPCConnector($config);

	$loginurl = $mpc->RequestAuthenticationPage();

	echo $loginurl;

	echo "\r\n\r\n";
} catch (\Exception $ex) {
	echo "\r\n\033[31mERROR \033[0m\r\n";
	echo $ex->getMessage();
	echo "\r\n\r\n\r\n";
}
























































