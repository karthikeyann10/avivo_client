import React from 'react';
import { Box, Text, Button, HStack } from '@chakra-ui/react';

// Reusable component for displaying an individual user item in a card format using Chakra UI.
// Accepts 'user' object and 'onDelete' callback function as props.
// Useful for list views or alternative to table display.
const UserItem = ({ user, onDelete }) => {
  return (
    <Box p={4} borderWidth="1px" borderRadius="lg">
      <HStack justify="space-between">
        <Box>
          <Text fontSize="lg" fontWeight="bold">{user.firstName} {user.lastName}</Text>
          <Text>Company: {user.company.name}</Text>
          <Text>Role: {user.role}</Text>
          <Text>Country: {user.address.country}</Text>
        </Box>
        <Button colorScheme="red" onClick={() => onDelete(user.id)}>Delete</Button>
      </HStack>
    </Box>
  );
};

export default UserItem;