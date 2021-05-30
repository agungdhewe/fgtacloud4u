<?php
$file = __DIR__ . '/createidline.txt';
$fp = fopen($file, 'w+');

for ($i=0; $i<=1115; $i++) {
	$id = uniqid();
	fputs($fp, $id."\r\n");
}

fclose($fp);