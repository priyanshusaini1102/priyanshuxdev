import React from 'react';
import { Briefcase } from 'lucide-react';

const Experience = () => {
  const experiences = [
    {
      company: "Datacultr",
      position: "Full Stack Developer - I",
      duration: "Current",
      description: [
        "Integrated PDF Signature feature for electronic contract signing",
        "Implemented Single Device Login functionality for enhanced security",
        "Integrated PostHog analytics platform for user behavior tracking",
        "Resolved VAPT issues and implemented security measures",
        "Led development of SMF_Pilot React Native project",
        "Unified dashboards into Nucleus platform",
        "Developed Mailing Service microservice using Node.js"
      ]
    },
    {
      company: "Internshala",
      position: "Associate Software Development Engineer",
      duration: "Feb 2023 - Present",
      description: [
        "Led redesign of Placement Guarantee Course dashboard",
        "Created custom Entity Repository for optimized data fetching",
        "Implemented CSRF protection across controller endpoints",
        "Migrated PGC Student Profile Tool from AngularJS to React"
      ]
    }
  ];

  return (
    <section id="experience" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12">
          Professional Experience
        </h2>
        <div className="space-y-12">
          {experiences.map((exp, index) => (
            <div
              key={index}
              className="border-l-4 border-purple-600 pl-6 space-y-4 relative"
            >
              <div className="absolute -left-3 top-0 bg-white p-1">
                <Briefcase className="text-purple-600" size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {exp.position}
                </h3>
                <p className="text-purple-600 font-semibold">
                  {exp.company} • {exp.duration}
                </p>
              </div>
              <ul className="space-y-2">
                {exp.description.map((item, i) => (
                  <li key={i} className="text-gray-600">
                    • {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;