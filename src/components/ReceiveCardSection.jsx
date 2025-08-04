import React from 'react';
import { motion } from 'framer-motion';

const ReceiveCardSection = ({ receiveCode, setReceiveCode, receiveCard, error }) => (
  <div className="w-full max-w-md glass p-6 rounded-2xl dark:bg-gray-800/50">
    <h2 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-4">Receive a Card</h2>
    <input
      placeholder="Enter share code"
      value={receiveCode}
      onChange={(e) => setReceiveCode(e.target.value)}
      className="w-full p-3 mb-3 bg-white/50 dark:bg-gray-700 border rounded-xl focus:ring-purple-400"
    />
    <motion.button
      onClick={receiveCard}
      className="w-full gradient-btn text-white p-3 rounded-xl shadow-lg"
    >
      Receive Card
    </motion.button>
    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
  </div>
);

export default ReceiveCardSection;
