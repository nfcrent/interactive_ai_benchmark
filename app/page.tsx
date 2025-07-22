"use client"

import type React from "react"

import { useState, useEffect } from "react"

interface BenchmarkData {
  name: string
  scores: { [model: string]: number }
}

interface ModelConfig {
  name: string
  color: string
  icon: string
  iconBg: string
}

const modelConfigs: { [key: string]: ModelConfig } = {
  "GPT-4 Turbo": { name: "GPT-4 Turbo", color: "#3B82F6", icon: "GPT", iconBg: "#10B981" },
  "Claude-3.5 Sonnet": { name: "Claude-3.5 Sonnet", color: "#6366F1", icon: "C", iconBg: "#F59E0B" },
  "Gemini Ultra": { name: "Gemini Ultra", color: "#8B5CF6", icon: "G", iconBg: "#3B82F6" },
  "LLaMA-3-70B": { name: "LLaMA-3-70B", color: "#A855F7", icon: "L", iconBg: "#3B82F6" },
  "GPT-4": { name: "GPT-4", color: "#F59E0B", icon: "4", iconBg: "#10B981" },
}

const benchmarkData = {
  "Agentic and Competitive Coding": [
    {
      name: "SWE-bench Verified",
      scores: {
        "GPT-4 Turbo": 71.6,
        "Claude-3.5 Sonnet": 65.8,
        "Gemini Ultra": 38.8,
        "LLaMA-3-70B": 34.4,
        "GPT-4": 78.4,
      },
    },
    {
      name: "SWE-bench Multilingual",
      scores: {
        "GPT-4 Turbo": 47.3,
        "Claude-3.5 Sonnet": 25.8,
        "Gemini Ultra": 20.9,
        "LLaMA-3-70B": 31.5,
        "GPT-4": 72.5,
      },
    },
    {
      name: "LiveCodeBench v6",
      scores: {
        "GPT-4 Turbo": 53.7,
        "Claude-3.5 Sonnet": 51.0,
        "Gemini Ultra": 46.9,
        "LLaMA-3-70B": 37.0,
        "GPT-4": 44.7,
      },
    },
    {
      name: "OJBench",
      scores: {
        "GPT-4 Turbo": 27.1,
        "Claude-3.5 Sonnet": 24.0,
        "Gemini Ultra": 11.3,
        "LLaMA-3-70B": 19.5,
        "GPT-4": 19.6,
      },
    },
  ],
  "Tool Use": [
    {
      name: "Tau2-bench weighted average",
      scores: {
        "GPT-4 Turbo": 66.1,
        "Claude-3.5 Sonnet": 48.8,
        "Gemini Ultra": 37.3,
        "LLaMA-3-70B": 54.4,
        "GPT-4": 67.6,
      },
    },
    {
      name: "AceBench(en)",
      scores: {
        "GPT-4 Turbo": 76.5,
        "Claude-3.5 Sonnet": 72.7,
        "Gemini Ultra": 70.5,
        "LLaMA-3-70B": 80.1,
        "GPT-4": 75.6,
      },
    },
  ],
  "Math & STEM": [
    {
      name: "AIME 2025",
      scores: {
        "GPT-4 Turbo": 49.5,
        "Claude-3.5 Sonnet": 46.7,
        "Gemini Ultra": 24.7,
        "LLaMA-3-70B": 37.0,
        "GPT-4": 33.9,
      },
    },
    {
      name: "GPQA-Diamond",
      scores: {
        "GPT-4 Turbo": 75.1,
        "Claude-3.5 Sonnet": 68.4,
        "Gemini Ultra": 62.9,
        "LLaMA-3-70B": 66.3,
        "GPT-4": 74.9,
      },
    },
  ],
}

interface TooltipProps {
  model: string
  score: number
  x: number
  y: number
  visible: boolean
}

function Tooltip({ model, score, x, y, visible }: TooltipProps) {
  if (!visible) return null

  return (
    <div
      className="fixed z-50 bg-gray-900 text-white px-2 py-1 rounded text-sm pointer-events-none border border-gray-700"
      style={{
        left: x - 50,
        top: y - 40,
        transform: "translateX(-50%)",
      }}
    >
      {model}: {score}%
    </div>
  )
}

interface ChartProps {
  benchmark: BenchmarkData
  animated: boolean
}

function Chart({ benchmark, animated }: ChartProps) {
  const [hoveredBar, setHoveredBar] = useState<string | null>(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })

  const maxScore = Math.max(...Object.values(benchmark.scores))
  const models = Object.keys(benchmark.scores)

  const handleMouseEnter = (model: string, event: React.MouseEvent) => {
    setHoveredBar(model)
    setTooltipPos({ x: event.clientX, y: event.clientY })
  }

  const handleMouseMove = (event: React.MouseEvent) => {
    setTooltipPos({ x: event.clientX, y: event.clientY })
  }

  const handleMouseLeave = () => {
    setHoveredBar(null)
  }

  // Function to get shortened model name for mobile
  const getShortName = (model: string) => {
    switch (model) {
      case "GPT-4 Turbo":
        return "GPT-4T"
      case "Claude-3.5 Sonnet":
        return "Claude"
      case "Gemini Ultra":
        return "Gemini"
      case "LLaMA-3-70B":
        return "LLaMA"
      case "GPT-4":
        return "GPT-4"
      default:
        return model
    }
  }

  return (
    <div className="bg-gray-800/50 rounded-lg p-3 sm:p-4 border border-gray-700">
      <h3 className="text-xs sm:text-sm font-medium text-gray-200 mb-3 sm:mb-4 leading-tight">{benchmark.name}</h3>
      <div className="flex items-end justify-center gap-1 sm:gap-2 md:gap-3 h-32 sm:h-40 md:h-48">
        {models.map((model) => {
          const score = benchmark.scores[model]
          // 🔄 REPLACE THIS LINE
          // const height = (score / maxScore) * (window.innerWidth < 640 ? 100 : window.innerWidth < 768 ? 120 : 160)

          // ✅ WITH THIS BLOCK
          const responsiveMax = (() => {
            if (typeof window === "undefined") return 160 // fallback during SSR
            const w = window.innerWidth
            return w < 640 ? 100 : w < 768 ? 120 : 160
          })()
          const height = (score / maxScore) * responsiveMax
          const config = modelConfigs[model]
          const isHovered = hoveredBar === model

          return (
            <div key={model} className="flex flex-col items-center gap-1 sm:gap-2 min-w-0">
              {/* Score label */}
              <div className="text-xs text-gray-300 font-medium whitespace-nowrap">{score}%</div>

              {/* Bar */}
              <div
                className="w-4 sm:w-6 md:w-8 rounded-t transition-all duration-300 cursor-pointer relative"
                style={{
                  height: animated ? `${height}px` : "0px",
                  backgroundColor: config.color,
                  transform: isHovered ? "scale(1.05)" : "scale(1)",
                  filter: isHovered ? "brightness(1.1)" : "brightness(1)",
                }}
                onMouseEnter={(e) => handleMouseEnter(model, e)}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              />

              {/* Model name - responsive text */}
              <div className="text-center min-w-0">
                {/* Mobile: Show short name */}
                <div className="block sm:hidden text-xs text-gray-300 font-medium leading-tight px-1">
                  {getShortName(model)}
                </div>
                {/* Desktop: Show full name */}
                <div className="hidden sm:block text-xs text-gray-300 font-medium leading-tight text-center max-w-16 md:max-w-20">
                  {model}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <Tooltip
        model={hoveredBar || ""}
        score={hoveredBar ? benchmark.scores[hoveredBar] : 0}
        x={tooltipPos.x}
        y={tooltipPos.y}
        visible={!!hoveredBar}
      />
    </div>
  )
}

export default function AIBenchmarkWidget() {
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      {/* Dotted grid background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: "radial-gradient(circle, #64748b 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="relative z-10 p-3 sm:p-4 md:p-6 max-w-7xl mx-auto">
        <div className="space-y-4 sm:space-y-6 md:space-y-8">
          {/* Agentic and Competitive Coding Section */}
          <div className="bg-gray-800/30 rounded-lg border border-gray-700 p-3 sm:p-4 md:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-white mb-4 sm:mb-6">
              Agentic and Competitive Coding
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
              {benchmarkData["Agentic and Competitive Coding"].map((benchmark) => (
                <Chart key={benchmark.name} benchmark={benchmark} animated={animated} />
              ))}
            </div>
          </div>

          {/* Tool Use Section */}
          <div className="bg-gray-800/30 rounded-lg border border-gray-700 p-3 sm:p-4 md:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-white mb-4 sm:mb-6">Tool Use</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
              {benchmarkData["Tool Use"].map((benchmark) => (
                <Chart key={benchmark.name} benchmark={benchmark} animated={animated} />
              ))}
            </div>
          </div>

          {/* Math & STEM Section */}
          <div className="bg-gray-800/30 rounded-lg border border-gray-700 p-3 sm:p-4 md:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-white mb-4 sm:mb-6">Math & STEM</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
              {benchmarkData["Math & STEM"].map((benchmark) => (
                <Chart key={benchmark.name} benchmark={benchmark} animated={animated} />
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 sm:mt-8 text-xs text-gray-500 space-y-1 text-center sm:text-left">
          <p>All models evaluated above are non-thinking models.</p>
          <p>For Tau2-Bench, average is weighted by tasks.</p>
          <p>Interactive AI Benchmark Widget • Embeddable anywhere</p>
        </div>
      </div>
    </div>
  )
}
