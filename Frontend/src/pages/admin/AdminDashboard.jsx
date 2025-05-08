import { useEffect, useState } from 'react';
import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";
import api from "../../components/User-management/api";
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useCurrencyConverter } from '../../currencyConfig/useCurrencyConverter';

ChartJS.register(ArcElement, Tooltip, Legend);

// Function to generate HSL colors with good contrast
const generateHSLColors = (count) => {
    const colors = [];
    const saturation = 100; 
    const lightness = 40; 
    
    for (let i = 0; i < count; i++) {
        const hue = (i * 360 / count) % 360;
        colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
    }
    
    return colors;
};

const AdminDashboard = () => {
    const [tutors, setTutors] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedTutor, setSelectedTutor] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [showBookingsModal, setShowBookingsModal] = useState(false);
    const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' or 'past'
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [emailData, setEmailData] = useState({
        subject: '',
        message: ''
    });
    const [showAllTutors, setShowAllTutors] = useState(false);
    const [showAllUsers, setShowAllUsers] = useState(false);
    const [courseRevenue, setCourseRevenue] = useState([]);
    const [tutorRevenue, setTutorRevenue] = useState([]);
    const [user, setUser] = useState(null);
    const { convertAndFormat } = useCurrencyConverter();

    useEffect(() => {
        const fetchUser = async () => {
          try {
            const res = await api.get("/me");
    
            setUser(res.data);
          } catch (err) {
            console.error("Error fetching user:", err);
          }
        };
        fetchUser();
      }, []);

      useEffect(() => {
        const fetchData = async () => {
            try {
                const [tutorsRes, usersRes, courseRevenueRes, tutorRevenueRes] = await Promise.all([
                    api.get("/tutors"),
                    api.get("/users"),
                    api.get("/statistics/course-revenue"),
                    api.get("/statistics/tutor-revenue")
                ]);
                setTutors(tutorsRes.data);
                setUsers(usersRes.data);
                setCourseRevenue(courseRevenueRes.data.data);
                setTutorRevenue(tutorRevenueRes.data.data);
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };
    
        const fetchRevenue = async () => {
            try {
                const [courseRevenueRes, tutorRevenueRes] = await Promise.all([
                    api.get("/statistics/course-revenue"),
                    api.get("/statistics/tutor-revenue")
                ]);
                setCourseRevenue(courseRevenueRes.data.data);
                setTutorRevenue(tutorRevenueRes.data.data);
            } catch (err) {
                console.error("Error updating revenue:", err);
            }
        };
    
        fetchData(); // Initial load
    
        const interval = setInterval(fetchRevenue, 10000); // Poll every 10 seconds
    
        return () => clearInterval(interval); // Cleanup on unmount
    }, []);
    

    const handleTutorClick = async (tutor) => {
        setSelectedTutor(tutor);
        setShowBookingsModal(true);
        try {
            const res = await api.get(`bookings/${tutor._id}`);
            setBookings(res.data.data);
        } catch (err) {
            console.error("Error fetching bookings:", err);
        }
    };

    // Filter bookings based on current date
    const getFilteredBookings = () => {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        return bookings.filter(booking => {
            const bookingDate = new Date(booking.selectedDate);
            bookingDate.setHours(0, 0, 0, 0);

            if (activeTab === 'upcoming') {
                return bookingDate >= currentDate;
            } else {
                return bookingDate < currentDate;
            }
        });
    };

    const filteredBookings = getFilteredBookings();

    const handleUserClick = async (user) => {
        setSelectedUser(user);
        setShowBookingsModal(true);
        try {
            const res = await api.get(`bookings/user/${user._id}`);
            setBookings(res.data.data);
        } catch (err) {
            console.error("Error fetching user bookings:", err);
        }
    };

    const handleSendEmail = async (tutor) => {
        setSelectedTutor(tutor);
        setShowEmailModal(true);
    };

    const handleSendEmailToUser = async (user) => {
        setSelectedUser(user);
        setShowEmailModal(true);
    };

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        try {
            const endpoint = selectedTutor
                ? `/tutors/${selectedTutor._id}/send-email`
                : `/users/${selectedUser._id}/send-email`;
            await api.post(endpoint, emailData);
            alert('Email sent successfully!');
            setShowEmailModal(false);
            setEmailData({ subject: '', message: '' });
            setSelectedTutor(null);
            setSelectedUser(null);
        } catch (err) {
            console.error("Error sending email:", err);
            alert('Failed to send email');
        }
    };

    const handleDeleteTutor = async (tutor) => {
        if (window.confirm(`Are you sure you want to delete ${tutor.name}?`)) {
            try {
                await api.delete(`/tutors/${tutor._id}`);
                setTutors(tutors.filter(t => t._id !== tutor._id));
                alert('Tutor deleted successfully');
            } catch (err) {
                console.error("Error deleting tutor:", err);
                alert('Failed to delete tutor');
            }
        }
    };

    const handleDeleteUser = async (user) => {
        if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
            try {
                await api.delete(`/users/${user._id}`);
                setUsers(users.filter(t => t._id !== user._id));
                alert('user deleted successfully');
            } catch (err) {
                console.error("Error deleting user:", err);
                alert('Failed to delete user');
            }
        }
    };

    const displayedTutors = showAllTutors ? tutors : tutors.slice(0, 5);
    const displayedUsers = showAllUsers ? users : users.slice(0, 5);

    const coursePieChartData = {
        labels: courseRevenue.map(course => `${course.courseName} (${course.courseType})`),
        datasets: [
            {
                data: courseRevenue.map(course => course.revenue),
                backgroundColor: generateHSLColors(courseRevenue.length),
                borderColor: '#fff',
                borderWidth: 2,
                hoverOffset: 4
            }
        ]
    };

    const tutorPieChartData = {
        labels: tutorRevenue.map(tutor => tutor.tutorName),
        datasets: [
            {
                data: tutorRevenue.map(tutor => tutor.revenue),
                backgroundColor: generateHSLColors(tutorRevenue.length),
                borderColor: '#fff',
                borderWidth: 2,
                hoverOffset: 4
            }
        ]
    };

    const pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    padding: 20,
                    font: {
                        size: 12
                    },
                    usePointStyle: true,
                    pointStyle: 'circle'
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const value = context.raw;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(2);
                        return `${context.label}: ${convertAndFormat(value)} (${percentage}%)`;
                    }
                }
            }
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100 z-50">
            <div className="max-md:hidden fixed top-0 left-0 h-full w-60 z-50">
                <AdminSidebar />
            </div>
            <div className="w-full z-0 relative md:ml-60">
                <AdminNavbar user = {user} />
                <div className="p-4">
                    {/* Tutors Section */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">Tutors</h2>
                            {tutors.length > 5 && (
                                <button
                                    className="text-blue-500 hover:text-blue-700"
                                    onClick={() => setShowAllTutors(!showAllTutors)}
                                >
                                    {showAllTutors ? 'Show Less' : 'View All'}
                                </button>
                            )}
                        </div>
                        <div className="bg-white rounded shadow p-4">
                            <table className="min-w-full">
                                <thead>
                                    <tr>
                                        <th className="py-2 px-4 border-b text-left">Name</th>
                                        <th className="py-2 px-4 border-b text-left">Email</th>
                                        <th className="py-2 px-4 border-b text-left">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayedTutors.map((tutor) => (
                                        <tr key={tutor._id}>
                                            <td className="py-2 px-4 border-b">{tutor.name}</td>
                                            <td className="py-2 px-4 border-b">{tutor.email}</td>
                                            <td className="py-2 px-4 border-b">
                                                <div className="flex space-x-2">
                                                    <button
                                                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                                        onClick={() => handleTutorClick(tutor)}
                                                    >
                                                        View Bookings
                                                    </button>
                                                    <button
                                                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                                        onClick={() => handleSendEmail(tutor)}
                                                    >
                                                        Send Mail
                                                    </button>
                                                    <button
                                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                                        onClick={() => handleDeleteTutor(tutor)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Users Section */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">Users</h2>
                            {users.length > 5 && (
                                <button
                                    className="text-blue-500 hover:text-blue-700"
                                    onClick={() => setShowAllUsers(!showAllUsers)}
                                >
                                    {showAllUsers ? 'Show Less' : 'View All'}
                                </button>
                            )}
                        </div>
                        <div className="bg-white rounded shadow p-4">
                            <table className="min-w-full">
                                <thead>
                                    <tr>
                                        <th className="py-2 px-4 border-b text-left">Name</th>
                                        <th className="py-2 px-4 border-b text-left">Email</th>
                                        <th className="py-2 px-4 border-b text-left">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayedUsers.map((user) => (
                                        <tr key={user._id}>
                                            <td className="py-2 px-4 border-b">{user.name}</td>
                                            <td className="py-2 px-4 border-b">{user.email}</td>
                                            <td className="py-2 px-4 border-b">
                                                <div className="flex space-x-2">
                                                    <button
                                                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                                        onClick={() => handleUserClick(user)}
                                                    >
                                                        View Bookings
                                                    </button>
                                                    <button
                                                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                                        onClick={() => handleSendEmailToUser(user)}
                                                    >
                                                        Send Mail
                                                    </button>
                                                    <button
                                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                                        onClick={() => handleDeleteUser(user)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Course Revenue Statistics */}
                    <div className="mt-8">
                        <h2 className="text-2xl font-bold mb-4">Course Revenue Statistics</h2>
                        <div className="bg-white rounded shadow p-4">
                            <div className="flex flex-col md:flex-row">
                                <div className="w-full md:w-2/3 h-[400px]">
                                    {courseRevenue.length > 0 ? (
                                        <Pie 
                                            data={coursePieChartData} 
                                            options={pieChartOptions}
                                            className="w-full h-full"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full">
                                            <p className="text-gray-500">No course revenue data available</p>
                                        </div>
                                    )}
                                </div>
                                <div className="w-full md:w-1/3 mt-4 md:mt-0 md:pl-4">
                                    <h3 className="text-lg font-semibold mb-2">Revenue Details</h3>
                                    <div className="space-y-2">
                                        {courseRevenue.map((course, index) => (
                                            <div key={course.courseId} className="flex justify-between items-center">
                                                <div className="flex items-center">
                                                    <div 
                                                        className="w-3 h-3 rounded-full mr-2"
                                                        style={{ backgroundColor: coursePieChartData.datasets[0].backgroundColor[index] }}
                                                    />
                                                    <span className="text-sm">{course.courseName}</span>
                                                    <span className="text-sm">&nbsp;&nbsp;{course.courseType}</span>
                                                </div>
                                                <span className="text-sm font-medium">{convertAndFormat(course.revenue)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tutor Revenue Statistics */}
                    <div className="mt-8">
                        <h2 className="text-2xl font-bold mb-4">Tutor Revenue Statistics</h2>
                        <div className="bg-white rounded shadow p-4">
                            <div className="flex flex-col md:flex-row">
                                <div className="w-full md:w-2/3 h-[400px]">
                                    {tutorRevenue.length > 0 ? (
                                        <Pie 
                                            data={tutorPieChartData} 
                                            options={pieChartOptions}
                                            className="w-full h-full"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full">
                                            <p className="text-gray-500">No tutor revenue data available</p>
                                        </div>
                                    )}
                                </div>
                                <div className="w-full md:w-1/3 mt-4 md:mt-0 md:pl-4">
                                    <h3 className="text-lg font-semibold mb-2">Revenue Details</h3>
                                    <div className="space-y-2">
                                        {tutorRevenue.map((tutor, index) => (
                                            <div key={tutor.tutorId} className="flex justify-between items-center">
                                                <div className="flex items-center">
                                                    <div 
                                                        className="w-3 h-3 rounded-full mr-2"
                                                        style={{ backgroundColor: tutorPieChartData.datasets[0].backgroundColor[index] }}
                                                    />
                                                    <span className="text-sm">{tutor.tutorName}</span>
                                                </div>
                                                <span className="text-sm font-medium">{convertAndFormat(tutor.revenue)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Email Modal */}
                    {showEmailModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center px-4">
                            <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6">
                                <button
                                    onClick={() => {
                                        setShowEmailModal(false);
                                        setSelectedTutor(null);
                                        setSelectedUser(null);
                                    }}
                                    className="absolute top-3 right-4 text-gray-600 hover:text-black text-xl"
                                    title="Close"
                                >
                                    &times;
                                </button>
                                <h3 className="text-xl font-bold mb-4">
                                    Send Email to {selectedTutor?.name || selectedUser?.name}
                                </h3>
                                <form onSubmit={handleEmailSubmit}>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                            Subject
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-3 py-2 border rounded"
                                            value={emailData.subject}
                                            onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                            Message
                                        </label>
                                        <textarea
                                            className="w-full px-3 py-2 border rounded"
                                            rows="4"
                                            value={emailData.message}
                                            onChange={(e) => setEmailData({ ...emailData, message: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="flex justify-end">
                                        <button
                                            type="button"
                                            className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600"
                                            onClick={() => {
                                                setShowEmailModal(false);
                                                setSelectedTutor(null);
                                                setSelectedUser(null);
                                            }}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                        >
                                            Send Email
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Bookings Modal */}
                    {showBookingsModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center px-4">
                            <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg p-6 max-h-[80vh] overflow-y-auto relative">
                                <button
                                    onClick={() => {
                                        setShowBookingsModal(false);
                                        setSelectedTutor(null);
                                        setSelectedUser(null);
                                    }}
                                    className="absolute top-3 right-4 text-gray-600 hover:text-black text-xl"
                                    title="Close"
                                >
                                    &times;
                                </button>
                                <h3 className="text-2xl font-bold mb-4 text-center">
                                    Bookings for {selectedTutor?.name || selectedUser?.name}
                                </h3>

                                {/* Tabs */}
                                <div className="flex border-b mb-4">
                                    <button
                                        className={`py-2 px-4 font-medium ${activeTab === 'upcoming'
                                                ? 'border-b-2 border-blue-500 text-blue-600'
                                                : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                        onClick={() => setActiveTab('upcoming')}
                                    >
                                        Upcoming Classes
                                    </button>
                                    <button
                                        className={`py-2 px-4 font-medium ${activeTab === 'past'
                                                ? 'border-b-2 border-blue-500 text-blue-600'
                                                : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                        onClick={() => setActiveTab('past')}
                                    >
                                        Past Bookings
                                    </button>
                                </div>

                                {/* Scrollable table wrapper */}
                                <div className="overflow-x-auto">
                                    <table className="min-w-full whitespace-nowrap">
                                        <thead>
                                            <tr>
                                                <th className="py-2 px-4 border-b text-left">Student</th>
                                                <th className="py-2 px-4 border-b text-left">Course</th>
                                                <th className="py-2 px-4 border-b text-left">Date</th>
                                                <th className="py-2 px-4 border-b text-left">Time</th>
                                                <th className="py-2 px-4 border-b text-left">Type</th>
                                                <th className="py-2 px-4 border-b text-left">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredBookings.length === 0 ? (
                                                <tr>
                                                    <td colSpan="6" className="py-4 text-center text-gray-500">
                                                        No {activeTab === 'upcoming' ? 'upcoming' : 'past'} bookings found
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredBookings.map((booking) => (
                                                    <tr key={booking._id}>
                                                        <td className="py-2 px-4 border-b">
                                                            <div>
                                                                <div className="font-medium">{booking.studentName}</div>
                                                                <div className="text-sm text-gray-500">{booking.studentEmail}</div>
                                                            </div>
                                                        </td>
                                                        <td className="py-2 px-4 border-b">
                                                            <div>
                                                                <div className="font-medium">{booking.courseName}</div>
                                                                <div className="text-sm text-gray-500">{booking.courseType}</div>
                                                            </div>
                                                        </td>
                                                        <td className="py-2 px-4 border-b">{booking.selectedDate}</td>
                                                        <td className="py-2 px-4 border-b">{booking.selectedTime}</td>
                                                        <td className="py-2 px-4 border-b">
                                                            <span className={`px-2 py-1 rounded-full text-xs ${booking.type === 'payLater'
                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                : 'bg-green-100 text-green-800'
                                                                }`}>
                                                                {booking.type === 'payLater' ? 'Pay Later' : 'Paid'}
                                                            </span>
                                                        </td>
                                                        <td className="py-2 px-4 border-b">
                                                            <span className={`px-2 py-1 rounded-full text-xs ${booking.status === 'completed'
                                                                ? 'bg-green-100 text-green-800'
                                                                : booking.status === 'pending'
                                                                    ? 'bg-yellow-100 text-yellow-800'
                                                                    : 'bg-red-100 text-red-800'
                                                                }`}>
                                                                {booking.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
