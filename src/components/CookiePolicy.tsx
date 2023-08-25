

import { Button } from '@material-tailwind/react';
import { useEffect, useState } from 'react';


export function CookiePolicy() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!window.localStorage.getItem('cookiePolicy')) {
      setIsOpen(true);
    }
  }, []);

  function onAccept() {
    window.localStorage.setItem('cookiePolicy', 'accepted');
    setIsOpen(false);
  }

  if (!isOpen) {
    return <></>;
  }

  return (
    <div className="fixed bottom-0 left-0 m-12 rounded bg-gray-900 p-6 text-white text-sm max-w-lg ">
      <div className="flex items-center space-x-12">
        <p>
          Just so that you know... This site uses cookies.
          However, we take privacy very seriously and would never sell your information.
          Please see our privacy policy for more information.
          </p>        
        <div className="w-32">
          <Button onClick={onAccept} className="bg-customblue">Ok, Got it</Button>
        </div>
      </div>
    </div>
  );
}
