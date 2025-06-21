import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, User, Mail, Copy, Check } from 'lucide-react';
import { useMembers } from '@/hooks/useMembers';
import { Member } from '@/types/expense';

const MemberManager = () => {
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', email: '' });
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const { members, isLoading, createMember, isCreating } = useMembers();

  const handleAddMember = () => {
    if (!newMember.name.trim()) return;
    
    createMember({
      name: newMember.name.trim(),
      email: newMember.email.trim() || undefined,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${newMember.name}`,
    });
    
    setNewMember({ name: '', email: '' });
    setIsAddingMember(false);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(text);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-gray-500">Loading members...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Manage Members
          </CardTitle>
          <Button 
            onClick={() => setIsAddingMember(true)}
            size="sm"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Member
          </Button>
        </CardHeader>
        <CardContent>
          {isAddingMember && (
            <div className="space-y-4 p-4 border rounded-lg mb-4">
              <div className="space-y-2">
                <Label htmlFor="member-name">Name *</Label>
                <Input
                  id="member-name"
                  value={newMember.name}
                  onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter member name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="member-email">Email (optional)</Label>
                <Input
                  id="member-email"
                  type="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email address"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handleAddMember}
                  disabled={!newMember.name.trim() || isCreating}
                  size="sm"
                >
                  {isCreating ? 'Adding...' : 'Add Member'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsAddingMember(false);
                    setNewMember({ name: '', email: '' });
                  }}
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {members.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No members added yet. Add your first member to get started!
              </div>
            ) : (
              members.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>
                        {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{member.name}</div>
                      {member.email && (
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {member.email}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono text-xs">
                      ID: {member.id.slice(0, 8)}...
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(member.id)}
                      className="h-8 w-8 p-0"
                    >
                      {copiedId === member.id ? (
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

export default MemberManager; 