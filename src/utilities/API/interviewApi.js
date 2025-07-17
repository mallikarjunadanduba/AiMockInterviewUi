import axios from 'axios';
import BaseUrl from '../../BaseUrl';

// 1. POST /job_description
export const sendJobDescription = async (formData, headers) => {
  return await axios.post(`${BaseUrl}/job_description`, formData, {
    headers: {
      ...headers,
      'Content-Type': 'multipart/form-data'
    }
  });
};

// 2. GET /api/interview/<session_id>
export const fetchInterviewSession = async (sessionId) => {
  const response = await axios.get(`${BaseUrl}/api/interview/${sessionId}`);
  return response.data;
};


// GET /get_dynamic_question/<session_id>
export const fetchDynamicQuestion = async (sessionId) => {
  try {
    const response = await axios.get(`${BaseUrl}/get_dynamic_question/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching dynamic question:", error);
    return { error: "Failed to fetch question." };
  }
};

// 3. POST /upload_response
export const uploadInterviewResponse = async (formData, headers = {}) => {
  const response = await axios.post(`${BaseUrl}/upload_response`, formData, {
    headers: {
      ...headers,
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};