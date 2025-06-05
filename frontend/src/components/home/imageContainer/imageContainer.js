import styled from "styled-components"
import useInView from "../../../hooks/inViewHook"
import { fadeInUp } from "../../utils/animatedBox"
import { Box } from "@mui/material";


const AnimatedImage = styled.img`
  opacity: 0;
  &.visible{
    animation: ${fadeInUp}  1s ease-out forwards;
    opactiy: 1;
    width: 100%;
  height: 100%;
  object-fit: cover;
  }
`;

const ImageBox = styled(Box)`
  min-width: 320px;
  height: 480px;
  border: 4px solid ${({ theme }) => theme.colors.backgroundMain};
  border-radius: 50% / 35%;
  overflow: hidden;
  position: relative;
  margin: ${({ theme }) => theme.spacing.xl};
`

const Container = styled.section`
    background-color: ${({ theme }) => theme.colors.backgroundLighter};
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
    padding: ${({ theme }) => theme.spacing.xxxl};
`

const ImageContainer = () => {

    const [ctaRef, ctaVisible] = useInView({ threshold: 0.2 });
    const IMAGES = ['homepage1.JPG', 'homepage2.JPG', 'homepage3.JPG']

    return (
        <Container ref={ctaRef}>
            {IMAGES.map((image, i) => {
                return (
                    <ImageBox key={i}>
                        <AnimatedImage className={ctaVisible ? "visible" : ""} src={`/static/frontend/images/${image}`} alt="emily and tom" />
                    </ImageBox>
                )
            })}
        </Container>
    )

}

export default ImageContainer