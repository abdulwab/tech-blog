'use client';

import React, { useState } from 'react';
import { Github, Linkedin, MessageCircle, Globe, Mail, Send } from 'lucide-react';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // TODO: Send data to backend or use service like Formspree or EmailJS
    alert('Thank you for reaching out! I\'ll get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-[var(--background)] py-16">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-[var(--text-primary)]">Get In Touch</h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            Have a question, project idea, or just want to say hello? I'd love to hear from you! 
            Drop me a message below or connect with me on social media.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] shadow-lg rounded-xl p-8">
            <h2 className="text-2xl font-semibold mb-6 text-[var(--text-primary)]">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[var(--card-bg)] border border-[var(--border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-web)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] transition-all"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[var(--card-bg)] border border-[var(--border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-web)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] transition-all"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[var(--card-bg)] border border-[var(--border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-web)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] transition-all resize-vertical"
                  placeholder="Tell me about your project or question..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[var(--accent-web)] to-[var(--accent-ai)] text-white font-semibold py-3 px-6 rounded-lg hover:shadow-lg hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[var(--accent-web)] transition-all duration-200 flex items-center justify-center"
              >
                <Send className="h-5 w-5 mr-2" />
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information & Social Links */}
          <div className="space-y-8">
            {/* Portfolio Link */}
            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] shadow-lg rounded-xl p-8">
              <h2 className="text-2xl font-semibold mb-4 text-[var(--text-primary)]">Portfolio & Work</h2>
              <p className="text-[var(--text-secondary)] mb-6">
                Want to see my latest projects and professional experience? Check out my portfolio website for a comprehensive overview of my work.
              </p>
              <a
                href="https://www.abdulwahab.live/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-[var(--accent-web)] text-white px-6 py-3 rounded-lg hover:bg-[var(--accent-web-dark)] transition-colors"
              >
                <Globe className="h-5 w-5 mr-2" />
                View Portfolio
              </a>
            </div>

            {/* Social Links */}
            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] shadow-lg rounded-xl p-8">
              <h2 className="text-2xl font-semibold mb-4 text-[var(--text-primary)]">Connect With Me</h2>
              <p className="text-[var(--text-secondary)] mb-6">
                Follow me on social media for updates, behind-the-scenes content, and tech discussions.
              </p>
              
              <div className="space-y-4">
                <a
                  href="https://github.com/abdulwab"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-3 rounded-lg hover:bg-[var(--hover-bg)] transition-colors group"
                >
                  <Github className="h-6 w-6 text-[var(--text-secondary)] group-hover:text-[var(--accent-web)] mr-4 transition-colors" />
                  <div>
                    <div className="font-medium text-[var(--text-primary)]">GitHub</div>
                    <div className="text-sm text-[var(--text-secondary)]">Check out my code and projects</div>
                  </div>
                </a>

                <a
                  href="https://www.linkedin.com/in/abdul-wahab-7bb7b490/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-3 rounded-lg hover:bg-[var(--hover-bg)] transition-colors group"
                >
                  <Linkedin className="h-6 w-6 text-[var(--text-secondary)] group-hover:text-[var(--accent-iot)] mr-4 transition-colors" />
                  <div>
                    <div className="font-medium text-[var(--text-primary)]">LinkedIn</div>
                    <div className="text-sm text-[var(--text-secondary)]">Professional network and updates</div>
                  </div>
                </a>

                <a
                  href="https://discord.gg/VkAW9rEn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-3 rounded-lg hover:bg-[var(--hover-bg)] transition-colors group"
                >
                  <MessageCircle className="h-6 w-6 text-[var(--text-secondary)] group-hover:text-[var(--accent-ai)] mr-4 transition-colors" />
                  <div>
                    <div className="font-medium text-[var(--text-primary)]">Discord Community</div>
                    <div className="text-sm text-[var(--text-secondary)]">Join our tech community for discussions</div>
                  </div>
                </a>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] shadow-lg rounded-xl p-8">
              <h2 className="text-2xl font-semibold mb-4 text-[var(--text-primary)]">Response Time</h2>
              <div className="flex items-center text-[var(--text-secondary)]">
                <Mail className="h-5 w-5 mr-3 text-[var(--accent-web)]" />
                <span>I typically respond within 24-48 hours</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;