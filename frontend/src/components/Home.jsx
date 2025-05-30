import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Navbar from './shared/Navbar';
import HeroSection from './HeroSection';
import CategoryCarousel from './CategoryCarousel';
import LatestJobs from './LatestJobs';
import Footer from './shared/Footer';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import StatsCounter from './StatsCounter';

const Home = () => {
  const viewerRef = useRef(null);
  const scrollRef = useRef(null);
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [showPlaceholder, setShowPlaceholder] = useState(true);

  // Scroll animations
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -50]);

  useGetAllJobs();
  const { user } = useSelector(store => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === 'recruiter') {
      navigate("/admin/companies");
    }
  }, [user, navigate]);

  useEffect(() => {
    const loadTimer = setTimeout(() => {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://unpkg.com/@splinetool/viewer@1.9.95/build/spline-viewer.js';
      script.async = true;

      script.onload = () => {
        if (viewerRef.current && !viewerRef.current.hasChildNodes()) {
          const spline = document.createElement('spline-viewer');
          spline.setAttribute('loading-anim', 'true');
          spline.setAttribute('url', 'https://prod.spline.design/Q50CAA1NCZo65L6N/scene.splinecode');
          spline.style.width = '100%';
          spline.style.height = '100%';
          viewerRef.current.appendChild(spline);
          setSplineLoaded(true);
          
          const checkLoaded = setInterval(() => {
            if (spline.loaded) {
              setShowPlaceholder(false);
              clearInterval(checkLoaded);
            }
          }, 100);
        }
      };

      script.onerror = () => {
        console.error('Spline viewer failed to load');
        setShowPlaceholder(false);
      };

      document.body.appendChild(script);

      return () => {
        clearTimeout(loadTimer);
        if (script.parentNode) {
          document.body.removeChild(script);
        }
      };
    }, 300);

    return () => clearTimeout(loadTimer);
  }, []);

  return (
    <div style={{ position: 'relative' }} ref={scrollRef}>
      <Navbar />

      {/* Animated Spline Section */}
      <motion.div 
        style={{ 
          position: 'relative',
          height: '100vh',
          width: '100%',
          overflow: 'hidden',
          opacity,
          scale,
          y
        }}
      >
        <div ref={viewerRef} style={{ 
          width: '100%', 
          height: '100%',
          position: 'relative'
        }} />

        {showPlaceholder && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            zIndex: splineLoaded ? -1 : 1,
            transition: 'opacity 0.5s ease',
            opacity: splineLoaded ? 0 : 1
          }}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              style={{ textAlign: 'center' }}
            >
              <div style={{ 
                fontSize: '4rem', 
                fontWeight: 'bold', 
                marginBottom: '1rem',
                textShadow: '2px 2px 8px rgba(0,0,0,0.7)'
              }}>
                ‘Ello, mate!
              </div>
            </motion.div>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          style={{
            position: 'absolute',
            top: '30%',
            left: '65%',
            transform: 'translateY(-50%)',
            fontSize: '4rem',
            fontWeight: 'bold',
            color: '#000',
            textShadow: '2px 2px 8px rgba(0,0,0,0.7)',
            zIndex: 10,
            pointerEvents: 'none',
            whiteSpace: 'nowrap'
          }}
        >
          ‘Ello, mate!
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          onClick={() => {
            window.scrollTo({
              top: window.innerHeight,
              behavior: 'smooth'
            });
          }}
          whileHover={{ scale: 1.05, boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
          whileTap={{ scale: 0.98 }}
          style={{
            position: 'absolute',
            bottom: '20px',
            right: '10px',
            backgroundColor: '#fff',
            color: '#333',
            border: 'none',
            borderRadius: '10px',
            padding: '18px 40px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            zIndex: 10,
          }}
        >
          Scroll Down
        </motion.button>
      </motion.div>

      {/* Animated Content Sections */}
      <div style={{ position: 'relative', zIndex: 20 }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <HeroSection />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <StatsCounter />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <LatestJobs />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Footer />
        </motion.div>
      </div>
    </div>
  );
};

export default Home;