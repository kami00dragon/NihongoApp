'use client'

import React from 'react'
import { ToriiGate } from './torii-gate'

interface ToriiGateWrapperProps {
  children: React.ReactNode
  className?: string
  color?: string
  pillarHeight?: 'sm' | 'md' | 'lg'
}

export function ToriiGateWrapper({
  children,
  className = '',
  color = '#BC002D',
  pillarHeight = 'md'
}: ToriiGateWrapperProps) {
  const heightSizes = {
    sm: 'h-24',
    md: 'h-32',
    lg: 'h-40'
  }

  return (
    <div className={`relative ${heightSizes[pillarHeight]} ${className}`}>
      {/* Left Torii Pillar */}
      <div className="absolute left-0 top-0 bottom-0 w-3">
        <svg
          width="12"
          height="100%"
          viewBox="0 0 12 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="2" y="0" width="8" height="100" fill={color} rx="1" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 h-full flex items-center">
        {children}
      </div>

      {/* Right Torii Pillar */}
      <div className="absolute right-0 top-0 bottom-0 w-3">
        <svg
          width="12"
          height="100%"
          viewBox="0 0 12 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="2" y="0" width="8" height="100" fill={color} rx="1" />
        </svg>
      </div>
    </div>
  )
}

export default ToriiGateWrapper
