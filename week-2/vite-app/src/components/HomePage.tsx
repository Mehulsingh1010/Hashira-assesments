/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
// HomePage.jsx
"use client";
import { useState, useEffect } from "react";
import TeacherCard from "./TeacherCard";

export default function HomePage({ onLogout }) {
  const [expandedTeacher, setExpandedTeacher] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Retrieve user data from sessionStorage
    const storedData = sessionStorage.getItem('userData');
    if (storedData) {
      setUserData(JSON.parse(storedData));
    }
  }, []);

  const teachers = [
    {
      id: 1,
      name: "Dr. Teacher 1",
      subject: "Mathematics",
      department: "Science & Mathematics",
      experience: "15 years",
      about: "Specializes in calculus and algebra. Known for making complex concepts simple.",
      emoji: "📐",
    },
    {
      id: 2,
      name: "Prof. Teacher 2",
      subject: "Computer Science",
      department: "Technology",
      experience: "12 years",
      about: "Expert in programming and algorithms. Passionate about hands-on learning.",
      emoji: "💻",
    },
    {
      id: 3,
      name: "Ms. Teacher 3",
      subject: "Literature",
      department: "Arts & Humanities",
      experience: "10 years",
      about: "Encourages creative thinking and critical analysis of classical and modern texts.",
      emoji: "📚",
    },
    {
      id: 4,
      name: "Dr. Teacher 4",
      subject: "Physics",
      department: "Science & Mathematics",
      experience: "18 years",
      about: "Brings physics to life through experiments and real-world applications.",
      emoji: "⚛️",
    },
  ];

  const handleSubmitReview = async (teacherId: any, values: any) => {
    console.log(`Teacher Review Submitted for ID ${teacherId}:`, values);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setExpandedTeacher(null);
  };

  return (
    <div className="min-h-screen bg-stone-50 py-10 px-5">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white border-4 border-stone-800 shadow-[8px_8px_0px_0px_#292524] p-8 mb-10">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-stone-800 mb-2 font-serif">Teacher Survey</h1>
              <p className="text-stone-600 mb-4">Select a teacher to expand details and submit your review</p>
              
              {/* Display User Data */}
              {userData && (
                <div className="mt-4 p-4 bg-stone-50 border-2 border-stone-200 rounded-lg">
                  <h3 className="text-sm font-bold text-stone-800 mb-2">👤 Logged in as:</h3>
                  <div className="text-sm text-stone-700 space-y-1">
                    {userData.firstName && (
                      <p><strong>Name:</strong> {userData.firstName} {userData.lastName}</p>
                    )}
                    <p><strong>Email:</strong> {userData.email}</p>
                    {userData.registrationTime && (
                      <p className="text-xs text-stone-500 mt-2">
                        Registered: {new Date(userData.registrationTime).toLocaleString()}
                      </p>
                    )}
                    {userData.loginTime && (
                      <p className="text-xs text-stone-500">
                        Last login: {new Date(userData.loginTime).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={onLogout}
              className="px-6 py-2 bg-stone-800 text-stone-50 border-3 border-stone-800 font-semibold hover:bg-stone-50 hover:text-stone-800 transition-all"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {teachers.map((teacher) => (
            <TeacherCard
              key={teacher.id}
              teacher={teacher}
              isExpanded={expandedTeacher === teacher.id}
              onToggle={() => setExpandedTeacher(expandedTeacher === teacher.id ? null : teacher.id)}
              onSubmitReview={handleSubmitReview}
            />
          ))}
        </div>
      </div>
    </div>
  );
}