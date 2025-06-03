import { Box } from "@mui/material";
import RSVPForm from "../components/rsvpForm/rsvpForm";
import styled from "styled-components";

const Container = styled(Box)`
    padding: ${({theme}) => theme.spacing.xxl}
`

const RsvpPage = () => {
    return (
        <Container>
        <RSVPForm />
        </Container>
    )
}

export default RsvpPage