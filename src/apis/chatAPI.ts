import { appInfo } from './appInfo';
import axiosClient from './axiosClient';

class ChatAPI {
    HandleChat = async (url: string, data?: any, method?: 'get' | 'post' | 'put' | 'delete') => {
        return await axiosClient(`${appInfo.BASE_URL}/chats${url}`, {
            method: method ?? 'get',
            data,
        });
    };
}

const chatAPI = new ChatAPI();

export default chatAPI;
