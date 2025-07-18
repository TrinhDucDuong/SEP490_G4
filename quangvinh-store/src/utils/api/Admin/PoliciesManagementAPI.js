const API_BASE_URL = 'http://localhost:9999/staff/policy';

export const getAllPolicies = async () => {
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'GET',
            headers: {
                'accept': '*/*'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return { success: true, data: data.policies };
    } catch (error) {
        console.error('Error fetching policies:', error);
        return { success: false, error: error.message };
    }
};

export const getPolicyById = async (policyId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${policyId}`, {
            method: 'GET',
            headers: {
                'accept': '*/*'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return { success: true, data: data.policy };
    } catch (error) {
        console.error('Error fetching policy:', error);
        return { success: false, error: error.message };
    }
};

export const createPolicy = async (policyData) => {
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'accept': '*/*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                policyName: policyData.policyName,
                policyDescription: policyData.policyDescription
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Create policy error:', {
                status: response.status,
                statusText: response.statusText,
                body: errorText
            });
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        return { success: true, data: data.policy };
    } catch (error) {
        console.error('Error creating policy:', error);
        return { success: false, error: error.message };
    }
};

export const updatePolicy = async (policyId, policyData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${policyId}`, {
            method: 'PUT',
            headers: {
                'accept': '*/*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                policyName: policyData.policyName,
                policyDescription: policyData.policyDescription
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Update policy error:', {
                status: response.status,
                statusText: response.statusText,
                body: errorText
            });
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        return { success: true, data: data.policy };
    } catch (error) {
        console.error('Error updating policy:', error);
        return { success: false, error: error.message };
    }
};

export const deletePolicy = async (policyId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${policyId}`, {
            method: 'DELETE',
            headers: {
                'accept': '*/*'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Delete policy error:', {
                status: response.status,
                statusText: response.statusText,
                body: errorText
            });
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        return { success: true, data: data.policy };
    } catch (error) {
        console.error('Error deleting policy:', error);
        return { success: false, error: error.message };
    }
};
