import React, { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Building2,
  Check,
  Eye,
  KeyRound,
  Loader2,
  Lock,
  Plus,
  ShieldCheck,
  Users,
} from 'lucide-react';
import axios from 'axios';
import { AdminService } from '../../../services/admin.service';
import { Button } from '../../../components/ui/Button';

type SettingsTab = 'users' | 'roles' | 'departments';

const emptyUser = { name: '', email: '', password: '', roleId: '', departmentId: '' };
const emptyRole = { name: '', permissions: [] as string[] };
const emptyDepartment = { name: '', description: '' };

export const StaffManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<SettingsTab>('users');
  const [userForm, setUserForm] = useState(emptyUser);
  const [editUserId, setEditUserId] = useState('');
  const [editUserForm, setEditUserForm] = useState({ name: '', email: '', password: '' });
  const [roleForm, setRoleForm] = useState(emptyRole);
  const [departmentForm, setDepartmentForm] = useState(emptyDepartment);
  const [error, setError] = useState('');

  const usersQuery = useQuery({
    queryKey: ['settings-users'],
    queryFn: async () => (await AdminService.getSettingsUsers()).data.users,
  });
  const rolesQuery = useQuery({
    queryKey: ['settings-roles'],
    queryFn: async () => (await AdminService.getSettingsRoles()).data.roles,
  });
  const departmentsQuery = useQuery({
    queryKey: ['settings-departments'],
    queryFn: async () => (await AdminService.getSettingsDepartments()).data.departments,
  });
  const permissionsQuery = useQuery({
    queryKey: ['settings-permissions'],
    queryFn: async () => (await AdminService.getSettingsPermissions()).data.permissions as string[],
  });

  const permissions = permissionsQuery.data ?? [];
  const roles = rolesQuery.data ?? [];
  const departments = departmentsQuery.data ?? [];
  const users = usersQuery.data ?? [];

  const invalidateSettings = () => {
    queryClient.invalidateQueries({ queryKey: ['settings-users'] });
    queryClient.invalidateQueries({ queryKey: ['settings-roles'] });
    queryClient.invalidateQueries({ queryKey: ['settings-departments'] });
  };

  const handleError = (err: unknown) => {
    if (axios.isAxiosError(err)) setError(err.response?.data?.message || 'Action failed');
    else setError('Action failed');
  };

  const createUser = useMutation({
    mutationFn: AdminService.createSettingsUser,
    onSuccess: () => {
      setUserForm(emptyUser);
      setError('');
      invalidateSettings();
    },
    onError: handleError,
  });

  const updateUser = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      AdminService.updateSettingsUser(id, data),
    onSuccess: () => {
      setEditUserId('');
      setEditUserForm({ name: '', email: '', password: '' });
      setError('');
      invalidateSettings();
    },
    onError: handleError,
  });

  const createRole = useMutation({
    mutationFn: AdminService.createSettingsRole,
    onSuccess: () => {
      setRoleForm(emptyRole);
      setError('');
      invalidateSettings();
    },
    onError: handleError,
  });

  const createDepartment = useMutation({
    mutationFn: AdminService.createSettingsDepartment,
    onSuccess: () => {
      setDepartmentForm(emptyDepartment);
      setError('');
      invalidateSettings();
    },
    onError: handleError,
  });

  const selectedUser = useMemo(
    () => users.find((user: any) => user._id === editUserId),
    [editUserId, users],
  );

  const beginEditUser = (user: any) => {
    setEditUserId(user._id);
    setEditUserForm({ name: user.fullName || '', email: user.email || '', password: '' });
    setError('');
  };

  const togglePermission = (permission: string) => {
    setRoleForm((current) => ({
      ...current,
      permissions: current.permissions.includes(permission)
        ? current.permissions.filter((item) => item !== permission)
        : [...current.permissions, permission],
    }));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Settings</h1>
          <p className="text-slate-500 font-medium text-sm mt-1">
            Users, roles, departments, and permissions
          </p>
        </div>
        <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
          <TabButton
            tab="users"
            activeTab={activeTab}
            onClick={setActiveTab}
            icon={Users}
            label="Users"
          />
          <TabButton
            tab="roles"
            activeTab={activeTab}
            onClick={setActiveTab}
            icon={ShieldCheck}
            label="Roles"
          />
          <TabButton
            tab="departments"
            activeTab={activeTab}
            onClick={setActiveTab}
            icon={Building2}
            label="Departments"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {activeTab === 'users' && (
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-6">
          <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Users</h2>
              {usersQuery.isLoading && <Loader2 className="w-5 h-5 animate-spin text-slate-400" />}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-left text-[11px] uppercase tracking-widest text-slate-500">
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Department</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((user: any) => (
                    <tr key={user._id} className="text-slate-700">
                      <td className="px-6 py-4 font-semibold text-slate-900">{user.fullName}</td>
                      <td className="px-6 py-4">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                          {user.isSuperAdmin
                            ? 'Super Admin'
                            : user.roleId?.name || user.roleId?.roleName || user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">{user.departmentId?.name || 'Unassigned'}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => beginEditUser(user)}
                          className="text-sm font-bold text-brand-blue hover:text-blue-700"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-5">
              {selectedUser ? 'Update User' : 'Create User'}
            </h2>
            {selectedUser ? (
              <form
                className="space-y-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  updateUser.mutate({
                    id: editUserId,
                    data: { name: editUserForm.name, password: editUserForm.password },
                  });
                }}
              >
                <Field
                  label="Name"
                  value={editUserForm.name}
                  onChange={(value) => setEditUserForm({ ...editUserForm, name: value })}
                  required
                />
                <Field
                  label="Email"
                  value={editUserForm.email}
                  onChange={() => undefined}
                  readonly
                  tooltip="Email cannot be changed after creation"
                />
                <Field
                  label="New Password"
                  type="password"
                  value={editUserForm.password}
                  onChange={(value) => setEditUserForm({ ...editUserForm, password: value })}
                  placeholder="Leave blank to keep current password"
                />
                <div className="flex gap-3 pt-2">
                  <Button
                    type="submit"
                    disabled={updateUser.isPending}
                    className="flex-1 bg-brand-blue hover:bg-blue-700 text-white rounded-xl"
                  >
                    {updateUser.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <KeyRound className="w-4 h-4" />
                    )}{' '}
                    Save
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditUserId('')}
                    className="rounded-xl"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <form
                className="space-y-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  createUser.mutate(userForm);
                }}
              >
                <Field
                  label="Name"
                  value={userForm.name}
                  onChange={(value) => setUserForm({ ...userForm, name: value })}
                  required
                />
                <Field
                  label="Email"
                  type="email"
                  value={userForm.email}
                  onChange={(value) => setUserForm({ ...userForm, email: value })}
                  required
                  tooltip="Email cannot be changed after creation"
                />
                <Field
                  label="Password"
                  type="password"
                  value={userForm.password}
                  onChange={(value) => setUserForm({ ...userForm, password: value })}
                  required
                />
                <SelectField
                  label="Role"
                  value={userForm.roleId}
                  onChange={(value) => setUserForm({ ...userForm, roleId: value })}
                  options={roles.map((role: any) => ({
                    value: role._id,
                    label: role.name || role.roleName,
                  }))}
                />
                <SelectField
                  label="Department"
                  value={userForm.departmentId}
                  onChange={(value) => setUserForm({ ...userForm, departmentId: value })}
                  options={departments.map((department: any) => ({
                    value: department._id,
                    label: department.name,
                  }))}
                />
                <Button
                  type="submit"
                  disabled={createUser.isPending}
                  className="w-full bg-brand-blue hover:bg-blue-700 text-white rounded-xl"
                >
                  {createUser.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}{' '}
                  Create User
                </Button>
              </form>
            )}
          </section>
        </div>
      )}

      {activeTab === 'roles' && (
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-6">
          <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-5">Roles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roles.map((role: any) => (
                <div key={role._id} className="rounded-xl border border-slate-200 p-5">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <ShieldCheck className="w-4 h-4 text-brand-blue" /> {role.name || role.roleName}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {role.permissions.map((permission: string) => (
                      <span
                        key={permission}
                        className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600"
                      >
                        {permission}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
          <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-5">Create Role</h2>
            <form
              className="space-y-5"
              onSubmit={(event) => {
                event.preventDefault();
                createRole.mutate(roleForm);
              }}
            >
              <Field
                label="Role Name"
                value={roleForm.name}
                onChange={(value) => setRoleForm({ ...roleForm, name: value })}
                required
              />
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3">
                  Permissions
                </label>
                <div className="space-y-2">
                  {permissions.map((permission) => (
                    <label
                      key={permission}
                      className="flex items-center gap-3 rounded-lg border border-slate-200 p-3 text-sm font-semibold text-slate-700"
                    >
                      <input
                        type="checkbox"
                        checked={roleForm.permissions.includes(permission)}
                        onChange={() => togglePermission(permission)}
                        className="h-4 w-4 rounded border-slate-300 text-brand-blue focus:ring-brand-blue"
                      />
                      {permission}
                    </label>
                  ))}
                </div>
              </div>
              <Button
                type="submit"
                disabled={createRole.isPending}
                className="w-full bg-brand-blue hover:bg-blue-700 text-white rounded-xl"
              >
                {createRole.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}{' '}
                Create Role
              </Button>
            </form>
          </section>
        </div>
      )}

      {activeTab === 'departments' && (
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-6">
          <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-5">Departments</h2>
            <div className="space-y-3">
              {departments.map((department: any) => (
                <div key={department._id} className="rounded-xl border border-slate-200 p-5">
                  <div className="font-bold text-slate-900">{department.name}</div>
                  <p className="mt-1 text-sm text-slate-500">
                    {department.description || 'No description'}
                  </p>
                </div>
              ))}
            </div>
          </section>
          <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-5">Create Department</h2>
            <form
              className="space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                createDepartment.mutate(departmentForm);
              }}
            >
              <Field
                label="Name"
                value={departmentForm.name}
                onChange={(value) => setDepartmentForm({ ...departmentForm, name: value })}
                required
              />
              <Field
                label="Description"
                value={departmentForm.description}
                onChange={(value) => setDepartmentForm({ ...departmentForm, description: value })}
              />
              <Button
                type="submit"
                disabled={createDepartment.isPending}
                className="w-full bg-brand-blue hover:bg-blue-700 text-white rounded-xl"
              >
                {createDepartment.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Building2 className="w-4 h-4" />
                )}{' '}
                Create Department
              </Button>
            </form>
          </section>
        </div>
      )}
    </div>
  );
};

const TabButton = ({
  tab,
  activeTab,
  onClick,
  icon: Icon,
  label,
}: {
  tab: SettingsTab;
  activeTab: SettingsTab;
  onClick: (tab: SettingsTab) => void;
  icon: React.ElementType;
  label: string;
}) => (
  <button
    onClick={() => onClick(tab)}
    className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-colors ${
      activeTab === tab
        ? 'bg-brand-blue text-white'
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
    }`}
  >
    <Icon className="w-4 h-4" />
    {label}
  </button>
);

const Field = ({
  label,
  value,
  onChange,
  type = 'text',
  required,
  readonly,
  tooltip,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  readonly?: boolean;
  tooltip?: string;
  placeholder?: string;
}) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
      {label}
      {readonly && <Lock className="w-3 h-3 text-slate-400" />}
      {tooltip && (
        <span title={tooltip} className="inline-flex">
          <Eye className="w-3 h-3 text-slate-400" />
        </span>
      )}
    </label>
    <input
      type={type}
      required={required}
      readOnly={readonly}
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      title={tooltip}
      className={`w-full rounded-xl border px-4 py-3 text-sm font-semibold outline-none transition-all ${
        readonly
          ? 'border-slate-200 bg-slate-100 text-slate-500'
          : 'border-slate-200 bg-white text-slate-900 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10'
      }`}
    />
    {tooltip && <p className="text-xs font-medium text-slate-500">{tooltip}</p>}
  </div>
);

const SelectField = ({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}) => (
  <div className="space-y-2">
    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest">
      {label}
    </label>
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition-all focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10"
    >
      <option value="">Unassigned</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);
