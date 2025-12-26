import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserList from './components/UserList';

const API_URL = 'https://dummyjson.com/users';

function App() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(API_URL);
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
      // Fallback to dummy data
      setUsers([
        {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          company: { name: 'Example Corp', title: 'Developer' },
          address: { country: 'USA' }
        }
      ]);
    }
  };

  const handleRefresh = () => {
    setShowLoading(true);
    fetchUsers().finally(() => setShowLoading(false));
  };

  const handleAddUser = () => {
    if (users.length > 0) {
      const keys = Object.keys(users[0]);
      const initialData = {};
      keys.forEach(key => {
        if (typeof users[0][key] === 'object') {
          initialData[key] = JSON.stringify(users[0][key]);
        } else {
          initialData[key] = '';
        }
      });
      setFormData(initialData);
    }
    setShowModal(true);
  };

  const handleSubmit = () => {
    const newUser = { ...formData, id: Date.now() };
    // Parse objects
    Object.keys(newUser).forEach(key => {
      if (typeof users[0][key] === 'object' && newUser[key]) {
        try {
          newUser[key] = JSON.parse(newUser[key]);
        } catch (e) {
          // keep as string
        }
      }
    });
    setUsers([...users, newUser]);
    setShowModal(false);
    setShowSuccess(true);
  };

  const handleClear = () => {
    const clearedData = {};
    Object.keys(formData).forEach(key => {
      clearedData[key] = '';
    });
    setFormData(clearedData);
  };

  const handleDeleteUser = (id) => {
    setUsers(users.filter(user => user.id !== id));
  };

  const filteredUsers = users.filter(user =>
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.company.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.address.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* Main app container with padding */}
      <h3 style={{ marginBottom: '20px' }}>User List</h3>
      {/* Search and action buttons section - reusable pattern for input and buttons layout */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input
          type="text"
          placeholder="Search by name, company, role, or country"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '8px', flex: 1 }}
        />
        <button className='button' onClick={handleRefresh} style={{ padding: '8px 16px', backgroundColor: '#85409D', color: 'white', border: 'none', cursor: 'pointer' }}>Refresh</button>
        <button className='button' onClick={handleAddUser} style={{ padding: '8px 16px', backgroundColor: 'green', color: 'white', border: 'none', cursor: 'pointer' }}>+</button>
      </div>
      <UserList users={paginatedUsers} onDelete={handleDeleteUser} />
      {/* Pagination controls - reusable pattern for page navigation with dynamic button generation */}
      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px' }}>
        <span>Rows per page:</span>
        <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))} style={{ padding: '4px' }}>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        <button
          className='button'
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{ padding: '8px 16px', backgroundColor: currentPage === 1 ? '#ccc' : 'blue', color: 'white', border: 'none', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
        >
          ‹
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            className='button'
            key={page}
            onClick={() => handlePageChange(page)}
            style={{
              padding: '8px 12px',
              backgroundColor: page === currentPage ? 'blue' : '#f0f0f0',
              color: page === currentPage ? 'white' : 'black',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {page}
          </button>
        ))}
        <button
          className='button'
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{ padding: '8px 16px', backgroundColor: currentPage === totalPages ? '#ccc' : 'blue', color: 'white', border: 'none', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
        >
          ›
        </button>
      </div>
      {/* Modal for adding new user - reusable overlay pattern with dynamic form generation */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div className='modal' style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            width: '50%',
            minWidth: '300px',
            maxHeight: '90%',
            overflow: 'auto'
          }}>
            <div style={{ position: 'relative' }}>
              <button className='button' onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '0', right: '0', backgroundColor: 'red', color: 'white', border: 'none', padding: '4px 8px', cursor: 'pointer' }}>X</button>
            </div>
            <h3>Add New User</h3>
            <div style={{ overflowX: 'auto' }}>
              {/* Dynamic form generation based on user object keys - reusable pattern for flexible input forms */}
              <form>
                {Object.keys(formData).map(key => (
                  <div key={key} style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
                    <label style={{ fontSize: '13px', flex: 1 }}>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                    <input
                      type="text"
                      value={formData[key]}
                      onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                      style={{ fontSize: '11px', flex: 2, marginLeft: '10px' }}
                    />
                  </div>
                ))}
              </form>
            </div>
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <button className='button' onClick={handleSubmit} style={{ padding: '8px 16px', backgroundColor: '#132440', color: 'white', border: 'none', marginRight: '10px', cursor: 'pointer' }}>Submit</button>
              <button className='button' onClick={handleClear} style={{ padding: '8px 16px', backgroundColor: '#16476A', color: 'white', border: 'none', cursor: 'pointer' }}>Clear</button>
            </div>
          </div>
        </div>
      )}
      {/* Loading overlay - reusable modal/overlay pattern for loading states */}
      {showLoading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <p>Refreshing the Table</p>
            <div style={{ marginTop: '10px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                border: '4px solid #f3f3f3',
                borderTop: '4px solid #3498db',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto'
              }}></div>
            </div>
          </div>
        </div>
      )}
      {/* Success notification overlay - reusable modal/overlay pattern for success messages */}
      {showSuccess && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{
            backgroundColor: '#16476A',
            padding: '20px',
            borderRadius: '8px',
            color: 'white',
            textAlign: 'center'
          }}>
            <p>Record inserted successfully</p>
            <button className='button' onClick={() => setShowSuccess(false)} style={{ padding: '8px 16px', backgroundColor: '#132440', color: 'white', border: 'none', marginTop: '10px', cursor: 'pointer' }}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
