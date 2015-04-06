<?php
	$salt = mcrypt_create_iv(22, MCRYPT_DEV_URANDOM);
	$options = [
		'cost' => 10,
	    'salt' => $salt
	];

	$hash = password_hash("dafg", PASSWORD_BCRYPT, $options);
	echo $hash;

	if(password_verify('dafg', $hash))
	{
		echo 'Valid';
	}
	else 
	{
		echo 'Error';
	}

?>