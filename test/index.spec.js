import { env, createExecutionContext, waitOnExecutionContext, SELF } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import worker from '../src';

describe('Time Zone API', () => {
	it('should return Shanghai time when no timezone is provided (unit style)', async () => {
		const request = new Request('http://example.com');
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);
		
		const data = await response.json();
		expect(response.status).toBe(200);
		expect(data['Asia/Shanghai']).toBeDefined();
		expect(data['Asia/Shanghai'].formatted).toBeDefined();
		expect(data['Asia/Shanghai'].iso).toBeDefined();
		expect(data['Asia/Shanghai'].timestamp).toBeDefined();
		expect(data._info).toBeDefined();
		expect(data._info.message).toBe('Time Zone API - Default timezone: Asia/Shanghai');
	});

	it('should return time for a single timezone via GET (unit style)', async () => {
		const request = new Request('http://example.com/?timezone=Asia/Shanghai');
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);
		
		const data = await response.json();
		expect(response.status).toBe(200);
		expect(data['Asia/Shanghai']).toBeDefined();
		expect(data['Asia/Shanghai'].formatted).toBeDefined();
		expect(data['Asia/Shanghai'].iso).toBeDefined();
		expect(data['Asia/Shanghai'].timestamp).toBeDefined();
	});

	it('should return time for multiple timezones via GET (unit style)', async () => {
		const request = new Request('http://example.com/?timezone=Asia/Shanghai,America/New_York,Europe/London');
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);
		
		const data = await response.json();
		expect(response.status).toBe(200);
		expect(data['Asia/Shanghai']).toBeDefined();
		expect(data['America/New_York']).toBeDefined();
		expect(data['Europe/London']).toBeDefined();
	});

	it('should return time for timezones via POST (unit style)', async () => {
		const request = new Request('http://example.com/', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				timezones: ['Asia/Tokyo', 'Europe/Paris']
			})
		});
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);
		
		const data = await response.json();
		expect(response.status).toBe(200);
		expect(data['Asia/Tokyo']).toBeDefined();
		expect(data['Europe/Paris']).toBeDefined();
	});

	it('should handle invalid timezone gracefully (unit style)', async () => {
		const request = new Request('http://example.com/?timezone=Invalid/Timezone');
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);
		
		const data = await response.json();
		expect(response.status).toBe(200);
		expect(data['Invalid/Timezone'].error).toBe('Invalid timezone');
	});

	it('should handle invalid JSON in POST request (unit style)', async () => {
		const request = new Request('http://example.com/', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: 'invalid json'
		});
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);
		
		const data = await response.json();
		expect(response.status).toBe(400);
		expect(data.error).toBe('Invalid JSON body');
	});

	it('should handle OPTIONS request for CORS (unit style)', async () => {
		const request = new Request('http://example.com/', {
			method: 'OPTIONS'
		});
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);
		
		expect(response.status).toBe(200);
		expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
	});

	// Integration style tests
	it('should return Shanghai time when no timezone is provided (integration style)', async () => {
		const response = await SELF.fetch('http://example.com');
		const data = await response.json();
		
		expect(response.status).toBe(200);
		expect(data['Asia/Shanghai']).toBeDefined();
		expect(data['Asia/Shanghai'].formatted).toBeDefined();
		expect(data._info).toBeDefined();
		expect(data._info.message).toBe('Time Zone API - Default timezone: Asia/Shanghai');
	});

	it('should return time for multiple timezones (integration style)', async () => {
		const response = await SELF.fetch('http://example.com/?timezone=Asia/Shanghai,Europe/London');
		const data = await response.json();
		
		expect(response.status).toBe(200);
		expect(data['Asia/Shanghai']).toBeDefined();
		expect(data['Europe/London']).toBeDefined();
	});
});
