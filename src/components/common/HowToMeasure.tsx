'use client';

import { Tabs, Title } from '@mantine/core';
import Image from 'next/image';

const HowToMeasure = () => {
  const imageMap: Record<string, string> = {
    bust: '/bust.png',
    waist: '/waist.png',
    hips: '/hips.png',
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      {/* Professional Title */}
      <Title
        order={3}
        className="text-4xl md:text-5xl font-extrabold text-center text-gray-900 mb-8 tracking-wide"
      >
        How to Measure
      </Title>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <Tabs defaultValue="bust" color="yellow" variant="outline" className="w-full">
          <Tabs.List grow className="mb-6">
            <Tabs.Tab value="bust" className="font-semibold text-lg">Bust</Tabs.Tab>
            <Tabs.Tab value="waist" className="font-semibold text-lg">Waist</Tabs.Tab>
            <Tabs.Tab value="hips" className="font-semibold text-lg">Hips</Tabs.Tab>
          </Tabs.List>

          {['bust', 'waist', 'hips'].map((tab) => (
            <Tabs.Panel key={tab} value={tab}>
              <div className="flex flex-col gap-6">
                {/* Full width image */}
                <div className="w-full">
                  <Image
                    src={imageMap[tab]}
                    alt={`${tab} measurement`}
                    width={1200} // set a large width for full width
                    height={600} // adjust height as per image ratio
                    className="w-full h-auto rounded-md shadow-md object-contain"
                  />
                </div>

                <div className="space-y-4 text-gray-700 text-lg">
                  {tab === 'bust' && (
                    <>
                      <p>
                        • This is a measurement of the fullest part of your bust or body circumference at the bust.
                        It measures the circumference of a woman's torso at the level of the breasts.
                      </p>
                      <p>
                        • Wrap the tape around the fullest part of your bust and center it on your back so it's level all the way around.
                      </p>
                    </>
                  )}
                  {tab === 'waist' && (
                    <>
                      <p>• Measure around the narrowest part of your waist (usually just above the belly button).</p>
                      <p>• Keep the tape snug but not too tight.</p>
                    </>
                  )}
                  {tab === 'hips' && (
                    <>
                      <p>• Measure around the fullest part of your hips and buttocks.</p>
                      <p>• Make sure the tape is level all the way around your body.</p>
                    </>
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-xl mb-3">Tips</h3>
                  <ul className="list-disc pl-6 space-y-2 text-lg text-gray-700">
                    {tab === 'bust' && (
                      <>
                        <li>This isn't your bra size!</li>
                        <li>Your arms should be relaxed and down at your sides.</li>
                        <li>Wear the bra you're planning to wear with your dress when measuring.</li>
                      </>
                    )}
                    {tab === 'waist' && (
                      <>
                        <li>Stand up straight but stay relaxed.</li>
                        <li>Don't suck in your stomach while measuring.</li>
                      </>
                    )}
                    {tab === 'hips' && (
                      <>
                        <li>Keep your feet together when measuring.</li>
                        <li>Don’t pull the tape too tight.</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </Tabs.Panel>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default HowToMeasure;
