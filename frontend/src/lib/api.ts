const API_BASE_URL = 'http://localhost:3000';

export default async function fetchFromAPI (endpoint: string, method: string, headers?: string) : Promise<any> {
    
    const response = await rfetch(endpoint, method, headers);

    console.log('Fetch request:', { endpoint, method, headers });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`API error ${response.status}: ${text}`);
    }

    console.log('API response:', response);

    return response;
}


export async function rfetch (endpoint: string, method: string, headers?: string) : Promise<any> {
    const mthd = method === 'GET' && headers === undefined ? 'GET' : 'POST';

    switch (mthd) {
        case 'GET':
            return await fetch(`${API_BASE_URL}/${endpoint}`, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        case 'POST':
            return await fetch(`${API_BASE_URL}/${endpoint}`, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: headers
            });
        default:
            throw new Error(`Unsupported method: ${method}`);
        }
}