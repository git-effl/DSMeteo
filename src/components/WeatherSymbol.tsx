import React from 'react';
import { WeatherCondition } from '../types/weather';

interface WeatherSymbolProps {
  condition: WeatherCondition;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export const WeatherSymbol: React.FC<WeatherSymbolProps> = ({
  condition,
  size = 'lg',
  animated = true,
}) => {
  const pixelDimensions = {
    sm: { width: 36, height: 36 },
    md: { width: 64, height: 64 },
    lg: { width: 110, height: 110 },
  }[size];

  const category = condition.category;

  return (
    <div
      className="relative flex items-center justify-center select-none"
      style={{
        width: pixelDimensions.width,
        height: pixelDimensions.height,
      }}
    >
      {category === 'sunny' && (
        <svg
          viewBox="0 0 64 64"
          className={`w-full h-full drop-shadow-[0_2px_4px_rgba(234,179,8,0.35)] ${
            animated ? 'animate-[spin_24s_linear_infinite]' : ''
          }`}
          shapeRendering="crispEdges"
        >
          {/* Outer Sun Rays */}
          <g fill="#F59E0B">
            <rect x="30" y="2" width="4" height="8" />
            <rect x="30" y="54" width="4" height="8" />
            <rect x="2" y="30" width="8" height="4" />
            <rect x="54" y="30" width="8" height="4" />
            {/* Diagonal Rays */}
            <rect x="10" y="10" width="6" height="4" />
            <rect x="48" y="10" width="6" height="4" />
            <rect x="10" y="50" width="6" height="4" />
            <rect x="48" y="50" width="6" height="4" />
          </g>
          {/* Inner Golden Border */}
          <rect x="18" y="18" width="28" height="28" rx="6" fill="#D97706" />
          {/* Sun Core Bright Yellow */}
          <rect x="20" y="20" width="24" height="24" rx="4" fill="#FBBF24" />
          {/* Highlight Accent */}
          <rect x="22" y="22" width="6" height="4" fill="#FEF08A" />
          <rect x="22" y="26" width="4" height="4" fill="#FEF08A" />
          {/* Retro DS Cute Pixel Face */}
          <rect x="26" y="29" width="3" height="3" fill="#78350F" />
          <rect x="35" y="29" width="3" height="3" fill="#78350F" />
          <path d="M 28 35 Q 32 38 36 35" stroke="#78350F" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      )}

      {category === 'cloudy' && (
        <svg
          viewBox="0 0 64 64"
          className={`w-full h-full drop-shadow-[0_2px_4px_rgba(100,116,139,0.3)] ${
            animated ? 'animate-pulse duration-1000' : ''
          }`}
          shapeRendering="crispEdges"
        >
          {/* Background Cloud Shade */}
          <path
            d="M 22 24 H 38 V 16 H 48 V 26 H 56 V 38 H 14 V 30 H 22 Z"
            fill="#94A3B8"
          />
          {/* Front Pixel Cloud */}
          <g fill="#E2E8F0">
            {/* Top bumps */}
            <rect x="24" y="20" width="16" height="8" />
            <rect x="36" y="16" width="14" height="12" />
            {/* Main body */}
            <rect x="12" y="28" width="42" height="18" rx="2" />
            <rect x="8" y="32" width="8" height="12" rx="2" />
          </g>
          {/* Crisp highlight edge */}
          <g fill="#FFFFFF">
            <rect x="26" y="20" width="12" height="3" />
            <rect x="38" y="16" width="10" height="3" />
            <rect x="10" y="32" width="4" height="2" />
          </g>
          {/* Subtle bottom shadow */}
          <rect x="12" y="44" width="40" height="3" fill="#CBD5E1" />
        </svg>
      )}

      {category === 'rain' && (
        <div className="relative w-full h-full flex flex-col items-center justify-center">
          <svg
            viewBox="0 0 64 64"
            className="w-full h-full"
            shapeRendering="crispEdges"
          >
            {/* Dark Rain Cloud */}
            <g fill="#64748B">
              <rect x="22" y="14" width="16" height="8" />
              <rect x="34" y="10" width="16" height="12" />
              <rect x="10" y="22" width="44" height="18" rx="2" />
              <rect x="6" y="26" width="8" height="12" rx="2" />
            </g>
            <g fill="#94A3B8">
              <rect x="24" y="14" width="12" height="3" />
              <rect x="36" y="10" width="12" height="3" />
            </g>
            {/* Animated Raindrops */}
            <g fill="#38BDF8">
              <rect x="14" y="44" width="3" height="7" className={animated ? 'animate-[bounce_0.8s_infinite]' : ''} />
              <rect x="24" y="48" width="3" height="7" className={animated ? 'animate-[bounce_0.9s_infinite_100ms]' : ''} />
              <rect x="34" y="45" width="3" height="7" className={animated ? 'animate-[bounce_0.75s_infinite_200ms]' : ''} />
              <rect x="44" y="49" width="3" height="7" className={animated ? 'animate-[bounce_0.85s_infinite_150ms]' : ''} />
            </g>
          </svg>
        </div>
      )}

      {category === 'thunder' && (
        <svg
          viewBox="0 0 64 64"
          className="w-full h-full"
          shapeRendering="crispEdges"
        >
          {/* Dark Storm Cloud */}
          <g fill="#334155">
            <rect x="20" y="10" width="16" height="8" />
            <rect x="32" y="6" width="18" height="12" />
            <rect x="8" y="18" width="48" height="20" rx="2" />
          </g>
          <g fill="#64748B">
            <rect x="22" y="10" width="12" height="3" />
            <rect x="34" y="6" width="14" height="3" />
          </g>
          {/* Pixel Lightning Bolt */}
          <polygon
            points="32,28 22,42 30,42 24,58 42,38 34,38 40,28"
            fill="#FACC15"
            stroke="#EAB308"
            strokeWidth="1"
            className={animated ? 'animate-pulse' : ''}
          />
        </svg>
      )}

      {category === 'snow' && (
        <svg
          viewBox="0 0 64 64"
          className="w-full h-full"
          shapeRendering="crispEdges"
        >
          {/* Frosty Cloud */}
          <g fill="#93C5FD">
            <rect x="20" y="12" width="16" height="8" />
            <rect x="32" y="8" width="16" height="12" />
            <rect x="10" y="20" width="44" height="18" rx="2" />
          </g>
          <rect x="22" y="12" width="12" height="3" fill="#DBEAFE" />
          <rect x="34" y="8" width="12" height="3" fill="#FFFFFF" />
          {/* Falling Pixel Snowflakes */}
          <g fill="#FFFFFF" className={animated ? 'animate-[spin_10s_linear_infinite]' : ''}>
            <rect x="16" y="44" width="4" height="4" />
            <rect x="28" y="48" width="4" height="4" />
            <rect x="40" y="43" width="4" height="4" />
            <rect x="22" y="54" width="3" height="3" />
            <rect x="36" y="55" width="3" height="3" />
          </g>
        </svg>
      )}

      {category === 'fog' && (
        <svg
          viewBox="0 0 64 64"
          className={`w-full h-full ${animated ? 'animate-pulse' : ''}`}
          shapeRendering="crispEdges"
        >
          {/* Fog Horizontal Ribbons */}
          <rect x="10" y="18" width="44" height="5" rx="2" fill="#94A3B8" />
          <rect x="6" y="27" width="52" height="5" rx="2" fill="#CBD5E1" />
          <rect x="14" y="36" width="38" height="5" rx="2" fill="#E2E8F0" />
          <rect x="8" y="45" width="48" height="5" rx="2" fill="#94A3B8" />
        </svg>
      )}

      {category === 'night' && (
        <svg
          viewBox="0 0 64 64"
          className="w-full h-full drop-shadow-[0_2px_4px_rgba(99,102,241,0.35)]"
          shapeRendering="crispEdges"
        >
          {/* Pixel Crescent Moon */}
          <path
            d="M 36 12 C 22 12 14 24 14 36 C 14 48 24 54 36 54 C 28 48 24 38 24 32 C 24 24 30 16 36 12 Z"
            fill="#FDE047"
          />
          {/* Pixel Stars */}
          <g fill="#FEF08A" className={animated ? 'animate-pulse' : ''}>
            <rect x="42" y="16" width="3" height="3" />
            <rect x="50" y="24" width="4" height="4" />
            <rect x="44" y="38" width="3" height="3" />
            <rect x="12" y="16" width="2" height="2" />
          </g>
        </svg>
      )}
    </div>
  );
};
