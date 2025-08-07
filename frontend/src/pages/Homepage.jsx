import Navbar from '../components/Navbar';
import HomepageSection from '../components/HomepageSection';
import Footer from '../components/Footer';
import { useEffect } from 'react';

function Homepage() {
  useEffect(() => {
    document.title = ' Homepage - EduTea ';
  }, []);

  return (
    <>
      <Navbar />
      <HomepageSection
        title={'Learn, share and connect with no limits'}
        description={
          'EduTea is a tool designed to promote effective communication between students and teachers in a virtual environment. Our platform offers specialized chat rooms where you can participate in real-time discussions on topics related to your classes.'
        }
        imagePath={'/homepageImage1.png'}
        bgColor={'bg-white'}
      />
      <HomepageSection
        title={'Chat rooms and live communication'}
        description={
          'With EduTea, we break down physical barriers and allow students and teachers to connect from anywhere, anytime. There is no longer any need to wait for the next class or look for compatible times to clarify doubts or debate a specific topic. Our platform gives you the possibility of interacting with your classmates and teachers instantly, thus promoting collaborative and enriching learning.'
        }
        imagePath={'/homepageImage2.png'}
        bgColor={'bg-tea-green'}
      />
      <HomepageSection
        title={'An online community'}
        description={
          "It doesn't matter if you are a student looking to clarify doubts, a teacher who wants to interact with their students or a study group that needs a collaboration space, EduTea is here to enhance your educational experience. Join our community and discover how instant messaging can transform the way you learn and teach."
        }
        imagePath={'/homepageImage3.png'}
        bgColor={'bg-white'}
      />
      <Footer />
    </>
  );
}

export default Homepage;
