const baseUrl = 'http://localhost:5000/api';

let accessToken: string | null = null;
let refreshingToken: Promise<void> | null = null;

export function setAccessToken(token: string | null) {
   accessToken = token;
}

async function refreshAccessToken(): Promise<void> {
   // Always return the in-flight promise if one exists
   if (refreshingToken) return refreshingToken;

   refreshingToken = (async () => {
      const res = await fetch(baseUrl + '/users/refresh', {
         method: 'POST',
         credentials: 'include',
      });

      if (!res.ok) {
         refreshingToken = null;
         throw new Error('Session expired. Please log in again.');
      }

      const data = await res.json();
      setAccessToken(data.accessToken);
      refreshingToken = null;
   })();

   return refreshingToken;
}

export async function api<T>(
   url: string,
   method: string,
   body?: unknown
): Promise<T> {

   const response = await fetch(baseUrl + url, {
      method,
      headers: {
         'Content-Type': 'application/json',
         ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'include',
   });

   if (response.status === 401) {
      // Refresh once, then retry — no manual second fetch needed
      await refreshAccessToken();

      const retryResponse = await fetch(baseUrl + url, {
         method,
         headers: {
            'Content-Type': 'application/json',
            ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
         },
         body: body ? JSON.stringify(body) : undefined,
         credentials: 'include',
      });

      if (!retryResponse.ok) {
         throw new Error('Request failed after token refresh');
      }

      return retryResponse.json();
   }

   if (!response.ok) {
      throw new Error('API request failed');
   }

   return response.json();
}