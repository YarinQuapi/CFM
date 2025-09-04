const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default async function fetchFromAPI (endpoint: string, method: string, headers?: string) : Promise<any> {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: headers
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`API error ${response.status}: ${text}`);
    }

    console.log('API response:', response);

    return response.json();
}