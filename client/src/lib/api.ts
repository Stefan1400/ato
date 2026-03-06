const baseUrl = 'http://localhost:5000/api';

export async function api<T>(
   url: string, 
   method: string,
   body?: unknown
): Promise<T> {
   
   const response = await fetch(baseUrl + url, {
      method,
      headers: {
         'Content-Type': 'application/json'
      },
      body: body ? JSON.stringify(body) : undefined,
      credentials: "include"
   });

   if (!response.ok) {
      throw new Error("API request failed");
   };
   
   return response.json();
};