import api from './api';

// Endpoints that n8n might call to fetch context for admin or for testing
export const getConversation = (userId) => api.get(`/conversations/${userId}`).then(r => r.data);
export const sendMessageToChatbotEndpoint = (payload) => api.post('/chatbot/message', payload).then(r => r.data);
export const callTool = (toolName, payload) => api.post(`/chatbot/tool/${toolName}`, payload).then(r => r.data);
