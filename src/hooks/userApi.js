import { axiosClient } from '../ApiConfig/apiConfig';
import constants from '../constants/constants';

const USER_API_URL = '/user';

const userApi = {
  getUser: () => {
    const url = USER_API_URL;
      return axiosClient.get(url);
  },
  putUpdateUser: (userId = '', value = {}) => {
    const url = USER_API_URL + '/update';
    return axiosClient.put(url, { userId, value });
  },
  
  // switch shop
  getSwitchShop: async () => {
    return await axiosClient.get('/switchShop', {});
  },

  getUserProfile: () => {
    return axiosClient.get('/Userprofile');
  },

  updateUserProfile: (data) => {
    return axiosClient.put('/updateProfile', data); // Gửi yêu cầu PUT đến endpoint update
},

  postRegisterShop: (data) => {
    return axiosClient.post('/registerShop', data,{
      headers: {
        "Content-Type": "multipart/form-data", // Quan trọng cho dữ liệu FormData
      },
    }); // Gửi yêu cầu POST đến endpoint registerShop
  },
};

export default userApi;
