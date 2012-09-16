{extends designs/docs.tpl}

{block title}API Examples &mdash; {$dwoo.parent}{/block}

{block content}

	<h2>API examples</h2>
	
	<p>All create/update calls accept object properties via either standard form POST or a JSON document with <em>Content-Type: application/json</em></p>
	
	<h3>Divisions</h3>
	<ul>
		<li>GET <a target="_blank" href="/divisions">/divisions</a> &mdash; Get all divisions in database</li>
		<li>GET <a target="_blank" href="/divisions?near=40,-75">/divisions?near=40,-75</a> &mdash; Division centroid near lat,lon</li>
		<li>GET <a target="_blank" href="/divisions?polling_near=40,-75">/divisions?polling_near=40,-75</a> &mdash; Polling place near lat,lon</li>
		<li>GET <a target="_blank" href="/divisions?ward=63">/divisions?ward=63</a></li>
		<li>GET <a target="_blank" href="/divisions?division=16">/divisions?division=16</a></li>
		<li>GET <a target="_blank" href="/divisions?ward=63&amp;division=16">/divisions?ward=63&amp;division=16</a> &mdash; Combine any of the above</li>
	</ul>
	
	<h3>Leaders</h3>
	<ul>
		<li>GET <a target="_blank" href="/leaders">/leaders</a> &mdash; Get all leaders in database</li>
		<li>GET <a target="_blank" href="/leaders?party=D">/leaders?party=D</a></li>
		<li>GET <a target="_blank" href="/leaders?ward=1">/leaders?ward=1</a></li>
		<li>GET <a target="_blank" href="/leaders?division=2">/leaders?division=2</a></li>
		<li>GET <a target="_blank" href="/leaders?ward=3&amp;division=4&amp;party=D">/leaders?ward=3&amp;division=4&amp;party=D</a> &mdash; Combine any of the above</li>
		<li>POST <a target="_blank" href="/leaders">/leaders</a> &mdash; Create a leader</li>
		<li>GET <a target="_blank" href="/leaders/Leader0">/leaders/Leader0</a> &mdash; Get a specific leader</li>
		<li>POST <a target="_blank" href="/leaders/Leader0">/leaders/Leader0</a> &mdash; Update leader</li>
		<li>DELETE <a target="_blank" href="/leaders/Leader0">/leaders/Leader0</a> &mdash; Delete a leader</li>
		<li>GET <a target="_blank" href="/leaders/Leader0/flags">/leaders/Leader0/flags</a> &mdash; Get list of leader's flags</li>
		<li>POST <a target="_blank" href="/leaders/Leader0/flags">/leaders/Leader0/flags</a> &mdash; Create a flag for leader</li>
	</ul>

	<h3>Invitations</h3>
	<ul>
		<li>POST <a target="_blank" href="/invite?email=voter@chrisrules.com&name=Chris%20Alfano">/invite?email=voter@chrisrules.com&name=Chris%20Alfano</a> &mdash; Send invitation to given email, name is optional but improves delivery</li>
	</ul>

	<h3>Authenticate</h3>
	<ul>
		<li>POST <a target="_blank" href="/authenticate?dob=1970-02-28&houseno=1234&zip=19123">/authenticate?dob=1970-02-28&houseno=1234&zip=19123</a> &mdash; Authenticate voter and retrieve Vo-Token. See <a href="http://voterdb.sites.emr.ge/docs">http://voterdb.sites.emr.ge/docs</a></li>
	</ul>
	
{/block}