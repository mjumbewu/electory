<?php

if($_SERVER['REQUEST_METHOD'] != 'POST')
{
	JSON::error('Only POST method supported');
}

$response = VoterDB::authenticate(RequestHandler::getPostData());

JSON::respond($response);