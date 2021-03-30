<?php namespace FGTA4\utils;

require_once __DIR__ . '/httperror.php';
require_once __DIR__ . '/httpexception.php';


class Http
{
    private $_host = null;
    private $_port = null;
    private $_user = null;
    private $_pass = null;
    private $_protocol = null;

    const HTTP  = 'http';
    const HTTPS = 'https';
    const DEF_PORT = 80;
    
    
    private $_connMultiple = false;
    /**
     * Factory of the class. Lazy connect
     *
     * @param string $host
     * @param integer $port
     * @param string $user
     * @param string $pass
     * @return http
     */
    static public function connect($host, $port = self::DEF_PORT, $protocol = self::HTTP)
    {
        return new self($host, $port, $protocol, false);
    }
    
    /**
     *
     * @return http
     */
    static public function multiConnect()
    {
        return new self(null, null, null, true);
    }

    private $_append = array();
    public function add($http)
    {
        $this->_append[] = $http;
        return $this;
    }
    
    private $_silentMode = false;
    /**
     *
     * @param bool $mode
     * @return http
     */
    public function silentMode($mode=true)
    {
        $this->_silentMode = $mode;
        return $this;    
    }
    
    protected function __construct($host, $port, $protocol, $connMultiple)
    {
        $this->_connMultiple = $connMultiple;
        
        $this->_host     = $host;
        $this->_port     = $port;
        $this->_protocol = $protocol;
    }
    
    /**
     *
     * @param string $user
     * @param string $pass
     * @return http
     */
    public function setCredentials($user, $pass)
    {
        $this->_user = $user;
        $this->_pass = $pass;
        return $this;
    }

    const POST   = 'POST';
    const GET    = 'GET';
    const DELETE = 'DELETE';
    const PUT    = 'PUT';

    private $_requests = array();
    
    /**
     * @param string $type
     * @param string $url
     * @param array $params
     * @return http
     */
    public function custom($type, $url, $params=array())
    {
        $this->_requests[] = array($type, $this->_url($url), $params);
        return $this;
    }
    
    /**
     * @param string $url
     * @param array $params
     * @return http
     */
    public function put($url, $params=array())
    {
        $this->_requests[] = array(self::PUT, $this->_url($url), $params);
        return $this;
    }
    
    /**
     * @param string $url
     * @param array $params
     * @return http
     */
    public function post($url, $params=array())
    {
        $this->_requests[] = array(self::POST, $this->_url($url), $params);
        return $this;
    }

    /**
     * @param string $url
     * @param array $params
     * @return http
     */
    public function get($url, $params=array())
    {
        $this->_requests[] = array(self::GET, $this->_url($url), $params);
        return $this;
    }
    
    /**
     * @param string $url
     * @param array $params
     * @return http
     */
    public function delete($url, $params=array())
    {
        $this->_requests[] = array(self::DELETE, $this->_url($url), $params);
        return $this;
    }
    
    public function _getRequests()
    {
        return $this->_requests;
    }
    
    /**
     * PUT request
     *
     * @param string $url
     * @param array $params
     * @return string
     */
    public function doPut($url, $params=array())
    {
        return $this->_exec(self::PUT, $this->_url($url), $params);
    }
    
    /**
     * POST request
     *
     * @param string $url
     * @param array $params
     * @return string
     */
    public function doPost($url, $params=array())
    {
        return $this->_exec(self::POST, $this->_url($url), $params);
    }
    
    /**
     * Custom request
     *
     * @param string $type
     * @param string $url
     * @param array $params
     * @return string
     */
    public function doCustom($type, $url, $params=array())
    {
        return $this->_exec($type, $this->_url($url), $params);
    }

    /**
     * GET Request
     *
     * @param string $url
     * @param array $params
     * @return string
     */
    public function doGet($url, $params=array())
    {
        return $this->_exec(self::GET, $this->_url($url), $params);
    }
    
    /**
     * DELETE Request
     *
     * @param string $url
     * @param array $params
     * @return string
     */
    public function doDelete($url, $params=array())
    {
        return $this->_exec(self::DELETE, $this->_url($url), $params);
    }

    private $_headers = array();
    /**
     * setHeaders
     *
     * @param array $headers
     * @return Http
     */
    public function setHeaders($headers)
    {
        $this->_headers = $headers;
        return $this;
    }

    /**
     * Builds absolute url 
     *
     * @param string $url
     * @return string
     */
    private function _url($url=null)
    {
		$ret = "{$this->_protocol}://{$this->_host}:{$this->_port}{$url}";
        return $ret;
    }

    const HTTP_OK = 200;
    const HTTP_CREATED = 201;
    const HTTP_ACEPTED = 202;

    /**
     * Performing the real request
     *
     * @param string $type
     * @param string $url
     * @param array $params
     * @return string
     */
    private function _exec($type, $url, $params = array())
    {
        $headers = $this->_headers;
        $s = curl_init();
        
        if(!is_null($this->_user)){
           curl_setopt($s, CURLOPT_USERPWD, $this->_user.':'.$this->_pass);
        }

           curl_setopt($s, CURLOPT_HTTPHEADER, $this->_buildHeadersForCurl($headers));
        switch ($type) {
            case self::DELETE:
                curl_setopt($s, CURLOPT_URL, $url . '?' . http_build_query($params));
                curl_setopt($s, CURLOPT_CUSTOMREQUEST, self::DELETE);
                break;
            case self::PUT:
                curl_setopt($s, CURLOPT_URL, $url);
                curl_setopt($s, CURLOPT_CUSTOMREQUEST, self::PUT);
                curl_setopt($s, CURLOPT_POSTFIELDS, $params);
                break;
            case self::POST:
                curl_setopt($s, CURLOPT_URL, $url);
                curl_setopt($s, CURLOPT_POST, true);
                curl_setopt($s, CURLOPT_POSTFIELDS, $params);
                break;
            case self::GET:
                curl_setopt($s, CURLOPT_URL, $url . '?' . http_build_query($params));
                break;
            default:
                curl_setopt($s, CURLOPT_URL, $url . '?' . http_build_query($params));
                curl_setopt($s, CURLOPT_CUSTOMREQUEST, $type);
                break;
        }
        curl_setopt($s, CURLOPT_RETURNTRANSFER, true);
        $_out = curl_exec($s);
        $status = curl_getinfo($s, CURLINFO_HTTP_CODE);
        curl_close($s);
        switch ($status) {
            case self::HTTP_OK:
            case self::HTTP_CREATED:
            case self::HTTP_ACEPTED:
                $out = $_out;
                break;
            default:
                if (!$this->_silentMode) {
                    throw new HttpException("http error: {$status}", $status);
                }
        }
        return $out;
    }
    
    private function _buildHeadersForCurl(array $headers)
    {
        $out = array();
        foreach ($headers as $key => $value) {
            $out[] = $key . ": " . $value;
        }
        return $out;
    }
    
    public function run()
    {
        if ($this->_connMultiple) {
            return $this->_runMultiple();
        } else {
            return $this->_run();
        }
    }
    
    private function _runMultiple()
    {
        $out= null;
        if (count($this->_append) > 0) {
            $arr = array();
            foreach ($this->_append as $_append) {
                $arr = array_merge($arr, $_append->_getRequests());
            }
            
            $this->_requests = $arr;
            $out = $this->_run();
        }
        return $out;
    }
    
    private function _run()
    {
        $headers = $this->_headers;
        $curly = $result = array();

        $mh = curl_multi_init();
        foreach ($this->_requests as $id => $reg) {
            $curly[$id] = curl_init();
            
            $type   = $reg[0];
            $url    = $reg[1];
            $params = $reg[2];
            
            if(!is_null($this->_user)){
               curl_setopt($curly[$id], CURLOPT_USERPWD, $this->_user.':'.$this->_pass);
            }
            
            curl_setopt($curly[$id], CURLOPT_HTTPHEADER, $this->_buildHeadersForCurl($headers));
            
            switch ($type) {
                case self::DELETE:
                    curl_setopt($curly[$id], CURLOPT_URL, $url . '?' . http_build_query($params));
                    curl_setopt($curly[$id], CURLOPT_CUSTOMREQUEST, self::DELETE);
                    break;
                case self::PUT:
                    curl_setopt($curly[$id], CURLOPT_URL, $url);
                    curl_setopt($curly[$id], CURLOPT_CUSTOMREQUEST, self::PUT);
                    curl_setopt($curly[$id], CURLOPT_POSTFIELDS, $params);
                    break;
                case self::POST:
                    curl_setopt($curly[$id], CURLOPT_URL, $url);
                    curl_setopt($curly[$id], CURLOPT_POST, true);
                    curl_setopt($curly[$id], CURLOPT_POSTFIELDS, $params);
                    break;
                case self::GET:
                    curl_setopt($curly[$id], CURLOPT_URL, $url . '?' . http_build_query($params));
                    break;
                default:
                    curl_setopt($curly[$id], CURLOPT_URL, $url. '?' . http_build_query($params));
                    curl_setopt($curly[$id], CURLOPT_CUSTOMREQUEST, $type);
            }
            curl_setopt($curly[$id], CURLOPT_RETURNTRANSFER, true);
            curl_multi_add_handle($mh, $curly[$id]);
        }
    
        $running = null;
        do {
            curl_multi_exec($mh, $running);
            sleep(0.2);
        } while($running > 0);
    
        foreach($curly as $id => $c) {
            $status = curl_getinfo($c, CURLINFO_HTTP_CODE);
            switch ($status) {
                case self::HTTP_OK:
                case self::HTTP_CREATED:
                case self::HTTP_ACEPTED:
                    $result[$id] = curl_multi_getcontent($c);
                    break;
                default:
                    if (!$this->_silentMode) {
                        $result[$id] = new HttpError($status, $type, $url, $params);
                    }
            }
            curl_multi_remove_handle($mh, $c);
        }

        curl_multi_close($mh);
        return $result;
    }
}