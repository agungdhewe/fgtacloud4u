<?php
$strPrivateKey = '-----BEGIN PRIVATE KEY-----
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

$appId = '50002CTD01';
$appSecret = '7spli0xqi1ppr6w3gffr567wotq055l2';

$body = [
  "requestData" => [
	"codeChallenge"=> "Rw8jFxj37tvlavKyqkm-xDP0ncoEBnYEAg2XuWB_R2w",
	"osType" => "",
	"idfa" => "",
	"imei"=> "",
  ],
  "transactionNo"=> "2009242AA01111400110123200000544",
];

$nonce = "81c05ee0038828e18b527ad699ab54da74f89706353e44a6324b620610ea3a66"; 

$timestamp = "1615879554866";//Date.now().toString()

//Use static body for example
$strBody = json_encode($body);

echo("\n== Body String ==\n");
echo($strBody);
echo("\n== End Body String ==\n");

$arr = [$appId, $nonce,$timestamp, $appSecret, $strBody];
// this is tricky, sorting must passing type of sorting
// 2 = SORT_STRING 
asort($arr,2);
$data = join('', $arr);

echo("\n== Data String ==\n");
echo($data);
echo("\n== End Data String ==\n");

// Hashing
$obj = hash('sha256', $data);
// hex to bin
$objBin = hex2bin($obj);
echo("\n== Digest as hex format ==\n");
echo($obj);
echo("\n== End Digest ==\n");

$encrypted = openssl_private_encrypt($objBin,$crypttext,$strPrivateKey);

if($encrypted){
  // bin2hex convertions
  $strSign = bin2hex($crypttext);
  echo("\n== Sign ==\n");
  echo($strSign);
  echo("\n== End Sign ==\n");

  // Header param
    $header = [
      'nonce' => $nonce, 
      'timestamp' => $timestamp,
      'appId' => $appId,
      'sign' => $strSign,
      'Content-Type' => 'application/json'
    ];

  var_dump($header);

}else {
  echo "Somethings wrong dude";
}