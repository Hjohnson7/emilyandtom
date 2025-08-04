import React, { useState } from "react";
import {
    Box,
    TextField,
    Checkbox,
    FormControlLabel,
    Button,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    IconButton,
    Stack,
    CircularProgress,
} from "@mui/material";
import { styled as scStyled } from "styled-components";
import { X as XIcon, Add as AddIcon } from "@mui/icons-material";
import { useTheme } from 'styled-components';
import axios from 'axios';

// Container styled to blend with your theme
const FormWrapper = scStyled(Box)`
  background: ${({ theme }) => theme.colors.backgroundLighter};
  padding: ${({ theme }) => theme.spacing.xxl};
  border-radius: ${({ theme }) => theme.borders.radiuslg};
  max-width: 900px;
  margin: 0 auto;
  font-family: ${({ theme }) => theme.typography.bodyFont};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  color: '${({ theme }) => theme.colors.text}';
`;

const SectionTitle = scStyled(Typography)`
  font-family: ${({ theme }) => theme.typography.serif};
  font-size: ${({ theme }) => theme.typography.fontSizes.xlarge};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.primary};
`;

const ExtraActionContainer = scStyled(Box)`
  background: ${({ theme }) => theme.colors.accent};
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borders.radius};
`;

export default function WeddingUpdateForm() {
    const [form, setForm] = useState({
        subject: "Wedding Update & Your RSVP Portal",
        domain: "",
        update_title: "",
        update_body: "",
        tagline: "",
        preheader: "",
        extra_actions: [""],
        include_all: true,
    });
    const [errors, setErrors] = useState({});
    const [showConfirm, setShowConfirm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [response, setResponse] = useState(null);
    const theme = useTheme()
    const validate = () => {
        const errs = {};
        if (!form.update_body.trim()) errs.update_body = "Update body is required.";
        return errs;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === "include_all") {
            setForm((f) => ({ ...f, include_all: checked }));
        } else {
            setForm((f) => ({ ...f, [name]: value }));
        }
    };

    const handleExtraActionChange = (idx, value) => {
        setForm((f) => {
            const actions = [...f.extra_actions];
            actions[idx] = value;
            return { ...f, extra_actions: actions };
        });
    };

    const addExtraAction = () =>
        setForm((f) => ({ ...f, extra_actions: [...f.extra_actions, ""] }));

    const removeExtraAction = (idx) =>
        setForm((f) => {
            const actions = f.extra_actions.filter((_, i) => i !== idx);
            return { ...f, extra_actions: actions.length ? actions : [""] };
        });

    const onFormSubmit = (e) => {
        e.preventDefault();
        const v = validate();
        setErrors(v);
        if (Object.keys(v).length) return;
        setShowConfirm(true);
    };

    const submit = async () => {
        const v = validate();
        setErrors(v);
        if (Object.keys(v).length) return;
        setShowConfirm(false);
        setSubmitting(true);
        try {
            const payload = { ...form };
            payload.extra_actions = payload.extra_actions.filter((a) => a.trim());

            const res = await axios.post('/api/accounts/send-wedding-updates/', payload)

            setResponse({ success: true, data: res.data });
        } catch (e) {
            setResponse({ success: false, error: e.message });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <FormWrapper>
            <SectionTitle variant="h2">Broadcast Wedding Update</SectionTitle>

            {response && (
                <Box mb={2}>
                    {response.success ? (
                        <Alert severity="success" sx={{ mb: 1 }}>
                            Sent {response.data.sent_count} emails successfully.
                        </Alert>
                    ) : (
                        <Alert severity="error" sx={{ mb: 1 }}>
                            Failed to send: {response.error || "Unknown error"}
                        </Alert>
                    )}
                    {response.data?.failed?.length > 0 && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            Failures:{" "}
                            {response.data.failed.map((f) => f.email).join(", ")}
                        </Typography>
                    )}
                </Box>
            )}

            <Box component="form" onSubmit={onFormSubmit} noValidate>
                <Stack spacing={3}>
                    <Stack
                        direction={{ xs: "column", md: "row" }}
                        spacing={2}
                        sx={{ gap: 2 }}
                    >
                        <TextField
                            label="Subject"
                            name="subject"
                            fullWidth
                            value={form.subject}
                            onChange={handleChange}
                            variant="filled"
                            InputProps={{
                                sx: {
                                    borderRadius: theme.borders.radiuslg,
                                    fontFamily: theme.typography.bodyFont,
                                },
                            }}
                        />
                    </Stack>

                    <TextField
                        label="Update Title"
                        name="update_title"
                        fullWidth
                        value={form.update_title}
                        onChange={handleChange}
                        variant="filled"
                        InputProps={{
                            sx: {
                                borderRadius: theme.borders.radiuslg,
                                fontFamily: theme.typography.bodyFont,
                            },
                        }}
                    />

                    <TextField
                        required
                        label="Update Body"
                        name="update_body"
                        fullWidth
                        multiline
                        minRows={5}
                        value={form.update_body}
                        onChange={handleChange}
                        error={!!errors.update_body}
                        helperText={errors.update_body}
                        variant="filled"
                        InputProps={{
                            sx: {
                                borderRadius: theme.borders.radiuslg,
                                fontFamily: theme.typography.bodyFont,
                            },
                        }}
                    />

                    <Stack
                        direction={{ xs: "column", md: "row" }}
                        spacing={2}
                        sx={{ gap: 2 }}
                    >
                        <TextField
                            label="Tagline"
                            name="tagline"
                            fullWidth
                            value={form.tagline}
                            onChange={handleChange}
                            variant="filled"
                            InputProps={{
                                sx: {
                                    borderRadius: theme.borders.radiuslg,
                                    fontFamily: theme.typography.bodyFont,
                                },
                            }}
                        />
                        <TextField
                            label="Preheader"
                            name="preheader"
                            fullWidth
                            value={form.preheader}
                            onChange={handleChange}
                            variant="filled"
                            InputProps={{
                                sx: {
                                    borderRadius: theme.borders.radiuslg,
                                    fontFamily: theme.typography.bodyFont,
                                },
                            }}
                        />
                    </Stack>

                    <Box>
                        <Typography variant="subtitle1" sx={{ mb: 1 }}>
                            Extra Actions
                        </Typography>
                        <ExtraActionContainer>
                            <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="center">
                                {form.extra_actions.map((a, i) => (
                                    <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                        <TextField
                                            size="small"
                                            placeholder="e.g., View itinerary"
                                            value={a}
                                            onChange={(e) => handleExtraActionChange(i, e.target.value)}
                                            variant="outlined"
                                            sx={{
                                                background: "#fff",
                                                borderRadius: theme.borders.radius,
                                                flex: 1,
                                            }}
                                        />
                                        <IconButton
                                            aria-label="remove"
                                            size="small"
                                            onClick={() => removeExtraAction(i)}
                                        >
                                            <XIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                ))}
                            </Stack>
                            <Button
                                startIcon={<AddIcon />}
                                size="small"
                                onClick={addExtraAction}
                                variant="outlined"
                                sx={{
                                    mt: 1,
                                    borderRadius: theme.borders.radius,
                                    textTransform: "none",
                                }}
                            >
                                Add Action
                            </Button>
                        </ExtraActionContainer>
                    </Box>

                    <FormControlLabel
                        control={
                            <Checkbox
                                name="include_all"
                                checked={form.include_all}
                                onChange={handleChange}
                                sx={{
                                    color: theme.colors.primary,
                                    "&.Mui-checked": { color: theme.colors.primary },
                                }}
                            />
                        }
                        label="Include all active users (server filters RSVPed no)."
                    />

                    <Box display="flex" justifyContent="flex-end" gap={2}>
                        <Button
                            variant="contained"
                            onClick={onFormSubmit}
                            disabled={submitting}
                            sx={{
                                background: theme.colors.primary,
                                color: "#fff",
                                borderRadius: theme.borders.radiuslg,
                                px: 4,
                                py: 1.5,
                                fontWeight: 600,
                                "&:hover": { filter: "brightness(1.05)" },
                            }}
                        >
                            {submitting ? <CircularProgress size={20} /> : "Send Update"}
                        </Button>
                    </Box>
                </Stack>
            </Box>

            <Dialog open={showConfirm} onClose={() => setShowConfirm(false)}>
                <DialogTitle sx={{ color: theme.colors.backgroundDarker }}>Confirm Broadcast</DialogTitle>
                <DialogContent sx={{ color: theme.colors.backgroundDarker }}>
                    <Typography>
                        Are you sure you want to send this update to all selected users?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowConfirm(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={submit}
                        disabled={submitting}
                        sx={{
                            background: theme.colors.primary,
                            color: "#fff",
                            "&:hover": { filter: "brightness(1.05)" },
                        }}
                    >
                        {submitting ? <CircularProgress size={20} /> : "Yes, send"}
                    </Button>
                </DialogActions>
            </Dialog>
        </FormWrapper>
    );
}
