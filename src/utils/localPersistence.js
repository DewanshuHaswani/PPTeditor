export async function localRequest(method = 'GET', data, timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch('/api/presentation', {
      method, cache: 'no-store', signal: controller.signal,
      ...(data ? { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) } : {})
    });
    if (method === 'GET' && [404, 405].includes(response.status)) return null;
    if (!response.headers.get('content-type')?.includes('application/json')) return null;
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Local disk save failed.');
    return result;
  } catch (error) {
    if (error.name === 'AbortError' || controller.signal.aborted) throw new Error('Local save server did not respond. Your browser backup is kept; retry Save or export JSON.');
    throw error;
  } finally { clearTimeout(timer); }
}

