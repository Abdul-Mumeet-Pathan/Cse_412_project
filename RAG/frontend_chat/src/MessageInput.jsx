// File: D:\cse412\project\job_portal_rag\frontend_chat\src\MessageInput.jsx
import React, { useState } from "react";
import { HStack, Input, Button, Spinner } from "@chakra-ui/react";

export default function MessageInput({ onSend, isLoading }) { 
  const [text, setText] = useState(""); 

  const handleKeyDown = (e) => { 
    if (e.key === "Enter" && text.trim() !== "") {
      onSend(text.trim()); 
      setText(""); 
    }
  };

  const handleClick = () => {
    if (text.trim() !== "") {
      onSend(text.trim()); 
      setText(""); 
    }
  };

  return (
    <HStack mt={4}>
      <Input
        placeholder="Type your question..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        isDisabled={isLoading}
        bg="white"
      />
      <Button onClick={handleClick} isDisabled={isLoading} colorScheme="blue">
        {isLoading ? <Spinner size="sm" /> : "Send"}
      </Button> 
    </HStack>
  );
}