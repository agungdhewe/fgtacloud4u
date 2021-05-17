<?php
/**
 * 
 * Nyoba library TransFashion\MPC
 * 
 * 
 */


\date_default_timezone_set('Asia/Jakarta');


require_once __DIR__ . '/../mpcconnector.php';

use \TransFashion\MPC\MPCConnector;


$privatekey = '-----BEGIN PRIVATE KEY-----
MIICeAIBADANBgkqhkiG9w0BAQEFAASCAmIwggJeAgEAAoGBALx3pq2z4LxhA2Ff
5ZI8uvWATwGNyxgQqq2MHZdJ/85ElM15fmWRfapx5acOHFIpBADmUbopyNzfMAXT
MNaOxUUcbaGTicE1ajAicjIl+cf5BPdblALMSMKuGO+J0cxA7toan4Umoy7o6wwp
sSBVSSkpODnEzUAGrLJTVyJqok21AgMBAAECgYEApt1lRPwzKXbXkFpgn0aH3Z95
1A1f2PHAvCGHfZC2HUGZYgeEwpa7ZbKsO2mB57iK4+UITUR7pBszoKSo4/7KZu2m
GidnK30ry1QhDmjI75Kwf8uMf5SUPENrj7bO9TBQeU6DbZqVpSVvPeoPYsZKeV/H
37OMdEyT09rGu/p5K80CQQDpWM4I0dy3cmK8JUVFzMmyp7sKP3jhB1qw01L3Papm
W/wlVYJFh5XW0l1rF/29JCoEOHasVFdP2d5UAF+Ybg/fAkEAzsN9VM7ZHL8My17t
h4NK7cBEZ4wWmuKHeD7O0WaorPOqZFwRj+I/usLlb/oZtK31/R1OcFxkKKL1CjGo
eO3E6wJBAKZ2U4S3MV0snILbk69XiAuK3ENTREhDls7N8kGuHAEpXZbEiUpQjvPQ
3hOn6bskMVURcpc9E4xDP/dszMVQvsECQQCLk5o6svwLlMj9TNLKJQ5i2uUShZYI
7p0Gxld1Mnjxb/f5kdFlMRVWbRTXd5z8xGaHfM4juar/Z6pFPGp/X/sLAkBOvKZC
UNbpJAd83eVOBw8B13UuVB8J+xO9jINtFHRa0mqUgegf3Bx05oLxJFQqhFJ7eAaZ
dvFKY7BzxquO8qcv
-----END PRIVATE KEY-----';



$config = (object)[
	'ApplicationId' => '50002FMD01',
	'ApplicationSecret' => 'x6cwophnpnqnocodt08n1gva8zs0ahlq',
	'PrivateKey' => $privatekey
];




try {
	$mpc = new MPCConnector($config);

	$loginurl = $mpc->RequestAuthenticationPage();

	echo $loginurl;


	// $profile = $mpc-> getUserProfile($phonenumber);
	// $profile->name;


} catch (\Exception $ex) {
	echo "\r\n\033[31mERROR \033[0m\r\n";
	echo $ex->getMessage();
	echo "\r\n\r\n\r\n";
}




