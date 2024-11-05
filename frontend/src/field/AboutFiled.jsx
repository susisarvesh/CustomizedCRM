import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { formatDate } from "../utils/date";
import { Phone, Mail } from "lucide-react";

export default function AboutField() {
  const { user } = useAuthStore();

    return (
      <>
    <div className="container mx-auto px-4 py-8 ">
                <h1 className="text-2xl font-semibold text-blue-800 mb-6">About</h1>
                </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center"
        >
          <div className="w-32 h-32 rounded-full mb-4 bg-blue-500 flex items-center justify-center text-white text-5xl font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-2xl font-semibold mb-2">{user.name}</h2>
            <p className="text-gray-600 text-lg mb-6">{user.email}</p>
            
            <p className="text-gray-600 text-lg mb-6">{user.companyName}</p>
          <div className="w-full space-y-4">
            <div className="flex items-center">
              <Phone className="w-5 h-5 text-gray-400 mr-2" />
                <p>+91 {user.phone}</p>
            </div>
            <div className="flex items-center">
              <Mail className="w-5 h-5 text-gray-400 mr-2" />
              <p>{user.email}</p>
            </div>
          </div>
        </motion.div>

        {/* Account and Bills Section */}
        <div className="space-y-6">
          {/* My ePay accounts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold mb-4">Information</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                    <p className="font-semibold">{user.position}</p>
                    <p className="text-sm text-gray-600">{user.createdAt}</p>
                </div>
                <button className="bg-green-500 text-white text-sm font-bold py-1 px-3 rounded-full">
                  Active Account
                </button>
              </div>
              
            </div>
          </motion.div>

          {/* My bills */}
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold mb-4">My bills</h3>
            <div className="space-y-4">
              {[
                { name: "Phone bill", status: "Paid" },
                { name: "Internet bill", status: "Unpaid" },
                { name: "Water bill", status: "Paid" },
                { name: "Income tax", status: "Unpaid" },
              ].map((bill, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${bill.status === 'Paid' ? 'bg-green-500' : 'bg-pink-500'}`}></div>
                    <p>{bill.name}</p>
                  </div>
                  <button className={`text-sm font-bold py-1 px-3 rounded-full ${bill.status === 'Paid' ? 'bg-green-500 text-white' : 'bg-pink-500 text-white'}`}>
                    {bill.status === 'Paid' ? 'Paid' : 'Pay now'}
                  </button>
                </div>
              ))}
            </div>
          </motion.div> */}
        </div>
      </div>
           
            </>
  );
}