import React from 'react';
import Hero from '../components/Hero';

const Home = () => {
  return (
    <div>
      <Hero />

      {/* 3-Step Flow Graphic */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-5xl mb-4">①</div>
            <h3 className="text-xl font-semibold mb-2">Donate</h3>
            <p>Restaurants list surplus food items, quantities, and pickup times.</p>
          </div>
          <div>
            <div className="text-5xl mb-4">②</div>
            <h3 className="text-xl font-semibold mb-2">Claim</h3>
            <p>Verified NGOs browse donations and request a claim for pickup.</p>
          </div>
          <div>
            <div className="text-5xl mb-4">③</div>
            <h3 className="text-xl font-semibold mb-2">Impact</h3>
            <p>Food is distributed, and restaurants earn social points.</p>
          </div>
        </div>
      </section>

      {/* Impact Counters (Static placeholder) */}
      <section className="py-16 text-center">
        <h2 className="text-3xl font-bold text-center mb-12">Our Impact</h2>
        <div className="flex justify-around">
            <div>
              <div className="text-4xl font-bold">10,000+</div>
              <div className="text-lg">Meals Saved</div>
            </div>
            <div>
              <div className="text-4xl font-bold">150+</div>
              <div className="text-lg">Restaurants</div>
            </div>
            <div>
              <div className="text-4xl font-bold">50+</div>
              <div className="text-lg">NGO Partners</div>
            </div>
        </div>
      </section>
    </div>
  );
};

export default Home;