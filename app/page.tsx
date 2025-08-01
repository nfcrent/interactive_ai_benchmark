"use client"

import React, { useState, useEffect } from "react"

interface BenchmarkData {
  name: string
  scores: { [model: string]: number }
}

interface ModelConfig {
  name: string
  color: string
  icon: string
  iconBg: string
  image: string
}

const modelConfigs: { [key: string]: ModelConfig } = {
  "GPT-4 Turbo": { name: "GPT-4 Turbo", color: "#3B82F6", icon: "GPT", iconBg: "#10B981", image: "/images/gpt-4 turbo.webp" },
  "Claude-3.5 Sonnet": { name: "Claude-3.5 Sonnet", color: "#6366F1", icon: "C", iconBg: "#F59E0B", image: "/images/claude.webp" },
  "Gemini Ultra": { name: "Gemini Ultra", color: "#8B5CF6", icon: "G", iconBg: "#3B82F6", image: "/images/gemini.png" },
  "LLaMA-3-70B": { name: "LLaMA-3-70B", color: "#A855F7", icon: "L", iconBg: "#3B82F6", image: "/images/llama.png" },
  "Grok": { name: "Grok", color: "#F59E0B", icon: "G", iconBg: "#10B981", image: "/images/grok.png" },
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
        "Grok": 78.4,
      },
    },
    {
      name: "SWE-bench Multilingual",
      scores: {
        "GPT-4 Turbo": 47.3,
        "Claude-3.5 Sonnet": 25.8,
        "Gemini Ultra": 20.9,
        "LLaMA-3-70B": 31.5,
        "Grok": 72.5,
      },
    },
    {
      name: "LiveCodeBench v6",
      scores: {
        "GPT-4 Turbo": 53.7,
        "Claude-3.5 Sonnet": 51.0,
        "Gemini Ultra": 46.9,
        "LLaMA-3-70B": 37.0,
        "Grok": 44.7,
      },
    },
    {
      name: "OJBench",
      scores: {
        "GPT-4 Turbo": 27.1,
        "Claude-3.5 Sonnet": 24.0,
        "Gemini Ultra": 11.3,
        "LLaMA-3-70B": 19.5,
        "Grok": 19.6,
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
        "Grok": 67.6,
      },
    },
    {
      name: "AceBench(en)",
      scores: {
        "GPT-4 Turbo": 76.5,
        "Claude-3.5 Sonnet": 72.7,
        "Gemini Ultra": 70.5,
        "LLaMA-3-70B": 80.1,
        "Grok": 75.6,
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
        "Grok": 33.9,
      },
    },
    {
      name: "GPQA-Diamond",
      scores: {
        "GPT-4 Turbo": 75.1,
        "Claude-3.5 Sonnet": 68.4,
        "Gemini Ultra": 62.9,
        "LLaMA-3-70B": 66.3,
        "Grok": 74.9,
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
      className="fixed z-50 bg-white text-black px-2 py-1 rounded text-sm pointer-events-none border border-gray-200"
      style={{
        left: x - 50,
        top: y - 40,
        transform: "translateX(-50%)",
        fontFamily: "'Urbanist', sans-serif",
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

  const CHART_HEIGHT = 160

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-100">
      <h3 className="text-sm font-medium text-black mb-4 leading-tight">{benchmark.name}</h3>

      {/* Chart area with fixed height */}
      <div className="relative" style={{ height: `${CHART_HEIGHT + 80}px` }}>
        {/* Score labels positioned at top */}
        <div className="absolute top-0 left-0 right-0 flex justify-center gap-4 h-8">
          {models.map((model) => {
            const score = benchmark.scores[model]
            return (
              <div key={`${model}-score`} className="flex-1 text-center max-w-16 flex items-center justify-center">
                <div className="text-xs text-black font-medium">{score}%</div>
              </div>
            )
          })}
        </div>

        {/* Bars positioned with fixed spacing */}
        <div
          className="absolute left-0 right-0 flex justify-center gap-4"
          style={{
            height: `${CHART_HEIGHT}px`,
            top: "32px",
            bottom: "48px",
          }}
        >
          {models.map((model) => {
            const score = benchmark.scores[model]
            const height = (score / maxScore) * CHART_HEIGHT
            const config = modelConfigs[model]
            const isHovered = hoveredBar === model

            return (
              <div
                key={model}
                className="flex-1 flex justify-center max-w-16"
                style={{ height: `${CHART_HEIGHT}px` }}
              >
                <div className="flex items-end">
                  <div
                    className="w-10 rounded-t transition-all duration-300 cursor-pointer"
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
                </div>
              </div>
            )
          })}
        </div>

        {/* Model images positioned at bottom */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-4 h-12">
          {models.map((model) => {
            const config = modelConfigs[model]
            return (
              <div key={`${model}-image`} className="flex-1 text-center max-w-16 flex items-center justify-center">
                <img 
                  src={config.image} 
                  alt={model}
                  className="w-8 h-8 object-contain"
                />
              </div>
            )
          })}
        </div>
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

  // Organize benchmarks in the requested layout
  const topRowBenchmarks = [
    benchmarkData["Agentic and Competitive Coding"][0], // SWE-bench Verified
    benchmarkData["Agentic and Competitive Coding"][1], // SWE-bench Multilingual
    benchmarkData["Agentic and Competitive Coding"][2], // LiveCodeBench v6
  ]

  const middleRowBenchmarks = [
    benchmarkData["Agentic and Competitive Coding"][3], // OJBench
    benchmarkData["Tool Use"][0], // Tau2-bench weighted average
    benchmarkData["Tool Use"][1], // AceBench(en)
  ]

  const bottomRowBenchmarks = [
    benchmarkData["Math & STEM"][0], // AIME 2025
    benchmarkData["Math & STEM"][1], // GPQA-Diamond
  ]

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Urbanist:ital,wght@0,100..900;1,100..900&display=swap');
          * {
            font-family: 'Urbanist', sans-serif;
          }
        `}
      </style>
      <div className="relative overflow-hidden" style={{ fontFamily: "'Urbanist', sans-serif", background: 'transparent', width: '100%', minHeight: 'auto' }}>
        <div className="relative z-10 p-4 max-w-7xl mx-auto">
          <div className="space-y-6">
            {/* Top Row - 3 items */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {topRowBenchmarks.map((benchmark) => (
                <Chart key={benchmark.name} benchmark={benchmark} animated={animated} />
              ))}
            </div>

            {/* Middle Row - 3 items */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {middleRowBenchmarks.map((benchmark) => (
                <Chart key={benchmark.name} benchmark={benchmark} animated={animated} />
              ))}
            </div>

            {/* Bottom Row - 2 items side by side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {bottomRowBenchmarks.map((benchmark) => (
                <Chart key={benchmark.name} benchmark={benchmark} animated={animated} />
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-xs text-black space-y-1 text-center">
            <p>All models evaluated above are non-thinking models.</p>
            <p>For Tau2-Bench, average is weighted by tasks.</p>
            <p>Interactive AI Benchmark Widget • Embeddable anywhere</p>
          </div>
        </div>
      </div>
    </>
  )
}
