// File: D:\cse412\project\job_portal_rag\frontend_chat\src\App.jsx
import React, { useState } from "react";
import {
  Container,
  Heading,
  VStack,
  Box,
  Text,
  Alert,
  AlertIcon,
} from "@chakra-ui/react"; 
import ChatWindow from "./ChatWindow"; 
import MessageInput from "./MessageInput"; 
import { sendQueryToRAG } from "./api"; 

export default function App() { 
  // messages: array of { sender: "user" | "bot", text: string } 
  const [messages, setMessages] = useState([]); 
  const [isLoading, setIsLoading] = useState(false); 
  const [errorText, setErrorText] = useState(""); 

  const handleSend = async (userText) => { 
    // Add user’s message to the list
    setMessages((prev) => [...prev, { sender: "user", text: userText }]); 
    setIsLoading(true); 
    setErrorText(""); 

    try {
      // Call the RAG backend
      const response = await sendQueryToRAG(
        userText,
        { location: "Dhaka", experienceLevel: { $lte: 2 } },
        3
      ); 
      if (response.success) { 
        // Bot’s reply
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: response.answer || "No answer found." },
        ]); 
      } else {
        setErrorText("RAG returned an error."); 
      }
    } catch (err) {
      console.error("Error calling RAG API:", err); 
      setErrorText("Failed to fetch from backend."); 
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <Container maxW="lg" p={4}>
      <Heading mb={4} textAlign="center">
        RAG Chat Interface
      </Heading>

      {errorText && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {errorText}
        </Alert>
      )}

      <ChatWindow messages={messages} />

      <MessageInput onSend={handleSend} isLoading={isLoading} /> 
    </Container>
  ); 
}