import React from "react";
import { FaLongArrowAltRight } from "react-icons/fa";
import { getAvatarName, getBgColor } from "../../utils";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateTable } from "../../redux/slices/customerSlice";

const TableCard = ({ key, name, status, initials, seats }) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleClick = (name) => {
    if(status === "Booked") return;
    dispatch(updateTable({tableNo: name }))
    navigate('/menu');
  };


  return (
    <div onClick={() => handleClick(name)} key={key} className="w-full rounded-xl bg-[#262626] p-5 hover:bg-[#2c2c2c] transition-all duration-300 cursor-pointer">
      <div className="flex items-start justify-between gap-3">
        <h1 className="text-white font-semibold text-lg flex items-center flex-wrap">
          Table
          <FaLongArrowAltRight className="mx-2 text-[#ababab]" />
          {name}
        </h1>

        <span
          className={`px-3 py-1 rounded-lg text-sm font-medium whitespace-nowrap ${
            status === "Booked" || status === "booked"
              ? "bg-[#2e4a40] text-green-400"
              : "bg-[#664a04] text-yellow-300"
          }`}
        >
          {status}
        </span>
      </div>

      <div className="flex justify-center mt-8">
        <h1
          className='rounded-full text-white text-xl p-5'
          style={{backgroundColor : initials ? getBgColor() : "#1f1f1f"}}
        >
         {getAvatarName(initials) || "N/A"}
        </h1>
      </div>
      <p className="text-[#ababab] text-xs">Seats: <span className="text=[#f5f5f5]">{seats}</span></p>
    </div>
  );
};

export default TableCard;