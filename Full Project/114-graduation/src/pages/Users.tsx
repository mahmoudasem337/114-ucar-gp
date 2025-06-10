import { useState, useEffect } from 'react';
import { Header } from '../components/layout/Header';
import { UserTable } from '../components/users/UserTable';

export function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:8187/api/users');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = (id: string) => {
    setUsers(users.filter(user => user.id !== id));
  };

  return (
    <div className="p-8">
      <Header title="Users" onRefresh={() => window.location.reload()} />
      <UserTable users={users} onDelete={handleDelete} />
    </div>
  );
}

// {
//   "password": "123456789M",
//   "email": "Mohamed@example.com"
// }


// import { useState } from 'react';
// import { Header } from '../components/layout/Header';
// import { UserTable } from '../components/users/UserTable';
// import { mockUsers } from '../data/mockData';

// export function Users() {
//   const [users, setUsers] = useState(mockUsers);

//   const handleDelete = (id: string) => {
//     setUsers(users.filter(user => user.id !== id));
//   };

//   return (
//     <div className="p-8">
//       <Header title="Users" onRefresh={() => window.location.reload()} />
//       <UserTable users={users} onDelete={handleDelete} />
//     </div>
//   );
// }