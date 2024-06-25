export default async function refreshToken() {
    const storedToken = localStorage.getItem('jwtToken');

    if (storedToken) {
        try {
            const url = 'http://localhost:5000/api/user/check';
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${storedToken}`,
                },
            });

            const responseData = await response.json();

            if (response.ok) {

                const newToken = responseData.token;

                localStorage.setItem('jwtToken', newToken);

            } else {
                window.location.href = '/login';
            }
        } catch (error) {
            console.error('Error checking and refreshing token:', error);
        }
    }
}