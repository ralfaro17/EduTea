import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

function Logout() {
  const navigate = useNavigate();
  localStorage.removeItem('tokens');
  const queryClient = useQueryClient();

  useEffect(() => {
    document.title = " Logout - EduTea "
    queryClient.clear();
    navigate('/');
  }, [navigate, queryClient]);

  return (
    <>
      <Navbar />
      <Footer />
    </>
  );
}

export default Logout;
