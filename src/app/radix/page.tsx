'use client'
import { useEffect, useState } from "react";
import { radixSort } from "../_components/radix";
import { motion, AnimatePresence } from "framer-motion";

function ArrayDisplay({ array, keyProp, currNumber }: { array: string[], keyProp: string, currNumber: string }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={keyProp}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className="flex flex-row justify-center gap-2"
      >
        {array.map((num, idx) => (
          <div
            key={num + '-' + idx}
            className={`rounded px-2 ${num === currNumber ? 'bg-yellow-300 border-2 border-yellow-500' : 'bg-green-200'}`}
          >
            {num}
          </div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}

export default function Home() {
  const [masterArr, setMaster] = useState([''])
  const [buckets, setBuckets] = useState<string[][]>([[], [], [], [], [], [], [], [], [], []])
  const [currDigit, setDigit] = useState(0)
  const [currNumber, setCurrNumber] = useState('')
  const [stepC, setStep] = useState(0)
  const fullMoveList = radixSort(['3', '1', '10', '50', '9', '8', '11', '13'])
  useEffect(() => {
    if (!fullMoveList.moves[stepC]) {
      return
    }
    setMaster(fullMoveList.moves[stepC].masterArray)
    setBuckets(fullMoveList.moves[stepC].buckets)
    setDigit(fullMoveList.moves[stepC].currDigit)
    setCurrNumber(fullMoveList.moves[stepC].currNumber)
  }, [stepC])

  const incrementStep = () => {
    setStep((c) => {
      const b = c + 1
      console.log('next step', b);
      return b
    })
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <motion.div animate={{ opacity: 1 }} className="font-black text-green-500">{!fullMoveList.moves[stepC] ? 'Fully Sorted!' : ''}</motion.div>
      <ArrayDisplay array={masterArr} keyProp={masterArr.join('-')} currNumber={currNumber} />
      <div className="">
        {/* Render buckets */}
        <div className="fixed bottom-10 left-0 w-full flex flex-row justify-evenly bg-white">
          <AnimatePresence>
            {buckets.map((bucket, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="flex flex-col-reverse gap-1 min-h-8">
                  <AnimatePresence>
                    {bucket.map((num, i) => (
                      <motion.div
                        key={num + '-' + i}
                        layout
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-blue-200 rounded px-2"
                      >
                        {num}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                <div className="border border-t-transparent w-10 text-center">{idx}</div>
              </div>
            ))}
          </AnimatePresence>
        </div>
      </div >
      <div className="">Sorting on digit: {currDigit}</div>
      <div className="">Placing number: {currNumber}</div>
      <button className='mt-3 p-0.5 rounded-md bg-amber-500' onClick={() => incrementStep()}>Next</button>
    </div >
  );
}
