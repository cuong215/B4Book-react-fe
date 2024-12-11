import { axiosClient } from "../ApiConfig/apiConfig";

const ACCOUNT_API_ENDPOINT = '/shop';

const shopApi = {
  // fn: get all shop
  getAllShop: ({ name, page = 1, limit = 10 }) => {
    // Tạo chuỗi query từ các tham số
    const queryParams = new URLSearchParams({
      name,
      page,
      limit,
    }).toString();

    const url = `${ACCOUNT_API_ENDPOINT}?${queryParams}`;
    return axiosClient.get(url);
  },

  // Tìm kiếm sản phẩm theo keyword
  searchShop: (keyword) => {
    const url = `/shop/search?keyword=${keyword}`; // Chỉnh lại URL đúng format
    return axiosClient.get(url);
  },

  getDetailShop: (id) => {
    const url = `/showDetailShop/${id}`; 
    return axiosClient.get(url);
  },

  getWithdrawalByShopId: () => {
    const url = `/shop/withdrawals`; 
    return axiosClient.get(url);
  },

  searchWithdrawal: (keyword) => {
    const url = `/shop/withdrawals/search?keyword=${keyword}`; 
    return axiosClient.get(url);
  },
 

  totalShop: () => {
    const url = `/shop/totalShop`; 
    return axiosClient.get(url);
  },
 
  totalRevenue: () => {
    const url = `/shop/totalRevenue`; 
    return axiosClient.get(url);
  },
  
  getMonthlyRevenue: () => {
    const url = `/shop/monthlyRevenue`; 
    return axiosClient.get(url);
  },

  getTotalRevenueForShop: (id) => {
    const url = `/shop/totalRevenueForShop/${id}`; 
    return axiosClient.get(url);
  },

  getMonthlyRevenueForShop: (id) => {
    const url = `/shop/monthlyRevenue/${id}`; 
    return axiosClient.get(url);
  },
  // Tạo yêu cầu rút tiền
  createWithdrawRequest: (amount) => {
    const url = `/shop/withdraws`;
    return axiosClient.post(url, { amount });
  },

  shopInfo: () => {
    const url = `/shop/shopInfo`; 
    return axiosClient.get(url);
  },
};


export default shopApi;
