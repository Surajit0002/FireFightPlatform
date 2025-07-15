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

      {/* Hero Section */}
      <section className="hero-gradient text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Win Big in Esports Tournaments
          </h1>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join tournaments, compete with the best players, and earn real cash rewards.
            Your skills, your victory, your money.
          </p>
          <div className="flex justify-center space-x-4">
            <Button
              onClick={() => window.location.href = '/api/login'}
              size="lg"
              className="bg-white text-fire-red hover:bg-gray-100 px-8 py-3"
            >
              Get Started
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-white text-white hover:bg-white hover:text-fire-red px-8 py-3"
            >
              View Tournaments
            </Button>
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
