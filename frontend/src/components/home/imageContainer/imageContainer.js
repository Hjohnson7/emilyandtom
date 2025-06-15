import { useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import { fadeInUp } from "../../utils/animatedBox";
import useBreakpoint from "../../../hooks/useBreakPoints";

const getDelay = (index) => `${index * 0.2}s`;

const AnimatedImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.3s ease, transform 0.3s ease;

  ${({ isVisible, index, sizeSmall }) =>
        isVisible &&
        css`
      animation: ${fadeInUp} 0.8s ease-out forwards;
      animation-delay: ${sizeSmall ? 0 : getDelay(index)};
    `}
`;

const ImageBox = styled.div`
  aspect-ratio: 3 / 4;
  width: 100%;
  border: 4px solid ${({ theme }) => theme.colors.backgroundMain};
  border-radius: 50% / 35%;
  overflow: hidden;
  position: relative;
`;

const Container = styled.section`
  background-color: ${({ theme }) => theme.colors.backgroundLighter};
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.xxxl};
`;

const ImageContainer = () => {
    const IMAGES = ['homepage2.JPG', 'homepage3.JPG', 'homepage4.JPG'];
    const refs = useRef([]);
    const [visibleStates, setVisibleStates] = useState(new Array(IMAGES.length).fill(false));
    const breakpoint = useBreakpoint() 
    const sizeSmall = breakpoint !== 'xs' || breakpoint !== 'sm'

    useEffect(() => {
        const observers = refs.current.map((ref, i) => {
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setVisibleStates((prev) => {
                            const copy = [...prev];
                            copy[i] = true;
                            return copy;
                        });
                        observer.unobserve(ref); // optional: trigger only once
                    }
                },
                { threshold: 0.2 }
            );
            if (ref) observer.observe(ref);
            return observer;
        });

        return () => {
            observers.forEach((observer) => observer.disconnect());
        };
    }, []);

    return (
        <Container>
            {IMAGES.map((image, i) => (
                <ImageBox key={i} ref={(el) => (refs.current[i] = el)}>
                    <AnimatedImage
                        src={`/static/frontend/images/${image}`}
                        alt="emily and tom"
                        isVisible={visibleStates[i]}
                        index={i}
                        size={sizeSmall}
                    />
                </ImageBox>
            ))}
        </Container>
    );
};

export default ImageContainer;
