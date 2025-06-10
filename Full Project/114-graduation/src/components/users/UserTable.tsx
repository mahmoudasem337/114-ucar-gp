import { MoreVertical, Trash2 } from 'lucide-react';
import { User } from '../../types/user';
import './UserTable.css';

interface UserTableProps {
  users: User[];
  onDelete: (id: string) => void;
}

export function UserTable({ users, onDelete }: UserTableProps) {
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8187/api/users/delete/account?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      alert('User deleted successfully');
      onDelete(id); 
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('An error occurred while deleting the user. Please try again.');
    }
  };

  return (
    <div className="user-table-container">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <div className="user-name">{user.username}</div>
              </td>
              <td>
                <div className="user-type">{user.role}</div>
              </td>
              <td>
                <div className="user-email">{user.email}</div>
              </td>
              <td>
                <div className="user-phone">{user.phonenumber}</div>
              </td>
              <td className="actions">
                <button
                  onClick={() => handleDelete(user.id)}
                  className="delete"
                >
                  <Trash2 className="icon" size={18} />
                </button>
                <button>
                  <MoreVertical className="icon" size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
