/**
 * Time Zone API - Returns current time for specified timezones
 * 
 * Usage:
 * - GET /?timezone=America/New_York
 * - GET /?timezone=Asia/Shanghai,Europe/London
 * - POST with JSON body: {"timezones": ["America/New_York", "Asia/Shanghai"]}
 */

export default {
	async fetch(request, env, ctx) {
		try {
			const url = new URL(request.url);
			
			// Handle CORS for browser requests
			const corsHeaders = {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
				'Access-Control-Allow-Headers': 'Content-Type',
			};

			// Handle preflight OPTIONS request
			if (request.method === 'OPTIONS') {
				return new Response(null, { headers: corsHeaders });
			}

			let timezones = [];

			// Handle GET request with query parameters
			if (request.method === 'GET') {
				const timezoneParam = url.searchParams.get('timezone');
				if (timezoneParam) {
					timezones = timezoneParam.split(',').map(tz => tz.trim());
				}
			}
			// Handle POST request with JSON body
			else if (request.method === 'POST') {
				try {
					const body = await request.json();
					if (body.timezones && Array.isArray(body.timezones)) {
						timezones = body.timezones;
					} else if (body.timezone) {
						timezones = [body.timezone];
					}
				} catch (e) {
					return new Response(JSON.stringify({
						error: 'Invalid JSON body',
						message: 'Expected format: {"timezones": ["timezone1", "timezone2"]}'
					}), {
						status: 400,
						headers: { 'Content-Type': 'application/json', ...corsHeaders }
					});
				}
			}

			// If no timezones provided, return usage information
			if (timezones.length === 0) {
				return new Response(JSON.stringify({
					message: 'Time Zone API',
					usage: {
						get: '/?timezone=America/New_York or /?timezone=Asia/Shanghai,Europe/London',
						post: 'POST with JSON: {"timezones": ["America/New_York", "Asia/Shanghai"]}'
					},
					examples: [
						'/?timezone=Asia/Shanghai',
						'/?timezone=America/New_York,Europe/London,Asia/Tokyo'
					]
				}), {
					headers: { 'Content-Type': 'application/json', ...corsHeaders }
				});
			}

			// Get current time for each timezone
			const result = {};
			const now = new Date();

			for (const timezone of timezones) {
				try {
					// Validate timezone by attempting to create a formatter
					const formatter = new Intl.DateTimeFormat('en-US', {
						timeZone: timezone,
						year: 'numeric',
						month: '2-digit',
						day: '2-digit',
						hour: '2-digit',
						minute: '2-digit',
						second: '2-digit',
						hour12: false
					});

					const timeString = formatter.format(now);
					const isoString = now.toLocaleString('sv-SE', { timeZone: timezone });
					
					result[timezone] = {
						formatted: timeString,
						iso: isoString,
						timestamp: now.getTime(),
						timezone: timezone
					};
				} catch (error) {
					result[timezone] = {
						error: 'Invalid timezone',
						message: `"${timezone}" is not a valid IANA timezone identifier`
					};
				}
			}

			return new Response(JSON.stringify(result, null, 2), {
				headers: { 'Content-Type': 'application/json', ...corsHeaders }
			});

		} catch (error) {
			return new Response(JSON.stringify({
				error: 'Internal server error',
				message: error.message
			}), {
				status: 500,
				headers: { 'Content-Type': 'application/json' }
			});
		}
	},
};
