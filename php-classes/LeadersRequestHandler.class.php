<?php

class LeadersRequestHandler extends RequestHandler
{
	static public $responseMode = 'json';
	
	static public function handleRequest()
	{
		// handle request to a specific key
		if($leaderKey = static::shiftPath())
		{
			if($Leader = Leader::getByKey($leaderKey))
			{
				return static::handleRecordRequest($Leader);
			}
			else
			{
				return static::throwNotFoundError();
			}
		}
		elseif($_SERVER['REQUEST_METHOD'] == 'POST' || $_SERVER['REQUEST_METHOD'] == 'PUT')
		{
			return static::handleCreateRequest();
		}
		else
		{
			return static::handleListRequest();
		}
		
	}
	
	static public function handleListRequest()
	{
		// build conditions
		$where = array();
		
		if(!empty($_GET['party']))
		{
			$where['party'] = $_GET['party'];
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
		$result = Leader::getAllByWhere($where);
		
		return static::respond('leaders', array(
			'success' => true
			,'total' => count($result)
			,'leaders' => $result
		));
	}
	
	static public function handleCreateRequest()
	{
		$Leader = Leader::create(static::getPostData(), true);
		
		return static::respond('leaderCreated', array(
			'success' => true
			,'leader' => $Leader
			,'leaderKey' => $Leader->getKey()
		));
	}
	
	static public function handleRecordRequest(Leader $Leader)
	{
		// route subrequests
		if(static::peekPath() == 'flags')
		{
			return static::handleFlagsRequest($Leader);
		}
		elseif($_SERVER['REQUEST_METHOD'] == 'POST' || $_SERVER['REQUEST_METHOD'] == 'PUT')
		{
			return static::handleUpdateRequest($Leader);
		}
		elseif($_SERVER['REQUEST_METHOD'] == 'DELETE')
		{
			return static::handleDeleteRequest($Leader);
		}
		
		// default response - leader object
		return static::respond('leader', array(
			'success' => true
			,'leader' => $Leader
		));
	}
	
	static public function handleUpdateRequest(Leader $Leader)
	{
		$data = static::getPostData();
		
		// verify
#		if(!empty($Leader->voterid))
#		{
#			if(empty($data['votoken']))
#			{
#				JSON::error('votoken is required to edit this record');
#			}
#			elseif(!VoterDB::verify($data['votoken'], $Leader->voterid)->success)
#			{
#				die('success');
#			}
#		}
		
		$Leader->applyData($data, true);
	
		return static::respond('leaderUpdated', array(
			'success' => true
			,'leader' => $Leader
			,'leaderKey' => $Leader->getKey()
		));
	}
	
	static public function handleDeleteRequest(Leader $Leader)
	{
		return static::respond('leaderDeleted', array(
			'success' => $Leader->delete()
			,'leader' => $Leader
			,'leaderKey' => $Leader->getKey()
		));
	}
	
	static public function handleFlagsRequest(Leader $Leader)
	{
		// route subrequests
		if($_SERVER['REQUEST_METHOD'] == 'POST' || $_SERVER['REQUEST_METHOD'] == 'PUT')
		{
			return static::handleFlagCreateRequest($Leader);
		}

		// default response - all flags for leader
		$flags = LeaderFlag::getAllByField('leader', $Leader->getKey());
		
		return static::respond('leaderFlags', array(
			'success' => true
			,'count' => count($flags)
			,'flags' => $flags
		));
	}
	
	static public function handleFlagCreateRequest(Leader $Leader)
	{
		$Flag = LeaderFlag::create(static::getPostData());
		$Flag->leader = $Leader->getKey();
		$Flag->timestamp = time();
		$Flag->save();
		
		return static::respond('leaderFlagged', array(
			'success' => true
			,'leader' => $Leader
			,'flagKey' => $Flag->getKey()
			,'flag' => $Flag
		));
	}
}