import React from 'react';
import { motion } from 'framer-motion';

const CompanySection = ({
  companyName,
  setCompanyName,
  brandDetails,
  setBrandDetails,
  placeOrder,
  orders,
}) => (
  <>
    <h2 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-4">Order a Design</h2>
    <input
      placeholder="Company Name"
      value={companyName}
      onChange={(e) => setCompanyName(e.target.value)}
      className="w-full p-3 mb-3 bg-white/50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-400"
    />
    <textarea
      placeholder="Brand Details"
      value={brandDetails}
      onChange={(e) => setBrandDetails(e.target.value)}
      className="w-full p-3 mb-3 bg-white/50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-400"
    />
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={placeOrder}
      className="w-full gradient-btn text-white p-3 rounded-xl shadow-lg"
    >
      Place Order
    </motion.button>
    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mt-6">Your Orders</h3>
    {orders.length === 0 ? (
      <p className="text-gray-500 dark:text-gray-400">No orders placed.</p>
    ) : (
      <ul className="space-y-4 mt-2">
        {orders.map(o => (
          <motion.li
            key={o.id}
            className="bg-white/30 dark:bg-gray-800/50 p-4 rounded-xl"
          >
            {o.companyName} - {o.status}
          </motion.li>
        ))}
      </ul>
    )}
  </>
);

export default CompanySection;
