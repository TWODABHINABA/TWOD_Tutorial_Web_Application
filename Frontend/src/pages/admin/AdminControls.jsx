import { useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";
import AdminSidebarMobile from "./AdminSidebarMobile";

const AdminControls = () => {
    const navigate = useNavigate();
    return (
        <div className="flex min-h-screen bg-gray-100">
            <div className="absolute md:static top-0 left-0 z-50">
                <div className="max-md:hidden">
                    <AdminSidebar />
                </div>
                <div className="md:hidden">
                    <AdminSidebarMobile />
                </div>
            </div>
            <div className="w-full z-0 relative ml-0 md:ml-[225px]">
                <AdminNavbar title="Admin Controls" />
                <div className="p-4 md:p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <button
                            onClick={() => navigate('/add-tutor')}
                            className="bg-orange-500 text-white px-6 py-4 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center text-lg font-medium shadow-md hover:shadow-lg"
                        >
                            Add Tutor
                        </button>

                        <button
                            onClick={() => navigate('/add-session-time')}
                            className="bg-orange-500 text-white px-6 py-4 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center text-lg font-medium shadow-md hover:shadow-lg"
                        >
                            Add Session Time
                        </button>

                        <button
                            onClick={() => navigate("/add-course")}
                            className="bg-orange-500 text-white px-6 py-4 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center text-lg font-medium shadow-md hover:shadow-lg"
                        >
                            Add Course
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminControls;
