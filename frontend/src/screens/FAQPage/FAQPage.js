import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

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

const FaqPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleOpen = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <PageWrapper
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <PageTitle>FAQ</PageTitle>
      {FAQ_DATA.map((faq, index) => (
        <FaqItem key={index}>
          <QuestionRow onClick={() => toggleOpen(index)}>
            <Question>{faq.question}</Question>
            <IconButton aria-label="Toggle FAQ">
              {openIndex === index ? <Minus size={20} /> : <Plus size={20} />}
            </IconButton>
          </QuestionRow>
          <AnimatePresence>
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
    </PageWrapper>
  );
};

export default FaqPage;
