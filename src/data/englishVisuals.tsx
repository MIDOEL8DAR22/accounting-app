import type { ReactElement } from 'react'
import type { VocabTerm } from './accountingEnglish'

type SceneKey =
  | 'money' | 'chartUp' | 'chartDown' | 'bank' | 'doc' | 'book' | 'box' | 'building'
  | 'clock' | 'phone' | 'bulb' | 'truck' | 'plane' | 'shield' | 'handshake' | 'star'
  | 'gear' | 'cycle' | 'scale' | 'calendar' | 'megaphone' | 'cup' | 'drop' | 'gift'
  | 'sparkle' | 'home' | 'car' | 'land'

const S = '#334155'
const GOLD = '#f59e0b'
const BLUE = '#0ea5e9'
const GREEN = '#10b981'
const RED = '#f43f5e'
const PURPLE = '#8b5cf6'

const SCENE: Record<number, SceneKey> = {
  1: 'doc', 2: 'doc', 3: 'money', 4: 'chartDown', 5: 'chartUp', 6: 'doc', 7: 'box',
  8: 'box', 9: 'box', 10: 'doc', 11: 'book', 12: 'book', 13: 'book', 14: 'book',
  15: 'book', 16: 'chartUp', 17: 'chartUp', 18: 'scale', 19: 'doc', 20: 'bank',
  21: 'chartUp', 22: 'chartDown', 23: 'money', 24: 'building', 25: 'clock', 26: 'building',
  27: 'land', 28: 'home', 29: 'gear', 30: 'building', 31: 'gear', 32: 'car', 33: 'cycle',
  34: 'money', 35: 'bank', 36: 'doc', 37: 'box', 38: 'handshake', 39: 'doc', 40: 'clock',
  41: 'chartUp', 42: 'star', 43: 'money', 44: 'money', 45: 'box', 46: 'money', 47: 'building',
  48: 'megaphone', 49: 'building', 50: 'scale', 51: 'clock', 52: 'bank', 53: 'cycle',
  54: 'truck', 55: 'doc', 56: 'doc', 57: 'doc', 58: 'clock', 59: 'clock', 60: 'handshake',
  61: 'scale', 62: 'money', 63: 'handshake', 64: 'gear', 65: 'shield', 66: 'money',
  67: 'money', 68: 'chartDown', 69: 'chartDown', 70: 'chartUp', 71: 'chartUp', 72: 'chartDown',
  73: 'calendar', 74: 'box', 75: 'truck', 76: 'cycle', 77: 'money', 78: 'box', 79: 'calendar',
  80: 'chartUp', 81: 'cycle', 82: 'money', 83: 'chartUp', 84: 'chartDown', 85: 'megaphone',
  86: 'building', 87: 'gear', 88: 'chartDown', 89: 'home', 90: 'money', 91: 'truck',
  92: 'plane', 93: 'cup', 94: 'gear', 95: 'megaphone', 96: 'bank', 97: 'bulb', 98: 'phone',
  99: 'drop', 100: 'gift', 101: 'doc', 102: 'chartUp', 103: 'phone', 104: 'money',
  105: 'building', 106: 'plane', 107: 'plane', 108: 'shield', 109: 'sparkle', 110: 'chartDown',
  111: 'cup', 112: 'chartUp', 113: 'chartUp', 114: 'scale', 115: 'chartUp', 116: 'cycle',
  117: 'cycle', 118: 'shield', 119: 'shield', 120: 'shield',
}

function Money() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-12 w-12 lg:h-20 lg:w-20">
      <ellipse cx="32" cy="20" rx="16" ry="7" stroke={S} strokeWidth="3" />
      <ellipse cx="32" cy="32" rx="16" ry="7" stroke={GOLD} strokeWidth="3" fill="none">
        <animate attributeName="opacity" values="1;0.45;1" dur="1.6s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="32" cy="44" rx="16" ry="7" stroke={GOLD} strokeWidth="3" fill="none" />
      <line x1="32" y1="29" x2="32" y2="35" stroke={S} strokeWidth="2.5" />
      <text x="32" y="36" textAnchor="middle" fontSize="9" fontWeight="bold" fill={S} fontFamily="Segoe UI">$</text>
      <circle cx="52" cy="16" r="4" fill={GOLD}>
        <animate attributeName="cy" values="16;12;16" dur="1.4s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}

function ChartUp() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-12 w-12 lg:h-20 lg:w-20">
      <line x1="10" y1="54" x2="54" y2="54" stroke={S} strokeWidth="3" />
      <rect x="14" y="36" width="8" height="18" fill={GREEN} rx="2">
        <animate attributeName="y" values="38;34;38" dur="1.6s" repeatCount="indefinite" />
      </rect>
      <rect x="28" y="24" width="8" height="30" fill={BLUE} rx="2" />
      <rect x="42" y="12" width="8" height="42" fill={GREEN} rx="2">
        <animate attributeName="y" values="14;10;14" dur="1.6s" begin="0.4s" repeatCount="indefinite" />
      </rect>
      <path d="M22 20 l18 -10 M36 10 l0 4 M40 10 l4 -4 M40 10 l0 4" stroke={S} strokeWidth="2.5" strokeLinecap="round" fill="none">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="1.2s" repeatCount="indefinite" />
      </path>
    </svg>
  )
}

function ChartDown() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-12 w-12 lg:h-20 lg:w-20">
      <line x1="10" y1="54" x2="54" y2="54" stroke={S} strokeWidth="3" />
      <rect x="42" y="26" width="8" height="28" fill={RED} rx="2">
        <animate attributeName="y" values="28;32;28" dur="1.6s" repeatCount="indefinite" />
      </rect>
      <rect x="28" y="14" width="8" height="40" fill={PURPLE} rx="2" />
      <rect x="14" y="36" width="8" height="18" fill={RED} rx="2">
        <animate attributeName="y" values="38;42;38" dur="1.6s" repeatCount="indefinite" />
      </rect>
      <path d="M42 12 l18 10 M54 22 l6 0 M60 22 l0 6" stroke={S} strokeWidth="2.5" strokeLinecap="round" fill="none">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="1.2s" repeatCount="indefinite" />
      </path>
    </svg>
  )
}

function Bank() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-12 w-12 lg:h-20 lg:w-20">
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-3;0,0" dur="2.6s" repeatCount="indefinite" />
        <path d="M12 26 L32 12 L52 26 Z" stroke={S} strokeWidth="3" strokeLinejoin="round" />
        <line x1="14" y1="26" x2="50" y2="26" stroke={S} strokeWidth="3" />
        <path d="M20 26 L20 48 M32 26 L32 48 M44 26 L44 48" stroke={S} strokeWidth="3" strokeLinecap="round" />
        <path d="M16 50 L48 50" stroke={S} strokeWidth="3" strokeLinecap="round" />
        <circle cx="32" cy="32" r="4" fill={GOLD}>
          <animate attributeName="opacity" values="1;0.3;1" dur="1.4s" repeatCount="indefinite" />
        </circle>
      </g>
    </svg>
  )
}

const LINE = <animate attributeName="opacity" values="1;0.35;1" dur="1.8s" repeatCount="indefinite" />

function Doc() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-12 w-12 lg:h-20 lg:w-20">
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-4;0,0" dur="2.2s" repeatCount="indefinite" />
        <rect x="18" y="10" width="28" height="42" rx="3" stroke={S} strokeWidth="3" fill="none" />
        <line x1="24" y1="20" x2="40" y2="20" stroke={BLUE} strokeWidth="3" strokeLinecap="round">{LINE}</line>
        <line x1="24" y1="28" x2="36" y2="28" stroke={S} strokeWidth="3" strokeLinecap="round">{LINE}</line>
        <line x1="24" y1="36" x2="40" y2="36" stroke={S} strokeWidth="3" strokeLinecap="round">{LINE}</line>
        <path d="M40 44 L52 44 L52 20 L46 14 L40 14 Z" stroke={GREEN} strokeWidth="2.5" fill="none" strokeLinejoin="round" />
      </g>
    </svg>
  )
}

function Book() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-12 w-12 lg:h-20 lg:w-20">
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-3;0,0" dur="2.8s" repeatCount="indefinite" />
        <path d="M32 16 C26 12 16 12 12 16 L12 50 C16 46 26 46 32 50 C38 46 48 46 52 50 L52 16 C48 12 38 12 32 16 Z" stroke={S} strokeWidth="3" fill="none" />
        <path d="M32 16 L32 50" stroke={S} strokeWidth="2.5" />
        <circle cx="32" cy="33" r="6" fill={GOLD}>
          <animate attributeName="opacity" values="1;0.3;1" dur="1.6s" repeatCount="indefinite" />
        </circle>
      </g>
    </svg>
  )
}

function Box() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-12 w-12 lg:h-20 lg:w-20">
      <g>
        <animateTransform attributeName="transform" type="rotate" values="-2 32 32;2 32 32;-2 32 32" dur="1.6s" repeatCount="indefinite" />
        <path d="M14 24 L50 24 L50 50 L14 50 Z" stroke={S} strokeWidth="3" />
        <path d="M14 24 L26 14 L38 14 L50 24" stroke={S} strokeWidth="3" strokeLinejoin="round" />
        <line x1="14" y1="37" x2="50" y2="37" stroke={GOLD} strokeWidth="3" />
        <line x1="32" y1="24" x2="32" y2="50" stroke={GOLD} strokeWidth="3" />
      </g>
    </svg>
  )
}

function Building() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-12 w-12 lg:h-20 lg:w-20">
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-3;0,0" dur="2.4s" repeatCount="indefinite" />
        <rect x="20" y="18" width="26" height="34" rx="2" stroke={S} strokeWidth="3" />
        <rect x="23" y="22" width="6" height="6" fill={GOLD}>
          <animate attributeName="opacity" values="1;0.4;1" dur="1.6s" repeatCount="indefinite" />
        </rect>
        <rect x="36" y="22" width="6" height="6" fill={GOLD}>
          <animate attributeName="opacity" values="1;0.4;1" dur="1.6s" begin="0.3s" repeatCount="indefinite" />
        </rect>
        <rect x="23" y="34" width="6" height="6" fill={BLUE}>
          <animate attributeName="opacity" values="1;0.4;1" dur="1.6s" begin="0.6s" repeatCount="indefinite" />
        </rect>
        <rect x="36" y="34" width="6" height="6" fill={BLUE}>
          <animate attributeName="opacity" values="1;0.4;1" dur="1.6s" begin="0.9s" repeatCount="indefinite" />
        </rect>
        <path d="M28 20 L32 12 L36 20" stroke={S} strokeWidth="3" strokeLinejoin="round" />
      </g>
    </svg>
  )
}

function Clock() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-12 w-12 lg:h-20 lg:w-20">
      <circle cx="32" cy="32" r="20" stroke={S} strokeWidth="3" />
      <g>
        <animateTransform attributeName="transform" type="rotate" from="0 32 32" to="360 32 32" dur="4s" repeatCount="indefinite" />
        <line x1="32" y1="32" x2="32" y2="20" stroke={S} strokeWidth="3" strokeLinecap="round" />
      </g>
      <line x1="32" y1="32" x2="42" y2="38" stroke={RED} strokeWidth="3" strokeLinecap="round" />
      <circle cx="32" cy="32" r="3" fill={BLUE} />
    </svg>
  )
}

function Phone() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-12 w-12 lg:h-20 lg:w-20">
      <g>
        <animateTransform attributeName="transform" type="rotate" values="0 32 32;-6 32 32;0 32 32;6 32 32;0 32 32" dur="1.4s" repeatCount="indefinite" />
        <path d="M22 10 L42 10 L42 54 L22 54 Z" stroke={S} strokeWidth="3" rx="4" strokeLinejoin="round" fill="none" />
        <line x1="27" y1="46" x2="37" y2="46" stroke={S} strokeWidth="3" strokeLinecap="round" />
      </g>
    </svg>
  )
}

function Bulb() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-12 w-12 lg:h-20 lg:w-20">
      <path d="M32 12 C24 12 20 18 20 24 C20 30 26 32 26 38 L38 38 C38 32 44 30 44 24 C44 18 40 12 32 12 Z" stroke={S} strokeWidth="3" />
      <line x1="26" y1="44" x2="38" y2="44" stroke={S} strokeWidth="3" strokeLinecap="round" />
      <line x1="28" y1="48" x2="36" y2="48" stroke={S} strokeWidth="3" strokeLinecap="round" />
      <path d="M20 16 L14 10 M44 16 L50 10 M12 24 L6 24 M56 24 L50 24" stroke={GOLD} strokeWidth="3" strokeLinecap="round">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="1.2s" repeatCount="indefinite" />
      </path>
    </svg>
  )
}

function Truck() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-12 w-12 lg:h-20 lg:w-20">
      <g>
        <animateTransform attributeName="transform" type="translate" values="-4,0;4,0;-4,0" dur="2s" repeatCount="indefinite" />
        <path d="M10 34 L26 34 L26 22 L12 22 Z" stroke={BLUE} strokeWidth="3" strokeLinejoin="round" />
        <path d="M26 22 L42 22 L48 30 L48 34 L26 34 Z" stroke={S} strokeWidth="3" strokeLinejoin="round" />
        <circle cx="18" cy="40" r="5" stroke={S} strokeWidth="3" />
        <circle cx="40" cy="40" r="5" stroke={S} strokeWidth="3" />
      </g>
    </svg>
  )
}

function Plane() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-12 w-12 lg:h-20 lg:w-20">
      <g>
        <animateTransform attributeName="transform" type="translate" values="-8,0;8,0;-8,0" dur="2.4s" repeatCount="indefinite" />
        <path d="M10 30 L54 30 L50 34 L14 34 Z" fill={BLUE} />
        <path d="M22 30 L22 18 M22 34 L22 46 M34 34 L34 42" stroke={S} strokeWidth="2.5" strokeLinecap="round" />
      </g>
    </svg>
  )
}

function Shield() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-12 w-12 lg:h-20 lg:w-20">
      <path d="M32 12 L50 18 L50 34 C50 44 42 50 32 52 C22 50 14 44 14 34 L14 18 Z" stroke={PURPLE} strokeWidth="3" strokeLinejoin="round" />
      <path d="M24 32 L30 38 L42 26" stroke={GREEN} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <animate attributeName="opacity" values="1;0.4;1" dur="1.4s" repeatCount="indefinite" />
      </path>
    </svg>
  )
}

function Handshake() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-12 w-12 lg:h-20 lg:w-20">
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;-2,0;2,0;0,0" dur="1.6s" repeatCount="indefinite" />
        <path d="M12 30 L24 40 L40 34 L34 46" stroke={S} strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M52 30 L40 40 L30 36" stroke={GREEN} strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M24 40 L28 48 L48 42 L52 34" stroke={BLUE} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>
    </svg>
  )
}

function Star() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-12 w-12 lg:h-20 lg:w-20">
      <path d="M32 8 L40 24 L56 26 L44 38 L48 54 L32 46 L16 54 L20 38 L8 26 L24 24 Z" stroke={GOLD} strokeWidth="3" strokeLinejoin="round" fill="none">
        <animate attributeName="opacity" values="1;0.5;1" dur="1.8s" repeatCount="indefinite" />
      </path>
      <circle cx="50" cy="16" r="3" fill={GOLD}>
        <animate attributeName="opacity" values="0.2;1;0.2" dur="1.2s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}

function Gear() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-12 w-12 lg:h-20 lg:w-20">
      <g>
        <animateTransform attributeName="transform" type="rotate" from="0 32 32" to="360 32 32" dur="6s" repeatCount="indefinite" />
        <circle cx="32" cy="32" r="10" stroke={S} strokeWidth="3" />
        <path d="M32 14 L32 22 M32 42 L32 50 M14 32 L22 32 M42 32 L50 32 M19 19 L25 25 M39 39 L45 45 M45 19 L39 25 M25 39 L19 45" stroke={S} strokeWidth="3" strokeLinecap="round" />
      </g>
    </svg>
  )
}

function Cycle() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-12 w-12 lg:h-20 lg:w-20">
      <path d="M18 44 A 20 20 0 1 1 44 44" stroke={BLUE} strokeWidth="3" strokeLinecap="round" fill="none">
        <animateTransform attributeName="transform" type="rotate" from="0 32 32" to="360 32 32" dur="3.5s" repeatCount="indefinite" />
      </path>
      <path d="M18 44 L10 44 L10 36 L18 36 Z" fill={BLUE} />
      <circle cx="16" cy="14" r="4" fill={GOLD}>
        <animate attributeName="opacity" values="1;0.4;1" dur="1.4s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}

function Scale() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-12 w-12 lg:h-20 lg:w-20">
      <line x1="12" y1="52" x2="52" y2="52" stroke={S} strokeWidth="3" strokeLinecap="round" />
      <line x1="32" y1="52" x2="32" y2="22" stroke={S} strokeWidth="3" />
      <g>
        <animateTransform attributeName="transform" type="rotate" values="-4 32 22;4 32 22;-4 32 22" dur="2.2s" repeatCount="indefinite" />
        <line x1="20" y1="22" x2="44" y2="22" stroke={S} strokeWidth="3" strokeLinecap="round" />
        <path d="M20 22 L16 34 L28 34 Z" stroke={S} strokeWidth="2.5" strokeLinejoin="round" fill="none" />
        <path d="M44 22 L40 34 L52 34 Z" stroke={S} strokeWidth="2.5" strokeLinejoin="round" fill="none" />
      </g>
    </svg>
  )
}

function Calendar() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-12 w-12 lg:h-20 lg:w-20">
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-3;0,0" dur="2.4s" repeatCount="indefinite" />
        <rect x="14" y="16" width="36" height="38" rx="4" stroke={S} strokeWidth="3" />
        <line x1="20" y1="10" x2="20" y2="20" stroke={S} strokeWidth="3" strokeLinecap="round" />
        <line x1="44" y1="10" x2="44" y2="20" stroke={S} strokeWidth="3" strokeLinecap="round" />
        <line x1="14" y1="28" x2="50" y2="28" stroke={S} strokeWidth="3" />
        <circle cx="32" cy="40" r="5" fill={GOLD}>
          <animate attributeName="opacity" values="1;0.4;1" dur="1.6s" repeatCount="indefinite" />
        </circle>
      </g>
    </svg>
  )
}

function Megaphone() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-12 w-12 lg:h-20 lg:w-20">
      <path d="M10 26 C22 22 34 16 46 12 L54 12 L54 42 L46 42 C34 48 22 42 10 38 Z" stroke={RED} strokeWidth="3" strokeLinejoin="round" fill="none" />
      <line x1="10" y1="36" x2="10" y2="46" stroke={S} strokeWidth="3" strokeLinecap="round" />
      <line x1="14" y1="42" x2="14" y2="50" stroke={S} strokeWidth="3" strokeLinecap="round" />
      <path d="M56 18 C60 24 60 30 56 36" stroke={GOLD} strokeWidth="3" strokeLinecap="round">
        <animate attributeName="opacity" values="0.2;1;0.2" dur="1.1s" repeatCount="indefinite" />
      </path>
    </svg>
  )
}

function Cup() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-12 w-12 lg:h-20 lg:w-20">
      <path d="M18 24 L20 50 C20 52 22 54 26 54 L38 54 C42 54 44 52 44 50 L46 24 Z" stroke={S} strokeWidth="3" strokeLinejoin="round" fill="none" />
      <path d="M46 30 C50 30 52 33 52 36 C52 39 50 42 46 42" stroke={S} strokeWidth="3" fill="none" />
      <path d="M24 18 C27 14 31 14 34 18" stroke={BLUE} strokeWidth="3" strokeLinecap="round" fill="none">
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-3;0,0" dur="1.8s" repeatCount="indefinite" />
      </path>
    </svg>
  )
}

function Drop() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-12 w-12 lg:h-20 lg:w-20">
      <path d="M32 10 C38 20 46 28 46 38 C46 46 40 52 32 52 C24 52 18 46 18 38 C18 28 26 20 32 10 Z" stroke={BLUE} strokeWidth="3" strokeLinejoin="round" fill="none">
        <animate attributeName="opacity" values="1;0.5;1" dur="1.8s" repeatCount="indefinite" />
      </path>
    </svg>
  )
}

function Gift() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-12 w-12 lg:h-20 lg:w-20">
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-4;0,0" dur="1.8s" repeatCount="indefinite" />
        <rect x="14" y="20" width="36" height="34" rx="3" stroke={S} strokeWidth="3" />
        <path d="M14 20 L14 32 L50 32 L50 20" stroke={GOLD} strokeWidth="3" />
        <line x1="32" y1="20" x2="32" y2="54" stroke={GOLD} strokeWidth="3" />
        <path d="M32 20 C26 12 14 14 14 22 M32 20 C38 12 50 14 50 22" stroke={S} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      </g>
    </svg>
  )
}

function Sparkle() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-12 w-12 lg:h-20 lg:w-20">
      <path d="M32 8 L36 22 L50 26 L36 30 L32 44 L28 30 L14 26 L28 22 Z" fill={GOLD}>
        <animate attributeName="opacity" values="1;0.5;1" dur="1.5s" repeatCount="indefinite" />
      </path>
      <circle cx="20" cy="48" r="3" fill={GREEN}>
        <animate attributeName="opacity" values="0.2;1;0.2" dur="1s" repeatCount="indefinite" />
      </circle>
      <circle cx="46" cy="50" r="2.5" fill={BLUE}>
        <animate attributeName="opacity" values="1;0.2;1" dur="1.2s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}

function Home() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-12 w-12 lg:h-20 lg:w-20">
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-3;0,0" dur="2.4s" repeatCount="indefinite" />
        <path d="M14 30 L32 12 L50 30" stroke={S} strokeWidth="3" strokeLinejoin="round" />
        <path d="M20 28 L20 52 L44 52 L44 28" stroke={S} strokeWidth="3" strokeLinejoin="round" />
        <rect x="27" y="38" width="10" height="14" stroke={GOLD} strokeWidth="2.5" fill="none" />
      </g>
    </svg>
  )
}

function Car() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-12 w-12 lg:h-20 lg:w-20">
      <g>
        <animateTransform attributeName="transform" type="translate" values="-4,0;4,0;-4,0" dur="1.8s" repeatCount="indefinite" />
        <path d="M12 32 L16 22 L42 22 L50 32 L52 32 L52 40 L12 40 Z" stroke={S} strokeWidth="3" strokeLinejoin="round" />
        <path d="M22 22 L28 14 L40 14 L45 22" stroke={S} strokeWidth="2.5" strokeLinejoin="round" fill="none" />
        <circle cx="22" cy="42" r="5" stroke={S} strokeWidth="3" />
        <circle cx="42" cy="42" r="5" stroke={S} strokeWidth="3" />
      </g>
    </svg>
  )
}

function Land() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-12 w-12 lg:h-20 lg:w-20">
      <path d="M10 40 C18 26 30 26 38 40 M34 44 C42 32 54 32 62 46 L10 46 Z" stroke={GREEN} strokeWidth="3" strokeLinejoin="round" fill="none" />
      <circle cx="48" cy="18" r="5" stroke={GOLD} strokeWidth="3" fill="none">
        <animate attributeName="opacity" values="1;0.5;1" dur="1.8s" repeatCount="indefinite" />
      </circle>
      <path d="M48 6 L48 10 M40 18 L44 18 M52 18 L56 18 M42 8 L45 11 M54 8 L51 11" stroke={GOLD} strokeWidth="2" strokeLinecap="round">
        <animate attributeName="opacity" values="0.2;1;0.2" dur="1.2s" repeatCount="indefinite" />
      </path>
    </svg>
  )
}

const SCENES: Record<SceneKey, () => ReactElement> = {
  money: Money, chartUp: ChartUp, chartDown: ChartDown, bank: Bank, doc: Doc, book: Book,
  box: Box, building: Building, clock: Clock, phone: Phone, bulb: Bulb, truck: Truck,
  plane: Plane, shield: Shield, handshake: Handshake, star: Star, gear: Gear, cycle: Cycle,
  scale: Scale, calendar: Calendar, megaphone: Megaphone, cup: Cup, drop: Drop, gift: Gift,
  sparkle: Sparkle, home: Home, car: Car, land: Land,
}

const BG = ['bg-sky-100', 'bg-emerald-100', 'bg-amber-100', 'bg-rose-100', 'bg-violet-100', 'bg-teal-100', 'bg-indigo-100', 'bg-orange-100']

export function WordArt({ term, size = 'lg' }: { term: VocabTerm; size?: 'sm' | 'lg' }) {
  const Scene = SCENES[SCENE[term.id] ?? 'doc']
  const bg = BG[term.id % BG.length]
  return (
    <div
      className={`flex items-center justify-center overflow-hidden rounded-3xl shadow-sm animate-float ${bg} ${
        size === 'lg' ? 'mx-auto h-28 w-40' : 'h-14 w-14 rounded-2xl'
      }`}
    >
      {Scene && <Scene />}
    </div>
  )
}