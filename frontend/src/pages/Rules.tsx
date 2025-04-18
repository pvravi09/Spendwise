import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  useTheme,
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
  SelectChangeEvent,
  IconButton,
  Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  AccountBalance as AccountBalanceIcon,
  Savings as SavingsIcon,
  TrendingUp as TrendingUpIcon,
  Add as AddIcon,
  Check as CheckIcon
} from '@mui/icons-material';

const GradientCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  color: theme.palette.primary.contrastText,
  height: '100%',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '60px',
  height: '60px',
  borderRadius: '50%',
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  marginBottom: theme.spacing(2),
}));

interface BudgetRule {
  id: string;
  name: string;
  description: string;
  allocations: {
    needs: number;
    wants: number;
    savings: number;
  };
  isSelected?: boolean;
}

const defaultRules: BudgetRule[] = [
  {
    id: '1',
    name: '50/30/20 Rule',
    description: 'A balanced approach where 50% goes to needs, 30% to wants, and 20% to savings/debt.',
    allocations: {
      needs: 50,
      wants: 30,
      savings: 20
    }
  },
  {
    id: '2',
    name: 'Zero-Based Budgeting',
    description: 'Every dollar has a purpose. Income minus expenses equals zero, giving you maximum control.',
    allocations: {
      needs: 0,
      wants: 0,
      savings: 0
    }
  },
  {
    id: '3',
    name: '80/20 Rule',
    description: 'Save 20% first, then use the remaining 80% for all other expenses.',
    allocations: {
      needs: 0,
      wants: 80,
      savings: 20
    }
  }
];

const Rules: React.FC = () => {
  const theme = useTheme();
  const [rules, setRules] = useState<BudgetRule[]>(defaultRules);
  const [openDialog, setOpenDialog] = useState(false);
  const [newRule, setNewRule] = useState<BudgetRule>({
    id: Date.now().toString(),
    name: '',
    description: '',
    allocations: {
      needs: 0,
      wants: 0,
      savings: 0
    }
  });

  const handleCreateRule = () => {
    setRules([...rules, newRule]);
    setOpenDialog(false);
    setNewRule({
      id: Date.now().toString(),
      name: '',
      description: '',
      allocations: {
        needs: 0,
        wants: 0,
        savings: 0
      }
    });
  };

  const handleSelectRule = (ruleId: string) => {
    setRules(rules.map(rule => ({
      ...rule,
      isSelected: rule.id === ruleId
    })));
  };

  const handleAllocationChange = (event: SelectChangeEvent<number>, category: keyof BudgetRule['allocations']) => {
    setNewRule({
      ...newRule,
      allocations: {
        ...newRule.allocations,
        [category]: Number(event.target.value)
      }
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box textAlign="center" mb={6}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ 
          fontWeight: 'bold',
          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Budgeting Rules
        </Typography>
        <Typography variant="h6" color="text.secondary" mb={4}>
          Choose or create a budgeting rule that works best for you
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
          sx={{ mb: 4 }}
        >
          Create Custom Rule
        </Button>
      </Box>

      <Grid container spacing={4}>
        {rules.map((rule) => (
          <Grid item xs={12} sm={6} md={4} key={rule.id}>
            <GradientCard>
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                    {rule.name}
                  </Typography>
                  {rule.isSelected && (
                    <Tooltip title="Currently Selected">
                      <CheckIcon color="success" />
                    </Tooltip>
                  )}
                </Box>
                <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
                  {rule.description}
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Allocations:
                  </Typography>
                  <Typography variant="body2">
                    Needs: {rule.allocations.needs}%
                  </Typography>
                  <Typography variant="body2">
                    Wants: {rule.allocations.wants}%
                  </Typography>
                  <Typography variant="body2">
                    Savings: {rule.allocations.savings}%
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  onClick={() => handleSelectRule(rule.id)}
                  sx={{ 
                    color: 'white',
                    borderColor: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  {rule.isSelected ? 'Selected' : 'Select Rule'}
                </Button>
              </CardContent>
            </GradientCard>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Create Custom Budgeting Rule</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Rule Name"
            fullWidth
            value={newRule.name}
            onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={newRule.description}
            onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
            sx={{ mb: 2 }}
          />
          <Typography variant="subtitle1" gutterBottom>
            Allocations (must total 100%)
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel>Needs (%)</InputLabel>
                <Select
                  value={newRule.allocations.needs}
                  onChange={(e) => handleAllocationChange(e, 'needs')}
                  label="Needs (%)"
                >
                  {[...Array(101)].map((_, i) => (
                    <MenuItem key={i} value={i}>{i}%</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel>Wants (%)</InputLabel>
                <Select
                  value={newRule.allocations.wants}
                  onChange={(e) => handleAllocationChange(e, 'wants')}
                  label="Wants (%)"
                >
                  {[...Array(101)].map((_, i) => (
                    <MenuItem key={i} value={i}>{i}%</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel>Savings (%)</InputLabel>
                <Select
                  value={newRule.allocations.savings}
                  onChange={(e) => handleAllocationChange(e, 'savings')}
                  label="Savings (%)"
                >
                  {[...Array(101)].map((_, i) => (
                    <MenuItem key={i} value={i}>{i}%</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleCreateRule}
            disabled={
              !newRule.name ||
              !newRule.description ||
              (newRule.allocations.needs + newRule.allocations.wants + newRule.allocations.savings) !== 100
            }
          >
            Create Rule
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Rules; 