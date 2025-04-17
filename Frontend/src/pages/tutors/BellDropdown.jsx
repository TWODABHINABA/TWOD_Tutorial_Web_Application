// import { FiBell, FiCheckCircle } from "react-icons/fi";
// import { useState, useRef, useEffect } from "react";

// const BellDropdown = () => {
//   const [show, setShow] = useState(false);
//   const dropdownRef = useRef(null);

//   // Sample notifications with additional properties
//   const [notifications, setNotifications] = useState([
//     {
//       id: 1,
//       student: "John Doe",
//       course: "React Basics",
//       image: "https://placehold.it/45x45",
//       time: "Just now",
//       read: false,
//     },
//     {
//       id: 2,
//       student: "Aisha Khan",
//       course: "JS Data Structures",
//       image: "https://placehold.it/45x45",
//       time: "1 hour ago",
//       read: false,
//     },
//   ]);

//   // Calculate the number of unread notifications
//   const unreadCount = notifications.filter(n => !n.read).length;

//   // Close dropdown if clicked outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setShow(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Mark all notifications as read
//   const markAllAsRead = () => {
//     const updatedNotifications = notifications.map(notification => ({
//       ...notification,
//       read: true,
//     }));
//     setNotifications(updatedNotifications);
//   };

//   return (
//     <div ref={dropdownRef} className="relative inline-block">
//       <div className="flex items-center">
//         <FiBell
//           className="text-2xl text-orange-500 cursor-pointer"
//           onClick={() => setShow((prev) => !prev)}
//         />
//         {unreadCount > 0 && (
//           <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
//             {unreadCount}
//           </span>
//         )}
//       </div>

//       {show && (
//         <div className="absolute right-4 max-sm:right-[-100px] sm:right-0 mt-2 w-56 sm:w-72 bg-white shadow-lg rounded-lg overflow-hidden z-50 text-sm">
//           {/* Notification Header */}
//           <div className="flex justify-between items-center px-4 py-2 border-b border-gray-200 bg-gray-50">
//             <span className="font-semibold text-gray-700">
//               Notifications ({notifications.length})
//             </span>
//             <button
//               onClick={markAllAsRead}
//               className="text-gray-500 hover:text-gray-700"
//               title="Mark all as read"
//             >
//               <FiCheckCircle />
//             </button>
//           </div>
//           {/* Notification List */}
//           <ul className="max-h-60 overflow-y-auto">
//             {notifications.map((n) => (
//               <li
//                 key={n.id}
//                 className={`flex items-start px-4 py-3 border-b border-gray-200 ${
//                   n.read ? "bg-gray-100" : "bg-white"
//                 }`}
//               >
//                 <div className="flex-shrink-0">
//                   <img
//                     src={n.image}
//                     alt="Notification"
//                     className="w-10 h-10 rounded-full"
//                   />
//                 </div>
//                 <div className="ml-3 flex-1">
//                   <p className="text-gray-800 font-medium">
//                     {n.student} commented on{" "}
//                     <span className="text-orange-500">{n.course}</span>
//                   </p>
//                   <p className="text-gray-600 text-xs mt-1">{n.time}</p>
//                 </div>
//               </li>
//             ))}
//           </ul>
//           {/* Notification Footer */}
//           <div className="px-4 py-2 text-center bg-gray-50">
//             <a
//               href="/tutor-requests"
//               className="text-orange-500 font-medium hover:underline"
//             >
//               View All
//             </a>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BellDropdown;




import { FiBell, FiCheckCircle } from "react-icons/fi";
import { useState, useRef, useEffect } from "react";
import api from "../../components/User-management/api";

const BellDropdown = () => {
  const [show, setShow] = useState(false);
  const dropdownRef = useRef(null);

  // Sample notifications with additional properties
  const [notifications, setNotifications] = useState([]);

  
    useEffect(() => {
      const fetchNotifications = async () => {
        try {
          const res = await api.get("/notifications");
          setNotifications(res.data.notifications);
          console.log(res.data); // assuming backend sends { notifications: [...] }
        } catch (err) {
          console.error("Error fetching notifications:", err);
        }
      };

      fetchNotifications();
    }, []);

    // Calculate the number of unread notifications
    const unreadCount = notifications.filter(n => !n.read).length;

    // Close dropdown if clicked outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setShow(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Mark all notifications as read
    const markAllAsRead = () => {
      const updatedNotifications = notifications.map(notification => ({
        ...notification,
        read: true,
      }));
      setNotifications(updatedNotifications);
    };

    return (
      <div ref={dropdownRef} className="relative inline-block">
        <div className="flex items-center">
          <FiBell
            className="text-2xl text-orange-500 cursor-pointer"
            onClick={() => setShow((prev) => !prev)}
          />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>

        {show && (
          <div className="absolute right-4 max-sm:right-[-100px] sm:right-0 mt-2 w-56 sm:w-72 bg-white shadow-lg rounded-lg overflow-hidden z-50 text-sm">
            {/* Notification Header */}
            <div className="flex justify-between items-center px-4 py-2 border-b border-gray-200 bg-gray-50">
              <span className="font-semibold text-gray-700">
                Notifications ({notifications.length})
              </span>
              <button
                onClick={markAllAsRead}
                className="text-gray-500 hover:text-gray-700"
                title="Mark all as read"
              >
                <FiCheckCircle />
              </button>
            </div>
            {/* Notification List */}
            <ul className="max-h-60 overflow-y-auto">
              {notifications.map((n) => (
                <li
                  key={n.id}
                  className={`flex items-start px-4 py-3 border-b border-gray-200 ${n.read ? "bg-gray-100" : "bg-white"
                    }`}
                >
                  <div className="flex-shrink-0">
                    <img
                      src={n.image}
                      alt="Notification"
                      className="w-10 h-10 rounded-full"
                    />
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-gray-800 font-medium">
                      {n.student} has Purchased your course  {" "}
                      <span className="text-orange-500">{n.course}</span>
                    </p>
                    <p className="text-gray-600 text-xs mt-1">{n.time}</p>
                  </div>
                </li>
              ))}
            </ul>
            {/* Notification Footer */}
            <div className="px-4 py-2 text-center bg-gray-50">
              <a
                href="/tutor-requests"
                className="text-orange-500 font-medium hover:underline"
              >
                View All
              </a>
            </div>
          </div>
        )}
      </div>
    );
  };

  export default BellDropdown;
