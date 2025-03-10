import { AlignLeftOutlined, AreaChartOutlined, CarOutlined, WalletOutlined, ProfileOutlined, DropboxOutlined, HomeOutlined, PlayCircleTwoTone, RightOutlined, SettingOutlined, TagsOutlined, UserSwitchOutlined, WechatOutlined, ProductOutlined } from '@ant-design/icons';
import { Button, Drawer, Menu } from 'antd';
import Item from 'antd/es/list/Item';
import { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import shopApi from '../../hooks/useShopApi';

export default function SideBarSeller({ onToggle, isOpen }) {

    const [open, setOpen] = useState(false);
    const id = useParams().id;
    const [shopDetail, setShopDetail] = useState();
    const Menus = [
        { title: "Profile", icon: <ProfileOutlined className='text-2xl' />, path: `/shop/${shopDetail?.shopName}/profile/${shopDetail?._id}` },
        { title: "Product", icon: <ProductOutlined className='text-2xl' />, path: `/shop/${shopDetail?.shopName}/home/${shopDetail?._id}` },
        { title: "Order", icon: <DropboxOutlined className='text-2xl' />, path: `/shop/${shopDetail?.shopName}/orders/${shopDetail?._id}` },

        { title: "Sale Data", icon: <AreaChartOutlined className='text-2xl' />, path: `/shop/${shopDetail?.shopName}/saleData/${shopDetail?._id}` },

        { title: "Withdrawal", icon: <WalletOutlined className='text-2xl' />, path:  `/shop/${shopDetail?.shopName}/withdrawals/${shopDetail?._id}`},   
        { title: "Discount", icon: <TagsOutlined className='text-2xl' />, path: `/shop/${shopDetail?.shopName}/voucher/${shopDetail?._id}`},
        { title: "Chat", icon: <WechatOutlined className='text-2xl' />, path: `/${shopDetail?.shopName}/chat/${shopDetail?._id}` },
        { title: "Switch Customer", icon: <UserSwitchOutlined className='text-2xl' />, path: "/" },
    ];

    useEffect(() => {
        const fetchShopDetail = async () => {
            try {
                const response = await shopApi.getDetailShop(id); // Gọi API
                const { shop } = response.data; // Lấy dữ liệu từ response
                setShopDetail(shop); // Lưu thông tin shop
            } catch (error) {
                console.error("Error fetching shop detail:", error);
            }
        };

        fetchShopDetail();
    }, [id]);

    // Tablet - Mobile - Ipad
    const [openDrawer, setOpenDrawer] = useState(false);
    const showDrawer = () => {
        setOpenDrawer(true);
    };
    const onCloseDrawer = () => {
        setOpenDrawer(false);
    };
    return (
        <div className="">
            <div className={`${isOpen ? "w-52" : "w-20"} duration-300 relative h-full bg-gradient-to-br from-[#679089] via-[#679079] to-[#679069] hidden lg:block rounded-l-lg`}>
                <div className="w-64 h-20">
                    <div className="w-3/5 flex justify-between items-center mx-2">
                        <img src={shopDetail?.images[0] || "https://via.placeholder.com/150"} 
                            alt="Shop" className={`cursor-pointer duration-500 rounded-full w-16 h-16 my-2`} />
                    </div>
                </div>
                <RightOutlined className={`${isOpen && "rotate-180"} absolute text-3xl cursor-pointer -right-4 top-16 w-8 border-2 bg-slate-50 text-slate-500 border-slate-50 rounded-full`} onClick={onToggle} />
                <ul className='pt-6'>
                    {Menus.map((menu, index) => (
                        <NavLink
                            key={index}
                            to={menu.path}
                            className={({ isActive }) => `flex items-center gap-x-4 py-4 h-16 px-7 text-base ${isActive ? 'bg-[#eee5da] text-[#f18966]' : 'text-slate-200'} hover:bg-[#eee5da] duration-300 hover:text-black`}
                        >
                            {menu.icon}
                            <span className={`${!isOpen && "scale-0"} origin-left duration-100 text-base font-medium`}>{menu.title}</span>
                        </NavLink>
                    ))}
                </ul>
            </div>
            {/* Tablet - Mobile - Ipad */}
            <div className="m-2 lg:hidden ">
                <Button type="primary" onClick={showDrawer} className='text-base bg-[#679089] text-white px-3 py-2 rounded-full hover:bg-slate-100 duration-300 hover:text-bg-teal-500'>
                    <AlignLeftOutlined />
                </Button>
                <Drawer title="Menu" onClose={onCloseDrawer} open={openDrawer} placement="left" width={225}>
                    <div className="">
                        <div className="w-64 h-20 mb-4">
                            <div className="w-8/12 flex justify-center items-center mx-2">
                                <img src={shopDetail?.images[0] || "https://via.placeholder.com/150"} alt="" className={`cursor-pointer duration-500 rounded-full w-25 h-25 my-2`} />
                            </div>
                        </div>
                        <ul className='pt-6'>
                            {Menus.map((menu, index) => (
                                <NavLink
                                    key={index}
                                    to={menu.path}
                                    className={({ isActive }) => `flex items-center gap-x-4 py-4 h-16 px-7 text-base ${isActive ? 'bg-slate-100 text-indigo-600' : 'text-gray-600'} hover:bg-slate-100 duration-300`}
                                >
                                    {menu.icon}
                                    <span className={`${!isOpen && "scale-0"} origin-left duration-300 text-base font-medium`}>{menu.title}</span>
                                </NavLink>
                            ))}
                        </ul>
                    </div>
                </Drawer>
            </div>
        </div>
    );
}
