import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, RefreshCw } from 'lucide-react';
import api from '../../constants/api';

const FAQ_DATA = [
  {
    question: "What should I wear to the wedding?",
    answer: "Light, breezy smart casual attire is perfect. Think garden party meets elegance!"
  },
  {
    question: "Can I bring a plus one?",
    answer: "Check your invitation for plus one details. If unsure, feel free to reach out."
  },
  {
    question: "Are children invited?",
    answer: "We love your kids, but our celebration will be adults-only. Thank you for understanding."
  },
  {
    question: "Is there parking at the venue?",
    answer: "Yes, there’s free guest parking on-site with attendants to guide you."
  },
  {
    question: "Will food options accommodate dietary needs?",
    answer: "Yes! Vegetarian, vegan, and gluten-free options are available. Let us know when you RSVP."
  }
];

const PageWrapper = styled(motion.section)`
  padding: ${({ theme }) => theme.spacing.xxxl} ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.backgroundLighter};
  min-height: 100vh;
`;

const PageTitle = styled.h1`
  text-align: center;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.fontSizes.xlarge};
  color: ${({ theme }) => theme.colors.backgroundDarker};
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
`;

const FaqItem = styled.div`
  max-width: 800px;
  margin: 0 auto ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.backgroundDarker};
  padding-bottom: ${({ theme }) => theme.spacing.md};
`;

const QuestionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

const Question = styled.h4`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.fontSizes.large};
  color: ${({ theme }) => theme.colors.backgroundDarker};
  margin: 0;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.backgroundDarker};
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xs};
`;

const AnswerWrapper = styled(motion.div)`
  overflow: hidden;
`;

const Answer = styled.p`
  font-family: ${({ theme }) => theme.typography.bodyFont};
  font-size: ${({ theme }) => theme.typography.fontSizes.medium};
  color: ${({ theme }) => theme.colors.backgroundDarker};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

// spinner
const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  width: 64px;
  height: 64px;
  border: 6px solid ${({ theme }) => theme.colors.backgroundDarker}33;
  border-top-color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin: 80px auto 24px;
`;

const Centered = styled.div`
  text-align: center;
`;

const ErrorBox = styled.div`
  max-width: 700px;
  background: ${({ theme }) => theme.colors.errorBackground || '#ffe9e9'};
  border: 1px solid ${({ theme }) => theme.colors.errorBorder || '#ff4f4f'};
  color: ${({ theme }) => theme.colors.errorText || '#8a1f1f'};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: 10px;
  margin: 0 auto ${({ theme }) => theme.spacing.xl};
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
`;

const RetryButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;

  &:hover {
    filter: brightness(1.05);
  }
`;

const FaqPage = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [err, setErr] = useState(null);

  const toggleOpen = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const fetchFAQs = async () => {
    setIsLoading(true);
    setErr(null);
    try {
      const res = await api.get("/messages/faqs/", {params: {all: 'yes'}});
      // expect array of { question, answer } or map/normalize as needed
      setFaqs(Array.isArray(res.data) && res.data.length ? res.data : FAQ_DATA);
    } catch (e) {
      console.error("Failed to fetch FAQs", e);
      setErr("Sorry, we couldn’t load the FAQs. Please try again."); 
      setFaqs(FAQ_DATA); // fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageWrapper
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <PageTitle>FAQ</PageTitle>

      {isLoading && (
        <Centered>
          <Spinner aria-label="Loading FAQs" />
        </Centered>
      )}

      {err && (
        <ErrorBox role="alert">
          <div style={{ flex: 1 }}>
            <strong style={{ display: 'block', marginBottom: '6px' }}>Error</strong>
            <div>{err}</div>
          </div>
          <div>
            <RetryButton onClick={fetchFAQs}>
              <RefreshCw size={16} /> Retry
            </RetryButton>
          </div>
        </ErrorBox>
      )}

      {!isLoading && (
        <>
          {faqs.map((faq, index) => (
            <FaqItem key={index}>
              <QuestionRow onClick={() => toggleOpen(index)}>
                <Question>{faq.question}</Question>
                <IconButton aria-label="Toggle FAQ">
                  {openIndex === index ? <Minus size={20} /> : <Plus size={20} />}
                </IconButton>
              </QuestionRow>
              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <AnswerWrapper
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Answer>{faq.answer}</Answer>
                  </AnswerWrapper>
                )}
              </AnimatePresence>
            </FaqItem>
          ))}
        </>
      )}
    </PageWrapper>
  );
};

export default FaqPage;
