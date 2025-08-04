import React from 'react';

const RoleSelector = ({ role, setRole }) => (
  <div className="w-full max-w-md glass p-6 rounded-2xl mb-8 dark:bg-gray-800/50">
    <label className="block text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Select Role</label>
    <select
      value={role}
      onChange={(e) => setRole(e.target.value)}
      className="w-full p-3 bg-white/50 dark:bg-gray-700 border rounded-xl focus:ring-blue-400"
    >
      <option value="company">Company</option>
      <option value="designer">Designer</option>
      <option value="hr">HR</option>
      <option value="employee">Employee</option>
    </select>
  </div>
);

export default RoleSelector;
