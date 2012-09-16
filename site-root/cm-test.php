<?php

#$result = Division::getAllByWhere('[__class__="Division"]');
$result = CouldMine_Record::getAllByWhere(array('ward' => 123));


foreach($result AS $key => $value)
{
	MICS::dump($value, "found key: $key");
}

#$Division = Division::create(array(
#	'ward' => 123
#	,'division' => 456
#));
#
#MICS::dump($Division, 'division');
#
#$Division->save();
#MICS::dump($Division, 'saved');


#foreach($Record AS $key => $value)
#{
#	MICS::dump($value, 'key: '.$key);
#}

#MICS::dump($Record, 'pre modified');
#
#$Record->ward = 63;
#
#MICS::dump($Record, 'post modified');
#
#$Record->save();
#
#MICS::dump($Record, 'post save');

#MICS::dump(CloudMine::fetch(), 'fetch()');
#
#MICS::dump(CloudMine::fetch(array('keys'=>array(1,0))), 'fetch(keys=>1)');
#
#MICS::dump(CloudMine::query('[polling_place near (40,-75)]'), 'query("[polling_place near (40,-75)]")');
#
