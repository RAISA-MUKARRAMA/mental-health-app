import { useState, useEffect } from 'react';
import {
  Activity,
  Calendar,
  TrendingUp,
  Award,
  Cloud,
  Wind,
  Trophy,
  Flame,
  Smile,
} from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';
import { emotionsData } from '../data/emotionsData';
import AnimationBackground from '../components/AnimationBackground';
import { useNavigate } from '../utils/navigation';
import { dashboardStyles } from '../components/dashboard/dashboardStyle';
import DashboardBackground from '../components/dashboard/DashboardBackground';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { StatsGrid } from '../components/dashboard/StatsGrid';
import { MainGrid } from '../components/dashboard/MainGrid';
import { RecentCheck_ins } from '../components/dashboard/RecentCheck_ins';
import { DashboardAchievement } from '../components/dashboard/DashboardAchievement';
import { EmotionCardView } from '../components/dashboard/EmotionCardView';
import EmotionJourney from '../components/dashboard/EmotionJourney';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const prepareEmotionTimeline = (checkins) => {
  const emotions = ['happy','calm','anxious','sad','unfocused','helpless'];

  // ✅ sort oldest → newest
  const sorted = [...checkins].sort(
    (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
  );

  const groupedByDate = {};

  sorted.forEach(c => {
    const date = new Date(c.timestamp).toLocaleDateString();

    if (!groupedByDate[date]) {
      groupedByDate[date] = { date };

      // initialize all emotions (IMPORTANT)
      emotions.forEach(e => groupedByDate[date][e] = 0);
    }

    groupedByDate[date][c.emotion.toLowerCase()] = c.intensity;
  });

  return Object.values(groupedByDate);
};

const getWeeklySuggestion = (checkins) => {
  const last7 = checkins.slice(0, 7);
  if (!last7.length) return '';

  const totals = {};
  last7.forEach(c => {
    totals[c.emotion] = (totals[c.emotion] || 0) + c.intensity;
  });

  const dominant = Object.keys(totals).reduce((a, b) =>
    totals[a] > totals[b] ? a : b
  );

  const suggestions = {
    happy: "You had a joyful week! Keep up the positive energy!",
    calm: "You were calm this week. Maybe try a fun challenge.",
    anxious: "You seem anxious. Try breathing or talking to someone.",
    sad: "You seem sad. Consider reaching out to someone you trust.",
    unfocused: "You felt distracted. Try breaking tasks into smaller parts.",
    helpless: "You felt helpless. You don’t have to go through it alone."
  };

  return suggestions[dominant] || '';
};

const DashboardPage = ({ navigate: propNavigate }) => {
  const navigate = useNavigate() || propNavigate;
  const { user, isAuthenticated, token } = useAuth();

  const [hoveredCard, setHoveredCard] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [journeyMode, setJourneyMode] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const [checkins, setCheckins] = useState([]);
  const [stats, setStats] = useState(null);
  const [weeklyMood, setWeeklyMood] = useState([]);
  const [recentEmotions, setRecentEmotions] = useState([]);

  // Prepare chart data
  const emotionTimeline = prepareEmotionTimeline(checkins);
  const weeklySuggestion = getWeeklySuggestion(checkins);

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
  }, [isAuthenticated, navigate]);

  // Mouse movement
  useEffect(() => {
    const handleMouseMove = (e) => setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Fetch all check-ins
  useEffect(() => {
    const fetchCheckins = async () => {
      if (!token) return;
      try {
        const res = await fetch('http://localhost:5002/api/checkins', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        // Sort newest first
        const sorted = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setCheckins(sorted);

        // Weekly mood (last 7 days)
        const last7 = sorted.slice(0, 7).map((c) => ({
          day: new Date(c.timestamp).toLocaleDateString('en-US', { weekday: 'short' }),
          value: c.intensity,
          emoji: getEmojiForIntensity(c.intensity),
        }));
        setWeeklyMood(last7);

        // Recent check-ins (latest 5)
        const recent = sorted.slice(0, 5).map((c) => ({
          emotion: c.emotion,
          time: getTimeAgo(c.timestamp),
          icon: getEmotionIcon(c.emotion),
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          intensity: c.intensity,
        }));
        setRecentEmotions(recent);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCheckins();
  }, [token]);

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      if (!token) return;
      try {
        const res = await fetch('http://localhost:5002/api/checkins/stats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, [token]);

  // Helpers
  const getTimeAgo = (timestamp) => {
    const diff = Date.now() - new Date(timestamp);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
  };

  const getEmotionIcon = (emotion) => {
    switch (emotion?.toLowerCase()) {
      case 'calm': return Cloud;
      case 'reflective': return Wind;
      case 'happy': return Smile;
      case 'stressed': return Flame;
      default: return Cloud;
    }
  };

  const getEmojiForIntensity = (intensity) => {
    if (intensity >= 80) return '😊';
    if (intensity >= 60) return '🙂';
    if (intensity >= 40) return '😐';
    return '😔';
  };

  const handleEmotionSelect = (emotion) => {
    setIsAnimating(true);
    setTimeout(() => {
      setSelectedEmotion(emotion);
      setCurrentQuoteIndex(
        Math.floor(Math.random() * emotionsData[emotion].quotes.length)
      );
      setIsAnimating(false);
    }, 300);
  };

  const handleClose = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setSelectedEmotion(null);
      setIsAnimating(false);
    }, 300);
  };

  // Particles / background
  const [particles] = useState([...Array(50)].map(() => ({
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 30 + 20,
    delay: Math.random() * 8,
    opacity: Math.random() * 0.2 + 0.05,
  })));
  const [floatingHearts] = useState([...Array(5)].map(() => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 15 + 10,
    duration: Math.random() * 15 + 10,
    delay: Math.random() * 5,
  })));
  const [stars] = useState([...Array(15)].map(() => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 3,
  })));

  // Fallback weeklyMood if no data
  const fallbackMood = [
    { day: 'Mon', value: 0, emoji: '🙂' },
    { day: 'Tue', value: 0, emoji: '🙂' },
    { day: 'Wed', value: 0, emoji: '🙂' },
    { day: 'Thu', value: 0, emoji: '🙂' },
    { day: 'Fri', value: 0, emoji: '🙂' },
    { day: 'Sat', value: 0, emoji: '🙂' },
    { day: 'Sun', value: 0, emoji: '🙂' },
  ];


  // Journey screen
  if (journeyMode) {
    return (
      <EmotionJourney
        onComplete={async (emotion) => {
          setJourneyMode(false);
          try {
            await fetch('http://localhost:5002/api/checkins', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                emotion,
                intensity: Math.floor(Math.random() * 100),
              }),
            });
          } catch (err) { console.error(err); }
          handleEmotionSelect(emotion);
        }}
        onExit={() => setJourneyMode(false)}
      />
    );
  }

  // Emotion result screen
  if (selectedEmotion) {
    const data = emotionsData[selectedEmotion];
    if (!data) return null;
    const quote = data.quotes[currentQuoteIndex];
    const tip = data.tips[currentQuoteIndex];
    return (
      <div className={`min-h-screen relative overflow-hidden bg-gradient-to-br ${data.bgColor} pt-16`}>
        <AnimationBackground type={data.animation} />
        <EmotionCardView
          data={data}
          handleClose={handleClose}
          tip={tip}
          quote={quote}
          setCurrentQuoteIndex={setCurrentQuoteIndex}
          currentQuoteIndex={currentQuoteIndex}
          isAnimating={isAnimating}
        />
      </div>
    );
  }

  // ✅ Dashboard content
  return (
    <>
      <style>{dashboardStyles}</style>

      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-50 via-stone-50 to-gray-100 pt-20 pb-12 px-4">
        <DashboardBackground
          particles={particles}
          floatingHearts={floatingHearts}
          stars={stars}
          mousePosition={mousePosition}
        />

        <DashboardHeader
          user={user}
          weeklyMood={weeklyMood.length ? weeklyMood : fallbackMood}
        />

        {/* Daily Check-In */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-10 text-center">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
              Daily Emotional Check‑In
            </h2>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-8">
              Take a few guided moments to reflect on how you’ve been feeling.
            </p>
            <button
              onClick={() => setJourneyMode(true)}
              className="px-8 py-3 bg-gray-900 text-white rounded-lg text-base font-medium hover:bg-gray-800 transition-all duration-200"
            >
              Start Today’s Check‑In Journey
            </button>
            <p className="text-sm text-gray-400 mt-4">
              This experience takes about 2–3 minutes.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <StatsGrid
          stats={[
            { icon: Activity, label: 'Check-ins', value: stats?.totalCheckins || 0, trend: '+12%', color: 'from-gray-500 to-gray-600', bgColor: 'from-gray-50 to-gray-100' },
            { icon: Calendar, label: 'Consistency', value: stats ? `${stats.last7DaysCount} days` : '0', trend: 'Active', color: 'from-gray-500 to-gray-600', bgColor: 'from-gray-50 to-gray-100' },
            { icon: TrendingUp, label: 'Emotional Growth', value: stats ? `${stats.avgIntensity}%` : '0%', trend: 'Improving', color: 'from-gray-500 to-gray-600', bgColor: 'from-gray-50 to-gray-100' },
            { icon: Award, label: 'Milestones', value: '5', trend: '2 new', color: 'from-gray-500 to-gray-600', bgColor: 'from-gray-50 to-gray-100' },
          ]}
          hoveredCard={hoveredCard}
          setHoveredCard={setHoveredCard}
        />

        {/* MainGrid */}
        {/* <MainGrid weeklyMood={weeklyMood.length ? weeklyMood : fallbackMood} /> */}

        <div className="max-w-4xl mx-auto mb-12 p-6 bg-white rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold mb-4">Your Emotional Timeline</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={emotionTimeline}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="happy" stroke="#facc15" />
            <Line type="monotone" dataKey="calm" stroke="#3b82f6" />
            <Line type="monotone" dataKey="anxious" stroke="#ef4444" />
            <Line type="monotone" dataKey="sad" stroke="#9333ea" />
            <Line type="monotone" dataKey="unfocused" stroke="#14b8a6" />
            <Line type="monotone" dataKey="helpless" stroke="#f97316" />
          </LineChart>
        </ResponsiveContainer>
        {weeklySuggestion && (
          <p className="mt-4 text-gray-700 text-lg font-medium">
            Suggestion: {weeklySuggestion}
          </p>
        )}
      </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* ✅ Recent Check-Ins now dynamic */}
          <RecentCheck_ins recentEmotions={recentEmotions.length ? recentEmotions : []} />

          {/* Achievements */}
          <DashboardAchievement
            achievements={[
              { icon: Flame, title: '7 Day Consistency', desc: 'You’ve been showing up for yourself.', color: 'text-gray-600', bgColor: 'bg-gray-50', unlocked: true },
              { icon: Trophy, title: 'First Reflection', desc: 'You started your journey.', color: 'text-gray-600', bgColor: 'bg-gray-50', unlocked: true },
            ]}
          />
        </div>
      </div>
    </>
  );
};

export default DashboardPage;