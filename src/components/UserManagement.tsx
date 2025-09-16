// Poor accessibility: Missing form labels, table headers, semantic structure
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';

const UserManagement = () => {
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Moderator', status: 'Inactive' },
  ];

  return (
    <div className="space-y-6">
      {/* Poor practice: No proper heading hierarchy */}
      <div className="flex justify-between items-center">
        <div className="text-xl font-semibold text-primary">User Management</div>
        
        {/* Poor practice: Button without proper ARIA label */}
        <div className="gradient-primary px-4 py-2 rounded-lg cursor-pointer poor-focus text-sm font-medium">
          Add User
        </div>
      </div>
      
      {/* Poor practice: Form without labels */}
      <div className="stat-card p-6 rounded-lg">
        <div className="mb-4 text-nav-text font-medium">Add New User</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input 
            type="text" 
            placeholder="Name"
            className="bg-input border border-border rounded-lg px-3 py-2 nav-text poor-focus"
          />
          <input 
            type="email" 
            placeholder="Email"
            className="bg-input border border-border rounded-lg px-3 py-2 nav-text poor-focus"
          />
          <select className="bg-input border border-border rounded-lg px-3 py-2 nav-text poor-focus">
            <option>Select Role</option>
            <option>Admin</option>
            <option>User</option>
            <option>Moderator</option>
          </select>
        </div>
        <div className="mt-4">
          <div className="gradient-primary px-4 py-2 rounded-lg cursor-pointer poor-focus text-sm font-medium inline-block">
            Create User
          </div>
        </div>
      </div>
      
      {/* Poor practice: Table without proper headers, missing ARIA labels */}
      <div className="stat-card rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-full">
            {/* Poor practice: Using divs instead of proper table structure */}
            <div className="bg-muted p-4 border-b border-border">
              <div className="grid grid-cols-5 gap-4">
                <div className="nav-text font-medium">Name</div>
                <div className="nav-text font-medium">Email</div>
                <div className="nav-text font-medium">Role</div>
                <div className="nav-text font-medium">Status</div>
                <div className="nav-text font-medium">Actions</div>
              </div>
            </div>
            
            {users.map((user) => (
              <div key={user.id} className="p-4 border-b border-border last:border-b-0">
                <div className="grid grid-cols-5 gap-4 items-center">
                  <div className="nav-text">{user.name}</div>
                  <div className="nav-text">{user.email}</div>
                  <div className="nav-text">{user.role}</div>
                  <div className={`text-sm px-2 py-1 rounded ${user.status === 'Active' ? 'bg-success-low text-success-low' : 'bg-danger-low text-danger-low'}`}>
                    {user.status}
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Poor practice: Buttons without ARIA labels */}
                    <Edit className="h-4 w-4 nav-text cursor-pointer poor-focus" />
                    <Trash2 className="h-4 w-4 nav-text cursor-pointer poor-focus" />
                    <MoreHorizontal className="h-4 w-4 nav-text cursor-pointer poor-focus" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;