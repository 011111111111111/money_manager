import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { PlusCircle, Users, Share2, Copy, Check, Calendar, User } from 'lucide-react';
import { useGroupEvents } from '@/hooks/useGroupEvents';
import { useMembers } from '@/hooks/useMembers';
import { CreateGroupEventRequest } from '@/types/expense';

const SharedEventManager = () => {
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [isJoiningEvent, setIsJoiningEvent] = useState(false);
  const [newEvent, setNewEvent] = useState<CreateGroupEventRequest>({ name: '', description: '', createdBy: '', members: [] });
  const [joinData, setJoinData] = useState({ shareCode: '', memberId: '' });
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  
  const { events, isLoading, createEvent, joinEvent, isCreating, isJoining } = useGroupEvents();
  const { members } = useMembers();

  const handleCreateEvent = () => {
    if (!newEvent.name.trim() || !newEvent.createdBy) return;
    
    createEvent({
      name: newEvent.name.trim(),
      description: newEvent.description.trim() || undefined,
      createdBy: newEvent.createdBy,
      members: newEvent.members,
    });
    
    setNewEvent({ name: '', description: '', createdBy: '', members: [] });
    setIsCreatingEvent(false);
  };

  const handleJoinEvent = () => {
    if (!joinData.shareCode.trim() || !joinData.memberId) return;
    
    joinEvent({
      shareCode: joinData.shareCode.trim().toUpperCase(),
      memberId: joinData.memberId,
    });
    
    setJoinData({ shareCode: '', memberId: '' });
    setIsJoiningEvent(false);
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
                  placeholder="Enter event name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="event-description">Description</Label>
                <Textarea
                  id="event-description"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter event description"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="event-creator">Event Creator *</Label>
                <Select
                  value={newEvent.createdBy}
                  onValueChange={(value) => setNewEvent(prev => ({ ...prev, createdBy: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select event creator" />
                  </SelectTrigger>
                  <SelectContent>
                    {members.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Add Members</Label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {members.map((member) => (
                    <div key={member.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={member.id}
                        checked={newEvent.members.includes(member.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setNewEvent(prev => ({ 
                              ...prev, 
                              members: [...prev.members, member.id] 
                            }));
                          } else {
                            setNewEvent(prev => ({ 
                              ...prev, 
                              members: prev.members.filter(id => id !== member.id) 
                            }));
                          }
                        }}
                      />
                      <Label htmlFor={member.id} className="text-sm">{member.name}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handleCreateEvent}
                  disabled={!newEvent.name.trim() || !newEvent.createdBy || isCreating}
                  size="sm"
                >
                  {isCreating ? 'Creating...' : 'Create Event'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsCreatingEvent(false);
                    setNewEvent({ name: '', description: '', createdBy: '', members: [] });
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

      {/* Join Event Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Join Shared Event
          </CardTitle>
          <Button 
            onClick={() => setIsJoiningEvent(true)}
            size="sm"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Join Event
          </Button>
        </CardHeader>
        <CardContent>
          {isJoiningEvent && (
            <div className="space-y-4 p-4 border rounded-lg mb-4">
              <div className="space-y-2">
                <Label htmlFor="share-code">Share Code *</Label>
                <Input
                  id="share-code"
                  value={joinData.shareCode}
                  onChange={(e) => setJoinData(prev => ({ ...prev, shareCode: e.target.value }))}
                  placeholder="Enter 6-digit share code"
                  maxLength={6}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="join-member">Your Member ID *</Label>
                <Select
                  value={joinData.memberId}
                  onValueChange={(value) => setJoinData(prev => ({ ...prev, memberId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your member profile" />
                  </SelectTrigger>
                  <SelectContent>
                    {members.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handleJoinEvent}
                  disabled={!joinData.shareCode.trim() || !joinData.memberId || isJoining}
                  size="sm"
                >
                  {isJoining ? 'Joining...' : 'Join Event'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsJoiningEvent(false);
                    setJoinData({ shareCode: '', memberId: '' });
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
            <Users className="w-5 h-5" />
            Your Shared Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {events.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No shared events yet. Create or join an event to get started!
              </div>
            ) : (
              events.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{event.name}</h3>
                      <Badge variant="secondary">
                        {event.memberCount || 0} members
                      </Badge>
                    </div>
                    {event.description && (
                      <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {event.creatorName || 'Unknown'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(event.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono">
                      {event.shareCode}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(event.shareCode)}
                      className="h-8 w-8 p-0"
                    >
                      {copiedCode === event.shareCode ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
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

export default SharedEventManager; 