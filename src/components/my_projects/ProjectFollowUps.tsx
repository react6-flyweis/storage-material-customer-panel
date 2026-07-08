import { mockFollowUpsData, mockMeetingsData } from "../../data/mockData";
import { cn } from "@/lib/utils";
import GreenCallIcon from "../../assets/icon/GreenCallIcon.svg";
import DarkBlueMailIcon from "../../assets/icon/DarkBlueMailIcon.svg";
// import { Button } from "@/components/ui/button";
// import { Phone } from "lucide-react";
import { useState } from "react";
// const names = [
//   "Bob Smith",
//   "Alice Johnson",
//   "Michael Brown",
//   "Sarah Parker",
//   "David Miller",
// ];

// const descriptions = [
//   "Call regarding project timeline",
//   "Send updated quotation",
//   "Confirm site visit schedule",
//   "Discuss material delivery",
//   "Follow up on payment status",
// ];
// const times = ["Just now", "5 mins ago", "30 mins ago", "2 hours ago", "1 day ago"];

// const icons = [GreenCallIcon, DarkBlueMailIcon];

// const getRandomItem = <T,>(arr: T[]): T =>
//   arr[Math.floor(Math.random() * arr.length)];

// const generateRandomFollowUp = (id: number) => {
//   const person = getRandomItem(names);

//   return {
//     id,
//     name: person,
//     time: getRandomItem(times),
//     description: `${getRandomItem(descriptions)} with ${person}`,
//     icon: getRandomItem(icons),
//   };
// };
const ProjectFollowUps = () => {
const [followUpsData,] = useState(mockFollowUpsData)

//  const handleAddFollowUp = () => {
//     setFollowUpsData((prev) => [
//       ...prev,
//       generateRandomFollowUp(prev.length + 1),
//     ]);
//   };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:gap-8 gap-2 ">
      <div className="space-y-2  md:space-y-0 bg-white rounded-[10px] border border-[#E5E7EB] ">
        <div className="flex items-center justify-between md:p-6 md:pb-1 p-4">
          <div>
            <h3 className="text-lg font-bold text-(--text-color-black)">
              Follow Up
            </h3>
            <p className="text-sm text-(--text-color-gray-2)">
              Recent activities
            </p>
          </div>
          {/* <Button onClick={handleAddFollowUp} className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white xl:px-4 xl:py-2 xl:text-sm text-xs flex items-center gap-2 rounded-md font-normal">
            <Phone />
            Add Follow Up
          </Button> */}
        </div>
        <hr className="my-4 border-[#E5E7EB]" />
        <div className="space-y-4 md:p-6 md:pt-1 p-4 max-h-[calc(100vh-400px)] overflow-y-auto">
          {followUpsData.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-4 p-5 bg-[#F8FAFC] rounded-xl"
            >
              <div className="bg-white p-2.5 rounded-full shadow-sm flex justify-center items-center">
                <img src={item.icon} alt={item.name} className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-normal text-(--text-color-black) truncate">
                    {item.name}
                  </h4>
                  <span className="text-xs text-(--text-color-gray-2) whitespace-nowrap">
                    {item.time}
                  </span>
                </div>
                <p className="text-xs text-(--text-color-gray-2) mt-1 line-clamp-1">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column: Meetings */}
      <div className="space-y-6 md:p-6 p-4 md:space-y-8 bg-white rounded-[10px]">
        <h3 className="text-lg font-bold text-(--text-color-black)">
          Meetings
        </h3>

        <div className="space-y-4 max-h-[calc(100vh-400px)] overflow-y-auto">
          {mockMeetingsData.map((meeting) => (
            <div
              key={meeting.id}
              className="relative rounded-xl overflow-hidden border border-gray-100 h-full"
              style={{ backgroundColor: meeting.bgColor }}
            >
              <div
                className="absolute left-0 top-0 bottom-0 w-1.5"
                style={{ backgroundColor: meeting.accentColor }}
              />
              <div className="p-6 pl-8">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-3">
                    <span className="text-sm font-bold text-(--text-color-gray-2)">
                      {meeting.time}
                    </span>
                    <h4 className="text-sm font-bold text-(--text-color-gray-2)">
                      {meeting.title}
                    </h4>
                    <div className="space-y-1">
                      <p className="text-xs text-(--text-color-gray-2) font-normal">
                        {meeting.company}
                      </p>
                      <p className="text-xs text-(--text-color-gray-2)">
                        {meeting.duration}
                      </p>
                    </div>
                  </div>
                  <button
                    className={cn(
                      "flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-normal transition-colors min-w-[90px]",
                      meeting.buttonColor
                    )}
                  >
                    <img
                      src={
                        meeting.type === "Call"
                          ? GreenCallIcon
                          : DarkBlueMailIcon
                      }
                      alt={meeting.type}
                      className="w-4 h-4"
                    />
                    {meeting.type}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectFollowUps;
