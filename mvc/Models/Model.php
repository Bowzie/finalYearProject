<?php

include_once '/../Database.php';
	
class Model
{
    function __construct()
	{
		
	}
	
	protected static function executeSelectQuery($table, $queryParams, $whereClause) 
	{
		$db = new Database;
		
        $query = 'SELECT DISTINCT ';
        $query .= $queryParams;
        $query .= ' FROM ' . '`' . $db->getDbName() . '`.`' . $table . '` ';
     	$query .= 'WHERE ' . $whereClause;
		$statement = $db->prepare($query);

		return Model::executeQuery($table, $db, $statement, 'select');
	}

	protected static function executeInsertStatement($table, $args)
	{
		$db = new Database;

		//Remove argument values to null if they are left blank when user submits register form, also remove functionName parameter
		foreach ($args as $key => $value) {
			if(empty($args[$key]) || $key = 'functionName')
			{
				unset($args[$key]);
			}
		}

		//Send arguments to string
		$into = implode(',', array_keys($args));
		$values = "'" . implode("','", $args) . "'";

		$query = 'INSERT INTO ';
		$query .= '`' . $db->getDbName() . '`.`' . $table . '` ';
		$query .= '(' . $into . ')';
		$query .= ' VALUES ';
		$query .= '(' . $values . ')';
		$statement = $db->prepare($query);

		return Model::executeQuery($table, $db, $statement, 'insert');
	}

	protected static function executeDeleteStatement($table, $whereClause)
	{
		$db = new Database;

		$query = 'DELETE ';
        $query .= ' FROM ' . '`' . $db->getDbName() . '`.`' . $table . '` ';
     	$query .= 'WHERE ' . $whereClause;
		$statement = $db->prepare($query);

		return Model::executeQuery($table, $db, $statement, 'delete');
	}

	protected static function executeQuery($table, $db, $statement, $type) 
	{
	 	$result = $statement->execute();

	 	if($table === 'user' && $type === 'select') 
	 	{	
			$data = $statement->fetch(PDO::FETCH_ASSOC); //Single result only
			var_dump($data);
	 	}
	 	else if($table === 'music')
	 	{
	 		$data = $statement->fetchAll(PDO::FETCH_ASSOC); //Multiple results possible
	 	}
	 	else if($type === 'insert') //Check if insert was successful
	 	{
	 		if($result === true)
	 		{
	 			$data = true;
	 		}
	 	}

        return ($data) ? $data : null;
	}

	//TODO execute update, delete, insert
}


?>