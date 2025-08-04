import React, { useEffect, useState } from 'react';
import styled, { keyframes, useTheme } from 'styled-components';
import { CheckCircle, Circle } from 'lucide-react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import TooltipInfo from '../utils/customTooltip';

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

const MultilineInput = styled.textarea`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.muted};
  border-radius: ${({ theme }) => theme.borders.radius};
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
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

const RSVPForm = ({ guest, index, formData, handleChange, rooms, allergies, tentSelected }) => {
    // const formIdPrefix = `guest-${index}`;
    const theme = useTheme()
    const REQUIRED = ["arrival_day", "food_selection"]
    const hasAllKeys = REQUIRED.every(key => key in formData);
    const [disabledAll, setDisabledAll] = useState(false)

    useEffect(() => {
        handleChange({ target: { name: 'notAttending', value: "yes" } }, guest)
    }, [])

    useEffect(() => {
        if (!hasAllKeys) {
            if (formData.submit === true) {
                handleChange({ target: { name: 'submit', value: false } }, guest)
            }
        }
    }, [disabledAll])

    if(tentSelected.selected && tentSelected.guestName !== guest.name){
        rooms = rooms.filter((room)=> room.id === tentSelected.selectedRoom)
    }

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
                    <option value="FRI">Friday</option>
                    <option value="SAT">Saturday</option>
                </Select>
            </Field>
            {(formData.arrival_day === 'FRI' || !formData.arrival_day) && <Field>
                <Label>
                    <Checkbox
                        disabled={disabledAll}
                        name="purchasing_food"
                        checked={formData.purchasing_food || false}
                        onChange={(e) => handleChange(e, guest)}
                    />
                    Would you like to purchase food Friday Night? <TooltipInfo
                        message="On Friday night we will have a private company to cater for those who wish to purchase food. 
  It will be Thai Food and you can find more details below"
                        linkText="Thai Food Link"
                        linkUrl="https://example.com/wedding-info"
                    />
                </Label>
            </Field>}

            <Field>
                <Label>Accommodation <TooltipInfo
                        message="Bell Tents come with a supplementary charge of £80 for 2 nights. If one RSVP selects a Bell Tent, it will be selected for all guests. If you do need a bunk as well, then please contact Emily or Tom after submitting."
                    /></Label>
                <Select
                    disabled={disabledAll}
                    name="room"
                    value={formData.room || (tentSelected && tentSelected) || ''}
                    onChange={(e) => handleChange(e, guest)}
                    required
                >
                    {tentSelected.selected && tentSelected.guestName === guest.name && <option value={-1} >Not Required</option>}
                    {!tentSelected && <option value={-1} >Not Required</option>}
                    {rooms.map((room) => (
                        <option key={room.id} value={room.id} disabled={room.available - room.selected.length === 0}>
                            {room.name} {room.name !== "NOT REQUIRED" && `(${room.type})`} {room.id !== parseInt(formData.room) && room.name !== "NOT REQUIRED" && <>{room.available - room.selected.length} of {room.total} available</>}
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
                {/* <FormControl sx={{ m: 3 }} component="fieldset" variant="standard"> */}
                    <Label>Allergies</Label>
                    <FormGroup sx={{m: 1, display: 'flex', flexDirection:'row'}}>
                        {
                            Object.entries(allergies).map((allergy) => {
                                console.log(allergy)
                                return (
                                    <FormControlLabel
                                    sx={{mr: theme.spacing.lg}}
                                        control={
                                            <Checkbox  disabled={disabledAll} sx={{m: theme.spacing.lg}} checked={formData.allergies?.includes(allergy[0])} onChange={(e) => handleChange({ target: { id: allergy[0], value: e.target.checked, name: "allergies" } }, guest)} name="allergies" />
                                        }
                                        label={allergy[1]}
                                    />
                                )
                            })
                        }
                    </FormGroup>
                {/* </FormControl> */}
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
                    <option value="VEGGIE">Vegetarian</option>
                    <option value="VEGAN">Vegan</option>
                    <option value="MEAT">Meat</option>
                </Select>
            </Field>

            <Field>
                <Label>Leave a Message</Label>
                <MultilineInput
                disabled={disabledAll}
                name="message"
                value={formData.message || ''}
                onChange={(e) => handleChange(e, guest)}
                placeholder="Type your message here..."
            />
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
