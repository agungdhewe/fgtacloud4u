<?php namespace FGTA4;


class CouchDbResultset {
    private $_data;

    function __construct($data)
    {
        $this->_data = $data;
    }

    public function asArray()
    {
        return (array) json_decode($this->_data);
    }

    public function asJson()
    {
        return $this->_data;
    }

    public function asObject()
    {
        return json_decode($this->_data);
    }
}