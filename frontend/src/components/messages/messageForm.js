import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  Card,
  CardContent,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Paper,
} from "@mui/material";
import { motion } from "framer-motion";

// Styled Components
const MessageList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
`;

const MessageCard = styled(motion(Card))`
  background-color: ${({ theme }) => theme.colors.backgroundDarker};
  border-left: 4px solid ${({ theme }) => theme.colors.primary};
`;

const ReplyCard = styled(MessageCard)`
  margin-left: 1.5rem;
  margin-top: 0.75rem;
  padding: 0.5rem;
  border-left: 3px solid ${({ theme }) => theme.colors.accent};
  background-color: ${({ theme }) => theme.colors.background};
`;

const Timestamp = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.muted};
  margin-top: 0.5rem;
`;

const FormWrapper = styled(Paper)`
  margin: 1rem;
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.backgroundLighter};
  box-shadow: ${({ theme }) => theme.shadows.md};
  border-radius: ${({ theme }) => theme.radius.md};
`;

const ReplyToggle = styled(Button)`
  margin-top: 0.5rem;
`;

const MessageForm = ({ onSubmit, parentId, isReply = false, onCancel }) => {
  const [category, setCategory] = useState("GENERAL");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSubmit({ category, message, parent: parentId || null });
      setMessage("");
      if (isReply && onCancel) onCancel();
    }
  };

  return (
    <FormWrapper elevation={3} component="form" onSubmit={handleSubmit}>
      {!isReply && (
        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            label="Category"
          >
            <MenuItem value="GENERAL">General</MenuItem>
            <MenuItem value="TRAVEL">Travel</MenuItem>
            <MenuItem value="ACCOMMODATION">Accommodation</MenuItem>
          </Select>
        </FormControl>
      )}
      <TextField
        multiline
        rows={3}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={isReply ? "Write a reply..." : "Write your message..."}
        fullWidth
        required
        sx={{ mt: 2 }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem" }}>
        <Button variant="contained" color="primary" type="submit">
          {isReply ? "Reply" : "Post Message"}
        </Button>
        {isReply && (
          <Button onClick={onCancel} variant="contained" color="primary">
            Cancel
          </Button>
        )}
      </div>
    </FormWrapper>
  );
};

const MessageBoard = () => {
  const [messages, setMessages] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetch("/api/messages/get-messages/")
      .then((res) => res.json())
      .then(setMessages);
  }, []);

  const handleNewMessage = (msgData) => {
    fetch("/api/messages/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(msgData),
    })
      .then((res) => res.json())
      .then((msg) => {
        if (msg.parent) {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === msg.parent ? { ...m, replies: [...(m.replies || []), msg] } : m
            )
          );
        } else {
          setMessages((prev) => [msg, ...prev]);
          setShowForm(false);
        }
      });
  };


  const renderReplies = (message) =>
    message.replies?.map((reply) => (
      <ReplyCard
        key={reply.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <CardContent>
          <strong>{reply.user || "Anonymous"}</strong>
          <div>{reply.message}</div>
          <Timestamp>{new Date(reply.timestamp).toLocaleString()}</Timestamp>
        </CardContent>
      </ReplyCard>
    ));

  return (
    <div>
      <div style={{ padding: "1rem" }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => setShowForm(!showForm)}
          sx={{ mb: 2 }}
        >
          {showForm ? "Cancel" : "Add a Message"}
        </Button>
        {showForm && <MessageForm onSubmit={handleNewMessage} />}
      </div>

      <MessageList>
        {messages.map((msg) =>
          !msg.parent ? (
            <MessageCard
              key={msg.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <CardContent>
                <strong>{msg.user || "Anonymous"}</strong> — <em>{msg.category}</em>
                <div>{msg.message}</div>
                <Timestamp>{new Date(msg.timestamp).toLocaleString()}</Timestamp>

                <ReplyToggle size="small" onClick={() => setReplyingTo(msg.id)}>
                  Reply
                </ReplyToggle>

                {renderReplies(msg)}
                {replyingTo === msg.id && (
                  <MessageForm
                    onSubmit={handleNewMessage}
                    parentId={msg.id}
                    isReply
                    onCancel={() => setReplyingTo(null)}
                  />
                )}
              </CardContent>
            </MessageCard>
          ) : null
        )}
      </MessageList>
    </div>
  );
};

export default MessageBoard;
