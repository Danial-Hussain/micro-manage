INSERT INTO appointments(id, appt_name, appt_type, created_at, description, metadata, end_time, start_time, user_id, user_name)
VALUES(
	gen_random_uuid(),
	'Apple Design Meeting',
	'Business',
	CURRENT_TIMESTAMP,
	'Design meeting for the Vision Pro',
	'Metadata',
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP - INTERVAL '1 Hour',
	(SELECT id FROM users WHERE first_name = 'Steve' AND last_name = 'Jobs'),
	(SELECT first_name || ' ' || last_name FROM users WHERE first_name = 'Steve' AND last_name = 'Jobs')
);

INSERT INTO appointments(id, appt_name, appt_type, created_at, description, metadata, end_time, start_time, user_id, user_name)
VALUES(
	gen_random_uuid(),
	'VC Investment Meeting',
	'Business',
	CURRENT_TIMESTAMP,
	'Meeting with an early-stage startup',
	'Metadata',
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP - INTERVAL '2 Hour',
	(SELECT id FROM users WHERE first_name = 'Marc' AND last_name = 'Andreessen'),
	(SELECT first_name || ' ' || last_name FROM users WHERE first_name = 'Marc' AND last_name = 'Andreessen')
);

INSERT INTO appointments(id, appt_name, appt_type, created_at, description, metadata, end_time, start_time, user_id, user_name)
VALUES(
	gen_random_uuid(),
	'Basketball Gameplan Discussion',
	'Strategic',
	CURRENT_TIMESTAMP,
	'Pre-game strategy discussion with the coach.',
	'Metadata',
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP - INTERVAL '2 Day',
	(SELECT id FROM users WHERE first_name = 'LeBron' AND last_name = 'James'),
	(SELECT first_name || ' ' || last_name FROM users WHERE first_name = 'LeBron' AND last_name = 'James')
);

INSERT INTO appointments(id, appt_name, appt_type, created_at, description, metadata, end_time, start_time, user_id, user_name)
VALUES(
	gen_random_uuid(),
	'Investor Meeting',
	'Sales',
	CURRENT_TIMESTAMP,
	'Talking to Citadel investors',
	'Metadata',
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP - INTERVAL '2 Hour',
	(SELECT id FROM users WHERE first_name = 'Ken' AND last_name = 'Griffin'),
	(SELECT first_name || ' ' || last_name FROM users WHERE first_name = 'Ken' AND last_name = 'Griffin')
);

INSERT INTO appointments(id, appt_name, appt_type, created_at, description, metadata, end_time, start_time, user_id, user_name)
VALUES(
	gen_random_uuid(),
	'HR Operations Meeting',
	'Operations',
	CURRENT_TIMESTAMP,
	'Hiring discussion',
	'Metadata',
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP - INTERVAL '1 Hour',
	(SELECT id FROM users WHERE first_name = 'Sam' AND last_name = 'Altman'),
	(SELECT first_name || ' ' || last_name FROM users WHERE first_name = 'Sam' AND last_name = 'Altman')
);

INSERT INTO appointments(id, appt_name, appt_type, created_at, description, metadata, end_time, start_time, user_id, user_name)
VALUES(
	gen_random_uuid(),
	'Science Research Appointment',
	'Engineering',
	CURRENT_TIMESTAMP,
	'Science research with Bill & Melinda Gates Foundation',
	'Metadata',
	CURRENT_TIMESTAMP,
	CURRENT_TIMESTAMP - INTERVAL '1 Hour',
	(SELECT id FROM users WHERE first_name = 'Bill' AND last_name = 'Gates'),
	(SELECT first_name || ' ' || last_name FROM users WHERE first_name = 'Bill' AND last_name = 'Gates')
);