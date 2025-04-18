import React, { useState } from 'react';
import {
  Box,
  Card,
  Typography,
  Button,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  LinearProgress,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

interface Category {
  id: string;
  name: string;
  priority: number;
  budget: number;
  spent: number;
  isPaid?: boolean;
}

const Dashboard: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([
    {
      id: '1',
      name: 'Rent',
      priority: 1,
      budget: 11000,
      spent: 0,
      isPaid: false,
    },
    {
      id: '2',
      name: 'Entertainment',
      priority: 2,
      budget: 11000,
      spent: 6000,
    },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [newCategory, setNewCategory] = useState<Partial<Category>>({
    priority: 1,
  });

  const handleAddCategory = () => {
    if (newCategory.name && newCategory.budget && newCategory.priority) {
      setCategories([
        ...categories,
        {
          id: Date.now().toString(),
          name: newCategory.name,
          priority: newCategory.priority,
          budget: newCategory.budget,
          spent: 0,
        },
      ]);
      setOpenDialog(false);
      setNewCategory({ priority: 1 });
    }
  };

  const handleSpendingChange = (id: string, amount: number) => {
    setCategories(
      categories.map((cat) =>
        cat.id === id
          ? { ...cat, spent: Math.max(0, Math.min(cat.spent + amount, cat.budget)) }
          : cat
      )
    );
  };

  const getProgressColor = (spent: number, budget: number) => {
    const percentage = (spent / budget) * 100;
    if (percentage < 10) return 'error.main';
    if (percentage > 90) return 'success.main';
    return 'primary.main';
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Dashboard
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Add Category
        </Button>
      </Box>

      <Typography variant="h6" sx={{ mb: 2 }}>
        Rule Selected: 50/30/20
      </Typography>

      <Grid container spacing={3}>
        {categories.map((category) => (
          <Grid item xs={12} md={6} lg={4} key={category.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                }}
              >
                <IconButton
                  size="small"
                  sx={{ position: 'absolute', top: 8, right: 8 }}
                >
                  <EditIcon />
                </IconButton>

                <Typography variant="h6" gutterBottom>
                  {category.name}
                </Typography>

                <Typography color="text.secondary" gutterBottom>
                  Priority: {category.priority}
                </Typography>

                {category.priority === 1 ? (
                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant={category.isPaid ? 'contained' : 'outlined'}
                      color={category.isPaid ? 'success' : 'error'}
                      onClick={() =>
                        setCategories(
                          categories.map((cat) =>
                            cat.id === category.id
                              ? { ...cat, isPaid: !cat.isPaid }
                              : cat
                          )
                        )
                      }
                      fullWidth
                    >
                      {category.isPaid ? 'Paid' : 'Not Paid'}
                    </Button>
                  </Box>
                ) : (
                  <>
                    <Box sx={{ my: 2 }}>
                      <LinearProgress
                        variant="determinate"
                        value={(category.spent / category.budget) * 100}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: 'grey.200',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: getProgressColor(
                              category.spent,
                              category.budget
                            ),
                          },
                        }}
                      />
                    </Box>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mt: 1,
                      }}
                    >
                      <Typography>
                        {category.spent}/{category.budget}
                      </Typography>
                      <Box>
                        <IconButton
                          size="small"
                          onClick={() => handleSpendingChange(category.id, -1000)}
                        >
                          -
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleSpendingChange(category.id, 1000)}
                        >
                          +
                        </IconButton>
                      </Box>
                    </Box>
                  </>
                )}
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Monthly Summary
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 2 }}>
              <Typography color="text.secondary">Needs Remaining</Typography>
              <Typography variant="h5">₹15,000</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 2 }}>
              <Typography color="text.secondary">Wants Remaining</Typography>
              <Typography variant="h5">₹9,000</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 2 }}>
              <Typography color="text.secondary">Savings Remaining</Typography>
              <Typography variant="h5">₹6,000</Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Category</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            fullWidth
            value={newCategory.name || ''}
            onChange={(e) =>
              setNewCategory({ ...newCategory, name: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            select
            margin="dense"
            label="Priority"
            fullWidth
            value={newCategory.priority || 1}
            onChange={(e) =>
              setNewCategory({
                ...newCategory,
                priority: Number(e.target.value),
              })
            }
            sx={{ mb: 2 }}
          >
            <MenuItem value={1}>Priority 1 (Essential)</MenuItem>
            <MenuItem value={2}>Priority 2 (Lifestyle)</MenuItem>
            <MenuItem value={3}>Priority 3 (Savings)</MenuItem>
          </TextField>
          <TextField
            type="number"
            margin="dense"
            label="Budget"
            fullWidth
            value={newCategory.budget || ''}
            onChange={(e) =>
              setNewCategory({
                ...newCategory,
                budget: Number(e.target.value),
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddCategory} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard; 