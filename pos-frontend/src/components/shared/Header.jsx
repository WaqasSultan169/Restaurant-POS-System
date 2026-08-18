import React from 'react';
import { FaBell, FaSearch, FaUserCircle } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { IoLogOut } from 'react-icons/io5';
import { useMutation } from '@tanstack/react-query';
import { logout } from '../../https';
import { removeUser } from '../../redux/slices/userSlice';
import { useNavigate } from 'react-router-dom';
import { MdDashboard } from 'react-icons/md';

const Header = () => {

    const userData = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const logoutMutation = useMutation({
        mutationFn: () => logout(),
        onSuccess: (data) => {
            console.log(data);
            dispatch(removeUser());
            navigate("/auth");
        },
        onError: (error) => {
            console.log(error);
        }
    })

    const handleLogout = () => {
        logoutMutation.mutate();
    }

  return (
    <header className="flex justify-between items-center py-4 px-8 bg-[#1a1a1a]">
        {/* Logo */}
        <div onClick={() => navigate("/")} className="flex items-center gap-2 cursor-pointer">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f5f5f5] text-sm font-semibold text-[#1a1a1a]">
                WS
            </div>
            <h1 className="text-lg font-semibold text-[#f5f5f5]">WS</h1>
        </div>

        {/* Search */}
        <div className="flex items-center gap-4 bg-[#1f1f1f] rounded-[20px] px-5 py-3 w-[500px]">
            <FaSearch className="text-[#f5f5f5]" />
            <input
                type="text"
                placeholder="Search..."
                className="bg-[#1f1f1f] outline-none text-[#f5f5f5] px-2 py-1 rounded-md"
            />
        </div>

        {/* LOGGED USER DETAILS */}
        <div className="flex items-center gap-4">
            {
                userData.role === "admin" && (
                    <div onClick={() => navigate("/dashboard")} className="bg-[#1f1f1f] rounded-[15px] p-3 cursor-pointer">
                        <MdDashboard className="text-[#f5f5f5] text-2xl" />
                    </div>
                )
            }
            <div className="bg-[#1f1f1f] rounded-[15px] p-3 cursor-pointer">
                <FaBell className="text-[#f5f5f5] text-2xl" />
            </div>
            <div className="flex items-center gap-3 cursor-pointer">
                <FaUserCircle className="text-[#f5f5f5] text-4xl" />
                <div className="flex flex-col items-start">
                    <h1 className="text-[#f5f5f5] text-md font-semibold">{userData.name || "TEST USER"}</h1>
                    <p className="text-[#ababab] text-xs font-medium">{userData.role || "N/A"}</p>
                </div>
                <IoLogOut onClick={handleLogout} className="text-[#f5f5f5] ml-2" size={40} />
            </div>
        </div>
    </header>
    );
};

export default Header;