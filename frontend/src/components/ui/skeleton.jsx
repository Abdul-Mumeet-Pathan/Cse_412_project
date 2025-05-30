import React from 'react'

export const Skeleton = ({ className, ...props }) => (
  <div 
    className={`animate-pulse bg-gray-200 rounded-md ${className}`} 
    {...props}
  />
)

export default Skeleton