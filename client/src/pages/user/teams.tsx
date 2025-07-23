import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import UserHeader from "@/components/layout/user-header";
import CreateTeamModal from "@/components/team/CreateTeamModal";
import AddPlayerModal from "@/components/team/AddPlayerModal";
import TeamCard from "@/components/team/TeamCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  Plus, 
  Search,
  Filter,
  Trophy,
  Star,
  Gamepad2,
  TrendingUp,
  Award,
  Zap
} from "lucide-react";

interface Team {
  id: number;
  name: string;
  code: string;
  logoUrl?: string;
  captainId: string;
  totalMembers: number;
  winRate: number;
  totalEarnings: number;
  matchesPlayed: number;
  isActive: boolean;
}

interface TeamMember {
  id: number;
  teamId: number;
  userId: string;
  role: string;
  gameId: string | null;
  contactInfo: string | null;
  username: string;
  email: string;
  avatarUrl: string | null;
}

export default function Teams() {
  const { user } = useAuth();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddPlayerModalOpen, setIsAddPlayerModalOpen] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [filterStatus, setFilterStatus] = useState("all");

  const { data: teams = [], isLoading } = useQuery<Team[]>({
    queryKey: ["/api/teams"],
  });

  const handleAddPlayer = (teamId: number) => {
    setSelectedTeamId(teamId);
    setEditingMember(null);
    setIsAddPlayerModalOpen(true);
  };

  const handleEditMember = (member: TeamMember) => {
    setSelectedTeamId(member.teamId);
    setEditingMember(member);
    setIsAddPlayerModalOpen(true);
  };

  const handleCloseAddPlayerModal = () => {
    setIsAddPlayerModalOpen(false);
    setSelectedTeamId(null);
    setEditingMember(null);
  };

  // Filter and sort teams
  const filteredTeams = teams
    .filter(team => {
      const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           team.code.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter = filterStatus === "all" || 
                           (filterStatus === "active" && team.isActive) ||
                           (filterStatus === "high_performance" && team.winRate > 70);

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "winRate":
          return b.winRate - a.winRate;
        case "earnings":
          return b.totalEarnings - a.totalEarnings;
        case "members":
          return b.totalMembers - a.totalMembers;
        default:
          return a.name.localeCompare(b.name);
      }
    });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
        <UserHeader />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-300 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-80 bg-gray-300 rounded-lg"></div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      <UserHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                My Teams
              </h1>
              <p className="text-gray-600 text-lg">
                Create and manage your esports teams for tournaments
              </p>
            </div>

            <Button 
              size="lg" 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Team
            </Button>
          </div>

          {/* Enhanced Stats Cards */}
          {teams.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">Total Teams</p>
                      <p className="text-2xl font-bold">{teams.length}</p>
                    </div>
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm font-medium">Total Earnings</p>
                      <p className="text-2xl font-bold">₹{teams.reduce((sum, team) => sum + team.totalEarnings, 0)}</p>
                    </div>
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm font-medium">Avg Win Rate</p>
                      <p className="text-2xl font-bold">{Math.round(teams.reduce((sum, team) => sum + team.winRate, 0) / teams.length)}%</p>
                    </div>
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <Trophy className="w-5 h-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm font-medium">Active Teams</p>
                      <p className="text-2xl font-bold">{teams.filter(team => team.isActive).length}</p>
                    </div>
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <Zap className="w-5 h-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Enhanced Filters */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                  <Input
                    placeholder="Search teams by name or code..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/80 backdrop-blur-sm border-gray-200"
                  />
                </div>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full md:w-48 bg-white/80 backdrop-blur-sm">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="winRate">Win Rate</SelectItem>
                    <SelectItem value="earnings">Earnings</SelectItem>
                    <SelectItem value="members">Members</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full md:w-48 bg-white/80 backdrop-blur-sm">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Teams</SelectItem>
                    <SelectItem value="active">Active Only</SelectItem>
                    <SelectItem value="high_performance">High Performance</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm">
                  <Filter className="w-4 h-4" />
                  <span>More Filters</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Teams Grid */}
        {filteredTeams.length === 0 ? (
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                {teams.length === 0 ? "No teams yet" : "No teams match your filters"}
              </h3>
              <p className="text-gray-600 mb-6 text-lg">
                {teams.length === 0 
                  ? "Create your first team to start competing in tournaments"
                  : "Try adjusting your search criteria"}
              </p>
              {teams.length === 0 && (
                <Button 
                  onClick={() => setIsCreateModalOpen(true)} 
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Your First Team
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeams.map((team) => (
              <TeamCard 
                key={team.id} 
                team={team} 
                onAddPlayer={handleAddPlayer}
                onEditMember={handleEditMember}
              />
            ))}
          </div>
        )}

        {/* Featured Section */}
        {teams.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                <Star className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Top Performing Teams</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {teams
                .filter(team => team.winRate > 60)
                .slice(0, 3)
                .map((team) => (
                  <Card key={team.id} className="bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 border-2 border-yellow-200 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                          <Award className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800">{team.name}</h3>
                          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs">
                            {team.winRate}% Win Rate
                          </Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Earnings:</span>
                          <p className="font-bold text-green-600">₹{team.totalEarnings}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Matches:</span>
                          <p className="font-bold text-blue-600">{team.matchesPlayed}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <CreateTeamModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />

      <AddPlayerModal
        isOpen={isAddPlayerModalOpen}
        onClose={handleCloseAddPlayerModal}
        teamId={selectedTeamId}
        editingPlayer={editingMember}
      />
    </div>
  );
}