import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TiTick } from "react-icons/ti";
import { TextField, Button, MenuItem } from "@mui/material";
import { Toaster, toast } from 'sonner';
import axios from 'axios';

const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const EnhancedMultiStepForm = () => {
  const steps = ["Contact Info", "Player Info", "Review", "Submit"];
  const [currentStep, setCurrentStep] = useState(1);
  const [complete, setComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const sportsConfig = {
    "Futsal Boys (8-10 players)": { min: 8, max: 10, fee: 8000 },
    "Futsal Girls (8-10 players)": { min: 8, max: 10, fee: 6000 },
    "Indoor Cricket (7-9 players)": { min: 7, max: 9, fee: 6000 },
    "Basketball Boys (8-12 players)": { min: 8, max: 12, fee: 7000 },
    "Basketball Girls (8-12 players)": { min: 8, max: 12, fee: 7000 },
    "Volleyball (6-10 players)": { min: 6, max: 10, fee: 6500 },
    "Throwball (7-11 players)": { min: 7, max: 11, fee: 5000 },
    "Badminton Singles Boy (1 player)": { min: 1, max: 1, fee: 1200 },
    "Badminton Singles Girl (1 player)": { min: 1, max: 1, fee: 1200 },
    "Badminton Doubles Boys (2 players)": { min: 2, max: 2, fee: 2000 },
    "Badminton Doubles Girls (2 players)": { min: 2, max: 2, fee: 2000 },
    "Table Tennis Singles Boy (1 player)": { min: 1, max: 1, fee: 1000 },
    "Table Tennis Singles Girl (1 player)": { min: 1, max: 1, fee: 1000 },
    "Table Tennis Doubles Boys (2 players)": { min: 2, max: 2, fee: 1200 },
    "Table Tennis Mixed (2 players)": { min: 2, max: 2, fee: 1500 },
    "Padel Doubles (2 players)": { min: 2, max: 2, fee: 15000 },
    "CS2 (5-6 players)": { min: 5, max: 6, fee: 2000 },
    "Valorant (5-6 players)": { min: 5, max: 6, fee: 2000 },
    "PUBG (4 players)": { min: 4, max: 4, fee: 1000 },
    "Tekken (1 player)": { min: 1, max: 1, fee: 900 },
    "FIFA (1 player)": { min: 1, max: 1, fee: 900 },
  };
  const [formData, setFormData] = useState({
    leader: {
      name: "",
      email: "",
      cnic: "",
      phone: "",
      teamName: "",
      sports: "",
      paymentScreenshot: null,
    },
    players: [
      {
        name: "",
        cnic: "",
        age: "",
      },
    ],
  });
  const [errors, setErrors] = useState({
    leader: {
      name: "",
      email: "",
      cnic: "",
      phone: "",
      teamName: "",
      sports: "",
      paymentScreenshot: "",
    },
    players: [{}],
  });

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateCNIC = (cnic) => {
    return /^\d{13}$/.test(cnic);
  };

  const validatePhone = (phone) => {
    return /^03\d{9}$/.test(phone);
  };

  const handleNumberOnlyInput = (e, maxLength = null) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) {
      return false;
    }
    if (maxLength && value.length > maxLength) {
      return false;
    }
    return true;
  };

  const handleInputChange = useCallback((section, field, value, index) => {
    if (["cnic", "phone"].includes(field)) {
      if (!handleNumberOnlyInput({ target: { value } }, field === "cnic" ? 13 : field === "phone" ? 11 : null)) {
        return;
      }
    }

    if (section === "leader") {
      setFormData(prevState => ({
        ...prevState,
        leader: {
          ...prevState.leader,
          [field]: value,
        },
      }));
    } else if (section === "players") {
      setFormData(prevState => {
        const newPlayers = [...prevState.players];
        newPlayers[index] = {
          ...newPlayers[index],
          [field]: value,
        };
        return {
          ...prevState,
          players: newPlayers,
        };
      });
    }

    if (window.validateTimeout) {
      clearTimeout(window.validateTimeout);
    }

    window.validateTimeout = setTimeout(() => {
      let error = "";

      if (!value) return;

      switch (field) {
        case "email":
          if (!validateEmail(value)) {
            error = "Invalid email format";
            toast.error("Please enter a valid email address");
          }
          break;
        case "cnic":
          if (!validateCNIC(value)) {
            error = "CNIC must be 13 digits";
            toast.error("CNIC must be exactly 13 digits");
          }
          break;
        case "phone":
          if (!validatePhone(value)) {
            error = "Invalid phone format";
            toast.error("Phone number must start with 03 and be 11 digits");
          }
          break;
        default:
          break;
      }

      if (section === "leader") {
        setErrors(prev => ({
          ...prev,
          leader: {
            ...prev.leader,
            [field]: error
          }
        }));
      } else if (section === "players") {
        setErrors(prev => {
          const newPlayerErrors = [...prev.players];
          newPlayerErrors[index] = {
            ...newPlayerErrors[index],
            [field]: error
          };
          return {
            ...prev,
            players: newPlayerErrors
          };
        });
      }
    }, 2000);
  }, []);

  const addPlayer = () => {
    const selectedSport = formData.leader.sports;
    const maxPlayers = selectedSport ? sportsConfig[selectedSport].max : Infinity;

    if (formData.players.length < maxPlayers) {
      setFormData((prev) => ({
        ...prev,
        players: [...prev.players, { name: "", cnic: "", age: "" }],
      }));
    } else {
      toast.error(`Maximum ${maxPlayers} players allowed for ${selectedSport}`);
    }
  };

  const removePlayer = (index) => {
    const selectedSport = formData.leader.sports;
    const minPlayers = selectedSport ? sportsConfig[selectedSport].min : 1;

    if (formData.players.length > minPlayers) {
      setFormData(prev => ({
        ...prev,
        players: prev.players.filter((_, i) => i !== index)
      }));
    } else {
      toast.error(`Minimum ${minPlayers} players required for ${selectedSport}`);
    }
  };

  const handleSubmit = async () => {
    if (validateStep(currentStep)) {
      setIsSubmitting(true);
      try {
        const submitData = new FormData();

        submitData.append('teamName', formData.leader.teamName);

        const cleanSportName = formData.leader.sports.replace(/\s*\([^)]*\)/, '').trim();
        submitData.append('sportName', cleanSportName);

        const contactPerson = {
          name: formData.leader.name,
          email: formData.leader.email,
          cnic: formData.leader.cnic,
          phone: formData.leader.phone
        };
        submitData.append('contactPerson', JSON.stringify(contactPerson));

        const playersData = formData.players.map(player => ({
          name: player.name,
          cnic: player.cnic,
          age: parseInt(player.age)
        }));
        submitData.append('players', JSON.stringify(playersData));

        if (formData.leader.paymentScreenshot) {
          submitData.append('paymentScreenshot', formData.leader.paymentScreenshot);
        }

        const response = await axios.post(
          '/api/register',
          submitData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );

        toast.success(response.data.message);
        setComplete(true);
        setCurrentStep(steps.length);

      } catch (error) {
        toast.error(error.response?.data?.message || 'An error occurred during registration');
        console.error('Registration error:', error);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      toast.error("Please fill all required fields correctly.");
    }
  };

  const validateStep = (step) => {
    if (step === 1) {
      const leaderFields = ["name", "email", "cnic", "phone", "teamName", "sports"];
      const hasErrors = Object.values(errors.leader).some(error => error !== "");
      const hasEmptyFields = leaderFields.some(field => !formData.leader[field]);
      return !hasErrors && !hasEmptyFields;
    } else if (step === 2) {
      return formData.players.every((player, index) => {
        const hasErrors = Object.values(errors.players[index] || {}).some(error => error !== "");
        return !hasErrors && player.name && player.cnic && player.age;
      });
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
      toast.success(`Step ${currentStep} completed!`);
    } else {
      toast.error("Please fill all required fields correctly.");
    }
  };

  const Stepper = () => {
    return (
      <div className="w-full relative mb-8 px-4">
        <div className="max-w-4xl mx-auto relative">
          <div className="absolute top-5 left-[50px] right-[50px] h-[2px] bg-gray-200">
            <div
              className="h-full bg-green-500 transition-all duration-300"
              style={{
                width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
              }}
            />
          </div>

          <div className="relative flex justify-between">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex flex-col items-center relative"
              >
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center 
                    text-sm font-medium relative z-10 transition-all duration-300
                    bg-white
                    ${index + 1 < currentStep || (index + 1 === steps.length && complete)
                      ? "bg-green-500 border-2 border-green-500"
                      : index + 1 === currentStep
                        ? "border-2 border-[#00A8FF]"
                        : "border-2 border-gray-200"
                    }
                  `}
                >
                  {index + 1 < currentStep || (index + 1 === steps.length && complete) ? (
                    <TiTick className="w-6 h-6 text-white bg-green-600 rounded-full" />
                  ) : (
                    <span
                      className={
                        index + 1 === currentStep
                          ? "text-[#00A8FF]"
                          : "text-gray-400"
                      }
                    >
                      {index + 1}
                    </span>
                  )}
                </div>

                <span
                  className={`
                    mt-2 text-xs sm:text-sm font-medium text-center
                    ${index + 1 <= currentStep || (index + 1 === steps.length && complete)
                      ? "text-[#00A8FF]"
                      : "text-gray-400"
                    }
                  `}
                >
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Payment details
  const PAYMENT_DETAILS = {
    accountTitle: "Ali Aamir",
    accountNumber: "03342063891",
    bankName: "EasyPaisa",
  };

  return (
    <>
      <Toaster
        richColors
        position="top-center"
        expand={false}
        closeButton
        toastOptions={{
          duration: 3000,
          className: 'toast-notification',
        }}
      />
      <div className="min-h-screen flex items-center justify-center px-4 py-8 mt-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="flex flex-col p-4 sm:p-8">
            <Stepper />
            <div className="overflow-y-auto max-h-[600px] custom-scrollbar">
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div
                    key="leader-info"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                    className="w-full px-4 sm:px-6"
                  >
                    <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800">
                      Contact Person Information
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <TextField
                        label="Leader Name"
                        variant="outlined"
                        value={formData.leader.name}
                        onChange={(e) => handleInputChange("leader", "name", e.target.value)}
                        error={Boolean(errors.leader.name)}
                        helperText={errors.leader.name}
                        fullWidth
                        size="small"
                        className="!text-sm sm:!text-base"
                      />
                      <TextField
                        label="Leader Email"
                        variant="outlined"
                        type="email"
                        value={formData.leader.email}
                        onChange={(e) => handleInputChange("leader", "email", e.target.value)}
                        error={Boolean(errors.leader.email)}
                        helperText={errors.leader.email}
                        fullWidth
                        size="small"
                      />
                      <TextField
                        label="CNIC"
                        variant="outlined"
                        value={formData.leader.cnic}
                        onChange={(e) => handleInputChange("leader", "cnic", e.target.value)}
                        error={Boolean(errors.leader.cnic)}
                        helperText={errors.leader.cnic || "13 digits required"}
                        fullWidth
                        size="small"
                        inputProps={{
                          maxLength: 13,
                          pattern: "\\d*"
                        }}
                      />
                      <TextField
                        label="Phone Number"
                        variant="outlined"
                        value={formData.leader.phone}
                        onChange={(e) => handleInputChange("leader", "phone", e.target.value)}
                        error={Boolean(errors.leader.phone)}
                        helperText={errors.leader.phone || "Format: 03XXXXXXXXX"}
                        fullWidth
                        size="small"
                        inputProps={{
                          maxLength: 11,
                          pattern: "\\d*"
                        }}
                      />
                      <TextField
                        label="Team Name"
                        variant="outlined"
                        value={formData.leader.teamName}
                        onChange={(e) => handleInputChange("leader", "teamName", e.target.value)}
                        fullWidth
                        size="small"
                      />
                      <TextField
                        select
                        label="Sports"
                        variant="outlined"
                        value={formData.leader.sports}
                        onChange={(e) => {
                          const newSport = e.target.value;
                          const minPlayers = sportsConfig[newSport].min;

                          handleInputChange("leader", "sports", newSport);

                          // Adjust players array to match minimum required players
                          setFormData(prev => ({
                            ...prev,
                            players: Array(minPlayers).fill().map((_, i) =>
                              prev.players[i] || { name: "", cnic: "", age: "" }
                            )
                          }));
                        }}
                        fullWidth
                        size="small"
                      >
                        {Object.keys(sportsConfig).map((sport) => (
                          <MenuItem key={sport} value={sport}>
                            {sport}
                          </MenuItem>
                        ))}
                      </TextField>
                      <div className="col-span-1 sm:col-span-2">
                        {formData.leader.sports && (
                          <div className="mb-4 p-4 bg-maroon/10 rounded-lg border border-maroon/20">
                            <h3 className="text-lg font-semibold text-maroon mb-2">
                              Registration Fee Details
                            </h3>
                            <p className="text-maroon font-medium mb-1">
                              Registration Fee: PKR {sportsConfig[formData.leader.sports].fee}
                            </p>
                            <div className="mt-3 space-y-1 text-sm text-maroon/90">
                              <p><span className="font-semibold">EasyPaisa Transfer:</span></p>
                              <p>Account Title: {PAYMENT_DETAILS.accountTitle}</p>
                              <p>Account Number: {PAYMENT_DETAILS.accountNumber}</p>
                            </div>
                          </div>
                        )}

                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Payment Screenshot <span className="text-red-500">*</span>
                        </label>
                        <div className="max-w-md rounded-lg overflow-hidden">
                          <div className="w-full">
                            <div
                              className={`relative h-48 rounded-lg border-2 ${errors.leader.paymentScreenshot ? 'border-red-500' : 'border-[#00A8FF]'
                                } bg-gray-50 flex justify-center items-center shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out`}
                            >
                              <div className="absolute flex flex-col items-center">
                                <img
                                  alt="File Icon"
                                  className="mb-3"
                                  src="https://img.icons8.com/dusk/64/000000/file.png"
                                />
                                <span className="block text-gray-500 font-semibold">
                                  {formData.leader.paymentScreenshot
                                    ? formData.leader.paymentScreenshot.name
                                    : "Drag & drop your files here"}
                                </span>
                                <span className="block text-gray-400 font-normal mt-1">
                                  {!formData.leader.paymentScreenshot && "or click to upload"}
                                </span>
                              </div>

                              <input
                                type="file"
                                accept="image/*"
                                className="h-full w-full opacity-0 cursor-pointer"
                                onChange={(e) =>
                                  handleInputChange("leader", "paymentScreenshot", e.target.files[0])
                                }
                              />
                            </div>
                          </div>
                        </div>
                        {errors.leader.paymentScreenshot && (
                          <p className="mt-1 text-sm text-red-500">{errors.leader.paymentScreenshot}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
                {currentStep === 2 && (
                  <motion.div
                    key="player-info"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                    className="w-full px-4 sm:px-6"
                  >
                    <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800">
                      Player Information
                    </h2>
                    <AnimatePresence>
                      {formData.players.map((player, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 50 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -50 }}
                          transition={{ duration: 0.5 }}
                          className="mb-6 p-4 sm:p-6 bg-gray-50 rounded-lg shadow-md"
                        >
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-700">
                              {index === 0 ? "Player 1 (Leader)" : `Player ${index + 1}`}
                            </h3>
                            {formData.players.length > sportsConfig[formData.leader.sports]?.min && (
                              <button
                                onClick={() => removePlayer(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                Remove Player
                              </button>
                            )}
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <TextField
                              label="Player Name"
                              variant="outlined"
                              value={player.name}
                              onChange={(e) => handleInputChange("players", "name", e.target.value, index)}
                              error={Boolean(errors.players[index]?.name)}
                              helperText={errors.players[index]?.name}
                              fullWidth
                              size="small"
                            />
                            <TextField
                              label="Player CNIC"
                              variant="outlined"
                              value={player.cnic}
                              onChange={(e) => handleInputChange("players", "cnic", e.target.value, index)}
                              error={Boolean(errors.players[index]?.cnic)}
                              helperText={errors.players[index]?.cnic}
                              fullWidth
                              size="small"
                            />
                            <TextField
                              label="Age"
                              variant="outlined"
                              value={player.age}
                              onChange={(e) => handleInputChange("players", "age", e.target.value, index)}
                              error={Boolean(errors.players[index]?.age)}
                              helperText={errors.players[index]?.age}
                              fullWidth
                              size="small"
                              inputProps={{
                                maxLength: 2,
                                pattern: "\\d*"
                              }}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-full text-sm sm:text-base font-semibold transition-colors duration-300 hover:bg-blue-600"
                      onClick={addPlayer}
                    >
                      + Add Another Player
                    </motion.button>
                  </motion.div>
                )}
                {currentStep === 3 && (
                  <motion.div
                    key="review"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                    className="w-full px-4 sm:px-6"
                  >
                    <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800">
                      Review Information
                    </h2>
                    <div className="space-y-6">
                      <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-md">
                        <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-700">
                          Contact Person Information
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {Object.entries(formData.leader).map(([key, value]) => (
                            <p key={key} className="text-sm sm:text-base">
                              <span className="font-semibold capitalize">{key}: </span>
                              {key === "paymentScreenshot"
                                ? value
                                  ? "Uploaded"
                                  : "Not uploaded"
                                : value}
                            </p>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-700">
                          Player Information
                        </h3>
                        {formData.players.map((player, index) => (
                          <div
                            key={index}
                            className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-md"
                          >
                            <h4 className="text-base sm:text-lg font-semibold mb-3">
                              Player {index + 1}
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {Object.entries(player).map(([key, value]) => (
                                <p key={key} className="text-sm sm:text-base">
                                  <span className="font-semibold capitalize">{key}: </span>
                                  {value}
                                </p>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
                {currentStep === 4 && !complete ? (
                  <motion.div
                    key="submit"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                    className="w-full px-4 sm:px-6"
                  >
                    <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800">
                      Submit
                    </h2>
                    <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-md">
                      <p className="text-base sm:text-lg mb-4">
                        Please review all the information you've entered. Once you're sure
                        everything is correct, click the "Submit" button below to complete the
                        registration process.
                      </p>
                      <p className="text-sm sm:text-base text-gray-600">
                        By submitting this form, you confirm that all the information provided
                        is accurate and complete.
                      </p>
                    </div>
                  </motion.div>
                ) : currentStep === 4 && complete ? (
                  <motion.div
                    key="submission-complete"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full px-4 sm:px-6 text-center"
                  >
                    <div className="bg-green-50 p-6 rounded-lg shadow-md">
                      <div className="w-16 h-16 bg-green-500 rounded-full mx-auto flex items-center justify-center mb-4">
                        <TiTick className="w-10 h-10 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-green-700 mb-4">
                        Registration Complete!
                      </h2>
                      <p className="text-gray-600 mb-6">
                        Thank you for your registration. We have received your information and will contact you shortly.
                      </p>
                      <p className="text-sm text-gray-500">
                        A confirmation email will be sent to your registered email address.
                      </p>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
            {!complete && (
              <div className="mt-8 flex justify-between">
                {currentStep > 1 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 bg-gray-300 rounded-full text-gray-800 font-semibold transition-colors duration-300 hover:bg-gray-400"
                    onClick={() => setCurrentStep((prev) => prev - 1)}
                    disabled={isSubmitting}
                  >
                    Previous
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                  className={`px-6 py-2 rounded-full text-white font-semibold transition-colors duration-300 flex items-center justify-center min-w-[100px] ${currentStep === steps.length
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-[#00A8FF] hover:bg-[#0096E3]"
                    } ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                  onClick={() => {
                    if (currentStep === steps.length) {
                      handleSubmit();
                    } else {
                      handleNextStep();
                    }
                  }}
                  disabled={isSubmitting}
                >
                  {currentStep === steps.length ? (
                    isSubmitting ? (
                      <div className="flex items-center space-x-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Submitting...</span>
                      </div>
                    ) : (
                      "Submit"
                    )
                  ) : (
                    "Next"
                  )}
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default EnhancedMultiStepForm; 