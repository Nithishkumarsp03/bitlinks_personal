import React, { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Round from "../../Assets/icons.svg";
import Networks from "../../Assets/Networks.svg";
import Add from "../../Assets/add.svg";
import info from "../../Assets/Information.svg";
import Rank4 from "../../Assets/Rank-1.svg";
import Rank3 from "../../Assets/Rank-2.svg";
import Rank2 from "../../Assets/Rank-3.svg";
import Rank1 from "../../Assets/Rank-4.svg";
import Filter from "../../Assets/sort by.png";
import Search from "../../Assets/search.png";
import Back from "../../Assets/back.png";
import AddContact from "../../Assets/add-contact.png";
import PieAnimation from "../../COMPONENTS/Piechart";
import { Dialog } from "@mui/material";
import Textarea from "@mui/joy/Textarea";
import Input from "@mui/joy/Input";
import MainFlow from "../Flows/MainFlow/Flows";
import RankFlow from "../RankFlow/RankFlow/RankFlow";
import ExpertiseChart from "../Flowcontacts/ExpertiseChart";
import ShowAddAccount from "../AddConnections/Addaccount";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import { usePerson } from "../../COMPONENTS/Context";
import Cookies from "js-cookie";
import "../Home/Home.css";
import { Container, Typography } from "@mui/material";
import ChangingProgressProvider from "../Flows/MainFlow/ChangingProgressProvider";
import { Button } from "@mui/joy";
import "react-datepicker/dist/react-datepicker.css";
import BeatLoader from "../../COMPONENTS/BeatLoader";
import Details from "../Details/Details";
import Table from "../Table/Table";

export default function Default(subPersonId) {
  const FilterIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={24}
      height={24}
      color={"#00000"}
      fill={"none"}
      {...props}>
      <path
        d="M8.85746 12.5061C6.36901 10.6456 4.59564 8.59915 3.62734 7.44867C3.3276 7.09253 3.22938 6.8319 3.17033 6.3728C2.96811 4.8008 2.86701 4.0148 3.32795 3.5074C3.7889 3 4.60404 3 6.23433 3H17.7657C19.396 3 20.2111 3 20.672 3.5074C21.133 4.0148 21.0319 4.8008 20.8297 6.37281C20.7706 6.83191 20.6724 7.09254 20.3726 7.44867C19.403 8.60062 17.6261 10.6507 15.1326 12.5135C14.907 12.6821 14.7583 12.9567 14.7307 13.2614C14.4837 15.992 14.2559 17.4876 14.1141 18.2442C13.8853 19.4657 12.1532 20.2006 11.226 20.8563C10.6741 21.2466 10.0043 20.782 9.93278 20.1778C9.79643 19.0261 9.53961 16.6864 9.25927 13.2614C9.23409 12.9539 9.08486 12.6761 8.85746 12.5061Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const api = process.env.REACT_APP_API;
  const userProfile = Cookies.get("userProfile");
  const parsedProfile = userProfile ? JSON.parse(userProfile) : null;
  const email = Cookies.get("email");
  const username = Cookies.get("NAME");
  const picture = parsedProfile?.picture;
  // const id = parsedProfile?.id;
  const { setSelectedPersonId } = usePerson();
  // const { selectedPersonId, setSelectedPersonId } = usePerson();
  const [userNetworks, setuserNetworks] = useState([]);
  const [Connections, setConnections] = useState(true);
  const [networks, setNetworks] = useState(false);
  const [sidebarOpen1, setSidebarOpen1] = useState(true);
  const [sidebarOpen2, setSidebarOpen2] = useState(false);
  const [graph, setGraph] = useState(false);
  const [filter, setFilter] = useState(false);
  const [add, setAdd] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [view, setView] = useState(false);
  const [viewconnection, setViewConnection] = useState(false);
  const [Myconnectionshr, setMyconnectionshr] = useState(true);
  const [Networkshr, setNetworkshr] = useState(false);
  const [ExpertiseConnection, setExpertiseConnection] = useState(false);
  const [personalInfos, setPersonalInfos] = useState([]);
  const [error, setError] = useState(null);
  const [AddConnections, setAddConnections] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [cardActive, setCardActive] = useState(false);
  const [connectionActive, setConnectionActive] = useState(false);
  const [SubConnections, setsubconnections] = useState(0);
  const [TotalProgressValue, setTotalProgressValue] = useState(0);
  const [userranks, setUserranks] = useState([]);
  const [networkranks, setNetworkranks] = useState([]);
  const [searchtermconnections, setSearchtermconnections] = useState("");
  const [searchtermnetworks, setSearchtermnetworks] = useState("");
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [TableOpen, setTableOpen] = useState(false);
  const [showmore, setShowmore] = useState(false);
  const [FilterMyNetworks, setFilterMyNetworks] = useState(false);
  const [FilterScheduledNetworks, setFilterScheduledNetworks] = useState(null);
  const [reschedulemyData, setReschedulemyData] = useState([]);
  const [lengthscheduled, setLengthScheduled] = useState(0);
  const [lengthconnection, setLengthconnection] = useState(0);
  const [MyNetworkPopup, setMyNetworkPopup] = useState(false);
  const [ScheduledNetworkPopup, setScheduledNetworkPopup] = useState(false);
  const [openactivepopup, setActivePopup] = useState(false);
  const [person, setPerson] = useState(0);
  const [status, setStatus] = useState(0);
  const [reason, setReason] = useState("");
  const [connectionloading, setConnectionloading] = useState(true);
  const [scheduleloading, setScheduleloading] = useState(true);
  const [rankloading, setRankloading] = useState(true);

  const handleConnections = () => {
    setSidebarOpen1(true);
    setSidebarOpen2(false);
    setConnections(true); // Connections section active
    setNetworks(false); // Networks section inactive
    setFilter(false); // No filters
    setView(false); // Reset the card view
    setMyconnectionshr(true); // Show my connections
    setNetworkshr(false); // Hide networks
    setViewConnection(false); // Reset view connection
    setExpertiseConnection(false); // Reset expertise connection view
    setAddConnections(false); // No add connections
    setTableOpen(false);
    setSelectedCardId(null); // Deselect any selected card
    setCardActive(false); // Reset card activity
    setConnectionActive(false); // Reset connection activity
    setShowmore(false); //show more activity
    setSelectedLevel(null);
    setFilterMyNetworks(null);
    setFilterScheduledNetworks(null);
    // console.log("All views and selections reset to default");
  };

  const handleNetworks = () => {
    setSidebarOpen1(false);
    setSidebarOpen2(true);
    setConnections(false);
    setNetworks(true);
    setFilter(false);
    setView(false);
    setMyconnectionshr(false);
    setNetworkshr(true);
    setViewConnection(false);
    setExpertiseConnection(false);
    setAddConnections(false);
    setTableOpen(false);
    setSelectedCardId(null);
    setCardActive(false);
    setConnectionActive(false);
    setShowmore(false);
    setSelectedLevel(null);
    setFilterMyNetworks(null);
    setFilterScheduledNetworks(null);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setErrorMessage("");
    setIsButtonDisabled(true);
  };

  const handlecancelflows = () => {
    setView(false);
    setViewConnection(false);
    setExpertiseConnection(false);
    setAddConnections(false);
    setTableOpen(false);
    setSelectedCardId(null);
    setCardActive(false);
    setConnectionActive(false);
    setShowmore(false);
    setSelectedLevel(null);
    setFilterMyNetworks(null);
    setFilterScheduledNetworks(null);
  };

  const handlecancelviewconnections = () => {
    setView(false);
    setViewConnection(false);
    setExpertiseConnection(false);
    setAddConnections(false);
    setTableOpen(false);
    setSelectedCardId(null);
    setCardActive(false);
    setConnectionActive(false);
    setShowmore(false);
    setSelectedLevel(null);
    setFilterMyNetworks(null);
    setFilterScheduledNetworks(null);
  };

  const handlecanceltable = () => {
    setTableOpen(false);
    setView(false);
    setViewConnection(false);
    setExpertiseConnection(false);
    setAddConnections(false);
    setTableOpen(false);
    setSelectedCardId(null);
    setCardActive(false);
    setConnectionActive(false);
    setShowmore(false);
    setSelectedLevel(null);
    setFilterMyNetworks(null);
    setFilterScheduledNetworks(null);
  };

  const handletable = () => {
    setTableOpen(true);
    setAddConnections(false);
    setConnections(false);
    setNetworks(false);
    setFilter(false);
    setMyconnectionshr(false);
    setNetworkshr(false);
    setView(false);
    setViewConnection(false);
    setView(false);
    setShowmore(false);
    setSelectedLevel(null);
    setFilterMyNetworks(null);
    setFilterScheduledNetworks(null);
  };

  const handleCheck = async () => {
    setLoading(true);
    try {
      const response = await fetch(api + "/check-connection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: inputValue }),
      });

      const data = await response.json();

      if (data.message === "found") {
        setLoading(false);
        setErrorMessage("Connection already exists");
        setIsButtonDisabled(true);
      } else if (inputValue === "") {
        setLoading(false);
        setErrorMessage("Name cannot be empty");
        setIsButtonDisabled(true);
      } else if (data.message === "notfound") {
        setLoading(false);
        setErrorMessage(`${inputValue} is Available`);
        setIsButtonDisabled(false);
      } else {
        // setLoading(false);
        setIsButtonDisabled(false);
      }
    } catch (error) {
      if (inputValue === "") {
        setErrorMessage("Name cannot be empty");
        setIsButtonDisabled(true);
      } else {
        console.error("Error checking connection:", error);
        setLoading(false);
        setErrorMessage(`${inputValue} is Available`);
        setIsButtonDisabled(false);
      }
    }
  };

  useEffect(() => {
    setConnectionloading(true);
    const fetchuserNetworks = async () => {
      try {
        const response = await fetch(api + "/userNetworks");
        const data = await response.json();
        setuserNetworks(data);
        
    setConnectionloading(false);
      } catch (error) {
        
    setConnectionloading(false);
        console.error("Error fetching user connections:", error);
      }
    };

    const intervalId = setInterval(fetchuserNetworks, 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchPersonalInfo = async () => {
      try {
        const response = await fetch(api + "/userConnections", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, picture }), // Send email as JSON
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setPersonalInfos(data); // Expect an array of results
        setConnectionloading(false);
      } catch (error) {
        setError(error.message);
        
    setConnectionloading(false);
      }
    };

    if (email) {
      const intervalId = setInterval(fetchPersonalInfo, 1000);
      return () => clearInterval(intervalId);
    }
  }, [email]);

  const handleDiscard = () => {
    setInputValue(""); // Clear the input
    setAdd(false);
  };

  const location = useLocation();

  const getPathColor = (TotalProgressValue) => {
    // console.log("Current value:", TotalProgressValue);

    if (TotalProgressValue >= 100) {
      return "#6D2ED1";
    } else if (TotalProgressValue >= 75 && TotalProgressValue < 100) {
      return "#0E7C3A";
    } else if (TotalProgressValue >= 50 && TotalProgressValue < 75) {
      return "#ED8F03";
    } else if (TotalProgressValue >= 20 && TotalProgressValue < 50) {
      return "#8E9498";
    } else return "#AD1111";
  };

  const navigate = useNavigate();

  const handleContinue = () => {
    const SubConnectionsvalue = SubConnections; // Set your desired value
    navigate("../dashboard", {
      state: { subConnections: SubConnectionsvalue },
    });
    console.log("DEFAULT = ", SubConnectionsvalue);
    setAddConnections(true);
    setTableOpen(false);
    setConnections(false);
    setNetworks(false);
    setFilter(false);
    setMyconnectionshr(false);
    setNetworkshr(false);
    setView(false);
    setViewConnection(false);
    setView(false);
    setShowmore(false);

    if (!isButtonDisabled) {
      console.log("Connection added:", inputValue);
      setAdd(false);
    }
  };

  const handleGraph = () => {
    setGraph(!graph);
  };

  const handleFilter = () => {
    setFilter(!filter);
  };

  const handlemarkactive = (person_id, status) => {
    if (status === 1) {
      setStatus(2);
      setPerson(person_id);
      setActivePopup(true);
      return;
    }
    if (status === 0) {
      setStatus(3);
      setPerson(person_id);
      setActivePopup(true);
      return;
    }
    // 2 for Active to non-active
    // 3 for non-active to active
  };

  const handleStatuschange = () => {
    // console.log(person, status);
    if (reason === "") {
      alert("Reason is Mandatory!");
      return;
    }
    try {
      const response = fetch(api + "/personstatus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ person, reason, status }),
      });
      if (response.ok) {
        console.log("Status changed successfully");
        setReason("");
        setPerson(0);
        setStatus(0);
      }
    } catch (error) {
      console.log(error);
    }
    const intervalId = setInterval(handleStatuschange, 1000);
    return () => clearInterval(intervalId);
  };

  const handleCard = (personId) => {
    // updateStatus(historyId);
    if (connectionActive) {
      // console.log("Cannot access Card, View Connection is active");
      return;
    }

    // If clicked on the same card again, reset to normal and allow connection view
    if (selectedCardId === personId && cardActive) {
      setSelectedCardId(null);
      setCardActive(false);
      setConnectionActive(false); // Unlock connection view
      setView(false); // Reset card view
      // console.log("Card view reset to normal");
      return;
    }

    setSelectedPersonId(personId);
    setView(!view); // Card view is now active
    setViewConnection(false); // Ensure connection view is inactive
    setSelectedCardId(personId); // Set the clicked card's ID
    setCardActive(true); // Card view is now active
    setConnectionActive(false); // Lock connection view
    // console.log("VIEW CARD CLICKED");
  };

  const handlemyschedule = (item) => {
    // console.log("PERSON ID = ", item.person_id);
    const personId = item.person_id;
    if (selectedCardId === personId && cardActive) {
      setSelectedCardId(null);
      setCardActive(false);
      setConnectionActive(false); // Unlock connection view
      setView(false); // Reset card view
      // console.log("Card view reset to normal");
      return;
    }

    setSelectedPersonId(personId);
    setView(!view); // Card view is now active
    setViewConnection(false); // Ensure connection view is inactive
    setSelectedCardId(personId); // Set the clicked card's ID
    setCardActive(true); // Card view is now active
    setConnectionActive(false); // Lock connection view
  };

  const handleViewConnection = (personId) => {
    setSelectedPersonId(personId);
    if (cardActive) {
      // console.log("Cannot access View Connection, Card view is active");
      return;
    }

    // If clicked on the same connection again, reset to normal and allow card view
    if (selectedCardId === personId && connectionActive) {
      setSelectedCardId(null);
      setConnectionActive(false);
      setCardActive(false);
      setViewConnection(false);
      // console.log("Connection view reset to normal");
      return;
    }

    setViewConnection(true); // Connection view is now active
    setView(false); // Ensure card view is inactive
    setSelectedCardId(personId); // Set the clicked connection's ID
    setConnectionActive(true); // Connection view is now active
    setCardActive(false); // Lock card view
    // console.log("VIEW CONNECTION CLICKED");
  };

  const handleExpertiseConnection = () => {
    setExpertiseConnection(!ExpertiseConnection);
    setView(view);
    setViewConnection(viewconnection);
    setSidebarOpen1(false);
    setSidebarOpen2(false);
  };

  const handleaddConnections = () => {
    setErrorMessage("");
    setInputValue("");
    setsubconnections(1);
    setAdd(true);
  };
  const handleAddContact = (e) => {
    setErrorMessage("");
    setInputValue("");
    setsubconnections(2);
    setAdd(true);
    e.stopPropagation();
  };

  const handleRankSelection = (level) => {
    setSelectedLevel(level);
    setFilter(false); // Close the popup
  };

  const filteredNetworks = userNetworks.filter((connection) => {
    // Split the search term by commas and trim spaces
    const searchTerms = searchtermnetworks
      .toLowerCase()
      .split(',')
      .map((term) => term.trim());
  
    // Function to check if a connection matches any of the search terms
    const isMatch = (term) => {
      // Check if the fullname contains the search term
      const nameMatch = connection.fullname.toLowerCase().includes(term);
      const roleMatch = connection.role
        ? connection.role.toLowerCase().includes(term)
        : false;
      const companyMatch = connection.companyname
        ? connection.companyname.toLowerCase().includes(term)
        : false;
      const domainMatch = connection.domain
        ? connection.domain.toLowerCase().includes(term)
        : false;
      const locationMatch = connection.companyaddress
        ? connection.companyaddress.toLowerCase().includes(term)
        : false;
  
      // Check if any hashtag contains the search term
      const hashtagsArray = connection.hashtags
        ? connection.hashtags.split(" ").map((tag) => tag.trim().toLowerCase())
        : [];
  
      const hashtagMatch = hashtagsArray.some((tag) => tag.includes(term));
  
      return (
        nameMatch ||
        hashtagMatch ||
        roleMatch ||
        companyMatch ||
        domainMatch ||
        locationMatch
      );
    };
  
    // Check if the connection matches all search terms
    const searchMatch = searchTerms.every((term) => isMatch(term));
  
    // Adjust the filtering logic based on the selected level and connection.rank
    const levelMatch =
      selectedLevel !== null ? connection.rank === selectedLevel : true;
  
    return searchMatch && levelMatch;
  });  
  

  const filteredConnections = personalInfos.filter((connection) => {
    const searchLower = searchtermconnections.toLowerCase().trim();

    // Check if the fullname contains the search term
    const nameMatch = connection.fullname
      ? connection.fullname.toLowerCase().includes(searchLower)
      : false;
    const roleMatch = connection.role
      ? connection.role.toLowerCase().includes(searchLower)
      : false;
    const companyMatch = connection.companyname
      ? connection.companyname.toLowerCase().includes(searchLower)
      : false;
    const domainMatch = connection.domain
      ? connection.domain.toLowerCase().includes(searchLower)
      : false;

    // Check if the role contains the search term
    // const roleMatch = connection.role ? connection.role.toLowerCase().includes(searchLower) : false;

    // Check if any hashtag contains the search term
    const hashtagsArray = connection.hashtags
      ? connection.hashtags.split(" ").map((tag) => tag.trim().toLowerCase())
      : [];

    const hashtagMatch = hashtagsArray.some((tag) => tag.includes(searchLower));

    // Combine search and level filtering
    const searchMatch = nameMatch || hashtagMatch || roleMatch || companyMatch || domainMatch;

    // Adjust the filtering logic based on the selected level and connection.rank
    const levelMatch =
      selectedLevel !== null ? connection.rank === selectedLevel : true;

    return searchMatch && levelMatch;
  });

  const [rescheduleData, setRescheduleData] = useState([]);
  const [showRescheduleNotification, setShowRescheduleNotification] = useState(false);
  useEffect(() => {
    const fetchRescheduleData = async () => {
      try {
        const response = await fetch(api + "/fetch-scheduled");

        const data = await response.json();
        console.log("Fetched Reschedule Data:", data);
        setLengthScheduled(data.length);

        // Get the current time
        const currentTime = new Date();

        // Filter reschedules that are within 12 hours of the current time
        const upcomingReschedules = data.filter((item) => {
          const rescheduleTime = new Date(item.scheduleddate); // Assuming your reschedule time is stored in the field `rescheduleTime`
          const timeDifference = rescheduleTime - currentTime;

          // 12 hours in milliseconds: 12 * 60 * 60 * 1000
          return timeDifference <= 12 * 60 * 60 * 1000;
          // return timeDifference > 0 && timeDifference <= 12 * 60 * 60 * 1000;
        });

        // Update state with the filtered data
        setRescheduleData(upcomingReschedules);

        // Show notification if there are upcoming reschedules
        setShowRescheduleNotification(upcomingReschedules.length > 0);
        setScheduleloading(false);
      } catch (error) {
        setScheduleloading(false);
        console.error("Error fetching reschedule data:", error);
      }
    };
    fetchRescheduleData();
  }, []);

  const colorPriority = {
    "#FEECEC": 1, // Red
    "#FBE9D0": 2, // Yellow
    "#EDF3F7": 3, // Blue
  };

  const getCardColor = (rescheduleTime) => {
    const currentTime = new Date();
    const timeDifference = rescheduleTime - currentTime;

    // Check if the reschedule time has passed
    if (timeDifference < 0) {
      return "#FEECEC"; // red
    } else if (timeDifference <= 2 * 60 * 60 * 1000) {
      // If within 2 hours
      return "#FBE9D0"; // yellow
    } else {
      return "#EDF3F7"; // blue
    }
  };

  // const handleRankSelection = (rank) => {
  //   setFilterScheduledNetworks(rank);
  // };

  // const handleShowMore = () => {
  //   setShowmore(!showmore);
  // };

  const filteredAndSortedItems = rescheduleData
    .filter((item) => {
      const cardColor = getCardColor(new Date(item.scheduleddate));
      if (FilterScheduledNetworks === "A") return cardColor === "#FEECEC"; // Show only red
      if (FilterScheduledNetworks === "B") return cardColor === "#FBE9D0"; // Show only yellow
      if (FilterScheduledNetworks === "C") return cardColor === "#EDF3F7"; // Show only blue
      return true; // Show all if no filter is selected
    })
    .sort((a, b) => {
      const colorA = getCardColor(new Date(a.scheduleddate));
      const colorB = getCardColor(new Date(b.scheduleddate));
      return colorPriority[colorA] - colorPriority[colorB];
    });

  const filteredAndSortedMyItems = reschedulemyData
    .filter((item) => {
      const cardColor = getCardColor(new Date(item.scheduleddate));
      if (FilterMyNetworks === "A") return cardColor === "#FEECEC"; // Show only red
      if (FilterMyNetworks === "B") return cardColor === "#FBE9D0"; // Show only yellow
      if (FilterMyNetworks === "C") return cardColor === "#EDF3F7"; // Show only blue
      return true; // Show all if no filter is selected
    })
    .sort((a, b) => {
      const colorA = getCardColor(new Date(a.scheduleddate));
      const colorB = getCardColor(new Date(b.scheduleddate));
      return colorPriority[colorA] - colorPriority[colorB];
    });

  const itemsToShow = showmore
    ? filteredAndSortedItems
    : filteredAndSortedItems.slice(0, 3);

  const myitemsToShow = showmore
    ? filteredAndSortedMyItems
    : filteredAndSortedMyItems.slice(0, 3);

  const handleOpenMyNetwork = () => {
    setMyNetworkPopup(true);
  };
  const handleOpenScheduledNetwork = () => {
    setScheduledNetworkPopup(true);
  };
  const handleFilterMyNetworks = () => {
    setFilterMyNetworks(filter);
  };
  const handleFilterScheduledNetworks = () => {
    setFilterScheduledNetworks(filter);
  };

  const handleRankSelection2 = (filter) => {
    setFilterScheduledNetworks(filter);
    setScheduledNetworkPopup(false); // Close the dialog after selecting
  };

  const handleRankSelection1 = (filter) => {
    setFilterMyNetworks(filter);
    setMyNetworkPopup(false); // Close the dialog after selecting
  };

  useEffect(() => {
    const fetchRescheduleData = async () => {
      if (!email) {
        console.error("Email is not defined.");
        return;
      }
      setScheduleloading(true);
      try {
        const response = await fetch(api + "/schedule", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();
        console.log(data);
        setLengthconnection(data.length);

        const currentTime = new Date();

        const upcomingReschedules = data.filter((item) => {
          const rescheduleTime = new Date(item.scheduleddate);
          const timeDifference = rescheduleTime - currentTime;

          // 12 hours in milliseconds: 12 * 60 * 60 * 1000
          return timeDifference <= 12 * 60 * 60 * 1000;
          // return timeDifference > 0 && timeDifference <= 12 * 60 * 60 * 1000;
        });

        setReschedulemyData(upcomingReschedules);
        setScheduleloading(false);
      } catch (error) {
        console.error("Error fetching reschedule data:", error);
        setScheduleloading(false);
      }
    };
    fetchRescheduleData();
  }, [email]);

  const handleshowmore = () => {
    setShowmore(!showmore);
  };

  useEffect(() => {
    const fetchuserRankData = async () => {
      if (!email) {
        console.error("Email is not defined.");
        return;
      }
      try {
        const response = await fetch(api + "/userranks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();
        // console.log(data);
        setUserranks(data);
      } catch (error) {
        console.error("Error fetching reschedule data:", error);
      }
    };

    setRankloading(false);
    const intervalId = setInterval(fetchuserRankData, 1000);
    return () => clearInterval(intervalId);
  }, [email]);

  useEffect(() => {
    setRankloading(true);
    const fetchnetworkRankData = async () => {
      try {
        const response = await fetch(api + "/networkranks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        // console.log(data);
        setNetworkranks(data);
      } catch (error) {
        console.error("Error fetching reschedule data:", error);
      }
    };

    setRankloading(false);
    const intervalId = setInterval(fetchnetworkRankData, 1000);
    return () => clearInterval(intervalId);
  }, [email]);

  return (
    <div className="contents-body">
      <div className="left-handside">
        <div className="navigation">
          <div
            className={`buttons-myconnection ${sidebarOpen1 ? "open" : ""}`}
            onClick={handleConnections}>
            <h4 style={{ width: "100%" }}>
              <div style={{ display: "flex", width: "100%" }}>
                <img src={Round} alt="" className="nav-icons" />
                <p
                  style={{
                    fontSize: "110%",
                    fontWeight: "600",
                    marginLeft: "5%",
                  }}>
                  My Connections
                </p>
                <p style={{ marginLeft: "31%" }}>{personalInfos.length}</p>
              </div>
            </h4>
          </div>

          <div
            className={`buttons-networks ${sidebarOpen2 ? "open" : ""}`}
            onClick={handleNetworks}>
            <h4 style={{ display: "flex", width: "100%" }}>
              <img src={Networks} alt="" className="nav-icons" />
              <p
                style={{
                  fontSize: "110%",
                  fontWeight: "600",
                  marginLeft: "6%",
                }}>
                Networks
              </p>
              <p style={{ marginLeft: "47%" }}>{userNetworks.length}</p>
            </h4>
          </div>

          <div className="add-new" onClick={handleaddConnections}>
            <img src={Add} alt="" />
            <p style={{ fontSize: "16px", fontWeight: "600" }}>
              Add Connections
            </p>
          </div>
        </div>

        {graph ? (
          <div>
            <br />
            <PieAnimation />
          </div>
        ) : (
          <div className="ranks">
            {Connections ? (
              <>
                <div className="rank1">
                  <div>
                    <img src={Rank1} alt="" />
                    <p style={{ color: "#6D2ED1" }}>Level 3</p>
                  </div>
                  <p style={{ fontSize: "17px", fontWeight: "500" }}>
                    {rankloading ? (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "100%",
                          marginTop: "10px",
                        }}>
                        <BeatLoader
                          loading={rankloading}
                          color="#2867B2"
                          size={10}
                        />
                      </div>
                    ) : (
                      <div>{userranks.count_rank_3} Networks</div>
                    )}
                  </p>
                </div>
                <div className="rank2">
                  <div>
                    <img src={Rank2} alt="" />
                    <p style={{ color: "#0E7C3A" }}>Level 2</p>
                  </div>
                  <p style={{ fontSize: "17px", fontWeight: "500" }}>
                    {rankloading ? (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "100%",
                          marginTop: "10px",
                        }}>
                        <BeatLoader
                          loading={rankloading}
                          color="#2867B2"
                          size={10}
                        />
                      </div>
                    ) : (
                      <div>{userranks.count_rank_2} Networks</div>
                    )}
                  </p>
                </div>
                <div className="rank3">
                  <div>
                    <img src={Rank3} alt="" />
                    <p style={{ color: "#ED8F03" }}>Level 1</p>
                  </div>
                  <p style={{ fontSize: "17px", fontWeight: "500" }}>
                    {rankloading ? (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "100%",
                          marginTop: "10px",
                        }}>
                        <BeatLoader
                          loading={rankloading}
                          color="#2867B2"
                          size={10}
                        />
                      </div>
                    ) : (
                      <div>{userranks.count_rank_1} Networks</div>
                    )}
                  </p>
                </div>
                <div className="rank4">
                  <div>
                    <img src={Rank4} alt="" />
                    <p style={{ color: "#64696C" }}>Level 0</p>
                  </div>
                  <p style={{ fontSize: "17px", fontWeight: "500" }}>
                    {rankloading ? (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "100%",
                          marginTop: "10px",
                        }}>
                        <BeatLoader
                          loading={rankloading}
                          color="#2867B2"
                          size={10}
                        />
                      </div>
                    ) : (
                      <div>{userranks.count_rank_0} Networks</div>
                    )}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="rank1">
                  <div>
                    <img src={Rank1} alt="" />
                    <p style={{ color: "#6D2ED1" }}>Level 3</p>
                  </div>
                  <p style={{ fontSize: "17px", fontWeight: "500" }}>
                    {rankloading ? (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "100%",
                          marginTop: "10px",
                        }}>
                        <BeatLoader
                          loading={rankloading}
                          color="#2867B2"
                          size={10}
                        />
                      </div>
                    ) : (
                      <div>{networkranks.count_rank_3} Networks</div>
                    )}
                  </p>
                </div>
                <div className="rank2">
                  <div>
                    <img src={Rank2} alt="" />
                    <p style={{ color: "#0E7C3A" }}>Level 2</p>
                  </div>
                  <p style={{ fontSize: "17px", fontWeight: "500" }}>
                    {rankloading ? (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "100%",
                          marginTop: "10px",
                        }}>
                        <BeatLoader
                          loading={rankloading}
                          color="#2867B2"
                          size={10}
                        />
                      </div>
                    ) : (
                      <div>{networkranks.count_rank_2} Networks</div>
                    )}
                  </p>
                </div>
                <div className="rank3">
                  <div>
                    <img src={Rank3} alt="" />
                    <p style={{ color: "#ED8F03" }}>Level 1</p>
                  </div>
                  <p style={{ fontSize: "17px", fontWeight: "500" }}>
                    {rankloading ? (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "100%",
                          marginTop: "10px",
                        }}>
                        <BeatLoader
                          loading={rankloading}
                          color="#2867B2"
                          size={10}
                        />
                      </div>
                    ) : (
                      <div>{networkranks.count_rank_1} Networks</div>
                    )}
                  </p>
                </div>
                <div className="rank4">
                  <div>
                    <img src={Rank4} alt="" />
                    <p style={{ color: "#64696C" }}>Level 0</p>
                  </div>
                  <p style={{ fontSize: "17px", fontWeight: "500" }}>
                    {rankloading ? (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "100%",
                          marginTop: "10px",
                        }}>
                        <BeatLoader
                          loading={rankloading}
                          color="#2867B2"
                          size={10}
                        />
                      </div>
                    ) : (
                      <div>{networkranks.count_rank_0} Networks</div>
                    )}
                  </p>
                </div>
              </>
            )}
          </div>
        )}
        <div className="tables-page" onClick={handletable}>
          Dashboard
        </div>

        {/* <div className="graph" onClick={handleGraph}>
          <div className="graph-contents">
            {graph ? (
              <pre>
                <p
                  style={{
                    fontSize: "19px",
                    fontWeight: "600",
                    paddingRight: "8vw",
                  }}>
                  Ranking Details{" "}
                </p>
              </pre>
            ) : (
              <p style={{ width: "100%" }}>Network Analysis</p>
            )}
            <img src={info} alt="" />
          </div>
        </div> */}
        {/* <i
          class="fa-solid fa-arrow-left"
          style={{
            fontSize: "30px",
            marginTop: "20%",
            marginLeft: "5%",
            cursor: "pointer",
          }}
          onClick={handleback}></i> */}
      </div>

      <div
        className={`middle ${
          view || viewconnection || ExpertiseConnection
            ? "show"
            : AddConnections || TableOpen
            ? "addconnection"
            : ""
        }`}>
        {/* {!tableopen ? (<Table></Table>) : ""} */}
        {AddConnections || TableOpen ? (
          AddConnections ? (
            <ShowAddAccount />
          ) : TableOpen ? (
            <Table handlecanceltable={handlecanceltable} />
          ) : (
            ""
          )
        ) : (
          <div>
            {Connections ? (
              <div
                style={{
                  width: "100%",
                  overflow: "hidden",
                  marginLeft: "-10px",
                }}>
                <div className="search">
                  <p style={{ fontSize: "16px", fontWeight: "600" }}>
                    Connections
                  </p>
                  <hr
                    className={`hr-bar ${view || viewconnection ? "show" : ""}`}
                  />
                  <div style={{ display: "flex" }}>
                    <input
                      type="text"
                      onChange={(e) => setSearchtermconnections(e.target.value)}
                      placeholder="Search Connections"
                      className={`search-bar ${
                        view || viewconnection ? "show" : ""
                      }`}
                    />
                    <FilterIcon
                    className={`filtericon-connections ${view || viewconnection ? "show" : ""}`}
                      style={{
                        marginTop: "0px",
                        marginLeft: "0%",
                        cursor: "pointer",
                      }}
                      onClick={handleFilter}
                    />
                  </div>
                </div>
                <div className="myconnections-card">
                  {connectionloading ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                      }}>
                      <BeatLoader
                        loading={connectionloading}
                        color="#2867B2"
                        size={15}
                      />
                    </div>
                  ) : (
                    <div>
                      {filteredConnections.length > 0 ? (
                        filteredConnections.map((connection) =>
                          selectedCardId === null ||
                          selectedCardId === connection.person_id ? (
                            <div key={connection.person_id}>
                              <div
                                className={`card ${
                                  view || viewconnection ? "show" : ""
                                }`}
                                onClick={() =>
                                  handleCard(connection.person_id)
                                }>
                                <div
                                  className={`${
                                    view || viewconnection
                                      ? "add-contact"
                                      : "add-contact-none"
                                  }`}
                                  onClick={handleAddContact}>
                                  <i
                                    class="fa-solid fa-plus"
                                    style={{
                                      color: "white",
                                      fontSize: "12px",
                                    }}></i>
                                </div>
                                <div style={{ display: "flex" }}>
                                  <div className="profile-container">
                                    <ChangingProgressProvider
                                      value={connection.overall_completion}>
                                      {(value) => (
                                        <div style={{ width: "80px" }}>
                                          <CircularProgressbarWithChildren
                                            className="custom-progressbar"
                                            value={
                                              connection.overall_completion
                                            }
                                            circleRatio={0.75}
                                            styles={buildStyles({
                                              pathTransitionDuration: 10.5,
                                              pathTransition: "#122E50",
                                              strokeWidth: 23,
                                              rotation: 1 / 2 + 1 / 8,
                                              // strokeLinecap: "butt",
                                              width: "50vw",
                                              trailColor: "#D7DADB",
                                              pathColor:
                                                // getPathColor(connection.overall_completion),
                                                value > 0
                                                  ? "#2867B2"
                                                  : "transparent",
                                            })}>
                                            <div className="profile-2">
                                              <img
                                                src={`${api}${connection.profile}`}
                                                alt="Profile"
                                              />
                                              <img
                                                src={
                                                  connection.rank === 3
                                                    ? Rank1
                                                    : connection.rank === 2
                                                    ? Rank2
                                                    : connection.rank === 1
                                                    ? Rank3
                                                    : Rank4
                                                }
                                                alt="rank-img"
                                                style={{
                                                  width: "25px",
                                                  height: "25px",
                                                }}
                                                className="rank-images-connections"
                                              />
                                            </div>
                                          </CircularProgressbarWithChildren>
                                        </div>
                                      )}
                                    </ChangingProgressProvider>
                                  </div>
                                  <div
                                    style={{
                                      marginRight: "0px",
                                      marginTop: "35px",
                                      marginLeft: "10px",
                                      width: "9vw",
                                    }}>
                                    <p className="card-name">
                                      {connection.fullname}
                                    </p>
                                    <p className="role">{connection.role}</p>
                                    {!view ? (
                                      <p
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleViewConnection(
                                            connection.person_id
                                          );
                                        }}
                                        style={{
                                          color: "#0352b3",
                                          fontSize: "12px",
                                          marginTop: "2%",
                                          fontWeight: "500",
                                          cursor: "pointer",
                                          height: "auto",
                                          width: "10vw",
                                        }}>
                                        View Details
                                      </p>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                </div>

                                <div
                                  style={{ display: "flex" }}
                                  className={`card-details ${
                                    view || viewconnection ? "show" : ""
                                  }`}>
                                  <hr
                                    className={`custom-hr ${
                                      view || viewconnection ? "show" : ""
                                    }`}
                                    color="#2867B2"
                                  />
                                  <p
                                    className={`person-description ${
                                      view || viewconnection ? "show" : ""
                                    }`}>
                                    {connection.shortdescription}
                                  </p>
                                  <div
                                    style={{
                                      marginLeft: "20px",
                                    }}>
                                    {connection.linkedinurl ? (
                                      <div
                                        className={`card-linkedin${
                                          view || viewconnection
                                            ? "showlink"
                                            : ""
                                        }`}
                                        onClick={() =>
                                          window.open(
                                            `https://${connection.linkedinurl}`,
                                            "_blank",
                                            "noopener noreferrer"
                                          )
                                        }
                                        style={{
                                          cursor: "pointer",
                                          // marginTop: "10%",
                                        }}>
                                        <i className="fa-brands fa-linkedin"></i>
                                        <span
                                          style={{
                                            textDecoration: "none",
                                            color: "black",
                                          }}>
                                          LinkedIn
                                        </span>
                                        <img
                                          src={Networks}
                                          alt=""
                                          style={{
                                            width: "9px",
                                            height: "9px",
                                          }}
                                        />
                                      </div>
                                    ) : (
                                      ""
                                    )}
                                    <div
                                      className={`card-number ${
                                        view || viewconnection
                                          ? connection.linkedinurl
                                            ? "showlink"
                                            : "show"
                                          : connection.linkedinurl
                                            ? "link"
                                          : connection.email
                                            ? "none"
                                            : "noneemail"
                                      }`}
                                      // style={
                                      //   connection.linkedinurl
                                      //     ? {

                                      //       }
                                      //     : { marginTop: "15%" }
                                      // }
                                    >
                                      <i className="fa-solid fa-phone"></i>
                                      <p>{connection.phonenumber}</p>
                                    </div>
                                    <div className="card-mail">
                                      {connection.email?(
                                        <div style={{display: 'flex', gap: '5px'}}>
                                          <i className="fa-solid fa-envelope"></i>
                                          <p>{connection.email}</p>
                                        </div>
                                      ):('')}
                                    </div>
                                    {view || viewconnection ? (
                                      <div className="subname-active" style={{width: "100%"}}>
                                        <div>
                                          <p
                                            style={{
                                              width: "10vw",
                                              display: "flex",
                                              marginTop: "6%",
                                              width: "100%"
                                            }}>
                                              {connection.sub_name !== connection.fullname?(
                                                <p
                                                style={{
                                                  fontSize: "14px",
                                                  fontWeight: "600",
                                                  width: "60%"
                                                }}>
                                                Referred by :
                                              </p>
                                              ):('')}
                                            <p
                                              style={{
                                                marginLeft: "3%",
                                                marginTop: "1%",
                                                fontSize: "13px",
                                                width: "100%",
                                              }}>
                                                {connection.sub_name!==connection.fullname?(connection.sub_name):('')}
                                            </p>
                                          </p>
                                        </div>
                                        <div className="card-active">
                                          <button
                                            className="activebutton"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handlemarkactive(
                                                connection.person_id,
                                                connection.status
                                              );
                                            }}>
                                            {connection.status === 1
                                              ? "Mark as Inactive"
                                              : connection.status === 0
                                              ? "Mark as Active"
                                              : "Request sent"}
                                          </button>
                                        </div>
                                      </div>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : null
                        )
                      ) : (
                        <div className="empty-error">
                          <div>
                            <i class="fa-solid fa-circle-info"></i>
                            <p>No Connections found</p>
                            <Button
                              onClick={handleaddConnections}
                              style={{ marginTop: "10px" }}>
                              New Connection
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* {filter && <Popup />} */}
              </div>
            ) : (
              <div
                style={{
                  width: "100%",
                  overflow: "hidden",
                  marginLeft: "-10px",
                }}>
                <div className="search">
                  <p style={{ fontSize: "16px", fontWeight: "600" }}>
                    Networks
                  </p>
                  <hr
                    className={`hr-bar ${view || viewconnection ? "show" : ""}`}
                  />
                  <div style={{ display: "flex" }}>
                    <input
                      type="text"
                      onChange={(e) => setSearchtermnetworks(e.target.value)}
                      placeholder="Search Networks"
                      className={`search-bar ${
                        view || viewconnection ? "show" : ""
                      }`}
                    />
                    <FilterIcon
                    className={`filtericon-connections ${view || viewconnection ? "show" : ""}`}
                      style={{ marginTop: "0px", cursor: "pointer" }}
                      onClick={handleFilter}
                    />
                  </div>
                </div>
                <div className="networks-card">
                  {connectionloading ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                      }}>
                      <BeatLoader
                        loading={connectionloading}
                        color="#2867B2"
                        size={15}
                      />
                    </div>
                  ) : (
                    <div>
                      {filteredNetworks.length > 0 ? (
                        // userNetworks.length > 0 ? (
                        filteredNetworks.map((connection) =>
                          selectedCardId === null ||
                          selectedCardId === connection.person_id ? (
                            <div key={connection.person_id}>
                              <div
                                className={`card ${
                                  view || viewconnection ? "show" : ""
                                }`}
                                onClick={() =>
                                  handleCard(connection.person_id)
                                }>
                                <div
                                  className={`${
                                    view || viewconnection
                                      ? "add-contact"
                                      : "add-contact-none"
                                  }`}
                                  onClick={handleAddContact}>
                                  <i
                                    class="fa-solid fa-plus"
                                    style={{
                                      color: "white",
                                      fontSize: "12px",
                                    }}></i>
                                </div>

                                <div style={{ display: "flex" }}>
                                  <div className="profile-container">
                                    <ChangingProgressProvider
                                      value={connection.overall_completion}>
                                      {(value) => (                      
                                        <div style={{ width: "80px" }}>
                                          <CircularProgressbarWithChildren
                                            className="custom-progressbar"
                                            value={
                                              connection.overall_completion
                                            }
                                            circleRatio={0.75}
                                            styles={buildStyles({
                                              pathTransitionDuration: 10.5,
                                              pathTransition: "#122E50",
                                              strokeWidth: 23,
                                              // thickness: "1",
                                              rotation: 1 / 2 + 1 / 8,
                                              // strokeLinecap: "butt",
                                              width: "50vw",
                                              trailColor: "#D7DADB",
                                              pathColor:
                                                // getPathColor(connection.overall_completion),
                                                value > 0
                                                  ? "#2867B2"
                                                  : "transparent",
                                            })}>
                                            <div className="profile-2">
                                              <img
                                                src={`${api}${connection.profile}`}
                                                alt="Profile"
                                              />
                                              <img
                                                src={
                                                  connection.rank === 3
                                                    ? Rank1
                                                    : connection.rank === 2
                                                    ? Rank2
                                                    : connection.rank === 1
                                                    ? Rank3
                                                    : Rank4
                                                }
                                                alt="rank-img"
                                                style={{
                                                  width: "25px",
                                                  height: "25px",
                                                }}
                                                className="rank-images-connections"
                                              />
                                            </div>
                                            {/* <p>dewf</p> */}
                                          </CircularProgressbarWithChildren>
                                        </div>
                                      )}
                                    </ChangingProgressProvider>
                                  </div>
                                  <div
                                    style={{
                                      marginRight: "0px",
                                      marginTop: "35px",
                                      marginLeft: "10px",
                                      width: "9vw",
                                    }}>
                                    <p className="card-name">
                                      {connection.fullname}
                                    </p>
                                    <p className="role">{connection.role}</p>
                                    {!view ? (
                                      <p
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleViewConnection(
                                            connection.person_id
                                          );
                                        }}
                                        style={{
                                          color: "#0352b3",
                                          fontSize: "12px",
                                          marginTop: "2%",
                                          fontWeight: "500",
                                          cursor: "pointer",
                                          height: "auto",
                                          width: "10vw",
                                        }}>
                                        View Details
                                      </p>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                </div>
                                <div
                                  style={{ display: "flex" }}
                                  className={`card-details ${
                                    view || viewconnection ? "show" : ""
                                  }`}>
                                  <hr
                                    className={`custom-hr ${
                                      view || viewconnection ? "show" : ""
                                    }`}
                                    color="#2867B2"
                                  />
                                  <p
                                    className={`person-description ${
                                      view || viewconnection ? "show" : ""
                                    }`}>
                                    {connection.shortdescription}
                                  </p>
                                  <div
                                    style={{
                                      marginLeft: "20px",
                                      // marginTop: "5%",
                                    }}>
                                    {connection.linkedinurl ? (
                                      <div
                                        className={`card-linkedin${
                                          view || viewconnection
                                            ? "showlink"
                                            : ""
                                        }`}
                                        onClick={() =>
                                          window.open(
                                            `https://${connection.linkedinurl}`,
                                            "_blank",
                                            "noopener noreferrer"
                                          )
                                        }
                                        style={{
                                          cursor: "pointer",
                                          // marginTop: "10%",
                                        }}>
                                        <i className="fa-brands fa-linkedin"></i>
                                        <span
                                          style={{
                                            textDecoration: "none",
                                            color: "black",
                                          }}>
                                          LinkedIn
                                        </span>
                                        <img
                                          src={Networks}
                                          alt=""
                                          style={{
                                            width: "9px",
                                            height: "9px",
                                          }}
                                        />
                                      </div>
                                    ) : (
                                      ""
                                    )}
                                    <div
                                      className={`card-number ${
                                        view || viewconnection
                                          ? connection.linkedinurl
                                            ? "showlink"
                                            : "show"
                                          : connection.linkedinurl
                                            ? "link"
                                          : connection.email
                                            ? "none"
                                            : "noneemail"
                                      }`}
                                      // style={
                                      //   connection.linkedinurl
                                      //     ? {

                                      //       }
                                      //     : { marginTop: "15%" }
                                      // }
                                    >
                                      <i className="fa-solid fa-phone"></i>
                                      <p>{connection.phonenumber}</p>
                                    </div>
                                    <div className="card-mail">
                                      {connection.email?(
                                        <div style={{display: 'flex', gap: '5px'}}>
                                          <i className="fa-solid fa-envelope"></i>
                                          <p>{connection.email}</p>
                                        </div>
                                      ):('')}
                                    </div>
                                    {view || viewconnection ? (
                                      <div className="subname-active" style={{width: "100%"}}>
                                        <div>
                                          <p
                                            style={{
                                              width: "10vw",
                                              display: "flex",
                                              marginTop: "6%",
                                              width: "100%"
                                            }}>
                                              {connection.sub_name !== connection.fullname?(
                                                <p
                                                style={{
                                                  fontSize: "14px",
                                                  fontWeight: "600",
                                                  width: "60%"
                                                }}>
                                                Referred by :
                                              </p>
                                              ):('')}
                                            <p
                                              style={{
                                                marginLeft: "3%",
                                                marginTop: "1%",
                                                fontSize: "13px",
                                                width: "100%",
                                              }}>
                                                {connection.sub_name!==connection.fullname?(connection.sub_name):('')}
                                            </p>
                                          </p>
                                        </div>
                                        <div className="card-active">
                                          <button
                                            className="activebutton"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handlemarkactive(
                                                connection.person_id,
                                                connection.status
                                              );
                                            }}>
                                            {connection.status === 1
                                              ? "Mark as Inactive"
                                              : connection.status === 0
                                              ? "Mark as Active"
                                              : "Request sent"}
                                          </button>
                                        </div>
                                      </div>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : null
                        )
                      ) : (
                        <div className="empty-error">
                          <div>
                            <i class="fa-solid fa-circle-info"></i>
                            <p>No Networks found</p>
                            <Button
                              onClick={handleaddConnections}
                              style={{ marginTop: "10px" }}>
                              New Connection
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {/* {filter && <Popup />} */}
              </div>
            )}
          </div>
        )}
      </div>
      {!AddConnections || !TableOpen ? (
        <div
          className={`right-handside ${
            view || viewconnection
              ? "show"
              : AddConnections || TableOpen
              ? "addconnection"
              : ""
          }`}>
          {Connections ? (
            view || viewconnection || ExpertiseConnection ? (
              view ? (
                <MainFlow handlecancelflows={handlecancelflows} />
              ) : viewconnection ? (
                <Details
                  handlecancelviewconnections={handlecancelviewconnections}
                />
              ) : (              
                ""
              )
            ) : (
              <div>
                <div
                  style={{
                    backgroundColor: "white",
                    padding: "10px",
                    height: "57vh",
                    width: "100%",
                    // overflow: 'auto',
                  }}
                  className="main-schedule">
                  <div style={{ display: "flex", gap: "12px" }}>
                    <p
                      style={{
                        fontSize: "19px",
                        fontWeight: "600",
                        padding: "0% 0% 2% 0%",
                      }}>
                      My Schedule
                    </p>
                    <div className="notify">{lengthconnection}</div>
                    <FilterIcon
                      style={{
                        marginTop: "0px",
                        marginLeft: "40%",
                        cursor: "pointer",
                      }}
                      onClick={handleOpenMyNetwork}
                    />
                  </div>
                  <div className="schedule-card-container">
                    {scheduleloading ? (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "100%",
                        }}>
                        <BeatLoader
                          loading={scheduleloading}
                          color="#2867B2"
                          size={12}
                        />
                      </div>
                    ) : (
                      <div>
                        {myitemsToShow.length > 0 ? (
                          myitemsToShow.map((item, index) => {
                            const rescheduleTime = new Date(item.scheduleddate);
                            const cardColor = getCardColor(rescheduleTime);

                            return (
                              <div>
                                <div
                                  className="schedule-card"
                                  key={index}
                                  style={{ backgroundColor: cardColor }}
                                  onClick={() => handlemyschedule(item)}>
                                  <div className="profile-3">
                                    <img
                                      src={`${api}${item.profile}`}
                                      alt="USER"
                                    />
                                  </div>
                                  <div>
                                    <div
                                      style={{
                                        display: "flex",
                                        // justifyContent: 'space-between',
                                        alignItems: "center",
                                      }}>
                                      <p
                                        style={{
                                          // maxWidth: '160px',
                                          fontWeight: "600",
                                          width: "10vw",
                                          fontSize: "15px",
                                          // textOverflow: 'ellipsis',
                                          // overflow: 'hidden',
                                          // whiteSpace: 'nowrap',
                                        }}>
                                        {item.fullname}
                                      </p>
                                      <p
                                        style={{
                                          fontWeight: "600",
                                          color: "#2867B2",
                                          fontSize: "12px",
                                        }}>
                                        @{" "}
                                        {rescheduleTime.toLocaleTimeString([], {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })}
                                      </p>
                                    </div>
                                    <div
                                      style={{
                                        fontSize: "12px",
                                        width: "10vw",
                                      }}>
                                      {item.note}
                                    </div>
                                  </div>
                                </div>
                                {/* </div> */}
                              </div>
                            );
                          })
                        ) : (
                          <div
                            className="empty-error"
                            style={{ height: "15vh", width: "15vw" }}>
                            <div>
                              <i class="fa-solid fa-circle-info"></i>
                              <p style={{ fontSize: "16px" }}>
                                No Schedules found
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    {filteredAndSortedMyItems.length > 3 && (
                      <div
                        style={{
                          textAlign: "center",
                          marginTop: "10px",
                          cursor: "pointer",
                          color: "#2867B2",
                          fontWeight: "600",
                        }}
                        onClick={handleshowmore}>
                        {showmore ? "Show Less" : "Show More"}
                        {showmore ? (
                          <i
                            class="fa-solid fa-chevron-up"
                            style={{
                              marginLeft: "4%",
                              paddingBottom: "6%",
                            }}></i>
                        ) : (
                          <i
                            class="fa-solid fa-chevron-down"
                            style={{ marginLeft: "4%" }}></i>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          ) : view ? (
            <MainFlow handlecancelflows={handlecancelflows} />
          ) : viewconnection ? (
            <Details
              handlecancelviewconnections={handlecancelviewconnections}
            />
          ) : !TableOpen ? (
            <div>
              <div
                style={{
                  backgroundColor: "white",
                  padding: "10px",
                  height: "57vh",
                  width: "100%",
                  // overflow: 'auto',
                }}
                className="main-schedule">
                <div style={{ display: "flex", gap: "12px" }}>
                  <p
                    style={{
                      fontSize: "19px",
                      fontWeight: "600",
                      padding: "0% 0% 2% 0%",
                    }}>
                    Scheduled Networks
                  </p>
                  <div className="notify">{lengthscheduled}</div>
                  <FilterIcon
                    style={{
                      marginTop: "0px",
                      marginLeft: "17%",
                      cursor: "pointer",
                    }}
                    onClick={() => setScheduledNetworkPopup(true)}
                  />
                </div>
                <div className="schedule-card-container">
                  {scheduleloading ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                      }}>
                      <BeatLoader
                        loading={scheduleloading}
                        color="#2867B2"
                        size={12}
                      />
                    </div>
                  ) : (
                    <div>
                      {itemsToShow.length > 0 ? (
                        itemsToShow.map((item, index) => {
                          const rescheduleTime = new Date(item.scheduleddate);
                          const cardColor = getCardColor(rescheduleTime);

                          return (
                            <div
                              className="schedule-card"
                              key={index}
                              style={{ backgroundColor: cardColor }}
                              onClick={() => handlemyschedule(item)}>
                              <div className="profile-3">
                                <img src={`${api}${item.profile}`} alt="USER" />
                              </div>
                              <div>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}>
                                  <p
                                    style={{
                                      fontWeight: "600",
                                      width: "10vw",
                                      fontSize: "15px",
                                    }}>
                                    {item.fullname}
                                  </p>
                                  <p
                                    style={{
                                      fontWeight: "600",
                                      color: "#2867B2",
                                      fontSize: "12px",
                                    }}>
                                    @{" "}
                                    {new Date(
                                      item.scheduleddate
                                    ).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </p>
                                </div>
                                <div
                                  style={{ fontSize: "12px", width: "10vw" }}>
                                  {item.note}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div
                          className="empty-error"
                          style={{ height: "15vh", width: "15vw" }}>
                          <div>
                            <i class="fa-solid fa-circle-info"></i>
                            <p style={{ fontSize: "16px" }}>
                              No Schedules found
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {/* Show More button */}
                  {filteredAndSortedItems.length > 3 && (
                    <div
                      style={{
                        textAlign: "center",
                        marginTop: "10px",
                        cursor: "pointer",
                        color: "#2867B2",
                        fontWeight: "600",
                      }}
                      onClick={handleshowmore}>
                      {showmore ? "Show Less" : "Show More"}
                      {showmore ? (
                        <i
                          class="fa-solid fa-chevron-up"
                          style={{ marginLeft: "4%", paddingBottom: "6%" }}></i>
                      ) : (
                        <i
                          class="fa-solid fa-chevron-down"
                          style={{ marginLeft: "4%" }}></i>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      ) : (
        ""
      )}

      <Dialog id="popconnections" open={add} onClose={() => setAdd(false)}>
        <div>
          <button id="popaddconnections">
            <i className="fa-solid fa-square-plus"></i> Add Connections
          </button>
          <h6 id="namephone">
            <p id="period">.</p>
            <p id="insidenamephone">Name</p>
          </h6>
          <input
            id="inputname"
            type="text"
            placeholder="Enter the name (Initial at the back)"
            autoComplete="off"
            value={inputValue}
            onChange={handleInputChange}
          />
          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                marginTop: "13px",
              }}>
              <BeatLoader loading={loading} color="#2867B2" size={10} />
            </div>
          ) : (
            <div>
              {errorMessage && <div id="errorMessage">{errorMessage}</div>}
            </div>
          )}
          <div id="buttonContainer">
            <button onClick={handleCheck} id="check">
              Check for Availability
            </button>
            <button onClick={handleDiscard} color="primary" id="discard">
              Discard
            </button>
            <button
              className={`continue ${isButtonDisabled ? "disable" : ""}`}
              onClick={handleContinue}
              color="primary"
              disabled={isButtonDisabled}
              SubConnections>
              Continue
            </button>
          </div>
        </div>
      </Dialog>
      <Dialog
        open={MyNetworkPopup}
        onClose={() => setMyNetworkPopup(false)}
        style={{ left: "85%", bottom: "25%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            padding: "5px",
            cursor: "pointer",
          }}
          onClick={() => handleRankSelection1(null)}>
          <p style={{ color: "black" }}>Show All</p>
        </div>
        <hr color="#dfdfdf" />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            padding: "5px",
            cursor: "pointer",
          }}
          onClick={() => handleRankSelection1("A")}>
          <p style={{ color: "red" }}>Missed</p>
        </div>
        <hr color="#dfdfdf" />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            padding: "5px",
            cursor: "pointer",
          }}
          onClick={() => handleRankSelection1("B")}>
          <p style={{ color: "orange" }}>Upcoming</p>
        </div>
        <hr color="#dfdfdf" />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            padding: "5px",
            cursor: "pointer",
            //         #FEECEC": 1, // Red
            // "#FBE9D0": 2, // Yellow
            // "#EDF3F7
          }}
          onClick={() => handleRankSelection1("C")}>
          <p style={{ color: "grey" }}>Later</p>
        </div>
      </Dialog>
      <Dialog
        open={ScheduledNetworkPopup}
        onClose={() => setScheduledNetworkPopup(false)}
        style={{ left: "85%", bottom: "25%", padding: "10px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            padding: "5px",
            cursor: "pointer",
          }}
          onClick={() => handleRankSelection2(null)}>
          <p style={{ color: "black" }}>Show All</p>
        </div>
        <hr color="#dfdfdf" />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            padding: "5px",
            cursor: "pointer",
          }}
          onClick={() => handleRankSelection2("A")}>
          <p style={{ color: "red" }}>Missed</p>
        </div>
        <hr color="#dfdfdf" />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            padding: "5px",
            cursor: "pointer",
          }}
          onClick={() => handleRankSelection2("B")}>
          <p style={{ color: "orange" }}>Upcoming</p>
        </div>
        <hr color="#dfdfdf" />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            padding: "5px",
            cursor: "pointer",
          }}
          onClick={() => handleRankSelection2("C")}>
          <p style={{ color: "grey" }}>Later</p>
        </div>
      </Dialog>
      <Dialog open={openactivepopup} onClose={() => setActivePopup(false)}>
        <div style={{ width: "25vw", height: "25vh", padding: "20px" }}>
          <div style={{ fontSize: "16px", fontWeight: "600", display: "flex" }}>
            <p style={{ color: "red", marginRight: "1%", marginTop: "0.5%" }}>
              *
            </p>
            Reason :{" "}
          </div>
          <Textarea
            style={{ height: "10vh", marginTop: "5%" }}
            onChange={(e) => setReason(e.target.value)}></Textarea>
          <button
            style={{
              border: "none",
              margin: "5% 0% 0% 85%",
              backgroundColor: "#2867b2",
              color: "white",
              padding: "2%",
              borderRadius: "7px",
            }}
            onClick={handleStatuschange}>
            Submit
          </button>
        </div>
      </Dialog>
      <Dialog
      open={filter}
      onClose={() => setFilter(false)}
      style={{
        // position: "absolute",
        top: "0px",
        bottom: "20%",
        left: "35%",
        // width: "200px",
        // padding: "12%",
        // backgroundColor: "#fff",
        // boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        borderRadius: "4px",
        // zIndex: 1000,
      }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          padding: "5px",
          cursor: "pointer",
        }}
        onClick={() => handleRankSelection(null)} // Show all connections
      >
        <p>Show All</p>
      </div>
      <hr color="#dfdfdf" />
      {[0, 1, 2, 3].map((level, index) => (
        <React.Fragment key={level}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              padding: "5px",
              cursor: "pointer",
            }}
            onClick={() => handleRankSelection(level)}>
            <p>Sort by:</p>
            <img
              src={
                level === 0
                  ? Rank4
                  : level === 1
                  ? Rank3
                  : level === 2
                  ? Rank2
                  : Rank1
              }
              alt=""
              width="20px"
            />
            <p>Level {level}</p>
          </div>
          {index < 3 && <hr color="#dfdfdf" />}
        </React.Fragment>
      ))}
    </Dialog>
    </div>
  );
}