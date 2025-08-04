import React from 'react';
import { motion } from 'framer-motion';

const DesignerSection = ({
  orders,
  designTemplate,
  setDesignTemplate,
  submitDesign,
}) => (
  <>
    <h2 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-4">Design Orders</h2>
    {orders.length === 0 ? (
      <p className="text-gray-500 dark:text-gray-400">No orders available.</p>
    ) : (
      <ul className="space-y-4">
        {orders.map(o => (
          <li key={o.id} className="bg-white/30 dark:bg-gray-800/50 p-4 rounded-xl">
            {o.companyName} - {o.status}
            {o.status === 'Pending' && (
              <div>
                <textarea
                  placeholder="Enter design template"
                  value={designTemplate}
                  onChange={(e) => setDesignTemplate(e.target.value)}
                  className="w-full p-3 mt-2 bg-white/50 dark:bg-gray-700 border rounded-xl focus:ring-indigo-400"
                />
                <motion.button
                  onClick={() => submitDesign(o.id)}
                  className="mt-2 w-full gradient-btn text-white p-3 rounded-xl shadow-lg"
                >
                  Submit Design
                </motion.button>
              </div>
            )}
          </li>
        ))}
      </ul>
    )}
  </>
);

export default DesignerSection;
