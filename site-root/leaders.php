<?php

// enable CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
	
if($_SERVER['REQUEST_METHOD'] == 'OPTIONS')
{
	exit();
}

LeadersRequestHandler::handleRequest();