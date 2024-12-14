import React from 'react';
import { Code2, Server, Cloud, Database, Layout, Terminal } from 'lucide-react';

const Skills = () => {
  const skillCategories = [
    {
      title: "Programming Languages",
      icon: Code2,
      skills: ["C++", "JavaScript", "TypeScript"]
    },
    {
      title: "Frontend",
      icon: Layout,
      skills: ["React.js", "Next.js", "React Native", "Tailwind CSS", "HTML/CSS"]
    },
    {
      title: "Backend",
      icon: Server,
      skills: ["Node.js", "Express.js", "PHP", "CodeIgniter"]
    },
    {
      title: "Databases",
      icon: Database,
      skills: ["MySQL", "MongoDB", "Redis", "Firebase"]
    },
    {
      title: "Cloud & DevOps",
      icon: Cloud,
      skills: ["AWS", "Docker", "Nginx", "CI/CD", "Cloudflare"]
    },
    {
      title: "Tools",
      icon: Terminal,
      skills: ["Git", "GitHub Actions", "Kafka", "Kibana", "PM2"]
    }
  ];

  return (
    <section id="skills" className="py-20 bg-purple-50">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12">Technical Skills</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-3 mb-4">
                <category.icon className="text-purple-600" size={24} />
                <h3 className="text-xl font-semibold">{category.title}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;