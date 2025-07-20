import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gamepad2, Trophy, Users, Zap, Shield, Star } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-fire-red rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="text-xl font-bold fire-gray">FireFight</span>
            </div>
            <Button
              onClick={() => window.location.href = '/api/login'}
              className="bg-fire-red hover:bg-red-600 text-white"
            >
              Login / Sign Up
            </Button>
          </div>
        </div>
      </header>

      {/* Enhanced Dynamic Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-red-600 via-purple-600 to-blue-600 text-white py-16 md:py-24">
        {/* Animated Background Elements - Mobile Responsive */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-16 h-16 md:w-32 md:h-32 bg-yellow-400 rounded-full opacity-20 animate-bounce"></div>
          <div className="absolute top-32 right-20 w-12 h-12 md:w-24 md:h-24 bg-green-400 rounded-full opacity-30 animate-pulse"></div>
          <div className="absolute bottom-20 left-32 w-20 h-20 md:w-40 md:h-40 bg-orange-400 rounded-full opacity-25 animate-ping"></div>
          <div className="absolute bottom-32 right-10 w-14 h-14 md:w-28 md:h-28 bg-cyan-400 rounded-full opacity-20 animate-bounce delay-300"></div>
          <div className="absolute top-1/2 left-1/4 w-10 h-10 md:w-20 md:h-20 bg-pink-400 rounded-full opacity-30 animate-pulse delay-500"></div>
          <div className="absolute top-1/3 right-1/3 w-18 h-18 md:w-36 md:h-36 bg-indigo-400 rounded-full opacity-25 animate-ping delay-700"></div>
        </div>

        {/* Floating Gaming Elements - Mobile Optimized */}
        <div className="absolute inset-0">
          {/* Mobile Grid Layout */}
          <div className="grid grid-cols-2 gap-4 p-4 h-full md:hidden">
            <div className="flex justify-start items-start text-2xl animate-bounce">🎮</div>
            <div className="flex justify-end items-start text-2xl animate-pulse delay-300">🏆</div>
            <div className="flex justify-start items-end text-2xl animate-bounce delay-500">⚡</div>
            <div className="flex justify-end items-end text-2xl animate-pulse delay-700">💰</div>
          </div>
          
          {/* Desktop Absolute Layout */}
          <div className="hidden md:block">
            <div className="absolute top-16 left-1/4 text-4xl animate-bounce">🎮</div>
            <div className="absolute top-24 right-1/4 text-3xl animate-pulse delay-300">🏆</div>
            <div className="absolute bottom-24 left-1/3 text-4xl animate-bounce delay-500">⚡</div>
            <div className="absolute bottom-16 right-1/3 text-3xl animate-pulse delay-700">💰</div>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-up">
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black mb-6 md:mb-8 bg-gradient-to-r from-yellow-300 via-red-300 to-pink-300 bg-clip-text text-transparent animate-pulse">
              Win Big in Esports Tournaments
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-8 md:mb-12 font-semibold max-w-4xl mx-auto leading-relaxed">
              Join tournaments, compete with the best players, and earn 
              <span className="text-yellow-300 font-bold animate-bounce inline-block mx-2">real cash rewards</span>
              Your skills, your victory, your money.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6 mb-12">
              <Button
                onClick={() => window.location.href = '/api/login'}
                size="lg"
                className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-12 py-4 text-xl rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300 animate-pulse"
              >
                🚀 Get Started
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-4 border-white bg-transparent text-white hover:bg-white hover:text-purple-600 font-bold px-12 py-4 text-xl rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                🏆 View Tournaments
              </Button>
            </div>

            {/* Dynamic Stats Bar - Mobile Optimized */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-8 md:mt-16">
              <div className="bg-red-500 rounded-xl md:rounded-2xl p-3 md:p-6 transform hover:scale-105 transition-all duration-300 shadow-xl">
                <div className="text-xl md:text-3xl font-black">10K+</div>
                <div className="text-xs md:text-sm font-semibold opacity-90">Active Gamers</div>
              </div>
              <div className="bg-green-500 rounded-xl md:rounded-2xl p-3 md:p-6 transform hover:scale-105 transition-all duration-300 shadow-xl">
                <div className="text-xl md:text-3xl font-black">₹50L+</div>
                <div className="text-xs md:text-sm font-semibold opacity-90">Prizes Won</div>
              </div>
              <div className="bg-blue-500 rounded-xl md:rounded-2xl p-3 md:p-6 transform hover:scale-105 transition-all duration-300 shadow-xl">
                <div className="text-xl md:text-3xl font-black">500+</div>
                <div className="text-xs md:text-sm font-semibold opacity-90">Daily Matches</div>
              </div>
              <div className="bg-purple-500 rounded-xl md:rounded-2xl p-3 md:p-6 transform hover:scale-105 transition-all duration-300 shadow-xl">
                <div className="text-xl md:text-3xl font-black">24/7</div>
                <div className="text-xs md:text-sm font-semibold opacity-90">Live Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold fire-gray mb-4">Why Choose FireFight?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experience the future of esports tournaments with real rewards, fair play, and exciting competitions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="card-hover">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-fire-red rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold fire-gray mb-2">Real Cash Prizes</h3>
                <p className="text-gray-600">
                  Win actual money with instant withdrawals to your UPI account. No fake currencies, just real rewards.
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-fire-blue rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Gamepad2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold fire-gray mb-2">Popular Games</h3>
                <p className="text-gray-600">
                  Play your favorite games including Free Fire, BGMI, Valorant, and more competitive esports titles.
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-fire-green rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold fire-gray mb-2">Team Play</h3>
                <p className="text-gray-600">
                  Create teams, invite friends, and compete together in squad-based tournaments for bigger prizes.
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-fire-teal rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold fire-gray mb-2">Instant Matches</h3>
                <p className="text-gray-600">
                  Join quick matches anytime or schedule tournaments. Fast-paced action with immediate results.
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-fire-orange rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold fire-gray mb-2">Fair & Secure</h3>
                <p className="text-gray-600">
                  Anti-cheat systems, KYC verification, and transparent result verification ensure fair competition.
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold fire-gray mb-2">Leaderboards</h3>
                <p className="text-gray-600">
                  Climb the rankings, earn XP points, and showcase your skills on global leaderboards.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold fire-red mb-2">10K+</div>
              <div className="text-gray-600">Active Players</div>
            </div>
            <div>
              <div className="text-3xl font-bold fire-blue mb-2">₹50L+</div>
              <div className="text-gray-600">Prize Money Paid</div>
            </div>
            <div>
              <div className="text-3xl font-bold fire-green mb-2">500+</div>
              <div className="text-gray-600">Daily Tournaments</div>
            </div>
            <div>
              <div className="text-3xl font-bold fire-teal mb-2">24/7</div>
              <div className="text-gray-600">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-fire-gray text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Winning?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of players earning real money through esports competitions.
          </p>
          <Button
            onClick={() => window.location.href = '/api/login'}
            size="lg"
            className="bg-fire-red hover:bg-red-600 text-white px-8 py-3"
          >
            Join FireFight Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-8 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-fire-red rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="font-semibold fire-gray">FireFight</span>
            </div>
            <div className="text-sm text-gray-600">
              © 2024 FireFight. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
