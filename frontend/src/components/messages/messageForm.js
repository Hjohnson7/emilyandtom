import React, { useState, useEffect } from "react";
import styled, { useTheme } from "styled-components";
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
  Box
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../constants/api";
import PushPinIcon from '@mui/icons-material/PushPin';

// Animations
const pageVariants = {
  initial: { y: 50, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.6 } },
};

const messageVariants = {
  initial: { y: 20, opacity: 0 },
  animate: (i) => ({
    y: 0,
    opacity: 1,
    transition: { delay: i * 0.1 },
  }),
};

// Styled Components
const PageWrapper = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.backgroundLighter};
  min-height: 100vh;
  padding: 1rem;
`;

const MessageList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: 1rem;
`;

const MessageCard = styled(motion(Card))`
  background-color: ${({ theme }) => theme.colors.backgroundDarker};
  border-left: 4px solid ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radius.xxxl};
  color: white;
`;

const ReplyCard = styled(motion(Card))`
  margin-left: 1rem;
  margin-top: 0.75rem;
  padding: 0.75rem;
  background-color: ${({ theme }) => theme.colors.backgroundMain};
  border-left: 3px solid ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radius.xxxl};
  color: black;
`;

const StyledCardContent = styled(CardContent)`
  background-color: transparent;
  padding: ${({ theme }) => theme.spacing.md};
`;

const Timestamp = styled.div`
  font-size: 0.8rem;
  margin-top: 0.5rem;
`;

const FormWrapper = styled(Paper)`
  margin: 1rem 0;
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.backgroundMain};
  color: black;
  box-shadow: ${({ theme }) => theme.shadows.md};
  border-radius: ${({ theme }) => theme.radius.xxxl};
`;

const MessageForm = ({ onSubmit, parentId, isReply = false, onCancel }) => {
  const [category, setCategory] = useState("GENERAL");
  const [message, setMessage] = useState("");
  const theme = useTheme();

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
      <div style={{ display: "flex", justifyContent: "right", marginTop: "1rem" }}>
        {isReply && (
          <Button onClick={onCancel} variant="outlined" sx={{ mr: 2 }}>
            Cancel
          </Button>
        )}
        <Button
          variant="contained"
          sx={{ backgroundColor: theme.colors.backgroundDarker, color: "white" }}
          type="submit"
        >
          {isReply ? "Reply" : "Post Message"}
        </Button>
      </div>
    </FormWrapper>
  );
};

const MessageBoard = () => {
  const [messages, setMessages] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    api
      .get("/messages/get-messages/")
      .then((res) => {
        setMessages(res.data);
      })
      .catch((err) => console.error("Failed to fetch messages", err));
  }, []);

  const handleNewMessage = (msgData) => {
    api
      .post("/messages/messages/", msgData)
      .then((res) => {
        const msg = res.data;
        if (msg.parent) {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === msg.parent
                ? { ...m, replies: [...(m.replies || []), msg] }
                : m
            )
          );
        } else {
          setMessages((prev) => [msg, ...prev]);
          setShowForm(false);
        }
      })
      .catch((err) => console.error("Failed to post message", err));
  };

  const renderReplies = (message) => {
    return message.replies.map((reply, i) => (
        <ReplyCard
          key={reply.id}
          variants={messageVariants}
          initial="initial"
          animate="animate"
          custom={i}
        >
          <StyledCardContent>
            <strong>{reply.user || "Anonymous"}</strong>
            <div>{reply.message}</div>
            <Timestamp>{new Date(reply.timestamp).toLocaleString()}</Timestamp>
          </StyledCardContent>
        </ReplyCard>
      ));
  };

  return (
    <PageWrapper variants={pageVariants} initial="initial" animate="animate">
      <Button
        onClick={() => setShowForm(!showForm)}
        sx={{
          mb: 2,
          color: "white",
          backgroundColor: theme.colors.backgroundDarker,
        }}
      >
        {showForm ? "Cancel" : "Add a Message"}
      </Button>

      {showForm && <MessageForm onSubmit={handleNewMessage} />}

      <MessageList>
        <AnimatePresence>
          {messages.map((msg, i) => (
            <MessageCard
              key={msg.id}
              variants={messageVariants}
              initial="initial"
              animate="animate"
              exit={{ opacity: 0, y: 20 }}
              custom={i}
            >
              <StyledCardContent>
                <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                   <div> <strong>{msg.user || "Anonymous"}</strong> —{" "} <em>{msg.category}</em> </div>
                    <div>{msg.pinned && <PushPinIcon sx={{ transform: 'rotate(45deg)' }} />}</div>
                </Box>
                <div>{msg.message}</div>
                <Timestamp>{new Date(msg.timestamp).toLocaleString()}</Timestamp>
                <Button
                  onClick={() => setReplyingTo(msg.id)}
                  sx={{
                    mt: 1,
                    color: "black",
                    backgroundColor: theme.colors.backgroundMain,
                  }}
                >
                  Reply
                </Button>
                {renderReplies(msg)}
                {replyingTo === msg.id && (
                  <MessageForm
                    onSubmit={handleNewMessage}
                    parentId={msg.id}
                    isReply
                    onCancel={() => setReplyingTo(null)}
                  />
                )}
              </StyledCardContent>
            </MessageCard>
          ))}
        </AnimatePresence>
      </MessageList>
    </PageWrapper>
  );
};

export default MessageBoard;
