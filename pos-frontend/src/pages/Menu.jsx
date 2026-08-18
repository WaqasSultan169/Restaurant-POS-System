import React from 'react';
import BottomNav from '../components/shared/BottomNav';
import BackButton from '../components/shared/BackButton';
import { MdRestaurantMenu } from 'react-icons/md';
import MenuContainer from '../components/menu/MenuContainer';
import CustomerInfo from '../components/menu/CustomerInfo';
import CartInfo from '../components/menu/CartInfo';
import Bill from '../components/menu/Bill';
import { useSelector } from 'react-redux';

function Menu() {

  const customerData = useSelector(state => state.customer);

  return (
    <section className='bg-[#1f1f1f] min-h-screen flex pb-24 px-4'>
      {/* Left Div */}
      <div className="flex-[3]">
        <div className="flex flex-col gap-4 justify-between items-start px-6 py-4 lg:flex-row lg:items-center">
          <div className="flex items-center gap-4">
            <BackButton />
            <h1 className="text-[#f5f5f5] text-2xl font-bold tracking-wider">Menu</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3 cursor-pointer">
              <MdRestaurantMenu className="text-[#f5f5f5] text-4xl" />
              <div className="flex flex-col items-start">
                <h1 className="text-[#f5f5f5] text-md font-semibold">{customerData.customerName || "Customer Name"}</h1>
                <p className="text-[#ababab] text-xs font-medium">{customerData.tableNo || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>

        <MenuContainer />
      </div>

      <div className="flex-[1] bg-[#1a1a1a] mt-4 mr-3 max-h-[calc(100vh-110px)] overflow-y-auto rounded-lg pt-2 pb-6 [::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {/* Customer Info */}
        <CustomerInfo />
        {/* Cart Info */}
        <hr className='border-[#2a2a2a] border-t-2' />
        <CartInfo />
        <hr className='border-[#2a2a2a] border-t-2' />
        {/* Bills */}
        <Bill />
      </div>

      <BottomNav />
    </section>
  )
}

export default Menu;