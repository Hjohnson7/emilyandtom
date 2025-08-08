import { Typography, Box } from "@mui/material"
import styled from "styled-components"
import AnimatedImage from "./animatedImage"
import { motion } from 'framer-motion';
import useInView from "../../../hooks/inViewHook";

const Container = styled.section`
    background-color: ${({theme}) => theme.colors.backgroundMain};
    padding: ${({theme}) => theme.spacing.xxl}
`

const StyledText = styled(motion.div)`
  font-family: ${({ theme }) => theme.typography.fontFamily}
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
`;

const HeaderMain = styled(StyledText)`
  font-size: ${({ theme }) => theme.spacing.xxxl};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  line-height: 1.1;
`;

const Wrapper = styled(Box)`
    display: flex;
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
`

const GroupedDetail = styled(Box)`
    display: flex;
    flex-direction: column;
    margin: ${({ theme }) => theme.spacing.lg};
    text-align: center;
    width: 25%;
    min-width: 320px;
`

const WeddingOverview = () => {
    const DETAILS = [
        {
            title: 'The Venue',
            text: 'We’re celebrating at the Lakeside Events Hall in our hometown, Sterrington Way.',
            image: '/static/frontend/images/venue.png',
            alt: 'venue'
        },
        {
            title: 'Accomodations',
            text: "There is a range of accomodation at the venue for guests. Please choose when you RSVP",
            image: '/static/frontend/images/accomodation.png',
            alt: 'accomodation'
        },
        {
            title: 'Attire',
            text: 'Please come in light and breezy smart casual attire, as our wedding will be held outdoors.',
            image: '/static/frontend/images/attire.jpg',
            alt: 'dress code'
        },
]

    const [ctaRef, ctaVisible] = useInView({ threshold: 0.2 });

    return (
        <Container ref={ctaRef}>
            <HeaderMain>The Wedding</HeaderMain>
            <Wrapper>
            {DETAILS.map((detail, i) => {
                return (
                    <GroupedDetail key={i}>
                        <AnimatedImage
                        key={detail.alt}
                        src={detail.image}
                        alt={detail.alt}
                        delay={i * 0.3} // delay increases per item
                        width="100%"
                        height="100%"
                        visible={ctaVisible}
                    />
                    <Typography variant="h6">
                        {detail.title}
                    </Typography>
                    <Typography variant="p">
                        {detail.text}
                    </Typography>
                    </GroupedDetail>
                )
            })}
            </Wrapper>
        </Container>
    )
}

export default WeddingOverview