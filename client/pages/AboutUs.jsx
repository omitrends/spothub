import React from 'react';
import { Heart, Users, Search, MapPin } from 'lucide-react';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">About SpotHub</h1>
          <p className="text-xl">Connecting people with their lost belongings</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        
        {/* What We Do */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">What We Do</h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-4">
            SpotHub is a simple platform where people can register found items and those who have 
            lost something can search and reclaim their belongings. We make it easy to reconnect 
            people with their lost items.
          </p>
          <p className="text-gray-600 text-lg leading-relaxed">
            Whether you've lost your keys, wallet, phone, or any personal item, or you've found 
            something that belongs to someone else, SpotHub helps bridge that gap.
          </p>
        </section>

        {/* How It Works */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">How It Works</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Search className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Lost Something?</h3>
              <p className="text-gray-600">
                Search our database of found items or post details about what you've lost. 
                Get notified when someone reports finding it.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <MapPin className="w-8 h-8 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Found Something?</h3>
              <p className="text-gray-600">
                Register the item you found with location and description details. 
                Help someone get their belongings back.
              </p>
            </div>
          </div>
        </section>

        {/* Our Mission */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Mission</h2>
          <div className="bg-blue-50 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <Heart className="w-6 h-6 text-blue-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-800">Building Community</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              We believe in the power of community and human kindness. Every lost item has 
              sentimental value, and every person who takes the time to report a found item 
              is helping make the world a better place.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
};

export default AboutUs;