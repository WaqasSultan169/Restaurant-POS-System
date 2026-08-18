import React, { useState, useEffect } from 'react';
import { FaSearch } from "react-icons/fa";
import OrderList from './OrderList';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { getOrders } from '../../https/index';

const RecentOrders = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const { data: resData, isError, isLoading } = useQuery({
        queryKey: ["orders"],
        queryFn: async () => {
            return await getOrders();
        },
        placeholderData: keepPreviousData,
    });

    useEffect(() => {
        if (isError) {
            enqueueSnackbar("Something Went Wrong!", { variant: "error" });
        }
    }, [isError]);

    // Extract orders array safely
    const ordersList = resData?.data?.data || [];

    // Optional: Filter orders based on search input
    const filteredOrders = ordersList.filter((order) => {
        const customerName = order?.customerDetails?.name || '';
        const orderId = order?._id || '';
        return (
            customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            orderId.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    return (
        <div className="px-8 mt-6">
            <div className='bg-[#1a1a1a] w-full h-[450px] rounded-lg'>
                <div className='flex justify-between items-center px-6 py-4'>
                    <h1 className='text-[#f5f5f5] text-lg font-semibold tracking-wide'>Recent Orders</h1>
                    <a href="#" className='text-[#025cca] text-sm font-semibold'>View All</a>
                </div>

                {/* Search Bar */}
                <div className="flex items-center gap-4 bg-[#1f1f1f] rounded-[20px] px-6 py-4 mx-6">
                    <FaSearch className="text-[#f5f5f5]" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search Recent Orders"
                        className="bg-[#1f1f1f] outline-none text-[#f5f5f5] px-2 py-1 rounded-md w-full"
                    />
                </div>

                {/* Order List */}
                <div className='mt-4 px-6 overflow-y-auto h-[300px] scrollbar-hide'>
                    {isLoading ? (
                        <p className='text-gray-500 text-center py-4'>Loading orders...</p>
                    ) : filteredOrders.length > 0 ? (
                        filteredOrders.map((order) => (
                            <OrderList key={order._id} order={order} />
                        ))
                    ) : (
                        <p className='text-gray-500 text-center py-4'>No Orders Available</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default RecentOrders;