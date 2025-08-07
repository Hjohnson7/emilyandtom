import React, { useEffect, useState, useMemo } from 'react';
import {
    Card,
    CardContent,
    Button,
    Box,
    Typography,
    Grid,
    useTheme,
    CircularProgress,
} from '@mui/material';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    ResponsiveContainer,
} from 'recharts';
import { motion } from 'framer-motion';
import { useTheme as styledComponentTheme } from 'styled-components';

export default function RSVPAnalyticsDashboard() {
    const theme = useTheme();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const styledTheme = styledComponentTheme()
    const COLORS = [
        theme.palette.primary.main,
        theme.palette.secondary.main,
        theme.palette.success.main,
        theme.palette.warning.main,
    ];

    useEffect(() => {
        fetch('/api/accounts/load-all-details/')
            .then(res => {
                if (!res.ok) throw new Error('Network response was not ok');
                return res.json();
            })
            .then(data => {
                setUsers(Array.isArray(data) ? data : [data]);
                setLoading(false);
            })
            .catch(e => {
                setError(e.message);
                setLoading(false);
            });
    }, []);

    const summary = useMemo(() => {
        const totalUsers = users.length;
        let mainRsvped = 0;
        let mainComing = 0;
        let totalPartners = 0;
        let partnerRsvped = 0;
        let partnerComing = 0;
        let partnersNotComing = 0;
        let totalChildren = 0;
        let childrenNotComing = 0;
        let childRsvped = 0;
        let childrenComing = 0;
        const dietCounts = {};
        const arrivalDay = {}
        const foodFriday = {}

        const processRSVP = (rsvp) => {
            console.log(rsvp)
            if (!rsvp) return;
            const sel = rsvp.food_selection || 'unknown';
            dietCounts[sel] = (dietCounts[sel] || 0) + 1;
            const day = rsvp.arrival_day === "FRI" ? "Friday" : "Saturday";
            arrivalDay[day] = (arrivalDay[day] || 0) + 1
            if(day === "Friday"){
                let havingFood = rsvp.purchasing_food ? "Yes" : "No";
                foodFriday[havingFood] = (foodFriday[havingFood] || 0) + 1
            }
        };

        users.forEach(u => {
            if (u.rsvped) mainRsvped += 1;
            if (u.coming) mainComing += 1;

            if (Array.isArray(u.rsvps)) {
                u.rsvps.forEach((r) => processRSVP(r));
            }

            if (u.partner) {
                totalPartners += 1;
                if (u.partner.rsvped) partnerRsvped += 1;
                if (u.partner.coming) partnerComing += 1;
                if (u.partner.rsvp) {
                    processRSVP(u.partner.rsvp);
                    if(!u.partner.coming) partnersNotComing += 1;
                }
            }

            if (Array.isArray(u.children)) {
                totalChildren += u.children.length;
                u.children.forEach((c) => {
                    if (c.rsvped) childRsvped += 1;
                    if (c.coming) childrenComing += 1;
                    if (c.rsvp) {
                        processRSVP(c.rsvp);
                        if(!c.coming) childrenNotComing += 1
                    }
                });
            }
        });

        const totalInvitees = totalUsers + totalPartners + totalChildren;
        const totalRsvped = mainRsvped + partnerRsvped + childRsvped;
        const totalComing = mainComing + partnerComing + childrenComing;

        return {
            totalUsers,
            mainRsvped,
            mainComing,
            totalPartners,
            partnerRsvped,
            partnerComing,
            totalChildren,
            childRsvped,
            childrenComing,
            totalInvitees,
            totalRsvped,
            totalComing,
            totalNotRsvped: totalInvitees - totalRsvped,
            totalNotComing:
                (totalUsers - mainComing) +
                (partnersNotComing) +
                (childrenNotComing),
            dietCounts,
            arrivalDay,
            foodFriday,
            partnersNotComing,
            childrenNotComing
        };
    }, [users]);

    if (loading)
        return (
            <Box
                sx={{
                    p: 4,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 1,
                }}
            >
                <CircularProgress />
                <Typography>Loading analytics...</Typography>
            </Box>
        );
    if (error)
        return (
            <Box sx={{ p: 4 }}>
                <Typography color="error">Error: {error}</Typography>
            </Box>
        );

    const rsvpPieData = [
        { name: 'RSVPed', value: summary.totalRsvped },
        { name: 'Not RSVPed', value: summary.totalNotRsvped },
    ];
    const comingBarData = [
        {
            category: 'Main Guests',
            Coming: summary.mainComing,
            NotComing: summary.totalUsers - summary.mainComing,
        },
        {
            category: 'Partners',
            Coming: summary.partnerComing,
            NotComing: summary.partnersNotComing,
        },
        {
            category: 'Children',
            Coming: summary.childrenComing,
            NotComing: summary.childrenNotComing,
        },
    ];
    const dietaryData = Object.entries(summary.dietCounts || {}).map(([name, value]) => ({
        name,
        value,
    }));

    const arrivalData = Object.entries(summary.arrivalDay || {}).map(([name, value]) => ({
        name,
        value,
    }));
    
    const foodData = Object.entries(summary.foodFriday || {}).map(([name, value]) => ({
        name,
        value,
    }));

    console.log(foodData)

    return (
        <Box
            sx={{
                p: { xs: 2, md: 4 },
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2,1fr)' },
                gap: theme.spacing(4),
            }}
        >
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ gridColumn: '1 / -1' }}>
                <Card elevation={3} sx={{ borderRadius: 3 }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <div>
                                <Typography variant="h6" sx={{color: styledTheme.colors.backgroundDarker}}>Summary Metrics</Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', color: styledTheme.colors.backgroundDarker }}>
                                    High level counts
                                </Typography>
                            </div>
                            <Button variant="contained" onClick={() => window.location.reload()}>
                                Refresh
                            </Button>
                        </Box>

                        <Grid container spacing={2}>
                            {[
                                { label: 'Total Invitees', value: summary.totalInvitees },
                                { label: "RSVP'd", value: summary.totalRsvped },
                                { label: 'Coming', value: summary.totalComing },
                                { label: "Partners RSVP'd", value: summary.partnerRsvped },
                                { label: "Children RSVP'd", value: summary.childRsvped },
                            ].map((card, i) => (
                                <Grid item xs={6} md={3} key={i}>
                                    <Box
                                        sx={{
                                            bgcolor: theme.palette.grey[100],
                                            p: 2,
                                            borderRadius: 2,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 0.5,
                                        }}
                                    >
                                        <Typography variant="overline" sx={{ fontSize: 12, color: styledTheme.colors.backgroundDarker }}>
                                            {card.label}
                                        </Typography>
                                        <Typography variant="h5" sx={{ fontWeight: 600, color: styledTheme.colors.backgroundDarker }}>
                                            {card.value}
                                        </Typography>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <Card elevation={3} sx={{ borderRadius: 3 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ color: styledTheme.colors.backgroundDarker }}>
                            RSVP Status (All Invitees)
                        </Typography>
                        <Box sx={{ width: '100%', height: 250 }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={rsvpPieData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        label={{ fontSize: 12, fill: styledTheme.colors.backgroundDarker }}
                                    >
                                        {rsvpPieData.map((entry, index) => (
                                            <Cell
                                                key={index}
                                                fill={COLORS[index % COLORS.length]}
                                                stroke={theme.palette.background.paper}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip wrapperStyle={{ borderRadius: 8, boxShadow: theme.shadows[4] }} />
                                    <Legend verticalAlign="bottom" wrapperStyle={{ paddingTop: theme.spacing(1) }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </Box>
                        <Typography variant="body2" sx={{ mt: 1, color: styledTheme.colors.backgroundDarker }}>
                            Total invitees: {summary.totalInvitees}. RSVP'd: {summary.totalRsvped}. Not RSVP'd:{' '}
                            {summary.totalNotRsvped}.
                        </Typography>
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <Card elevation={3} sx={{ borderRadius: 3 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom sx={{color: styledTheme.colors.backgroundDarker}}>
                            Coming Breakdown
                        </Typography>
                        <Box sx={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <BarChart data={comingBarData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                    <XAxis
                                        dataKey="category"
                                        tick={{ fill: styledTheme.colors.backgroundDarker }}
                                        stroke={theme.palette.divider}
                                    />
                                    <YAxis
                                        tick={{ fill: styledTheme.colors.backgroundDarker }}
                                        stroke={theme.palette.divider}
                                    />
                                    <Tooltip wrapperStyle={{ borderRadius: 8, boxShadow: theme.shadows[4] }} />
                                    <Legend />
                                    <Bar dataKey="Coming" stackId="a" fill={styledTheme.colors.backgroundDarker} name="Coming" />
                                    <Bar
                                        dataKey="NotComing"
                                        stackId="a"
                                        fill={styledTheme.colors.backgroundLighter || theme.palette.warning.main}
                                        name="Not Coming"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </Box>
                        <Typography variant="body2" sx={{ mt: 1, color: styledTheme.colors.backgroundDarker }}>
                            Main Guests coming: {summary.mainComing} / {summary.totalUsers}. Partners coming:{' '}
                            {summary.partnerComing} / {summary.totalPartners}. Children coming:{' '}
                            {summary.childrenComing} / {summary.totalChildren}.
                        </Typography>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Dietary Requirements */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <Card elevation={3} sx={{ borderRadius: 3 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom sx={{color: styledTheme.colors.backgroundDarker}}>
                            Dietary Selections
                        </Typography>
                        <Box sx={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>

                            <BarChart data={dietaryData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                    <XAxis
                                        dataKey="name"
                                        tick={{ fill: styledTheme.colors.backgroundDarker }}
                                        stroke={theme.palette.divider}
                                    />
                                    <YAxis
                                        tick={{ fill: styledTheme.colors.backgroundDarker }}
                                        stroke={theme.palette.divider}
                                    />
                                    <Tooltip wrapperStyle={{ borderRadius: 8, boxShadow: theme.shadows[4] }} />
                                    <Legend />
                                    <Bar dataKey="value" stackId="a" fill={styledTheme.colors.backgroundDarker} name="Count" />
                                </BarChart>
                            </ResponsiveContainer>
                        </Box>
                        <Typography variant="body2" sx={{ mt: 1, color: styledTheme.colors.backgroundDarker }}>
                            Breakdown of food selections across all RSVP records (main, partner, children).
                        </Typography>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Arrival Day */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <Card elevation={3} sx={{ borderRadius: 3 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom sx={{color: styledTheme.colors.backgroundDarker}}>
                            Arrival Day Selections
                        </Typography>
                        <Box sx={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>

                            <BarChart data={arrivalData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                    <XAxis
                                        dataKey="name"
                                        tick={{ fill: styledTheme.colors.backgroundDarker }}
                                        stroke={theme.palette.divider}
                                    />
                                    <YAxis
                                        tick={{ fill: styledTheme.colors.backgroundDarker }}
                                        stroke={theme.palette.divider}
                                    />
                                    <Tooltip wrapperStyle={{ borderRadius: 8, boxShadow: theme.shadows[4] }} />
                                    <Legend />
                                    <Bar dataKey="value" stackId="a" fill={styledTheme.colors.backgroundDarker} name="Count" />
                                </BarChart>
                            </ResponsiveContainer>
                        </Box>
                        <Typography variant="body2" sx={{ mt: 1, color: styledTheme.colors.backgroundDarker }}>
                            Breakdown of food selections across all RSVP records (main, partner, children).
                        </Typography>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Food Friday */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <Card elevation={3} sx={{ borderRadius: 3 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom sx={{color: styledTheme.colors.backgroundDarker}}>
                            Food on Friday
                        </Typography>
                        <Box sx={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                            <BarChart data={foodData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                    <XAxis
                                        dataKey="name"
                                        tick={{ fill: styledTheme.colors.backgroundDarker }}
                                        stroke={theme.palette.divider}
                                    />
                                    <YAxis
                                        tick={{ fill: styledTheme.colors.backgroundDarker }}
                                        stroke={theme.palette.divider}
                                    />
                                    <Tooltip wrapperStyle={{ borderRadius: 8, boxShadow: theme.shadows[4] }} />
                                    <Legend />
                                    <Bar dataKey="value" stackId="a" fill={styledTheme.colors.backgroundDarker} name="Count" />
                                </BarChart>
                            </ResponsiveContainer>
                        </Box>
                        <Typography variant="body2" sx={{ mt: 1, color: styledTheme.colors.backgroundDarker }}>
                            Those who are arriving Friday and want to purchase food. Total is ...
                        </Typography>
                    </CardContent>
                </Card>
            </motion.div>

        </Box>
    );
}
