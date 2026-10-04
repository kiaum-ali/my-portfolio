import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import Experience from '../components/Experience';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="relative">
      {/* Navigation Bar */}
      <Navbar />

      {/* Main Content Area */}
      <main>
        {/* Hero Section */}
        <Hero />

        {/* About Section */}
        <About />

          {/* Skills Section */}
        <Skills /> 

        {/* Projects Section */}
        <Projects />

        {/* Experience Section */}
        <Experience />

        {/* Contact Section */}
        <Contact />
      </main>

        {/* Contact Section */}
       <Footer />
    </div>
  );
};

export default Home;