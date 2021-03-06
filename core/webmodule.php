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



	public function Section($sectionname, $cancollapse=false, $collapse=false) {
		$cb = "";
		if ($cancollapse) {
			if ($collapse) {
				$cb = "<div class=\"fgta-toggle-link\" onclick=\"togleview(this)\" style=\"cursor:pointer\">show</div>";
			} else {
				$cb = "<div class=\"fgta-toggle-link\" onclick=\"togleview(this)\" style=\"cursor:pointer\">hide</div>";
			}
		}
		return "
		<div class=\"form_row\" style=\"border-bottom: 1px solid #ccc; display: flex; justify-content: space-between\">
			<div style=\"width: 150px; background: linear-gradient(to right, rgba(204,204,204,1) 0%,rgba(204,204,204,0.67) 33%,rgba(204,204,204,0) 100%); padding-left: 5px\">
				<div style=\"background-color: #ccc; width: 150px; font-weight: bold; padding: 4px; transform: skew(20deg,0deg)\"><div style=\"transform: skew(-20deg,0deg)\">{$sectionname}</div></div>
			</div>
			$cb
		</div>	 		
		";
	}

}
