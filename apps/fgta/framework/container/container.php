<?php namespace FGTA4\module; if (!defined('FGTA4')) { die('Forbiden'); } 


class Container extends WebModule {
	
	public function LoadPage() {
		$this->incontainer = true;
	}
}

$MODULE = new Container();