import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { CheckCircle, Circle } from 'lucide-react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

// Animation
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const FormWrapper = styled.div`
  max-width: 600px;
  margin: auto;
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.backgroundMain};
  border-radius: ${({ theme }) => theme.borders.radiuslg};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  animation: ${fadeIn} 0.6s ease-in-out;

`;

const Title = styled.h2`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.fontSizes.xlarge};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Field = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.muted};
  border-radius: ${({ theme }) => theme.borders.radius};
`;

const Select = styled.select`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borders.radius};
  border: 1px solid ${({ theme }) => theme.colors.muted};
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  margin-right: ${({ theme }) => theme.spacing.xs};
`;



const ToggleWrapper = styled.div`

  opacity: ${({ disabled }) => disabled ? 0.5 : 1};
  pointer-events: ${({ disabled }) => disabled ? 'none' : 'auto'};
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};

  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.sm};
  border: 2px solid ${({ selected, theme }) => selected ? theme.colors.primary : theme.colors.muted};
  background-color: ${({ selected, theme }) =>
        selected ? theme.colors.primaryLight : theme.colors.background};
  color: ${({ selected, theme }) => selected ? theme.colors.textInverted : theme.colors.text};
  border-radius: ${({ theme }) => theme.borders.radiuslg};
  transition: all 0.3s ease;
  font-weight: bold;
  gap: ${({ theme }) => theme.spacing.sm};
  text-align: center;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryLight};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const RSVPForm = ({ guest, index, formData, handleChange, rooms }) => {
    // const formIdPrefix = `guest-${index}`;

    const REQUIRED = ["arrival_day", "accommodation", "food_selection"]
    const hasAllKeys = REQUIRED.every(key => key in formData);
    const [disabledAll, setDisabledAll] = useState(false)

    useEffect(()=>{
        handleChange({target: {name: 'notAttending', value: "yes"}}, guest)
    }, [])

    useEffect(()=>{
        if(!hasAllKeys){
            if(formData.submit === true){
                handleChange({target: {name: 'submit', value: false}}, guest)
            }
        }
    }, [disabledAll])

    const updateAttending = (e, guest) => {
        const disabled = e.target.value === 'no' ? true : false
        setDisabledAll(disabled)
        handleChange(e, guest)
    }

    return (
        <FormWrapper>
            <Title>{guest.name}'s RSVP</Title>
            <Field>
                <ToggleButtonGroup
                    name="notAttending"
                    exclusive
                    value={formData.notAttending}
                    onChange={(e) => updateAttending(e, guest)}
                    size="small"
                >
                    <ToggleButton name="notAttending" value="yes">Attending</ToggleButton>
                    <ToggleButton name="notAttending" value="no">Not Attending</ToggleButton>
                </ToggleButtonGroup>
            </Field>
            <Field>
                <Label>Arrival Day</Label>
                <Select
                disabled={disabledAll}
                    name="arrival_day"
                    value={formData.arrival_day || ''}
                    onChange={(e) => handleChange(e, guest)}
                    required
                >
                    <option value="" disabled hidden>Select...</option>
                    <option value="fri">Friday</option>
                    <option value="sat">Saturday</option>
                </Select>
            </Field>

            <Field>
                <Label>
                    <Checkbox
                    disabled={disabledAll}
                        name="bringing_food"
                        checked={formData.bringing_food || false}
                        onChange={(e) => handleChange(e, guest)}
                    />
                    Bringing Food?
                </Label>
            </Field>

            <Field>
                <Label>Accommodation</Label>
                <Select
                disabled={disabledAll}
                    name="accommodation"
                    value={formData.accommodation || ''}
                    onChange={(e) => handleChange(e, guest)}
                    required
                >
                    <option value="" disabled hidden>Select...</option>
                    {rooms.map((room) => (
                        <option key={room.id} value={room.id} disabled={room.available - room.selected.length === 0}>
                            {room.name} ({room.type}) {room.id !== parseInt(formData.accommodation) && <>{room.available - room.selected.length} of {room.total} available</>}
                        </option>
                    ))}
                </Select>
            </Field>

            <Field>
                <Label>Favourite Song</Label>
                <Input
                disabled={disabledAll}
                    name="favourite_song"
                    value={formData.favourite_song || ''}
                    onChange={(e) => handleChange(e, guest)}
                />
            </Field>

            <Field>
                <Label>Allergies</Label>
                <Select
                disabled={disabledAll}
                    name="allergies"
                    value={formData.allergies || ''}
                    onChange={(e) => handleChange(e, guest)}
                >
                    <option value="">None</option>
                    <option value="nuts">Nuts</option>
                    <option value="gluten">Gluten</option>
                    <option value="dairy">Dairy</option>
                    <option value="shellfish">Shellfish</option>
                </Select>
            </Field>

            <Field>
                <Label>Food Preference</Label>
                <Select
                disabled={disabledAll}
                    name="food_selection"
                    value={formData.food_selection || ''}
                    onChange={(e) => handleChange(e, guest)}
                    required
                >
                    <option value="" disabled hidden>Select...</option>
                    <option value="veggie">Vegetarian</option>
                    <option value="vegan">Vegan</option>
                    <option value="meat">Meat</option>
                    <option value="fish">Fish</option>
                </Select>
            </Field>

            <Field>
                <ToggleWrapper disabled={!hasAllKeys && !disabledAll} selected={formData.submit} onClick={() => handleChange({ target: { value: !formData.submit, name: "submit", type: "bool" } }, guest)}>
                    {formData.submit ? <CheckCircle size={20} /> : <Circle size={20} />}
                    {"Completed Form"}
                </ToggleWrapper>
            </Field>


        </FormWrapper>
    );
};

export default RSVPForm;
