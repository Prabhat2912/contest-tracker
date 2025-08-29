"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { contest } from "@/types/types";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const ContestCard = ({
  contests,
  setContests,
}: {
  contests: contest;
  setContests: React.Dispatch<React.SetStateAction<contest[]>>;
}) => {
  const { userId } = useAuth();

  const router = useRouter();
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    if (userId && contests.bookmarkedBy?.includes(userId)) {
      setBookmarked(true);
    } else {
      setBookmarked(false);
    }
  }, [userId, contests]);
  const bookmark = async () => {
    try {
      if (!userId) {
        router.push("/sign-in");
        return;
      }
      setBookmarked((prev) => !prev);
      setContests((prevContests) =>
        prevContests.map((contest) =>
          contest.name === contests.name
            ? {
                ...contest,
                bookmarkedBy: contest.bookmarkedBy?.includes(userId)
                  ? contest.bookmarkedBy.filter((id) => id !== userId) // Remove bookmark
                  : [...(contest.bookmarkedBy || []), userId], // Add bookmark
              }
            : contest
        )
      );
      const res = await axios.post("/api/bookmark", {
        contestName: contests.name,
        userId: userId,
      });

      if (res.status !== 200) {
        setBookmarked((prev) => !prev);
        setContests((prevContests) =>
          prevContests.map((contest) =>
            contest.name === contests.name
              ? {
                  ...contest,
                  bookmarkedBy: contest.bookmarkedBy?.includes(userId)
                    ? [...(contest.bookmarkedBy || []), userId]
                    : contest.bookmarkedBy?.filter((id) => id !== userId),
                }
              : contest
          )
        );
      }
    } catch (error) {
      console.error("Error while bookmarking contest", error);
      setBookmarked((prev) => !prev);
    }
  };

  return (
    <Card className="w-[368px] h-36  dark:bg-black  py-4 flex flex-col gap-1 ">
      <CardHeader className="flex flex-col gap-2  h-[65%]">
        <CardTitle>{contests.name}</CardTitle>
        <CardDescription>
          <Link href={formatUrl(contests.url)} target="_blank">
            {contests.platform}
          </Link>
        </CardDescription>
      </CardHeader>
      <CardContent className=" flex w-full justify-between items-center gap-2">
        <p className="w-[50%] ">{getTimeDifference(contests.startTime)}</p>
        <Link
          href={contests?.solutionLink || "#"}
          target="_blank"
          className=" hover:underline hover:text-blue-500 transition-all duration-200 ease-in-out"
        >
          {contests?.solutionLink
            ? "Solution"
            : "No Solution"}
        </Link>
        <Star
          onClick={() => {
            toast.promise(bookmark(), {
              loading: "Loading...",
              success: bookmarked ? "Removed from bookmarks" : "Bookmarked",
              error: "Error",
            });
          }}
          className={`w-4 h-4 ${
            bookmarked ? "fill-current" : ""
          } cursor-pointer`}
        />
        <Link href={contests.url} target="_blank">
          <Button className="    cursor-pointer flex gap-2 w-[80px] transition-all  ease-in group">
            Start
            <ArrowRight className="group-hover:translate-x-1 transition-transform duration-200 ease-in-out" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

const getTimeDifference = (startTime: string) => {
  const start = new Date(startTime);
  const now = new Date();

  const diffStart = start.getTime() - now.getTime();

  const formatDiff = (diff: number) => {
    const minutes = Math.floor(Math.abs(diff) / (1000 * 60));
    const hours = Math.floor(Math.abs(diff) / (1000 * 60 * 60));
    const days = Math.floor(Math.abs(diff) / (1000 * 60 * 60 * 24));

    if (days > 0)
      return diff > 0 ? `Starts in ${days} days` : `Ended ${days} days ago`;
    if (hours > 0)
      return diff > 0 ? `Starts in ${hours} hours` : `Ended ${hours} hours ago`;
    return diff > 0
      ? `Starts in ${minutes} minutes`
      : `Ended ${minutes} minutes ago`;
  };

  return formatDiff(diffStart);
};

const formatUrl = (url: string) => {
  const urlObj = new URL(url);
  return `${urlObj.origin}`;
};

export default ContestCard;
