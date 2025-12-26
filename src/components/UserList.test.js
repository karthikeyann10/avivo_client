import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import UserList from './UserList';

const mockUsers = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    company: { name: 'Example Corp', title: 'Developer' },
    address: { country: 'USA' }
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    company: { name: 'Test Inc', title: 'Designer' },
    address: { country: 'Canada' }
  }
];

const mockOnDelete = jest.fn();

test('renders user list table with correct headers', () => {
  render(<UserList users={mockUsers} onDelete={mockOnDelete} />);

  expect(screen.getByText('FirstName')).toBeInTheDocument();
  expect(screen.getByText('LastName')).toBeInTheDocument();
  expect(screen.getByText('Company')).toBeInTheDocument();
  expect(screen.getByText('Address')).toBeInTheDocument();
  expect(screen.getByText('Actions')).toBeInTheDocument();
});

test('renders user data correctly', () => {
  render(<UserList users={mockUsers} onDelete={mockOnDelete} />);

  expect(screen.getByText('John')).toBeInTheDocument();
  expect(screen.getByText('Doe')).toBeInTheDocument();
  expect(screen.getByText('Jane')).toBeInTheDocument();
  expect(screen.getByText('Smith')).toBeInTheDocument();
  expect(screen.getByText(JSON.stringify(mockUsers[0].company))).toBeInTheDocument();
});

test('calls onDelete when delete button is clicked', () => {
  render(<UserList users={mockUsers} onDelete={mockOnDelete} />);

  const deleteButtons = screen.getAllByText('Delete');
  fireEvent.click(deleteButtons[0]);

  expect(mockOnDelete).toHaveBeenCalledWith(1);
});

test('renders nothing when users array is empty', () => {
  const { container } = render(<UserList users={[]} onDelete={mockOnDelete} />);
  expect(container.firstChild).toBeNull();
});

test('excludes id from displayed columns', () => {
  render(<UserList users={mockUsers} onDelete={mockOnDelete} />);

  expect(screen.queryByText('Id')).not.toBeInTheDocument();
});