<?php

include_once 'Model.php';  

class UserModel extends Model
{
	private static $table = 'user';

	//TODO pass in user name into function params, need to implement log in and check if session is current
	public static function checkLogin($args)
	{
		$queryParams = 'password';
		$whereClause = 'username = ' . "'" .$args['username'] . "'";
		$hash = Model::executeSelectQuery(UserModel::$table, $queryParams, $whereClause);

		if(password_verify($args['password'], $hash['password']))
		{
			return 'Successful';
		}
		else 
		{
			return 'Failure';
		}
	}

	public static function getUserInfo($args)
	{
		$queryParams = 'id, username, firstname, lastname, country,  about';
		$whereClause = 'username = ' . "'" . $args . "'"; 
        return Model::executeSelectQuery(UserModel::$table, $queryParams, $whereClause);
	}

	public static function checkUsername($args)
	{
		$queryParams = 'username';
		$whereClause = 'username = ' . "'" . $args . "'"; 
        
        $usernameCheck = Model::executeSelectQuery(UserModel::$table, $queryParams, $whereClause);

        return $usernameCheck;
	}

	public static function addUser($args)
	{
        $newUser = Model::executeInsertStatement(UserModel::$table, $args);

        return $newUser;
	}
}
?>