import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useEffect } from 'react';
import { Card } from '@/components/ui/card';

function About() {
  useEffect(() => {
    document.title = 'About - EduTea';
  }, []);

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center my-4 gap-12 flex-col md:flex-row">
        <Card className="w-full max-w-md p-6 grid gap-6 bg-beige border-2 border-dark-moss-green">
          <div className="flex items-center flex-col">
            <h3 className="text-xl font-semibold">EduTea</h3>
            <p className="text-muted-foreground text-sm">
              A platform for interactive learning and educational resources
            </p>
          </div>
          <div className="grid gap-4">
            <div>
              <h4 className="text-lg font-medium">Key Features</h4>
              <ul className="mt-2 space-y-2 text-muted-foreground">
                <li>
                  <CheckIcon className="mr-2 inline-block h-4 w-4" />
                  Account role system for teachers, students, and administrators
                </li>
                <li>
                  <CheckIcon className="mr-2 inline-block h-4 w-4" />
                  Real time chat rooms for everyone
                </li>
                <li>
                  <CheckIcon className="mr-2 inline-block h-4 w-4" />
                  Robust security and privacy features to ensure reliability
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-medium">Who is it for?</h4>
              <p className="text-muted-foreground">
                EduTea is designed for Educational centers of any level, from
                elementary school to college, as well as anyone whose needs are
                a platform to teach remotely.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-medium">Why EduTea</h4>
              <p className="text-muted-foreground">
                EduTea has the goal of providing a tool integrated in a singled
                environment with many essential features needed for a regular
                classroom, alongside the technologies to make it possible.
              </p>
            </div>
          </div>
        </Card>

        <Card className="w-full max-w-md p-6 grid gap-6 bg-baby-powder border-2 border-dark-moss-green">
          <div className="flex items-center flex-col">
            <h3 className="text-xl font-semibold">Technologies used</h3>
            <p className="text-muted-foreground text-sm">
              The core of this project
            </p>
          </div>
          <div className="grid gap-4">
            <div>
              <h4 className="text-lg font-medium">Frontend</h4>
              <ul className="mt-2 space-y-2 text-muted-foreground">
                <li>
                  <CheckIcon className="mr-2 inline-block h-4 w-4" />
                  React
                </li>
                <li>
                  <CheckIcon className="mr-2 inline-block h-4 w-4" />
                  ShadCN
                </li>
                <li>
                  <CheckIcon className="mr-2 inline-block h-4 w-4" />
                  TailwindCSS
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-medium">Backend</h4>
              <ul className="mt-2 space-y-2 text-muted-foreground">
                <li>
                  <CheckIcon className="mr-2 inline-block h-4 w-4" />
                  Django
                </li>
                <li>
                  <CheckIcon className="mr-2 inline-block h-4 w-4" />
                  JWT
                </li>
                <li>
                  <CheckIcon className="mr-2 inline-block h-4 w-4" />
                  AWS
                </li>
              </ul>
            </div>
            <div>
              
            </div>
          </div>
        </Card>

        <Card className="w-full max-w-md p-6 grid gap-6 bg-beige border-2 border-dark-moss-green">
          <div className="flex items-center flex-col">
            <h3 className="text-xl font-semibold">EduTeams</h3>
            <p className="text-muted-foreground text-sm">
              The studio behind the ideas
            </p>
          </div>
          <div className="grid gap-4">
            <div>
              <h4 className="text-lg font-medium">Mission</h4>
              <ul className="mt-2 space-y-2 text-muted-foreground">
                <li>
                  <CheckIcon className="mr-2 inline-block h-4 w-4" />
                  Provide educational apps to help students and teachers in
                  their daily tasks, and for remote learning
                </li>
                <li>
                  <CheckIcon className="mr-2 inline-block h-4 w-4" />
                  Encourage people to learn and teach in a fun and interactive
                  way
                </li>
                <li>
                  <CheckIcon className="mr-2 inline-block h-4 w-4" />
                  Integrate modern technologies to make learning more accessible
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-medium">Contact info</h4>
              <p className="text-muted-foreground">
                If you are interested in giving feedback, or have any questions,
                please contact us at{' '}
                <a
                  className="text-dark-moss-green font-bold"
                  href="mailto:ralfaros9317@gmail.com"
                >
                  this mail
                </a>{' '}
                we are always happy to hear from you.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-medium">Other products</h4>
              <p className="text-muted-foreground">
                If you are interested in learning the basics of computational
                geometry, take a look at{' '}
                <a
                  className="text-[#76502f] font-bold"
                  href="https://geocafe.onrender.com/"
                >
                  Geocafe
                </a>
              </p>
            </div>
          </div>
        </Card>
      </div>
      <Footer />
    </>
  );
}

function CheckIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export default About;
