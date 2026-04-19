/**
 * App component - updated at Fri Mar 27 09:38:46 2026
 */
/**
 * App component - updated at Fri Mar 27 09:38:46 2026
 */
/**
 * App component - updated at Fri Mar 27 09:38:46 2026
 */
/**
 * App component - updated at Fri Mar 27 09:38:46 2026
 */
/**
 * App component - updated at Fri Mar 27 09:37:50 2026
 */
/**
 * App component - updated at Fri Mar 27 09:37:05 2026
 */
/**
 * App component - updated at Fri Mar 27 09:35:04 2026
 */
/**
 * App component - updated at Fri Mar 27 09:34:01 2026
 */
/**
 * App component - updated at Fri Mar 27 09:32:39 2026
 */
/**
 * App component - updated at Fri Mar 27 09:30:07 2026
 */
/**
 * App component - updated at Fri Mar 27 09:30:07 2026
 */
/**
 * App component - updated at Fri Mar 27 09:30:07 2026
 */
import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import LoadingSpinner from './components/UI/LoadingSpinner';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const Events = lazy(() => import('./pages/Events'));
const EventDetail = lazy(() => import('./pages/EventDetail'));
const MyPOAPs = lazy(() => import('./pages/MyPOAPs'));
const CreateEvent = lazy(() => import('./pages/CreateEvent'));
const Gallery = lazy(() => import('./pages/Gallery'));
const About = lazy(() => import('./pages/About'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));

function App() {
  return (
    <Layout>
      <Suspense fallback={<LoadingSpinner fullScreen />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:eventId" element={<EventDetail />} />
          <Route path="/my-poaps" element={<MyPOAPs />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}

export default App;

// add responsive design adjustments for modal-scroll-lock — ref:fix/modal-scroll-lock#7 (1776635081940)
