import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RoleSelector from './components/RoleSelector';
import CompanySection from './components/CompanySection';
import DesignerSection from './components/DesignerSection';
import HrSection from './components/HrSection';
import EmployeeSection from './components/EmployeeSection';
import ReceiveCardSection from './components/ReceiveCardSection';
import CardModal from './components/CardModal';

function App() {
  const [role, setRole] = useState('company');
  const [orders, setOrders] = useState([]);
  const [designs, setDesigns] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [companyName, setCompanyName] = useState('');
  const [brandDetails, setBrandDetails] = useState('');
  const [designTemplate, setDesignTemplate] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [employeeEmail, setEmployeeEmail] = useState('');
  const [employeePhone, setEmployeePhone] = useState('');
  const [employeeTitle, setEmployeeTitle] = useState('');
  const [assignCode, setAssignCode] = useState('');
  const [receiveCode, setReceiveCode] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [receivedCard, setReceivedCard] = useState(null);
  const [receiveError, setReceiveError] = useState('');

  useEffect(() => {
    setOrders(JSON.parse(localStorage.getItem('orders')) || []);
    setDesigns(JSON.parse(localStorage.getItem('designs')) || []);
    setEmployees(JSON.parse(localStorage.getItem('employees')) || []);
    const theme = localStorage.getItem('darkMode') === 'true';
    setDarkMode(theme);
    if (theme) document.documentElement.classList.add('dark');
  }, []);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
    localStorage.setItem('designs', JSON.stringify(designs));
    localStorage.setItem('employees', JSON.stringify(employees));
  }, [orders, designs, employees]);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const placeOrder = () => {
    if (!companyName || !brandDetails) return alert('Please fill in all fields');
    setOrders([...orders, { id: Date.now(), companyName, brandDetails, status: 'Pending' }]);
    setCompanyName('');
    setBrandDetails('');
  };

  const submitDesign = (orderId) => {
    if (!designTemplate) return alert('Please enter a design template');
    setDesigns([...designs, {
      id: Date.now(),
      orderId,
      template: designTemplate,
      shareCode: Math.random().toString(36).substr(2, 8).toUpperCase(),
    }]);
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'Designed' } : o));
    setDesignTemplate('');
  };

  const assignCard = (designId) => {
    if (!employeeName || !employeeEmail || !employeePhone || !employeeTitle)
      return alert('Please fill in all employee details');
    const design = designs.find(d => d.id === designId);
    setEmployees([...employees, {
      id: Date.now(),
      name: employeeName,
      email: employeeEmail,
      phone: employeePhone,
      title: employeeTitle,
      template: design.template,
      shareCode: Math.random().toString(36).substr(2, 8).toUpperCase(),
    }]);
    setEmployeeName('');
    setEmployeeEmail('');
    setEmployeePhone('');
    setEmployeeTitle('');
  };

  const shareCard = (employee) => setAssignCode(employee.shareCode);

  const receiveCard = () => {
    const employee = employees.find(e => e.shareCode === receiveCode);
    if (employee) {
      setReceivedCard(employee);
      setReceiveError('');
    } else {
      setReceiveError('Invalid share code');
    }
    setReceiveCode('');
  };

  return (
    <div className="min-h-screen animated-bg p-6 flex flex-col items-center relative dark:bg-gray-900 transition-colors">
      <button
        onClick={toggleDarkMode}
        className="absolute top-4 right-4 px-4 py-2 rounded-xl text-white gradient-btn shadow-md"
      >
        {darkMode ? '☀ Light' : '🌙 Dark'}
      </button>
      <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-300 dark:to-purple-400 mb-8">
        Business Card Studio
      </h1>
      <RoleSelector role={role} setRole={setRole} />
      <AnimatePresence mode="wait">
        <motion.div
          key={role}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md glass p-6 rounded-2xl mb-8 dark:bg-gray-800/50"
        >
          {role === 'company' && (
            <CompanySection
              companyName={companyName}
              setCompanyName={setCompanyName}
              brandDetails={brandDetails}
              setBrandDetails={setBrandDetails}
              placeOrder={placeOrder}
              orders={orders}
            />
          )}
          {role === 'designer' && (
            <DesignerSection
              orders={orders}
              designTemplate={designTemplate}
              setDesignTemplate={setDesignTemplate}
              submitDesign={submitDesign}
            />
          )}
          {role === 'hr' && (
            <HrSection
              designs={designs}
              employeeName={employeeName}
              setEmployeeName={setEmployeeName}
              employeeTitle={employeeTitle}
              setEmployeeTitle={setEmployeeTitle}
              employeeEmail={employeeEmail}
              setEmployeeEmail={setEmployeeEmail}
              employeePhone={employeePhone}
              setEmployeePhone={setEmployeePhone}
              assignCard={assignCard}
            />
          )}
          {role === 'employee' && (
            <EmployeeSection
              employees={employees}
              shareCard={shareCard}
              assignCode={assignCode}
            />
          )}
        </motion.div>
      </AnimatePresence>
      <ReceiveCardSection
        receiveCode={receiveCode}
        setReceiveCode={setReceiveCode}
        receiveCard={receiveCard}
        error={receiveError}
      />
      <AnimatePresence>
        {receivedCard && (
          <CardModal card={receivedCard} onClose={() => setReceivedCard(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
