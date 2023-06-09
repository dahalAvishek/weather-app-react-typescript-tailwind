import React, { Dispatch, SetStateAction, useState } from "react";
import { Hourly } from "@/utils/getCurrentData";
import getSelectedData, { getDay } from "@/utils/getCurrentData";
import { useRef, useEffect } from "react";
import "../app/globals.css";
import TempContainer from "./TempContainer";
import clsx from "clsx";
import { MdOutlineArrowBackIos } from "react-icons/md";

interface Props {
  hourly: Hourly;
  selectedTime: string;
  setSelectedTime: Dispatch<SetStateAction<string>>;
}

const DailyTemperatureCard: React.FC<Props> = ({
  hourly,
  selectedTime,
  setSelectedTime,
}: Props) => {
  const [displayVisible, setDisplayVisible] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLDivElement>(null);
  let scrollInterval: NodeJS.Timer | null;

  useEffect(() => {
    scrollRef.current!.scrollTo({ left: 0 });
    const parentPos = scrollRef.current?.getBoundingClientRect();
    const childPos = ref.current?.getBoundingClientRect();
    let scrollVal = 0;
    if (parentPos?.left && childPos?.left) {
      scrollVal = parentPos?.left - childPos?.left;
    }
    console.log(scrollVal);
    scrollRef.current!.scrollTo({ left: -scrollVal - 50 });
  }, [selectedTime]);

  // const handleTemperatureContainerClick = () => {
  //   scrollRef.current!.scrollTo({ left: 0 });
  //   const parentPos = scrollRef.current?.getBoundingClientRect();
  //   const childPos = ref.current?.getBoundingClientRect();
  //   const scrollVal = parentPos?.left - childPos?.left;
  //   console.log(scrollVal);
  //   scrollRef.current!.scrollTo({ left: -scrollVal - 50 });
  // };

  const handleLeftScroll = () => {
    scrollInterval = setInterval(() => {
      scrollRef.current!.scrollLeft += 5;
    }, 10);
  };

  const handleRightScroll = () => {
    scrollInterval = setInterval(() => {
      scrollRef.current!.scrollLeft -= 5;
    }, 10);
  };

  const handleMouseLeave = () => {
    if (scrollInterval) {
      clearInterval(scrollInterval);
      scrollInterval = null;
    }
  };

  const displayScrollButton = () => {
    setDisplayVisible(true);
  };

  const removeScrollButton = () => {
    setDisplayVisible(false);
  };

  const handleTimeChange = (timeString: string) => {
    setSelectedTime(timeString);

    // handleTemperatureContainerClick();
  };

  return (
    <div className="h-fit mt-auto">
      <p className="text-2xl mb-1 ml-9">{getDay(selectedTime)}</p>
      <div
        className="relative w-full"
        onMouseEnter={displayScrollButton}
        onMouseLeave={removeScrollButton}
      >
        <button
          className={clsx("absolute w-10 h-full z-10 scrollButton", {
            hidden: displayVisible === false,
            block: displayVisible === true,
          })}
          onMouseEnter={handleRightScroll}
          onMouseLeave={handleMouseLeave}
        >
          <MdOutlineArrowBackIos className="scale-y-48" />
        </button>
        <div className="flex scrollContainer " ref={scrollRef}>
          {hourly.time.map((datum, index) => (
            <TempContainer
              key={datum}
              selectedData={getSelectedData(hourly, datum)}
              selectedTime={selectedTime}
              datum={datum}
              index={index}
              handleTimeChange={handleTimeChange}
              ref={ref}
            />
          ))}
        </div>
        <button
          className={clsx(
            "absolute top-0 right-0 w-10 h-full scrollButton rotate-180",
            {
              hidden: displayVisible === false,
              block: displayVisible === true,
            }
          )}
          onMouseEnter={handleLeftScroll}
          onMouseLeave={handleMouseLeave}
        >
          <MdOutlineArrowBackIos />
        </button>
      </div>
    </div>
  );
};

export default DailyTemperatureCard;
