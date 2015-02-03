<?php
include_once 'Controller.php';

class User extends Controller 
{
	function __construct() //Empty Constructor
	{

	}

	public function GET($args)
	{
		echo($args[0]); //returns value passed into it, for now will be id to get from user table
	}
}
?>