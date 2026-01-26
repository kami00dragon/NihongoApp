'use client'

import React from 'react'

interface ToriiGateProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  color?: string
  showPillars?: boolean
}

export function ToriiGate({ className = '', size = 'md', color = '#BC002D', showPillars = true }: ToriiGateProps) {
  const sizes = {
    sm: { width: 60, height: 45 },
    md: { width: 80, height: 55 },
    lg: { width: 120, height: 85 }
  }

  const { width, height } = sizes[size]
  const strokeWidth = size === 'sm' ? 1.5 : size === 'md' ? 2 : 2.5
  const pillarWidth = size === 'sm' ? 6 : size === 'md' ? 7 : 8

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 100 75"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Pilares rojos */}
      {showPillars && (
        <>
          <rect x="6" y="8" width={pillarWidth} height="62" fill={color} rx="1" />
          <rect x={100 - pillarWidth - 6} y="8" width={pillarWidth} height="62" fill={color} rx="1" />
        </>
      )}

      {/* Viga inferior (nuki) - más delgada y curvada hacia arriba en las puntas */}
      <path
        d="M8 32 Q50 24 92 32 L94 28 Q50 20 6 28 Z"
        fill={color}
      />

      {/* Viga superior principal (kasagi) - más delgada con curvas pronunciadas hacia arriba */}
      <path
        d="M0 14 Q50 -8 100 14 L100 18 Q50 -4 0 18 Z"
        fill={color}
      />

      {/* Viga superior secundaria (shimaki) - línea fina decorativa */}
      <rect x="10" y="18" width="80" height={strokeWidth} fill={color} rx="0.5" />

      {/* Decoración de apoyo (gakuzuka) */}
      {showPillars && (
        <>
          <rect x="5" y="26" width="3" height="8" fill="#960023" rx="0.5" />
          <rect x="92" y="26" width="3" height="8" fill="#960023" rx="0.5" />
        </>
      )}
    </svg>
  )
}

export default ToriiGate
