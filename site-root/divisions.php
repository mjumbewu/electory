<?php

// build conditions
$where = array();

if(!empty($_GET['near']))
{
	$where[] = "centroid near ($_GET[near])";
}

if(!empty($_GET['polling_near']))
{
	$where[] = "polling_place near ($_GET[polling_near])";
}

if(!empty($_GET['ward']))
{
	$where['ward'] = (integer)$_GET['ward'];
}

if(!empty($_GET['division']))
{
	$where['division'] = (integer)$_GET['division'];
}

// execute query and return result
$result = Division::getAllByWhere($where);

JSON::respond(array(
	'success' => true
	,'total' => count($result)
	,'divisions' => $result
));