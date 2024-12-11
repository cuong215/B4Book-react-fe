import React, { useState, useEffect } from "react";
import { Card, Col, List, message, Row, Typography } from "antd";
import { useParams } from "react-router-dom";
import shopApi from "../../hooks/useShopApi"; // Import shopApi
import { EyeOutlined, HeartOutlined, HomeOutlined, MailOutlined, PhoneOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";

const { Title, Text } = Typography;

export default function DetailShop() {
  const { id: shopId } = useParams(); // Lấy shopId từ URL
  const [shopDetail, setShopDetail] = useState(null);
  const [bestSellers, setBestSellers] = useState([]);

  const [addingToCart, setAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const userId = useSelector((state) => state.user._id);
  // Fetch dữ liệu khi component mount
  useEffect(() => {
    const fetchShopDetail = async () => {
      try {
        const response = await shopApi.getDetailShop(shopId); // Gọi API
        const { shop, bestSellers } = response.data; // Lấy dữ liệu từ response
        setShopDetail(shop); // Lưu thông tin shop
        setBestSellers(bestSellers); // Lưu danh sách sản phẩm best seller
      } catch (error) {
        console.error("Error fetching shop detail:", error);
      }
    };

    fetchShopDetail();
  }, [shopId]);

  // Nếu chưa có dữ liệu, hiển thị Loading
  if (!shopDetail) {
    return <div>Loading...</div>;
  }

  const { shopName, shopEmail, shopAddress, phoneNumber, images } = shopDetail;

  const handleAddToWishlist = async (productId) => {
    if (!userId) {
      message.warning(
        <div className='p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 rounded-md shadow-md flex items-center'>
          <span className='mr-2 font-medium'>Please</span>
          <button
            onClick={() => navigate('/login')}
            className='text-blue-600 underline font-semibold hover:text-blue-800'
          >
            login
          </button>
          <span className='ml-2'>to add products to your wishlist.</span>
        </div>,
      );
      return;
    }
    const respone = await WishlistApi.addProductToWishList(productId);
    if (respone.status === 200) {
      message.success('Add product to wishlist successfully');
    } else {
      message.error('Product already added to wishlist');
    }

  }

  const handleAddToCart = (productId, quantity) => {
    if (!userId) {
      message.warning(
        <div className='p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 rounded-md shadow-md flex items-center'>
          <span className='mr-2 font-medium'>Please</span>
          <button
            onClick={() => navigate('/login')}
            className='text-blue-600 underline font-semibold hover:text-blue-800'
          >
            login
          </button>
          <span className='ml-2'>to add products to your cart.</span>
        </div>,
      );
      return;
    }
  }

  return (
    <section className="bg-gray-100 p-5 sm:p-6 lg:p-10">
      <div className="w-full">
        <div className="w-11/12 flex gap-4 mx-auto">
          <div className="bg-white p-2 rounded-xl w-1/3 h-full">
            <div className="w-full h-auto overflow-hidden rounded-lg">
              <img
                src={images[0] || "https://via.placeholder.com/150"} // Hiển thị ảnh đầu tiên
                alt="Shop"
                className="w-full h-auto mb-5 object-cover transform transition-transform duration-500 ease-in-out hover:scale-105"
              />
            </div>
            <p className="text-center text-[#F18966] text-xl mb-2">{shopName}</p>
            <div className="w-11/12 mx-auto">
              <div className="w-full flex items-center border-2 px-2 py-1 border-gray-100 rounded-full">
                <p className="text-base bg-[#679089] px-2 py-1 rounded-full text-white mb-0"><MailOutlined /></p>
                <Text className="text-base mx-2 text-[#F18966] truncate">{shopEmail}</Text>
              </div>
              <div className="w-full flex items-center border-2 px-2 py-1 border-gray-100 rounded-full my-2">
                <p className="text-base bg-[#679089] px-2 py-1 rounded-full text-white mb-0"><HomeOutlined /></p>
                <Text className="text-base mx-2 text-[#F18966]">{shopAddress}</Text>
              </div>
              <div className="w-1/2 flex items-center border-2 px-2 py-1 border-gray-100 rounded-full">
                <p className="text-base bg-[#679089] px-2 py-1 rounded-full text-white mb-0"><PhoneOutlined /></p>
                <Text className="text-base mx-2 text-[#F18966]">{phoneNumber}</Text>
              </div>
            </div>

            <div className="w-11/12 mx-auto my-5 text-end">
              <button className="bg-[#679089] text-white px-3 py-1.5 rounded-full border-2 hover:bg-white hover:border-2 border-[#679089] hover:text-[#679089] duration-300 ease-in-out">Chat with Shop!</button>
            </div>
          </div>

          {/* Best Sellers */}
          <div className="w-2/3">
            <Card className="mb-4 h-auto">
              <h1 className="font-semibold text-base">Top 5 Best Sellers</h1>
              <div className="line h-px w-full bg-gray-200 my-4"></div>
              <div className="flex flex-col">
                {bestSellers.map((product, index) => (
                  <div key={index}>
                    <div className="w-11/12 flex gap-4 items-start">
                      <div className="w-1/3">
                        <div className='relative group overflow-hidden w-1/2 md:w-full m-2'>
                          <div className="">
                            <img
                              src={product.images[0] || "https://via.placeholder.com/150"}
                              alt={product.title}
                              className='w-full h-auto object-cover rounded-lg'
                            />
                          </div>
                          <div className='absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-500'>
                            <div className='absolute right-5 top-1/2 -translate-y-1/2 flex flex-col gap-4'>
                              <button className='flex justify-center p-3 bg-white rounded-full hover:bg-red-500 hover:text-white transform translate-x-10 group-hover:translate-x-0 duration-300 shadow-lg'>
                                <HeartOutlined className='w-6 h-6 flex justify-center items-center text-black-500' />
                              </button>
                              <button className='flex justify-center items-center px-2 py-3 bg-white rounded-full hover:bg-red-500 hover:text-white transform translate-x-10 group-hover:translate-x-0 duration-300 delay-75 shadow-lg'>
                                <EyeOutlined className='w-6 h-6 flex justify-center items-center text-black-500' />
                              </button>
                              <button
                                className={`flex justify-evenly items-center px-1 py-3 bg-white rounded-full ${addingToCart
                                  ? 'opacity-50 cursor-not-allowed'
                                  : 'hover:bg-red-500 hover:text-white'
                                  } transition-all transform translate-x-10 group-hover:translate-x-0 duration-300 delay-150 shadow-lg`}
                                onClick={() => handleAddToCart(product._id, quantity)}
                                disabled={addingToCart} // Vô hiệu hóa khi đang thêm
                              >
                                {addingToCart ? (
                                  <Spin size='small' /> // Icon loading từ Ant Design
                                ) : (
                                  <ShoppingCartOutlined className='w-6 h-6 flex justify-center items-center text-black-500' />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="w-2/3 p-2">
                        <h1 className="text-[#F18966] text-lg">{product.title}</h1>
                        <p className="text-sm mb-0">{product.description}</p>
                        <div className="flex my-2">
                          <div className='text-yellow-500 mr-2'>★★★★★</div>
                          <span className='text-[#F18966]'>{product.ratingResult}</span>
                        </div>
                        <p className="text-xs font-semibold mb-0">Sales: <span className="text-[#F18966] text-base">{product.salesNumber}</span></p>
                        <p className="text-xs font-semibold">Price: <span className="text-[#F18966] text-base">$ {product.price}</span></p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
