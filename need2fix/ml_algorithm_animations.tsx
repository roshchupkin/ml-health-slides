import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';

interface Step {
  title: string;
  description: string;
}

interface Algorithm {
  name: string;
  description: string;
  steps: Step[];
  color: string;
}

const MLAlgorithmAnimations: React.FC = () => {
  const [currentAlgorithm, setCurrentAlgorithm] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [step, setStep] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(1500);

  const algorithms: Algorithm[] = [
    {
      name: "Linear Regression",
      description: "Finding the best line through data points",
      steps: [
        { title: "Initialize", description: "Random line with slope and intercept" },
        { title: "Calculate Error", description: "Measure distance from points to line" },
        { title: "Update Parameters", description: "Adjust slope and intercept to reduce error" },
        { title: "Repeat", description: "Continue until convergence" },
        { title: "Final Model", description: "Optimal line that best fits the data" }
      ],
      color: "bg-blue-500"
    },
    {
      name: "K-Means Clustering",
      description: "Grouping data points into clusters",
      steps: [
        { title: "Initialize Centroids", description: "Place K random cluster centers" },
        { title: "Assign Points", description: "Each point joins nearest centroid" },
        { title: "Update Centroids", description: "Move centroids to cluster center" },
        { title: "Check Convergence", description: "Repeat until centroids stop moving" },
        { title: "Final Clusters", description: "Data grouped into K distinct clusters" }
      ],
      color: "bg-green-500"
    },
    {
      name: "Decision Tree",
      description: "Building a tree of decision rules",
      steps: [
        { title: "Root Node", description: "Start with all training data" },
        { title: "Find Best Split", description: "Choose feature that best separates classes" },
        { title: "Create Branches", description: "Split data based on chosen feature" },
        { title: "Recurse", description: "Repeat process for each branch" },
        { title: "Leaf Nodes", description: "Terminal nodes with class predictions" }
      ],
      color: "bg-purple-500"
    },
    {
      name: "Neural Network",
      description: "Learning through connected layers of neurons",
      steps: [
        { title: "Forward Pass", description: "Data flows through network layers" },
        { title: "Calculate Loss", description: "Compare output with true labels" },
        { title: "Backpropagation", description: "Calculate gradients for each weight" },
        { title: "Update Weights", description: "Adjust weights using gradients" },
        { title: "Repeat", description: "Continue training until convergence" }
      ],
      color: "bg-red-500"
    },
    {
      name: "Random Forest",
      description: "Combining multiple decision trees",
      steps: [
        { title: "Bootstrap Sample", description: "Create random subsets of training data" },
        { title: "Build Trees", description: "Train decision tree on each subset" },
        { title: "Random Features", description: "Each tree uses random feature subset" },
        { title: "Combine Predictions", description: "Average predictions from all trees" },
        { title: "Final Prediction", description: "Robust ensemble prediction" }
      ],
      color: "bg-orange-500"
    },
    {
      name: "Gradient Descent",
      description: "Optimization algorithm for finding minimum",
      steps: [
        { title: "Initialize", description: "Start at random point on loss surface" },
        { title: "Calculate Gradient", description: "Find direction of steepest ascent" },
        { title: "Take Step", description: "Move in opposite direction (descent)" },
        { title: "Update Position", description: "New position = old - learning_rate × gradient" },
        { title: "Converge", description: "Reach minimum of loss function" }
      ],
      color: "bg-indigo-500"
    }
  ];

  const currentAlg = algorithms[currentAlgorithm];

  // Reset step when algorithm changes
  useEffect(() => {
    setStep(0);
    setIsPlaying(false);
  }, [currentAlgorithm]);

  // Animation timer effect
  useEffect(() => {
    let interval: number | null = null;
    
    if (isPlaying && currentAlg && step < currentAlg.steps.length - 1) {
      interval = window.setInterval(() => {
        setStep(prev => {
          if (prev >= currentAlg.steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    }

    return () => {
      if (interval) {
        window.clearInterval(interval);
      }
    };
  }, [isPlaying, speed, currentAlg, step]);

  const handlePlay = useCallback(() => {
    if (step >= currentAlg.steps.length - 1) {
      setStep(0);
    }
    setIsPlaying(!isPlaying);
  }, [step, currentAlg.steps.length, isPlaying]);

  const handleReset = useCallback(() => {
    setIsPlaying(false);
    setStep(0);
  }, []);

  const nextAlgorithm = useCallback(() => {
    setCurrentAlgorithm((prev) => (prev + 1) % algorithms.length);
  }, [algorithms.length]);

  const prevAlgorithm = useCallback(() => {
    setCurrentAlgorithm((prev) => (prev - 1 + algorithms.length) % algorithms.length);
  }, [algorithms.length]);

  const handleStepClick = useCallback((stepIndex: number) => {
    setStep(stepIndex);
    setIsPlaying(false);
  }, []);

  const handleAlgorithmSelect = useCallback((algorithmIndex: number) => {
    setCurrentAlgorithm(algorithmIndex);
  }, []);

  const renderVisualization = () => {
    if (!currentAlg) return null;
    
    const progress = (step + 1) / currentAlg.steps.length;
    
    return (
      <div className="relative w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-6 overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-8 grid-rows-6 h-full">
            {[...Array(48)].map((_, i) => (
              <div key={i} className="border border-gray-400"></div>
            ))}
          </div>
        </div>

        {/* Algorithm-specific visualization */}
        {currentAlgorithm === 0 && ( // Linear Regression
          <div className="relative h-full">
            {/* Data points */}
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 bg-blue-600 rounded-full transition-all duration-1000"
                style={{
                  left: `${15 + i * 10}%`,
                  top: `${80 - (i * 8 + Math.sin(i) * 10)}%`,
                  transform: step >= 1 ? 'scale(1.2)' : 'scale(1)',
                }}
              />
            ))}
            {/* Regression line */}
            <div
              className="absolute h-0.5 bg-red-500 transition-all duration-1000 origin-left"
              style={{
                left: '15%',
                top: `${75 - step * 5}%`,
                width: '70%',
                transform: `rotate(${-10 + step * 3}deg)`,
                opacity: step >= 0 ? 1 : 0,
              }}
            />
          </div>
        )}

        {currentAlgorithm === 1 && ( // K-Means
          <div className="relative h-full">
            {/* Centroids */}
            {[...Array(3)].map((_, i) => (
              <div
                key={`centroid-${i}`}
                className={`absolute w-6 h-6 rounded-full transition-all duration-1000 ${
                  i === 0 ? 'bg-red-500' : i === 1 ? 'bg-blue-500' : 'bg-green-500'
                }`}
                style={{
                  left: `${25 + i * 25 + (step >= 2 ? Math.sin(step + i) * 5 : 0)}%`,
                  top: `${30 + (step >= 2 ? Math.cos(step + i) * 5 : 0)}%`,
                  transform: step >= 0 ? 'scale(1)' : 'scale(0)',
                }}
              />
            ))}
            {/* Data points */}
            {[...Array(12)].map((_, i) => {
              const cluster = Math.floor(i / 4);
              const colors = ['bg-red-300', 'bg-blue-300', 'bg-green-300'];
              return (
                <div
                  key={`point-${i}`}
                  className={`absolute w-3 h-3 rounded-full transition-all duration-1000 ${
                    step >= 1 ? colors[cluster] : 'bg-gray-400'
                  }`}
                  style={{
                    left: `${20 + (i % 4) * 15 + cluster * 20}%`,
                    top: `${50 + Math.sin(i) * 20}%`,
                    transform: step >= 1 ? 'scale(1)' : 'scale(0.8)',
                  }}
                />
              );
            })}
          </div>
        )}

        {currentAlgorithm === 2 && ( // Decision Tree
          <div className="relative h-full">
            {/* Tree structure */}
            <div className="flex flex-col items-center h-full pt-4">
              {/* Root */}
              <div
                className={`w-16 h-8 bg-purple-500 rounded transition-all duration-1000 flex items-center justify-center text-xs text-white ${
                  step >= 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                }`}
              >
                Root
              </div>
              
              {/* Level 1 */}
              <div className="flex justify-center space-x-12 mt-4">
                {[...Array(2)].map((_, i) => (
                  <div
                    key={`level1-${i}`}
                    className={`w-14 h-7 bg-purple-400 rounded transition-all duration-1000 flex items-center justify-center text-xs text-white ${
                      step >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                    }`}
                    style={{ transitionDelay: `${i * 200}ms` }}
                  >
                    {i === 0 ? 'Left' : 'Right'}
                  </div>
                ))}
              </div>
              
              {/* Level 2 (Leaves) */}
              <div className="flex justify-center space-x-6 mt-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={`leaf-${i}`}
                    className={`w-12 h-6 bg-purple-300 rounded transition-all duration-1000 flex items-center justify-center text-xs text-white ${
                      step >= 4 ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                    }`}
                    style={{ transitionDelay: `${i * 150}ms` }}
                  >
                    Leaf
                  </div>
                ))}
              </div>
              
              {/* Connecting lines */}
              <svg className="absolute inset-0 pointer-events-none">
                <g stroke="currentColor" strokeWidth="2" fill="none" className="text-purple-400">
                  {step >= 1 && (
                    <>
                      <line x1="50%" y1="20%" x2="35%" y2="35%" className="animate-pulse" />
                      <line x1="50%" y1="20%" x2="65%" y2="35%" className="animate-pulse" />
                    </>
                  )}
                  {step >= 3 && (
                    <>
                      <line x1="35%" y1="40%" x2="25%" y2="55%" className="animate-pulse" />
                      <line x1="35%" y1="40%" x2="45%" y2="55%" className="animate-pulse" />
                      <line x1="65%" y1="40%" x2="55%" y2="55%" className="animate-pulse" />
                      <line x1="65%" y1="40%" x2="75%" y2="55%" className="animate-pulse" />
                    </>
                  )}
                </g>
              </svg>
            </div>
          </div>
        )}

        {currentAlgorithm === 3 && ( // Neural Network
          <div className="relative h-full">
            {/* Input layer */}
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={`input-${i}`}
                  className={`w-8 h-8 bg-gray-400 rounded-full transition-all duration-1000 ${
                    step >= 0 && isPlaying ? 'bg-blue-400 animate-pulse' : ''
                  }`}
                />
              ))}
            </div>
            
            {/* Hidden layer */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 space-y-3">
              {[...Array(4)].map((_, i) => (
                <div
                  key={`hidden-${i}`}
                  className={`w-7 h-7 bg-gray-400 rounded-full transition-all duration-1000 ${
                    step >= 1 && isPlaying ? 'bg-purple-400 animate-pulse' : ''
                  }`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                />
              ))}
            </div>
            
            {/* Output layer */}
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 space-y-6">
              {[...Array(2)].map((_, i) => (
                <div
                  key={`output-${i}`}
                  className={`w-8 h-8 bg-gray-400 rounded-full transition-all duration-1000 ${
                    step >= 2 && isPlaying ? 'bg-red-400 animate-pulse' : ''
                  }`}
                  style={{ transitionDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
            
            {/* Connections */}
            <svg className="absolute inset-0 pointer-events-none">
              <g stroke="currentColor" strokeWidth="1" fill="none" className="text-gray-300">
                {/* Input to hidden */}
                {[...Array(3)].map((_, i) =>
                  [...Array(4)].map((_, j) => (
                    <line
                      key={`ih-${i}-${j}`}
                      x1="15%"
                      y1={`${35 + i * 15}%`}
                      x2="48%"
                      y2={`${30 + j * 12}%`}
                      className={step >= 0 && isPlaying ? 'text-blue-400' : ''}
                      strokeOpacity={step >= 0 ? 0.6 : 0.2}
                    />
                  ))
                )}
                
                {/* Hidden to output */}
                {[...Array(4)].map((_, i) =>
                  [...Array(2)].map((_, j) => (
                    <line
                      key={`ho-${i}-${j}`}
                      x1="52%"
                      y1={`${30 + i * 12}%`}
                      x2="85%"
                      y2={`${40 + j * 20}%`}
                      className={step >= 1 && isPlaying ? 'text-purple-400' : ''}
                      strokeOpacity={step >= 1 ? 0.6 : 0.2}
                    />
                  ))
                )}
              </g>
            </svg>
          </div>
        )}

        {currentAlgorithm === 4 && ( // Random Forest
          <div className="relative h-full p-4">
            {/* Multiple trees */}
            {[...Array(3)].map((_, treeIndex) => (
              <div
                key={`tree-${treeIndex}`}
                className={`absolute transition-all duration-1000 ${
                  step >= treeIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                }`}
                style={{
                  left: `${20 + treeIndex * 25}%`,
                  top: '20%',
                  transitionDelay: `${treeIndex * 300}ms`
                }}
              >
                {/* Tree root */}
                <div className="w-8 h-6 bg-orange-500 rounded mb-2" />
                {/* Tree branches */}
                <div className="flex space-x-2">
                  <div className="w-6 h-4 bg-orange-400 rounded" />
                  <div className="w-6 h-4 bg-orange-400 rounded" />
                </div>
              </div>
            ))}
            
            {/* Voting/averaging visualization */}
            {step >= 3 && (
              <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold animate-bounce">
                    ∑
                  </div>
                  <div className="text-xs mt-1 font-semibold text-gray-700">Vote</div>
                </div>
              </div>
            )}
            
            {/* Arrows showing flow */}
            {step >= 4 && (
              <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2">
                <div className="flex items-center space-x-2 animate-pulse">
                  <div className="text-2xl">→</div>
                  <div className="text-2xl">→</div>
                </div>
              </div>
            )}
          </div>
        )}

        {currentAlgorithm === 5 && ( // Gradient Descent
          <div className="relative h-full">
            {/* Loss landscape */}
            <svg className="absolute inset-0" viewBox="0 0 100 60">
              <path
                d="M 10 50 Q 30 20 50 30 Q 70 40 90 25"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className="text-indigo-400"
              />
            </svg>
            
            {/* Current position */}
            <div
              className="absolute w-4 h-4 bg-indigo-600 rounded-full transition-all duration-1000"
              style={{
                left: `${15 + step * 15}%`,
                top: `${85 - step * 12}%`,
                transform: isPlaying ? 'scale(1.3)' : 'scale(1)',
              }}
            />
            
            {/* Gradient arrow */}
            {step > 0 && (
              <div
                className="absolute text-2xl text-indigo-500 transition-all duration-500"
                style={{
                  left: `${18 + (step - 1) * 15}%`,
                  top: `${82 - (step - 1) * 12}%`,
                }}
              >
                ↘
              </div>
            )}
            
            {/* Global minimum indicator */}
            {step >= 4 && (
              <div className="absolute bottom-8 right-1/4 text-center">
                <div className="w-4 h-4 bg-yellow-400 rounded-full animate-pulse" />
                <div className="text-xs mt-1 font-semibold text-gray-700">Min</div>
              </div>
            )}
          </div>
        )}

        {/* Progress bar */}
        <div className="absolute bottom-2 left-2 right-2">
          <div className="w-full bg-gray-300 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${currentAlg.color}`}
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>
      </div>
    );
  };

  if (!currentAlg) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-xl">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          ML Algorithm Animations
        </h1>
        <p className="text-gray-600">
          Interactive visualizations of machine learning algorithms
        </p>
      </div>

      {/* Algorithm selector */}
      <div className="flex items-center justify-center space-x-4 mb-6">
        <button
          onClick={prevAlgorithm}
          className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full transition-colors"
          aria-label="Previous algorithm"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <div className="text-center min-w-64">
          <h2 className="text-xl font-bold text-gray-800">{currentAlg.name}</h2>
          <p className="text-sm text-gray-600">{currentAlg.description}</p>
        </div>
        
        <button
          onClick={nextAlgorithm}
          className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full transition-colors"
          aria-label="Next algorithm"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Main visualization */}
      {renderVisualization()}

      {/* Current step info */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-800">
            Step {step + 1}: {currentAlg.steps[step]?.title || 'Unknown Step'}
          </h3>
          <span className="text-sm text-gray-500">
            {step + 1} of {currentAlg.steps.length}
          </span>
        </div>
        <p className="text-gray-600 text-sm">
          {currentAlg.steps[step]?.description || 'No description available'}
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-4 mt-6">
        <button
          onClick={handlePlay}
          className={`flex items-center space-x-2 px-6 py-2 rounded-lg text-white transition-colors ${
            currentAlg.color
          } hover:opacity-90`}
          aria-label={isPlaying ? 'Pause animation' : 'Play animation'}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span>{isPlaying ? 'Pause' : 'Play'}</span>
        </button>
        
        <button
          onClick={handleReset}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
          aria-label="Reset animation"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </button>
        
        <div className="flex items-center space-x-2">
          <label htmlFor="speed-select" className="text-sm text-gray-600">Speed:</label>
          <select
            id="speed-select"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="px-3 py-1 border rounded text-sm"
            aria-label="Animation speed"
          >
            <option value={2500}>Slow</option>
            <option value={1500}>Normal</option>
            <option value={800}>Fast</option>
          </select>
        </div>
      </div>

      {/* Algorithm thumbnails */}
      <div className="mt-8 grid grid-cols-3 md:grid-cols-6 gap-2">
        {algorithms.map((alg, index) => (
          <button
            key={alg.name}
            onClick={() => handleAlgorithmSelect(index)}
            className={`p-3 rounded-lg text-xs text-center transition-all ${
              index === currentAlgorithm
                ? `${alg.color} text-white shadow-lg scale-105`
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            aria-label={`Select ${alg.name} algorithm`}
            aria-pressed={index === currentAlgorithm}
          >
            <div className="font-semibold">{alg.name}</div>
          </button>
        ))}
      </div>

      {/* Step timeline */}
      <div className="mt-6">
        <div className="flex justify-between items-center">
          {currentAlg.steps.map((stepInfo, index) => (
            <div
              key={index}
              className="flex flex-col items-center cursor-pointer"
              onClick={() => handleStepClick(index)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleStepClick(index);
                }
              }}
              aria-label={`Go to step ${index + 1}: ${stepInfo.title}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  index <= step
                    ? `${currentAlg.color} text-white shadow-lg`
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {index + 1}
              </div>
              <div className="text-xs text-gray-600 mt-1 text-center max-w-16">
                {stepInfo.title}
              </div>
            </div>
          ))}
        </div>
        
        {/* Timeline connector */}
        <div className="relative mt-2">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gray-200" style={{ top: '-28px' }} />
          <div
            className={`absolute top-0 left-0 h-0.5 transition-all duration-1000 ${currentAlg.color}`}
            style={{
              width: `${(step / (currentAlg.steps.length - 1)) * 100}%`,
              top: '-28px'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default MLAlgorithmAnimations;