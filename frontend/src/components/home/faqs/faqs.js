import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import useInView from '../../../hooks/inViewHook'; // Adjust the path as needed

const FAQ_DATA = [
    {
        question: "What should I wear to the wedding?",
        answer: "Our wedding will be outdoors, so we recommend light, breezy smart casual attire. Think garden party meets elegance!"
    },
    {
        question: "Can I bring a plus one?",
        answer: "Please check your invitation — it will indicate whether a plus one has been included. If you're unsure, feel free to contact us."
    },
    {
        question: "Are children invited?",
        answer: "We love your little ones, but our wedding will be an adults-only celebration. Thank you for understanding!"
    },
    {
        question: "What time should I arrive?",
        answer: "The ceremony will begin at 5:00 PM. We recommend arriving by 4:30 PM to find your seat and settle in."
    },
    // {
    //     question: "Is there parking at the venue?",
    //     answer: "Yes! There is free guest parking available at the venue. Signs and attendants will guide you upon arrival."
    // },
    // {
    //     question: "Will there be vegetarian/vegan food options?",
    //     answer: "Absolutely. Our menu includes vegetarian and vegan options. If you have specific dietary needs, let us know on your RSVP."
    // },
    // {
    //     question: "What’s the weather typically like in April?",
    //     answer: "April tends to be mild and sunny with cooler evenings. We suggest bringing a light jacket just in case!"
    // },
    // {
    //     question: "Will the ceremony and reception be in the same location?",
    //     answer: "Yes, both the ceremony and reception will be held at the Lakeside Events Hall, so no travel necessary between events."
    // },
    // {
    //     question: "Can I take photos during the ceremony?",
    //     answer: "We’re having an unplugged ceremony — we kindly ask you to put phones away and be present with us. Our photographer will capture everything!"
    // },
    // {
    //     question: "Where should I stay overnight?",
    //     answer: "There are rooms available at the venue. Please select your accommodation preference when submitting your RSVP."
    // }
];

const Section = styled.section`
  background-color: ${({ theme }) => theme.colors.backgroundDarker};
  padding: ${({ theme }) => theme.spacing.xxxl} ${({ theme }) => theme.spacing.lg};
`;

const Header = styled.h2`
  text-align: center;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.fontSizes.xlarge};
  color: ${({ theme }) => theme.colors.faqs};
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
`;

const FAQItem = styled(motion.div)`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  align-items: center;
  justify-content: center;
  h4 {
    font-family: ${({ theme }) => theme.typography.fontFamily};
    color: ${({ theme }) => theme.colors.faqs};
    font-size: ${({ theme }) => theme.typography.fontSizes.large};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }

  p {
    font-family: ${({ theme }) => theme.typography.bodyFont};
    color: ${({ theme }) => theme.colors.text};
    font-size: ${({ theme }) => theme.typography.fontSizes.medium};
    margin: 0;
  }
`;

const FaqSection = () => {
    const [ref, isVisible] = useInView({ threshold: 0.2 });

    return (
        <Section ref={ref}>
            <Header>FAQ</Header>
            {FAQ_DATA.map((faq, index) => (
                <FAQItem
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={isVisible ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                    <h4>{faq.question}</h4>
                    <p>{faq.answer}</p>
                </FAQItem>
            ))}
        </Section>
    );
};

export default FaqSection;
