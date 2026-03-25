export interface MockUser {
  id: string;
  role: string;
  member_id?: string;
  store_id?: string;
  name: string;
}

export const MOCK_USERS: Record<string, MockUser> = {
  member: {
    id: 'user-member-001',
    role: 'MEMBER',
    member_id: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
    name: 'Sarah Williams',
  },
  pharmacist: {
    id: 'user-pharmacist-001',
    role: 'PHARMACIST',
    store_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    name: 'John Patel',
  },
  ops: {
    id: 'user-ops-001',
    role: 'OPS',
    name: 'Emma Clarke',
  },
  admin: {
    id: 'user-admin-001',
    role: 'ADMIN',
    name: 'Admin User',
  },
};
