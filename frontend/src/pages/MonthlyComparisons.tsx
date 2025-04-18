import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  useTheme,
  Tabs,
  Tab,
  Paper,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  TrendingUp as TrendingUpIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend, CategoryScale, LinearScale, BarElement, Title, ChartData, ChartOptions } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  ChartTooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const GradientPaper = styled(Paper)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
}));

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

interface CategoryData {
  name: string;
  amount: number;
  percentage: number;
  priority: number;
}

interface MonthlyData {
  month: string;
  categories: CategoryData[];
  totalIncome: number;
  totalExpenses: number;
  savings: number;
}

interface Recommendation {
  title: string;
  description: string;
  icon: React.ReactElement;
  severity: 'high' | 'medium' | 'low';
  action: string;
}

const MonthlyComparisons: React.FC = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstMonth, setIsFirstMonth] = useState(true);
  const [showNewUserDialog, setShowNewUserDialog] = useState(true);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>('');

  // Sample data - replace with actual API calls
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setMonthlyData([
        {
          month: 'March 2024',
          categories: [
            { name: 'Rent', amount: 1200, percentage: 30, priority: 1 },
            { name: 'Groceries', amount: 400, percentage: 10, priority: 1 },
            { name: 'Utilities', amount: 200, percentage: 5, priority: 1 },
            { name: 'Dining Out', amount: 300, percentage: 7.5, priority: 2 },
            { name: 'Entertainment', amount: 200, percentage: 5, priority: 2 },
            { name: 'Savings', amount: 800, percentage: 20, priority: 3 },
          ],
          totalIncome: 4000,
          totalExpenses: 3200,
          savings: 800,
        },
        {
          month: 'February 2024',
          categories: [
            { name: 'Rent', amount: 1200, percentage: 30, priority: 1 },
            { name: 'Groceries', amount: 450, percentage: 11.25, priority: 1 },
            { name: 'Utilities', amount: 180, percentage: 4.5, priority: 1 },
            { name: 'Dining Out', amount: 350, percentage: 8.75, priority: 2 },
            { name: 'Entertainment', amount: 220, percentage: 5.5, priority: 2 },
            { name: 'Savings', amount: 600, percentage: 15, priority: 3 },
          ],
          totalIncome: 4000,
          totalExpenses: 3400,
          savings: 600,
        },
      ]);
      setSelectedMonth('March 2024');
      setIsLoading(false);
    }, 1000);
  }, []);

  const recommendations: Recommendation[] = [
    {
      title: 'Reduce Dining Out',
      description: 'Your dining expenses are 15% above average. Consider cooking at home more often.',
      icon: <WarningIcon />,
      severity: 'high',
      action: 'Set a monthly limit',
    },
    {
      title: 'Increase Savings',
      description: 'You\'re saving 18% of your income. Try to reach 20% for better financial security.',
      icon: <TrendingUpIcon />,
      severity: 'medium',
      action: 'Adjust savings goal',
    },
    {
      title: 'Good Job on Utilities',
      description: 'Your utility expenses are well within the recommended range.',
      icon: <CheckCircleIcon />,
      severity: 'low',
      action: 'Keep it up!',
    },
  ];

  const currentMonthData: ChartData<'pie'> = {
    labels: monthlyData[0]?.categories.map(cat => cat.name) || [],
    datasets: [
      {
        data: monthlyData[0]?.categories.map(cat => cat.amount) || [],
        backgroundColor: [
          theme.palette.primary.main,
          theme.palette.secondary.main,
          theme.palette.success.main,
          theme.palette.warning.main,
          theme.palette.error.main,
          theme.palette.info.main,
        ],
        borderColor: [
          theme.palette.primary.dark,
          theme.palette.secondary.dark,
          theme.palette.success.dark,
          theme.palette.warning.dark,
          theme.palette.error.dark,
          theme.palette.info.dark,
        ],
        borderWidth: 1,
      },
    ],
  };

  const comparisonData: ChartData<'bar'> = {
    labels: monthlyData.map(data => data.month),
    datasets: [
      {
        label: 'Priority 1 (Essentials)',
        data: monthlyData.map(data => 
          data.categories
            .filter(cat => cat.priority === 1)
            .reduce((sum, cat) => sum + cat.amount, 0)
        ),
        backgroundColor: theme.palette.primary.main,
      },
      {
        label: 'Priority 2 (Lifestyle)',
        data: monthlyData.map(data => 
          data.categories
            .filter(cat => cat.priority === 2)
            .reduce((sum, cat) => sum + cat.amount, 0)
        ),
        backgroundColor: theme.palette.secondary.main,
      },
      {
        label: 'Priority 3 (Savings)',
        data: monthlyData.map(data => 
          data.categories
            .filter(cat => cat.priority === 3)
            .reduce((sum, cat) => sum + cat.amount, 0)
        ),
        backgroundColor: theme.palette.success.main,
      },
    ],
  };

  const barOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        beginAtZero: true,
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.raw as number;
            const data = context.dataset.data as number[];
            const total = data.reduce((sum, val) => sum + (val || 0), 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
            return `${label}: $${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleMonthChange = (event: SelectChangeEvent) => {
    setSelectedMonth(event.target.value);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {isFirstMonth && (
        <Alert severity="info" sx={{ mb: 4 }}>
          Welcome to Monthly Comparisons! This feature will be more useful once you have multiple months of data.
        </Alert>
      )}

      <Box textAlign="center" mb={6}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ 
          fontWeight: 'bold',
          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Monthly Comparisons
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Track your spending patterns and get personalized recommendations
        </Typography>
      </Box>

      <Paper sx={{ width: '100%', mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Current Month" icon={<PieChartIcon />} />
          <Tab label="Monthly Comparison" icon={<BarChartIcon />} />
          <Tab label="Recommendations" icon={<TrendingUpIcon />} />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <StyledCard>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Typography variant="h5" component="h2" sx={{ flexGrow: 1 }}>
                      Current Month Breakdown
                    </Typography>
                    <Tooltip title="Shows your spending distribution for the current month">
                      <IconButton>
                        <InfoIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Box sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Pie data={currentMonthData} />
                  </Box>
                </CardContent>
              </StyledCard>
            </Grid>
            <Grid item xs={12} md={6}>
              <GradientPaper>
                <Typography variant="h6" gutterBottom>
                  Monthly Summary
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="body1">
                      Total Income: ${monthlyData[0]?.totalIncome.toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body1">
                      Total Expenses: ${monthlyData[0]?.totalExpenses.toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body1">
                      Savings Rate: {((monthlyData[0]?.savings || 0) / (monthlyData[0]?.totalIncome || 1) * 100).toFixed(1)}%
                    </Typography>
                  </Grid>
                </Grid>
              </GradientPaper>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <StyledCard>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Typography variant="h5" component="h2" sx={{ flexGrow: 1 }}>
                      Monthly Comparison
                    </Typography>
                    <FormControl sx={{ minWidth: 200, mr: 2 }}>
                      <InputLabel>Select Month</InputLabel>
                      <Select
                        value={selectedMonth}
                        onChange={handleMonthChange}
                        label="Select Month"
                      >
                        {monthlyData.map((data) => (
                          <MenuItem key={data.month} value={data.month}>
                            {data.month}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <Tooltip title="Compare your spending patterns over time">
                      <IconButton>
                        <InfoIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Box sx={{ height: 400 }}>
                    <Bar
                      data={comparisonData}
                      options={barOptions}
                    />
                  </Box>
                </CardContent>
              </StyledCard>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            {recommendations.map((rec, index) => (
              <Grid item xs={12} md={4} key={index}>
                <StyledCard>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      {React.cloneElement(rec.icon, {
                        color: rec.severity === 'high' ? 'error' : 
                               rec.severity === 'medium' ? 'warning' : 'success'
                      })}
                      <Typography variant="h6" component="h3" sx={{ ml: 1 }}>
                        {rec.title}
                      </Typography>
                    </Box>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                      {rec.description}
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      color={rec.severity === 'high' ? 'error' : 
                             rec.severity === 'medium' ? 'warning' : 'success'}
                    >
                      {rec.action}
                    </Button>
                  </CardContent>
                </StyledCard>
              </Grid>
            ))}
          </Grid>
        </TabPanel>
      </Paper>

      <Dialog open={showNewUserDialog} onClose={() => setShowNewUserDialog(false)}>
        <DialogTitle>Welcome to Monthly Comparisons!</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            This feature helps you track your spending patterns and get personalized recommendations.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You'll see more detailed insights once you have multiple months of data.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowNewUserDialog(false)}>Got it!</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MonthlyComparisons; 