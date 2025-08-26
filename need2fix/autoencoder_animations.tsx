import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Zap } from 'lucide-react';

const AutoencoderAnimations = () => {
  const [currentModel, setCurrentModel] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [step, setStep] = useState(0);
  const [speed, setSpeed] = useState(2000);
  const [reconstructionQuality, setReconstructionQuality] = useState(0);

  const models = [
    {
      name: "Basic Autoencoder",
      description: "Simple encoder-decoder architecture for dimensionality reduction",
      steps: [
        { title: "Input Data", description: "High-dimensional input (e.g., 784D image pixels)" },
        { title: "Encoder Forward", description: "Compress input through hidden layers" },
        { title: "Bottleneck", description: "Low-dimensional latent representation (e.g., 32D)" },
        { title: "Decoder Forward", description: "Reconstruct from latent representation" },
        { title: "Reconstruction", description: "Output matches original input dimensions" },
        { title: "Loss Calculation", description: "Compare reconstruction with original input" },
        { title: "Backpropagation", description: "Update weights to minimize reconstruction error" }
      ],
      color: "bg-blue-500",
      accent: "text-blue-500"
    },
    {
      name: "Variational Autoencoder (VAE)",
      description: "Probabilistic autoencoder that learns latent distributions",
      steps: [
        { title: "Input Processing", description: "Input data fed to encoder network" },
        { title: "Mean & Variance", description: "Encoder outputs μ and σ² parameters" },
        { title: "Reparameterization", description: "z = μ + σ × ε (ε ~ N(0,1))" },
        { title: "Sampling", description: "Sample from learned latent distribution" },
        { title: "Decoder Generation", description: "Generate output from sampled latent code" },
        { title: "KL Divergence", description: "Regularize latent space to match prior N(0,1)" },
        { title: "Combined Loss", description: "Reconstruction + KL divergence loss" }
      ],
      color: "bg-purple-500",
      accent: "text-purple-500"
    },
    {
      name: "Denoising Autoencoder",
      description: "Learns to reconstruct clean data from corrupted inputs",
      steps: [
        { title: "Clean Input", description: "Original uncorrupted data" },
        { title: "Add Noise", description: "Artificially corrupt input with noise" },
        { title: "Encoder Process", description: "Encode noisy input to latent space" },
        { title: "Latent Features", description: "Compressed noise-robust representation" },
        { title: "Decoder Process", description: "Reconstruct from latent features" },
        { title: "Clean Output", description: "Network learns to remove noise" },
        { title: "Training", description: "Minimize error between output and clean target" }
      ],
      color: "bg-green-500",
      accent: "text-green-500"
    },
    {
      name: "Convolutional Autoencoder",
      description: "Uses convolutions for spatial data like images",
      steps: [
        { title: "Input Image", description: "2D spatial input (H × W × C)" },
        { title: "Conv Encoder", description: "Convolutional layers with pooling" },
        { title: "Feature Maps", description: "Hierarchical spatial features" },
        { title: "Bottleneck", description: "Compressed spatial representation" },
        { title: "Deconv Decoder", description: "Transpose convolutions (upsampling)" },
        { title: "Spatial Reconstruction", description: "Reconstruct original spatial dimensions" },
        { title: "Pixel Loss", description: "Minimize pixel-wise reconstruction error" }
      ],
      color: "bg-orange-500",
      accent: "text-orange-500"
    },
    {
      name: "Sparse Autoencoder",
      description: "Enforces sparsity in hidden layer activations",
      steps: [
        { title: "Input Layer", description: "Standard input processing" },
        { title: "Hidden Encoding", description: "Overcomplete hidden layer (more neurons)" },
        { title: "Sparsity Constraint", description: "Most neurons should be inactive (near 0)" },
        { title: "Active Neurons", description: "Only few neurons fire for each input" },
        { title: "Reconstruction", description: "Decode from sparse representation" },
        { title: "Sparsity Loss", description: "Penalize too many active neurons" },
        { title: "Combined Training", description: "Reconstruction + sparsity penalty" }
      ],
      color: "bg-red-500",
      accent: "text-red-500"
    },
    {
      name: "β-VAE (Beta-VAE)",
      description: "VAE with adjustable regularization strength",
      steps: [
        { title: "Standard VAE", description: "Basic variational autoencoder setup" },
        { title: "Beta Parameter", description: "β controls KL divergence weighting" },
        { title: "High Beta", description: "β > 1: Strong disentanglement, poor reconstruction" },
        { title: "Low Beta", description: "β < 1: Better reconstruction, less disentangled" },
        { title: "Latent Structure", description: "Different β values create different latent structures" },
        { title: "Disentanglement", description: "Higher β encourages independent latent factors" },
        { title: "Trade-off", description: "Balance between reconstruction and disentanglement" }
      ],
      color: "bg-indigo-500",
      accent: "text-indigo-500"
    }
  ];

  const currentModelData = models[currentModel];

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setStep(prev => {
          if (prev >= currentModelData.steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
        
        setReconstructionQuality(prev => {
          if (step >= 3) {
            return Math.min(100, prev + 15);
          }
          return prev;
        });
      }, speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed, currentModelData.steps.length, step]);

  const handlePlay = () => {
    if (step >= currentModelData.steps.length - 1) {
      setStep(0);
      setReconstructionQuality(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setStep(0);
    setReconstructionQuality(0);
  };

  const nextModel = () => {
    setCurrentModel((prev) => (prev + 1) % models.length);
    handleReset();
  };

  const prevModel = () => {
    setCurrentModel((prev) => (prev - 1 + models.length) % models.length);
    handleReset();
  };

  const renderVisualization = () => {
    const progress = (step + 1) / currentModelData.steps.length;
    
    return (
      <div className="relative w-full h-80 bg-gradient-to-br from-gray-50 to-gray-200 rounded-xl p-6 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-12 grid-rows-8 h-full">
            {Array.from({ length: 96 }).map((_, i) => (
              <div key={i} className="border border-gray-400"></div>
            ))}
          </div>
        </div>

        {currentModel === 0 && (
          <div className="relative h-full flex items-center justify-center">
            <div className="flex flex-col space-y-1">
              <div className="text-xs text-gray-600 mb-1">Input</div>
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={`input-${i}`}
                  className={`w-4 h-4 rounded transition-all duration-1000 ${
                    step >= 0 ? 'bg-blue-400 animate-pulse' : 'bg-gray-300'
                  }`}
                  style={{ transitionDelay: `${i * 50}ms` }}
                />
              ))}
            </div>

            <div className="mx-8 flex flex-col items-center">
              <div className="flex flex-col space-y-1">
                <div className="text-xs text-gray-600 mb-1">Hidden</div>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={`hidden1-${i}`}
                    className={`w-4 h-4 rounded transition-all duration-1000 ${
                      step >= 1 ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'
                    }`}
                    style={{ transitionDelay: `${i * 100}ms` }}
                  />
                ))}
              </div>
            </div>

            <div className="mx-4 flex flex-col items-center">
              <div className="text-xs text-gray-600 mb-1">Latent</div>
              {Array.from({ length: 2 }).map((_, i) => (
                <div
                  key={`latent-${i}`}
                  className={`w-6 h-6 rounded-full transition-all duration-1000 ${
                    step >= 2 ? 'bg-yellow-400 shadow-lg animate-bounce' : 'bg-gray-300'
                  }`}
                  style={{ transitionDelay: `${i * 200}ms` }}
                />
              ))}
            </div>

            <div className="mx-8 flex flex-col items-center">
              <div className="flex flex-col space-y-1">
                <div className="text-xs text-gray-600 mb-1">Hidden</div>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={`hidden2-${i}`}
                    className={`w-4 h-4 rounded transition-all duration-1000 ${
                      step >= 3 ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'
                    }`}
                    style={{ transitionDelay: `${i * 100}ms` }}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col space-y-1">
              <div className="text-xs text-gray-600 mb-1">Output</div>
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={`output-${i}`}
                  className={`w-4 h-4 rounded transition-all duration-1000 ${
                    step >= 4 ? 'bg-green-400' : 'bg-gray-300'
                  }`}
                  style={{ 
                    transitionDelay: `${i * 50}ms`,
                    opacity: step >= 4 ? reconstructionQuality / 100 : 0.3
                  }}
                />
              ))}
            </div>

            {step >= 1 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="flex items-center space-x-16 text-2xl text-blue-400 animate-pulse">
                  <span>→</span>
                  <span>→</span>
                  <span>→</span>
                  <span>→</span>
                </div>
              </div>
            )}
          </div>
        )}

        {currentModel === 1 && (
          <div className="relative h-full flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="text-xs text-gray-600 mb-2">Input</div>
              <div className={`w-16 h-16 rounded-lg transition-all duration-1000 ${
                step >= 0 ? 'bg-purple-300 animate-pulse' : 'bg-gray-300'
              }`} />
            </div>

            <div className="mx-6 flex flex-col items-center">
              <div className="text-xs text-gray-600 mb-2">Encoder</div>
              <div className={`w-12 h-20 rounded transition-all duration-1000 ${
                step >= 1 ? 'bg-purple-400 animate-pulse' : 'bg-gray-300'
              }`} />
            </div>

            <div className="mx-4 flex flex-col items-center space-y-2">
              <div className="text-xs text-gray-600">μ, σ²</div>
              <div className={`w-8 h-8 rounded-full transition-all duration-1000 ${
                step >= 1 ? 'bg-blue-400' : 'bg-gray-300'
              }`}>
                <div className="text-xs text-white text-center leading-8">μ</div>
              </div>
              <div className={`w-8 h-8 rounded-full transition-all duration-1000 ${
                step >= 1 ? 'bg-red-400' : 'bg-gray-300'
              }`}>
                <div className="text-xs text-white text-center leading-8">σ²</div>
              </div>
            </div>

            <div className="mx-4 flex flex-col items-center">
              <div className="text-xs text-gray-600 mb-2">Sample z</div>
              <div className={`w-10 h-10 rounded-full transition-all duration-1000 ${
                step >= 2 ? 'bg-yellow-400 animate-bounce' : 'bg-gray-300'
              }`} />
              {step >= 2 && (
                <div className="text-xs text-gray-500 mt-1">z ~ N(μ,σ²)</div>
              )}
            </div>

            <div className="mx-6 flex flex-col items-center">
              <div className="text-xs text-gray-600 mb-2">Decoder</div>
              <div className={`w-12 h-20 rounded transition-all duration-1000 ${
                step >= 4 ? 'bg-purple-400 animate-pulse' : 'bg-gray-300'
              }`} />
            </div>

            <div className="flex flex-col items-center">
              <div className="text-xs text-gray-600 mb-2">Output</div>
              <div className={`w-16 h-16 rounded-lg transition-all duration-1000 ${
                step >= 4 ? 'bg-green-400' : 'bg-gray-300'
              }`} />
            </div>

            {step >= 5 && (
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-red-100 border-2 border-red-400 rounded-lg p-2 animate-pulse">
                  <div className="text-xs text-red-600 font-semibold">KL Loss</div>
                  <div className="text-xs text-red-500">D_KL(q(z|x) || p(z))</div>
                </div>
              </div>
            )}

            {step >= 5 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-blue-100 border-2 border-blue-400 rounded-lg p-2">
                  <div className="text-xs text-blue-600 font-semibold">Prior: N(0,I)</div>
                </div>
              </div>
            )}
          </div>
        )}

        {currentModel === 2 && (
          <div className="relative h-full flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="text-xs text-gray-600 mb-2">Clean</div>
              <div className="grid grid-cols-4 grid-rows-4 gap-1">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div
                    key={`clean-${i}`}
                    className={`w-3 h-3 rounded transition-all duration-1000 ${
                      step >= 0 ? 'bg-green-400' : 'bg-gray-300'
                    }`}
                    style={{ transitionDelay: `${i * 30}ms` }}
                  />
                ))}
              </div>
            </div>

            <div className="mx-4 flex items-center">
              <div className="text-2xl animate-pulse">+</div>
              <Zap className="w-6 h-6 text-red-500 mx-2" />
            </div>

            <div className="flex flex-col items-center mr-6">
              <div className="text-xs text-gray-600 mb-2">Noisy</div>
              <div className="grid grid-cols-4 grid-rows-4 gap-1">
                {Array.from({ length: 16 }).map((_, i) => {
                  const isCorrupted = i % 3 === 0;
                  return (
                    <div
                      key={`noisy-${i}`}
                      className={`w-3 h-3 rounded transition-all duration-1000 ${
                        step >= 1 ? (isCorrupted ? 'bg-red-400' : 'bg-green-400') : 'bg-gray-300'
                      }`}
                      style={{ transitionDelay: `${i * 30}ms` }}
                    />
                  );
                })}
              </div>
            </div>

            <div className="mx-8 flex items-center space-x-4">
              <div className="flex flex-col items-center">
                <div className="text-xs text-gray-600 mb-1">Encoder</div>
                <div className={`w-8 h-16 rounded transition-all duration-1000 ${
                  step >= 2 ? 'bg-blue-400 animate-pulse' : 'bg-gray-300'
                }`} />
              </div>
              
              <div className="flex flex-col items-center">
                <div className="text-xs text-gray-600 mb-1">Latent</div>
                <div className={`w-6 h-6 rounded-full transition-all duration-1000 ${
                  step >= 3 ? 'bg-yellow-400 animate-bounce' : 'bg-gray-300'
                }`} />
              </div>
              
              <div className="flex flex-col items-center">
                <div className="text-xs text-gray-600 mb-1">Decoder</div>
                <div className={`w-8 h-16 rounded transition-all duration-1000 ${
                  step >= 4 ? 'bg-blue-400 animate-pulse' : 'bg-gray-300'
                }`} />
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="text-xs text-gray-600 mb-2">Reconstructed</div>
              <div className="grid grid-cols-4 grid-rows-4 gap-1">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div
                    key={`output-${i}`}
                    className={`w-3 h-3 rounded transition-all duration-1000 ${
                      step >= 5 ? 'bg-green-400' : 'bg-gray-300'
                    }`}
                    style={{ 
                      transitionDelay: `${i * 30}ms`,
                      opacity: step >= 5 ? reconstructionQuality / 100 : 0.3
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {currentModel === 3 && (
          <div className="relative h-full flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="text-xs text-gray-600 mb-2">Input Image</div>
              <div className="relative">
                <div className={`w-20 h-20 rounded transition-all duration-1000 ${
                  step >= 0 ? 'bg-orange-300' : 'bg-gray-300'
                }`} />
                <div className="absolute inset-0 grid grid-cols-5 grid-rows-5 gap-0.5 p-1">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div
                      key={i}
                      className={`rounded-sm transition-all duration-1000 ${
                        step >= 0 ? 'bg-orange-500' : 'bg-gray-400'
                      }`}
                      style={{ transitionDelay: `${i * 20}ms` }}
                    />
                  ))}
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-1">28×28×3</div>
            </div>

            <div className="mx-4 flex flex-col items-center space-y-2">
              <div className="text-xs text-gray-600">Conv + Pool</div>
              <div className={`w-16 h-16 rounded transition-all duration-1000 ${
                step >= 1 ? 'bg-orange-400 animate-pulse' : 'bg-gray-300'
              }`} />
              <div className="text-xs text-gray-500">14×14×32</div>
              
              <div className={`w-12 h-12 rounded transition-all duration-1000 ${
                step >= 1 ? 'bg-orange-500 animate-pulse' : 'bg-gray-300'
              }`} />
              <div className="text-xs text-gray-500">7×7×64</div>
            </div>

            <div className="mx-4 flex flex-col items-center">
              <div className="text-xs text-gray-600 mb-2">Bottleneck</div>
              <div className={`w-8 h-8 rounded-full transition-all duration-1000 ${
                step >= 2 ? 'bg-yellow-400 animate-bounce' : 'bg-gray-300'
              }`} />
              <div className="text-xs text-gray-500 mt-1">128D</div>
            </div>

            <div className="mx-4 flex flex-col items-center space-y-2">
              <div className="text-xs text-gray-600">Deconv + Upsample</div>
              <div className={`w-12 h-12 rounded transition-all duration-1000 ${
                step >= 3 ? 'bg-orange-500 animate-pulse' : 'bg-gray-300'
              }`} />
              <div className="text-xs text-gray-500">7×7×64</div>
              
              <div className={`w-16 h-16 rounded transition-all duration-1000 ${
                step >= 4 ? 'bg-orange-400 animate-pulse' : 'bg-gray-300'
              }`} />
              <div className="text-xs text-gray-500">14×14×32</div>
            </div>

            <div className="flex flex-col items-center">
              <div className="text-xs text-gray-600 mb-2">Reconstructed</div>
              <div className="relative">
                <div className={`w-20 h-20 rounded transition-all duration-1000 ${
                  step >= 5 ? 'bg-green-300' : 'bg-gray-300'
                }`} />
                <div className="absolute inset-0 grid grid-cols-5 grid-rows-5 gap-0.5 p-1">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div
                      key={i}
                      className={`rounded-sm transition-all duration-1000 ${
                        step >= 5 ? 'bg-green-500' : 'bg-gray-400'
                      }`}
                      style={{ 
                        transitionDelay: `${i * 20}ms`,
                        opacity: step >= 5 ? reconstructionQuality / 100 : 0.3
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-1">28×28×3</div>
            </div>
          </div>
        )}

        {currentModel === 4 && (
          <div className="relative h-full flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="text-xs text-gray-600 mb-2">Input</div>
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={`input-${i}`}
                  className={`w-4 h-4 rounded mb-1 transition-all duration-1000 ${
                    step >= 0 ? 'bg-red-400 animate-pulse' : 'bg-gray-300'
                  }`}
                  style={{ transitionDelay: `${i * 50}ms` }}
                />
              ))}
            </div>

            <div className="mx-6 flex flex-col items-center">
              <div className="text-xs text-gray-600 mb-2">Hidden (Sparse)</div>
              {Array.from({ length: 10 }).map((_, i) => {
                const isActive = i < 3;
                return (
                  <div
                    key={`hidden-${i}`}
                    className={`w-3 h-3 rounded mb-1 transition-all duration-1000 ${
                      step >= 1 ? (isActive ? 'bg-red-500 animate-pulse' : 'bg-gray-200') : 'bg-gray-300'
                    }`}
                    style={{ transitionDelay: `${i * 30}ms` }}
                  />
                );
              })}
              {step >= 2 && (
                <div className="text-xs text-red-600 mt-1">70% inactive</div>
              )}
            </div>

            {step >= 2 && (
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-red-100 border-2 border-red-400 rounded-lg p-2 animate-pulse">
                  <div className="text-xs text-red-600 font-semibold">Sparsity Penalty</div>
                  <div className="text-xs text-red-500">Σ KL(ρ || ρ̂)</div>
                </div>
              </div>
            )}

            <div className="flex flex-col items-center">
              <div className="text-xs text-gray-600 mb-2">Output</div>
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={`output-${i}`}
                  className={`w-4 h-4 rounded mb-1 transition-all duration-1000 ${
                    step >= 4 ? 'bg-green-400' : 'bg-gray-300'
                  }`}
                  style={{ 
                    transitionDelay: `${i * 50}ms`,
                    opacity: step >= 4 ? reconstructionQuality / 100 : 0.3
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {currentModel === 5 && (
          <div className="relative h-full flex items-center justify-center">
            <div className="absolute top-4 left-4">
              <div className="bg-indigo-100 border-2 border-indigo-400 rounded-lg p-3">
                <div className="text-xs text-indigo-600 font-semibold mb-2">β Parameter</div>
                <div className="flex items-center space-x-2">
                  <div className="text-xs">0.1</div>
                  <div className="w-20 h-2 bg-gray-300 rounded">
                    <div 
                      className="h-2 bg-indigo-500 rounded transition-all duration-1000"
                      style={{ width: `${20 + step * 15}%` }}
                    />
                  </div>
                  <div className="text-xs">10</div>
                </div>
                <div className="text-xs text-indigo-500 mt-1">
                  Current: {(0.1 + step * 0.5).toFixed(1)}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-8">
              <div className="flex flex-col items-center">
                <div className="text-xs text-gray-600 mb-2">Input</div>
                <div className={`w-16 h-16 rounded-lg transition-all duration-1000 ${
                  step >= 0 ? 'bg-indigo-300 animate-pulse' : 'bg-gray-300'
                }`} />
              </div>

              <div className="flex flex-col items-center">
                <div className="text-xs text-gray-600 mb-2">Latent Space</div>
                <div className="grid grid-cols-2 grid-rows-2 gap-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={`latent-${i}`}
                      className={`w-6 h-6 rounded-full transition-all duration-1000 ${
                        step >= 2 ? 'bg-yellow-400' : 'bg-gray-300'
                      }`}
                      style={{
                        transform: step >= 4 ? `scale(${1.2 - i * 0.1})` : 'scale(1)',
                        opacity: step >= 4 ? (i < 2 ? 1 : 0.5) : 1
                      }}
                    />
                  ))}
                </div>
                {step >= 4 && (
                  <div className="text-xs text-yellow-600 mt-1">Disentangled</div>
                )}
              </div>

              <div className="flex flex-col items-center">
                <div className="text-xs text-gray-600 mb-2">Output</div>
                <div className={`w-16 h-16 rounded-lg transition-all duration-1000 ${
                  step >= 5 ? 'bg-green-400' : 'bg-gray-300'
                }`} />
              </div>
            </div>

            {step >= 6 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-indigo-100 border-2 border-indigo-400 rounded-lg p-2">
                  <div className="text-xs text-indigo-600 font-semibold">Trade-off</div>
                  <div className="text-xs text-indigo-500">Reconstruction vs Disentanglement</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Autoencoder Animations</h1>
        <p className="text-gray-600">Interactive visualizations of different autoencoder architectures</p>
      </div>

      {/* Model Selector */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={prevModel}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <div className="text-center">
          <h2 className={`text-xl font-semibold ${currentModelData.accent}`}>
            {currentModelData.name}
          </h2>
          <p className="text-sm text-gray-600 mt-1">{currentModelData.description}</p>
        </div>
        
        <button
          onClick={nextModel}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Step {step + 1} of {currentModelData.steps.length}</span>
          <span>{Math.round(((step + 1) / currentModelData.steps.length) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${currentModelData.color}`}
            style={{ width: `${((step + 1) / currentModelData.steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Visualization */}
      {renderVisualization()}

      {/* Controls */}
      <div className="flex items-center justify-center space-x-4 mt-6">
        <button
          onClick={handlePlay}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            isPlaying 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span>{isPlaying ? 'Pause' : 'Play'}</span>
        </button>

        <button
          onClick={handleReset}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </button>

        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-600">Speed:</label>
          <select
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="px-2 py-1 border border-gray-300 rounded text-sm"
          >
            <option value={1000}>Fast</option>
            <option value={2000}>Normal</option>
            <option value={4000}>Slow</option>
          </select>
        </div>
      </div>

      {/* Step Information */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-2">
          {currentModelData.steps[step]?.title}
        </h3>
        <p className="text-gray-600 text-sm">
          {currentModelData.steps[step]?.description}
        </p>
      </div>

      {/* Model Navigation Dots */}
      <div className="flex justify-center space-x-2 mt-6">
        {models.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentModel(index);
              handleReset();
            }}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentModel ? currentModelData.color : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default AutoencoderAnimations; 