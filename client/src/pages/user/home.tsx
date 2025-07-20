import { useQuery } from "@tanstack/react-query";
import UserHeader from "@/components/layout/user-header";
import TournamentCard from "@/components/tournament-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useWebSocket } from "@/lib/websocket";
import { useState, useEffect } from "react";
import { 
  Zap, 
  DollarSign, 
  Users, 
  BarChart3, 
  Trophy,
  Star,
  Target,
  Gift,
  Play,
  ArrowRight,
  Gamepad2,
  Crown,
  Fire,
  Sword
} from "lucide-react";
import type { Tournament, Announcement } from "@shared/schema";

// Hero Slider Component
function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      title: "Win Big in Esports Tournaments",
      subtitle: "Join tournaments, compete with the best players, and earn real cash rewards in your favorite games",
      bgColor: "bg-gradient-to-br from-red-600 via-red-500 to-orange-500",
      icon: "🏆",
      cta: "Join Tournament",
      secondaryCta: "View Rankings"
    },
    {
      title: "Team Up & Dominate",
      subtitle: "Create teams, invite friends, and conquer tournaments together for massive prize pools",
      bgColor: "bg-gradient-to-br from-blue-600 via-blue-500 to-purple-500",
      icon: "👥",
      cta: "Create Team",
      secondaryCta: "Find Teams"
    },
    {
      title: "Daily Challenges & Rewards",
      subtitle: "Complete daily missions, climb leaderboards, and unlock exclusive rewards and bonuses",
      bgColor: "bg-gradient-to-br from-orange-600 via-orange-500 to-yellow-500",
      icon: "🎯",
      cta: "View Challenges",
      secondaryCta: "Check Rewards"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative rounded-lg md:rounded-3xl overflow-hidden mb-4 md:mb-8 shadow-xl">
      <Carousel className="w-full">
        <CarouselContent className="-ml-1">
          {heroSlides.map((slide, index) => (
            <CarouselItem key={index} className="pl-1">
              <div className={`relative ${slide.bgColor} text-white py-8 px-4 md:py-16 md:px-8 min-h-[400px] md:min-h-[500px]`}>
                {/* Mobile Grid Background Elements */}
                <div className="absolute inset-0">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 h-full p-4 opacity-20">
                    <div className="bg-white/10 rounded-xl animate-pulse"></div>
                    <div className="bg-white/15 rounded-xl animate-pulse delay-300"></div>
                    <div className="bg-white/10 rounded-xl animate-pulse delay-500 hidden md:block"></div>
                    <div className="bg-white/20 rounded-xl animate-pulse delay-700"></div>
                    <div className="bg-white/15 rounded-xl animate-pulse delay-1000"></div>
                    <div className="bg-white/10 rounded-xl animate-pulse delay-1200 hidden md:block"></div>
                  </div>
                </div>

                {/* Content Grid Layout */}
                <div className="relative z-10 h-full flex flex-col justify-center">
                  {/* Header Section */}
                  <div className="text-center mb-4 md:mb-6">
                    <div className="text-3xl md:text-6xl mb-2 md:mb-4 animate-bounce">{slide.icon}</div>
                    <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold mb-3 md:mb-6 leading-tight">
                      {slide.title}
                    </h1>
                    <p className="text-sm md:text-lg lg:text-xl mb-4 md:mb-8 opacity-90 max-w-2xl mx-auto leading-relaxed px-2">
                      {slide.subtitle}
                    </p>
                  </div>
                  
                  {/* Action Buttons - Mobile Optimized */}
                  <div className="flex flex-col sm:flex-row gap-2 md:gap-4 justify-center mb-4 md:mb-8 px-4">
                    <Link href="/tournaments" className="w-full sm:w-auto">
                      <Button className="w-full sm:w-auto bg-white text-fire-red hover:bg-gray-100 px-4 md:px-8 py-3 md:py-4 text-sm md:text-lg font-bold rounded-lg md:rounded-xl shadow-xl transform hover:scale-105 transition-all duration-300">
                        <Play className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                        {slide.cta}
                      </Button>
                    </Link>
                    <Link href="/leaderboard" className="w-full sm:w-auto">
                      <Button 
                        variant="outline" 
                        className="w-full sm:w-auto border-2 border-white bg-transparent text-white hover:bg-white hover:text-fire-red px-4 md:px-8 py-3 md:py-4 text-sm md:text-lg font-bold rounded-lg md:rounded-xl shadow-xl transform hover:scale-105 transition-all duration-300"
                      >
                        {slide.secondaryCta}
                        <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
                      </Button>
                    </Link>
                  </div>

                  {/* Stats Grid - Mobile Responsive */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 px-4 max-w-4xl mx-auto">
                    <div className="bg-red-500/80 backdrop-blur-sm rounded-lg md:rounded-xl p-2 md:p-4 text-center transform hover:scale-105 transition-all duration-300 shadow-lg">
                      <div className="text-lg md:text-2xl font-bold">50K+</div>
                      <div className="text-xs md:text-sm opacity-90">Active Players</div>
                    </div>
                    <div className="bg-green-500/80 backdrop-blur-sm rounded-lg md:rounded-xl p-2 md:p-4 text-center transform hover:scale-105 transition-all duration-300 shadow-lg">
                      <div className="text-lg md:text-2xl font-bold">₹50L+</div>
                      <div className="text-xs md:text-sm opacity-90">Total Prizes</div>
                    </div>
                    <div className="bg-blue-500/80 backdrop-blur-sm rounded-lg md:rounded-xl p-2 md:p-4 text-center transform hover:scale-105 transition-all duration-300 shadow-lg">
                      <div className="text-lg md:text-2xl font-bold">1000+</div>
                      <div className="text-xs md:text-sm opacity-90">Daily Matches</div>
                    </div>
                    <div className="bg-purple-500/80 backdrop-blur-sm rounded-lg md:rounded-xl p-2 md:p-4 text-center transform hover:scale-105 transition-all duration-300 shadow-lg">
                      <div className="text-lg md:text-2xl font-bold">24/7</div>
                      <div className="text-xs md:text-sm opacity-90">Live Support</div>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Mobile-friendly Navigation */}
        <CarouselPrevious className="left-2 md:left-4 w-8 h-8 md:w-10 md:h-10" />
        <CarouselNext className="right-2 md:right-4 w-8 h-8 md:w-10 md:h-10" />
      </Carousel>

      {/* Mobile-Optimized Slide Indicators */}
      <div className="absolute bottom-2 md:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1 md:space-x-2 z-20">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-white scale-125' : 'bg-white/50'
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
}

// Games Grid Component
function GamesGrid() {
  const games = [
    {
      id: 1,
      name: "Free Fire",
      icon: "🔥",
      players: "25K+",
      tournaments: "150+",
      prizePool: "₹15L+",
      bgColor: "bg-red-500",
      bgPattern: "bg-red-50",
      iconBg: "bg-red-500",
      description: "Battle Royale at its finest"
    },
    {
      id: 2,
      name: "PUBG Mobile",
      icon: "🎯",
      players: "20K+",
      tournaments: "120+",
      prizePool: "₹12L+",
      bgColor: "bg-blue-500",
      bgPattern: "bg-blue-50",
      iconBg: "bg-blue-500",
      description: "Tactical battle royale action"
    },
    {
      id: 3,
      name: "Call of Duty Mobile",
      icon: "💥",
      players: "18K+",
      tournaments: "100+",
      prizePool: "₹10L+",
      bgColor: "bg-gray-700",
      bgPattern: "bg-gray-50",
      iconBg: "bg-gray-700",
      description: "Intense FPS warfare"
    },
    {
      id: 4,
      name: "Valorant",
      icon: "⚡",
      players: "15K+",
      tournaments: "80+",
      prizePool: "₹8L+",
      bgColor: "bg-purple-500",
      bgPattern: "bg-purple-50",
      iconBg: "bg-purple-500",
      description: "Tactical 5v5 shooter"
    },
    {
      id: 5,
      name: "Clash Royale",
      icon: "👑",
      players: "12K+",
      tournaments: "60+",
      prizePool: "₹5L+",
      bgColor: "bg-yellow-500",
      bgPattern: "bg-yellow-50",
      iconBg: "bg-yellow-500",
      description: "Real-time strategy battles"
    },
    {
      id: 6,
      name: "FIFA Mobile",
      icon: "⚽",
      players: "10K+",
      tournaments: "50+",
      prizePool: "₹4L+",
      bgColor: "bg-green-500",
      bgPattern: "bg-green-50",
      iconBg: "bg-green-500",
      description: "Ultimate football experience"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
      {games.map((game) => (
        <Card key={game.id} className={`group cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${game.bgPattern} overflow-hidden`}>
          <CardContent className="p-0">
            {/* Game Header with Gradient */}
            <div className={`${game.bgColor} p-6 text-white relative overflow-hidden`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-8 -translate-y-8"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full transform -translate-x-4 translate-y-4"></div>
              
              <div className="relative z-10 flex items-center space-x-4">
                <div className={`w-16 h-16 ${game.iconBg} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-2xl">{game.icon}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">{game.name}</h3>
                  <p className="text-sm opacity-90">{game.description}</p>
                </div>
              </div>
            </div>

            {/* Game Stats */}
            <div className="p-6">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-fire-gray">{game.players}</div>
                  <div className="text-xs text-gray-500">Players</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-fire-blue">{game.tournaments}</div>
                  <div className="text-xs text-gray-500">Tournaments</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-fire-green">{game.prizePool}</div>
                  <div className="text-xs text-gray-500">Prize Pool</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <Link href={`/tournaments?game=${game.name.toLowerCase().replace(/\s+/g, '_')}`} className="flex-1">
                  <Button className="w-full bg-fire-red hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition-all duration-300">
                    <Gamepad2 className="w-4 h-4 mr-2" />
                    Play Now
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="px-4 hover:bg-gray-100 border-2 transition-all duration-300"
                  onClick={() => {/* View game details */}}
                >
                  <Star className="w-4 h-4" />
                </Button>
              </div>

              {/* Live Status */}
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-600">Live tournaments</span>
                </div>
                <Badge className="bg-fire-orange/10 text-fire-orange border-fire-orange/20 text-xs">
                  Hot 🔥
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function UserHome() {
  const { user } = useAuth();
  
  const { data: tournaments = [] } = useQuery<Tournament[]>({
    queryKey: ["/api/tournaments"],
  });

  const { data: announcements = [] } = useQuery<Announcement[]>({
    queryKey: ["/api/announcements"],
  });

  const { data: playersLeaderboard = [] } = useQuery({
    queryKey: ["/api/leaderboard/players"],
  });

  const { data: teamsLeaderboard = [] } = useQuery({
    queryKey: ["/api/leaderboard/teams"],
  });

  // WebSocket for real-time updates
  useWebSocket((data) => {
    if (data.type === 'tournament_update') {
      // Handle real-time tournament updates
      console.log('Tournament update:', data);
    }
  });

  const liveTournaments = tournaments.filter(t => t.status === 'live');
  const upcomingTournaments = tournaments.filter(t => t.status === 'upcoming').slice(0, 6);
  const recentAnnouncements = announcements.slice(0, 3);

  const quickActions = [
    {
      title: "Quick Match",
      description: "Join instant match",
      icon: Zap,
      color: "bg-fire-red",
      href: "/tournaments?quick=true"
    },
    {
      title: "Withdraw",
      description: "Cash out winnings",
      icon: DollarSign,
      color: "bg-fire-green",
      href: "/wallet"
    },
    {
      title: "My Teams",
      description: "Manage squads",
      icon: Users,
      color: "bg-fire-blue",
      href: "/teams"
    },
    {
      title: "Stats",
      description: "View performance",
      icon: BarChart3,
      color: "bg-fire-teal",
      href: "/profile"
    }
  ];

  const dailyChallenges = [
    {
      title: "Join 2 Tournaments",
      progress: 1,
      max: 2,
      reward: "₹50 + 100 XP",
      color: "bg-fire-red",
      completed: false
    },
    {
      title: "Win 1 Match",
      progress: 0,
      max: 1,
      reward: "₹100 + 200 XP",
      color: "bg-fire-blue",
      completed: false
    },
    {
      title: "Refer a Friend",
      progress: 1,
      max: 1,
      reward: "₹200 + 500 XP",
      color: "bg-fire-green",
      completed: true
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <UserHeader />
      
      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 md:py-8">
        {/* Enhanced Hero Slider Section */}
        <HeroSlider />

        {/* Popular Games Grid Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-fire-red to-fire-blue bg-clip-text text-transparent">
              🎮 Popular Games
            </h2>
            <Link href="/tournaments">
              <Button variant="outline" className="hover:bg-fire-red hover:text-white transition-all duration-300">
                View All Games
              </Button>
            </Link>
          </div>
          <GamesGrid />
        </div>

        {/* Quick Actions - Mobile Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.title} href={action.href}>
                <Card className="card-hover cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-lg">
                  <CardContent className="p-3 md:p-4">
                    <div className={`w-10 h-10 md:w-12 md:h-12 ${action.color} rounded-lg flex items-center justify-center mb-2 md:mb-3 mx-auto`}>
                      <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-fire-gray mb-1 text-sm md:text-base text-center">{action.title}</h3>
                    <p className="text-xs md:text-sm text-gray-500 text-center leading-tight">{action.description}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Live Tournaments Alert */}
        {liveTournaments.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-3 h-3 bg-fire-red rounded-full tournament-live"></div>
              <h3 className="font-semibold fire-red">🔥 Live Tournaments</h3>
            </div>
            <p className="text-sm text-red-700 mb-3">
              {liveTournaments.length} tournament{liveTournaments.length > 1 ? 's' : ''} currently live! Join now to compete.
            </p>
            <div className="flex space-x-2">
              {liveTournaments.slice(0, 2).map((tournament) => (
                <Link key={tournament.id} href={`/tournaments/${tournament.id}`}>
                  <Badge className="bg-fire-red hover:bg-red-600 text-white cursor-pointer">
                    {tournament.title}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Live & Upcoming Tournaments */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold fire-gray">Live & Upcoming Tournaments</h2>
            <div className="flex space-x-2">
              <Button className="bg-fire-red text-white">All Games</Button>
              <Button variant="outline">Free Fire</Button>
              <Button variant="outline">BGMI</Button>
              <Button variant="outline">Valorant</Button>
            </div>
          </div>

          {upcomingTournaments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingTournaments.map((tournament) => (
                <TournamentCard key={tournament.id} tournament={tournament} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Tournaments Available</h3>
                <p className="text-gray-500">Check back later for new tournaments!</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Featured Players & Teams */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold fire-gray mb-6">Top Performers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Players */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg fire-gray mb-4">Top Players</h3>
                <div className="space-y-4">
                  {playersLeaderboard.slice(0, 3).map((player: any, index: number) => (
                    <div key={player.id} className="flex items-center space-x-3">
                      <div className={`w-8 h-8 ${
                        index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-gray-400' : 'bg-orange-400'
                      } rounded-full flex items-center justify-center text-white font-bold`}>
                        {index + 1}
                      </div>
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={player.profileImageUrl} />
                        <AvatarFallback>{player.username?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-semibold fire-gray">{player.username}</div>
                        <div className="text-sm text-gray-500">₹{player.totalEarnings} earned</div>
                      </div>
                      <div className="fire-green font-semibold">{player.winRate}% WR</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Teams */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg fire-gray mb-4">Top Teams</h3>
                <div className="space-y-4">
                  {teamsLeaderboard.slice(0, 3).map((team: any, index: number) => (
                    <div key={team.id} className="flex items-center space-x-3">
                      <div className={`w-8 h-8 ${
                        index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-gray-400' : 'bg-orange-400'
                      } rounded-full flex items-center justify-center text-white font-bold`}>
                        {index + 1}
                      </div>
                      <div className={`w-10 h-10 ${
                        index === 0 ? 'bg-fire-red' : index === 1 ? 'bg-fire-blue' : 'bg-fire-green'
                      } rounded-lg flex items-center justify-center`}>
                        <span className="text-white font-bold">
                          {team.name?.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold fire-gray">{team.name}</div>
                        <div className="text-sm text-gray-500">
                          {team.totalMembers} members • ₹{team.totalEarnings} earned
                        </div>
                      </div>
                      <div className="fire-green font-semibold">{team.winRate}% WR</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Daily Challenges */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Target className="w-6 h-6 fire-teal" />
              <h2 className="text-xl font-bold fire-gray">Daily Challenges</h2>
              <Gift className="w-5 h-5 fire-orange" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {dailyChallenges.map((challenge, index) => (
                <div 
                  key={index}
                  className={`border rounded-lg p-4 ${challenge.color} text-white`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">{challenge.title}</span>
                    <span className="text-sm">
                      {challenge.completed ? '✓' : `${challenge.progress}/${challenge.max}`}
                    </span>
                  </div>
                  <div className="w-full bg-white bg-opacity-30 rounded-full h-2 mb-2">
                    <div 
                      className="bg-white h-2 rounded-full" 
                      style={{ width: `${(challenge.progress / challenge.max) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-sm opacity-90">Reward: {challenge.reward}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Announcements */}
        {recentAnnouncements.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold fire-gray">📢 Latest News</h2>
                <Link href="/announcements">
                  <Button variant="outline" size="sm">View All</Button>
                </Link>
              </div>
              <div className="space-y-3">
                {recentAnnouncements.map((announcement) => (
                  <div key={announcement.id} className="border-l-4 border-fire-blue pl-3">
                    <h4 className="font-semibold fire-gray">{announcement.title}</h4>
                    <p className="text-sm text-gray-600 line-clamp-2">{announcement.content}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(announcement.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
