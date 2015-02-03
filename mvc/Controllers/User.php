<?php
include_once './Models/Model.php';

class User extends Controller 
{
	function __construct() //Empty Constructor
	{

	}

	public function get($args)
	{
		return '405 Method Not Allowed'; //Call Model here instead
	}
}
?>