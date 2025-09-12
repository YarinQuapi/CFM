/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
export default function handleError(error: any) : String {
    if (error instanceof Error) {
        console.error('Error message:', error.message);
        return error.message;
    }
    else {
        console.error('Unknown error:', error);
        return 'An unknown error occurred';
    }
}