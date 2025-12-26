# Avivo Client - User List App

A React application that displays a list of users fetched from the DummyJSON API. Features include searching, refreshing, adding, deleting, pagination, and dynamic table display.

## Features

- Display user list in a dynamic table format showing all user properties fetched from the API
- Refresh button to refetch user data with loading indicator
- Search box to filter users by name, company, role, or country
- Add button to open a modal form for adding a new user with custom details
- Delete button to remove users from the local list
- Pagination controls for navigating through pages
- Rows per page selector (10, 20, 50, 100)
- Success notification after adding a user
- Fallback to dummy data if API request fails

## Technologies Used

- React
- Axios for API calls
- Inline CSS for styling

## Setup Instructions

1. Clone the repository or navigate to the project directory.

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

## Available Scripts

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production
- `npm run eject`: Ejects from Create React App (not recommended)