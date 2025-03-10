import React, { useState, useEffect } from 'react';
import { Formik, Field, Form as FormikForm } from 'formik';
import { Table, notification, Radio, Button, Modal, Input, Space, Divider } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { nav, s, u } from 'framer-motion/client';
import orderApi from '../../hooks/useOrderApi'; // Import API
import { Link, useNavigate } from 'react-router-dom';
import shopApi from '../../hooks/useShopApi'; // Import API

const Checkout = () => {
  const addresses = useSelector((state) => state.user.address || []);
  // console.log(addresses);
  const defaultAddress = addresses.length > 0 ? addresses[0] : null;
  const [selectedAddressId, setSelectedAddressId] = useState(
    defaultAddress ? defaultAddress._id : null,
  );
  // console.log('Selected Address Id ', selectedAddressId);
  const selectedAddress = addresses.find((addr) => addr._id === selectedAddressId);

  const selectedItems = useSelector((state) => state.carts.selectedItems);
  // console.log('Selected Items', selectedItems);
  const [voucherCodes, setVoucherCodes] = useState({});
  const [discountedTotal, setDiscountedTotal] = useState(0);
  const [selectedStore, setSelectedStore] = useState(null);
  const [isVoucherModalVisible, setIsVoucherModalVisible] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cardOption, setCardOption] = useState('');
  const userId = useSelector((state) => state.user._id);
  const navigate = useNavigate();

  useEffect(() => {
    //console.log('Selected Items:', selectedItems);
  }, [selectedItems]);

  // Cập nhật giá trị shippingCost ngẫu nhiên
  const randomShippingCost = () => {
    return Math.random() * (8 - 4) + 4; // Tạo giá trị ngẫu nhiên từ 4 đến 8
  };
  const [shippingCost, setShippingCost] = useState(randomShippingCost());

  useEffect(() => {
    if (addresses.length > 0) {
      setSelectedAddressId(addresses[0]._id); // Ensure first address is selected on reload
    }
  }, [addresses]); // This will run when the addresses array is loaded

  const [stores, setStores] = useState(
    selectedItems.reduce((acc, item) => {
      const shop = acc.find((s) => s.shopId === item.shopId); // Tìm cửa hàng theo shopId thay vì storeName
      if (shop) {
        shop.products.push(item);
      } else {
        acc.push({
          shopId: item.shopId, // Lưu shopId
          name: item.shopName, // Lưu tên cửa hàng (vẫn giữ tên cửa hàng để hiển thị)
          checked: false,
          shippingCost: shippingCost, // Gán giá trị ngẫu nhiên cho shippingCost
          products: [item],
          vouchers: [], // Cập nhật các voucher liên quan ở đây
        });
      }
      return acc;
    }, []),
  );

  useEffect(() => {
    const fetchVouchers = async () => {
      const updatedStores = await Promise.all(
        stores.map(async (store) => {
          try {
            const response = await shopApi.getAllVoucherForShop(store.shopId);
            return { ...store, vouchers: response.data || [] };
          } catch (error) {
            console.error(`Failed to fetch vouchers for shop ${store.shopId}:`, error);
            return store; // Trả về store hiện tại nếu lỗi xảy ra
          }
        }),
      );
      setStores(updatedStores);
    };

    fetchVouchers();
  }, []);

  const handleVoucherChange = (storeIndex, voucherCode) => {
    setVoucherCodes((prevVoucherCode) => ({
      ...prevVoucherCode,
      [storeIndex]: voucherCode,
    }));
  };

  const handleApplyVoucher = () => {
    const selectedVoucher = stores[selectedStore]?.vouchers.find(
      (voucher) => voucher._id === voucherCodes[selectedStore],
    );

    if (selectedVoucher) {
      const voucherValue = selectedVoucher.value; // Lấy giá trị phần trăm từ voucher
      const storeProducts = stores[selectedStore].products;

      // Tính tổng giá sản phẩm của cửa hàng trước khi giảm giá
      const totalCost = storeProducts.reduce(
        (total, product) => total + product.price * product.quantity,
        0,
      );
      console.log(totalCost, 'totalCost');

      // Tính giá sau khi áp dụng voucher
      const discountAmount = totalCost * (voucherValue / 100); // Giảm giá theo phần trăm
      const totalAfterDiscount = totalCost - discountAmount; // Giá sau khi giảm
      console.log(totalAfterDiscount, 'totalAfterDiscount');

      // Cập nhật tổng giá đã giảm vào state hoặc tính toán khi render
      setDiscountedTotal(totalAfterDiscount); // Lưu vào state tổng đã giảm
    }
  };

  const calculateTotalShippingCost = () => {
    return stores.reduce((total, store) => total + store.shippingCost, 0);
  };

  const calculateTotalAmount = () => {
    let totalPrice = 0;
    let totalDiscount = 0;

    stores.forEach((store, storeIndex) => {
      const storeTotal = store.products.reduce((sum, product) => {
        return sum + product.price * product.quantity;
      }, 0);

      // Lấy voucher code cho từng cửa hàng
      const voucherCode = voucherCodes[storeIndex];
      const selectedVoucher = store.vouchers.find((voucher) => voucher._id === voucherCode);

      // Tính giá trị giảm giá cho cửa hàng, nếu có voucher
      const storeDiscount = selectedVoucher ? storeTotal * (selectedVoucher.value / 100) : 0;

      totalPrice += storeTotal;
      totalDiscount += storeDiscount;
    });

    // Tính tổng shippingCost cho tất cả các cửa hàng và làm tròn giá trị
    const totalShippingCost = Math.round(
      stores.reduce((total, store) => total + store.shippingCost, 0),
    );

    // Trả về tổng số tiền (tổng giá trị sản phẩm - tổng giảm giá + tổng chi phí vận chuyển đã làm tròn)
    return totalPrice - totalDiscount + totalShippingCost;
  };

  const totalProducts = () => {
    let totalPrice = 0;
    stores.forEach((store, storeIndex) => {
      const storeTotal = store.products.reduce((sum, product) => {
        return sum + product.price * product.quantity;
      }, 0);
      totalPrice += storeTotal;
    });

    return totalPrice;
  };

  const columns = (storeName, storeIndex) => [
    {
      title: 'Image',
      dataIndex: 'images',
      key: 'image',
      className: 'w-[8em]',
      render: (images) => (
        <img src={images[0]} alt='Product' className='w-12 h-12 lg:block hidden' />
      ),
    },

    {
      title: 'Product Name',
      dataIndex: 'title',
      key: 'title',
      className: 'min-w-[120px] lg:w-[15em] object-cover',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      render: (price) => `${parseInt(price)}$`,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
    },
    {
      title: 'Total',
      render: (_, record) => {
        const productTotal = record.price * record.quantity;
        return `${productTotal}$`;
      },
    },
  ];

  const handlePlaceOrder = async (values) => {
    const { paymentMethod, cardOption } = values;
  
    if (!selectedAddressId) {
      notification.error({
        message: 'Please add an address',
        description: 'You need to select or add an address to continue.',
      });
      return;
    }
    if (!paymentMethod || (paymentMethod === 'card' && !cardOption)) {
      notification.error({
        message: 'Invalid Payment Method',
        description: 'Please select a valid payment method.',
      });
      return;
    }
  
    // Hàm tính tổng giá tiền của cửa hàng
    const calculateStoreTotal = (store) => {
      // Kiểm tra nếu store hoặc products không tồn tại
      if (!store || !store.products || !Array.isArray(store.products)) {
        throw new Error('Dữ liệu cửa hàng không hợp lệ.');
      }
  
      // Tính tổng giá của sản phẩm và cộng thêm chi phí vận chuyển
      const total =
        store.products.reduce((total, product) => {
          // Kiểm tra nếu sản phẩm hợp lệ
          if (!product.price || !product.quantity) {
            throw new Error('Dữ liệu sản phẩm không hợp lệ.');
          }
          return total + product.price * product.quantity;
        }, 0) + store.shippingCost;
  
      return total;
    };
  
    // Lấy tỷ giá USD sang VND
    const usdToVndRate = 25000; // Bạn có thể lấy tỷ giá hối đoái từ API
  
    // Tính tổng giá trị đơn hàng
    const totalAmountInUSD = calculateTotalAmount(); // Tổng giá trị đơn hàng tính bằng USD
    const totalAmountInVND = totalAmountInUSD * usdToVndRate; // Chuyển đổi sang VND
  
    // Lấy thông tin địa chỉ từ Redux hoặc local state
    const selectedAddress = addresses.find((addr) => addr._id === selectedAddressId);
  
    // Tạo orderData theo cấu trúc backend
    const orderData = {
      customer: userId, // Bạn cần thay thế "userId" bằng ID người dùng thực tế từ Redux hoặc session
      shops: stores.map((store) => ({
        shopId: store.shopId, // Dùng shopId thực tế của cửa hàng
        orderItems: store.products.map((product) => ({
          product: product.product._id, // ID của sản phẩm trong database
          title: product.title,
          quantity: product.quantity,
          price: product.price,
          images: product.images, // Hình ảnh của sản phẩm
        })),
        shippingCost: store.shippingCost,
        voucherDiscount: null, // Bạn có thể thay đổi phần này nếu muốn thêm mã giảm giá
        totalShopPrice: calculateStoreTotal(store),
      })),
      shippingAddress: {
        address: selectedAddress.street,
        city: selectedAddress.city,
        country: selectedAddress.country,
      },
      paymentMethod: paymentMethod === 'card' ? 'Credit Card' : 'COD',
      totalOrderPrice: cardOption === 'vnpay' ? totalAmountInVND : totalAmountInUSD, // Tổng giá trị đơn hàng đã chuyển đổi sang VND
    };
    console.log(totalAmountInVND, "totalAmountInVND");
    console.log('Complete Order Data:', orderData);
  
    try {
      if (paymentMethod === 'card' && cardOption === 'vnpay') {
        const response = await orderApi.createVNPayOrder(orderData);
        //console.log('VNPay Response:', response);
        if (response?.data?.vnpUrl) {
          window.location.href = response.data.vnpUrl; // Redirect to VNPay payment gateway
        } else {
          notification.success({
            message: 'Order placed successfully',
            description: `Your VNPay order has been created. Please follow the redirect.`,
          });
        }
      } else if (paymentMethod === 'card' && cardOption === 'stripe') {
        const response = await orderApi.createSTPOrder(orderData);
        if (response?.data?.url) {
          window.location.href = response.data.url; // Redirect to Stripe payment gateway
        } else {
          notification.success({
            message: 'Order placed successfully',
            description: `Your Stripe order has been created. Please follow the redirect.`,
          });
        }
      } else if (paymentMethod === 'cash') {
        const response = await orderApi.createPlaceOrder(orderData);
        console.log('Place Order Response:', response);
        if (response?.data) {
          navigate(`/orderconfirm`);
        }
      } else {
        notification.success({
          message: 'Order placed successfully',
          description: `Your order has been processed successfully.`,
        });
      }
    } catch (error) {
      notification.error({
        message: 'Order Failed',
        description: error?.response?.data?.message || 'An error occurred while placing the order.',
      });
    }
  };
  

  const handleSelectAddress = (addressId) => {
    setSelectedAddressId(addressId); // Cập nhật địa chỉ mặc định được chọn
  };

  const handleUpdateDefault = () => {};

  const handlePaymentChange = (e) => {
    setFieldValue('paymentMethod', e.target.value);
  };
  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-tl from-transparent to-[#e6dbcd] sm:px-5 pb-12 text-gray-800'>
      <div className='flex flex-col md:flex-grow justify-center sm:gap-8 pb-8 my-7 px-5 sm:p-8 bg-[#F8F8F6] shadow-xl rounded-xl md:w-3/4 overflow-auto w-full max-w-7xl'>
        <Formik
          initialValues={{
            paymentMethod: 'card',
            cardOption: '',
          }}
          onSubmit={handlePlaceOrder}
        >
          {({ setFieldValue, values }) => (
            <FormikForm>
              <h1 className='text-2xl text-[#f18966] font-bold mb-4 flex items-center justify-center mt-7 lg:mt-0'>
                Your Order
              </h1>

              <div className='flex flex-wrap gap-7 mt-10 w-full'>
                {/* Left Section */}
                <div className='w-full md:w-[60%]  rounded-xl lg:pr-4'>
                  <div className='border-b border-gray-100 pb-4 sm:mb-6 p-5 mb-7  rounded-xl'>
                    <div className='flex justify-between items-center mb-4'>
                      <p className='text-base sm:text-lg text-md font-bold text-[#f18966] '>Address</p>
                      <Button
                        type='link'
                        onClick={() => setIsModalVisible(true)}
                        className='!text-black hover:!text-black hover:opacity-90 font-semibold'
                      >
                        Select / Add Address
                      </Button>
                    </div>
                    {selectedAddress && (
                      <p>
                        {selectedAddress.street}, {selectedAddress.city}, {selectedAddress.country}
                      </p>
                    )}
                  </div>
                  {stores.map((store, storeIndex) => (
                    <div key={storeIndex} className='mb-5'>
                      <div className='flex items-center justify-between pl-4 bg-gradient-to-tl from-transparent to-[#e6dbcd] rounded-t-xl pt-2'>
                        <h2 className='text-base m-0 sm:text-lg font-semibold '>
                          {store.name} Shop
                        </h2>
                        <button
                          type='button'
                          onClick={() => {
                            setSelectedStore(storeIndex);
                            setIsVoucherModalVisible(true);
                          }}
                          className='m-2 bg-[#679089] p-[0.4em] text-white hover:opacity-90  opacity-100 rounded-md'
                        >
                          Voucher
                        </button>
                      </div>
                      <Table
                        dataSource={store.products}
                        columns={columns(store.name || 'Unnamed Store', storeIndex)}
                        rowKey='id'
                        showHeader={false}
                        pagination={false}
                        rowClassName={'bg-[#F8F8F6]'}
                        components={{
                          header: {
                            cell: ({ children, ...restProps }) => (
                              <th
                                {...restProps}
                                style={{ backgroundColor: '#E6DBCD', color: 'black' }}
                              >
                                {children}
                              </th>
                            ),
                          },
                          body: {
                            row: ({ children, ...restProps }) => (
                              <tr
                                {...restProps}
                                className='bg-white hover:bg-[#e6e4e0]  transition-colors duration-200'
                              >
                                {children}
                              </tr>
                            ),
                          },
                        }}
                      />
                      <div className='flex justify-end mr-5'>
                        <p className='mt-3 font-semibold'>
                          Shipping Cost: {Math.round(store.shippingCost)}$
                        </p>
                      </div>
                      {/* Hiển thị shippingCost cho mỗi cửa hàng */}
                      {storeIndex < stores.length - 1 && <Divider />}
                    </div>
                  ))}
                </div>
                {/* Right Section */}
                <div className='w-full md:w-1/3'>
                  {/* Payment Section */}
                  <div className='flex  p-6 rounded-xl mb-5 flex-col space-y-4  h-auto lg:h-80 sm:pt-5'>
                    <div className='text-base sm:text-lg font-bold text-[#f18966]'>Payment Method</div>
                    <Field name='paymentMethod'>
                      {({ field }) => (
                        <Radio.Group
                          {...field}
                          onChange={(e) => setFieldValue('paymentMethod', e.target.value)}
                          value={field.value}
                        >
                          <Space direction='vertical' className='mt-3'>
                            <Radio value='cash'>Cash on Delivery</Radio>
                            <Radio value='card'>Credit/Debit Card</Radio>
                          </Space>
                        </Radio.Group>
                      )}
                    </Field>

                    {values.paymentMethod === 'card' && (
                      <div>
                        <div className='text-base sm:text-lg font-bold text-[#f18966] '>
                          Select Payment Gateway
                        </div>
                        <Field name='cardOption'>
                          {({ field }) => (
                            <Radio.Group
                              {...field}
                              onChange={(e) => setFieldValue('cardOption', e.target.value)}
                              value={values.cardOption}
                            >
                              <Space direction='vertical' className='mt-3'>
                                <Radio value='stripe'>
                                  <div className='flex items-center'>
                                    <img
                                      src={
                                        'https://ps.w.org/woocommerce-gateway-stripe/assets/icon-256x256.png?rev=3177277'
                                      }
                                      className='w-8 h-8 mr-2'
                                      alt='Stripe'
                                    />
                                    Stripe
                                  </div>
                                </Radio>
                                <Radio value='vnpay'>
                                  <div className='flex items-center'>
                                    <img
                                      src={
                                        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTp1v7T287-ikP1m7dEUbs2n1SbbLEqkMd1ZA&s'
                                      }
                                      className='w-8 h-8 mr-2'
                                      alt='VNPay'
                                    />
                                    VNPay
                                  </div>
                                </Radio>
                              </Space>
                            </Radio.Group>
                          )}
                        </Field>
                      </div>
                    )}
                  </div>

                  <div className=' p-6 rounded-lg '>
                    <h2 className='text-xl font-semibold text-[#f18966]'>Order Summary</h2>
                    <p className='mt-3'>
                      Total Shipping Cost: {Math.round(calculateTotalShippingCost())}$
                    </p>
                    <p className='mt-3'>Total Cost of Goods: {Math.round(totalProducts())}$</p>
                    <p className='mt-3'>Total Amount: {Math.round(calculateTotalAmount())}$</p>
                    {/* <p className='mt-3'>
                      Total Amount:
                      {discountedTotal === 0
                        ? Math.round(calculateTotalAmount())
                        : Math.round(discountedTotal + Math.round(calculateTotalShippingCost()))}
                      $
                    </p> */}

                    <div className='mt-3'>
                      <button
                        type='submit'
                        className=' bg-[#679089] hover:opacity-90 text-white px-3 py-2 sm:px-4 sm:py-2 opacity-100 font-semibold rounded-lg'
                      >
                        Place Order
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </FormikForm>
          )}
        </Formik>
      </div>
      <Modal
        visible={isVoucherModalVisible}
        onOk={handleApplyVoucher}
        onCancel={() => setIsVoucherModalVisible(false)}
        // okText='Apply Voucher'
        // cancelText='Cancel'
        width={400}
        footer={
          null
        }
      >
        <p className=' text-[1.19em]'>Apply Voucher</p>
        <div className='flex flex-col gap-4'>
          {stores[selectedStore]?.vouchers.length > 0 ? (
            <Radio.Group
              onChange={(e) => handleVoucherChange(selectedStore, e.target.value)}
              value={voucherCodes[selectedStore]}
            >
              {stores[selectedStore]?.vouchers.map((voucher) => (
                <div key={voucher._id} className='flex items-center justify-between'>
                  <Radio value={voucher._id}>
                    {voucher.name} ({voucher.value ? `${voucher.value}%` : 'Free Ship'})
                  </Radio>
                </div>
              ))}
            </Radio.Group>
          ) : (
            <p className='text-gray-500'>No voucher for this shop!</p>
          )}
        </div>
      </Modal>
      {/* Address Modals */}
      <Modal
        title='My Addresses'
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null} // Ẩn các nút Cancel và Confirm
        width={500}
      >
        <Radio.Group
          onChange={(e) => handleSelectAddress(e.target.value)} // Ensure state updates correctly
          value={selectedAddressId} // Bind to selectedAddressId state
          className='max-h-60 overflow-y-auto scrollbar-hide'
        >
          {addresses.map((addr) => (
            <div
              key={addr._id} // Ensure unique key using address ID
              className='flex items-start justify-between p-3 border bg-[#E6DBCD] border-gray-200 rounded-xl  m-3'
            >
              <Radio value={addr._id}>
                {' '}
                {/* Use addr._id as the value */}
                <div>
                  <p className='m-0'>
                    {addr.street}, {addr.city} ,{addr.country}
                  </p>
                </div>
              </Radio>
            </div>
          ))}
        </Radio.Group>
      </Modal>
    </div>
  );
};

export default Checkout;
