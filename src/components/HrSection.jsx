import React from 'react';
import { motion } from 'framer-motion';

const HrSection = ({
  designs,
  employeeName,
  setEmployeeName,
  employeeTitle,
  setEmployeeTitle,
  employeeEmail,
  setEmployeeEmail,
  employeePhone,
  setEmployeePhone,
  assignCard,
}) => (
  <>
    <h2 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-4">Assign Cards</h2>
    {designs.length === 0 ? (
      <p className="text-gray-500 dark:text-gray-400">No designs available.</p>
    ) : (
      <div>
        {[
          ['Employee Name', employeeName, setEmployeeName],
          ['Job Title', employeeTitle, setEmployeeTitle],
          ['Email', employeeEmail, setEmployeeEmail],
          ['Phone', employeePhone, setEmployeePhone]
        ].map(([ph, val, setter], i) => (
          <input
            key={i}
            placeholder={ph}
            value={val}
            onChange={(e) => setter(e.target.value)}
            className="w-full p-3 mb-3 bg-white/50 dark:bg-gray-700 border rounded-xl focus:ring-blue-400"
          />
        ))}
        <ul className="space-y-4 mt-2">
          {designs.map(d => (
            <li key={d.id} className="bg-white/30 dark:bg-gray-800/50 p-4 rounded-xl">
              Template: {d.template}
              <motion.button
                onClick={() => assignCard(d.id)}
                className="mt-2 w-full gradient-btn text-white p-3 rounded-xl shadow-lg"
              >
                Assign to Employee
              </motion.button>
            </li>
          ))}
        </ul>
      </div>
    )}
  </>
);

export default HrSection;
