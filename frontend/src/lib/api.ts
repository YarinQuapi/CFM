const API_BASE_URL = process.env.API_URL;
const API_KEY = process.env.API_KEY;

const fetchFromAPI = async (endpoint: string) => {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': API_KEY ?? '',
        }
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`API error ${response.status}: ${text}`);
    }

    return response.json();
}