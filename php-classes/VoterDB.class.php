<?php

class VoterDB
{
	static public function authenticate($data)
	{
		return json_decode(file_get_contents('http://voterdb.sites.emr.ge/lookup?'.http_build_query($data)));
	}
	
	static public function verify($token, $voterId)
	{
		return json_decode(file_get_contents('http://voterdb.sites.emr.ge/verify?'.http_build_query(array(
			'id' => $voterId
			,'token' => $token
		))));
	}
}