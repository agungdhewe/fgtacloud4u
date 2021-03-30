<?php namespace FGTA4;


class CouchDbException extends \Exception
{
	const ERROR_PARSING_OUTPUT = -1;
	const ERROR_WITH_RESULSET = -2;
	const ERROR_DRIVER_NOT_COMPATIBLE = -3;
	const NO_DATA_FOUND = 1;
}