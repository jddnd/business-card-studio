import React from 'react';
import { motion } from 'framer-motion';

const EmployeeSection = ({ employees, shareCard, assignCode }) => (
  <>
    <h2 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-4">My Business Cards</h2>
    {employees.length === 0 ? (
      <p className="text-gray-500 dark:text-gray-400">No cards assigned.</p>
    ) : (
      <ul className="space-y-4">
        {employees.map(e => (
          <li key={e.id} className="bg-white/30 dark:bg-gray-800/50 p-4 rounded-xl">
            {e.name} - {e.title}
            <motion.button
              onClick={() => shareCard(e)}
              className="mt-2 w-full gradient-btn text-white p-3 rounded-xl shadow-lg"
            >
              Share Card
            </motion.button>
          </li>
        ))}
      </ul>
    )}
    {assignCode && (
      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Share This Code</h3>
        <p className="text-lg font-mono text-gray-900 dark:text-gray-100">{assignCode}</p>
      </div>
    )}
  </>
);

export default EmployeeSection;
