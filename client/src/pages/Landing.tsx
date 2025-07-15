import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Zap, Users, DollarSign } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="hero-bg text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                <span className="text-2xl font-bold text-fire-red">F</span>
              </div>
              <span className="text-4xl font-bold">FireFight</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Win Big in Esports Tournaments
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
              Join tournaments, compete with the best players, and earn real cash rewards in your favorite games
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-fire-red hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
                onClick={() => window.location.href = "/api/login"}
              >
                Get Started
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-fire-red px-8 py-4 text-lg font-semibold"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-fire-gray mb-4">
            Why Choose FireFight?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the ultimate esports tournament platform with cutting-edge features
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="card-hover border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-fire-red rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-fire-gray mb-4">Competitive Tournaments</h3>
              <p className="text-gray-600">
                Join daily tournaments across popular games like Free Fire, BGMI, and Valorant
              </p>
            </CardContent>
          </Card>

          <Card className="card-hover border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-fire-green rounded-full flex items-center justify-center mx-auto mb-6">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-fire-gray mb-4">Real Cash Prizes</h3>
              <p className="text-gray-600">
                Win actual money that you can withdraw directly to your bank account
              </p>
            </CardContent>
          </Card>

          <Card className="card-hover border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-fire-blue rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-fire-gray mb-4">Instant Matches</h3>
              <p className="text-gray-600">
                Quick match system to find and join tournaments in seconds
              </p>
            </CardContent>
          </Card>

          <Card className="card-hover border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-fire-teal rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-fire-gray mb-4">Team Management</h3>
              <p className="text-gray-600">
                Create and manage teams, invite friends, and compete together
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-fire-red mb-2">50K+</div>
              <div className="text-gray-600">Active Players</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-fire-blue mb-2">₹10L+</div>
              <div className="text-gray-600">Prize Pool Distributed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-fire-green mb-2">500+</div>
              <div className="text-gray-600">Daily Tournaments</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-fire-teal mb-2">95%</div>
              <div className="text-gray-600">Player Satisfaction</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-fire-gray text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Winning?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of players who are already earning money through esports tournaments
          </p>
          <Button
            size="lg"
            className="bg-fire-red hover:bg-red-600 px-8 py-4 text-lg font-semibold"
            onClick={() => window.location.href = "/api/login"}
          >
            Join FireFight Now
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-fire-red rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="text-xl font-bold text-fire-gray">FireFight</span>
            </div>
            <div className="flex space-x-8 text-gray-600">
              <a href="#" className="hover:text-fire-red transition-colors">About</a>
              <a href="#" className="hover:text-fire-red transition-colors">Terms</a>
              <a href="#" className="hover:text-fire-red transition-colors">Privacy</a>
              <a href="#" className="hover:text-fire-red transition-colors">Support</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-gray-600">
            <p>&copy; 2024 FireFight. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
