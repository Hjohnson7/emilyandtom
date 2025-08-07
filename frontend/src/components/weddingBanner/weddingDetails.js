import { Typography, Divider, Box} from '@mui/material';
import styled, { css, keyframes } from "styled-components";

const Wrapper = styled(Box)`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
`

const fadeInUp = keyframes`
  0% { opacity: 0; transform: translateY(40px); }
  100% { opacity: 1; transform: translateY(0); }
`;


const Container = styled.section`
    width: 100%;
    padding: ${({theme}) => theme.spacing.xl};
    @media (max-width: 768px) {
        padding: ${({theme}) => theme.spacing.xs};
    }
` 

const Detail = styled(Typography)`
    padding: ${({ theme }) => theme.spacing.md};
    color: ${({ theme }) => theme.colors.text};
    animation: ${fadeInUp} 1s ease-out;
    @media (max-width: 768px) {
        padding: ${({theme}) => theme.spacing.xs} ${({theme}) => theme.spacing.md}
    }
`


const WeddingDetails = () => {

    const details = ["3 O'clock in the afternoon", "August 7-9th 2026", "The Wilderness Centre - Mitchledean"]

    return (
        <Container>
        <Divider sx={{backgroundColor: 'white'}}/>
        <Wrapper>
            {details.map((detail, i) => {return (
                <Detail key={i}>
                    {detail}
                </Detail>
            )})}
        </Wrapper>
        </Container>
    )
}

export default WeddingDetails