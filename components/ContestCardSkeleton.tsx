import React from "react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "./ui/card";

const ContestCardSkeleton = () => {
  return (
    <Card className='w-[368px] h-36 dark:bg-black py-4 flex flex-col gap-1 animate-pulse'>
      <CardHeader className='flex flex-col gap-2 h-[65%]'>
        <CardTitle>
          <div className='bg-gray-300 dark:bg-gray-700 h-6 w-32 rounded'></div>
        </CardTitle>
        <CardDescription>
          <div className='bg-gray-300 dark:bg-gray-700 h-4 w-24 rounded'></div>
        </CardDescription>
      </CardHeader>
      <CardContent className='flex w-full justify-between items-center gap-2'>
        <div className='bg-gray-300 dark:bg-gray-700 h-4 w-20 rounded'></div>
        <div className='bg-gray-300 dark:bg-gray-700 h-4 w-16 rounded'></div>
        <div className='bg-gray-300 dark:bg-gray-700 h-4 w-4 rounded-full'></div>
        <div className='bg-gray-300 dark:bg-gray-700 h-8 w-20 rounded'></div>
      </CardContent>
    </Card>
  );
};

export default ContestCardSkeleton;
