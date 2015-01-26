<?php

include_once 'database.php';
	
class Model
{

    function __construct()
	{
		
	}
	
	protected static function executeSelectQuery($table, $queryParams) 
	{
		$db = new Database;
		
        $query = 'SELECT DISTINCT ';
        //TODO get only specific music info
        $query .= $queryParams;
        $query .= ' FROM ' . '`' . $db->getDbName() . '`.`' . $table . '` ';
		$statement = $db->prepare($query);

		return Model::executeQuery($db, $statement);
	}

	protected static function executeQuery($db, $statement) {
	 	$statement->execute();

        $data = $statement->fetch(PDO::FETCH_ASSOC);
        foreach($data as $d => $val) {
        	echo $d . ' : ' . $val .  "<br>";
        }
        return ($data) ? $data : null;
	}

	//TODO execute update, delete, insert
}


?>