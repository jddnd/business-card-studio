(function () {
  const { useState, useEffect } = React;
  const motion = window.FramerMotion ? window.FramerMotion.motion : {
    div: 'div',
    h1: 'h1',
    li: 'li',
    button: 'button',
    initial: function () { return {}; },
    animate: function () { return {}; },
    whileHover: function () { return {}; },
    whileTap: function () { return {}; },
    transition: function () { return {}; }
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

    useEffect(function () {
      setOrders(JSON.parse(localStorage.getItem('orders')) || []);
      setDesigns(JSON.parse(localStorage.getItem('designs')) || []);
      setEmployees(JSON.parse(localStorage.getItem('employees')) || []);
    }, []);

    useEffect(function () {
      localStorage.setItem('orders', JSON.stringify(orders));
      localStorage.setItem('designs', JSON.stringify(designs));
      localStorage.setItem('employees', JSON.stringify(employees));
    }, [orders, designs, employees]);

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

    return React.createElement(
      'div',
      { className: 'min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 p-6 flex flex-col items-center' },
      React.createElement(
        motion.h1,
        { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, className: 'text-4xl font-sans font-semibold text-gray-900 mb-8' },
        'Business Card Studio'
      ),
      React.createElement(
        motion.div,
        { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.2 }, className: 'w-full max-w-md glass p-6 rounded-2xl mb-8' },
        React.createElement('label', { className: 'block text-lg font-medium text-gray-800 mb-2' }, 'Select Role'),
        React.createElement(
          'select',
          {
            value: role,
            onChange: function (e) { return setRole(e.target.value); },
            className: 'w-full p-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300'
          },
          React.createElement('option', { value: 'company' }, 'Company'),
          React.createElement('option', { value: 'designer' }, 'Designer'),
          React.createElement('option', { value: 'hr' }, 'HR'),
          React.createElement('option', { value: 'employee' }, 'Employee')
        )
      ),
      role === 'company' && React.createElement(
        motion.div,
        { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.3 }, className: 'w-full max-w-md glass p-6 rounded-2xl mb-8' },
        React.createElement('h2', { className: 'text-xl font-medium text-gray-800 mb-4' }, 'Order a Design'),
        React.createElement('input', {
          type: 'text',
          placeholder: 'Company Name',
          value: companyName,
          onChange: function (e) { return setCompanyName(e.target.value); },
          className: 'w-full p-3 mb-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300'
        }),
        React.createElement('textarea', {
          placeholder: 'Brand Details (e.g., colors, logo)',
          value: brandDetails,
          onChange: function (e) { return setBrandDetails(e.target.value); },
          className: 'w-full p-3 mb-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300'
        }),
        React.createElement(
          motion.button,
          {
            whileHover: { scale: 1.05 },
            whileTap: { scale: 0.95 },
            onClick: placeOrder,
            className: 'w-full bg-blue-500 text-white p-3 rounded-xl hover:bg-blue-600 transition'
          },
          'Place Order'
        ),
        React.createElement('h3', { className: 'text-lg font-medium text-gray-800 mt-6' }, 'Your Orders'),
        orders.length === 0 ? React.createElement('p', { className: 'text-gray-500' }, 'No orders placed.') :
        React.createElement(
          'ul',
          { className: 'space-y-3 mt-2' },
          orders.map(function (order) {
            return React.createElement(
              motion.li,
              { key: order.id, initial: { opacity: 0 }, animate: { opacity: 1 }, className: 'bg-white/30 p-4 rounded-xl' },
              React.createElement('p', null, React.createElement('strong', null, 'Company:'), ' ', order.companyName),
              React.createElement('p', null, React.createElement('strong', null, 'Details:'), ' ', order.brandDetails),
              React.createElement('p', null, React.createElement('strong', null, 'Status:'), ' ', order.status)
            );
          })
        )
      ),
      role === 'designer' && React.createElement(
        motion.div,
        { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.3 }, className: 'w-full max-w-md glass p-6 rounded-2xl mb-8' },
        React.createElement('h2', { className: 'text-xl font-medium text-gray-800 mb-4' }, 'Design Orders'),
        orders.length === 0 ? React.createElement('p', { className: 'text-gray-500' }, 'No orders available.') :
        React.createElement(
          'ul',
          { className: 'space-y-4' },
          orders.map(function (order) {
            return React.createElement(
              motion.li,
              { key: order.id, initial: { opacity: 0 }, animate: { opacity: 1 }, className: 'bg-white/30 p-4 rounded-xl' },
              React.createElement('p', null, React.createElement('strong', null, 'Company:'), ' ', order.companyName),
              React.createElement('p', null, React.createElement('strong', null, 'Details:'), ' ', order.brandDetails),
              React.createElement('p', null, React.createElement('strong', null, 'Status:'), ' ', order.status),
              order.status === 'Pending' && React.createElement(
                React.Fragment,
                null,
                React.createElement('textarea', {
                  placeholder: 'Enter design template (e.g., color scheme, layout)',
                  value: designTemplate,
                  onChange: function (e) { return setDesignTemplate(e.target.value); },
                  className: 'w-full p-3 mt-2 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300'
                }),
                React.createElement(
                  motion.button,
                  {
                    whileHover: { scale: 1.05 },
                    whileTap: { scale: 0.95 },
                    onClick: function () { return submitDesign(order.id); },
                    className: 'mt-2 w-full bg-green-500 text-white p-3 rounded-xl hover:bg-green-600 transition'
                  },
                  'Submit Design'
                )
              )
            );
          })
        )
      ),
      role === 'hr' && React.createElement(
        motion.div,
        { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.3 }, className: 'w-full max-w-md glass p-6 rounded-2xl mb-8' },
        React.createElement('h2', { className: 'text-xl font-medium text-gray-800 mb-4' }, 'Assign Cards to Employees'),
        designs.length === 0 ? React.createElement('p', { className: 'text-gray-500' }, 'No designs available.') :
        React.createElement(
          React.Fragment,
          null,
          React.createElement('input', {
            type: 'text',
            placeholder: 'Employee Name',
            value: employeeName,
            onChange: function (e) { return setEmployeeName(e.target.value); },
            className: 'w-full p-3 mb-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300'
          }),
          React.createElement('input', {
            type: 'text',
            placeholder: 'Job Title',
            value: employeeTitle,
            onChange: function (e) { return setEmployeeTitle(e.target.value); },
            className: 'w-full p-3 mb-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300'
          }),
          React.createElement('input', {
            type: 'email',
            placeholder: 'Employee Email',
            value: employeeEmail,
            onChange: function (e) { return setEmployeeEmail(e.target.value); },
            className: 'w-full p-3 mb-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300'
          }),
          React.createElement('input', {
            type: 'tel',
            placeholder: 'Employee Phone',
            value: employeePhone,
            onChange: function (e) { return setEmployeePhone(e.target.value); },
            className: 'w-full p-3 mb-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300'
          }),
          React.createElement('h3', { className: 'text-lg font-medium text-gray-800 mt-4' }, 'Available Designs'),
          React.createElement(
            'ul',
            { className: 'space-y-3 mt-2' },
            designs.map(function (design) {
              return React.createElement(
                motion.li,
                { key: design.id, initial: { opacity: 0 }, animate: { opacity: 1 }, className: 'bg-white/30 p-4 rounded-xl' },
                React.createElement('p', null, React.createElement('strong', null, 'Template:'), ' ', design.template),
                React.createElement(
                  motion.button,
                  {
                    whileHover: { scale: 1.05 },
                    whileTap: { scale: 0.95 },
                    onClick: function () { return assignCard(design.id); },
                    className: 'mt-2 w-full bg-blue-500 text-white p-3 rounded-xl hover:bg-blue-600 transition'
                  },
                  'Assign to Employee'
                )
              );
            })
          )
        )
      ),
      role === 'employee' && React.createElement(
        motion.div,
        { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.3 }, className: 'w-full max-w-md glass p-6 rounded-2xl mb-8' },
        React.createElement('h2', { className: 'text-xl font-medium text-gray-800 mb-4' }, 'My Business Cards'),
        employees.length === 0 ? React.createElement('p', { className: 'text-gray-500' }, 'No cards assigned.') :
        React.createElement(
          'ul',
          { className: 'space-y-4' },
          employees.map(function (employee) {
            return React.createElement(
              motion.li,
              { key: employee.id, initial: { opacity: 0 }, animate: { opacity: 1 }, className: 'bg-white/30 p-4 rounded-xl' },
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
                  className: 'mt-2 w-full bg-green-500 text-white p-3 rounded-xl hover:bg-green-600 transition'
                },
                'Share Card'
              )
            );
          })
        ),
        assignCode && React.createElement(
          motion.div,
          { initial: { opacity: 0 }, animate: { opacity: 1 }, className: 'mt-6' },
          React.createElement('h3', { className: 'text-lg font-medium text-gray-800' }, 'Share This Code'),
          React.createElement('p', { className: 'text-lg font-mono text-gray-900' }, assignCode),
          React.createElement('p', { className: 'text-sm text-gray-500' }, 'Share this code with other professionals.')
        )
      ),
      React.createElement(
        motion.div,
        { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.4 }, className: 'w-full max-w-md glass p-6 rounded-2xl' },
        React.createElement('h2', { className: 'text-xl font-medium text-gray-800 mb-4' }, 'Receive a Card'),
        React.createElement('input', {
          type: 'text',
          placeholder: 'Enter share code',
          value: receiveCode,
          onChange: function (e) { return setReceiveCode(e.target.value); },
          className: 'w-full p-3 mb-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300'
        }),
        React.createElement(
          motion.button,
          {
            whileHover: { scale: 1.05 },
            whileTap: { scale: 0.95 },
            onClick: receiveCard,
            className: 'w-full bg-purple-500 text-white p-3 rounded-xl hover:bg-purple-600 transition'
          },
          'Receive Card'
        )
      )
    );
  }

  ReactDOM.render(React.createElement(App), document.getElementById('root'));
})();