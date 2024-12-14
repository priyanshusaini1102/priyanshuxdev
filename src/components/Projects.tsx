import React from 'react';
import { Github, ExternalLink } from 'lucide-react';

const Projects = () => {
  const projects = [
    {
      title: "Vercel Clone",
      description: "A CICD pipeline automation service with 3 microservices for automated deployment",
      tech: ["TypeScript", "Node.js", "Express", "Cloudinary R2", "Redis"],
      links: {
        github: "https://github.com/priyanshusaini1102",
        demo: "#"
      }
    },
    {
      title: "Instagram Clone",
      description: "Full-featured social media platform with real-time messaging using Firebase",
      tech: ["Next.js", "Firebase", "Google Auth"],
      links: {
        github: "https://github.com/priyanshusaini1102",
        demo: "#"
      }
    },
    {
      title: "E-Commerce Store",
      description: "Feature-rich online store with Stripe payment integration and product management",
      tech: ["MERN Stack", "Redux", "Stripe.js", "Cloudinary"],
      links: {
        github: "https://github.com/priyanshusaini1102",
        demo: "#"
      }
    }
  ];

  return (
    <section id="projects" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12">Featured Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-gray-600 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-purple-100 text-purple-600 rounded-md text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4">
                  <a
                    href={project.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-gray-600 hover:text-purple-600 transition-colors"
                  >
                    <Github size={18} />
                    Code
                  </a>
                  <a
                    href={project.links.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-gray-600 hover:text-purple-600 transition-colors"
                  >
                    <ExternalLink size={18} />
                    Demo
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;