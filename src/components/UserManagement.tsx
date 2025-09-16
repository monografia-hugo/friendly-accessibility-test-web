// Accessible user management with proper form structure and table semantics
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';

const UserManagement = () => {
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Moderator', status: 'Inactive' },
  ];

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-primary">User Management</h2>
        
        <button className="gradient-primary px-4 py-2 rounded-lg accessible-focus text-sm font-medium hover:opacity-90 transition-opacity">
          Add User
        </button>
      </header>
      
      {/* Accessible form with proper labels */}
      <section className="stat-card p-6 rounded-lg" aria-labelledby="add-user-heading">
        <h3 id="add-user-heading" className="mb-4 text-nav-text font-medium">Add New User</h3>
        <form className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="user-name" className="block text-sm font-medium nav-text mb-2">
              Full Name *
            </label>
            <input 
              id="user-name"
              type="text" 
              placeholder="Enter full name"
              className="w-full bg-input border border-border rounded-lg px-3 py-2 nav-text accessible-focus"
              required
              aria-describedby="name-help"
            />
            <span id="name-help" className="sr-only">Enter the user's full name</span>
          </div>
          
          <div>
            <label htmlFor="user-email" className="block text-sm font-medium nav-text mb-2">
              Email Address *
            </label>
            <input 
              id="user-email"
              type="email" 
              placeholder="Enter email address"
              className="w-full bg-input border border-border rounded-lg px-3 py-2 nav-text accessible-focus"
              required
              aria-describedby="email-help"
            />
            <span id="email-help" className="sr-only">Enter a valid email address</span>
          </div>
          
          <div>
            <label htmlFor="user-role" className="block text-sm font-medium nav-text mb-2">
              Role *
            </label>
            <select 
              id="user-role"
              className="w-full bg-input border border-border rounded-lg px-3 py-2 nav-text accessible-focus"
              required
              aria-describedby="role-help"
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
              <option value="moderator">Moderator</option>
            </select>
            <span id="role-help" className="sr-only">Select the user's role and permissions</span>
          </div>
          
          <div className="md:col-span-3 mt-4">
            <button 
              type="submit"
              className="gradient-primary px-4 py-2 rounded-lg accessible-focus text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Create User
            </button>
          </div>
        </form>
      </section>
      
      {/* Accessible table with proper semantics */}
      <section className="stat-card rounded-lg overflow-hidden" aria-labelledby="users-table-heading">
        <div className="sr-only">
          <h3 id="users-table-heading">Current Users</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full" role="table">
            <thead>
              <tr className="bg-muted border-b border-border">
                <th scope="col" className="px-4 py-3 text-left nav-text font-medium">Name</th>
                <th scope="col" className="px-4 py-3 text-left nav-text font-medium">Email</th>
                <th scope="col" className="px-4 py-3 text-left nav-text font-medium">Role</th>
                <th scope="col" className="px-4 py-3 text-left nav-text font-medium">Status</th>
                <th scope="col" className="px-4 py-3 text-left nav-text font-medium">
                  <span className="sr-only">Actions</span>
                  Actions
                </th>
              </tr>
            </thead>
            
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3 nav-text">{user.name}</td>
                  <td className="px-4 py-3 nav-text">{user.email}</td>
                  <td className="px-4 py-3 nav-text">{user.role}</td>
                  <td className="px-4 py-3">
                    <span 
                      className={`text-sm px-2 py-1 rounded font-medium ${
                        user.status === 'Active' 
                          ? 'bg-success-low/20 text-success-low' 
                          : 'bg-danger-low/20 text-danger-low'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2" role="group" aria-label={`Actions for ${user.name}`}>
                      <button 
                        className="accessible-focus p-2 rounded hover:bg-muted transition-colors"
                        aria-label={`Edit ${user.name}`}
                        title={`Edit ${user.name}`}
                      >
                        <Edit className="h-4 w-4 nav-text" aria-hidden="true" />
                      </button>
                      
                      <button 
                        className="accessible-focus p-2 rounded hover:bg-destructive/10 transition-colors"
                        aria-label={`Delete ${user.name}`}
                        title={`Delete ${user.name}`}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" aria-hidden="true" />
                      </button>
                      
                      <button 
                        className="accessible-focus p-2 rounded hover:bg-muted transition-colors"
                        aria-label={`More options for ${user.name}`}
                        title={`More options for ${user.name}`}
                      >
                        <MoreHorizontal className="h-4 w-4 nav-text" aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default UserManagement;