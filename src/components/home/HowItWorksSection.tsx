'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  DocumentTextIcon,
  CpuChipIcon,
  CheckBadgeIcon,
  FlagIcon,
} from '@heroicons/react/24/outline';

const steps = [
  {
    name: 'Submit Claim',
    description: 'Submit an article, post, or video for fact-checking.',
    icon: DocumentTextIcon,
  },
  {
    name: 'AI Verification',
    description: 'Our AI cross-checks your submission against trusted sources.',
    icon: CpuChipIcon,
  },
  {
    name: 'Get Trust Score',
    description: 'Receive a credibility score and detailed explanations.',
    icon: CheckBadgeIcon,
  },
  {
    name: 'Flag and Correct',
    description: 'Flag incorrect content and contribute new evidence.',
    icon: FlagIcon,
  },
];

export default function HowItWorksSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">Simple Process</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            How It Works
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Our platform makes fact-checking simple and efficient. Follow these steps to verify any claim.
          </p>
        </div>
        <motion.div
          ref={ref}
          className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
        >
          <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-4 lg:gap-x-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.name}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <div className="flex items-center justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600">
                    <step.icon className="h-8 w-8 text-white" aria-hidden="true" />
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <h3 className="text-lg font-semibold leading-7 text-gray-900">{step.name}</h3>
                  <p className="mt-2 text-base leading-7 text-gray-600">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="absolute left-full top-8 hidden -translate-x-1/2 transform lg:block">
                    <div className="h-[2px] w-16 bg-blue-600" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
} 