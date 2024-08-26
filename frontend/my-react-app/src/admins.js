const getAdmins = async () => {
    const token = sessionStorage.getItem("token");

    const getAll = async () => {
        const response = await fetch('http://localhost:8000/users/admins', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // Include JWT token in headers
            }
        });

        if (!response.ok) {
            const errorResponse = await response.text();
            try {
                const parsedError = JSON.parse(errorResponse);
                throw new Error(parsedError.message || "Failed to retrieve admin users");
            } catch (jsonError) {
                throw new Error(errorResponse || "Failed to retrieve admin users");
            }
        }

        const result = await response.json();
        return result;
    };

    // Wait for getAll() to resolve and return the result
    const adminUsers = await getAll();

    const admins = {
        superAdmin: ['66cb0d13289b02e5d06baefe'],
        admin: adminUsers.data // Assign the resolved array here
    };
    return admins;
};

export default getAdmins;
