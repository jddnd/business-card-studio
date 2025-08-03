(function () {
  const { useState, useEffect } = React;

  // ✅ Safe fallback for Framer Motion
  const { motion, AnimatePresence } = window.FramerMotion || {
    motion: {
      div: (props) => React.createElement('div', props, props.children),
      h1: (props) => React.createElement('h1', props, props.children),
      li: (props) => React.createElement('li', props, props.children),
      button: (props) => React.createElement('button', props, props.children),
    },
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

    // ✅ Load data & dark mode preference
    useEffect(() => {
      setOrders(JSON.parse(localStorage.getItem('orders')) || []);
      setDesigns(JSON.parse(localStorage.getItem('designs')) || []);
      setEmployees(JSON.parse(localStorage.getItem('employees')) || []);
      const storedTheme = localStorage.getItem('darkMode');
      if (storedTheme === 'true') {
        setDarkMode(true);
        document.documentElement.classList.add('dark');
      }
    }, []);

    // ✅ Save orders/designs/employees
    useEffect(() => {
      localStorage.setItem('orders', JSON.stringify(orders));
      localStorage.setItem('designs', JSON.stringify(designs));
      localStorage.setItem('employees', JSON.stringify(employees));
    }, [orders, designs, employees]);

    // ✅ Handle dark mode toggle
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

    // Actions
    const placeOrder = () => {
      if (!companyName || !brandDetails) {
        alert('Please fill in all fields');
        return;
      }
      const newOrder = {
        id: Date.now(),
        companyName,
        brandDetails,
        status: 'Pending',
      };
      setOrders([...orders, newOrder]);
      setCompanyName('');
      setBrandDetails('');
    };

    const submitDesign = (orderId) => {
      if (!designTemplate) {
        alert('Please enter a design template');
        return;
      }
      const newDesign = {
        id: Date.now(),
        orderId,
        template: designTemplate,
        shareCode: Math.random().toString(36).substr(2, 8).toUpperCase(),
      };
      setDesigns([...designs, newDesign]);
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'Designed' } : o));
      setDesignTemplate('');
    };

    const assignCard = (designId) => {
      if (!employeeName || !employeeEmail || !employeePhone || !employeeTitle) {
        alert('Please fill in all employee details');
        return;
      }
      const design = designs.find(d => d.id === designId);
      const newEmployee = {
        id: Date.now(),
        name: employeeName,
        email: employeeEmail,
        phone: employeePhone,
        title: employeeTitle,
        template: design.template,
        shareCode: Math.random().toString(36).substr(2, 8).toUpperCase(),
      };
      setEmployees([...employees, newEmployee]);
      setEmployeeName('');
      setEmployeeEmail('');
      setEmployeePhone('');
      setEmployeeTitle('');
    };

    const shareCard = (employee) => setAssignCode(employee.shareCode);

    const receiveCard = () => {
      const employee = employees.find(e => e.shareCode === receiveCode);
      if (employee) {
        alert(`Received card: ${employee.name}, ${employee.title}, ${employee.email}, ${employee.phone}, Template: ${employee.template}`);
      } else {
        alert('Invalid share code');
      }
      setReceiveCode('');
    };

    // Sections
    const renderCompanySection = () => (
      <>
        <h2 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-4">Order a Design</h2>
        <input
          type="text"
          placeholder="Company Name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className="w-full p-3 mb-3 bg-white/50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <textarea
          placeholder="Brand Details (e.g., colors, logo)"
          value={brandDetails}
          onChange={(e) => setBrandDetails(e.target.value)}
          className="w-full p-3 mb-3 bg-white/50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={placeOrder}
          className="w-full gradient-btn text-white p-3 rounded-xl shadow-lg"
        >
          Place Order
        </motion.button>
      </>
    );

    const renderDesignerSection = () => (
      <>
        <h2 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-4">Design Orders</h2>
        {orders.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No orders available.</p>
        ) : (
          <ul className="space-y-4">
            {orders.map(order => (
              <motion.li key={order.id} className="bg-white/30 dark:bg-gray-800/50 p-4 rounded-xl">
                <p><strong>Company:</strong> {order.companyName}</p>
                <p><strong>Status:</strong> {order.status}</p>
                {order.status === 'Pending' && (
                  <>
                    <textarea
                      placeholder="Enter design template"
                      value={designTemplate}
                      onChange={(e) => setDesignTemplate(e.target.value)}
                      className="w-full p-3 mt-2 bg-white/50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                    <motion.button
                      onClick={() => submitDesign(order.id)}
                      className="mt-2 w-full gradient-btn text-white p-3 rounded-xl shadow-lg"
                    >
                      Submit Design
                    </motion.button>
                  </>
                )}
              </motion.li>
            ))}
          </ul>
        )}
      </>
    );

    return (
      React.createElement(
        'div',
        { className: 'min-h-screen animated-bg p-6 flex flex-col items-center dark:bg-gray-900 transition-colors' },

        // ✅ Dark Mode Toggle
        React.createElement('button', {
          onClick: toggleDarkMode,
          className: 'absolute top-4 right-4 px-4 py-2 rounded-xl text-white gradient-btn shadow-md'
        }, darkMode ? '☀ Light' : '🌙 Dark'),

        // ✅ Gradient headline
        React.createElement(motion.h1, {
          className: 'text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-300 dark:to-indigo-400 mb-8'
        }, 'Business Card Studio'),

        // Role Selector
        React.createElement('div', { className: 'w-full max-w-md glass p-6 rounded-2xl mb-8 dark:bg-gray-800/50' },
          React.createElement('label', { className: 'block text-lg font-medium text-gray-800 dark:text-gray-200 mb-2' }, 'Select Role'),
          React.createElement('select', {
            value: role,
            onChange: (e) => setRole(e.target.value),
            className: 'w-full p-3 bg-white/50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-400'
          },
            React.createElement('option', { value: 'company' }, 'Company'),
            React.createElement('option', { value: 'designer' }, 'Designer'),
            React.createElement('option', { value: 'hr' }, 'HR'),
            React.createElement('option', { value: 'employee' }, 'Employee')
          )
        ),

        React.createElement(AnimatePresence, { mode: 'wait' },
          React.createElement(motion.div, { key: role, className: 'w-full max-w-md glass p-6 rounded-2xl mb-8 dark:bg-gray-800/50' },
            role === 'company' ? renderCompanySection() :
            role === 'designer' ? renderDesignerSection() : null
          )
        )
      )
    );
  }

  ReactDOM.render(React.createElement(App), document.getElementById('root'));
})();
