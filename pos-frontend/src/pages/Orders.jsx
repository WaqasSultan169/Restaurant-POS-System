import React, { useState, useEffect } from 'react';
import BottomNav from '../components/shared/BottomNav';
import OrderCard from '../components/orders/OrderCard';
import BackButton from '../components/shared/BackButton';
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getOrders } from '../https/index';
import { enqueueSnackbar } from 'notistack';

const Orders = () => {
  const [status, setStatus] = useState('all');

  const { data: resData, isError, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      return await getOrders();
    },
    placeholderData: keepPreviousData
  });

  useEffect(() => {
    if (isError) {
      enqueueSnackbar("Something Went Wrong!", { variant: "error" });
    }
  }, [isError]);

  const ordersList = resData?.data?.data || [];

  const filteredOrders = ordersList.filter((order) => {
    if (status === 'all') return true;
    if (status === 'progress') return order.orderStatus?.toLowerCase() === 'in progress' || order.orderStatus?.toLowerCase() === 'progress';
    if (status === 'ready') return order.orderStatus?.toLowerCase() === 'ready';
    if (status === 'completed') return order.orderStatus?.toLowerCase() === 'completed';
    return true;
  });

  return (
    <section className="bg-[#1f1f1f] min-h-screen pb-28 flex flex-col overflow-hidden">
      <div className="flex flex-col gap-4 justify-between items-start px-6 py-4 lg:flex-row lg:items-center">
        <div className="flex items-center gap-4">
          <BackButton />
          <h1 className="text-[#f5f5f5] text-2xl font-bold tracking-wider">Orders</h1>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-3">
          {[
            { id: 'all', label: 'All' },
            { id: 'progress', label: 'In Progress' },
            { id: 'ready', label: 'Ready' },
            { id: 'completed', label: 'Completed' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatus(tab.id)}
              className={`text-[#ababab] text-lg rounded-lg px-5 py-2 font-semibold transition-all ${
                status === tab.id ? 'bg-[#383838] text-white' : 'hover:bg-[#2a2a2a]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 pb-4 flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto scrollbar-hide">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {isLoading ? (
              <p className="col-span-full text-gray-400">Loading orders...</p>
            ) : filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <OrderCard key={order._id} order={order} />
              ))
            ) : (
              <p className="col-span-full text-gray-500">No Orders Available</p>
            )}
          </div>
        </div>
      </div>

      <BottomNav />
    </section>
  );
};

export default Orders;