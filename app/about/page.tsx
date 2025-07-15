import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-6 text-center text-[var(--text-primary)]">About Me</h1>
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] shadow-lg rounded-xl p-8">
        <p className="text-lg text-[var(--text-primary)] mb-4">
          👋 Hi! I'm <span className="font-semibold text-[var(--accent-web)]">Abdul Wahab</span>, a full-stack developer with a deep love for building efficient digital solutions and exploring AI-driven tech.
        </p>
        <p className="text-lg text-[var(--text-primary)] mb-4">
          I specialize in technologies like <strong>React</strong>, <strong>TypeScript</strong>, <strong>Vue</strong>, <strong>Firebase</strong>, <strong>Python</strong>, and <strong>Cloud Functions</strong>. This blog is my space to share ideas, tutorials, and lessons learned from real-world projects.
        </p>
        <p className="text-lg text-[var(--text-primary)] mb-4">
          Whether it's building AI agents, automating workflows, or deploying IoT projects, I enjoy turning ideas into working systems. I also write to help others on their tech journey.
        </p>
        <p className="text-lg text-[var(--text-primary)] mb-6">
          Check out my{' '}
          <a
            href="https://www.abdulwahab.live/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent-web)] hover:text-[var(--accent-web-dark)] hover:underline transition-colors"
          >
            portfolio
          </a>{' '}
          to see my latest projects and work.
        </p>
        <p className="text-lg text-[var(--text-primary)]">
          Let's connect on{' '}
          <a
            href="https://github.com/abdulwab"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent-web)] hover:text-[var(--accent-web-dark)] hover:underline transition-colors"
          >
            GitHub
          </a>
          ,{' '}
          <a
            href="https://www.linkedin.com/in/abdul-wahab-7bb7b490/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent-iot)] hover:text-[var(--accent-iot-dark)] hover:underline transition-colors"
          >
            LinkedIn
          </a>
          , or join our{' '}
          <a
            href="https://discord.gg/VkAW9rEn"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent-ai)] hover:text-[var(--accent-ai-dark)] hover:underline transition-colors"
          >
            Discord community
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default AboutPage;