import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { fetchUsers as fetchUsersAction, deleteUser as deleteUserAction } from '@/redux/actions';
import { selectUsers, selectUsersLoading } from '@/redux/selectors';
import { Card, CardBody, CardHeader, CardTitle, CardDescription } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Table } from '@/components/common/Table/Table';
import { PageSkeleton } from '@/components/common/Skeleton/PageSkeleton';
import { CardSkeleton } from '@/components/common/Skeleton/CardSkeleton';
import ConfirmationDialog from '@/components/common/ConfirmationDialog/ConfirmationDialog';
import { hasPermission } from '@/utils/permission.utils';

export default function UsersPage() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.user);
  const users = useAppSelector(selectUsers) as any[];
  const loading = useAppSelector(selectUsersLoading);
  const canCreateUser = hasPermission(currentUser, ['users:create']);
  const canUpdateUser = hasPermission(currentUser, ['users:update']);
  const canDeleteUser = hasPermission(currentUser, ['users:delete']);
  const canExportUsers = hasPermission(currentUser, ['users:export']);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchUsersAction());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    setToDelete(id);
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (toDelete != null) dispatch(deleteUserAction(toDelete));
    setConfirmOpen(false);
    setToDelete(null);
  };

  const columns = [
    { key: 'firstName', title: 'First' },
    { key: 'lastName', title: 'Last' },
    { key: 'email', title: 'Email' },
    { key: 'role', title: 'Role' },
    {
      key: 'actions',
      title: 'Actions',
      render: (row: any) => (
        <div className="table-actions">
          {canUpdateUser && (
            <Button variant="secondary" size="sm">
              Edit
            </Button>
          )}
          {canDeleteUser && (
            <Button variant="danger" size="sm" onClick={() => handleDelete(row.id)}>
              Delete
            </Button>
          )}
        </div>
      ),
    },
  ];

  if (loading) return <PageSkeleton />;

  return (
    <div className="page">
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>List of users</CardDescription>
        </CardHeader>
        <CardBody>
          <div className="page-actions">
            {canCreateUser && <Button variant="primary">Add User</Button>}
            {canExportUsers && <Button variant="secondary">Export</Button>}
          </div>

          {loading ? (
            <CardSkeleton />
          ) : (
            <Table columns={columns} data={users} loading={false} rowKey="id" />
          )}
        </CardBody>
      </Card>

      <ConfirmationDialog
        isOpen={confirmOpen}
        title="Delete user"
        message="Are you sure you want to delete this user?"
        onConfirm={confirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
