<?php namespace FGTA4;

define('DB_CONFIG', [
	'FGTACLOUD' => [
		'DSN' => "mysql:host=localhost;dbname=fgtadb",
		'user' => "root",
		'pass' => ""
	],

	'FGTAFS' => [
		'host' => 'localhost',
		'port' => '5984',
		'protocol' => 'http',
		'username' => null,
		'password' => null,
		'database' => 'fgtadb'		
	]

]);



$GLOBALS['MAINDB'] = 'FGTACLOUD';
$GLOBALS['MAINDBTYPE'] = 'mariadb';

$GLOBALS['MAIN_USERTABLE'] = 'fgtadb.fgt_user';
