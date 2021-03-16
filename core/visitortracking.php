<?php namespace FGTA4\utils;


class VisitorTracking
{
    /** @var null|string $continent */
    public $continent       = null;
    /** @var null|string $continent_code */
    public $continent_code  = null;
    /** @var null|string $country_name */
    public $country         = null;
    /** @var null|string $country_code */
    public $country_code    = null;
    /** @var null|string $state */
    public $state           = null;
    /** @var null|string $state_code */
    public $state_code      = null;
    /** @var null|string $city */
    public $city            = null;
    /** @var null|string $postal_code */
    public $postal_code     = null;
    /** @var null|string $latitude */
    public $latitude        = null;
    /** @var null|string $longitude */
    public $longitude       = null;
    /** @var null|string $metro_code */
    public $metro_code      = null;
    /** @var null|string $timezone */
    public $timezone        = null;
    /** @var null|string $datetime */
    public $datetime        = null;
    /** @var mixed|string|null $ip */
    public $ip              = null;
    /** @var null|\stdClass $browser */
    public $browser         = null;


    private $error_handler  = null;

    /**
     * Stalk constructor.
     *
     * @param function|null $error_handler
     * @param string|null   $ip
     */
    public function __construct($error_handler = null, string $ip = null)
    {
        $this->ip = $ip == null ? $this->getIp() : $ip;
		$this->error_handler = $error_handler;
		$this->browser = (object) $this->getBrowser();
        $this->locate();
    }

    /**
     * Gets clients IP address.
     *
     * @return string
     */
    private function getIp(): string
    {
        $client  = @$_SERVER['HTTP_CLIENT_IP'];
        $forward = @$_SERVER['HTTP_X_FORWARDED_FOR'];
        $remote  = $_SERVER['REMOTE_ADDR'];

        if (filter_var($client, FILTER_VALIDATE_IP)) {
            $ip = $client;
        }
        elseif (filter_var($forward, FILTER_VALIDATE_IP)) {
            $ip = $forward;
        }
        else {
            $ip = $remote;
        }

        return $ip;
    }

    /**
     * Gets clients browser's information.
     *
     * @return array
     */
    private function getBrowser(): array
    {
        $u_agent      = $_SERVER['HTTP_USER_AGENT'];
        $platform     = 'Unknown';
        $browser_name = 'Unknown';
        $version      = null;

        if (preg_match('/linux/i', $u_agent)) {
            $platform = 'linux';
        }
        elseif (preg_match('/macintosh|mac os x/i', $u_agent)) {
            $platform = 'mac';
        }
        elseif (preg_match('/windows|win32/i', $u_agent)) {
            $platform = 'windows';
        }
        if (preg_match('/MSIE/i', $u_agent) && ! preg_match('/Opera/i', $u_agent)) {
            $browser_name = 'Internet Explorer';
            $ub = "MSIE";
        }
        elseif (preg_match('/Firefox/i', $u_agent)) {
            $browser_name = 'Mozilla Firefox';
            $ub = "Firefox";
        }
        elseif (preg_match('/Chrome/i', $u_agent)) {
            $browser_name = 'Google Chrome';
            $ub = "Chrome";
        }
        elseif (preg_match('/Safari/i', $u_agent)) {
            $browser_name = 'Apple Safari';
            $ub = "Safari";
        }
        elseif (preg_match('/Opera/i', $u_agent)) {
            $browser_name = 'Opera';
            $ub = "Opera";
        }
        elseif (preg_match('/Netscape/i', $u_agent)) {
            $browser_name = 'Netscape';
            $ub = "Netscape";
        }

        $known   = ['Version', $ub, 'other'];
        $join    = implode('|', $known);
        $pattern = '#(?<browser>' . $join . ')[/ ]+(?<version>[0-9.|a-zA-Z.]*)#';

        preg_match_all($pattern, $u_agent, $matches);
        $i = count($matches['browser']);

        if ($i != 1) {
            if (strripos($u_agent, 'Version') < strripos($u_agent, $ub)) {
                $version = $matches['version'][0];
            }
            else {
                $version = $matches['version'][1];
            }
        }
        else {
            $version = $matches['version'][0];
        }

        if (! $version) {
            $version = '?';
        }

        return ['name' => $browser_name, 'version' => $version, 'OS' => $platform];
    }

    /**
     * Key value pair of all stack attribute.
     *
     * @return array
     */
    public function __toArray(): array
    {
        $properties = get_object_vars($this);
        $properties['browser'] = (array) $properties['browser'];

        return $properties;
    }

    /**
     * Makes an API request to keycdn
     */
    private function locate()
    {
        $curl = curl_init();
        curl_setopt_array($curl, [
            CURLOPT_RETURNTRANSFER => 1,
            CURLOPT_FOLLOWLOCATION => 1,
			CURLOPT_HTTPHEADER => array('user-agent: keycdn-tools:http://local.fgta.net/'),
			CURLOPT_URL  => 'https://tools.keycdn.com/geo.json?host=' . $this->ip,
		]);

        $response = curl_exec($curl);
        curl_close($curl);
        $status   = json_decode($response, true);

        if ($status['status'] == 'error') {
            $error_handler = $this->error_handler;
            if ($error_handler) {
                $status['ip'] = $this->ip;
                $error_handler($status);
            }

            return;
        }

        $response_array         = $status['data']['geo'];
        $this->country          = $response_array['country_name'];
        $this->country_code     = $response_array['country_code'];
        $this->state            = $response_array['region_name'];
        $this->state_code       = $response_array['region_code'];
        $this->city             = $response_array['city'];
        $this->postal_code      = $response_array['postal_code'];
        $this->continent        = $response_array['continent_name'];
        $this->continent_code   = $response_array['continent_code'];
        $this->latitude         = $response_array['latitude'];
        $this->longitude        = $response_array['longitude'];
        $this->metro_code       = $response_array['metro_code'];
        $this->timezone         = $response_array['timezone'];
        $this->datetime         = $response_array['datetime'];
    }
}