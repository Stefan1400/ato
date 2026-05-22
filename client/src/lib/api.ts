const baseUrl = 'http://localhost:5000/api';

export async function api<T>(
   url: string,
   method: string,
   body?: unknown,
   headers: Record<string, string> = {}
): Promise<T> {
   const isJsonBody = body !== undefined && body !== null && !(body instanceof FormData);

   const response = await fetch(baseUrl + url, {
      method,
      headers: {
         ...headers,
         ...(isJsonBody ? { 'Content-Type': 'application/json' } : {}),
      },
      body: body !== undefined && body !== null ? (isJsonBody ? JSON.stringify(body) : body as BodyInit) : undefined,
      credentials: 'include',
   });

   if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} ${response.statusText}${errorText ? ` - ${errorText}` : ''}`);
   }

   return response.json();
}