import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, DollarSign, Calendar, Users, ArrowLeft } from 'lucide-react';
import { useSharedEventByCode } from '@/hooks/useSharedEvents';
import { SharedExpense } from '@/types/expense';
import { Link } from 'react-router-dom';

const SharedEventPage = () => {
  const { shareCode } = useParams<{ shareCode: string }>();
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    paidBy: '',
    splitBetween: [] as string[],
    date: new Date().toISOString().split('T')[0],
    category: '',
    paymentMode: '',
    createdBy: ''
  });

  const { eventDetails, isLoading, error, addExpense, isAddingExpense: isAdding } = useSharedEventByCode(shareCode || '');

  const handleAddExpense = () => {
    if (!newExpense.description.trim() || !newExpense.amount || !newExpense.paidBy || !newExpense.createdBy) return;
    
    addExpense({
      description: newExpense.description.trim(),
      amount: parseFloat(newExpense.amount),
      paidBy: newExpense.paidBy,
      splitBetween: newExpense.splitBetween,
      date: newExpense.date,
      category: newExpense.category || 'Other',
      paymentMode: newExpense.paymentMode || 'Cash',
      createdBy: newExpense.createdBy,
    });
    
    setNewExpense({
      description: '',
      amount: '',
      paidBy: '',
      splitBetween: [],
      date: new Date().toISOString().split('T')[0],
      category: '',
      paymentMode: '',
      createdBy: ''
    });
    setIsAddingExpense(false);
  };

  const getUniqueParticipants = () => {
    if (!eventDetails?.expenses) return [];
    const participants = new Set<string>();
    eventDetails.expenses.forEach(expense => {
      participants.add(expense.paidBy);
      participants.add(expense.createdBy);
      expense.splitBetween.forEach(person => participants.add(person));
    });
    return Array.from(participants).filter(Boolean);
  };

  const participants = getUniqueParticipants();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500">Loading shared event...</div>
        </div>
      </div>
    );
  }

  if (error || !eventDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">Event not found or inactive</div>
          <Link to="/">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const totalAmount = eventDetails.expenses?.reduce((sum, expense) => sum + expense.amount, 0) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{eventDetails.name}</h1>
            {eventDetails.description && (
              <p className="text-lg text-gray-600 mb-4">{eventDetails.description}</p>
            )}
            <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Created {new Date(eventDetails.createdAt).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <DollarSign className="w-3 h-3" />
                Total: ₹{totalAmount.toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {eventDetails.expenses?.length || 0} expenses
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Add Expense Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5" />
                Add Expense
              </CardTitle>
              <Button 
                onClick={() => setIsAddingExpense(true)}
                size="sm"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Expense
              </Button>
            </CardHeader>
            <CardContent>
              {isAddingExpense && (
                <div className="space-y-4 p-4 border rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expense-description">Description *</Label>
                      <Input
                        id="expense-description"
                        value={newExpense.description}
                        onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="What was this expense for?"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expense-amount">Amount (₹) *</Label>
                      <Input
                        id="expense-amount"
                        type="number"
                        value={newExpense.amount}
                        onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expense-paidBy">Paid By *</Label>
                      <Input
                        id="expense-paidBy"
                        value={newExpense.paidBy}
                        onChange={(e) => setNewExpense(prev => ({ ...prev, paidBy: e.target.value }))}
                        placeholder="Who paid for this?"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expense-createdBy">Added By *</Label>
                      <Input
                        id="expense-createdBy"
                        value={newExpense.createdBy}
                        onChange={(e) => setNewExpense(prev => ({ ...prev, createdBy: e.target.value }))}
                        placeholder="Your name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expense-category">Category</Label>
                      <Select
                        value={newExpense.category}
                        onValueChange={(value) => setNewExpense(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Food">Food</SelectItem>
                          <SelectItem value="Transport">Transport</SelectItem>
                          <SelectItem value="Accommodation">Accommodation</SelectItem>
                          <SelectItem value="Entertainment">Entertainment</SelectItem>
                          <SelectItem value="Shopping">Shopping</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expense-paymentMode">Payment Mode</Label>
                      <Select
                        value={newExpense.paymentMode}
                        onValueChange={(value) => setNewExpense(prev => ({ ...prev, paymentMode: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment mode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Cash">Cash</SelectItem>
                          <SelectItem value="Card">Card</SelectItem>
                          <SelectItem value="UPI">UPI</SelectItem>
                          <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Split Between (comma-separated names)</Label>
                    <Input
                      value={newExpense.splitBetween.join(', ')}
                      onChange={(e) => setNewExpense(prev => ({ 
                        ...prev, 
                        splitBetween: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                      }))}
                      placeholder="John, Jane, Mike (leave empty if paid by one person)"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleAddExpense}
                      disabled={!newExpense.description.trim() || !newExpense.amount || !newExpense.paidBy || !newExpense.createdBy || isAdding}
                      size="sm"
                    >
                      {isAdding ? 'Adding...' : 'Add Expense'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setIsAddingExpense(false);
                        setNewExpense({
                          description: '',
                          amount: '',
                          paidBy: '',
                          splitBetween: [],
                          date: new Date().toISOString().split('T')[0],
                          category: '',
                          paymentMode: '',
                          createdBy: ''
                        });
                      }}
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Expenses List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                All Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {!eventDetails.expenses || eventDetails.expenses.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium mb-2">No expenses yet</p>
                    <p className="text-sm">Be the first to add an expense to this shared event!</p>
                  </div>
                ) : (
                  eventDetails.expenses.map((expense) => (
                    <div key={expense.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-medium">{expense.description}</h3>
                          <p className="text-sm text-gray-600">
                            Paid by {expense.paidBy} • Added by {expense.createdBy}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-lg">₹{expense.amount.toLocaleString()}</div>
                          <div className="text-xs text-gray-500">{new Date(expense.date).toLocaleDateString()}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        {expense.category && (
                          <Badge variant="secondary">{expense.category}</Badge>
                        )}
                        {expense.paymentMode && (
                          <Badge variant="outline">{expense.paymentMode}</Badge>
                        )}
                        {expense.splitBetween.length > 0 && (
                          <Badge variant="outline">
                            Split: {expense.splitBetween.join(', ')}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Participants Summary */}
          {participants.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Participants
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {participants.map((participant) => (
                    <Badge key={participant} variant="outline">
                      {participant}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SharedEventPage; 