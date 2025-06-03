import React from "react";
import styled from "styled-components";
import { Box, Typography } from "@mui/material";
import useInView from "../../../hooks/inViewHook";
import { motion } from "framer-motion";

// ---------- Styled Components ----------

const Container = styled.section`
  background-color: ${({ theme }) => theme.colors.backgroundLighter};
  padding: ${({ theme }) => theme.spacing.xxl} ${({ theme }) => theme.spacing.xxxl};
  display: flex;
  justify-content: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const Left = styled.div`
  flex: 1;
`;

const Right = styled(motion.ul)`
  flex: 1;
  list-style: none;
  padding: 0;
  padding-top: ${({ theme }) => theme.spacing.xxxl};
  margin-top: ${({ theme }) => theme.spacing.xxxl};
`;

const Title = styled(Typography)`
  font-family: ${({ theme }) => theme.typography.serif};
  font-size: 4rem;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.black};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Subtitle = styled(Typography)`
  font-family: ${({ theme }) => theme.typography.script};
  font-size: 2.2rem;
  color: ${({ theme }) => theme.colors.black};
  margin-top: -1.5rem;
`;

const DateText = styled(Typography)`
  font-size: 1.1rem;
  letter-spacing: 0.15rem;
  color: ${({ theme }) => theme.colors.black};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const EventItem = styled(motion.li)`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-top: 2px solid ${({ theme }) => theme.colors.black};
  padding: 1.2rem 1.2rem;
  font-size: 1rem;
  letter-spacing: 0.15rem;
  color: ${({ theme }) => theme.colors.black};

  &:last-child {
    border-bottom: 2px solid ${({ theme }) => theme.colors.black};
  }

  > span {
    margin-left: 2rem;
  }
`;

const Wrapper = styled(Box)`
    width: 70%;
    display: flex;
  justify-content: center;
  flex-wrap: wrap;
    @media (max-width: 768px) {
    width: 100%;
    flex-direction: column;
    text-align: center;
  }
`

// ---------- Animation Variants ----------

const listVariants = {
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
  hidden: {},
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

// ---------- Component ----------

const ScheduleOfEvents = () => {
  const [ref, inView] = useInView({ threshold: 0.2 });

  const schedule = [
    { time: "4:00 PM", title: "COCKTAILS" },
    { time: "5:00 PM", title: "WEDDING CEREMONY" },
    { time: "6:00 PM", title: "RECEPTION" },
    { time: "8:00 PM", title: "AFTERPARTY" },
  ];

  return (
    <Container ref={ref}>
        <Wrapper>
      <Left>
        <Title variant="h2">SCHEDULE</Title>
        <Subtitle variant="h3">of EVENTS</Subtitle>
        <DateText variant="body1">APRIL 30, 2030</DateText>
      </Left>
      <Right
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={listVariants}
      >
        {schedule.map((item, idx) => (
          <EventItem key={idx} variants={itemVariants}>
            {item.time}
            <span>{item.title}</span>
          </EventItem>
        ))}
      </Right>
      </Wrapper>
    </Container>
  );
};

export default ScheduleOfEvents;
