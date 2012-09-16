<?php


$authResponse = VoterDB::authenticate(array(
	'dob' => '1957-09-12'
	,'houseno' => '8329'
));

MICS::dump($authResponse, 'Authentication Result');

MICS::dump(VoterDB::verify($authResponse->token, $authResponse->id), 'Verification Result');