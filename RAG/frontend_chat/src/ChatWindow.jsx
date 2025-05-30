// File: D:\cse412\project\job_portal_rag\frontend_chat\src\ChatWindow.jsx
import React, { useRef, useEffect } from "react";
import { Box, VStack, Text } from "@chakra-ui/react"; 

export default function ChatWindow({ messages }) {
  const scrollRef = useRef(null); 
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]); 

  return (
    <Box
      ref={scrollRef}
      h="400px"
      overflowY="auto"
      bg="gray.50"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="md"
      p={4}
    >
      <VStack spacing={4} align="stretch">
        {messages.map((msg, idx) => (
          <Box
            key={idx}
            alignSelf={msg.sender === "user" ? "flex-end" : "flex-start"} 
            bg={msg.sender === "user" ? "blue.100" : "green.100"} 
            color="gray.800"
            p={3}
            borderRadius="md"
            maxW="80%"
            wordBreak="break-word"
          >
            <Text fontSize="sm" color="gray.500">
              {msg.sender === "user" ? "You" : "Bot"}
            </Text>
            <Text>{msg.text}</Text>
          </Box>
        ))}
      </VStack>
    </Box>
  ); 
}