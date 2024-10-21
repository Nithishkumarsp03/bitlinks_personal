import React, { useEffect } from "react";
import { Dialog, Box, TextareaAutosize } from "@mui/material";
import Input from "@mui/joy/Input";
import { Tree, TreeNode } from "react-organizational-chart";
import "./flowchart.css";
import { useState, useRef } from "react";
import Cookies from "js-cookie";
import dayjs from "dayjs";
import Textarea from "@mui/joy/Textarea";
import Profile from "../../../Assets/Profile.png";
import "react-circular-progressbar/dist/styles.css";
import { easeQuadInOut } from "d3-ease";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import { usePerson } from "../../../COMPONENTS/Context";
import ShowAddAccount from "../../AddConnections/Addaccount";
import PersonDialog from "../../../COMPONENTS/Dialogue/PersonDialog";
import CompanyDialog from "../../../COMPONENTS/Dialogue/CompanyDialog";
import AlumniDialog from "../../../COMPONENTS/Dialogue/Alumni";
import OutcomeDialog from "../../../COMPONENTS/Dialogue/Outcome";
import PreviousExperienceDialog from "../../../COMPONENTS/Dialogue/PreviousExperience";
import PlacementDialog from "../../../COMPONENTS/Dialogue/Placement";
import ConsultancyDialog from "../../../COMPONENTS/Dialogue/Consultancy";
import InternshipDialog from "../../../COMPONENTS/Dialogue/Internship";
import ExpertiseDialog from "../../../COMPONENTS/Dialogue/Expertise";
import CryptoJS from 'crypto-js';

const SECRET_KEY = 'your-secret-key';

const ChangingProgressProvider = ({ value, children }) => {
  return children(value);
};


const Flowchart = () => {
  const decrypt = (ciphertext) => {
    try {
        if (ciphertext) {
            const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
            return bytes.toString(CryptoJS.enc.Utf8);
        }
        return '';
    } catch (error) {
        console.error("Decryption error:", error.message);
        return '';
    }
};

  const token = decrypt(Cookies.get("token"));
  const email = decrypt(Cookies.get("email"));
  const { selectedPersonId } = usePerson();
  const [person, setPerson] = useState(false);
  const [company, setCompany] = useState(false);
  const [alumni, setAlumni] = useState(false);
  const [outcome, setOutcome] = useState(false);
  const [incidents, setIncidents] = useState(false);
  const [previousExperience, setPreviousExperience] = useState(false);
  const [experience, setExperience] = useState("");
  const [placement, setPlacement] = useState(false);
  const [consultancy, setConsultancy] = useState(false);
  const [internship, setInternship] = useState(false);
  const [expertise, setExpertise] = useState(false);
  const [others, setOthers] = useState(false);
  const [file, setFile] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [imagePreview, setImagePreview] = useState(Profile);
  const [Reference, setReference] = useState("");
  const [open, setOpen] = useState(false);

  const [Ifperson, setIfperson] = useState("");
  const [Ifexperience, setIfexperience] = useState("");
  // const [Ifcompany, setIfcompany] = useState("");
  // const [Ifexpertise, setIfexpertise] = useState("");
  const [Ifplacement, setIfplacement] = useState("");
  const [Ifconsultancy, setIfconsultancy] = useState("");
  const [Ifinternship, setIfinternship] = useState("");
  // const [Ifalumni, setIfalumni] = useState("");
  // const [Ifoutcome, setIfoutcome] = useState("");
  const fileInputRef2 = useRef(null);
  const [cardAdded, setCardAdded] = useState(false);
  const [showPopup, setShowPopup] = useState(false); // Track popup visibility
  const [file2, setFile2] = useState(null);
  const [previewUrl2, setPreviewUrl2] = useState(null);
  // Preview URL for second image

  const handleClickOpen2 = () => {
    if (fileInputRef2.current) {
      fileInputRef2.current.click();
    }
  };
  const handleFileChange2 = (e) => {
    const selectedFile = e.target.files[0];
    setFile2(selectedFile);

    // Create a preview URL
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl2(reader.result); // Set the preview URL
        setCardAdded(true); // Mark card as added
      };
      reader.readAsDataURL(selectedFile);
    }
  };
  const handleViewClick = () => {
    setShowPopup(true);
  };

  const handleRemoveImage = () => {
    setFile2(null); // Clear the selected file
    setPreviewUrl2(null); // Clear the preview URL
    setCardAdded(false); // Reset the card added state
  };

  const [error, setError] = useState({
    person: "",
    company: "",
    alumni: "",
    outcome: "",
    previousExperience: "",
    placement: "",
    consultancy: "",
    internship: "",
    expertise: "",
  });

  const [Completion, setCompletion] = useState(0);
  const [Experience_Completion, setExperience_Completion] = useState(0);
  const [Company_Completion, setCompany_Completion] = useState(0);
  const [Expertise_Completion, setExpertise_Completion] = useState(0);
  const [Placement_Completion, setPlacement_Completion] = useState(0);
  const [Consultancy_Completion, setConsultancy_Completion] = useState(0);
  const [Internship_Completion, setInternship_Completion] = useState(0);
  const [Alumni_Completion, setAlumni_Completion] = useState(0);
  const [Outcome_Completion, setOutcome_Completion] = useState(0);

  const [Progress, setProgress] = useState(0);
  const [Person_Progress, setPerson_Progress] = useState(0);
  const [Experience_Progress, setExperience_Progress] = useState(0);
  const [Company_Progress, setCompany_Progress] = useState(0);
  const [Placement_Progress, setPlacement_Progress] = useState(0);
  const [Expertise_Progress, setExpertise_Progress] = useState(0);
  const [Consultancy_Progress, setConsultancy_Progress] = useState(0);
  const [Internship_Progress, setInternship_Progress] = useState(0);
  const [Alumni_Progress, setAlumni_Progress] = useState(0);
  const [Outcome_Progress, setOutcome_Progress] = useState(0);
  const [Total_Progress, setTotal_Progress] = useState(0);

  useEffect(() => {
    // console.log("Selected Person ID in Flowchart", selectedPersonId);
    // Perform actions based on `selectedPersonId`
  }, [selectedPersonId]);

  const fileInputRef = useRef(null);
  const handleClickOpen = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const [personInfo, setPersoninfo] = useState({
    fullname: "",
    phonenumber: "",
    age: "",
    email: "",
    dob: "",
    rating: "",
    visitingcard: "",
    linkedinurl: "",
    address: "",
    shortdescription: "",
    Completion: "",
    hashtags: "",
  });

  const [PreviousExperienceinfo, setPreviousExperienceinfo] = useState({
    companyname: "",
    position: "",
    experience: "",
    role: "",
    companyaddress: "",
    Experience_Completion: "",
  });

  const [CompanyInfo, setCompanyinfo] = useState({
    companyname: "",
    position: "",
    experience: "",
    role: "",
    companyaddress: "",
    websiteurl: "",
    scale: "",
    payscale: "",
    Company_Completion: "",
  });

  const [ExpertiseInfo, setExpertiseinfo] = useState({
    domain: "",
    specialistskills: "",
    skillset: [],
    Experience_Completion: "",
  });

  const [Alumniinfo, setAlumniinfo] = useState({
    name: "",
    batch: "",
    graduatedyear: "",
    phonenumber: "",
    companyaddress: "",
    Alumni_Completion: "",
  });

  const [Outcomeinfo, setOutcomeinfo] = useState({
    eventname: "",
    date: "",
    description: "",
    Outcome_Completion: "",
  });

  const [Placementinfo, setPlacementinfo] = useState({
    role: "",
    domain: "",
    skillset: "",
    eligibility: "",
    Placement_Completion: "",
  });

  const [Consultancyinfo, setConsultancyinfo] = useState({
    role: "",
    domain: "",
    skillset: "",
    eligibility: "",
    projecttype: "",
    Consultancy_Completion: "",
  });

  const [Internshipinfo, setInternshipinfo] = useState({
    role: "",
    domain: "",
    skillset: "",
    eligibility: "",
    projecttype: "",
    Internship_Completion: "",
  });

  const handleRatingchange = (selectedOption) => {
    setPersoninfo((prevDetails_1) => ({
      ...prevDetails_1,
      rating: selectedOption.value,  // Store the selected value
    }));
  }

  const updateErrorField = (field, message) => {
    setError((prevError) => ({
      ...prevError,
      [field]: message,
    }));
  };
  const CalculateProgress_Person = () => {
    const { fullname, phonenumber, age, email,dob, rating, visitingcard, linkedinurl, address, shortdescription, hashtags} = personInfo;

    const totalFields = 10;

    // if (totalFields === 0)

    const filledFields = 
    (typeof fullname === 'string' && fullname.trim() !== "" ? 1 : 0) +
    (typeof phonenumber === 'string' && phonenumber.trim() !== "" ? 1 : 0) +
    // (age.trim() !== "" ? 1 : 0) + 
    (typeof email === 'string' && email.trim() !== "" ? 1 : 0) +
    (typeof dob === 'string' && dob.trim() !== "" ? 1 : 0) +
    (typeof rating === 'string' && rating.trim() !== "" ? 1 : 0) +
    (typeof visitingcard === 'string' && visitingcard.trim() !== "" ? 1 : 0) +
    (typeof linkedinurl === 'string' && linkedinurl.trim() !== "" ? 1 : 0) +
    (typeof address === 'string' && address.trim() !== "" ? 1 : 0) +
    (typeof shortdescription === 'string' && shortdescription.trim() !== "" ? 1 : 0) +
    (typeof hashtags === 'string' && hashtags.trim() !== "" ? 1 : 0);
    
    // Object.values(personInfo).filter(
    //   (value) => value !== ""
    // ).length;
    const Completion = (filledFields / totalFields) * 100;
    setCompletion(Completion);
    setPerson_Progress(Completion);
    
    console.log("filledFields : ",filledFields);
    console.log("totalFields : ",totalFields);
    console.log("Completion : ",Completion);
    // console.log("Completion : ",Completion);
  };

  useEffect(() => {
    CalculateProgress_Person();
  }, [personInfo]);

  const CalculateProgress_Experience = () => {
    const {
      companyname,
      position,
      experience,
      role,
      companyaddress,
    } = PreviousExperienceinfo;
  
    const totalFields = 5;
  
    const filledFields =
      (typeof companyname === "string" && companyname.trim() !== "" ? 1 : 0) +
      (typeof position === "string" && position.trim() !== "" ? 1 : 0) +
      (experience && experience.toString().trim() !== "" ? 1 : 0) +
      (typeof role === "string" && role.trim() !== "" ? 1 : 0) +
      (typeof companyaddress === "string" && companyaddress.trim() !== "" ? 1 : 0);
  
    const Experience_Completion = (filledFields / totalFields) * 100;
    setExperience_Completion(Experience_Completion);
    setExperience_Progress(Experience_Completion);
  
    // console.log("Experience_Completion : ",Experience_Completion)
  };
  
  useEffect(() => {
    CalculateProgress_Experience();
  }, [PreviousExperienceinfo]);
  

  const CalculateProgress_Company = () => {
    const { companyname, position, experience, role, companyaddress, websiteurl, scale, payscale } = CompanyInfo; 

    const totalFields = 8;
    const filledFields = 
    (typeof companyname === "string" && companyname.trim() !== "" ? 1 : 0) + 
    (typeof position === "string" && position.trim() !== "" ? 1 : 0) + 
    (typeof experience === "string" && experience.trim() !== "" ? 1 : 0) +
    (typeof role === "string" && role.trim() !== "" ? 1 : 0) +
    (typeof companyaddress === "string" && companyaddress.trim() !== "" ? 1 : 0) +
    (typeof websiteurl === "string" && websiteurl.trim() !== "" ? 1 : 0) +
    (typeof scale === "string" && scale.trim() !== "" ? 1 : 0) +
    (typeof payscale === "string" && payscale.trim() !== "" ? 1 : 0) ;
    // Object.values(CompanyInfo).filter(
    //   (value) => typeof value === "string" && value.trim() !== ""
    // ).length;
    const Company_Completion = (filledFields / totalFields) * 100;
    setCompany_Completion(Company_Completion);
    setCompany_Progress(Company_Completion);
    // console.log("Company_Completion : ",Company_Completion);
  };
  useEffect(() => {
    CalculateProgress_Company();
  }, [CompanyInfo]);

  const CalculateProgress_Expertise = () => {
    const { domain, specialistskills, skillset } = ExpertiseInfo; 
  
    const totalFields = 3; 
    const filledFields =
      (domain.trim() !== "" ? 1 : 0) + 
      (specialistskills.trim() !== "" ? 1 : 0) + 
      (Array.isArray(skillset) && skillset.some(skill => skill.trim() !== "") ? 1 : 0);
  
    const Expertise_Completion = (filledFields / totalFields) * 100;
    setExpertise_Completion(Expertise_Completion);
    setExpertise_Progress(Expertise_Completion);
    // console.log("Expertise_Completion : ",Expertise_Completion)
  };

  useEffect(() => {
    CalculateProgress_Expertise();
  }, [ExpertiseInfo]);
  
  const CalculateProgress_Placement = () => {
    const {role, domain, skillset, eligibility} = Placementinfo;


    const totalFields = 4;
    const filledFields = 
      (role.trim() !== "" ? 1 : 0) + 
      (domain.trim() !== "" ? 1 : 0) + 
      (Array.isArray(skillset) && skillset.some(skill => skill.trim() !== "") ? 1 : 0) +
      (eligibility.trim() !== "" ? 1 : 0) ;


    const Placement_Completion = (filledFields / totalFields) * 100;
    setPlacement_Completion(Placement_Completion);
    setPlacement_Progress(Placement_Completion);
    // console.log("Placement_Completion : ",Placement_Completion)
    // return Placement_Completion;
  };
  useEffect(() => {
    CalculateProgress_Placement();
  }, [Placementinfo]);

  const CalculateProgress_Consultancy = () => {
const {role, domain, skillset, eligibility, projecttype} = Consultancyinfo;

    const totalFields = 5;
    const filledFields = 
    (role.trim() !== "" ? 1 : 0) + 
      (domain.trim() !== "" ? 1 : 0) + 
      (Array.isArray(skillset) && skillset.some(skill => skill.trim() !== "") ? 1 : 0) +
      (eligibility.trim() !== "" ? 1 : 0) +
      (projecttype.trim() !== "" ? 1 : 0) ;

    const Consultancy_Completion = (filledFields / totalFields) * 100;
    setConsultancy_Completion(Consultancy_Completion);
    setConsultancy_Progress(Consultancy_Completion);
    // console.log("Consultancy_Completion : ",Consultancy_Completion)
  };
  useEffect(() => {
    CalculateProgress_Consultancy();
  }, [Consultancyinfo]);
  const CalculateProgress_Internship = () => {
    const {role, domain, skillset, eligibility, projecttype} = Internshipinfo;

    const totalFields = 5;
    const filledFields = 
    (role.trim() !== "" ? 1 : 0) + 
      (domain.trim() !== "" ? 1 : 0) + 
      (Array.isArray(skillset) && skillset.some(skill => skill.trim() !== "") ? 1 : 0) +
      (eligibility.trim() !== "" ? 1 : 0) +
      (projecttype.trim() !== "" ? 1 : 0) ;
    
    const Internship_Completion = (filledFields / totalFields) * 100;
    setInternship_Completion(Internship_Completion);
    setInternship_Progress(Internship_Completion);
    // console.log("Internship_Completion : ",Internship_Completion)
  };
  useEffect(() => {
    CalculateProgress_Internship();
  }, [Internshipinfo]);
  const CalculateProgress_Alumni = () => {
    const { name, batch, graduatedyear, phonenumber, companyaddress } = Alumniinfo;
  
    const totalFields = 5;
  
    const filledFields =
      (typeof name === "string" && name.trim() !== "" ? 1 : 0) +
      (batch && batch.toString().trim() !== "" ? 1 : 0) +  // Add + here
      (graduatedyear && graduatedyear.toString().trim() !== "" ? 1 : 0)  + // Adjusting for graduatedyear as a dropdown
      (typeof phonenumber === "string" && phonenumber.trim() !== "" ? 1 : 0) + 
      // (typeof companyAddress === "" && companyAddress !== "" ? 1 : 0); 
      
    (typeof companyaddress === "string" && companyaddress.trim() !== "" ? 1 : 0) ;
  
    const Alumni_Completion = (filledFields / totalFields) * 100;
    setAlumni_Completion(Alumni_Completion);
    setAlumni_Progress(Alumni_Completion);
    // console.log("ALUMNI = ", Alumni_Completion);
  };
  
  
  useEffect(() => {
    CalculateProgress_Alumni();
  }, [Alumniinfo]);
  
  const CalculateProgress_Outcome = () => {
    const totalFields = 3;
    const filledFields = Object.values(Outcomeinfo).filter(
      (value) => typeof value === "string" && value.trim() !== ""
    ).length;
    const Outcome_Completion = (filledFields / totalFields) * 100;
    setOutcome_Completion(Outcome_Completion);
    setOutcome_Progress(Outcome_Completion);
    // return Outcome_Completion;
  };
  useEffect(() => {
    CalculateProgress_Outcome();
  }, [Outcomeinfo]);

  const personFilledFields =
        Object.values(personInfo).filter(
          (value) => typeof value === "string" && value.trim() !== ""
        ).length;
    
      const experienceFilledFields =
        Object.values(PreviousExperienceinfo).filter(
          (value) => typeof value === "string" && value.trim() !== ""
        ).length;
    
      const companyFilledFields =
        Object.values(CompanyInfo).filter(
          (value) => typeof value === "string" && value.trim() !== ""
        ).length;
    
      const expertiseFilledFields =
        Object.values(ExpertiseInfo).filter(
          (value) => typeof value === "string" && value.trim() !== ""
        ).length;
    
      const placementFilledFields =
        Object.values(Placementinfo).filter(
          (value) => typeof value === "string" && value.trim() !== ""
        ).length;
    
      const consultancyFilledFields =
        Object.values(Consultancyinfo).filter(
          (value) => typeof value === "string" && value.trim() !== ""
        ).length;
    
      const internshipFilledFields =
        Object.values(Internshipinfo).filter(
          (value) => typeof value === "string" && value.trim() !== ""
        ).length;
    
      const alumniFilledFields =
        Object.values(Alumniinfo).filter(
          (value) => typeof value === "string" && value.trim() !== ""
        ).length;
    
      const outcomeFilledFields =
        Object.values(Outcomeinfo).filter(
          (value) => typeof value === "string" && value.trim() !== ""
        ).length;

  // useEffect(() => {
    const CalculateTotal_Progress = () => {
      // Total fields for each section
      const personTotalFields = 12
      const experienceTotalFields = 5;
      const companyTotalFields = 9;
      const expertiseTotalFields = 3;
      const placementTotalFields = 4;
      const consultancyTotalFields = 5;
      const internshipTotalFields = 5;
      const alumniTotalFields = 5;
      const outcomeTotalFields = 3;
    
      // Sum of all total fields
      const totalFields =
        personTotalFields +
        experienceTotalFields +
        companyTotalFields +
        expertiseTotalFields +
        placementTotalFields +
        consultancyTotalFields +
        internshipTotalFields +
        alumniTotalFields +
        outcomeTotalFields;
    
      // Sum of all filled fields
      const totalFilledFields =
        personFilledFields +
        experienceFilledFields +
        companyFilledFields +
        expertiseFilledFields +
        placementFilledFields +
        consultancyFilledFields +
        internshipFilledFields +
        alumniFilledFields +
        outcomeFilledFields;
    
      // Calculate total completion percentage
      const Total_Completion = (totalFilledFields / totalFields) * 100;
    
      // Set the total progress
      setTotal_Progress(Total_Completion);
    
      // console.log("SUM OF INPUTS = ", totalFilledFields);
      // console.log("TOTAL INPUTS = ", totalFields);
      // console.log("TOTAL = ", Total_Completion);
    };
    
    // useEffect with the correct function call and dependencies
    useEffect(() => {
      CalculateTotal_Progress();
    }, [
      personInfo,
      PreviousExperienceinfo,
      CompanyInfo,
      ExpertiseInfo,
      Placementinfo,
      Consultancyinfo,
      Internshipinfo,
      Alumniinfo,
      Outcomeinfo
    ]);
    
  const handleDetailsChangeonly1 = (e) => {
    const { name, value } = e.target;
    setPersoninfo((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
    CalculateProgress_Person();
  };
  const handleDetailsChange2 = (event) => {
    const { name, value } = event.target;
    // console.log('Updating field:', name, 'with value:', value); // Debugging
    setPreviousExperienceinfo(prevInfo => ({
        ...prevInfo,
        [name]: value
    }));
    CalculateProgress_Experience();
  };
  const handleDetailsChange3 = (e) => {
    const { name, value } = e.target;
    setCompanyinfo((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
    CalculateProgress_Company();
  };
  const handleDetailsChange4 = (e) => {
    const { name, value } = e.target;
    setExpertiseinfo((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
    CalculateProgress_Expertise();
  };
  const handleDetailsChange5 = (e) => {
    const { name, value } = e.target;
    setAlumniinfo((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
    CalculateProgress_Alumni();
  };
  const convertToISOString = (dateString) => {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day).toISOString();
  };
  const handleDetailsChange6 = (event) => {
    const { name, value } = event.target;
    if (name === "date") {
      const isoString = convertToISOString(value);
      setOutcomeinfo((prevInfo) => ({
        ...prevInfo,
        [name]: isoString,
      }));
      CalculateProgress_Outcome();
    } else {
      setOutcomeinfo((prevInfo) => ({
        ...prevInfo,
        [name]: value,
      }));
      CalculateProgress_Outcome();
    }
  };
  const handleDetailsChange8 = (e) => {
    const { name, value } = e.target;
    setPlacementinfo((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
    CalculateProgress_Placement();
  };
  const handleDetailsChange9 = (e) => {
    const { name, value } = e.target;
    setConsultancyinfo((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
    CalculateProgress_Consultancy();
  };
  const handleDetailsChange10 = (e) => {
    const { name, value } = e.target;
    setInternshipinfo((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
    CalculateProgress_Internship();
  };

  ///////////////////////////////            BACKEND                 \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

  // Fetch the person data when the component selectedPersonId changes

  useEffect(() => {
    if (!selectedPersonId) return;
    const fetchPerson = async () => {
      try {
        const personResponse = await fetch(
          process.env.REACT_APP_API + `/persondata/${selectedPersonId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${token}`
            },
          }
        );
        if (!personResponse.ok) {
          // throw new Error(`HTTP error! status: ${personResponse.status}`);
        }
        const data = await personResponse.json();
        setPersoninfo(data);
        setPerson_Progress(data.Completion);
        setIfperson(data.ifperson);
        setImagePreview(`${process.env.REACT_APP_API}${data.profile}`);
      } catch (error) {
        updateErrorField("person", error.message);
      }
    };
    fetchPerson(); 
  }, [selectedPersonId]);

  useEffect(() => {
    if (!selectedPersonId) return;
    const fetchExperience = async () => {
      try {
        const response = await fetch(
          process.env.REACT_APP_API + "/experiencedata",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ person_id: selectedPersonId }),
          }
        );
        if (!response.ok) {
          // throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPreviousExperienceinfo(data);
        setExperience_Progress(data.Experience_Completion);
        setIfexperience(data.ifexperience);
      } catch (error) {
        updateErrorField("previousExperience", error.message);
      }
    };
    fetchExperience();
  }, [selectedPersonId]);

  

  const handleExperience = async (e) => {
    // console.log('Final Data being sent:', PreviousExperienceinfo); 
    e.preventDefault();
    try {
      const experienceCompletion = CalculateProgress_Experience();
      const response = await fetch(
        process.env.REACT_APP_API + "/experienceupload",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            selectedPersonId,
            Ifexperience,
            PreviousExperienceinfo,
            Experience_Completion,
          }),
        }
      );

      if (!response.ok) {
        // throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      updateErrorField("previousExperience", "Updated the latest changes");
    } catch (error) {
      updateErrorField("previousExperience", error.message);
    }
  };

  useEffect(() => {
    if (!selectedPersonId) return;
    const fetchCompany = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_API + "/companydata", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ person_id: selectedPersonId }),
        });

        if (!response.ok) {
          // throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCompanyinfo(data);
        setCompany_Progress(data.Company_Completion);
        // setIfcompany(data.Ifcompany);
      } catch (error) {
        updateErrorField("company", error.message);
      }
    };
    // CalculateProgress_Company();
    fetchCompany();
  }, [selectedPersonId]);

  useEffect(() => {
    if (!selectedPersonId) return;
    const fetchexpertise = async () => {
      try {
        const personResponse = await fetch(process.env.REACT_APP_API + `/expertisedata/${selectedPersonId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
          },
        });
        if (!personResponse.ok) {
          // throw new Error(`HTTP error! status: ${personResponse.status}`);
        }
        const data = await personResponse.json();
        setExpertiseinfo({
          domain: data.domain,
          specialistskills: data.specialistskills,
          skillset: data.skillset.split(',') // Assuming it's stored as a comma-separated string
      });;
        setExpertise_Progress(data.Expertise_Completion);
        // setIfexpertise(data.Ifexpertise);
      } catch (error) {
        // updateErrorField("expertise", error.message);
      }
    };
    // CalculateProgress_Expertise();
    fetchexpertise();
  }, [selectedPersonId]);

  useEffect(() => {
    if (!selectedPersonId) return;
    const fetchplacement = async () => {
      try {
        const personResponse = await fetch(process.env.REACT_APP_API + `/placementdata/${selectedPersonId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
          },
        });
        if (!personResponse.ok) {
          // throw new Error(`HTTP error! status: ${personResponse.status}`);
        }
        const data = await personResponse.json();
        setPlacementinfo({
          role: data.role,
          domain: data.domain,
          skillset: data.skillset.split(','),
          eligibility: data.eligibility,
        });
        setPlacement_Progress(data.Placement_Completion);
        setIfplacement(data.ifplacement);
      } catch (error) {
        // updateErrorField("placement", error.message);
      }
    };
    // CalculateProgress_Placement();
    fetchplacement();
  }, [selectedPersonId]);

  useEffect(() => {
    if (!selectedPersonId) return;
    const fetchConsultancy = async () => {
      try {
        const response = await fetch(
          process.env.REACT_APP_API + "/consultancydata",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ person_id: selectedPersonId }),
          }
        );

        if (!response.ok) {
          // throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setConsultancyinfo({
          role: data.role,
          domain: data.domain,
          skillset: data.skillset.split(','),
          eligibility: data.eligibility,
          projecttype: data.projecttype,
        });
        setConsultancy_Progress(data.Consultancy_Completion);
        setIfconsultancy(data.ifconsultancy);
      } catch (error) {
        // updateErrorField("consultancy", error.message);
      }
    };
    // CalculateProgress_Consultancy();
    fetchConsultancy();
  }, [selectedPersonId]);

  useEffect(() => {
    if (!selectedPersonId) return;
    const fetchInternship = async () => {
      try {
        const response = await fetch(
          process.env.REACT_APP_API + "/internshipdata",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ person_id: selectedPersonId }),
          }
        );
        if (!response.ok) {
          // throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setInternshipinfo({
          role: data.role,
          domain: data.domain,
          skillset: data.skillset.split(','),
          eligibility: data.eligibility,
          projecttype: data.projecttype,
        });
        setInternship_Progress(data.Internship_Completion);
        setIfinternship(data.ifinternship);
      } catch (error) {
        // updateErrorField("internship", error.message);
      }
    };
    // CalculateProgress_Internship();
    fetchInternship();
  }, [selectedPersonId]);

  useEffect(() => {
    if (!selectedPersonId) return;
    const fetchAlumni = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_API + "/alumnidata", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ person_id: selectedPersonId }),
        });
        if (!response.ok) {
          // throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAlumniinfo(data);
        setAlumni_Progress(data.Alumni_Completion);
        // setIfalumni(data.ifalumni)
      } catch (error) {
        updateErrorField("alumni", error.message);
      }
    };
    // CalculateProgress_Alumni();
    fetchAlumni();
  }, [selectedPersonId]);

  useEffect(() => {
    if (!selectedPersonId) return;
    const fetchOutcome = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_API + "/outcomedata", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ person_id: selectedPersonId }),
        });
        if (!response.ok) {
          // throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setOutcomeinfo(data);
        setOutcome_Progress(data.Outcome_Completion);
        // console.log("OUTCOME : ", Outcome_Completion);
        // setIfoutcome(data.Ifoutcome);
        // console.log(data);
      } catch (error) {
        updateErrorField("outcome", error.message);
      }
    };
    // CalculateProgress_Outcome();
    fetchOutcome();
  }, [selectedPersonId]);

  const handlePerson = async (e) => {
    e.preventDefault();

    let imagePreview = "";
    CalculateProgress_Person(); // Calculate the progress before sending it to the server

    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const uploadResponse = await fetch(process.env.REACT_APP_API + "/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          const text = await uploadResponse.text();
          console.error("Upload failed with status:", uploadResponse.status);
          console.error("Response text:", text);
          throw new Error("Network response was not ok");
        }

        const uploadData = await uploadResponse.json();
        // console.log("Image path: ", uploadData.path);
        imagePreview = uploadData.path; // Store the image path in imagePreview
      } catch (error) {
        console.error("Error:", error);
        setError("An error occurred during file upload. Please try again.");
        return;
      }
    }

    try {
      // Construct the body of the request conditionally
      const requestBody = {
        selectedPersonId,
        personInfo,
        ...(imagePreview && { imagePreview }), // Add imagePreview only if it's not an empty string
        Completion,
        TotalProgress:Total_Progress,
      };

      const response = await fetch(process.env.REACT_APP_API + "/personupload", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        // throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      updateErrorField("person", "Updated the latest changes");
    } catch (error) {
      updateErrorField("person", error.message);
    }
  };

  // const handleExperience = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await fetch(
  //       "http://localhost:8000/api/experienceupload",
  //       {
  //         method: "PUT",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           selectedPersonId,
  //           Ifexperience,
  //           PreviousExperienceinfo,
  //           Experience_Progress: CalculateProgress_Experience(), // Send the updated completion value
  //           Experience_Completion: Experience_Progress,
  //         }),
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }

  //     const data = await response.json();
  //     updateErrorField("previousExperience", "Updated the latest changes");
  //   } catch (error) {
  //     updateErrorField("previousExperience", error.message);
  //   }
  // };

  const handleCompany = async (e) => {
    e.preventDefault();

    try {
      const companyCompletion = CalculateProgress_Company();
      const response = await fetch(process.env.REACT_APP_API + "/companyupload", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          selectedPersonId,
          // Ifcompany,
          CompanyInfo,
          // Company_Progress : CalculateProgress_Company(),
          Company_Completion,
        }),
      });

      if (!response.ok) {
        // throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      updateErrorField("company", "Updated the latest changes");
    } catch (error) {
      updateErrorField("company", error.message);
    }
  };

  const handleExpertise = async (e) => {
    e.preventDefault();

    try {
      const expertiseCompletion = CalculateProgress_Expertise();
      const response = await fetch(
        process.env.REACT_APP_API + "/expertiseupload",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            selectedPersonId,
            // Ifexpertise,
            ExpertiseInfo,
            // Expertise_Progress : CalculateProgress_Expertise(),
            Expertise_Completion,
          }),
        }
      );

      if (!response.ok) {
        // throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      updateErrorField("expertise", "Updated the latest changes");
    } catch (error) {
      updateErrorField("expertise", error.message);
    }
  };

  const handleAlumni = async (e) => {
    e.preventDefault();

    try {
      const alumniCompany = CalculateProgress_Alumni();
      const response = await fetch(process.env.REACT_APP_API + "/alumniupload", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          selectedPersonId,
          //  Ifalumni,
          Alumniinfo,
          //  Alumni_Progress : CalculateProgress_Alumni(),
          Alumni_Completion,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      updateErrorField("alumni", "Updated the latest changes");
    } catch (error) {
      updateErrorField("alumni", error.message);
    }
  };

  const handleOutcome = async (e) => {
    e.preventDefault();
    try {
      const outcomeCompletion = CalculateProgress_Outcome();
      const response = await fetch(process.env.REACT_APP_API + "/outcomeupload", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          selectedPersonId,
          // Ifoutcome,
          Outcomeinfo,
          // Outcome_Progress : CalculateProgress_Outcome(),
          Outcome_Completion,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      updateErrorField("outcome", "Updated the latest changes");
    } catch (error) {
      updateErrorField("outcome", error.message);
    }
  };
  const handlePlacement = async (e) => {
    e.preventDefault();

    try {
      const placementCompletion = CalculateProgress_Placement();
      const response = await fetch(
        process.env.REACT_APP_API + "/placementupload",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            selectedPersonId,
            Ifplacement,
            Placementinfo,
            // Placement_Progress : CalculateProgress_Placement(),
            Placement_Completion,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      updateErrorField("placement", "Updated the latest changes");
    } catch (error) {
      updateErrorField("placement", error.message);
    }
  };

  const handleConsultancy = async (e) => {
    e.preventDefault();

    try {
      const consultancyCompletion = CalculateProgress_Consultancy();
      const response = await fetch(
        process.env.REACT_APP_API + "/consultancyupload",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            selectedPersonId,
            Ifconsultancy,
            Consultancyinfo,
            // Consultancy_Progress : CalculateProgress_Consultancy(),
            Consultancy_Completion,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      updateErrorField("consultancy", "Updated the latest changes");
    } catch (error) {
      updateErrorField("consultancy", error.message);
    }
  };

  const handleInternship = async (e) => {
    e.preventDefault();

    try {
      const internshipCompletion = CalculateProgress_Internship();
      const response = await fetch(
        process.env.REACT_APP_API + "/internshipupload",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            selectedPersonId,
            Ifinternship,
            Internshipinfo,
            // Internship_Progress : CalculateProgress_Internship(),
            Internship_Completion,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      updateErrorField("internship", "Updated the latest changes");
    } catch (error) {
      updateErrorField("internship", error.message);
    }
  };

  return (
    <div className="flowchart">
      <div className="flow2">
        <Tree
          lineColor="#B6B6B6"
          lineStyle="dashed"
          lineWidth="3px"
          lineHeight="10px"
          className="contact-tree"
          label={
            // <div className="node">
            <a1
              onClick={() => setPerson(true)}
              className="a1-flow-person"
              id="a1-flow-person css-to7de5-person">
              <span className="topics-flowchart1">
                <ChangingProgressProvider value={Person_Progress}>
                  {(value) => (
                    <CircularProgressbarWithChildren
                      value={value}
                      circleRatio={0.75}
                      styles={buildStyles({
                        rotation: 1 / 2 + 1 / 8,
                        strokeLinecap: "butt",
                        trailColor: "#C8D1D8",
                        pathColor: value > 0 ? "#122E50" : "transparent",
                      })}>
                      <div
                        className="person-icon"
                        style={{ textAlign: "center" }}>
                        <svg
                          className="svg"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width={18}
                          height={27}
                          color={"#122E50"}
                          fill={"none"}
                          style={{ display: "block", margin: "0 auto" }}>
                          <path
                            d="M9.13435 2.5C6.46808 2.56075 4.91073 2.81456 3.84667 3.87493C2.9154 4.80297 2.60409 6.10756 2.50003 8.2M14.8657 2.5C17.532 2.56075 19.0893 2.81456 20.1534 3.87493C21.0847 4.80297 21.396 6.10756 21.5 8.2M14.8657 21.5C17.532 21.4392 19.0893 21.1854 20.1534 20.1251C21.0847 19.197 21.396 17.8924 21.5 15.8M9.13435 21.5C6.46808 21.4392 4.91073 21.1854 3.84667 20.1251C2.9154 19.197 2.60409 17.8924 2.50003 15.8"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M7.50003 17C9.83173 14.5578 14.1433 14.4428 16.5 17M14.4951 9.5C14.4951 10.8807 13.3742 12 11.9916 12C10.6089 12 9.488 10.8807 9.488 9.5C9.488 8.11929 10.6089 7 11.9916 7C13.3742 7 14.4951 8.11929 14.4951 9.5Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                        <h6
                          style={{
                            fontSize: "10.9px",
                            marginLeft: "-4px",
                            paddingTop: "10%",
                          }}>
                          Person
                        </h6>
                      </div>
                    </CircularProgressbarWithChildren>
                  )}
                </ChangingProgressProvider>
              </span>
            </a1>
            // </div>
          }>
          <TreeNode>
            <TreeNode
              label={
                <div className="node child">
                  <div className="dote"></div>
                  <div className="border-image-container"></div>
                  <div className="icon">
                    <a2
                      onClick={() => setPreviousExperience(true)}
                      className="a1-flow">
                      <span className="topics-flowchart">
                        <ChangingProgressProvider value={Experience_Progress}>
                          {(value) => (
                            <CircularProgressbarWithChildren
                              value={value}
                              circleRatio={0.75}
                              styles={buildStyles({
                                rotation: 1 / 2 + 1 / 8,
                                strokeLinecap: "butt",
                                trailColor: "#C8D1D8",
                                pathColor:
                                  value > 0 ? "#122E50" : "transparent",
                              })}>
                              <div className="person-icon">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  width={18}
                                  height={20}
                                  color={"#122E50"}
                                  fill={"none"}>
                                  <path
                                    d="M16.3083 4.38394C15.7173 4.38394 15.4217 4.38394 15.1525 4.28405C15.1151 4.27017 15.0783 4.25491 15.042 4.23828C14.781 4.11855 14.5721 3.90959 14.1541 3.49167C13.1922 2.52977 12.7113 2.04882 12.1195 2.00447C12.04 1.99851 11.96 1.99851 11.8805 2.00447C11.2887 2.04882 10.8077 2.52977 9.84585 3.49166C9.42793 3.90959 9.21897 4.11855 8.95797 4.23828C8.92172 4.25491 8.88486 4.27017 8.84747 4.28405C8.57825 4.38394 8.28273 4.38394 7.69171 4.38394H7.58269C6.07478 4.38394 5.32083 4.38394 4.85239 4.85239C4.38394 5.32083 4.38394 6.07478 4.38394 7.58269V7.69171C4.38394 8.28273 4.38394 8.57825 4.28405 8.84747C4.27017 8.88486 4.25491 8.92172 4.23828 8.95797C4.11855 9.21897 3.90959 9.42793 3.49166 9.84585C2.52977 10.8077 2.04882 11.2887 2.00447 11.8805C1.99851 11.96 1.99851 12.04 2.00447 12.1195C2.04882 12.7113 2.52977 13.1922 3.49166 14.1541C3.90959 14.5721 4.11855 14.781 4.23828 15.042C4.25491 15.0783 4.27017 15.1151 4.28405 15.1525C4.38394 15.4217 4.38394 15.7173 4.38394 16.3083V16.4173C4.38394 17.9252 4.38394 18.6792 4.85239 19.1476C5.32083 19.6161 6.07478 19.6161 7.58269 19.6161H7.69171C8.28273 19.6161 8.57825 19.6161 8.84747 19.7159C8.88486 19.7298 8.92172 19.7451 8.95797 19.7617C9.21897 19.8815 9.42793 20.0904 9.84585 20.5083C10.8077 21.4702 11.2887 21.9512 11.8805 21.9955C11.96 22.0015 12.04 22.0015 12.1195 21.9955C12.7113 21.9512 13.1922 21.4702 14.1541 20.5083C14.5721 20.0904 14.781 19.8815 15.042 19.7617C15.0783 19.7451 15.1151 19.7298 15.1525 19.7159C15.4217 19.6161 15.7173 19.6161 16.3083 19.6161H16.4173C17.9252 19.6161 18.6792 19.6161 19.1476 19.1476C19.6161 18.6792 19.6161 17.9252 19.6161 16.4173V16.3083C19.6161 15.7173 19.6161 15.4217 19.7159 15.1525C19.7298 15.1151 19.7451 15.0783 19.7617 15.042C19.8815 14.781 20.0904 14.5721 20.5083 14.1541C21.4702 13.1922 21.9512 12.7113 21.9955 12.1195C22.0015 12.04 22.0015 11.96 21.9955 11.8805C21.9512 11.2887 21.4702 10.8077 20.5083 9.84585C20.0904 9.42793 19.8815 9.21897 19.7617 8.95797C19.7451 8.92172 19.7298 8.88486 19.7159 8.84747C19.6161 8.57825 19.6161 8.28273 19.6161 7.69171V7.58269C19.6161 6.07478 19.6161 5.32083 19.1476 4.85239C18.6792 4.38394 17.9252 4.38394 16.4173 4.38394H16.3083Z"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                  />
                                  <path
                                    d="M8.5 16.5C9.19863 15.2923 10.5044 14.4797 12 14.4797C13.4956 14.4797 14.8014 15.2923 15.5 16.5M14 10C14 11.1046 13.1046 12 12 12C10.8955 12 10 11.1046 10 10C10 8.89544 10.8955 8.00001 12 8.00001C13.1046 8.00001 14 8.89544 14 10Z"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                  />
                                </svg>
                                <h6
                                  style={{
                                    fontSize: "9.5px",
                                    marginLeft: "-10px",
                                    paddingTop: "12%",
                                  }}>
                                  Experience
                                </h6>
                              </div>
                            </CircularProgressbarWithChildren>
                          )}
                        </ChangingProgressProvider>
                      </span>
                    </a2>
                  </div>
                </div>
              }></TreeNode>
            <TreeNode
              label={
                <div className="node child">
                  <div className="dote"></div>
                  <div className="border-image-container"></div>
                  <div className="icon">
                    <a3 onClick={() => setCompany(true)} className="a1-flow">
                      <span className="topics-flowchart">
                        <ChangingProgressProvider value={Company_Progress}>
                          {(value) => (
                            <CircularProgressbarWithChildren
                              value={value}
                              circleRatio={0.75}
                              styles={buildStyles({
                                rotation: 1 / 2 + 1 / 8,
                                strokeLinecap: "butt",
                                trailColor: "#C8D1D8",
                                pathColor:
                                  value > 0 ? "#122E50" : "transparent",
                              })}>
                              <div className="person-icon">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  width={17}
                                  height={17}
                                  color={"#122E50"}
                                  fill={"none"}>
                                  <path
                                    d="M2 22H22"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                  />
                                  <path
                                    d="M18 9H14C11.518 9 11 9.518 11 12V22H21V12C21 9.518 20.482 9 18 9Z"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M15 22H3V5C3 2.518 3.518 2 6 2H12C14.482 2 15 2.518 15 5V9"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M3 6H6M3 10H6M3 14H6"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                  />
                                  <path
                                    d="M15 13H17M15 16H17"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                  />
                                  <path
                                    d="M16 22L16 19"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                                <h6
                                  style={{
                                    fontSize: "9px",
                                    marginLeft: "-7px",
                                    paddingTop: "25%",
                                  }}>
                                  Company
                                </h6>
                              </div>
                            </CircularProgressbarWithChildren>
                          )}
                        </ChangingProgressProvider>
                      </span>
                    </a3>
                  </div>
                </div>
              }>
              <TreeNode
                label={
                  <div className="node child">
                    <div className="dote"></div>
                    <div className="border-image-container"></div>
                    <div className="icon">
                      <a4 className="a1-flow">
                        <span className="topics-flowchart">
                          <ChangingProgressProvider value={Progress}>
                            {(value) => (
                              <CircularProgressbarWithChildren
                                value={value}
                                circleRatio={0.75}
                                styles={buildStyles({
                                  rotation: 1 / 2 + 1 / 8,
                                  strokeLinecap: "butt",
                                  trailColor: "#C8D1D8",
                                  pathColor:
                                    value > 0 ? "#122E50" : "transparent",
                                })}>
                                <div className="person-icon">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    width={17}
                                    height={17}
                                    color={"#122E50"}
                                    fill={"none"}>
                                    <path
                                      d="M6.08938 14.9992C5.71097 14.1486 5.5 13.2023 5.5 12.2051C5.5 8.50154 8.41015 5.49921 12 5.49921C15.5899 5.49921 18.5 8.50154 18.5 12.2051C18.5 13.2023 18.289 14.1486 17.9106 14.9992"
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                    />
                                    <path
                                      d="M12 1.99921V2.99921"
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M22 11.9992H21"
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M3 11.9992H2"
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M19.0704 4.92792L18.3633 5.63503"
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M5.6368 5.636L4.92969 4.92889"
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M14.517 19.3056C15.5274 18.9788 15.9326 18.054 16.0466 17.1238C16.0806 16.8459 15.852 16.6154 15.572 16.6154L8.47685 16.6156C8.18725 16.6156 7.95467 16.8614 7.98925 17.1489C8.1009 18.0773 8.3827 18.7555 9.45345 19.3056M14.517 19.3056C14.517 19.3056 9.62971 19.3056 9.45345 19.3056M14.517 19.3056C14.3955 21.2506 13.8338 22.0209 12.0068 21.9993C10.0526 22.0354 9.60303 21.0833 9.45345 19.3056"
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                  <h6
                                    style={{
                                      fontSize: "8.5px",
                                      marginLeft: "-12px",
                                      paddingTop: "25%",
                                    }}>
                                    Opportunity
                                  </h6>
                                </div>
                              </CircularProgressbarWithChildren>
                            )}
                          </ChangingProgressProvider>
                        </span>
                      </a4>
                    </div>
                  </div>
                }>
                <TreeNode
                  label={
                    <div className="node child">
                      <div className="dote"></div>
                      <div className="border-image-container"></div>
                      <div className="icon">
                        <a5
                          onClick={() => setPlacement(true)}
                          className="a1-flow">
                          <span className="topics-flowchart">
                            <ChangingProgressProvider
                              value={Placement_Progress}>
                              {(value) => (
                                <CircularProgressbarWithChildren
                                  value={value}
                                  circleRatio={0.75}
                                  styles={buildStyles({
                                    rotation: 1 / 2 + 1 / 8,
                                    strokeLinecap: "butt",
                                    trailColor: "#C8D1D8",
                                    pathColor:
                                      value > 0 ? "#122E50" : "transparent",
                                  })}>
                                  <div className="person-icon">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 24 24"
                                      width={17}
                                      height={17}
                                      color={"#122E50"}
                                      fill={"none"}>
                                      <path
                                        d="M11.0065 21.0001H9.60546C6.02021 21.0001 4.22759 21.0001 3.11379 19.8652C2 18.7302 2 16.9035 2 13.2501C2 9.59674 2 7.77004 3.11379 6.63508C4.22759 5.50012 6.02021 5.50012 9.60546 5.50012H13.4082C16.9934 5.50012 18.7861 5.50012 19.8999 6.63508C20.7568 7.50831 20.9544 8.79102 21 11.0001"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                      />
                                      <path
                                        d="M20.0167 20.0233L21.9998 22M21.0528 17.5265C21.0528 15.5789 19.4739 14 17.5263 14C15.5786 14 13.9998 15.5789 13.9998 17.5265C13.9998 19.4742 15.5786 21.0531 17.5263 21.0531C19.4739 21.0531 21.0528 19.4742 21.0528 17.5265Z"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                      <path
                                        d="M15.9998 5.5L15.9004 5.19094C15.4054 3.65089 15.1579 2.88087 14.5686 2.44043C13.9794 2 13.1967 2 11.6313 2H11.3682C9.8028 2 9.02011 2 8.43087 2.44043C7.84162 2.88087 7.59411 3.65089 7.0991 5.19094L6.99976 5.5"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                      />
                                    </svg>
                                    <h6
                                      style={{
                                        fontSize: "9px",
                                        marginLeft: "-10px",
                                        paddingTop: "25%",
                                      }}>
                                      Placement
                                    </h6>
                                  </div>
                                </CircularProgressbarWithChildren>
                              )}
                            </ChangingProgressProvider>
                          </span>
                        </a5>
                      </div>
                    </div>
                  }
                />
                <TreeNode
                  label={
                    <div className="node child">
                      <div
                        className="dote
  "></div>
                      <div className="border-image-container"></div>
                      <div className="icon">
                        <a6
                          onClick={() => setConsultancy(true)}
                          className="a1-flow">
                          <span className="topics-flowchart">
                            <ChangingProgressProvider
                              value={Consultancy_Progress}>
                              {(value) => (
                                <CircularProgressbarWithChildren
                                  value={value}
                                  circleRatio={0.75}
                                  styles={buildStyles({
                                    rotation: 1 / 2 + 1 / 8,
                                    strokeLinecap: "butt",
                                    trailColor: "#C8D1D8",
                                    pathColor:
                                      value > 0 ? "#122E50" : "transparent",
                                  })}>
                                  <div className="person-icon">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 24 24"
                                      width={17}
                                      height={17}
                                      color={"#122E50"}
                                      fill={"none"}>
                                      <path
                                        d="M6.5 9H5.5M10.5 9H9.5M6.5 6H5.5M10.5 6H9.5"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                      />
                                      <path
                                        d="M18.5 15H17.5M18.5 11H17.5"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                      />
                                      <path
                                        d="M14 8V22H18C19.8856 22 20.8284 22 21.4142 21.4142C22 20.8284 22 19.8856 22 18V12C22 10.1144 22 9.17157 21.4142 8.58579C20.8284 8 19.8856 8 18 8H14ZM14 8C14 5.17157 14 3.75736 13.1213 2.87868C12.2426 2 10.8284 2 8 2C5.17157 2 3.75736 2 2.87868 2.87868C2 3.75736 2 5.17157 2 8V10"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                      <path
                                        d="M8.02485 13.9545C8.02485 15.0583 7.12945 15.953 6.02491 15.953C4.92038 15.953 4.02497 15.0583 4.02497 13.9545C4.02497 12.8508 4.92038 11.9561 6.02491 11.9561C7.12945 11.9561 8.02485 12.8508 8.02485 13.9545Z"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                      />
                                      <path
                                        d="M2.06982 20.2101C3.12817 18.582 4.80886 17.9718 6.02491 17.973C7.24097 17.9743 8.8724 18.582 9.93075 20.2101C9.99917 20.3154 10.018 20.445 9.95628 20.5544C9.70877 20.993 8.94028 21.8633 8.38522 21.9223C7.74746 21.9901 6.07914 21.9996 6.0262 21.9999C5.97322 21.9996 4.2534 21.9901 3.61535 21.9223C3.06029 21.8633 2.2918 20.993 2.04429 20.5544C1.98254 20.445 2.00139 20.3154 2.06982 20.2101Z"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                      />
                                    </svg>
                                    <h6
                                      style={{
                                        fontSize: "8.5px",
                                        marginLeft: "-12px",
                                        paddingTop: "25%",
                                      }}>
                                      Consultancy
                                    </h6>
                                  </div>
                                </CircularProgressbarWithChildren>
                              )}
                            </ChangingProgressProvider>
                          </span>
                        </a6>
                      </div>
                    </div>
                  }
                />
                <TreeNode
                  label={
                    <div className="node child">
                      <div
                        className="dote
    "></div>
                      <div className="border-image-container"></div>
                      <div className="icon">
                        <a7
                          onClick={() => setInternship(true)}
                          className="a1-flow">
                          <span className="topics-flowchart">
                            <ChangingProgressProvider
                              value={Internship_Progress}>
                              {(value) => (
                                <CircularProgressbarWithChildren
                                  value={value}
                                  circleRatio={0.75}
                                  styles={buildStyles({
                                    rotation: 1 / 2 + 1 / 8,
                                    strokeLinecap: "butt",
                                    trailColor: "#C8D1D8",
                                    pathColor:
                                      value > 0 ? "#122E50" : "transparent",
                                  })}>
                                  <div className="person-icon">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 24 24"
                                      width={17}
                                      height={17}
                                      color={"#122E50"}
                                      fill={"none"}>
                                      <path
                                        d="M11.0065 21.5H9.60546C6.02021 21.5 4.22759 21.5 3.11379 20.365C2 19.2301 2 17.4034 2 13.75C2 10.0966 2 8.26992 3.11379 7.13496C4.22759 6 6.02021 6 9.60546 6H13.4082C16.9934 6 18.7861 6 19.8999 7.13496C20.7568 8.00819 20.9544 9.2909 21 11.5V13"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                      />
                                      <path
                                        d="M19 18.5H16M16 21.5C14.3431 21.5 13 20.1569 13 18.5C13 16.8431 14.3431 15.5 16 15.5M19 21.5C20.6569 21.5 22 20.1569 22 18.5C22 16.8431 20.6569 15.5 19 15.5"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                      />
                                      <path
                                        d="M15.9998 6L15.9004 5.69094C15.4054 4.15089 15.1579 3.38087 14.5686 2.94043C13.9794 2.5 13.1967 2.5 11.6313 2.5H11.3682C9.8028 2.5 9.02011 2.5 8.43087 2.94043C7.84162 3.38087 7.59411 4.15089 7.0991 5.69094L6.99976 6"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                      />
                                    </svg>
                                    <h6
                                      style={{
                                        fontSize: "9px",
                                        marginLeft: "-7px",
                                        paddingTop: "23%",
                                      }}>
                                      Internship
                                    </h6>
                                  </div>
                                </CircularProgressbarWithChildren>
                              )}
                            </ChangingProgressProvider>
                          </span>
                        </a7>
                      </div>
                    </div>
                  }
                />
              </TreeNode>
            </TreeNode>
            <TreeNode
              label={
                <div className="node child">
                  <div className="dote"></div>
                  <div className="border-image-container"></div>
                  <div className="icon">
                    <a8 onClick={() => setExpertise(true)} className="a1-flow">
                      <span className="topics-flowchart">
                        <ChangingProgressProvider value={Expertise_Progress}>
                          {(value) => (
                            <CircularProgressbarWithChildren
                              value={value}
                              circleRatio={0.75}
                              styles={buildStyles({
                                rotation: 1 / 2 + 1 / 8,
                                strokeLinecap: "butt",
                                trailColor: "#C8D1D8",
                                pathColor:
                                  value > 0 ? "#122E50" : "transparent",
                              })}>
                              <div className="person-icon">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  width={17}
                                  height={17}
                                  color={"#122E50"}
                                  fill={"none"}>
                                  <path
                                    d="M17 9.5L12 3L7 9.5L12 21L17 9.5Z"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M17.5 4L22 9.5H17M17.5 4L17 9.5M17.5 4L12 3L6.5 4M17 9.5H7M6.5 4L2 9.5H7M6.5 4L7 9.5"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M22 9.5L12 21L2 9.5"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                                <h6
                                  style={{
                                    fontSize: "9px",
                                    marginLeft: "-7px",
                                    paddingTop: "25%",
                                  }}>
                                  Expertise
                                </h6>
                              </div>
                            </CircularProgressbarWithChildren>
                          )}
                        </ChangingProgressProvider>
                      </span>
                    </a8>
                  </div>
                </div>
              }></TreeNode>
            <TreeNode
              label={
                <div className="node child">
                  <div className="dote"></div>
                  <div className="border-image-container"></div>
                  <div className="icon">
                    <a9 className="a1-flow">
                      <span className="topics-flowchart">
                        <ChangingProgressProvider value={Progress}>
                          {(value) => (
                            <CircularProgressbarWithChildren
                              value={value}
                              circleRatio={0.75}
                              styles={buildStyles({
                                rotation: 1 / 2 + 1 / 8,
                                strokeLinecap: "butt",
                                trailColor: "#C8D1D8",
                                pathColor:
                                  value > 0 ? "#122E50" : "transparent",
                              })}>
                              <div className="person-icon">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  width={17}
                                  height={17}
                                  color={"#122E50"}
                                  fill={"none"}>
                                  <path
                                    d="M13.5 17H17C19.7614 17 22 14.7614 22 12C22 9.23858 19.7614 7 17 7H13.5M10.5 17H7C4.23858 17 2 14.7614 2 12C2 9.23858 4.23858 7 7 7H10.5"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                  />
                                  <path
                                    d="M9 12H15"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                  />
                                </svg>
                                <h6
                                  style={{
                                    fontSize: "8.5px",
                                    marginLeft: "-12px",
                                    paddingTop: "25%",
                                  }}>
                                  Connections
                                </h6>
                              </div>
                            </CircularProgressbarWithChildren>
                          )}
                        </ChangingProgressProvider>
                      </span>
                    </a9>
                  </div>
                </div>
              }>
              <TreeNode
                label={
                  <div className="node child">
                    <div
                      className="dote
"></div>
                    <div className="border-image-container"></div>
                    <div className="icon">
                      <a10 className="a1-flow">
                        <span className="topics-flowchart">
                          <ChangingProgressProvider value={Progress}>
                            {(value) => (
                              <CircularProgressbarWithChildren
                                value={value}
                                circleRatio={0.75}
                                styles={buildStyles({
                                  rotation: 1 / 2 + 1 / 8,
                                  strokeLinecap: "butt",
                                  trailColor: "#C8D1D8",
                                  pathColor:
                                    value > 0 ? "#122E50" : "transparent",
                                })}>
                                <div className="person-icon">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    width={17}
                                    height={17}
                                    color={"#122E50"}
                                    fill={"none"}>
                                    <path
                                      d="M2.5 16.9999L2.05801 14.5261C1.4248 8.63642 6.05622 3.49994 12 3.49994C17.9438 3.49994 22.5752 8.63642 21.942 14.5261L21.5 16.9999"
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M8.0157 10.4999C7.81291 7.295 9.59813 3.49994 12 3.49994"
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M16 10.4999C16.2028 7.295 14.4176 3.49994 12.0157 3.49994"
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M12 2.99994V1.99994"
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M2.5 17.0093C10.5 14.1427 13.5 14.5243 21.5 17.0093C21.2236 18.1308 21.0732 21.2995 19.851 21.8966C19.265 22.1829 18.4247 21.7988 17.821 21.6546C14.9252 20.9629 13.4773 20.617 12 20.617C10.5227 20.617 9.07482 20.9629 6.17904 21.6546C5.57535 21.7988 4.73502 22.1829 4.14904 21.8966C2.92684 21.2995 2.77642 18.1308 2.5 17.0093Z"
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                  <h6
                                    style={{
                                      fontSize: "9px",
                                      marginLeft: "-5px",
                                      paddingTop: "25%",
                                      width: "40px",
                                    }}>
                                    With BIT
                                  </h6>
                                </div>
                              </CircularProgressbarWithChildren>
                            )}
                          </ChangingProgressProvider>
                        </span>
                      </a10>
                    </div>
                  </div>
                }>
                <TreeNode
                  label={
                    <div className="node child">
                      <div
                        className="dote
"></div>
                      <div className="border-image-container"></div>
                      <div className="icon">
                        <a11
                          onClick={() => setAlumni(true)}
                          className="a1-flow">
                          <span className="topics-flowchart">
                            <ChangingProgressProvider value={Alumni_Progress}>
                              {(value) => (
                                <CircularProgressbarWithChildren
                                  value={value}
                                  circleRatio={0.75}
                                  styles={buildStyles({
                                    rotation: 1 / 2 + 1 / 8,
                                    strokeLinecap: "butt",
                                    trailColor: "#C8D1D8",
                                    pathColor:
                                      value > 0 ? "#122E50" : "transparent",
                                  })}>
                                  <div className="person-icon">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 24 24"
                                      width={17}
                                      height={17}
                                      color={"#122E50"}
                                      fill={"none"}>
                                      <path
                                        d="M5 12C5 8.13401 8.13401 5 12 5C15.866 5 19 8.13401 19 12V16.3333C19 17.8847 19 18.6604 18.7877 19.2858C18.388 20.4633 17.4633 21.388 16.2858 21.7877C15.6604 22 14.8847 22 13.3333 22H10.6667C9.11529 22 8.3396 22 7.71424 21.7877C6.53668 21.388 5.61201 20.4633 5.21228 19.2858C5 18.6604 5 17.8847 5 16.3333V12Z"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinejoin="round"
                                      />
                                      <path
                                        d="M5 17C6.64996 15.17 9.17273 14 12 14C14.8273 14 17.35 15.17 19 17"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinejoin="round"
                                      />
                                      <path
                                        d="M11 10H13"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                      />
                                      <path
                                        d="M9 6V5C9 4.06812 9 3.60218 9.15224 3.23463C9.35523 2.74458 9.74458 2.35523 10.2346 2.15224C10.6022 2 11.0681 2 12 2C12.9319 2 13.3978 2 13.7654 2.15224C14.2554 2.35523 14.6448 2.74458 14.8478 3.23463C15 3.60218 15 4.06812 15 5V6"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                      />
                                      <path
                                        d="M5 19H3.71429C2.76751 19 2 18.2325 2 17.2857L2 16C2 14.3431 3.34315 13 5 13"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                      />
                                      <path
                                        d="M19 19H20.2857C21.2325 19 22 18.2325 22 17.2857L22 16C22 14.3431 20.6569 13 19 13"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                      />
                                    </svg>
                                    <h6
                                      style={{
                                        fontSize: "9px",
                                        marginLeft: "-2px",
                                        paddingTop: "25%",
                                      }}>
                                      Alumni
                                    </h6>
                                  </div>
                                </CircularProgressbarWithChildren>
                              )}
                            </ChangingProgressProvider>
                          </span>
                        </a11>
                      </div>
                    </div>
                  }
                />
                <TreeNode
                  label={
                    <div className="node child">
                      <div
                        className="dote
  "></div>
                      <div className="border-image-container"></div>
                      <div className="icon">
                        <a12 className="a1-flow">
                          <span className="topics-flowchart">
                            <ChangingProgressProvider value={Progress}>
                              {(value) => (
                                <CircularProgressbarWithChildren
                                  value={value}
                                  circleRatio={0.75}
                                  styles={buildStyles({
                                    rotation: 1 / 2 + 1 / 8,
                                    strokeLinecap: "butt",
                                    trailColor: "#C8D1D8",
                                    pathColor:
                                      value > 0 ? "#122E50" : "transparent",
                                  })}>
                                  <div className="person-icon">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 24 24"
                                      width={17}
                                      height={17}
                                      color={"#122E50"}
                                      fill={"none"}>
                                      <path
                                        d="M17 7V11C17 13.7614 14.7614 16 12 16C9.23858 16 7 13.7614 7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7Z"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                      />
                                      <path
                                        d="M17 7H14M17 11H14"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                      />
                                      <path
                                        d="M20 11C20 15.4183 16.4183 19 12 19M12 19C7.58172 19 4 15.4183 4 11M12 19V22M12 22H15M12 22H9"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                      />
                                    </svg>{" "}
                                    <h6
                                      style={{
                                        fontSize: "8.5px",
                                        marginLeft: "-11px",
                                        paddingTop: "25%",
                                      }}>
                                      Interactions
                                    </h6>
                                  </div>
                                </CircularProgressbarWithChildren>
                              )}
                            </ChangingProgressProvider>
                          </span>
                        </a12>
                      </div>
                    </div>
                  }>
                  <TreeNode
                    label={
                      <div className="node child">
                        <div
                          className="dote
    "></div>
                        <div className="border-image-container"></div>
                        <div className="icon">
                          <a13
                            onClick={() => setOutcome(true)}
                            className="a1-flow">
                            <span className="topics-flowchart">
                              <ChangingProgressProvider
                                value={Outcome_Progress}>
                                {(value) => (
                                  <CircularProgressbarWithChildren
                                    value={value}
                                    circleRatio={0.75}
                                    styles={buildStyles({
                                      rotation: 1 / 2 + 1 / 8,
                                      strokeLinecap: "butt",
                                      trailColor: "#C8D1D8",
                                      pathColor:
                                        value > 0 ? "#122E50" : "transparent",
                                    })}>
                                    <div className="person-icon">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        width={17}
                                        height={17}
                                        color={"#122E50"}
                                        fill={"none"}>
                                        <path
                                          d="M11.5 22H9.62182C7.27396 22 6.10003 22 5.28565 21.2945C4.47127 20.5889 4.27181 19.3991 3.87289 17.0194L2.66933 9.83981C2.48735 8.75428 2.39637 8.21152 2.68773 7.85576C2.9791 7.5 3.51461 7.5 4.58564 7.5H19.4144C20.4854 7.5 21.0209 7.5 21.3123 7.85576C21.6036 8.21152 21.5126 8.75428 21.3307 9.83981L21.0524 11.5"
                                          stroke="currentColor"
                                          strokeWidth="1.5"
                                          strokeLinecap="round"
                                        />
                                        <path
                                          d="M13.6418 14.4418C14.8486 13.7108 15.9018 14.0054 16.5345 14.4747C16.794 14.6671 16.9237 14.7633 17 14.7633C17.0763 14.7633 17.206 14.6671 17.4655 14.4747C18.0982 14.0054 19.1514 13.7108 20.3582 14.4418C21.9419 15.4013 22.3002 18.5666 18.6472 21.237C17.9514 21.7457 17.6035 22 17 22C16.3965 22 16.0486 21.7457 15.3528 21.237C11.6998 18.5666 12.0581 15.4013 13.6418 14.4418Z"
                                          stroke="currentColor"
                                          strokeWidth="1.5"
                                          strokeLinecap="round"
                                        />
                                        <path
                                          d="M17.5 7.5C17.5 4.46243 15.0376 2 12 2C8.96243 2 6.5 4.46243 6.5 7.5"
                                          stroke="currentColor"
                                          strokeWidth="1.5"
                                        />
                                      </svg>{" "}
                                      <h6
                                        style={{
                                          fontSize: "9px",
                                          marginLeft: "-7px",
                                          paddingTop: "25%",
                                        }}>
                                        Outcome
                                      </h6>
                                    </div>
                                  </CircularProgressbarWithChildren>
                                )}
                              </ChangingProgressProvider>
                            </span>
                          </a13>
                        </div>
                      </div>
                    }
                  />
                </TreeNode>
              </TreeNode>
              <TreeNode
                label={
                  <div className="node child">
                    <div
                      className="dote
"></div>
                    <div className="border-image-container"></div>
                    <div className="icon">
                      <a15 onClick={() => setOthers(true)} className="a6-flow">
                        <span className="topics-flowchart">
                          <ChangingProgressProvider value={Progress}>
                            {(value) => (
                              <CircularProgressbarWithChildren
                                value={value}
                                circleRatio={0.75}
                                styles={buildStyles({
                                  rotation: 1 / 2 + 1 / 8,
                                  strokeLinecap: "butt",
                                  trailColor: "#C8D1D8",
                                  pathColor:
                                    value > 0 ? "#122E50" : "transparent",
                                })}>
                                <div className="person-icon">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    width={17}
                                    height={17}
                                    color={"#122E50"}
                                    fill={"none"}>
                                    <path
                                      d="M20.3068 15.3312C16.7859 18.8521 11.1336 18.908 7.61276 15.3872C4.09192 11.8663 4.14799 6.21408 7.66883 2.69323M20.3068 15.3312C21.9837 13.6543 20.5139 9.46584 17.0241 5.97596C13.5342 2.48608 9.34571 1.01635 7.66883 2.69323M20.3068 15.3312C18.6299 17.0081 14.4414 15.5384 10.9516 12.0485M7.66883 2.69323C5.99196 4.37011 7.46169 8.55859 10.9516 12.0485M10.9516 12.0485L14 9"
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M6.48804 15L4.75106 17.4884C3.3523 19.4923 2.65291 20.4942 3.17039 21.2471C3.68787 22 5.07589 22 7.85193 22H12.1481C14.9241 22 16.3121 22 16.8296 21.2471C17.301 20.5612 16.7625 19.6686 15.6053 18"
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                  <h6
                                    style={{
                                      fontSize: "9px",
                                      marginLeft: "-3px",
                                      paddingTop: "25%",
                                    }}>
                                    Others
                                  </h6>
                                </div>
                              </CircularProgressbarWithChildren>
                            )}
                          </ChangingProgressProvider>
                        </span>
                      </a15>
                    </div>
                  </div>
                }
              />
            </TreeNode>
          </TreeNode>
        </Tree>
      </div>
      <form>
        {/* <ShowAddAccount Completion-Status={Completion} /> */}
        <PersonDialog
          open={person}
          onClose={() => setPerson(false)}
          personFilledFields={personFilledFields}
          experienceFilledFields={experienceFilledFields}
          companyFilledFields={companyFilledFields}
          placementFilledFields={placementFilledFields}
          consultancyFilledFields={consultancyFilledFields}
          internshipFilledFields={internshipFilledFields}
          alumniFilledFields={alumniFilledFields}
          outcomeFilledFields={outcomeFilledFields}
          handleDetailsChangeonly1={handleDetailsChangeonly1}
          handleTotalValue={handlePerson}
          CalculateProgress_Person={CalculateProgress_Person}
          CalculateTotal_Progress={CalculateTotal_Progress}
        />
        <PreviousExperienceDialog
          open={previousExperience}
          onClose={() => setPreviousExperience(false)}
          Ifexperience={Ifexperience}
          setIfexperience={setIfexperience}
          PreviousExperienceinfo={PreviousExperienceinfo}
          handleDetailsChange2={handleDetailsChange2}
          error={error.previousExperience}
          handleExperience={handleExperience}
          handleTotalValue={handlePerson}
          CalculateProgress_Experience={CalculateProgress_Experience}
          CalculateTotal_Progress={CalculateTotal_Progress}
        />
        <CompanyDialog
          open={company}
          onClose={() => setCompany(false)}
          CompanyInfo={CompanyInfo}
          handleDetailsChange3={handleDetailsChange3}
          error={error.company}
          handleCompany={handleCompany}
          handleTotalValue={handlePerson}
          CalculateProgress_Company={CalculateProgress_Company}
          CalculateTotal_Progress={CalculateTotal_Progress}
        />
        <ExpertiseDialog
          open={expertise}
          onClose={() => setExpertise(false)}
          ExpertiseInfo={ExpertiseInfo}
          handleDetailsChange4={handleDetailsChange4}
          error={error.expertise}
          handleExpertise={handleExpertise}
          handleTotalValue={handlePerson}
          CalculateProgress_Expertise={CalculateProgress_Expertise}
          CalculateTotal_Progress={CalculateTotal_Progress}
        />
        <PlacementDialog
          open={placement}
          onClose={() => setPlacement(false)}
          Ifplacement={Ifplacement}
          setIfplacement={setIfplacement}
          Placementinfo={Placementinfo}
          handleDetailsChange8={handleDetailsChange8}
          error={error.placement}
          handlePlacement={handlePlacement}
          handleTotalValue={handlePerson}
          CalculateProgress_Placement={CalculateProgress_Placement}
          CalculateTotal_Progress={CalculateTotal_Progress}
        />
        <ConsultancyDialog
          open={consultancy}
          onClose={() => setConsultancy(false)}
          Ifconsultancy={Ifconsultancy}
          setIfconsultancy={setIfconsultancy}
          Consultancyinfo={Consultancyinfo}
          handleDetailsChange9={handleDetailsChange9}
          error={error.consultancy}
          handleConsultancy={handleConsultancy}
          handleTotalValue={handlePerson}
          CalculateProgress_Consultancy={CalculateProgress_Consultancy}
          CalculateTotal_Progress={CalculateTotal_Progress}
        />
        <InternshipDialog
          open={internship}
          onClose={() => setInternship(false)}
          Ifinternship={Ifinternship}
          setIfinternship={setIfinternship}
          Internshipinfo={Internshipinfo}
          handleDetailsChange10={handleDetailsChange10}
          error={error.internship}
          handleInternship={handleInternship}
          handleTotalValue={handlePerson}
          CalculateProgress_Internship={CalculateProgress_Internship}
          CalculateTotal_Progress={CalculateTotal_Progress}
        />
        <AlumniDialog
          open={alumni}
          onClose={() => setAlumni(false)}
          Alumniinfo={Alumniinfo}
          handleDetailsChange5={handleDetailsChange5}
          error={error.alumni}
          handleAlumni={handleAlumni}
          handleTotalValue={handlePerson}
          CalculateProgress_Alumni={CalculateProgress_Alumni}
          CalculateTotal_Progress={CalculateTotal_Progress}
        />
        <OutcomeDialog
          open={outcome}
          onClose={() => setOutcome(false)}
          Outcomeinfo={Outcomeinfo}
          handleDetailsChange6={handleDetailsChange6}
          error={error.outcome}
          handleOutcome={handleOutcome}
          handleTotalValue={handlePerson}
          CalculateProgress_Outcome={CalculateProgress_Outcome}
          CalculateTotal_Progress={CalculateTotal_Progress}
        />
      </form>
    </div>
  );
};

export default Flowchart;