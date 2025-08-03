(function () {
  const { useState, useEffect } = React;

  // ✅ Framer Motion fallback
  const { motion, AnimatePresence } = window.FramerMotion || {
    motion: {
      div: (props) => React.createElement('div', props, props.children),
      h1: (props) => React.createElement('h1', props, props.children),
      li: (props) => React.createElement('li', props, props.children),
      button: (props) => React.createElement('button', props, props.children),
    },
    AnimatePresence: ({ children }) => children,
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

    // ✅ Load saved data and theme
    useEffect(() => {
      setOrders(JSON.parse(localStorage.getItem('orders')) || []);
      setDesigns(JSON.parse(localStorage.getItem('designs')) || []);
      setEmployees(JSON.parse(localStorage.getItem('employees')) || []);
      const theme = localStorage.getItem('darkMode') === 'true';
      setDarkMode(theme);
      if (theme) document.documentElement.classList.add('dark');
    }, []);

    // ✅ Save data
    useEffect(() => {
      localStorage.setItem('orders', JSON.stringify(orders));
      localStorage.setItem('designs', JSON.stringify(designs));
      localStorage.setItem('employees', JSON.stringify(employees));
    }, [orders, designs, employees]);

    // ✅ Toggle dark mode
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

    // ===== Role-based actions =====
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
      alert(employee
        ? `Card: ${employee.name}, ${employee.title}, ${employee.email}, ${employee.phone}`
        : 'Invalid share code');
      setReceiveCode('');
    };

    // ===== UI Sections =====
    const renderCompanySection = () => [
      React.createElement('h2', { className: 'text-xl font-medium text-gray-800 dark:text-gray-200 mb-4' }, 'Order a Design'),
      React.createElement('input', {
        placeholder: 'Company Name', value: companyName,
        onChange: (e) => setCompanyName(e.target.value),
        className: 'w-full p-3 mb-3 bg-white/50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-400'
      }),
      React.createElement('textarea', {
        placeholder: 'Brand Details', value: brandDetails,
        onChange: (e) => setBrandDetails(e.target.value),
        className: 'w-full p-3 mb-3 bg-white/50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-400'
      }),
      React.createElement(motion.button, {
        whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 },
        onClick: placeOrder, className: 'w-full gradient-btn text-white p-3 rounded-xl shadow-lg'
      }, 'Place Order'),
      React.createElement('h3', { className: 'text-lg font-medium text-gray-800 dark:text-gray-200 mt-6' }, 'Your Orders'),
      orders.length === 0
        ? React.createElement('p', { className: 'text-gray-500 dark:text-gray-400' }, 'No orders placed.')
        : React.createElement('ul', { className: 'space-y-4 mt-2' },
          orders.map(o => React.createElement(motion.li, {
            key: o.id, className: 'bg-white/30 dark:bg-gray-800/50 p-4 rounded-xl'
          }, `${o.companyName} - ${o.status}`))
        )
    ];

    const renderDesignerSection = () => [
      React.createElement('h2', { className: 'text-xl font-medium text-gray-800 dark:text-gray-200 mb-4' }, 'Design Orders'),
      orders.length === 0
        ? React.createElement('p', { className: 'text-gray-500 dark:text-gray-400' }, 'No orders available.')
        : React.createElement('ul', { className: 'space-y-4' },
          orders.map(o => React.createElement('li', { key: o.id, className: 'bg-white/30 dark:bg-gray-800/50 p-4 rounded-xl' }, [
            `${o.companyName} - ${o.status}`,
            o.status === 'Pending' &&
            React.createElement('div', null, [
              React.createElement('textarea', {
                placeholder: 'Enter design template', value: designTemplate,
                onChange: (e) => setDesignTemplate(e.target.value),
                className: 'w-full p-3 mt-2 bg-white/50 dark:bg-gray-700 border rounded-xl focus:ring-indigo-400'
              }),
              React.createElement(motion.button, {
                onClick: () => submitDesign(o.id),
                className: 'mt-2 w-full gradient-btn text-white p-3 rounded-xl shadow-lg'
              }, 'Submit Design')
            ])
          ]))
        )
    ];

    const renderHrSection = () => [
      React.createElement('h2', { className: 'text-xl font-medium text-gray-800 dark:text-gray-200 mb-4' }, 'Assign Cards'),
      designs.length === 0
        ? React.createElement('p', { className: 'text-gray-500 dark:text-gray-400' }, 'No designs available.')
        : React.createElement('div', null, [
          ['Employee Name', employeeName, setEmployeeName],
          ['Job Title', employeeTitle, setEmployeeTitle],
          ['Email', employeeEmail, setEmployeeEmail],
          ['Phone', employeePhone, setEmployeePhone]
        ].map(([ph, val, setter], i) =>
          React.createElement('input', {
            key: i, placeholder: ph, value: val, onChange: (e) => setter(e.target.value),
            className: 'w-full p-3 mb-3 bg-white/50 dark:bg-gray-700 border rounded-xl focus:ring-blue-400'
          })),
          React.createElement('ul', { className: 'space-y-4 mt-2' },
            designs.map(d =>
              React.createElement('li', { key: d.id, className: 'bg-white/30 dark:bg-gray-800/50 p-4 rounded-xl' }, [
                `Template: ${d.template}`,
                React.createElement(motion.button, {
                  onClick: () => assignCard(d.id),
                  className: 'mt-2 w-full gradient-btn text-white p-3 rounded-xl shadow-lg'
                }, 'Assign to Employee')
              ])
            )
          )
        )
    ];

    const renderEmployeeSection = () => [
      React.createElement('h2', { className: 'text-xl font-medium text-gray-800 dark:text-gray-200 mb-4' }, 'My Business Cards'),
      employees.length === 0
        ? React.createElement('p', { className: 'text-gray-500 dark:text-gray-400' }, 'No cards assigned.')
        : React.createElement('ul', { className: 'space-y-4' },
          employees.map(e =>
            React.createElement('li', { key: e.id, className: 'bg-white/30 dark:bg-gray-800/50 p-4 rounded-xl' }, [
              `${e.name} - ${e.title}`,
              React.createElement(motion.button, {
                onClick: () => shareCard(e),
                className: 'mt-2 w-full gradient-btn text-white p-3 rounded-xl shadow-lg'
              }, 'Share Card')
            ])
          )
        ),
      assignCode &&
      React.createElement('div', { className: 'mt-6' }, [
        React.createElement('h3', { className: 'text-lg font-medium text-gray-800 dark:text-gray-200' }, 'Share This Code'),
        React.createElement('p', { className: 'text-lg font-mono text-gray-900 dark:text-gray-100' }, assignCode)
      ])
    ];

    // ===== Render App =====
    return React.createElement('div', {
      className: 'min-h-screen animated-bg p-6 flex flex-col items-center relative dark:bg-gray-900 transition-colors'
    },
      // Dark mode toggle
      React.createElement('button', {
        onClick: toggleDarkMode,
        className: 'absolute top-4 right-4 px-4 py-2 rounded-xl text-white gradient-btn shadow-md'
      }, darkMode ? '☀ Light' : '🌙 Dark'),
      // Heading
      React.createElement('h1', {
        className: 'text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-300 dark:to-purple-400 mb-8'
      }, 'Business Card Studio'),
      // Role selector
      React.createElement('div', { className: 'w-full max-w-md glass p-6 rounded-2xl mb-8 dark:bg-gray-800/50' }, [
        React.createElement('label', { className: 'block text-lg font-medium text-gray-800 dark:text-gray-200 mb-2' }, 'Select Role'),
        React.createElement('select', {
          value: role, onChange: (e) => setRole(e.target.value),
          className: 'w-full p-3 bg-white/50 dark:bg-gray-700 border rounded-xl focus:ring-blue-400'
        }, [
          React.createElement('option', { value: 'company' }, 'Company'),
          React.createElement('option', { value: 'designer' }, 'Designer'),
          React.createElement('option', { value: 'hr' }, 'HR'),
          React.createElement('option', { value: 'employee' }, 'Employee')
        ])
      ]),
      // Animated content
      React.createElement(AnimatePresence, { mode: 'wait' },
        React.createElement(motion.div, {
          key: role,
          initial: { opacity: 0, x: 50 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: -50 },
          transition: { duration: 0.4 },
          className: 'w-full max-w-md glass p-6 rounded-2xl mb-8 dark:bg-gray-800/50'
        },
          role === 'company' ? renderCompanySection() :
          role === 'designer' ? renderDesignerSection() :
          role === 'hr' ? renderHrSection() : renderEmployeeSection()
        )
      ),
      // Receive card section
      React.createElement('div', { className: 'w-full max-w-md glass p-6 rounded-2xl dark:bg-gray-800/50' }, [
        React.createElement('h2', { className: 'text-xl font-medium text-gray-800 dark:text-gray-200 mb-4' }, 'Receive a Card'),
        React.createElement('input', {
          placeholder: 'Enter share code', value: receiveCode,
          onChange: (e) => setReceiveCode(e.target.value),
          className: 'w-full p-3 mb-3 bg-white/50 dark:bg-gray-700 border rounded-xl focus:ring-purple-400'
        }),
        React.createElement(motion.button, {
          onClick: receiveCard,
          className: 'w-full gradient-btn text-white p-3 rounded-xl shadow-lg'
        }, 'Receive Card')
      ])
    );
  }

  ReactDOM.render(React.createElement(App), document.getElementById('root'));
})();
