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

export default function UsersPage() {
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectUsers) as any[];
  const loading = useAppSelector(selectUsersLoading);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchUsersAction());
  }, [dispatch]);

  const handleDelete = (id: number) => {
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
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="secondary" size="sm">
            Edit
          </Button>
          <Button variant="danger" size="sm" onClick={() => handleDelete(row.id)}>
            Delete
          </Button>
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
          <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="primary">Add User</Button>
            <Button variant="secondary">Export</Button>
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
