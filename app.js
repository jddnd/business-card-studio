(function () {
  const { useState, useEffect } = React;
  const { motion, AnimatePresence } = window.FramerMotion || {
    motion: { div: 'div', h1: 'h1', li: 'li', button: 'button' },
    AnimatePresence: ({ children }) => children
  };

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

    // Load data & dark mode
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
      document.documentElement.classList.toggle('dark', newMode);
    };

    // Role-based actions
    const placeOrder = () => {
      if (!companyName || !brandDetails) return alert('Please fill in all fields');
      setOrders([...orders, { id: Date.now(), companyName, brandDetails, status: 'Pending' }]);
      setCompanyName(''); setBrandDetails('');
    };

    const submitDesign = (orderId) => {
      if (!designTemplate) return alert('Please enter a design template');
      setDesigns([...designs, {
        id: Date.now(), orderId, template: designTemplate,
        shareCode: Math.random().toString(36).substr(2, 8).toUpperCase()
      }]);
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'Designed' } : o));
      setDesignTemplate('');
    };

    const assignCard = (designId) => {
      if (!employeeName || !employeeEmail || !employeePhone || !employeeTitle)
        return alert('Please fill in all employee details');
      const design = designs.find(d => d.id === designId);
      setEmployees([...employees, {
        id: Date.now(), name: employeeName, email: employeeEmail,
        phone: employeePhone, title: employeeTitle, template: design.template,
        shareCode: Math.random().toString(36).substr(2, 8).toUpperCase()
      }]);
      setEmployeeName(''); setEmployeeEmail(''); setEmployeePhone(''); setEmployeeTitle('');
    };

    const shareCard = (employee) => setAssignCode(employee.shareCode);
    const receiveCard = () => {
      const employee = employees.find(e => e.shareCode === receiveCode);
      alert(employee
        ? `Card: ${employee.name}, ${employee.title}, ${employee.email}, ${employee.phone}`
        : 'Invalid share code');
      setReceiveCode('');
    };

    // Render UI sections
    const inputClass = 'w-full p-3 mb-3 bg-white/50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-400';
    const buttonClass = 'w-full gradient-btn text-white p-3 rounded-xl shadow-lg';

    const renderCompanySection = () => [
      React.createElement('h2', { className: 'text-xl font-medium text-gray-800 dark:text-gray-200 mb-4' }, 'Order a Design'),
      React.createElement('input', { placeholder: 'Company Name', value: companyName, onChange: e => setCompanyName(e.target.value), className: inputClass }),
      React.createElement('textarea', { placeholder: 'Brand Details', value: brandDetails, onChange: e => setBrandDetails(e.target.value), className: inputClass }),
      React.createElement('button', { onClick: placeOrder, className: buttonClass }, 'Place Order')
    ];

    const renderDesignerSection = () => [
      React.createElement('h2', { className: 'text-xl font-medium text-gray-800 dark:text-gray-200 mb-4' }, 'Design Orders'),
      orders.length === 0 ? React.createElement('p', { className: 'text-gray-500 dark:text-gray-400' }, 'No orders available.')
        : React.createElement('ul', { className: 'space-y-4' }, orders.map(o =>
          React.createElement('li', { key: o.id, className: 'bg-white/30 dark:bg-gray-800/50 p-4 rounded-xl' }, [
            `${o.companyName} - ${o.status}`,
            o.status === 'Pending' && React.createElement('div', null, [
              React.createElement('textarea', { placeholder: 'Enter design template', value: designTemplate, onChange: e => setDesignTemplate(e.target.value), className: inputClass }),
              React.createElement('button', { onClick: () => submitDesign(o.id), className: buttonClass }, 'Submit Design')
            ])
          ])
        ))
    ];

    const renderHrSection = () => [
      React.createElement('h2', { className: 'text-xl font-medium text-gray-800 dark:text-gray-200 mb-4' }, 'Assign Cards'),
      designs.length === 0 ? React.createElement('p', { className: 'text-gray-500 dark:text-gray-400' }, 'No designs available.')
        : React.createElement('div', null, [
          ['Employee Name', employeeName, setEmployeeName],
          ['Job Title', employeeTitle, setEmployeeTitle],
          ['Email', employeeEmail, setEmployeeEmail],
          ['Phone', employeePhone, setEmployeePhone]
        ].map(([ph, val, setter], i) =>
          React.createElement('input', { key: i, placeholder: ph, value: val, onChange: e => setter(e.target.value), className: inputClass })
        ),
          React.createElement('ul', { className: 'space-y-4 mt-2' }, designs.map(d =>
            React.createElement('li', { key: d.id, className: 'bg-white/30 dark:bg-gray-800/50 p-4 rounded-xl' }, [
              `Template: ${d.template}`,
              React.createElement('button', { onClick: () => assignCard(d.id), className: buttonClass }, 'Assign to Employee')
            ])
          ))
        )
    ];

    const renderEmployeeSection = () => [
      React.createElement('h2', { className: 'text-xl font-medium text-gray-800 dark:text-gray-200 mb-4' }, 'My Business Cards'),
      employees.length === 0 ? React.createElement('p', { className: 'text-gray-500 dark:text-gray-400' }, 'No cards assigned.')
        : React.createElement('ul', { className: 'space-y-4' }, employees.map(e =>
          React.createElement('li', { key: e.id, className: 'bg-white/30 dark:bg-gray-800/50 p-4 rounded-xl' }, [
            `${e.name} - ${e.title}`,
            React.createElement('button', { onClick: () => shareCard(e), className: buttonClass }, 'Share Card')
          ])
        )),
      assignCode && React.createElement('div', { className: 'mt-6' }, [
        React.createElement('h3', { className: 'text-lg font-medium text-gray-800 dark:text-gray-200' }, 'Share This Code'),
        React.createElement('p', { className: 'text-lg font-mono text-gray-900 dark:text-gray-100' }, assignCode)
      ])
    ];

    // Render main
    return React.createElement('div', { className: 'min-h-screen animated-bg p-6 flex flex-col items-center relative dark:bg-gray-900' }, [
      React.createElement('button', { onClick: toggleDarkMode, className: 'absolute top-4 right-4 px-4 py-2 rounded-xl text-white gradient-btn shadow-md' }, darkMode ? '☀ Light' : '🌙 Dark'),
      React.createElement('h1', { className: 'text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 mb-8' }, 'Business Card Studio'),
      React.createElement('div', { className: 'w-full max-w-md glass p-6 rounded-2xl mb-8' }, [
        React.createElement('label', { className: 'block text-lg font-medium text-gray-800 dark:text-gray-200 mb-2' }, 'Select Role'),
        React.createElement('select', { value: role, onChange: e => setRole(e.target.value), className: inputClass }, [
          React.createElement('option', { value: 'company' }, 'Company'),
          React.createElement('option', { value: 'designer' }, 'Designer'),
          React.createElement('option', { value: 'hr' }, 'HR'),
          React.createElement('option', { value: 'employee' }, 'Employee')
        ])
      ]),
      React.createElement(AnimatePresence, { mode: 'wait' },
        React.createElement(motion.div, { key: role, className: 'w-full max-w-md glass p-6 rounded-2xl mb-8' },
          role === 'company' ? renderCompanySection() :
          role === 'designer' ? renderDesignerSection() :
          role === 'hr' ? renderHrSection() : renderEmployeeSection()
        )
      ),
      React.createElement('div', { className: 'w-full max-w-md glass p-6 rounded-2xl' }, [
        React.createElement('h2', { className: 'text-xl font-medium text-gray-800 dark:text-gray-200 mb-4' }, 'Receive a Card'),
        React.createElement('input', { placeholder: 'Enter share code', value: receiveCode, onChange: e => setReceiveCode(e.target.value), className: inputClass }),
        React.createElement('button', { onClick: receiveCard, className: buttonClass }, 'Receive Card')
      ])
    ]);
  }

  ReactDOM.render(React.createElement(App), document.getElementById('root'));
})();
