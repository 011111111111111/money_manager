import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Share2, Copy, Check, Calendar, DollarSign, Users } from 'lucide-react';
import { useSharedEvents } from '@/hooks/useSharedEvents';
import { CreateSharedEventRequest } from '@/types/expense';

const SimpleSharedEventManager = () => {
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [newEvent, setNewEvent] = useState<CreateSharedEventRequest>({ name: '', description: '' });
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  
  const { events, isLoading, createEvent, isCreating } = useSharedEvents();

  const handleCreateEvent = () => {
    if (!newEvent.name.trim()) return;
    
    createEvent({
      name: newEvent.name.trim(),
      description: newEvent.description.trim() || undefined,
    });
    
    setNewEvent({ name: '', description: '' });
    setIsCreatingEvent(false);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(text);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const copyEventLink = (shareCode: string) => {
    const link = `${window.location.origin}/shared/${shareCode}`;
    copyToClipboard(link);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-gray-500">Loading events...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Create Event Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5" />
            Create Shared Event
          </CardTitle>
          <Button 
            onClick={() => setIsCreatingEvent(true)}
            size="sm"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            New Event
          </Button>
        </CardHeader>
        <CardContent>
          {isCreatingEvent && (
            <div className="space-y-4 p-4 border rounded-lg mb-4">
              <div className="space-y-2">
                <Label htmlFor="event-name">Event Name *</Label>
                <Input
                  id="event-name"
                  value={newEvent.name}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter event name (e.g., Trip to Goa, House Party)"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="event-description">Description</Label>
                <Textarea
                  id="event-description"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter event description (optional)"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handleCreateEvent}
                  disabled={!newEvent.name.trim() || isCreating}
                  size="sm"
                >
                  {isCreating ? 'Creating...' : 'Create Event'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsCreatingEvent(false);
                    setNewEvent({ name: '', description: '' });
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

      {/* Events List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Your Shared Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {events.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <Share2 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium mb-2">No shared events yet</p>
                <p className="text-sm">Create your first shared event to start collaborating on expenses!</p>
              </div>
            ) : (
              events.map((event) => (
                <div key={event.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{event.name}</h3>
                      {event.description && (
                        <p className="text-gray-600 text-sm mb-2">{event.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(event.createdAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          ₹{(event.totalAmount || 0).toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {event.expenseCount || 0} expenses
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono text-sm">
                        {event.shareCode}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyEventLink(event.shareCode)}
                      className="flex items-center gap-2"
                    >
                      {copiedCode === `${window.location.origin}/shared/${event.shareCode}` ? (
                        <>
                          <Check className="w-4 h-4 text-green-600" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy Link
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(event.shareCode)}
                      className="flex items-center gap-2"
                    >
                      {copiedCode === event.shareCode ? (
                        <>
                          <Check className="w-4 h-4 text-green-600" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy Code
                        </>
                      )}
                    </Button>
                  </div>
                  
                  <div className="mt-3 text-xs text-gray-500">
                    <p>Share this link or code with friends to collaborate on expenses!</p>
                    <p className="mt-1">
                      <strong>Link:</strong> {window.location.origin}/shared/{event.shareCode}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleSharedEventManager; 