import React, { useState,useEffect } from "react";
import { TbSquareRoot } from "react-icons/tb";
import { FaChalkboardTeacher } from "react-icons/fa";
import { useLocation, useNavigate } from 'react-router-dom';

import {
  FiBarChart,
  FiChevronDown,
  FiChevronsRight,
  FiDollarSign,
  FiHome,
  FiMonitor,
  FiShoppingCart,
  FiTag,
  FiUsers,
} from "react-icons/fi";
import { motion } from "framer-motion";

export const Example = () => {
  return (
    <div className="">
      <AdminSidebar />

    </div>
  );
};

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(true);
  const [selected, setSelected] = useState("");
  useEffect(() => {
    if (location.pathname.includes("admin-dashboard")) {
      setSelected("AdminDashboard");
    } else if (location.pathname.includes("admin-controls")) {
      setSelected("AdminControls");
    }
    
  }, [location.pathname]);
  return (
    <motion.nav
      layout
      className="sticky top-0 h-screen shrink-0 border-r border-orange-300 bg-orange-50 p-2"
      style={{
        width: open ? "225px" : "fit-content",
      }}
    >
      <TitleSection open={open} />

      <div className="space-y-1">
        <Option
          onClick={() => navigate('/admin-dashboard')}
          Icon={FiHome}
          title="Admin  Dashboard"
          selected={selected}
          setSelected={setSelected}
          open={open}
        />
        <Option
          onClick={() => navigate('/admin-controls')}
          Icon={FaChalkboardTeacher}
          title="Admin Controls"
          selected={selected}
          setSelected={setSelected}
          open={open}
        />
        
       </div>

      <ToggleClose open={open} setOpen={setOpen} />
    </motion.nav>
  );
};

const Option = ({ Icon, title, selected, setSelected, open, notifs, onClick }) => {
  return (
    <motion.button
      layout
      onClick={() => {
        setSelected(title);
        if (typeof onClick === "function") {
          onClick();
        }
      }}
      className={`relative flex h-10 w-full items-center rounded-md transition-colors ${
        selected === title
          ? "bg-orange-400 text-white"
          : "text-orange-500 hover:bg-orange-100"
      }`}
    >
      <motion.div
        layout
        className="grid h-full w-10 place-content-center text-lg"
      >
        <Icon />
      </motion.div>
      {open && (
        <motion.span
          layout
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.125 }}
          className="text-xs font-medium"
        >
          {title}
        </motion.span>
      )}

      {notifs && open && (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          style={{ y: "-50%" }}
          transition={{ delay: 0.5 }}
          className="absolute right-2 top-1/2 size-4 rounded bg-indigo-500 text-xs text-white"
        >
          {notifs}
        </motion.span>
      )}
    </motion.button>
  );
};


const TitleSection = ({ open }) => {
  const navigate = useNavigate();
  return (
    <div className="mb-3 border-b border-orange-300 pb-3">
      <div className="flex cursor-pointer items-center justify-between rounded-md transition-colors hover:bg-orange-100">
        <div className="flex items-center gap-2">
        <motion.div
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.125 }}
            >
              
              <h1 className="mr-1 transition-transform duration-300 hover:scale-110">
                          <TbSquareRoot className="text-4xl text-orange-600" />
                        </h1>
            </motion.div>
        
          {open && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.125 }}
            >

              <span
                onClick={() => navigate("/")}
                className="block text-xl font-bold text-orange-500"
              >
                TUTOR
              </span>
            </motion.div>
          )}
        </div>

      </div>
    </div>
  );
};

const Logo = () => {
  // Temp logo from https://logoipsum.com/
  return (
    <motion.div
      layout
      className="grid size-10 shrink-0 place-content-center rounded-md bg-indigo-600"
    >
      <svg
        width="24"
        height="auto"
        viewBox="0 0 50 39"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="fill-orange-50"
      >
        <path
          d="M16.4992 2H37.5808L22.0816 24.9729H1L16.4992 2Z"
          stopColor="#000000"
        ></path>
        <path
          d="M17.4224 27.102L11.4192 36H33.5008L49 13.0271H32.7024L23.2064 27.102H17.4224Z"
          stopColor="#000000"
        ></path>
      </svg>
    </motion.div>
  );
};

const ToggleClose = ({ open, setOpen }) => {
  return (
    <motion.button
      layout
      onClick={() => setOpen((prev) => !prev)}
      className="absolute bottom-0 left-0 right-0 border-t border-orange-300 transition-colors hover:bg-orange-100"
    >
      <div className="flex items-center p-2">
        <motion.div
          layout
          className="grid size-10 place-content-center text-lg"
        >
          <FiChevronsRight
            className={`transition-transform ${open && "rotate-180"} text-orange-500`}
          />
        </motion.div>
        {open && (
          <motion.span
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.125 }}
            className="text-xs font-medium text-orange-500"
          >
            Hide
          </motion.span>
        )}
      </div>
    </motion.button>
  );
};



export default AdminSidebar;
