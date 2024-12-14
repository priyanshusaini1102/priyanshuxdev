import React from 'react';
import { GraduationCap } from 'lucide-react';

const Education = () => {
  const education = [
    {
      degree: "MCA",
      institution: "Graphic Era University",
      location: "Dehradun, Uttarakhand",
      duration: "2021-23",
      score: "CGPA: 8.15"
    },
    {
      degree: "BCA",
      institution: "IMS Noida",
      location: "Noida, Uttar Pradesh",
      duration: "2018-2021",
      score: "CGPA: 7"
    }
  ];

  return (
    <section id="education" className="py-20 bg-purple-50">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12">Education</h2>
        <div className="max-w-3xl mx-auto space-y-8">
          {education.map((edu, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md flex gap-4"
            >
              <div className="text-purple-600">
                <GraduationCap size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  {edu.degree}
                </h3>
                <p className="text-purple-600 font-semibold">
                  {edu.institution}
                </p>
                <p className="text-gray-600">
                  {edu.location} • {edu.duration}
                </p>
                <p className="text-gray-600 mt-2">{edu.score}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;