import React, { useState } from 'react';
import {
  BarsOutlined,
  EyeOutlined,
  HeartOutlined,
  QrcodeOutlined,
  ReadOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Card, Checkbox, Menu, Pagination, Select, Slider, Switch, message } from 'antd';
import { useEffect } from 'react';
import productsApi from '../../hooks/useProductsApi';
import LoadingSpinner from '../../components/loading';
import ShopingCartApi from '../../hooks/useShopingCart'; // Import API
import { useSelector } from 'react-redux';
import { Spin } from 'antd';

export default function ProductPage() {
  const [filterBooks, setFilterBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [bookList, setBookList] = useState([]);
  const [booksPerPage, setBooksPerPage] = useState(10); // Số sách mặc định mỗi trang

  const [searchKeyword, setSearchKeyword] = useState(''); // State for the search keyword
  const hardcodedCategories = [
    'Classic',
    'Psychological',
    'Mystery',
    'Sci-Fi',
    'Biography',
    'Fantasy',
    'Romance',
    'History',
  ];
  const [addingToCart, setAddingToCart] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const [selectedSort, setSelectedSort] = useState('default');

  const userId = useSelector((state) => state.user._id);
  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await productsApi.getAllProducts({
        category: selectedCategories.join(','),
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        author: selectedAuthors.join(','),
        page: currentPage,
        limit: booksPerPage,
        sort: selectedSort,
      });
      const data = response.data;
      setBookList(data.data);
      setFilterBooks(data.data);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch filtered books based on the search keyword
  const searchBooks = async (keyword) => {
    setLoading(true);
    try {
      const response = await productsApi.searchProducts(keyword);
      const data = await response.data;
      setBookList(data);
      setFilterBooks(data);
    } catch (error) {
      console.error('Error searching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      setAddingToCart(true);
      const response = await ShopingCartApi.addProductToCart(productId);
      console.log('Product added to cart:', response.data);
      message.success('Product successfully added to cart!');
    } catch (error) {
      console.error('Error adding product to cart:', error);
      message.success('Failed to add product to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  // Call fetchBooks when the component first loads
  useEffect(() => {
    fetchBooks();
  }, [currentPage, priceRange, selectedCategories, selectedAuthors, selectedSort, booksPerPage]);

  const handleSearchChange = (e) => {
    const keyword = e.target.value;
    setSearchKeyword(keyword);

    if (keyword.trim() === '') {
      // If search keyword is empty, fetch all products
      fetchBooks();
    } else {
      // Fetch products based on the search keyword
      searchBooks(keyword);
    }
  };

  const handlePriceRangeChange = (value) => {
    setPriceRange(value); // Cập nhật priceRange khi người dùng thay đổi thanh trượt
  };

  // Sửa categoryItems để có thể chọn và bỏ chọn danh mục
  const categoryItems = hardcodedCategories.map((category, index) => ({
    key: `category-${index}`,
    label: (
      <Checkbox
        value={category}
        onChange={(e) => handleCategoryChange(e, category)} // Xử lý sự kiện chọn/deselect
      >
        {category}
      </Checkbox>
    ),
  }));

  // Hàm để xử lý sự kiện thay đổi danh mục
  const handleCategoryChange = (e, category) => {
    let updatedCategories;
    if (e.target.checked) {
      updatedCategories = [...selectedCategories, category]; // Thêm vào danh mục đã chọn
    } else {
      updatedCategories = selectedCategories.filter((cat) => cat !== category); // Loại bỏ danh mục không chọn
    }
    setSelectedCategories(updatedCategories); // Cập nhật selectedCategories
  };

  const categorys = [
    {
      key: 'sub1',
      label: 'Categories',
      icon: <ReadOutlined />,
      children: categoryItems,
    },
  ];

  // Filter by Price
  const [disabled, setDisabled] = useState(false);
  const onChange = (checked) => {
    setDisabled(checked);
  };

  // View Change
  const [viewMode, setViewMode] = useState('block');

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  return (
    <div className='container mx-auto'>
      <div className='header my-5 bg-slate-200 p-5 sm:p-10 flex justify-center sm:justify-between items-center'>
        <h1 className='hidden sm:block text-2xl text-red-500 font-medium'>
          <span className='text-lg text-black sm:hidden md:block'>Welcome to</span> Books Page!
        </h1>
        <div className='flex w-4/5 py-1 sm:w-1/2 md:w-2/3 items-center border rounded-full px-2 sm:px-3 sm:py-3 bg-gray-100'>
          <input
            type='text'
            value={searchKeyword}
            onChange={handleSearchChange} // Handle search input change
            placeholder='Search products...'
            className='flex-grow outline-none bg-transparent text-sm sm:text-base text-gray-700 px-2'
          />
          <SearchOutlined className='text-white cursor-pointer text-lg sm:text-xl bg-red-500 p-2 rounded-full transition-transform duration-300 transform hover:scale-110' />
        </div>
      </div>
      <div className='flex flex-col lg:flex-row justify-between md:items-center lg:items-start'>
        <div className='mx-5 lg:mx-0 list-books lg:w-1/6 flex flex-col md:w-11/12 md:mx-52'>
          <div className='genre'>
            <div className='genre-ipad hidden lg:block'>
              <Menu
                className='h-80 overflow-y-auto'
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['sub1']}
                mode='inline'
                items={categorys}
              />
            </div>
            <div className='genre-phone lg:hidden'>
              <Select
                mode='multiple'
                value={selectedCategories}
                onChange={(value) => setSelectedCategories(value)} // Cập nhật selectedCategories khi người dùng thay đổi
                options={hardcodedCategories.map((category) => ({
                  label: category,
                  value: category,
                }))}
              />
            </div>
          </div>

          <div className='hidden lg:block'>
            <br />
          </div>

          <div className='price'>
            <div className='price-ipad hidden lg:block'>
              <Card
                title='Filter by Price'
                className='h-auto overflow-y-auto bg-gray-50'
                bordered={false}
              >
                <Slider
                  range
                  value={priceRange}
                  onChange={handlePriceRangeChange} // Xử lý khi người dùng thay đổi thanh trượt
                  max={200000}
                  disabled={disabled}
                />
                <div className='flex justify-between mt-2'>
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>

                <div className='my-5'>
                  Disabled:{' '}
                  <Switch
                    size='small'
                    checked={disabled}
                    onChange={(checked) => setDisabled(checked)}
                  />
                </div>
              </Card>
            </div>
            <div className='price-phone lg:hidden mx-5'>
              <Slider
                range
                defaultValue={priceRange}
                max={200000}
                className='w-full md:w-5/6'
                disabled={disabled}
              />
              <div className='flex justify-between md:w-5/6 mt-2'>
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
              <div className='my-1'>
                Disabled:{' '}
                <Switch
                  size='small'
                  checked={disabled}
                  onChange={(checked) => setDisabled(checked)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className='all-books w-full md:w-11/12 lg:w-5/6 lg:ml-4 sm:flex flex-col items-center'>
          <div className='header-all-books flex justify-between items-center mx-4 my-2 lg:my-0 lg:w-11/12'>
            <div className='option-form-left flex items-center w-1/12 justify-end lg:justify-start'>
              <QrcodeOutlined
                className={`mr-2 choice-icon-tnvd ${viewMode === 'block' ? 'text-blue-500' : ''}`}
                onClick={() => handleViewModeChange('block')}
              />
              <BarsOutlined
                className={`choice-icon-tnvd hidden md:block ${
                  viewMode === 'line' ? 'text-blue-500' : ''
                }`}
                onClick={() => handleViewModeChange('line')}
              />
            </div>
            <div className='options-right flex justify-between items-center'>
              <div className='option-show'>
                <Select
                  defaultValue='Default sorting'
                  value={selectedSort}
                  onChange={(value) => setSelectedSort(value)} // Cập nhật selectedSort khi người dùng thay đổi
                  className='w-44 mr-2'
                  options={[
                    { value: 'default', label: 'Default sorting' },
                    { value: 'popularity', label: 'Sort by popularity' },
                    { value: 'averageRating', label: 'Sort by average rating' },
                    { value: 'latest', label: 'Sort by latest' },
                    { value: 'priceLowToHigh', label: 'Sort by price: low to high' },
                    { value: 'priceHighToLow', label: 'Sort by price: high to low' },
                  ]}
                />
              </div>
              <div className='option-number-books-show'>
                <Select
                  defaultValue='Show 10'
                  value={`Show ${booksPerPage}`} // Hiển thị số lượng sách đang chọn
                  onChange={(value) => setBooksPerPage(parseInt(value.replace('Show ', '')))} // Cập nhật booksPerPage khi người dùng thay đổi
                  className='w-28'
                  options={[
                    { value: 'Show 5', label: 'Show 5' },
                    { value: 'Show 10', label: 'Show 10' },
                    { value: 'Show 20', label: 'Show 20' },
                    { value: 'Show 50', label: 'Show 50' },
                  ]}
                />
              </div>
            </div>
          </div>
          <div className='horizontal-line bg-slate-200 h-px w-11/12 my-2 mx-10'></div>
          <div className=''>
            {loading ? (
              <div className='flex justify-center items-center h-screen'>
                <div className='text-center'>
                  <LoadingSpinner />
                </div>
              </div>
            ) : (
              <div className=''>
                {viewMode === 'block' ? (
                  <div className='list-by-block sm:w-11/12 xl:w-full'>
                    {bookList.length === 0 ? (
                      <div className='not-found'>
                        <h2 className='text-center my-20'>
                          No books found matching the selected filters.
                        </h2>
                      </div>
                    ) : (
                      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'>
                        {bookList.map((book, index) => {
                          const imageUrl = book.images[0] ? book.images[0] : '';

                          return (
                            <div
                              className='flex flex-col sm:flex-row justify-between items-center'
                              key={index}
                            >
                              <div
                                id={index}
                                className='bg-white w-11/12 sm:w-full h-auto p-3 rounded-lg transition duration-500 ease-in-out hover:shadow-md sm:mb-4'
                              >
                                <div className='relative group overflow-hidden rounded-lg mb-4'>
                                  <img
                                    src={imageUrl}
                                    alt={book.title}
                                    className='w-full h-96 object-cover'
                                  />
                                  <div className='absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-500'>
                                    <div className='absolute right-5 top-1/2 -translate-y-1/2 flex flex-col gap-4'>
                                      <button className='flex justify-center p-3 bg-white rounded-full hover:bg-red-500 hover:text-white transform translate-x-10 group-hover:translate-x-0 duration-300 shadow-lg'>
                                        <HeartOutlined className='w-6 h-6 flex justify-center items-center text-black-500' />
                                      </button>
                                      <button className='flex justify-center items-center px-2 py-3 bg-white rounded-full hover:bg-red-500 hover:text-white transform translate-x-10 group-hover:translate-x-0 duration-300 delay-75 shadow-lg'>
                                        <EyeOutlined className='w-6 h-6 flex justify-center items-center text-black-500' />
                                      </button>
                                      <button
                                        className={`flex justify-evenly items-center px-1 py-3 bg-white rounded-full ${
                                          addingToCart
                                            ? 'opacity-50 cursor-not-allowed'
                                            : 'hover:bg-red-500 hover:text-white'
                                        } transition-all transform translate-x-10 group-hover:translate-x-0 duration-300 delay-150 shadow-lg`}
                                        onClick={() => handleAddToCart(book._id)}
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
                                <p className='text-2xl font-bold mb-2 truncate'>{book.title}</p>
                                <div className='flex justify-between mb-2 items-center mr-5'>
                                  <p className='text-lg text-gray-600 truncate'>{book.author}</p>
                                  <p className='text-md text-gray-600 italic truncate'>
                                    {book.category}
                                  </p>
                                </div>
                                <p className='text-lg font-bold text-red-500'>${book.price}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className='grid-view'>
                    {/* Your grid view content goes here */}
                    {/* For example, you might display the books in a grid layout */}
                    <div className='grid grid-cols-2 gap-4'>
                      {bookList.map((book, index) => (
                        <div key={index} className='card'>
                          <img src={book.images[0]} alt={book.title} />
                          <h3>{book.title}</h3>
                          <p>{book.author}</p>
                          <p>{book.price}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Pagination */}
          <Pagination
            current={currentPage}
            total={totalPages * booksPerPage} // Tổng số mục = số trang * số mục mỗi trang
            pageSize={booksPerPage} // Sử dụng booksPerPage thay cho pageSize cố định
            onChange={(page) => setCurrentPage(page)} // Cập nhật trang khi người dùng chuyển trang
            className='mt-4 mb-4'
          />
        </div>
      </div>
    </div>
  );
}
