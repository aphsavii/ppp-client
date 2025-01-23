import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

const CheatDetector = () => {
  const [cheatingCount, setCheatingCount] = useState(0);
  const [lastActivityTime, setLastActivityTime] = useState(Date.now());
  const { toast } = useToast();
  useEffect(() => {
    const handleCheating = () => {
      setCheatingCount((prevCount) => {
        const newCount = prevCount + 1;
        if (newCount === 3) {
          toast({
            title: "Cheating Alert",
            description:
              "You have been caught cheating! Don't do this again.",
            variant:"destructive"
          });
        }
        return newCount;
      });
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleCheating();
      }
    };

    const handleUserActivity = () => {
      setLastActivityTime(Date.now());
    };

    const checkInactivity = () => {
      const currentTime = Date.now();
      if (currentTime - lastActivityTime > 20000) {
        // 20 seconds of inactivity
        handleCheating();
      }
    };

    // Add event listeners
    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("touchstart", handleUserActivity); // Detect touch interaction
    document.addEventListener("scroll", handleUserActivity); // Detect scrolling
    document.addEventListener("keydown", handleUserActivity); // Just in case

    const inactivityInterval = setInterval(checkInactivity, 5000);

    // Cleanup on component unmount
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("touchstart", handleUserActivity);
      document.removeEventListener("scroll", handleUserActivity);
      document.removeEventListener("keydown", handleUserActivity);
      clearInterval(inactivityInterval);
    };
  }, [lastActivityTime]);

  useEffect(() => {
    if (cheatingCount >= 4) {
      alert("You have been caught cheating! Your quiz won't be accepted.");
    }
  }, [cheatingCount]);

  return <div></div>;
};

export default CheatDetector;
