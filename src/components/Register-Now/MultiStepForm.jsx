import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TiTick } from "react-icons/ti";
import { TextField, MenuItem } from "@mui/material";
import { Toaster, toast } from "sonner";
import axios from "axios";

const EnhancedMultiStepForm = () => {
  const steps = ["Contact Info", "Select Sports", "Review", "Submit"];
  const [currentStep, setCurrentStep] = useState(1);
  const [complete, setComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sportsConfig = {
    "Futsal Boys (8-10 players)": { fee: 8000 },
    "Futsal Girls (8-10 players)": { fee: 6000 },
    "Indoor Cricket (7-9 players)": { fee: 6000 },
    "Basketball Boys (8-12 players)": { fee: 7000 },
    "Basketball Girls (8-12 players)": { fee: 7000 },
    "Volleyball (6-10 players)": { fee: 6500 },
    "Throwball (7-11 players)": { fee: 5000 },
    "Badminton Singles Boy (1 player)": { fee: 1200 },
    "Badminton Singles Girl (1 player)": { fee: 1200 },
    "Badminton Doubles Boys (2 players)": { fee: 2000 },
    "Badminton Doubles Girls (2 players)": { fee: 2000 },
    "Table Tennis Singles Boy (1 player)": { fee: 1000 },
    "Table Tennis Singles Girl (1 player)": { fee: 1000 },
    "Table Tennis Doubles Boys (2 players)": { fee: 1200 },
    "Table Tennis Mixed (2 players)": { fee: 1500 }
  };

  const [formData, setFormData] = useState({
    leader: {
      name: "",
      email: "",
      cnic: "",
      phone: "",
      teamName: "",
      instituteName: "",
    },
    sports: [{ sport: "", teams: "" }],
  });

  const handleInputChange = useCallback((section, field, value, index) => {
    if (section === "leader") {
      setFormData(prev => ({
        ...prev,
        leader: { ...prev.leader, [field]: value },
      }));
    }

    if (section === "sports") {
      setFormData(prev => {
        const updated = [...prev.sports];
        updated[index] = { ...updated[index], [field]: value };
        return { ...prev, sports: updated };
      });
    }
  }, []);

  const addSport = () => {
    if (formData.sports.length < Object.keys(sportsConfig).length) {
      setFormData(prev => ({
        ...prev,
        sports: [...prev.sports, { sport: "", teams: "" }],
      }));
    } else {
      toast.error("All available sports have already been added");
    }
  };

  const removeSport = (index) => {
    setFormData(prev => ({
      ...prev,
      sports: prev.sports.filter((_, i) => i !== index),
    }));
  };

  const selectedSports = formData.sports.map(s => s.sport).filter(Boolean);

  const validateStep = (step) => {
    if (step === 1) {
      return Object.values(formData.leader).every(Boolean);
    }
    if (step === 2) {
      return formData.sports.every(s => s.sport && s.teams);
    }
    return true;
  };

  const handleNextStep = () => {
    if (!validateStep(currentStep)) {
      toast.error("Please fill all required fields");
      return;
    }
    setCurrentStep(prev => prev + 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    try {
      await axios.post("/api/register", formData);
      toast.success("Registration successful!");
      setComplete(true);
      setCurrentStep(steps.length);
    } catch {
      toast.error("Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const Stepper = () => (
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
            <div key={index} className="flex flex-col items-center relative">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center bg-white border-2
                  ${
                    index + 1 < currentStep
                      ? "border-green-500 bg-green-500"
                      : index + 1 === currentStep
                      ? "border-[#F3A93E]"
                      : "border-gray-200"
                  }`}
              >
                {index + 1 < currentStep ? (
                  <TiTick className="text-white" />
                ) : (
                  <span
                    className={
                      index + 1 === currentStep
                        ? "text-[#F3A93E]"
                        : "text-gray-400"
                    }
                  >
                    {index + 1}
                  </span>
                )}
              </div>
              <span
                className={`mt-2 text-sm ${
                  index + 1 <= currentStep
                    ? "text-[#F3A93E]"
                    : "text-gray-400"
                }`}
              >
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Toaster richColors position="top-center" />
      <div className="min-h-screen flex justify-center items-center px-4">
        <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl p-6">

          <Stepper />

          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div key="step1">
                <h2 className="text-xl font-bold mb-4">Contact Information</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.keys(formData.leader).map(field => (
                    <TextField
                      key={field}
                      label={field}
                      value={formData.leader[field]}
                      onChange={e =>
                        handleInputChange("leader", field, e.target.value)
                      }
                      fullWidth
                      size="small"
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div key="step2">
                <h2 className="text-xl font-bold mb-6">Sports Information</h2>

                {formData.sports.map((sportEntry, index) => (
                  <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between mb-3">
                      <h3 className="font-semibold">Sport {index + 1}</h3>
                      <button
                        onClick={() => removeSport(index)}
                        className="text-red-500"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <TextField
                        select
                        label="Sport Name"
                        value={sportEntry.sport}
                        onChange={e =>
                          handleInputChange(
                            "sports",
                            "sport",
                            e.target.value,
                            index
                          )
                        }
                        fullWidth
                        size="small"
                      >
                        {Object.keys(sportsConfig).map(sport => (
                          <MenuItem
                            key={sport}
                            value={sport}
                            disabled={selectedSports.includes(sport)}
                          >
                            {sport}
                          </MenuItem>
                        ))}
                      </TextField>

                      <TextField
                        label="No. of Teams"
                        value={sportEntry.teams}
                        onChange={e =>
                          handleInputChange(
                            "sports",
                            "teams",
                            e.target.value,
                            index
                          )
                        }
                        fullWidth
                        size="small"
                      />
                    </div>
                  </div>
                ))}

                <button
                  onClick={addSport}
                  className="px-6 py-2 bg-[#F3A93E] text-white rounded-full"
                >
                  + Add Another Sport
                </button>
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
                <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800">
                  Review Information
                </h2>
            
                {/* CONTACT PERSON INFO */}
                <div className="mb-6 bg-gray-50 p-4 sm:p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    Contact Person Information
                  </h3>
            
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
                    <p><span className="font-semibold">Name:</span> {formData.leader.name}</p>
                    <p><span className="font-semibold">Email:</span> {formData.leader.email}</p>
                    <p><span className="font-semibold">CNIC:</span> {formData.leader.cnic}</p>
                    <p><span className="font-semibold">Phone:</span> {formData.leader.phone}</p>
                    <p> <span className="font-semibold">Team Name:</span> {formData.leader.teamName}</p>
                    <p><span className="font-semibold">Institute:</span> {formData.leader.instituteName}</p>
                  </div>
                </div>
            
                {/* SPORTS INFO */}
                <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    Sports Registration Details
                  </h3>
            
                  <div className="space-y-4">
                    {formData.sports.map((item, index) => {
                      const fee = sportsConfig[item.sport]?.fee || 0;
                      const count = Number(item.teams) || 0;
                      const total = fee * count;
            
                      return (
                        <div
                          key={index}
                          className="flex justify-between items-center border-b pb-2 text-sm sm:text-base"
                        >
                          <div>
                            <p className="font-semibold">{item.sport}</p>
                            <p className="text-gray-600">
                              Teams Registered: {count}
                            </p>
                          </div>
                          <div className="text-right font-semibold text-gray-800">
                            PKR {total.toLocaleString()}
                          </div>
                        </div>
                      );
                    })}
                  </div>
            
                  {/* TOTAL AMOUNT */}
                  <div className="mt-4 pt-4 border-t flex justify-between items-center text-base sm:text-lg font-bold">
                    <span>Total Amount</span>
                    <span className="text-green-600">
                      PKR{" "}
                      {formData.sports
                        .reduce((sum, item) => {
                          const fee = sportsConfig[item.sport]?.fee || 0;
                          const count = Number(item.teams) || 0;
                          return sum + fee * count;
                        }, 0)
                        .toLocaleString()}
                    </span>
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
          
              <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-md space-y-4">
                <p className="text-base sm:text-lg">
                  Please review all the information you've entered. Once you're sure
                  everything is correct, click the <strong>Submit</strong> button below to
                  complete the registration process.</p>
                <p className="text-base sm:text-lg"> 
                  Once registered you'll shortly recieve 
                  a confirmation email, with links to enter team information. 
                </p>
          
                <div className="border-t pt-4 flex justify-between items-center text-base sm:text-lg font-semibold">
                  <span>Total Payable Amount</span>
                  <span className="text-green-600">
                    PKR{" "}
                    {formData.sports
                      .reduce((sum, item) => {
                        const fee = sportsConfig[item.sport]?.fee || 0;
                        const count = Number(item.teams) || 0;
                        return sum + fee * count;
                      }, 0)
                      .toLocaleString()}
                  </span>
                </div>
          
                <p className="text-sm sm:text-base text-gray-600">
                  By submitting this form, you confirm that all the information provided is
                  accurate and complete.
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
          
                <p className="text-gray-600 mb-2">
                  Thank you for your registration. We have received your information.
                </p>
          
                <p className="text-sm text-gray-500">
                  Our team will contact you shortly with further details.
                </p>
              </div>
            </motion.div>
          ) : null}
          </AnimatePresence>
          
          {!complete && (
            <div className="mt-8 flex justify-between">
              {currentStep > 1 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 bg-gray-300 rounded-full text-gray-800 font-semibold hover:bg-gray-400"
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  disabled={isSubmitting}
                >
                  Previous
                </motion.button>
              )}
          
              <motion.button
                whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                className={`px-6 py-2 rounded-full text-white font-semibold min-w-[120px]
                  ${
                    currentStep === steps.length
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-[#F3A93E] hover:bg-[#ef961a]"
                  }
                  ${isSubmitting ? "opacity-75 cursor-not-allowed" : ""}
                `}
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
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
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
      </div>
    </>
  );
};

export default EnhancedMultiStepForm;