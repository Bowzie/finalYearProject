<?php

include_once '/../Models/Model.php';

class Controller 
{
	function __construct() //Empty Constructor
	{
		
	}

	public function GET($args)
	{
		return '405 Method Not Allowed'; //Need to change to header?
	}

	public function PUT($args)
	{
		return '405 Method Not Allowed'; //Need to change to header?
	}

	public function DELETE($args)
	{
		return '405 Method Not Allowed'; //Need to change to header?
	}
}
?>