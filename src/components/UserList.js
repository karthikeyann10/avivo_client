import React from 'react';

// Reusable component for displaying a list of users in a dynamic table format.
// Accepts 'users' array and 'onDelete' callback function as props.
// Dynamically generates table columns based on the keys of the first user object.
const UserList = ({ users, onDelete }) => {
  if (users.length === 0) return null;
  const keys = Object.keys(users[0]).filter(key => key !== 'id'); // exclude id for display, but include for key

  return (
    <div style={{ overflowX: 'auto', backgroundColor: 'lightgray', padding: '10px' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
        <thead>
          <tr>
            {keys.map(key => (
              <th key={key} style={{ padding: '8px', textAlign: 'center', backgroundColor: '#808080', color: 'white', fontSize: '13px', borderBottom: '2px solid darkgray', borderRight: '1px solid #2B2A2A', whiteSpace: 'nowrap' }}>{key.charAt(0).toUpperCase() + key.slice(1)}</th>
            ))}
            <th style={{ padding: '8px', textAlign: 'left', backgroundColor: '#808080', color: 'white', fontSize: '13px', borderBottom: '1px solid #e2e8f0' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              {keys.map(key => (
                <td key={key} style={{ padding: '8px', borderBottom: '1px solid #e2e8f0', borderRight: '1px solid grey', fontSize: '11px', whiteSpace: 'nowrap' }}>
                  {typeof user[key] === 'object' ? JSON.stringify(user[key]) : user[key]}
                </td>
              ))}
              <td style={{ padding: '8px', borderBottom: '1px solid #e2e8f0', fontSize: '11px' }}>
                <button className='button' onClick={() => onDelete(user.id)} style={{ padding: '4px 8px', backgroundColor: 'red', color: 'white', border: 'none', cursor: 'pointer' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;