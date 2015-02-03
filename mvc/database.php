<?php

class Database extends PDO {
	 // Database config is private to this class
	private static $dbType = "mysql";
	private static $dbHost = "localhost";
	private static $dbName = "samplecloud";

    function __construct() {
        try {

            parent::__construct(Database::$dbType . ':host=' . Database::$dbHost . ';dbname=' . Database::$dbName, 'root', '');
            $this->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        } catch (PDOException $e) {

            echo $e->getMessage() . ' ERROR CODE: ' . $e->getCode();

        }	    	
	}

	public function getDbName() 
	{
		return Database::$dbName;
	}
}
?>