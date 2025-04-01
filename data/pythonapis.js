import axios from 'axios';

export const riskAssessment = async (user) => {
    try {
        const pythonApiUrl = 'http://127.0.0.1:2400/risk_assessment';
        const response = await axios.post(pythonApiUrl, user);
        return response.data;
    } catch (e) {
        throw e;
    }
}

export const followupQuery = async (riskData, query) => {
    try {
        const pythonApiUrl = 'http://127.0.0.1:2400/followup_query';
        riskData.user_query = query;
        console.log(riskData.user_query)
        const response = await axios.post(pythonApiUrl, riskData);
        return response.data;
    } catch (e) {
        throw e;
    }
}