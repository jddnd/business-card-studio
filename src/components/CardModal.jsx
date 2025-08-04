import React from 'react';
import { motion } from 'framer-motion';

const CardModal = ({ card, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    onClick={onClose}
  >
    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center" onClick={(e) => e.stopPropagation()}>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{card.name}</h2>
      <p className="text-lg text-gray-600 dark:text-gray-300 mt-1">{card.title}</p>
      <div className="mt-6 space-y-3 text-left">
        <p className="text-gray-700 dark:text-gray-200">
          <span className="font-medium">Email:</span> {card.email}
        </p>
        <p className="text-gray-700 dark:text-gray-200">
          <span className="font-medium">Phone:</span> {card.phone}
        </p>
        <p className="text-gray-700 dark:text-gray-200">
          <span className="font-medium">Template:</span> {card.template}
        </p>
      </div>
      <button
        onClick={onClose}
        className="mt-8 w-full gradient-btn text-white p-3 rounded-xl shadow-lg"
      >
        Close
      </button>
    </div>
  </motion.div>
);

export default CardModal;
