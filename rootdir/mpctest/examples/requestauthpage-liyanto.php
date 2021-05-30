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
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDO8UPnEpYkF+Jm
dEVPk4CI7La5sDkNEK5H00G0m8J7b7znZJZwyWkAle6HWYfYXfRT+bVGB04FLj8y
j4c1cOwM+Uu4TDyUWKN5/YZejUL4Z7c3UACFcvfXiyv8ihTNPugD4weGvAlIgKQV
r1GgoIy4J3+Wu+n/AgmNNVc0cM12230SA2KbdKLSuFfNzs/7Onyoii0PjY47ZW7h
eZ30dTtopVq24u+pCVd86dq++QebNY4OBFpTvA4OPrBuCTKqOrSlaeaJUu19CmI3
7V5WHHvKJOkldPdUMWICa8FBTJh7de2e+yPe/XAch8qi3bRbMC1XGqeoEllE670t
OOfnuixtAgMBAAECggEAc4ARKA0lo2t5Pzmx3aIz4ThNHAKRNQuUWh480/MDbyWE
R5nKpZSkeGE2SnDb8xUtYxlB5Z36G8YeG7gj/N3TwcH6UxipzxpR06p+rpMlR8OL
bOHICLOMRM82c7MVvSBZGqJB9x9IByFVc4zwgDhbkgTpn1WuWlfmwNt+mpRC+Qyy
5623kE/1H7OZdOC250KXog+XkgGelOqu+iUbgCDx6gHFg7QxD88lL987RevqmCBV
gLGhdIGCdh7uYyLAojWMWIQblnPS3uMgzoHdMLzr8ML8pJU8V83y9M5Y5UNZVas9
PAnTIGbRxWqkEplBir7wt4lBTz00DGNlHdLm7tc6+QKBgQDwtWk79V7Y3wNregFM
plKtf73C/cGBdfwUkTYAzMTF7LYsqa8TMrZhAEBTgbUac3nbk0HbjN1J4Ogq3r0Z
Rq41AQJtodwEz9eDZ/O8OLtgx/zBU5nwCYyXOpSXO4oJJpzR6K9tC4iBTXVH7PCC
yof67BG120lqJVotJYLNYd2VWwKBgQDcFrjsORqizaumEhVZgeIJN2Oo5J5tj1u/
e0cdoRmxFCi9q2BP1Ff+tdpfGbena2Bk6Yq6a05ONXmKNNn+SHLLmymlCMhZ2vFH
wQyS7/FUsbwc9fEjVdNe06UuZHcb+JYuEV6277fTW7Aq9zrAsHhNIs7ghgm7wWIo
FxvDFRjH1wKBgQC79IvVm8WSBqH+/GejWIRaodKlPcwpsN1DmhfXDA3ilvGxclYY
4ZJzr+SK0E9/9geDIztbmmT42TuwrfhukjhZfw5MWQUaZMjd/P/fS1VVPxPoScV8
H5i+RandZUpl1tbBObYxqb3PaZJYtXUgS9FeZ5N0s2RiFASUGCRJB1Ak3QKBgQDM
IWMY7gnvcFVBLcqRfy8YH0CXGJx8v5d4LS4TpCVBIZJ8AOTOhgOroh3NUPwPEz+P
uTDLoNU7Isv8zPJXr/iRMfPZNyEkfjaFt98itdufE06HifFDNcpbTHALbHExB0q7
pa60e/iC16q43x+mMscRvDQm+Qs0ErQovO4p7XpTdwKBgATL8qHGSwwM9iFIYKhV
jbTDLJYCh6imykTruhVbOUF4B9re93GHETQ+3N9GGnhg1BPs+kob1jQwE/N0TyrH
8kRMOYwX/QrxurpvXjASbnrZ7tAzsxLXocBeUsDXnjeLgt49H9SUKRFERvejL7tt
zBXvxgn5Y1V09sw+LxFLu44H
-----END PRIVATE KEY-----';



$config = (object)[
 	'ApplicationId' => '50002TEN01',
 	'ApplicationSecret' => '9e2ea0b961ef0fc60f7bc31240479b66',
 	'PrivateKey' => $privatekey
];



try {
	$mpc = new MPCConnector($config);

	$loginurl = $mpc->RequestAuthenticationPage();

	echo $loginurl;

} catch (\Exception $ex) {
	echo "\r\n\033[31mERROR \033[0m\r\n";
	echo $ex->getMessage();
	echo "\r\n\r\n\r\n";
}




