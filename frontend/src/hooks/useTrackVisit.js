import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import apiClient from '../api/client';

function getSessionId() {
  let id = localStorage.getItem('visitor_session_id');
  if (!id) {
    id = 'sess_' + Math.random().toString(36).substring(2) + Date.now();
    localStorage.setItem('visitor_session_id', id);
  }
  return id;
}

export default function useTrackVisit() {
  const location = useLocation();

  useEffect(() => {
    apiClient.post('/track-visit/', {
      path: location.pathname,
      session_id: getSessionId(),
    }).catch(() => {});
  }, [location.pathname]);
}