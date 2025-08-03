(function () {
  const { useState, useEffect } = React;
  const { motion, AnimatePresence } = window.FramerMotion;

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

    // Load saved data
    useEffect(() => {
      setOrders(JSON.parse(localStorage.getItem('orders')) || []);
      setDesigns(JSON.parse(localStorage.getItem('designs')) || []);
      setEmployees(JSON.parse(localStorage.getItem('employees')) || []);
    }, []);

    // Save data to localStorage
    useEffect(() => {
      localStorage.setItem('orders', JSON.stringify(orders));
      localStorage.setItem('designs', JSON.stringify(designs));
      localStorage.setItem('employees', JSON.stringify(employees));
    }, [orders, designs, employees]);

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

    const shareCard = (employee) => {
      setAssignCode(employee.shareCode);
    };

    const receiveCard = () => {
      const employee = employees.find(e => e.shareCode === receiveCode);
      if (employee) {
        alert(`Received card: ${employee.name}, ${employee.title}, ${employee.email}, ${employee.phone}, Template: ${employee.template}`);
      } else {
        alert('Invalid share code');
      }
      setReceiveCode('');
    };

    // Section renderers
    const renderCompanySection = () => (
      <>
        <h2 className="text-xl font-medium text-gray-800 mb-4">Order a Design</h2>
        <input
          type="text"
          placeholder="Company Name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className="w-full p-3 mb-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <textarea
          placeholder="Brand Details (e.g., colors, logo)"
          value={brandDetails}
          onChange={(e) => setBrandDetails(e.target.value)}
          className="w-full p-3 mb-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={placeOrder}
          className="w-full bg-blue-500 text-white p-3 rounded-xl hover:bg-blue-600 transition"
        >
          Place Order
        </motion.button>
        <h3 className="text-lg font-medium text-gray-800 mt-6">Your Orders</h3>
        {orders.length === 0 ? (
          <p className="text-gray-500">No orders placed.</p>
        ) : (
          <ul className="space-y-3 mt-2">
            {orders.map(order => (
              <motion.li key={order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/30 p-4 rounded-xl">
                <p><strong>Company:</strong> {order.companyName}</p>
                <p><strong>Details:</strong> {order.brandDetails}</p>
                <p><strong>Status:</strong> {order.status}</p>
              </motion.li>
            ))}
          </ul>
        )}
      </>
    );

    const renderDesignerSection = () => (
      <>
        <h2 className="text-xl font-medium text-gray-800 mb-4">Design Orders</h2>
        {orders.length === 0 ? (
          <p className="text-gray-500">No orders available.</p>
        ) : (
          <ul className="space-y-4">
            {orders.map(order => (
              <motion.li key={order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/30 p-4 rounded-xl">
                <p><strong>Company:</strong> {order.companyName}</p>
                <p><strong>Details:</strong> {order.brandDetails}</p>
                <p><strong>Status:</strong> {order.status}</p>
                {order.status === 'Pending' && (
                  <>
                    <textarea
                      placeholder="Enter design template (e.g., color scheme, layout)"
                      value={designTemplate}
                      onChange={(e) => setDesignTemplate(e.target.value)}
                      className="w-full p-3 mt-2 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => submitDesign(order.id)}
                      className="mt-2 w-full bg-green-500 text-white p-3 rounded-xl hover:bg-green-600 transition"
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

    const renderHrSection = () => (
      <>
        <h2 className="text-xl font-medium text-gray-800 mb-4">Assign Cards to Employees</h2>
        {designs.length === 0 ? (
          <p className="text-gray-500">No designs available.</p>
        ) : (
          <>
            <input type="text" placeholder="Employee Name" value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} className="w-full p-3 mb-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300" />
            <input type="text" placeholder="Job Title" value={employeeTitle} onChange={(e) => setEmployeeTitle(e.target.value)} className="w-full p-3 mb-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300" />
            <input type="email" placeholder="Employee Email" value={employeeEmail} onChange={(e) => setEmployeeEmail(e.target.value)} className="w-full p-3 mb-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300" />
            <input type="tel" placeholder="Employee Phone" value={employeePhone} onChange={(e) => setEmployeePhone(e.target.value)} className="w-full p-3 mb-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300" />
            <h3 className="text-lg font-medium text-gray-800 mt-4">Available Designs</h3>
            <ul className="space-y-3 mt-2">
              {designs.map(design => (
                <motion.li key={design.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/30 p-4 rounded-xl">
                  <p><strong>Template:</strong> {design.template}</p>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => assignCard(design.id)} className="mt-2 w-full bg-blue-500 text-white p-3 rounded-xl hover:bg-blue-600 transition">
                    Assign to Employee
                  </motion.button>
                </motion.li>
              ))}
            </ul>
          </>
        )}
      </>
    );

    const renderEmployeeSection = () => (
      <>
        <h2 className="text-xl font-medium text-gray-800 mb-4">My Business Cards</h2>
        {employees.length === 0 ? (
          <p className="text-gray-500">No cards assigned.</p>
        ) : (
          <ul className="space-y-4">
            {employees.map(employee => (
              <motion.li key={employee.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/30 p-4 rounded-xl">
                <p><strong>Name:</strong> {employee.name}</p>
                <p><strong>Title:</strong> {employee.title}</p>
                <p><strong>Email:</strong> {employee.email}</p>
                <p><strong>Phone:</strong> {employee.phone}</p>
                <p><strong>Template:</strong> {employee.template}</p>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => shareCard(employee)} className="mt-2 w-full bg-green-500 text-white p-3 rounded-xl hover:bg-green-600 transition">
                  Share Card
                </motion.button>
              </motion.li>
            ))}
          </ul>
        )}
        {assignCode && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6">
            <h3 className="text-lg font-medium text-gray-800">Share This Code</h3>
            <p className="text-lg font-mono text-gray-900">{assignCode}</p>
            <p className="text-sm text-gray-500">Share this code with other professionals.</p>
          </motion.div>
        )}
      </>
    );

    return (
      React.createElement(
        'div',
        { className: 'min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 p-6 flex flex-col items-center' },
        React.createElement(motion.h1, {
          initial: { opacity: 0, y: -20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5 },
          className: 'text-4xl font-sans font-semibold text-gray-900 mb-8'
        }, 'Business Card Studio'),

        // Role Selector (outside animated content)
        React.createElement('div', { className: 'w-full max-w-md glass p-6 rounded-2xl mb-8' },
          React.createElement('label', { className: 'block text-lg font-medium text-gray-800 mb-2' }, 'Select Role'),
          React.createElement('select', {
            value: role,
            onChange: (e) => setRole(e.target.value),
            className: 'w-full p-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300'
          },
            React.createElement('option', { value: 'company' }, 'Company'),
            React.createElement('option', { value: 'designer' }, 'Designer'),
            React.createElement('option', { value: 'hr' }, 'HR'),
            React.createElement('option', { value: 'employee' }, 'Employee')
          )
        ),

        // Animated section
        React.createElement(AnimatePresence, { mode: 'wait' },
          React.createElement(motion.div, {
            key: role,
            initial: { opacity: 0, x: 50 },
            animate: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: -50 },
            transition: { duration: 0.4 },
            className: 'w-full max-w-md glass p-6 rounded-2xl mb-8'
          },
            role === 'company' ? renderCompanySection() :
            role === 'designer' ? renderDesignerSection() :
            role === 'hr' ? renderHrSection() :
            renderEmployeeSection()
          )
        ),

        // Receive card section (always visible)
        React.createElement(motion.div, {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.4 },
          className: 'w-full max-w-md glass p-6 rounded-2xl'
        },
          React.createElement('h2', { className: 'text-xl font-medium text-gray-800 mb-4' }, 'Receive a Card'),
          React.createElement('input', {
            type: 'text',
            placeholder: 'Enter share code',
            value: receiveCode,
            onChange: (e) => setReceiveCode(e.target.value),
            className: 'w-full p-3 mb-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300'
          }),
          React.createElement(motion.button, {
            whileHover: { scale: 1.05 },
            whileTap: { scale: 0.95 },
            onClick: receiveCard,
            className: 'w-full bg-purple-500 text-white p-3 rounded-xl hover:bg-purple-600 transition'
          }, 'Receive Card')
        )
      )
    );
  }

  ReactDOM.render(React.createElement(App), document.getElementById('root'));
})();
