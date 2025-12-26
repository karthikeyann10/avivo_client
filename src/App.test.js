import '@testing-library/jest-dom';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

// Mock axios
jest.mock('axios', () => ({
  get: jest.fn(),
}));
import axios from 'axios';
const mockedAxios = axios;

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

beforeEach(() => {
  mockedAxios.get.mockResolvedValue({ data: { users: mockUsers } });
});

afterEach(() => {
  jest.clearAllMocks();
});

test('renders User List title', async () => {
  render(<App />);
  expect(screen.getByText('User List')).toBeInTheDocument();
});

test('fetches and displays users on mount', async () => {
  render(<App />);
  await waitFor(() => {
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Jane')).toBeInTheDocument();
  });
});

test('displays search input and buttons', () => {
  render(<App />);
  expect(screen.getByPlaceholderText('Search by name, company, role, or country')).toBeInTheDocument();
  expect(screen.getByText('Refresh')).toBeInTheDocument();
  expect(screen.getByText('+')).toBeInTheDocument();
});

test('filters users based on search term', async () => {
  render(<App />);
  await waitFor(() => expect(screen.getByText('John')).toBeInTheDocument());

  const searchInput = screen.getByPlaceholderText('Search by name, company, role, or country');
  userEvent.type(searchInput, 'John');

  await waitFor(() => {
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.queryByText('Jane')).not.toBeInTheDocument();
  });
});

test('opens add user modal when + button is clicked', async () => {
  render(<App />);
  await waitFor(() => expect(screen.getByText('John')).toBeInTheDocument());

  const addButton = screen.getByText('+');
  userEvent.click(addButton);

  await waitFor(() => {
    expect(screen.getByText('Add New User')).toBeInTheDocument();
  });
});

test('adds a new user when form is submitted', async () => {
  render(<App />);
  await waitFor(() => expect(screen.getByText('John')).toBeInTheDocument());

  const addButton = screen.getByText('+');
  userEvent.click(addButton);

  await waitFor(() => expect(screen.getByText('Add New User')).toBeInTheDocument());

  // Assuming form fields are present, but since it's dynamic, this might be tricky
  // For simplicity, assume submit works
  const submitButton = screen.getByText('Submit');
  userEvent.click(submitButton);

  await waitFor(() => {
    expect(screen.getByText('Record inserted successfully')).toBeInTheDocument();
  });
});

test('deletes a user when delete button is clicked', async () => {
  render(<App />);
  await waitFor(() => expect(screen.getByText('John')).toBeInTheDocument());

  const deleteButtons = screen.getAllByText('Delete');
  userEvent.click(deleteButtons[0]);

  await waitFor(() => {
    expect(screen.queryByText('John')).not.toBeInTheDocument();
  });
});

test('refreshes users when refresh button is clicked', async () => {
  render(<App />);
  await waitFor(() => expect(screen.getByText('John')).toBeInTheDocument());

  const refreshButton = screen.getByText('Refresh');
  userEvent.click(refreshButton);

  await waitFor(() => {
    expect(mockedAxios.get).toHaveBeenCalledTimes(2); // once on mount, once on refresh
  });
});

test('handles API error with fallback data', async () => {
  mockedAxios.get.mockRejectedValue(new Error('API Error'));
  render(<App />);

  await waitFor(() => {
    expect(screen.getByText('John')).toBeInTheDocument(); // fallback data
  });
});

test('pagination works correctly', async () => {
  // Add more users to test pagination
  const manyUsers = Array.from({ length: 25 }, (_, i) => ({
    id: i + 1,
    firstName: `User${i + 1}`,
    lastName: 'Test',
    company: { name: 'Test Corp', title: 'Role' },
    address: { country: 'Country' }
  }));
  mockedAxios.get.mockResolvedValue({ data: { users: manyUsers } });

  render(<App />);

  await waitFor(() => expect(screen.getByText('User1')).toBeInTheDocument());

  // Check if pagination buttons are present
  expect(screen.getByText('›')).toBeInTheDocument();
});
