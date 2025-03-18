"use client";

import ContestCard from "@/components/ContestCard";
import { contest } from "@/types/types";
import axios from "axios";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function Page() {
  const [contests, setContests] = useState<contest[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [loadingSolutions, setLoadingSolutions] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/getContests");
        setContests(res.data.data.slice(0, 50));

        const uniquePlatforms: string[] = Array.from(
          new Set(res.data.data.map((contest: contest) => contest.platform))
        );
        setPlatforms(uniquePlatforms);
        getAllSolutions(res.data.data.slice(0, 20));
        console.log("Fetched contests:", res.data.slice(0, 20));
      } catch (error) {
        console.error("Failed to fetch contests:", error);
      }
    };

    fetchData();
  }, []);
  const getAllSolutions = async (contests: contest[]) => {
    try {
      setLoadingSolutions(true);

      const contestNames = contests
        .filter((c) => !c.solutionLink)
        .map((c) => c.name);

      if (contestNames.length === 0) {
        console.log("All contests already have solutions.");
        return;
      }

      const res = await axios.post("/api/getSolutions", { contestNames });

      if (res.data.updatedContests) {
        setContests((prevContests) =>
          prevContests.map((c) => {
            const updatedContest = res.data.updatedContests.find(
              (uc: contest) => uc.name === c.name
            );
            return updatedContest
              ? { ...c, solutionLink: updatedContest.solutionLink }
              : c;
          })
        );
      }

      console.log("Fetched solutions:", res.data);
    } catch (error) {
      console.error("Failed to fetch solutions:", error);
    } finally {
      setLoadingSolutions(false);
    }
  };

  const getAllContests = async () => {
    const res = await axios.get("/api/contests");

    console.log(res.data);
  };
  setInterval(getAllContests, 1000 * 60 * 60);

  const toggleFilter = (filter: string) => {
    setSelectedFilters((prevFilters) => {
      if (prevFilters.includes(filter)) {
        return prevFilters.filter((f) => f !== filter);
      } else {
        return [...prevFilters, filter];
      }
    });
  };

  type FilterType = "upcoming" | "past" | string;

  const filterContests = (
    contests: contest[],
    selectedFilters: FilterType[],
    platforms: string[]
  ): contest[] => {
    if (!contests.length) return [];
    if (!selectedFilters.length) return contests;

    const now = new Date();

    const timeFilters = new Set(
      selectedFilters.filter((f) => f === "upcoming" || f === "past")
    );
    const platformFilters = new Set(
      selectedFilters.filter((f) => platforms.includes(f))
    );

    const shouldCheckTime = timeFilters.size > 0;
    const shouldCheckPlatform = platformFilters.size > 0;

    return contests.filter((contest) => {
      if (shouldCheckTime) {
        const isUpcoming =
          timeFilters.has("upcoming") && new Date(contest.startTime) > now;

        const isPast =
          timeFilters.has("past") &&
          contest.endTime &&
          new Date(contest.endTime) < now;

        if (!(isUpcoming || isPast)) return false;
      }

      if (shouldCheckPlatform && !platformFilters.has(contest.platform)) {
        return false;
      }

      return true;
    });
  };

  const filteredContests = filterContests(contests, selectedFilters, platforms);

  return (
    <div className='p-4 flex flex-col gap-4 w-full dark:text-white'>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant='outline' className='w-full sm:w-40'>
            Filter Contests
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-full sm:w-64 p-4'>
          <h3 className='font-semibold mb-2'>Filter by:</h3>
          <div className='flex flex-col gap-2'>
            <div className='flex items-center gap-2'>
              <Checkbox
                id='upcoming'
                checked={selectedFilters.includes("upcoming")}
                onCheckedChange={() => toggleFilter("upcoming")}
              />
              <label htmlFor='upcoming'>Upcoming</label>
            </div>
            <div className='flex items-center gap-2'>
              <Checkbox
                id='past'
                checked={selectedFilters.includes("past")}
                onCheckedChange={() => toggleFilter("past")}
              />
              <label htmlFor='past'>Past</label>
            </div>
            <h4 className='font-semibold mt-2'>Platforms:</h4>
            {platforms.map((platform) => (
              <div key={platform} className='flex items-center gap-2'>
                <Checkbox
                  id={platform}
                  checked={selectedFilters.includes(platform)}
                  onCheckedChange={() => toggleFilter(platform)}
                />
                <label htmlFor={platform}>{platform}</label>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      {loadingSolutions && <p>Loading solutions...</p>}
      <div className='grid max-lg:grid-cols-2 max-2xl:grid-cols-3  3xl:grid-cols-5 max-md:grid-cols-1 grid-cols-4 gap-4'>
        {filteredContests.length > 0 ? (
          filteredContests.map((contest, i) => (
            <ContestCard key={i} contests={contest} />
          ))
        ) : (
          <p>No contests found.</p>
        )}
      </div>
    </div>
  );
}
