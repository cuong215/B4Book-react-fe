import { axiosClient } from "../ApiConfig/apiConfig";

const ORDER_API_ENDPOINT = '/order';

const orderApi = {
  // fn: get all shop
  getAllOrderByShop: (id, sort) => {
    const queryParams = new URLSearchParams({
      status: sort, // Truyền sort dưới dạng status (nếu API yêu cầu)
    }).toString();
  
    const url = `${ORDER_API_ENDPOINT}/getAllOrderByShop/${id}?${queryParams}`;
    return axiosClient.get(url);
  },

  // Tìm kiếm sản phẩm theo keyword
  searchOrder: (keyword) => {
    const url = `${ORDER_API_ENDPOINT}/search?keyword=${keyword}`; 
    return axiosClient.get(url,{});
  },

  getDetailOrder: (orderId) => {
    const url = `${ORDER_API_ENDPOINT}/${orderId}`; 
    return axiosClient.get(url,{});
  },

  getDetailOrderCustomer: (orderId) => {
    const url = `${ORDER_API_ENDPOINT}/getDetailOrder/${orderId}`; 
    return axiosClient.get(url,{});
  },
  updateStatusOrder: (orderId,shopId) => {
    const url = `${ORDER_API_ENDPOINT}/${orderId}/shops/${shopId}/status`; 
    return axiosClient.patch(url,{});
  },
 
};

export default orderApi;
