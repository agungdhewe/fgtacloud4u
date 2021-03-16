<?php

include('Crypt/RSA.php');

$rsa = new Crypt_RSA();

$rsa->setPrivateKeyFormat(CRYPT_RSA_PRIVATE_FORMAT_PKCS8);
$rsa->setPublicKeyFormat(CRYPT_RSA_PUBLIC_FORMAT_PKCS8);

extract($rsa->createKey());

echo $privatekey . "\r\n\r\n";
echo $publickey;

// http://phpseclib.sourceforge.net/rsa/intro.html

