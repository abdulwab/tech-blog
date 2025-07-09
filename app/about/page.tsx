import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">About Me</h1>
      <div className="bg-white dark:bg-gray-900 shadow-lg rounded-xl p-8">
        <p className="text-lg text-gray-700 dark:text-gray-200 mb-4">
          👋 Hi! I'm <span className="font-semibold text-blue-600 dark:text-blue-400">Abdul Wahab</span>, a full-stack developer with a deep love for building efficient digital solutions and exploring AI-driven tech.
        </p>
        <p className="text-lg text-gray-700 dark:text-gray-200 mb-4">
          I specialize in technologies like <strong>React</strong>, <strong>TypeScript</strong>, <strong>Vue</strong>, <strong>Firebase</strong>, <strong>Python</strong>, and <strong>Cloud Functions</strong>. This blog is my space to share ideas, tutorials, and lessons learned from real-world projects.
        </p>
        <p className="text-lg text-gray-700 dark:text-gray-200 mb-4">
          Whether it's building AI agents, automating workflows, or deploying IoT projects, I enjoy turning ideas into working systems. I also write to help others on their tech journey.
        </p>
        <p className="text-lg text-gray-700 dark:text-gray-200">
          Let's connect on{' '}
          <a
            href="https://github.com/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            GitHub
          </a>{' '}
          or{' '}
          <a
            href="https://linkedin.com/in/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            LinkedIn
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default AboutPage;