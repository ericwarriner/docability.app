import React from 'react';
import { Link } from 'react-router-dom';
import { MutatingDots } from 'react-loader-spinner';


export function Header() {

  return (
    <header className="sticky top-0 z-10 bg-white/50 backdrop-filter backdrop-blur-lg">
      <div className="flex items-center h-16 mx-auto max-w-7xl px-6 ">
      <MutatingDots 
  height="100"
  width="100"
  color="rgb(125, 134, 238)"
  secondaryColor= 'rgb(50, 150, 250)'
  radius='15.5'
  ariaLabel="mutating-dots-loading"
  wrapperStyle={{}}
  wrapperClass=""
  visible={true}
 />
        <div className="flex-grow lg:flex-shrink-0 lg:flex-grow-0">
       
          <h3
            className="text-2xl font-bold tracking-wide text-gray-800"
           
          >
            <Link to="/" className="hover:underline text-customerpurple  font-Exo text-2xl">
              DOC<span className="text-customblue font-extrabold text-2xl">A</span>B<span className="text-customblue  font-extrabold text-2xl ">I</span>LITY
            </Link>
          </h3>
          <p className="hidden lg:block  text-gray-900 font-Exo text-lg">AI Assisted PDF Document Review</p>
        </div>
        <div className="hidden lg:flex items-center justify-center flex-grow">

        </div>
        <div className="flex flex-shrink-0 space-x-4">
        </div>
      </div>
    </header>
  );
}

type HeaderLinkProps = {
  to: string;
  children: React.ReactNode;
};

function HeaderLink({ to, children }: HeaderLinkProps) {
  return (
    <Link to={to} className="flex items-center font-semibold text-gray-700 hover:text-gray-900 ">
      {children}
    </Link>
  );
}
