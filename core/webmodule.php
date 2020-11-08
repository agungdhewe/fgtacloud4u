<?php namespace FGTA4\module;

if (!defined('FGTA4')) {
	die('Forbiden');
}

class WebModule {
    public function __call($method, $args)
    {
        if (isset($this->$method)) {
            $func = $this->$method;
            return call_user_func_array($func, $args);
        }
	}
	
	
	public function Render($content, $template) {
		require_once $template;
	}

	public function getParameter() {


		$parameter = new \stdClass;
		if (property_exists($this->reqinfo->moduleconfig->variance, $this->reqinfo->variancename)) {
			$variancename = $this->reqinfo->variancename;
			$variancedata = $this->reqinfo->moduleconfig->variance->{$variancename};
			if (property_exists($variancedata, 'parameter')) {
				$parameter = $variancedata->parameter;
			}
		}
		return $parameter;
	}


	public function BeginForm($name, $title) {
		echo "<div id=\"$name\" class=\"pagepanel\">\r\n";
		echo "<div id=\"$name-title\" class=\"pagetitle\">$title</div>\r\n";
		echo "<form id=\"$name-form\">\r\n";
		echo "<button type=\"submit\" disabled style=\"display: none\" aria-hidden=\"true\"></button>\r\n";
		echo "<div class=\"form_area\">\r\n";
		return $name;
	}

	public function EndForm() {
		echo "</div>\r\n";
		echo "</form>\r\n";
		echo "</div>\r\n";
	}

}
