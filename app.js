(function () {
  const { useState, useEffect } = React;

  // ✅ Safe Framer Motion fallback
  const { motion, AnimatePresence } = window.FramerMotion || {
    motion: {
      div: function (props) { return React.createElement('div', props, props.children); },
      h1: function (props) { return React.createElement('h1', props, props.children); },
      li: function (props) { return React.createElement('li', props, props.children); },
      button: function (props) { return React.createElement('button', props, props.children); }
    },
    AnimatePresence: function ({ children }) { return children; }
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

    // ✅ Load data and dark mode preference
    useEffect(function () {
      setOrders(JSON.parse(localStorage.getItem('orders')) || []);
      setDesigns(JSON.parse(localStorage.getItem('designs')) || []);
      setEmployees(JSON.parse(localStorage.getItem('employees')) || []);
      const storedTheme = localStorage.getItem('darkMode');
      if (storedTheme === 'true') {
        setDarkMode(true);
        document.documentElement.classList.add('dark');
      }
    }, []);

    // ✅ Save data and dark mode
    useEffect(function () {
      localStorage.setItem('orders', JSON.stringify(orders));
      localStorage.setItem('designs', JSON.stringify(designs));
      localStorage.setItem('employees', JSON.stringify(employees));
      localStorage.setItem('darkMode', darkMode);
    }, [orders, designs, employees, darkMode]);

    // ✅ Toggle dark mode
    const toggleDarkMode = function () {
      const newMode = !darkMode;
      setDarkMode(newMode);
      if (newMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    // Actions
    const placeOrder = function () {
      if (!companyName || !brandDetails) {
        alert('Please fill in all fields');
        return;
      }
      const newOrder = {
        id: Date.now(),
        companyName: companyName,
        brandDetails: brandDetails,
        status: 'Pending',
      };
      setOrders(orders.concat([newOrder]));
      setCompanyName('');
      setBrandDetails('');
    };

    const submitDesign = function (orderId) {
      if (!designTemplate) {
        alert('Please enter a design template');
        return;
      }
      const newDesign = {
        id: Date.now(),
        orderId: orderId,
        template: designTemplate,
        shareCode: Math.random().toString(36).substr(2, 8).toUpperCase(),
      };
      setDesigns(designs.concat([newDesign]));
      setOrders(orders.map(function (o) { return o.id === orderId ? Object.assign({}, o, { status: 'Designed' }) : o; }));
      setDesignTemplate('');
    };

    const assignCard = function (designId) {
      if (!employeeName || !employeeEmail || !employeePhone || !employeeTitle) {
        alert('Please fill in all employee details');
        return;
      }
      const design = designs.find(function (d) { return d.id === designId; });
      const newEmployee = {
        id: Date.now(),
        name: employeeName,
        email: employeeEmail,
        phone: employeePhone,
        title: employeeTitle,
        template: design.template,
        shareCode: Math.random().toString(36).substr(2, 8).toUpperCase(),
      };
      setEmployees(employees.concat([newEmployee]));
      setEmployeeName('');
      setEmployeeEmail('');
      setEmployeePhone('');
      setEmployeeTitle('');
    };

    const shareCard = function (employee) {
      setAssignCode(employee.shareCode);
    };

    const receiveCard = function () {
      const employee = employees.find(function (e) { return e.shareCode === receiveCode; });
      if (employee) {
        alert("Received card: ".concat(employee.name, ", ").concat(employee.title, ", ").concat(employee.email, ", ").concat(employee.phone, ", Template: ").concat(employee.template));
      } else {
        alert('Invalid share code');
      }
      setReceiveCode('');
    };

    // Sections
    const renderCompanySection = function () {
      return React.createElement(
        'div',
        null,
        React.createElement('h2', { className: 'text-xl font-medium text-gray-800 dark:text-gray-200 mb-4' }, 'Order a Design'),
        React.createElement('input', {
          type: 'text',
          placeholder: 'Company Name',
          value: companyName,
          onChange: function (e) { return setCompanyName(e.target.value); },
          className: 'w-full p-3 mb-3 bg-white/50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400'
        }),
        React.createElement('textarea', {
          placeholder: 'Brand Details (e.g., colors, logo)',
          value: brandDetails,
          onChange: function (e) { return setBrandDetails(e.target.value); },
          className: 'w-full p-3 mb-3 bg-white/50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400'
        }),
        React.createElement(
          motion.button,
          {
            whileHover: { scale: 1.05 },
            whileTap: { scale: 0.95 },
            onClick: placeOrder,
            className: 'w-full gradient-btn text-white p-3 rounded-xl shadow-lg'
          },
          'Place Order'
        )
      );
    };

    const renderDesignerSection = function () {
      return React.createElement(
        'div',
        null,
        React.createElement('h2', { className: 'text-xl font-medium text-gray-800 dark:text-gray-200 mb-4' }, 'Design Orders'),
        orders.length === 0 ? React.createElement('p', { className: 'text-gray-500 dark:text-gray-400' }, 'No orders available.') :
        React.createElement(
          'ul',
          { className: 'space-y-4' },
          orders.map(function (order) {
            return React.createElement(
              motion.li,
              { key: order.id, className: 'bg-white/30 dark:bg-gray-800/50 p-4 rounded-xl' },
              React.createElement('p', null, React.createElement('strong', null, 'Company:'), ' ', order.companyName),
              React.createElement('p', null, React.createElement('strong', null, 'Status:'), ' ', order.status),
              order.status === 'Pending' && React.createElement(
                'div',
                null,
                React.createElement('textarea', {
                  placeholder: 'Enter design template',
                  value: designTemplate,
                  onChange: function (e) { return setDesignTemplate(e.target.value); },
                  className: 'w-full p-3 mt-2 bg-white/50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400'
                }),
                React.createElement(
                  motion.button,
                  {
                    whileHover: { scale: 1.05 },
                    whileTap: { scale: 0.95 },
                    onClick: function () { return submitDesign(order.id); },
                    className: 'mt-2 w-full gradient-btn text-white p-3 rounded-xl shadow-lg'
                  },
                  'Submit Design'
                )
              )
            );
          })
        )
      );
    };

    const renderHrSection = function () {
      return React.createElement(
        'div',
        null,
        React.createElement('h2', { className: 'text-xl font-medium text-gray-800 dark:text-gray-200 mb-4' }, 'Assign Cards to Employees'),
        designs.length === 0 ? React.createElement('p', { className: 'text-gray-500 dark:text-gray-400' }, 'No designs available.') :
        React.createElement(
          'div',
          null,
          React.createElement('input', {
            type: 'text',
            placeholder: 'Employee Name',
            value: employeeName,
            onChange: function (e) { return setEmployeeName(e.target.value); },
            className: 'w-full p-3 mb-3 bg-white/50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400'
          }),
          React.createElement('input', {
            type: 'text',
            placeholder: 'Job Title',
            value: employeeTitle,
            onChange: function (e) { return setEmployeeTitle(e.target.value); },
            className: 'w-full p-3 mb-3 bg-white/50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400'
          }),
          React.createElement('input', {
            type: 'email',
            placeholder: 'Employee Email',
            value: employeeEmail,
            onChange: function (e) { return setEmployeeEmail(e.target.value); },
            className: 'w-full p-3 mb-3 bg-white/50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400'
          }),
          React.createElement('input', {
            type: 'tel',
            placeholder: 'Employee Phone',
            value: employeePhone,
            onChange: function (e) { return setEmployeePhone(e.target.value); },
            className: 'w-full p-3 mb-3 bg-white/50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400'
          }),
          React.createElement('h3', { className: 'text-lg font-medium text-gray-800 dark:text-gray-200 mt-4' }, 'Available Designs'),
          React.createElement(
            'ul',
            { className: 'space-y-3 mt-2' },
            designs.map(function (design) {
              return React.createElement(
                motion.li,
                { key: design.id, className: 'bg-white/30 dark:bg-gray-800/50 p-4 rounded-xl' },
                React.createElement('p', null, React.createElement('strong', null, 'Template:'), ' ', design.template),
                React.createElement(
                  motion.button,
                  {
                    whileHover: { scale: 1.05 },
                    whileTap: { scale: 0.95 },
                    onClick: function () { return assignCard(design.id); },
                    className: 'mt-2 w-full gradient-btn text-white p-3 rounded-xl shadow-lg'
                  },
                  'Assign to Employee'
                )
              );
            })
          )
        )
      );
    };

    const renderEmployeeSection = function () {
      return React.createElement(
        'div',
        null,
        React.createElement('h2', { className: 'text-xl font-medium text-gray-800 dark:text-gray-200 mb-4' }, 'My Business Cards'),
        employees.length === 0 ? React.createElement('p', { className: 'text-gray-500 dark:text-gray-400' }, 'No cards assigned.') :
        React.createElement(
          'ul',
          { className: 'space-y-4' },
          employees.map(function (employee) {
            return React.createElement(
              motion.li,
              { key: employee.id, className: 'bg-white/30 dark:bg-gray-800/50 p-4 rounded-xl' },
              React.createElement('p', null, React.createElement('strong', null, 'Name:'), ' ', employee.name),
              React.createElement('p', null, React.createElement('strong', null, 'Title:'), ' ', employee.title),
              React.createElement('p', null, React.createElement('strong', null, 'Email:'), ' ', employee.email),
              React.createElement('p', null, React.createElement('strong', null, 'Phone:'), ' ', employee.phone),
              React.createElement('p', null, React.createElement('strong', null, 'Template:'), ' ', employee.template),
              React.createElement(
                motion.button,
                {
                  whileHover: { scale: 1.05 },
                  whileTap: { scale: 0.95 },
                  onClick: function () { return shareCard(employee); },
                  className: 'mt-2 w-full gradient-btn text-white p-3 rounded-xl shadow-lg'
                },
                'Share Card'
              )
            );
          })
        ),
        assignCode && React.createElement(
          'div',
          { className: 'mt-6' },
          React.createElement('h3', { className: 'text-lg font-medium text-gray-800 dark:text-gray-200' }, 'Share This Code'),
          React.createElement('p', { className: 'text-lg font-mono text-gray-900 dark:text-gray-100' }, assignCode),
          React.createElement('p', { className: 'text-sm text-gray-500 dark:text-gray-400' }, 'Share this code with other professionals.')
        )
      );
    };

    return React.createElement(
      'div',
      { className: 'min-h-screen animated-bg p-6 flex flex-col items-center dark:bg-gray-900 transition-colors' },
      // ✅ Dark Mode Toggle
      React.createElement(
        'button',
        {
          onClick: toggleDarkMode,
          className: 'absolute top-4 right-4 px-4 py-2 rounded-xl text-white gradient-btn shadow-md'
        },
        darkMode ? '☀ Light' : '🌙 Dark'
      ),
      // ✅ Gradient Headline
      React.createElement(
        motion.h1,
        {
          className: 'text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-300 dark:to-indigo-400 mb-8'
        },
        'Business Card Studio'
      ),
      // Role Selector
      React.createElement(
        'div',
        { className: 'w-full max-w-md glass p-6 rounded-2xl mb-8 dark:bg-gray-800/50' },
        React.createElement('label', { className: 'block text-lg font-medium text-gray-800 dark:text-gray-200 mb-2' }, 'Select Role'),
        React.createElement(
          'select',
          {
            value: role,
            onChange: function (e) { return setRole(e.target.value); },
            className: 'w-full p-3 bg-white/50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-400'
          },
          React.createElement('option', { value: 'company' }, 'Company'),
          React.createElement('option', { value: 'designer' }, 'Designer'),
          React.createElement('option', { value: 'hr' }, 'HR'),
          React.createElement('option', { value: 'employee' }, 'Employee')
        )
      ),
      // Animated Role Sections
      React.createElement(
        AnimatePresence,
        { mode: 'wait' },
        React.createElement(
          motion.div,
          {
            key: role,
            initial: { opacity: 0, x: 50 },
            animate: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: -50 },
            transition: { duration: 0.4 },
            className: 'w-full max-w-md glass p-6 rounded-2xl mb-8 dark:bg-gray-800/50'
          },
          role === 'company' ? renderCompanySection() :
          role === 'designer' ? renderDesignerSection() :
          role === 'hr' ? renderHrSection() :
          renderEmployeeSection()
        )
      ),
      // Receive Card Section
      React.createElement(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.4 },
          className: 'w-full max-w-md glass p-6 rounded-2xl dark:bg-gray-800/50'
        },
        React.createElement('h2', { className: 'text-xl font-medium text-gray-800 dark:text-gray-200 mb-4' }, 'Receive a Card'),
        React.createElement('input', {
          type: 'text',
          placeholder: 'Enter share code',
          value: receiveCode,
          onChange: function (e) { return setReceiveCode(e.target.value); },
          className: 'w-full p-3 mb-3 bg-white/50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-400'
        }),
        React.createElement(
          motion.button,
          {
            whileHover: { scale: 1.05 },
            whileTap: { scale: 0.95 },
            onClick: receiveCard,
            className: 'w-full gradient-btn text-white p-3 rounded-xl shadow-lg'
          },
          'Receive Card'
        )
      )
    );
  }

  ReactDOM.render(React.createElement(App), document.getElementById('root'));
})();
