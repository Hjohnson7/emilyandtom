import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import api from "../../constants/api";


// Animation
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  padding: 2rem;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borders.radiuslg};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.medium};
  transform: translateY(20px);
  opacity: 0;
  animation: ${fadeInUp} 0.6s ease-out forwards;
  animation-delay: ${({ delay }) => delay}s;

  &:hover {
    transform: translateY(-5px);
  }
`;

const Image = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
`;

const Content = styled.div`
  padding: 1.2rem;
`;

const Title = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.text};
`;

const Availability = styled.p`
  margin: 0;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: bold;
`;

const ToggleOccupants = styled.button`
  margin-top: 0.8rem;
  background: ${({ theme }) => theme.colors.backgroundLighter};
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  padding: 0.5rem;
  border-radius: ${({ theme }) => theme.borders.radius};
  cursor: pointer;
  font-size: 0.875rem;
  &:hover {
    background: ${({ theme }) => theme.colors.primaryLight};
  }
`;

const OccupantList = styled.ul`
  margin-top: 0.5rem;
  padding-left: 1rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.mutedText};
`;

const Description = styled.p`
  margin: 0;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text};
  font-weight: bold;
`

const AccommodationGrid = () => {
  const [showOccupants, setShowOccupants] = useState({});
  const [accommodations, setAccommodations] = useState([])


  useEffect(()=> {
    const loadRooms = async() => {
        let rooms = await api.get('invitations/get-rooms/')
        console.log(rooms)
        setAccommodations(rooms.data)
    }
    loadRooms()
  }, [])

  const toggleOccupants = (index) => {
    setShowOccupants((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const ImageMap = {
    'BUNK': '/static/frontend/images/bunk_room.PNG',
    'TENT': '/static/frontend/images/accomodation.PNG',
  }
    

  return (
    <Grid>
      {accommodations.map((room, index) => (
        <Card key={index} delay={index * 0.2}>
          <Image src={ImageMap[room.type]} alt={room.type} />
          <Content>
          <Title>{room.name}</Title>
            <Title>{room.type}</Title>
            <Availability>
              {(room.type === 'TENT' && room.occupants.length > 0) ? 'Booked' : `${room.available} / ${room.total} beds available` }
            </Availability>
            <Description>
              {room.notes}
            </Description>
            <ToggleOccupants onClick={() => toggleOccupants(index)}>
              {showOccupants[index] ? "Hide guests" : "View guests"}
            </ToggleOccupants>
            {showOccupants[index] && (
              <OccupantList>
                {room.occupants.map((name, i) => (
                  <li key={i}>{name}</li>
                ))}
              </OccupantList>
            )}
          </Content>
        </Card>
      ))}
    </Grid>
  );
};

export default AccommodationGrid;
