import axios from 'axios';

export const riskAssessment = async (user) => {
    try {
        const pythonApiUrl = 'http://127.0.0.1:7000/risk_assessment';
        const response = await axios.post(pythonApiUrl, user);
        return response.data;
    } catch (e) {
        throw e;
    }
}

export const followupQuery = async (riskData, query) => {
    try {
        const pythonApiUrl = 'http://127.0.0.1:7000/followup_query';
        riskData.query = query;
        const response = await axios.post(pythonApiUrl, riskData);
        return response.data;
    } catch (e) {
        throw e;
    }
}