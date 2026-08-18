import React from 'react';
import BottomNav from '../components/shared/BottomNav';
import Greetings from '../components/home/Greetings';
import MiniCard from '../components/home/MiniCard';
import { BsCashCoin } from "react-icons/bs";
import { GrInProgress } from "react-icons/gr";
import RecentOrders from '../components/home/RecentOrders';
import PopularDishes from '../components/home/PopularDishes';


const Home = () => {
  return (
    <section className="bg-[#1f1f1f] min-h-screen pb-24 px-4">
      <div className="flex flex-col gap-3 lg:flex-row">
        {/* Left Div */}
        <div className="flex-[3]">
          <Greetings />
          <div className="flex items-center w-full gap-3 px-8 mt-8">
            <MiniCard title="Total Earnings" icon={<BsCashCoin />} number={512} footerNum={1.6} />
            <MiniCard title="In Progress" icon={<GrInProgress   />} number={16} footerNum={3.6} />
          </div>
          <RecentOrders />
        </div>
      {/* Right Div */}
      <div className="flex-[2]">
        <PopularDishes />
      </div>
      </div>
      <BottomNav />
    </section>
    );
};

export default Home;