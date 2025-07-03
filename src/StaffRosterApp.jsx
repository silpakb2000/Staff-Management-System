import React, { useState, useEffect } from 'react';
import { Calendar, Users, Clock, Plus, Edit, Trash2, Save, X, UserPlus, Database } from 'lucide-react';

// Mock Database Service (In real app, this would connect to your backend API)
class DatabaseService {
  constructor() {
    this.initializeData();
  }

  initializeData() {
    // Initialize with sample data if localStorage is empty
    if (!localStorage.getItem('staffRosterData')) {
      const initialData = {
        employees: [
          { id: 1, name: 'John Smith', department: 'Sales', email: 'john@company.com' },
          { id: 2, name: 'Alice Johnson', department: 'Sales', email: 'alice@company.com' },
          { id: 3, name: 'Sarah Wilson', department: 'HR', email: 'sarah@company.com' },
          { id: 4, name: 'Mike Davis', department: 'IT', email: 'mike@company.com' },
          { id: 5, name: 'Emma Brown', department: 'Finance', email: 'emma@company.com' }
        ],
        shifts: [
          { id: 1, employeeId: 1, day: 'Monday', startTime: '09:00', endTime: '17:00' },
          { id: 2, employeeId: 2, day: 'Tuesday', startTime: '10:00', endTime: '18:00' },
          { id: 3, employeeId: 3, day: 'Tuesday', startTime: '14:00', endTime: '18:00' },
          { id: 4, employeeId: 4, day: 'Tuesday', startTime: '08:00', endTime: '16:00' },
          { id: 5, employeeId: 4, day: 'Tuesday', startTime: '02:00', endTime: '04:00' },
          { id: 6, employeeId: 1, day: 'Wednesday', startTime: '09:00', endTime: '17:00' },
          { id: 7, employeeId: 2, day: 'Thursday', startTime: '10:00', endTime: '18:00' },
          { id: 8, employeeId: 5, day: 'Friday', startTime: '08:00', endTime: '16:00' }
        ]
      };
      localStorage.setItem('staffRosterData', JSON.stringify(initialData));
    }
  }

  getData() {
    return JSON.parse(localStorage.getItem('staffRosterData'));
  }

  saveData(data) {
    localStorage.setItem('staffRosterData', JSON.stringify(data));
  }

  // Employee CRUD operations
  getEmployees() {
    return this.getData().employees;
  }

  addEmployee(employee) {
    const data = this.getData();
    const newEmployee = { ...employee, id: Date.now() };
    data.employees.push(newEmployee);
    this.saveData(data);
    return newEmployee;
  }

  updateEmployee(id, updatedEmployee) {
    const data = this.getData();
    const index = data.employees.findIndex(emp => emp.id === id);
    if (index !== -1) {
      data.employees[index] = { ...data.employees[index], ...updatedEmployee };
      this.saveData(data);
    }
  }

  deleteEmployee(id) {
    const data = this.getData();
    data.employees = data.employees.filter(emp => emp.id !== id);
    data.shifts = data.shifts.filter(shift => shift.employeeId !== id);
    this.saveData(data);
  }

  // Shift CRUD operations
  getShifts() {
    return this.getData().shifts;
  }

  addShift(shift) {
    const data = this.getData();
    const newShift = { ...shift, id: Date.now() };
    data.shifts.push(newShift);
    this.saveData(data);
    return newShift;
  }

  updateShift(id, updatedShift) {
    const data = this.getData();
    const index = data.shifts.findIndex(shift => shift.id === id);
    if (index !== -1) {
      data.shifts[index] = { ...data.shifts[index], ...updatedShift };
      this.saveData(data);
    }
  }

  deleteShift(id) {
    const data = this.getData();
    data.shifts = data.shifts.filter(shift => shift.id !== id);
    this.saveData(data);
  }
}

// Initialize database service
const db = new DatabaseService();

// Employee Management Component
const EmployeeManagement = ({ employees, onEmployeeChange }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', department: '', email: '' });

  const departments = ['Sales', 'HR', 'IT', 'Operations', 'Finance'];

  const handleAdd = () => {
    if (formData.name && formData.department && formData.email) {
      db.addEmployee(formData);
      setFormData({ name: '', department: '', email: '' });
      setIsAdding(false);
      onEmployeeChange();
    }
  };

  const handleEdit = (employee) => {
    setEditingId(employee.id);
    setFormData({ name: employee.name, department: employee.department, email: employee.email });
  };

  const handleUpdate = () => {
    db.updateEmployee(editingId, formData);
    setEditingId(null);
    setFormData({ name: '', department: '', email: '' });
    onEmployeeChange();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this employee and all their shifts?')) {
      db.deleteEmployee(id);
      onEmployeeChange();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Users className="text-blue-600" />
          Employee Management
        </h2>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <UserPlus size={16} />
          Add Employee
        </button>
      </div>

      {(isAdding || editingId) && (
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              placeholder="Employee Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Department</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={editingId ? handleUpdate : handleAdd}
              className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors"
            >
              <Save size={16} />
              {editingId ? 'Update' : 'Add'}
            </button>
            <button
              onClick={() => {
                setIsAdding(false);
                setEditingId(null);
                setFormData({ name: '', department: '', email: '' });
              }}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-700 transition-colors"
            >
              <X size={16} />
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Name</th>
              <th className="text-left py-2">Department</th>
              <th className="text-left py-2">Email</th>
              <th className="text-left py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(employee => (
              <tr key={employee.id} className="border-b hover:bg-gray-50">
                <td className="py-2">{employee.name}</td>
                <td className="py-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    employee.department === 'Sales' ? 'bg-blue-100 text-blue-800' :
                    employee.department === 'HR' ? 'bg-pink-100 text-pink-800' :
                    employee.department === 'IT' ? 'bg-purple-100 text-purple-800' :
                    employee.department === 'Operations' ? 'bg-orange-100 text-orange-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {employee.department}
                  </span>
                </td>
                <td className="py-2">{employee.email}</td>
                <td className="py-2">
                  <button
                    onClick={() => handleEdit(employee)}
                    className="text-blue-600 hover:text-blue-800 mr-2"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(employee.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Shift Management Component
const ShiftManagement = ({ employees, shifts, onShiftChange }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: '',
    day: '',
    startTime: '',
    endTime: ''
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleAdd = () => {
    if (formData.employeeId && formData.day && formData.startTime && formData.endTime) {
      db.addShift({
        employeeId: parseInt(formData.employeeId),
        day: formData.day,
        startTime: formData.startTime,
        endTime: formData.endTime
      });
      setFormData({ employeeId: '', day: '', startTime: '', endTime: '' });
      setIsAdding(false);
      onShiftChange();
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this shift?')) {
      db.deleteShift(id);
      onShiftChange();
    }
  };

  const getEmployeeName = (employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? employee.name : 'Unknown';
  };

  const getEmployeeDepartment = (employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? employee.department : 'Unknown';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Clock className="text-green-600" />
          Shift Management
        </h2>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors"
        >
          <Plus size={16} />
          Add Shift
        </button>
      </div>

      {isAdding && (
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <select
              value={formData.employeeId}
              onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select Employee</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.name} ({emp.department})</option>
              ))}
            </select>
            <select
              value={formData.day}
              onChange={(e) => setFormData({ ...formData, day: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select Day</option>
              {days.map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
            <input
              type="time"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="time"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors"
            >
              <Save size={16} />
              Add Shift
            </button>
            <button
              onClick={() => {
                setIsAdding(false);
                setFormData({ employeeId: '', day: '', startTime: '', endTime: '' });
              }}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-700 transition-colors"
            >
              <X size={16} />
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Employee</th>
              <th className="text-left py-2">Department</th>
              <th className="text-left py-2">Day</th>
              <th className="text-left py-2">Start Time</th>
              <th className="text-left py-2">End Time</th>
              <th className="text-left py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {shifts.map(shift => (
              <tr key={shift.id} className="border-b hover:bg-gray-50">
                <td className="py-2">{getEmployeeName(shift.employeeId)}</td>
                <td className="py-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    getEmployeeDepartment(shift.employeeId) === 'Sales' ? 'bg-blue-100 text-blue-800' :
                    getEmployeeDepartment(shift.employeeId) === 'HR' ? 'bg-pink-100 text-pink-800' :
                    getEmployeeDepartment(shift.employeeId) === 'IT' ? 'bg-purple-100 text-purple-800' :
                    getEmployeeDepartment(shift.employeeId) === 'Operations' ? 'bg-orange-100 text-orange-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {getEmployeeDepartment(shift.employeeId)}
                  </span>
                </td>
                <td className="py-2">{shift.day}</td>
                <td className="py-2">{shift.startTime}</td>
                <td className="py-2">{shift.endTime}</td>
                <td className="py-2">
                  <button
                    onClick={() => handleDelete(shift.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Roster Grid Component
const RosterGrid = ({ employees, shifts }) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const hours = Array.from({ length: 24 }, (_, i) => {
    const hour = i === 0 ? 12 : i > 12 ? i - 12 : i;
    const ampm = i < 12 ? 'AM' : 'PM';
    return `${hour}:00 ${ampm}`;
  });

  const getShiftsForTimeSlot = (day, hour) => {
    const hourNum = hour === 0 ? 0 : hour;
    return shifts.filter(shift => {
      if (shift.day !== day) return false;
      
      const startHour = parseInt(shift.startTime.split(':')[0]);
      const endHour = parseInt(shift.endTime.split(':')[0]);
      
      if (startHour <= endHour) {
        return hourNum >= startHour && hourNum < endHour;
      } else {
        // Overnight shift
        return hourNum >= startHour || hourNum < endHour;
      }
    });
  };

  const getEmployeeInfo = (employeeId) => {
    return employees.find(emp => emp.id === employeeId);
  };

  const getDepartmentColor = (department) => {
    const colors = {
      'Sales': 'bg-blue-500',
      'HR': 'bg-pink-500',
      'IT': 'bg-purple-500',
      'Operations': 'bg-orange-500',
      'Finance': 'bg-green-500'
    };
    return colors[department] || 'bg-gray-500';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Calendar className="text-purple-600" />
        Weekly Staff Roster
      </h2>
      
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-8 gap-1 text-sm">
            {/* Header */}
            <div className="bg-gray-800 text-white p-3 text-center font-semibold">Time</div>
            {days.map(day => (
              <div key={day} className="bg-gray-800 text-white p-3 text-center font-semibold">
                {day}
              </div>
            ))}

            {/* Time slots */}
            {hours.map((hour, hourIndex) => (
              <React.Fragment key={hour}>
                <div className="bg-gray-100 p-3 text-center font-medium border">
                  {hour}
                </div>
                {days.map(day => {
                  const dayShifts = getShiftsForTimeSlot(day, hourIndex);
                  return (
                    <div key={`${day}-${hour}`} className="border min-h-[60px] p-1 bg-white">
                      {dayShifts.map(shift => {
                        const employee = getEmployeeInfo(shift.employeeId);
                        if (!employee) return null;
                        
                        return (
                          <div
                            key={shift.id}
                            className={`${getDepartmentColor(employee.department)} text-white text-xs p-1 rounded mb-1 text-center font-medium shadow-sm`}
                          >
                            {employee.name}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Statistics Component
const Statistics = ({ employees, shifts }) => {
  const getDepartmentStats = () => {
    const deptCounts = {};
    employees.forEach(emp => {
      deptCounts[emp.department] = (deptCounts[emp.department] || 0) + 1;
    });
    return deptCounts;
  };

  const getTotalHours = () => {
    return shifts.reduce((total, shift) => {
      const start = parseInt(shift.startTime.split(':')[0]);
      const end = parseInt(shift.endTime.split(':')[0]);
      const hours = end > start ? end - start : (24 - start) + end;
      return total + hours;
    }, 0);
  };

  const deptStats = getDepartmentStats();

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Total Employees</p>
            <p className="text-3xl font-bold text-blue-600">{employees.length}</p>
          </div>
          <Users className="text-blue-600" size={32} />
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Total Shifts</p>
            <p className="text-3xl font-bold text-green-600">{shifts.length}</p>
          </div>
          <Clock className="text-green-600" size={32} />
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Departments</p>
            <p className="text-3xl font-bold text-purple-600">{Object.keys(deptStats).length}</p>
          </div>
          <Database className="text-purple-600" size={32} />
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Weekly Hours</p>
            <p className="text-3xl font-bold text-orange-600">{getTotalHours()}</p>
          </div>
          <Calendar className="text-orange-600" size={32} />
        </div>
      </div>
    </div>
  );
};

// Main App Component
const StaffRosterApp = () => {
  const [employees, setEmployees] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [activeTab, setActiveTab] = useState('roster');

  const loadData = () => {
    setEmployees(db.getEmployees());
    setShifts(db.getShifts());
  };

  useEffect(() => {
    loadData();
  }, []);

  const tabs = [
    { id: 'roster', label: 'Roster View', icon: Calendar },
    { id: 'employees', label: 'Employees', icon: Users },
    { id: 'shifts', label: 'Shifts', icon: Clock }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Staff Roster Management System</h1>
          <p className="text-gray-600">Comprehensive staff scheduling and management dashboard</p>
        </div>

        {/* Statistics */}
        <Statistics employees={employees} shifts={shifts} />

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'roster' && (
          <RosterGrid employees={employees} shifts={shifts} />
        )}
        
        {activeTab === 'employees' && (
          <EmployeeManagement employees={employees} onEmployeeChange={loadData} />
        )}
        
        {activeTab === 'shifts' && (
          <ShiftManagement employees={employees} shifts={shifts} onShiftChange={loadData} />
        )}
      </div>
    </div>
  );
};

export default StaffRosterApp;