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
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDPzoGsfEUUlMQq
hYoTEGMgK+/F+H2cEuF7OfaaBih33t+RwgzE7rjXmSJulWYZ/vMdml9LGIm6fu+C
jc3ZCBTVSCjghPcrCzJ3GTE2foHl83PJiYoxIQylpkpWWdAVfKo2YlkTP21+FTpL
2u8+xOeShCLDn+mkhAqP2e4g2i9zA79ltfPCMjbDIvydaXjenWsjDoKEGdavO+AN
Y4gkEK4Ejc33/mn7u6pH/YSF9CCgjxV4UayyXiuBagU1x3SJeIhSsKZfD8Bev4AU
0ASMoYBMbWqwF4FFZOC1pk0h7pKNTqoNzGyWL1cB4mz1+DcWC0m6Fvy+g0tW6kKE
xHM69MJBAgMBAAECggEAGXCHcW05K77WkPoOIC1WZT7buJmmDvBEyEgdR1fPpnUT
W42s8ILlAAfQLkd921rZulsGpXPYkIsvmQTxGUui+UU/M9UzSQKy59+epbQxBMyb
9SUwVLleCf1khlOyZJ8BW20IyJFwPwosO9MOjNmgG9CvTNGL0ccUX+3m+ACd5G9t
gezZ7/WXVq6SBDPfeRRyiSRrUOBWgR4LV98pY4ucsWPx+MlRDyCOWa4rhANRhIJC
vnZ+kDVZYjy0aAnmeza8DWSZNI6eD+A8x6crDrIsjsjhRyhmEev6Kcy/npb2eywS
Im2XNmgEj1VLJRxlnrSmX7HJ/PzCufemwFHXzJZAAQKBgQDu9gVJmjU5wLqq3UJW
UUe8o2a0NhZOtINIf/zHBtXU6vmcDh5EpjFjk78Oc1SXgvnZcMR/RwArxDEgIO0a
cYORUmz219bke4Xp7GbNfywDjAQ9hRevqC6RoVdDdH2znn49cQ1jGtUpqFc9leWB
FhfT3hpN2x8LJqz+qpO2QTELQQKBgQDen8va2rCGz/7O7xfs0fCj8zqJkJ4M/Ysb
p73S3VFNydHcsfaM5OqPYjD1MH6fCsOe/GA/74i0i2kenshWzarls+MctpyNcPva
5EnbxHIIeq1k8UFyY75tRYvHGyejnHD6E95ZuzF+xLptCoJ+ghB2ZAnnPtEZVTV9
CGgQNej3AQKBgCf5KatFS5AMqG06tAUidaCdqOmOfq7NzYRMPKnCf/StFfI//lo3
ft2McpJlQopR05/HGGe+Jc4sdJdOSrt4r6yYoDeupXj1HNKjxBKuKluxiWgNIog0
1w1vctyK2Rg59B4tEjM44t2kFmvr7kdovbWoWrgZZpkD8D5tpGYBg8XBAoGBAMQU
pN2nfpHPAxRKfJ0msDgHVEiz6rFwY6TBEq12J1VHbCNhT9H7EimmB4793pjAR1px
2WiW1qaGn9jLa5Mg5OQak+/HW44stHewWOlLVlDnlG9zGvzgo2nlNl7xKPGvKcbp
1w7blJWeOsEt35ADiPJt3Fcj+dHBPjJZRCb7BK0BAoGALtAQghEPgZcDUyJ2DN5P
pCHjP6yruPZxXs/KQ1RJqhAOFaqnd6c1npUeSatHLpYC3R8s3GpsRhlPpAJ9MAAK
boTOGalJy+xrclwRbPRPtAyS95ywRktzoBqghXNIG3mVb10V5i4fyyF6b0CIGl4+
NX5SdXIRaF3e27AB3fm00Ds=
-----END PRIVATE KEY-----';



$config = (object)[
	'ApplicationId' => '50002CTD01',
	'ApplicationSecret' => '7spli0xqi1ppr6w3gffr567wotq055l2',
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




