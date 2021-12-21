<?php namespace FGTA4;

require_once __DIR__ . '/http.php';
require_once __DIR__ . '/couchdbexcdatanotfound.php';
require_once __DIR__ . '/couchdbexcindexduplication.php';
require_once __DIR__ . '/couchdbresultset.php';

use FGTA4\utils\Http;
use FGTA4\utils\HttpException;
use FGTA4\CouchDbDataNotFoundException;
use FGTA4\CouchDbIndexDuplicationException;
use FGTA4\CouchDbResultset;


class CouchDbClient {

	private $_config;


	function __construct($config) {
		$this->_config = $config;
	}

	private function ProcessError($ex) {
        switch ($ex->getCode()) {
            case HttpException::NOT_FOUND:
                throw new CouchDbDataNotFoundException('Data with spesifik index is not Found');
                break;
            case HttpException::CONFLICT:
                throw new CouchDbIndexDuplicationException('Duplicate Index');
                break;
            default:
                throw new CouchDbException($ex->getMessage(), $ex->getCode());
                break;
            
        }		
	} 

	public function get($id) {
		$conf = $this->_config;
		try {
			$id = urlencode($id);
			$result = Http::connect($conf->host, $conf->port, $conf->protocol)
				->setCredentials($conf->username, $conf->password)
				->doGet("/{$conf->database}/{$id}");
			return new CouchDbResultset($result);
		} catch (HttpException $ex) {
			$this->ProcessError($ex);
		} catch (\Exception $ex) {
			throw $ex;
		}	 
	}


	public function add($id, $doc) {
		$conf = $this->_config;
		try {
			$id = urlencode($id);
			$result = Http::connect($conf->host, $conf->port, $conf->protocol)
				->setCredentials($conf->username, $conf->password)
				->setHeaders(array('Content-Type' =>  'application/json'))
				->doPut("/{$conf->database}/{$id}", json_encode($doc));

			return new CouchDbResultset($result);
		} catch (HttpException $ex) {
			$this->ProcessError($ex);
		} catch (\Exception $ex) {
			throw $ex;
		}
	}


	public function update($id, $doc) {
		$conf = $this->_config;	
		try {
			$id = urlencode($id);
			$http = Http::connect($conf->host, $conf->port, $conf->protocol)
						->setCredentials($conf->username, $conf->password);

			$result = $http->doGet("/{$conf->database}/{$id}");
			$doctoupdate = (array) json_decode($result);
			unset($doctoupdate['_attachments']);
			unset($doctoupdate['_id']);
			$doc = (array)$doc;
			foreach ($doc as $key => $value) {
                $doctoupdate[$key] = $value;
            }
            $result = $http->setHeaders(array('Content-Type' =>  'application/json'))
                		->doPut("/{$conf->database}/{$id}", json_encode($doctoupdate));
			return new CouchDbResultset($result);	
		} catch (HttpException $ex) {
			$this->ProcessError($ex);
		} catch (\Exception $ex) {
			throw $ex;
		}			
	}


	public function remove($id) {
		$conf = $this->_config;	
		try {
			$id = urlencode($id);
			$doc = $this->get($id)->asObject();
			$result = Http::connect($conf->host, $conf->port, $conf->protocol)
				->setCredentials($conf->username, $conf->password)
				->doDelete("/{$conf->database}/{$id}", array('rev' => $doc->_rev));
			return new CouchDbResultset($result);	
		} catch (HttpException $ex) {
			$this->ProcessError($ex);
		} catch (\Exception $ex) {
			throw $ex;
		}			
	}


	public function addAttachment($id, $doc, $name, $attachmentdata, $overwrite=false) {
		$conf = $this->_config;	
		try {

			$rev = "";
			try {
				$currdoc = $this->get($id);
				if (!$overwrite) {
					throw new CouchDbIndexDuplicationException("Duplicate Index for id '$id'");
				}
				$res = $this->update($id, $doc);
				$rev = $res->asObject()->rev;
			} catch (CouchDbDataNotFoundException $ex) {
				$res = $this->add($id, $doc);
				$rev = $res->asObject()->rev;
			} catch (CouchDbIndexDuplicationException $ex) {
				$this->ProcessError($ex);
			} catch (\Exception $ex) {
				throw $ex;
			}
			
			$id = urlencode($id);
			$name = urlencode($name);
			$result = Http::connect($conf->host, $conf->port, $conf->protocol)
				->setCredentials($conf->username, $conf->password)
				->setHeaders(array('Content-Type' => 'application/octet-stream'))
				->doPut("/{$conf->database}/{$id}/{$name}?rev={$rev}", $attachmentdata);

			return new CouchDbResultset($result);	
		} catch (HttpException $ex) {
			$this->ProcessError($ex);
		} catch (\Exception $ex) {
			throw $ex;
		}
	}


	function getAttachment($id, $name) {
		$conf = $this->_config;	
		try {

			$result = $this->get($id);
			$doc = $result->asObject(); 

			$attachments = $doc->_attachments;
			if (!property_exists($attachments, $name)) {
				throw new CouchDbDataNotFoundException('Attachment tidak ditemukan');
			}

			$id = urlencode($id);
			$name = urlencode($name);
			$attachmentdata = Http::connect($conf->host, $conf->port, $conf->protocol)
				->setCredentials($conf->username, $conf->password)			
				->doGet("/{$conf->database}/{$id}/{$name}");

			unset($doc->_attachments);
			$doc->attachmentdata = $attachmentdata;
				
			return $doc;
		} catch (\Exception $ex) {
			throw $ex;
		}		
	}


}
