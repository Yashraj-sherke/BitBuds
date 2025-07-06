import React from 'react';
import { Star, Quote } from 'lucide-react';

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      name: 'Emma Johnson',
      role: 'Mother of Alex (8 years old)',
      content: 'BitBuds has transformed my son\'s relationship with technology. Instead of just consuming content, he\'s now creating his own games and animations. The progress tracking helps me stay involved in his learning journey.',
      rating: 5,
      avatar: '👩‍💼'
    },
    {
      name: 'David Chen',
      role: 'Father of Lily (10 years old)',
      content: 'As a software engineer, I was looking for a platform that would teach my daughter real programming concepts in a fun way. BitBuds delivers exactly that - she\'s learning loops, variables, and functions without even realizing it!',
      rating: 5,
      avatar: '👨‍💻'
    },
    {
      name: 'Sarah Williams',
      role: 'Teacher & Mom',
      content: 'I use BitBuds both at home with my kids and recommend it to parents at school. The curriculum is well-structured, and the gamification keeps children engaged for hours. It\'s educational screen time at its best.',
      rating: 5,
      avatar: '👩‍🏫'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Parents Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what real parents are saying about their BitBuds experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 relative"
            >
              {/* Quote Icon */}
              <div className="absolute -top-4 left-8 w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                <Quote className="w-4 h-4 text-white" />
              </div>
              
              {/* Rating */}
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              
              {/* Content */}
              <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
              
              {/* Author */}
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-2xl mr-4">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 mb-8">Trusted by educators and parents worldwide</p>
          <div className="flex justify-center items-center space-x-8 opacity-60">
            <div className="text-2xl font-bold text-gray-400">Common Sense Media</div>
            <div className="text-2xl font-bold text-gray-400">EdTech Hub</div>
            <div className="text-2xl font-bold text-gray-400">Parents Choice</div>
            <div className="text-2xl font-bold text-gray-400">COPPA Compliant</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;