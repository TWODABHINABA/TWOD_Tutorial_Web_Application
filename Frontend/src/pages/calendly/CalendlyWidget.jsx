import { hover } from 'framer-motion';
import { useEffect } from 'react';

const CalendlyWidget = () => {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://assets.calendly.com/assets/external/widget.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    script.onload = () => {
      window.Calendly.initBadgeWidget({
        url: 'https://calendly.com/thewallofdreamsvinay/30-minutes-meeting?hide_event_type_details=1&hide_gdpr_banner=1',
        text: 'Schedule time with me',
        color: '#0069ff',
        textColor: '#ffffff',
        branding: true
      });
    };
    document.body.appendChild(script);

    return () => {
      // Optional cleanup
      document.head.removeChild(link);
      document.body.removeChild(script);
    };
  }, []);

  return null; // nothing to render
};

export default CalendlyWidget;
