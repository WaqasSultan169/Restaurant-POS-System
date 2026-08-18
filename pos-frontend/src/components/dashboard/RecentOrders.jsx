import React, { useEffect } from "react";
import { GrUpdate } from "react-icons/gr";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { getOrders, updateOrderStatus } from "../../https/index";
import { formatDateAndTime } from "../../utils";

const RecentOrders = () => {
  const queryClient = useQueryClient();

  const handleStatusChange = ({ orderId, orderStatus }) => {
    orderStatusUpdateMutation.mutate({ orderId, orderStatus });
  };

  const orderStatusUpdateMutation = useMutation({
    mutationFn: ({ orderId, orderStatus }) => updateOrderStatus({ orderId, orderStatus }),
    onSuccess: () => {
      enqueueSnackbar("Order status updated successfully!", { variant: "success" });
      queryClient.invalidateQueries(["orders"]); // Refresh order list
    },
    onError: () => {
      enqueueSnackbar("Failed to update order status!", { variant: "error" });
    }
  });

  const { data: resData, isError, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      return await getOrders();
    },
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (isError) {
      enqueueSnackbar("Something went wrong loading orders!", { variant: "error" });
    }
  }, [isError]);

  const ordersList = resData?.data?.data || [];

  return (
    <div className="container mx-auto bg-[#262626] p-4 rounded-lg">
      <h2 className="text-[#f5f5f5] text-xl font-semibold mb-4">
        Recent Orders
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[#f5f5f5]">
          <thead className="bg-[#333] text-[#ababab]">
            <tr>
              <th className="p-3">Order ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date & Time</th>
              <th className="p-3">Items</th>
              <th className="p-3">Table No</th>
              <th className="p-3">Total</th>
              <th className="p-3 text-center">Payment Method</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="8" className="p-4 text-center text-gray-400">Loading orders...</td>
              </tr>
            ) : ordersList.length > 0 ? (
              ordersList.map((order) => (
                <tr
                  key={order._id}
                  className="border-b border-gray-600 hover:bg-[#333]"
                >
                  <td className="p-4">#{order._id?.slice(-6)}</td>
                  <td className="p-4">{order.customerDetails?.name || "Walk-in Customer"}</td>
                  <td className="p-4">
                    <select
                      className={`bg-[#1a1a1a] border border-gray-500 p-2 rounded-lg focus:outline-none ${
                        order.orderStatus === "Ready" || order.orderStatus === "Completed"
                          ? "text-green-500"
                          : "text-yellow-500"
                      }`}
                      value={order.orderStatus || "In Progress"}
                      onChange={(e) =>
                        handleStatusChange({
                          orderId: order._id,
                          orderStatus: e.target.value,
                        })
                      }
                    >
                      <option className="text-yellow-500" value="In Progress">
                        In Progress
                      </option>
                      <option className="text-green-500" value="Ready">
                        Ready
                      </option>
                      <option className="text-blue-500" value="Completed">
                        Completed
                      </option>
                    </select>
                  </td>
                  <td className="p-4">
                    {order.createdAt ? formatDateAndTime(order.createdAt) : "N/A"}
                  </td>
                  <td className="p-4">
                    {order.items?.length || 0} {order.items?.length === 1 ? "Item" : "Items"}
                  </td>
                  <td className="p-4">Table - {order.customerDetails?.tableNo || "N/A"}</td>
                  <td className="p-4">${(order.bills?.totalWithTax || order.total || 0).toFixed(2)}</td>
                  <td className="p-4 text-center">
                    {order.paymentMethod || "Cash"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="p-4 text-center text-gray-400">No orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders;