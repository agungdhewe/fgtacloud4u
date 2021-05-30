<?php

/*
https://openapi.allobank.com:8001/cas-web/#/pages/fio/login/login?nonceCode=5tm69f06&channelId=50002CTD01&equipmentId=6407942390612938f6idxoqy&channelType=1



accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOiIwMDAwMDAiLCJleHBpciI6MzYwMCwidXNlcl9uYW1lIjoiMDg1ODg1NTI1NTY1Iiwibm9uY2VDb2RlIjoicjM3bnBtcTciLCJyZWRpcmN0VXJsIjoiaHR0cDovL2xvY2FsaG9zdDozMDAzL2NhbGxiYWNrL2F1dGgiLCJhdXRob3JpdGllcyI6WyJhZG1pbmlzdHJhdG9yIl0sImNsaWVudF9pZCI6InN3b3JkIiwibGljZW5zZSI6InBvd2VyZWQgYnkgYmxhZGV4IiwidXNlcl9pZCI6IjAwMDIwMTAwMDAwMDAwNzQ5MSIsInNjb3BlIjpbImFsbCJdLCJkZXRhaWwiOnsib3NUeXBlIjpudWxsLCJkZXZpY2VJZCI6bnVsbCwiZXF1aXBtZW50SWQiOiI2NDA3OTQyMzkwNjEyOTM4ZjZpZHhvcXkifSwiZXhwIjoxNjIxNTc0MjU2LCJqdGkiOiI2ZWI4OTk0ZC1hNDc3LTQ5YTMtYmVlOC05ZTFmODlmZmE5YjAifQ.xbVYzaVd5g8nmcAZYb-CdsMDdRehBLQJHl0pYEpWkCg
&tokenType=bearer
&tenantId=000000
&expiresIn=3599
&nonceCode=r37npmq7

*/

// test token
$tokenid = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOiIwMDAwMDAiLCJleHBpciI6MzYwMCwidXNlcl9uYW1lIjoiMDg1ODg1NTI1NTY1Iiwibm9uY2VDb2RlIjoicjM3bnBtcTciLCJyZWRpcmN0VXJsIjoiaHR0cDovL2xvY2FsaG9zdDozMDAzL2NhbGxiYWNrL2F1dGgiLCJhdXRob3JpdGllcyI6WyJhZG1pbmlzdHJhdG9yIl0sImNsaWVudF9pZCI6InN3b3JkIiwibGljZW5zZSI6InBvd2VyZWQgYnkgYmxhZGV4IiwidXNlcl9pZCI6IjAwMDIwMTAwMDAwMDAwNzQ5MSIsInNjb3BlIjpbImFsbCJdLCJkZXRhaWwiOnsib3NUeXBlIjpudWxsLCJkZXZpY2VJZCI6bnVsbCwiZXF1aXBtZW50SWQiOiI2NDA3OTQyMzkwNjEyOTM4ZjZpZHhvcXkifSwiZXhwIjoxNjIxNTc0MjU2LCJqdGkiOiI2ZWI4OTk0ZC1hNDc3LTQ5YTMtYmVlOC05ZTFmODlmZmE5YjAifQ.xbVYzaVd5g8nmcAZYb-CdsMDdRehBLQJHl0pYEpWkCg";
$equipmentId = "6407942390612938f6idxoqy";


\date_default_timezone_set('Asia/Jakarta');


require_once __DIR__ . '/_config.php';
require_once __DIR__ . '/../mpcconnector.php';

use \TransFashion\MPC\MPCConnector;



try {
	$mpc = new MPCConnector($config);

	$mpcprofile = $mpc->AuthorizeTokenId($tokenid, $equipmentId);
	print_r($mpcprofile);

	echo "\r\n\r\n";
} catch (\Exception $ex) {
	echo "\r\n\033[31mERROR \033[0m\r\n";
	echo $ex->getMessage();
	echo "\r\n\r\n\r\n";
}

