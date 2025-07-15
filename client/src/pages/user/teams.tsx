import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import UserHeader from "@/components/layout/user-header";
import TeamModal from "@/components/team-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import {
  Users,
  Plus,
  Search,
  Crown,
  Trophy,
  TrendingUp,
  Edit,
  Share2,
  UserPlus,
  MoreVertical,
  Copy,
  Settings,
  LogOut,
} from "lucide-react";
import type { Team } from "@shared/schema";

export default function Teams() {
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [teamCode, setTeamCode] = useState("");

  const { data: teams = [] } = useQuery<Team[]>({
    queryKey: ["/api/teams"],
  });

  // Mock team members data - in real app this would come from API
  const teamMembersData: Record<number, any[]> = {
    1: [
      { id: "1", username: "ProGamer_X", role: "captain", avatar: "", gameId: "PG123", contactInfo: "+91 9876543210" },
      { id: "2", username: "ElitePlayer", role: "member", avatar: "", gameId: "EP456", contactInfo: "+91 9876543211" },
      { id: "3", username: "ChampionGG", role: "member", avatar: "", gameId: "CG789", contactInfo: "+91 9876543212" },
    ]
  };

  const TeamCard = ({ team }: { team: Team }) => {
    const members = teamMembersData[team.id] || [];
    const isCaptain = team.captainId === user?.id;

    return (
      <Card className="card-hover">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-fire-blue to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                {team.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <CardTitle className="text-lg">{team.name}</CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">#{team.code}</Badge>
                  {isCaptain && (
                    <Badge className="bg-fire-orange text-white">
                      <Crown className="w-3 h-3 mr-1" />
                      Captain
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Team Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold fire-gray">{team.totalMembers}</div>
              <div className="text-sm text-gray-500">Members</div>
            </div>
            <div>
              <div className="text-lg font-bold fire-green">{team.winRate}%</div>
              <div className="text-sm text-gray-500">Win Rate</div>
            </div>
            <div>
              <div className="text-lg font-bold fire-blue">₹{team.totalEarnings}</div>
              <div className="text-sm text-gray-500">Earnings</div>
            </div>
          </div>

          {/* Team Members */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Team Members</span>
              {isCaptain && (
                <Button size="sm" variant="outline">
                  <UserPlus className="w-3 h-3 mr-1" />
                  Invite
                </Button>
              )}
            </div>
            <div className="space-y-2">
              {members.slice(0, 3).map((member) => (
                <div key={member.id} className="flex items-center space-x-2">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback className="text-xs">
                      {member.username.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm flex-1">{member.username}</span>
                  {member.role === 'captain' && (
                    <Crown className="w-3 h-3 text-fire-orange" />
                  )}
                </div>
              ))}
              {members.length > 3 && (
                <div className="text-xs text-gray-500">
                  +{members.length - 3} more members
                </div>
              )}
            </div>
          </div>

          {/* Team Actions */}
          <div className="flex space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex-1">
                  <Users className="w-4 h-4 mr-2" />
                  View Team
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-fire-blue to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                      {team.name.substring(0, 2).toUpperCase()}
                    </div>
                    <span>{team.name}</span>
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6">
                  {/* Team Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Team Code</label>
                      <div className="flex items-center space-x-2">
                        <code className="p-2 bg-gray-100 rounded text-sm flex-1">#{team.code}</code>
                        <Button size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(team.code)}>
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Created</label>
                      <div className="text-sm text-gray-600">
                        {new Date(team.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Team Stats */}
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-xl font-bold fire-gray">{team.totalMembers}</div>
                      <div className="text-sm text-gray-500">Members</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-xl font-bold fire-green">{team.winRate}%</div>
                      <div className="text-sm text-gray-500">Win Rate</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-xl font-bold fire-blue">₹{team.totalEarnings}</div>
                      <div className="text-sm text-gray-500">Earnings</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-xl font-bold fire-orange">{team.matchesPlayed}</div>
                      <div className="text-sm text-gray-500">Matches</div>
                    </div>
                  </div>

                  {/* Members List */}
                  <div>
                    <h4 className="font-medium mb-3">Team Members</h4>
                    <div className="space-y-3">
                      {members.map((member) => (
                        <div key={member.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <Avatar>
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback>{member.username.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="font-medium">{member.username}</div>
                            <div className="text-sm text-gray-500">Game ID: {member.gameId}</div>
                          </div>
                          <div className="text-right">
                            <Badge variant={member.role === 'captain' ? 'default' : 'secondary'}>
                              {member.role === 'captain' ? (
                                <>
                                  <Crown className="w-3 h-3 mr-1" />
                                  Captain
                                </>
                              ) : (
                                'Member'
                              )}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Team Actions */}
                  {isCaptain && (
                    <div className="flex space-x-2 pt-4 border-t">
                      <Button className="bg-fire-blue hover:bg-blue-600 text-white">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Team
                      </Button>
                      <Button variant="outline">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Invite Members
                      </Button>
                      <Button variant="outline">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share Team
                      </Button>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>

            <Button size="sm" className="bg-fire-green hover:bg-green-600 text-white">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>

            {isCaptain && (
              <Button size="sm" variant="outline">
                <Settings className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <UserHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold fire-gray mb-2">My Teams</h1>
            <p className="text-gray-600">
              Create and manage your esports teams for squad tournaments
            </p>
          </div>
          <div className="flex space-x-3">
            <Dialog open={showJoinModal} onOpenChange={setShowJoinModal}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Search className="w-4 h-4 mr-2" />
                  Join Team
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Join a Team</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Team Code</label>
                    <Input
                      placeholder="Enter team code (e.g., TEAM123)"
                      value={teamCode}
                      onChange={(e) => setTeamCode(e.target.value)}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => setShowJoinModal(false)} className="flex-1">
                      Cancel
                    </Button>
                    <Button className="bg-fire-blue hover:bg-blue-600 text-white flex-1">
                      Join Team
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button 
              onClick={() => setShowCreateModal(true)}
              className="bg-fire-red hover:bg-red-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Team
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-fire-blue rounded-lg flex items-center justify-center mx-auto mb-2">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-bold fire-gray">{teams.length}</div>
              <div className="text-sm text-gray-500">My Teams</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-fire-orange rounded-lg flex items-center justify-center mx-auto mb-2">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-bold fire-gray">
                {teams.filter(t => t.captainId === user?.id).length}
              </div>
              <div className="text-sm text-gray-500">As Captain</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-fire-green rounded-lg flex items-center justify-center mx-auto mb-2">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-bold fire-gray">
                {teams.reduce((avg, team) => avg + parseFloat(team.winRate), 0) / (teams.length || 1)}%
              </div>
              <div className="text-sm text-gray-500">Avg Win Rate</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-fire-teal rounded-lg flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-bold fire-gray">
                ₹{teams.reduce((total, team) => total + parseFloat(team.totalEarnings), 0).toFixed(2)}
              </div>
              <div className="text-sm text-gray-500">Total Earnings</div>
            </CardContent>
          </Card>
        </div>

        {/* Teams Grid */}
        {teams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team) => (
              <TeamCard key={team.id} team={team} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Teams Yet</h3>
              <p className="text-gray-500 mb-6">
                Create your first team or join an existing one to start playing squad tournaments.
              </p>
              <div className="flex justify-center space-x-3">
                <Button 
                  onClick={() => setShowCreateModal(true)}
                  className="bg-fire-red hover:bg-red-600 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Team
                </Button>
                <Button 
                  onClick={() => setShowJoinModal(true)}
                  variant="outline"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Join Team
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Team Benefits */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Team Benefits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-fire-blue rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold mb-2">Squad Tournaments</h4>
                <p className="text-sm text-gray-600">
                  Participate in team-based tournaments with higher prize pools
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-fire-green rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold mb-2">Shared Rewards</h4>
                <p className="text-sm text-gray-600">
                  Win together and share prize money with your teammates
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-fire-orange rounded-lg flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold mb-2">Team Statistics</h4>
                <p className="text-sm text-gray-600">
                  Track your team's performance and climb the team leaderboards
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-fire-red rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold mb-2">Leadership</h4>
                <p className="text-sm text-gray-600">
                  Develop leadership skills by captaining your own team
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Create Team Modal */}
        <TeamModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
        />
      </main>
    </div>
  );
}
