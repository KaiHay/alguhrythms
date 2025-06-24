'use client'
import { use, useEffect, useState } from "react";
import { radixSort, type fullRadMoves, type radLogs } from "./_components/radix";

export default function Home() {
  const [masterArr, setMaster] = useState([''])
  const [buckets, setBuckets] = useState<string[][]>([[], [], [], [], [], [], [], [], [], []])
  const [currDigit, setDigit] = useState(0)
  const [currNumber, setCurrNumber] = useState('')
  const [stepC, setStep] = useState(0)
  useEffect(() => {
    const fullMoveList = radixSort(['3', '1', '10', '50'])
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
      <div className="">{masterArr}</div>
      <div className="">{buckets}</div>
      <div className="">{currDigit}</div>
      <div className="">{currNumber}</div>
      <button className='border bg-amber-500' onClick={() => incrementStep()}>poopy</button>
    </div>
  );
}
