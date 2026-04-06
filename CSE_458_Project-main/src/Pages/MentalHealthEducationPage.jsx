import React from "react";
import { Brain, Heart, Shield, Smile, Activity, BookOpen } from "lucide-react";
import { useNavigate } from "../utils/navigation";

const SectionCard = ({ icon: Icon, title, children }) => {
    return (
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-orange-100 hover:shadow-2xl transition duration-300">
            <div className="flex items-center gap-4 mb-4">
                <div className="bg-orange-100 p-3 rounded-xl">
                    <Icon className="text-orange-600" size={28} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                    {title}
                </h2>
            </div>
            <div className="text-gray-600 leading-relaxed text-base space-y-3">
                {children}
            </div>
        </div>
    );
};

const MentalHealthEducationPage = () => {
    const navigate = useNavigate();

    return (
        
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 pt-20 pb-16 px-6">

            {/* Header */}
            <div className="max-w-5xl mx-auto text-center mb-16">
                <div className="flex justify-center mb-6">
                    <div className="bg-orange-500 p-5 rounded-2xl shadow-lg">
                        <Brain className="text-white" size={40} />
                    </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                    Mental Health Education
                </h1>

                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                    Understanding mental health is the first step toward emotional well-being.
                    Learn why it matters, how it affects daily life, and how to take care of your mind.
                </p>
            </div>

            {/* Content Sections */}
            <div className="max-w-5xl mx-auto grid gap-10">

                {/* What is Mental Health */}
                <SectionCard icon={Smile} title="What is Mental Health?">
                    <p>
                        Mental health includes our emotional, psychological, and social well-being.
                        It affects how we think, feel, and act. It also determines how we handle stress,
                        relate to others, and make decisions.
                    </p>
                    <p>
                        Just like physical health, mental health is essential at every stage of life —
                        from childhood to adulthood.
                    </p>
                </SectionCard>

                {/* Why It’s Important */}
                <SectionCard icon={Heart} title="Why is Mental Health Important?">
                    <p>
                        Good mental health allows you to cope with stress, realize your abilities,
                        learn effectively, work productively, and contribute to your community.
                    </p>
                    <ul className="list-disc list-inside space-y-1">
                        <li>Improves relationships</li>
                        <li>Boosts productivity</li>
                        <li>Enhances physical health</li>
                        <li>Improves quality of life</li>
                    </ul>
                </SectionCard>

                {/* Common Challenges */}
                <SectionCard icon={Activity} title="Common Mental Health Challenges">
                    <p>
                        Many people experience mental health challenges such as:
                    </p>
                    <ul className="list-disc list-inside space-y-1">
                        <li>Anxiety disorders</li>
                        <li>Depression</li>
                        <li>Stress and burnout</li>
                        <li>Emotional instability</li>
                    </ul>
                    <p>
                        These challenges are common and treatable. Seeking help is a sign of strength,
                        not weakness.
                    </p>
                </SectionCard>

                {/* How to Improve */}
                <SectionCard icon={Shield} title="How to Maintain Good Mental Health">
                    <ul className="list-disc list-inside space-y-1">
                        <li>Practice mindfulness and meditation</li>
                        <li>Maintain strong social connections</li>
                        <li>Exercise regularly</li>
                        <li>Get enough sleep</li>
                        <li>Seek professional help when needed</li>
                    </ul>
                </SectionCard>
                {/* Learning More */}
                <SectionCard icon={BookOpen} title="Continue Learning">
                    <p>
                        Mental health awareness helps reduce stigma and encourages people to
                        seek support. Educating yourself and others creates a healthier society.
                    </p>
                    <p>
                        Explore tools in this app to track your mood, understand emotional patterns,
                        and grow your emotional intelligence.
                    </p>
                </SectionCard>
            </div>

            {/* Back Button */}
            <div className="text-center mt-16">
                <button
                    onClick={() => navigate("/")}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition transform hover:scale-105"
                >
                    ← Back to Home
                </button>
            </div>
        </div>
    );
};

export default MentalHealthEducationPage;