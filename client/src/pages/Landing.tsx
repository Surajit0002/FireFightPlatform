
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Zap, Users, DollarSign, Star, Shield, Gamepad2, TrendingUp, Award, Play, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

export default function Landing() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const heroSlides = [
    {
      title: "Win Big in Esports Tournaments",
      subtitle: "Join tournaments, compete with the best players, and earn real cash rewards in your favorite games",
      bgGradient: "from-fire-red via-purple-500 to-fire-blue"
    },
    {
      title: "Team Up & Dominate",
      subtitle: "Create teams, invite friends, and conquer tournaments together for massive prize pools",
      bgGradient: "from-fire-green via-fire-teal to-fire-blue"
    },
    {
      title: "Fair Play Guaranteed", 
      subtitle: "Advanced anti-cheat systems and KYC verification ensure every match is fair and secure",
      bgGradient: "from-fire-orange via-fire-red to-purple-600"
    }
  ];

  const games = [
    { name: "Free Fire", icon: "🔥", players: "15K+", color: "bg-fire-red" },
    { name: "BGMI", icon: "🎯", players: "12K+", color: "bg-fire-blue" },
    { name: "Valorant", icon: "⚡", players: "8K+", color: "bg-fire-green" },
    { name: "Call of Duty", icon: "💥", players: "6K+", color: "bg-fire-orange" }
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Enhanced Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-fire-red to-fire-blue rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-fire-red to-fire-blue bg-clip-text text-transparent">
                FireFight
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="hidden sm:flex border-fire-green text-fire-green">
                <div className="w-2 h-2 bg-fire-green rounded-full mr-2 animate-pulse"></div>
                Live Now
              </Badge>
              <Button
                size="lg"
                className="bg-gradient-to-r from-fire-red to-fire-blue hover:from-fire-blue hover:to-fire-red text-white font-semibold px-6 py-2 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
                onClick={() => (window.location.href = "/api/login")}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Dynamic Hero Section */}
      <div className={`relative overflow-hidden transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className={`bg-gradient-to-br ${heroSlides[currentSlide].bgGradient} text-white relative`}>
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-4 -right-4 w-72 h-72 bg-white/10 rounded-full animate-pulse"></div>
            <div className="absolute top-1/2 -left-8 w-96 h-96 bg-white/5 rounded-full animate-bounce" style={{animationDuration: '3s'}}></div>
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white/10 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-8">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-2xl">
                  <span className="text-3xl font-bold">🏆</span>
                </div>
                <div className="text-right">
                  <div className="text-sm opacity-80">Welcome to</div>
                  <div className="text-2xl font-bold">FireFight</div>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                {heroSlides[currentSlide].title}
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl mb-8 opacity-90 max-w-4xl mx-auto leading-relaxed">
                {heroSlides[currentSlide].subtitle}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button
                  size="lg"
                  className="bg-white text-fire-red hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl shadow-xl transform hover:scale-105 transition-all duration-300"
                  onClick={() => (window.location.href = "/api/login")}
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Playing
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-fire-red px-8 py-4 text-lg font-semibold rounded-xl backdrop-blur-sm bg-white/10"
                >
                  <Trophy className="w-5 h-5 mr-2" />
                  View Tournaments
                </Button>
              </div>

              {/* Hero Stats */}
              <div className="flex flex-wrap justify-center gap-6 text-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3">
                  <div className="text-2xl font-bold">50K+</div>
                  <div className="text-sm opacity-80">Players</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3">
                  <div className="text-2xl font-bold">₹10L+</div>
                  <div className="text-sm opacity-80">Prizes</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3">
                  <div className="text-2xl font-bold">500+</div>
                  <div className="text-sm opacity-80">Daily</div>
                </div>
              </div>

              {/* Slide Indicators */}
              <div className="flex justify-center space-x-2 mt-8">
                {heroSlides.map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentSlide ? 'bg-white scale-125' : 'bg-white/50'
                    }`}
                    onClick={() => setCurrentSlide(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Games Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-fire-red to-fire-blue bg-clip-text text-transparent mb-4">
              Popular Games
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Compete in your favorite games with thousands of players worldwide
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {games.map((game, index) => (
              <Card key={game.name} className="card-hover border-0 shadow-lg group cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 ${game.color} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-2xl">{game.icon}</span>
                  </div>
                  <h3 className="font-bold text-fire-gray mb-2">{game.name}</h3>
                  <p className="text-sm text-gray-500">{game.players} Active</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Features Section */}
      <div className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-fire-blue text-white px-4 py-2 rounded-full mb-4">
              Why Choose Us
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-fire-gray mb-4">
              Experience Next-Gen Gaming
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Cutting-edge features designed for competitive gamers who want fair play and real rewards
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Trophy className="w-8 h-8 text-white" />,
                title: "Competitive Tournaments",
                description: "Join daily tournaments across popular games with skill-based matchmaking",
                color: "bg-gradient-to-r from-fire-red to-red-600",
                bgColor: "bg-fire-red/10"
              },
              {
                icon: <DollarSign className="w-8 h-8 text-white" />,
                title: "Real Cash Prizes",
                description: "Win actual money with instant UPI withdrawals and transparent payouts",
                color: "bg-gradient-to-r from-fire-green to-green-600",
                bgColor: "bg-fire-green/10"
              },
              {
                icon: <Zap className="w-8 h-8 text-white" />,
                title: "Instant Matches",
                description: "Quick match system finds tournaments in seconds, not minutes",
                color: "bg-gradient-to-r from-fire-blue to-blue-600",
                bgColor: "bg-fire-blue/10"
              },
              {
                icon: <Users className="w-8 h-8 text-white" />,
                title: "Team Management",
                description: "Create squads, invite friends, and compete together for bigger prizes",
                color: "bg-gradient-to-r from-fire-teal to-teal-600",
                bgColor: "bg-fire-teal/10"
              },
              {
                icon: <Shield className="w-8 h-8 text-white" />,
                title: "Anti-Cheat Security",
                description: "Advanced detection systems ensure fair play and secure competitions",
                color: "bg-gradient-to-r from-purple-500 to-purple-700",
                bgColor: "bg-purple-500/10"
              },
              {
                icon: <Star className="w-8 h-8 text-white" />,
                title: "Global Rankings",
                description: "Climb leaderboards, earn XP, and showcase skills worldwide",
                color: "bg-gradient-to-r from-fire-orange to-orange-600",
                bgColor: "bg-fire-orange/10"
              }
            ].map((feature, index) => (
              <Card key={feature.title} className={`card-hover border-0 shadow-xl group ${feature.bgColor} hover:shadow-2xl transition-all duration-500`}>
                <CardContent className="p-8 text-center">
                  <div className={`w-20 h-20 ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-fire-gray mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Live Stats Section */}
      <div className="py-20 bg-gradient-to-r from-fire-gray via-gray-800 to-fire-gray text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Live Statistics</h2>
            <p className="text-xl opacity-90">Real-time numbers from our gaming community</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "50K+", label: "Active Players", icon: <Users className="w-8 h-8" />, color: "fire-red" },
              { number: "₹10L+", label: "Prize Pool", icon: <TrendingUp className="w-8 h-8" />, color: "fire-blue" },
              { number: "500+", label: "Daily Tournaments", icon: <Trophy className="w-8 h-8" />, color: "fire-green" },
              { number: "95%", label: "Player Satisfaction", icon: <Award className="w-8 h-8" />, color: "fire-teal" }
            ].map((stat, index) => (
              <div key={stat.label} className="text-center group">
                <div className={`w-16 h-16 bg-${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  {stat.icon}
                </div>
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-lg opacity-80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced CTA Section */}
      <div className="py-20 bg-gradient-to-br from-fire-red via-purple-600 to-fire-blue text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-black/20"></div>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/10 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 mb-6">
              Join the Revolution
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Start Winning?
            </h2>
            <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed">
              Join thousands of players who are already earning money through competitive esports tournaments
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-fire-red hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300"
              onClick={() => (window.location.href = "/api/login")}
            >
              <Gamepad2 className="w-5 h-5 mr-2" />
              Join FireFight Now
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-fire-red px-8 py-4 text-lg font-semibold rounded-xl backdrop-blur-sm bg-white/10"
            >
              <Trophy className="w-5 h-5 mr-2" />
              View Live Tournaments
            </Button>
          </div>

          <p className="text-sm opacity-70 mt-6">No hidden fees • Instant withdrawals • 24/7 support</p>
        </div>
      </div>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-fire-red to-fire-blue rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">F</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-fire-red to-fire-blue bg-clip-text text-transparent">
                  FireFight
                </span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                The ultimate esports tournament platform where skill meets opportunity. 
                Compete, win, and earn real cash rewards.
              </p>
              <div className="flex space-x-4">
                {["Discord", "Twitter", "YouTube", "Instagram"].map((social) => (
                  <div key={social} className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center cursor-pointer hover:bg-fire-red transition-colors duration-300">
                    <span className="text-sm font-bold">{social[0]}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <div className="space-y-2 text-gray-400">
                {["Tournaments", "Leaderboard", "Teams", "Support"].map((link) => (
                  <div key={link} className="cursor-pointer hover:text-white transition-colors duration-300">
                    {link}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <div className="space-y-2 text-gray-400">
                {["Terms of Service", "Privacy Policy", "Fair Play", "Responsible Gaming"].map((link) => (
                  <div key={link} className="cursor-pointer hover:text-white transition-colors duration-300">
                    {link}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 mb-4 md:mb-0">
              &copy; 2024 FireFight. All rights reserved.
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>🛡️ Secure Platform</span>
              <span>⚡ Instant Payouts</span>
              <span>🏆 Fair Play Guaranteed</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
