'use client'

import { useState, useRef, useEffect } from 'react'

interface TooltipProps {
  content: string
  children: React.ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
  className?: string
}

export default function Tooltip({ 
  content, 
  children, 
  position = 'top',
  delay = 500,
  className = ''
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  const handleMouseEnter = () => {
    setIsVisible(true)
    timeoutRef.current = setTimeout(() => {
      setShowTooltip(true)
    }, delay)
  }

  const handleMouseLeave = () => {
    setIsVisible(false)
    setShowTooltip(false)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const getTooltipClasses = () => {
    const baseClasses = 'absolute z-50 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded-md shadow-lg whitespace-nowrap transition-opacity duration-200'
    
    let positionClasses = ''
    switch (position) {
      case 'top':
        positionClasses = 'bottom-full left-1/2 transform -translate-x-1/2 mb-2'
        break
      case 'bottom':
        positionClasses = 'top-full left-1/2 transform -translate-x-1/2 mt-2'
        break
      case 'left':
        positionClasses = 'right-full top-1/2 transform -translate-y-1/2 mr-2'
        break
      case 'right':
        positionClasses = 'left-full top-1/2 transform -translate-y-1/2 ml-2'
        break
    }

    return `${baseClasses} ${positionClasses} ${showTooltip ? 'opacity-100' : 'opacity-0'}`
  }

  const getArrowClasses = () => {
    const baseClasses = 'absolute border-4 border-transparent'
    
    switch (position) {
      case 'top':
        return `${baseClasses} border-t-gray-900 top-full left-1/2 transform -translate-x-1/2`
      case 'bottom':
        return `${baseClasses} border-b-gray-900 bottom-full left-1/2 transform -translate-x-1/2`
      case 'left':
        return `${baseClasses} border-l-gray-900 left-full top-1/2 transform -translate-y-1/2`
      case 'right':
        return `${baseClasses} border-r-gray-900 right-full top-1/2 transform -translate-y-1/2`
      default:
        return ''
    }
  }

  return (
    <div 
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isVisible && (
        <div 
          ref={tooltipRef}
          className={getTooltipClasses()}
          style={{ pointerEvents: 'none' }}
        >
          {content}
          <div className={getArrowClasses()} />
        </div>
      )}
    </div>
  )
} 