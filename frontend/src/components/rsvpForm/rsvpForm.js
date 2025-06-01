import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const FormWrapper = styled.div`
  max-width: 600px;
  margin: auto;
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borders.radiuslg};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  animation: ${fadeIn} 0.6s ease-in-out;
`;

const Title = styled.h2`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.fontSizes.xlarge};
  text-align: center;
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

const Button = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: #fff;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  border: none;
  border-radius: ${({ theme }) => theme.borders.radius};
  cursor: pointer;
  font-weight: bold;
  transition: ${({ theme }) => theme.transitions.default};
  &:hover {
    background-color: ${({ theme }) => theme.colors.accent};
  }
`;

const RSVPForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    arrival_day: '',
    bringing_food: false,
    accommodation: '',
    favourite_song: '',
    allergies: '',
    food_selection: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/rsvp/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      console.log(result);
      alert("RSVP submitted!");
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  return (
    <FormWrapper>
      <Title>RSVP</Title>
      <form onSubmit={handleSubmit}>
        <Field>
          <Label>Name</Label>
          <Input name="name" value={formData.name} onChange={handleChange} required />
        </Field>

        <Field>
          <Label>Arrival Day</Label>
          <Select name="arrival_day" value={formData.arrival_day} onChange={handleChange} required>
            <option value="">Select...</option>
            <option value="friday">Friday</option>
            <option value="saturday">Saturday</option>
          </Select>
        </Field>

        <Field>
          <Label>
            <Checkbox name="bringing_food" checked={formData.bringing_food} onChange={handleChange} />
            Bringing Food?
          </Label>
        </Field>

        <Field>
          <Label>Accommodation</Label>
          <Select name="accommodation" value={formData.accommodation} onChange={handleChange} required>
            <option value="">Select...</option>
            <option value="bunk_bed">Bunk Bed</option>
            <option value="bell_tent">Bell Tent</option>
            <option value="campervan">Campervan</option>
          </Select>
        </Field>

        <Field>
          <Label>Favourite Song</Label>
          <Input name="favourite_song" value={formData.favourite_song} onChange={handleChange} />
        </Field>

        <Field>
          <Label>Allergies</Label>
          <Select name="allergies" value={formData.allergies} onChange={handleChange}>
            <option value="">None</option>
            <option value="nuts">Nuts</option>
            <option value="gluten">Gluten</option>
            <option value="dairy">Dairy</option>
            <option value="shellfish">Shellfish</option>
          </Select>
        </Field>

        <Field>
          <Label>Food Preference</Label>
          <Select name="food_selection" value={formData.food_selection} onChange={handleChange} required>
            <option value="">Select...</option>
            <option value="veggie">Vegetarian</option>
            <option value="vegan">Vegan</option>
            <option value="meat">Meat</option>
            <option value="fish">Fish</option>
          </Select>
        </Field>

        <Button type="submit">Submit RSVP</Button>
      </form>
    </FormWrapper>
  );
};

export default RSVPForm;
