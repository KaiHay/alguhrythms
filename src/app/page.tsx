'use client'
import { use, useEffect, useState } from "react";
import { radixSort, type fullRadMoves, type radLogs } from "./_components/radix";
import {motion} from "motion/react"

export default function Home() {
  const [masterArr, setMaster] = useState([''])
  const [buckets, setBuckets] = useState<string[][]>([[], [], [], [], [], [], [], [], [], []])
  const [currDigit, setDigit] = useState(0)
  const [currNumber, setCurrNumber] = useState('')
  const [stepC, setStep] = useState(0)
  const fullMoveList = radixSort(['3', '1', '100000', '50'])
  useEffect(() => {
    if (!fullMoveList.moves[stepC]) {
      return
    }
    setMaster(fullMoveList.moves[stepC]!.masterArray)
    setBuckets(fullMoveList.moves[stepC]!.buckets)
    setDigit(fullMoveList.moves[stepC]!.currDigit)
    setCurrNumber(fullMoveList.moves[stepC]!.currNumber)
  }, [stepC])

  const incrementStep = () => {
    setStep((c) => {
      const b = c + 1
      console.log('next step', b);
      return b
    })
  }
  return (
    <div className="flex justify-center flex-col text-center">
      <div className="flex flex-row justify-center">
        {masterArr.map((val, idx) => {
          return (
            <div key={idx} className="p-1">
              {masterArr[idx] !== undefined && buckets.some(bucket => bucket.includes(masterArr[idx]!)) ? '_' : masterArr[idx] ?? ''}
            </div>
          )
        })}
      </div>
      <div className="">
        <motion.div style={{originX:1}} className="flex fixed bottom-10 w-full justify-evenly  mt-8">
          {buckets.map((val, idx) => {
            return (
              <div className='' key={idx}>
                <div className="">
                  <div className={`${buckets[idx]!.length === 0 ? 'opacity-0' : ''}`}>
                    {buckets[idx]!.length === 0 ? 'd' : buckets[idx]!.join(' ')}
                  </div>
                  <div className=" border border-t-transparent w-10">{idx}</div>
                </div>
              </div>
            )
          })}
        </motion.div>
      </div>
      <div className="">{currDigit}</div>
      <div className="">{currNumber}</div>
      <button className='border bg-amber-500' onClick={() => incrementStep()}>poopy</button>
    </div>
  );
}
