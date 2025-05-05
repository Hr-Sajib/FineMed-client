
"use client";

import Image from "next/image";
import { useState } from "react";
import { FiX } from "react-icons/fi";
import { toast } from "sonner";

const BMICalculatorSection = () => {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBMI] = useState<number | null>(null);
  const [category, setCategory] = useState("");
  const [healthTip, setHealthTip] = useState("");
  const [buttonText, setButtonText] = useState("Calculate BMI");
  const [showResult, setShowResult] = useState(false);

  const calculateBMI = (e: React.FormEvent) => {
    e.preventDefault();

    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);

    if (!heightNum || !weightNum || heightNum <= 0 || weightNum <= 0) {
      toast("❌ Please enter valid height and weight");
      return;
    }

    setButtonText("Calculating...");
    const heightInMeters = heightNum / 100; // Convert cm to m
    const bmiValue = weightNum / (heightInMeters * heightInMeters);
    const roundedBMI = parseFloat(bmiValue.toFixed(1));

    setBMI(roundedBMI);
    setShowResult(false);

    // Determine category and health tip
    if (roundedBMI < 18.5) {
      setCategory("Underweight");
      setHealthTip("Consider consulting a doctor to ensure proper nutrition.");
    } else if (roundedBMI < 25) {
      setCategory("Normal");
      setHealthTip("Maintain a balanced diet and regular exercise.");
    } else if (roundedBMI < 30) {
      setCategory("Overweight");
      setHealthTip("Incorporate more physical activity and a healthy diet.");
    } else {
      setCategory("Obese");
      setHealthTip("Consult a healthcare professional for personalized advice.");
    }

    setTimeout(() => {
      setButtonText("Recalculate");
      setShowResult(true);
    }, 500);
  };

  const clearForm = () => {
    setHeight("");
    setWeight("");
    setBMI(null);
    setCategory("");
    setHealthTip("");
    setButtonText("Calculate BMI");
    setShowResult(false);
  };

  const getCategoryColor = () => {
    switch (category) {
      case "Underweight":
        return "text-blue-500";
      case "Normal":
        return "text-green-500";
      case "Overweight":
        return "text-orange-500";
      case "Obese":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="bg-gray-100 py-10 px-4 flex justify-center gap-10">
    <p className="mt-10 text-5xl w-90">Its cruicial to regularly measure and monitor your BMI and take actions..</p>
      <div
        className="max-w-7xl bg-cover bg-center rounded-xl shadow-xl p-8 relative"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1506126279646-28784a6f3c51?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')", // Health-themed background
        }}
      >
        <div className="bg-white bg-opacity-80 rounded-xl p-6 max-w-lg mx-auto">
          <h2 className="text-3xl font-bold text-teal-700 mb-4 text-center">
            Calculate Your BMI!
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Enter your height and weight to check your Body Mass Index and get health tips.
          </p>
          <form onSubmit={calculateBMI} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative w-full">
                <input
                  type="number"
                  placeholder="Height (cm)"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full px-4 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
                  aria-label="Height in centimeters"
                  min="0"
                  step="0.1"
                  required
                />
                {height && (
                  <button
                    type="button"
                    onClick={() => setHeight("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-teal-600"
                    aria-label="Clear height"
                  >
                    <FiX className="text-xl" />
                  </button>
                )}
              </div>
              <div className="relative w-full">
                <input
                  type="number"
                  placeholder="Weight (kg)"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full px-4 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
                  aria-label="Weight in kilograms"
                  min="0"
                  step="0.1"
                  required
                />
                {weight && (
                  <button
                    type="button"
                    onClick={() => setWeight("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-teal-600"
                    aria-label="Clear weight"
                  >
                    <FiX className="text-xl" />
                  </button>
                )}
              </div>
            </div>
            <div className="flex justify-center gap-4">
              <button
                type="submit"
                className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-full text-lg font-semibold"
                disabled={buttonText === "Calculating..."}
              >
                {buttonText}
              </button>
              {(height || weight) && (
                <button
                  type="button"
                  onClick={clearForm}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-full text-lg font-semibold"
                >
                  Clear
                </button>
              )}
            </div>
          </form>
          {bmi && (
            <div
              className={`mt-6 bg-teal-50 p-4 rounded-lg text-center transition-all duration-500 ease-in-out ${
                showResult ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <h3 className="text-xl font-semibold text-teal-700 mb-2">
                Your BMI: {bmi}
              </h3>
              <p className={`text-lg font-semibold ${getCategoryColor()}`}>
                Category: {category}
              </p>
              <p className="text-gray-600 mt-2">{healthTip}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BMICalculatorSection;
