interface StorageData {
  [key: string]: unknown;
}

interface GetMessageRequest {
  type: 'GET_STORAGE';
  keys: string[];
}

interface SetMessageRequest {
  type: 'SET_STORAGE';
  data: StorageData;
}

type MessageRequest = GetMessageRequest | SetMessageRequest;

interface GetMessageResponse {
  data: StorageData;
}

interface SetMessageResponse {
  success: boolean;
}

type MessageResponse = GetMessageResponse | SetMessageResponse;

export const sendMessage = (request: MessageRequest): Promise<MessageResponse> => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(request, response => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        resolve(response);
      }
    });
  });
};

export const getStorage = async (keys: string[]): Promise<StorageData> => {
  try {
    const request: GetMessageRequest = { type: 'GET_STORAGE', keys };
    const response = (await sendMessage(request)) as GetMessageResponse;
    return response.data;
  } catch (error) {
    console.error('Error getting storage:', error);
    throw error;
  }
};

export const setStorage = async (data: StorageData): Promise<boolean> => {
  try {
    const request: SetMessageRequest = { type: 'SET_STORAGE', data };
    const response = (await sendMessage(request)) as SetMessageResponse;
    return response.success;
  } catch (error) {
    console.error('Error setting storage:', error);
    throw error;
  }
};
