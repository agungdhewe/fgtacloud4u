<?php

$svgFile = __DIR__ . '/test_icon.svg';
$svgDoc = new DOMDocument();
$svgDoc->load($svgFile);

$pagecolor="";
$svgEl = $svgDoc->documentElement;
foreach ($svgEl->childNodes as $el) {
	// echo $el->nodeName . "\r\n";
	if ($el->nodeName=='sodipodi:namedview') {
		$pagecolor = $el->getAttribute('pagecolor');
		break;
	}
}


echo $pagecolor;

