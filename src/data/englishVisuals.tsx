import type { ReactElement } from 'react'
import type { VocabTerm } from './accountingEnglish'

type Scene =
  | 'person' | 'money' | 'chartUp' | 'chartDown' | 'bank' | 'doc' | 'book'
  | 'invoice' | 'box' | 'building' | 'clock' | 'phone' | 'bulb' | 'truck'
  | 'plane' | 'shield' | 'handshake' | 'star' | 'gear' | 'cycle' | 'scale'
  | 'calendar' | 'megaphone' | 'cup' | 'drop' | 'gift' | 'home' | 'car'
  | 'land' | 'tag' | 'envelope' | 'certificate' | 'shirt' | 'key'

const S = '#334155'
const G = '#f59e0b'
const B = '#0ea5e9'
const GR = '#10b981'
const R = '#f43f5e'
const P = '#8b5cf6'
const OR = '#f97316'

const SCENE: Record<number, Scene> = {
  1: 'person', 2: 'person', 3: 'money', 4: 'chartDown', 5: 'chartUp', 6: 'doc',
  7: 'box', 8: 'invoice', 9: 'chartUp', 10: 'invoice', 11: 'book', 12: 'book',
  13: 'doc', 14: 'book', 15: 'book', 16: 'scale', 17: 'doc', 18: 'scale',
  19: 'doc', 20: 'scale', 21: 'chartUp', 22: 'chartDown', 23: 'cycle', 24: 'money',
  25: 'clock', 26: 'building', 27: 'land', 28: 'home', 29: 'gear', 30: 'building',
  31: 'gear', 32: 'car', 33: 'cycle', 34: 'money', 35: 'bank', 36: 'doc',
  37: 'box', 38: 'handshake', 39: 'chartUp', 40: 'clock', 41: 'chartUp', 42: 'star',
  43: 'shield', 44: 'money', 45: 'box', 46: 'chartDown', 47: 'building', 48: 'megaphone',
  49: 'building', 50: 'chartDown', 51: 'clock', 52: 'bank', 53: 'cycle', 54: 'truck',
  55: 'doc', 56: 'handshake', 57: 'chartDown', 58: 'clock', 59: 'clock', 60: 'handshake',
  61: 'scale', 62: 'money', 63: 'handshake', 64: 'gear', 65: 'shield', 66: 'money',
  67: 'money', 68: 'chartDown', 69: 'chartDown', 70: 'chartUp', 71: 'chartUp',
  72: 'chartDown', 73: 'calendar', 74: 'box', 75: 'truck', 76: 'cycle', 77: 'tag',
  78: 'box', 79: 'calendar', 80: 'chartUp', 81: 'cycle', 82: 'tag', 83: 'chartUp',
  84: 'chartDown', 85: 'megaphone', 86: 'person', 87: 'gear', 88: 'chartDown',
  89: 'key', 90: 'money', 91: 'truck', 92: 'shield', 93: 'cup', 94: 'gear',
  95: 'megaphone', 96: 'bank', 97: 'bulb', 98: 'phone', 99: 'drop', 100: 'gift',
  101: 'certificate', 102: 'tag', 103: 'phone', 104: 'money', 105: 'person',
  106: 'envelope', 107: 'plane', 108: 'certificate', 109: 'shirt', 110: 'chartDown',
  111: 'cup', 112: 'shield', 113: 'chartUp', 114: 'scale', 115: 'chartUp',
  116: 'money', 117: 'cycle', 118: 'shield', 119: 'tag', 120: 'shield',
}

function Person() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-12 w-12 lg:h-20 lg:w-20">
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-3;0,0" dur="2.2s" repeatCount="indefinite" />
        <circle cx="32" cy="18" r="8" stroke={S} strokeWidth="3" />
        <path d="M20 52 C20 38 26 32 32 32 C38 32 44 38 44 52" stroke={S} strokeWidth="3" strokeLinecap="round" />
        <line x1="18" y1="42" x2="46" y2="42" stroke={B} strokeWidth="2.5" strokeLinecap="round" />
        <rect x="22" y="38" width="20" height="8" rx="2" stroke={B} strokeWidth="2" fill="none">
          <animate attributeName="opacity" values="1;0.4;1" dur="1.6s" repeatCount="indefinite" />
        </rect>
      </g>
    </svg>
  )
}

function Money() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-12 w-12 lg:h-20 lg:w-20">
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-3;0,0" dur="2s" repeatCount="indefinite" />
        <circle cx="26" cy="28" r="12" stroke={G} strokeWidth="3" />
        <text x="26" y="33" textAnchor="middle" fontSize="16" fontWeight="bold" fill={G}>$</text>
        <circle cx="42" cy="40" r="8" stroke={G} strokeWidth="2.5" />
        <text x="42" y="44" textAnchor="middle" fontSize="12" fontWeight="bold" fill={G}>$</text>
        <circle cx="16" cy="44" r="6" stroke={GR} strokeWidth="2.5" />
        <text x="16" y="48" textAnchor="middle" fontSize="10" fontWeight="bold" fill={GR}>$</text>
      </g>
    </svg>
  )
}

function ChartUp() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-12 w-12 lg:h-20 lg:w-20">
      <line x1="10" y1="54" x2="54" y2="54" stroke={S} strokeWidth="3" />
      <rect x="14" y="38" width="8" height="16" fill={GR} rx="2">
        <animate attributeName="y" values="40;36;40" dur="1.4s" repeatCount="indefinite" />
      </rect>
      <rect x="28" y="26" width="8" height="28" fill={B} rx="2" />
      <rect x="42" y="14" width="8" height="40" fill={GR} rx="2">
        <animate attributeName="y" values="16;12;16" dur="1.4s" begin="0.3s" repeatCount="indefinite" />
      </rect>
      <path d="M22 20 L44 8 M40 8 L44 8 M44 8 L44 12" stroke={GR} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="1.1s" repeatCount="indefinite" />
      </path>
    </svg>
  )
}

function ChartDown() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-12 w-12 lg:h-20 lg:w-20">
      <line x1="10" y1="54" x2="54" y2="54" stroke={S} strokeWidth="3" />
      <rect x="42" y="24" width="8" height="30" fill={R} rx="2">
        <animate attributeName="y" values="26;30;26" dur="1.4s" repeatCount="indefinite" />
      </rect>
      <rect x="28" y="12" width="8" height="42" fill={P} rx="2" />
      <rect x="14" y="34" width="8" height="20" fill={R} rx="2">
        <animate attributeName="y" values="36;40;36" dur="1.4s" begin="0.3s" repeatCount="indefinite" />
      </rect>
      <path d="M42 12 L54 22 M50 22 L54 22 M54 22 L54 18" stroke={R} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="1.1s" repeatCount="indefinite" />
      </path>
    </svg>
  )
}

function Bank() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-12 w-12 lg:h-20 lg:w-20">
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-2;0,0" dur="2.6s" repeatCount="indefinite" />
        <path d="M12 26 L32 14 L52 26 Z" stroke={S} strokeWidth="3" strokeLinejoin="round" />
        <line x1="14" y1="26" x2="50" y2="26" stroke={S} strokeWidth="3" />
        <path d="M20 26 L20 48 M32 26 L32 48 M44 26 L44 48" stroke={S} strokeWidth="3" strokeLinecap="round" />
        <line x1="16" y1="50" x2="48" y2="50" stroke={S} strokeWidth="3" strokeLinecap="round" />
        <rect x="28" y="34" width="8" height="14" fill={G}>
          <animate attributeName="opacity" values="1;0.35;1" dur="1.5s" repeatCount="indefinite" />
        </rect>
      </g>
    </svg>
  )
}

const F = <animate attributeName="opacity" values="1;0.35;1" dur="1.6s" repeatCount="indefinite" />

function Doc() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-12 w-12 lg:h-20 lg:w-20">
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-3;0,0" dur="2.2s" repeatCount="indefinite" />
        <rect x="18" y="10" width="28" height="42" rx="3" stroke={S} strokeWidth="3" />
        <line x1="24" y1="20" x2="40" y2="20" stroke={B} strokeWidth="3" strokeLinecap="round">{F}</line>
        <line x1="24" y1="28" x2="36" y2="28" stroke={S} strokeWidth="3" strokeLinecap="round">{F}</line>
        <line x1="24" y1="36" x2="40" y2="36" stroke={S} strokeWidth="3" strokeLinecap="round">{F}</line>
        <line x1="24" y1="44" x2="32" y2="44" stroke={S} strokeWidth="2.5" strokeLinecap="round" />
      </g>
    </svg>
  )
}

function Book() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-12 w-12 lg:h-20 lg:w-20">
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-3;0,0" dur="2.8s" repeatCount="indefinite" />
        <path d="M32 14 C26 10 16 10 12 14 L12 50 C16 46 26 46 32 50 C38 46 48 46 52 50 L52 14 C48 10 38 10 32 14 Z" stroke={S} strokeWidth="3" />
        <line x1="32" y1="14" x2="32" y2="50" stroke={S} strokeWidth="2.5" />
        <line x1="16" y1="22" x2="28" y2="20" stroke={B} strokeWidth="2" strokeLinecap="round" />
        <line x1="16" y1="28" x2="28" y2="26" stroke={S} strokeWidth="2" strokeLinecap="round" />
        <line x1="16" y1="34" x2="28" y2="32" stroke={S} strokeWidth="2" strokeLinecap="round" />
        <line x1="36" y1="20" x2="48" y2="22" stroke={B} strokeWidth="2" strokeLinecap="round" />
        <line x1="36" y1="26" x2="48" y2="28" stroke={S} strokeWidth="2" strokeLinecap="round" />
      </g>
    </svg>
  )
}

function Invoice() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-12 w-12 lg:h-20 lg:w-20">
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-3;0,0" dur="2.2s" repeatCount="indefinite" />
        <rect x="14" y="8" width="36" height="48" rx="3" stroke={S} strokeWidth="3" />
        <line x1="20" y1="18" x2="44" y2="18" stroke={B} strokeWidth="3" strokeLinecap="round">{F}</line>
        <line x1="20" y1="26" x2="38" y2="26" stroke={S} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="20" y1="32" x2="42" y2="32" stroke={S} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="20" y1="38" x2="30" y2="38" stroke={S} strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="42" cy="44" r="6" fill={G}>
          <animate attributeName="opacity" values="1;0.4;1" dur="1.4s" repeatCount="indefinite" />
        </circle>
        <text x="42" y="48" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#fff">$</text>
      </g>
    </svg>
  )
}

function Box() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-12 w-12 lg:h-20 lg:w-20">
      <g>
        <animateTransform attributeName="transform" type="rotate" values="-1 32 32;1 32 32;-1 32 32" dur="1.8s" repeatCount="indefinite" />
        <path d="M14 26 L50 26 L50 52 L14 52 Z" stroke={S} strokeWidth="3" />
        <path d="M14 26 L26 16 L38 16 L50 26" stroke={S} strokeWidth="3" strokeLinejoin="round" />
        <line x1="14" y1="39" x2="50" y2="39" stroke={G} strokeWidth="2.5" />
        <line x1="32" y1="26" x2="32" y2="52" stroke={G} strokeWidth="2.5" />
      </g>
    </svg>
  )
}

function Building() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-12 w-12 lg:h-20 lg:w-20">
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-2;0,0" dur="2.4s" repeatCount="indefinite" />
        <rect x="18" y="18" width="28" height="34" rx="2" stroke={S} strokeWidth="3" />
        <rect x="22" y="22" width="6" height="6" fill={G}>
          <animate attributeName="opacity" values="1;0.35;1" dur="1.5s" repeatCount="indefinite" />
        </rect>
        <rect x="36" y="22" width="6" height="6" fill={B}>
          <animate attributeName="opacity" values="1;0.35;1" dur="1.5s" begin="0.4s" repeatCount="indefinite" />
        </rect>
        <rect x="22" y="36" width="6" height="6" fill={B}>
          <animate attributeName="opacity" values="1;0.35;1" dur="1.5s" begin="0.8s" repeatCount="indefinite" />
        </rect>
        <rect x="36" y="36" width="6" height="6" fill={G}>
          <animate attributeName="opacity" values="1;0.35;1" dur="1.5s" begin="1.2s" repeatCount="indefinite" />
        </rect>
        <rect x="27" y="44" width="10" height="8" rx="1" stroke={S} strokeWidth="2" fill="none" />
      </g>
    </svg>
  )
}

function Clock() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-12 w-12 lg:h-20 lg:w-20">
      <circle cx="32" cy="32" r="20" stroke={S} strokeWidth="3" />
      <g>
        <animateTransform attributeName="transform" type="rotate" from="0 32 32" to="360 32 32" dur="5s" repeatCount="indefinite" />
        <line x1="32" y1="32" x2="32" y2="18" stroke={S} strokeWidth="3" strokeLinecap="round" />
      </g>
      <line x1="32" y1="32" x2="42" y2="36" stroke={R} strokeWidth="3" strokeLinecap="round" />
      <circle cx="32" cy="32" r="3" fill={B} />
      <circle cx="32" cy="14" r="1.5" fill={S} />
      <circle cx="32" cy="50" r="1.5" fill={S} />
      <circle cx="14" cy="32" r="1.5" fill={S} />
      <circle cx="50" cy="32" r="1.5" fill={S} />
    </svg>
  )
}

function Phone() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-12 w-12 lg:h-20 lg:w-20">
      <g>
        <animateTransform attributeName="transform" type="rotate" values="0 32 32;-5 32 32;0 32 32;5 32 32;0 32 32" dur="1.2s" repeatCount="indefinite" />
        <rect x="22" y="10" width="20" height="44" rx="4" stroke={S} strokeWidth="3" />
        <line x1="28" y1="46" x2="36" y2="46" stroke={S} strokeWidth="3" strokeLinecap="round" />
        <circle cx="32" cy="16" r="2" fill={S} />
      </g>
      <path d="M16 24 C14 28 14 36 16 40" stroke={B} strokeWidth="2.5" strokeLinecap="round" opacity="0.5">
        <animate attributeName="opacity" values="0.2;0.7;0.2" dur="1s" repeatCount="indefinite" />
      </path>
      <path d="M48 24 C50 28 50 36 48 40" stroke={B} strokeWidth="2.5" strokeLinecap="round" opacity="0.5">
        <animate attributeName="opacity" values="0.2;0.7;0.2" dur="1s" begin="0.5s" repeatCount="indefinite" />
      </path>
    </svg>
  )
}

function Bulb() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-12 w-12 lg:h-20 lg:w-20">
      <path d="M32 12 C24 12 20 18 20 24 C20 30 26 32 26 38 L38 38 C38 32 44 30 44 24 C44 18 40 12 32 12 Z" stroke={G} strokeWidth="3" fill="none" />
      <line x1="26" y1="44" x2="38" y2="44" stroke={S} strokeWidth="3" strokeLinecap="round" />
      <line x1="28" y1="48" x2="36" y2="48" stroke={S} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M20 16 L14 10 M44 16 L50 10 M12 26 L6 26 M56 26 L50 26 M16 8 L20 12 M52 8 L48 12" stroke={G} strokeWidth="2.5" strokeLinecap="round">
        <animate attributeName="opacity" values="0.2;1;0.2" dur="1.1s" repeatCount="indefinite" />
      </path>
      <path d="M30 20 L34 20 M32 18 L32 22" stroke={G} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function Truck() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-12 w-12 lg:h-20 lg:w-20">
      <g>
        <animateTransform attributeName="transform" type="translate" values="-3,0;3,0;-3,0" dur="2s" repeatCount="indefinite" />
        <path d="M8 34 L24 34 L24 22 L12 22 Z" stroke={B} strokeWidth="3" strokeLinejoin="round" />
        <path d="M24 22 L40 22 L48 30 L48 34 L24 34 Z" stroke={S} strokeWidth="3" strokeLinejoin="round" />
        <rect x="26" y="24" width="12" height="8" fill={B} stroke={B} strokeWidth="1">
          <animate attributeName="opacity" values="1;0.4;1" dur="1.2s" repeatCount="indefinite" />
        </rect>
        <circle cx="16" cy="40" r="5" stroke={S} strokeWidth="3" />
        <circle cx="40" cy="40" r="5" stroke={S} strokeWidth="3" />
      </g>
    </svg>
  )
}

function Plane() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-12 w-12 lg:h-20 lg:w-20">
      <g>
        <animateTransform attributeName="transform" type="translate" values="-6,0;6,0;-6,0" dur="2.4s" repeatCount="indefinite" />
        <path d="M10 30 L52 30 L48 34 L14 34 Z" fill={B} />
        <path d="M24 30 L24 18 M24 34 L24 46" stroke={S} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M36 34 L36 44" stroke={S} strokeWidth="2" strokeLinecap="round" />
        <circle cx="50" cy="28" r="2" fill={B}>
          <animate attributeName="cx" values="50;56;50" dur="1.5s" repeatCount="indefinite" />
        </circle>
      </g>
    </svg>
  )
}

function Shield() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-12 w-12 lg:h-20 lg:w-20">
      <path d="M32 12 L50 18 L50 34 C50 44 42 50 32 52 C22 50 14 44 14 34 L14 18 Z" stroke={P} strokeWidth="3" strokeLinejoin="round" />
      <path d="M24 32 L30 38 L42 26" stroke={GR} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <animate attributeName="opacity" values="1;0.4;1" dur="1.4s" repeatCount="indefinite" />
      </path>
    </svg>
  )
}

function Handshake() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-12 w-12 lg:h-20 lg:w-20">
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;-2,0;2,0;0,0" dur="1.8s" repeatCount="indefinite" />
        <path d="M10 30 L22 40 L38 34 L32 46" stroke={S} strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M54 30 L42 40 L28 36" stroke={GR} strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M22 40 L26 48 L48 42 L52 34" stroke={B} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>
    </svg>
  )
}

function Star() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-12 w-12 lg:h-20 lg:w-20">
      <path d="M32 8 L40 24 L56 26 L44 38 L48 54 L32 46 L16 54 L20 38 L8 26 L24 24 Z" stroke={G} strokeWidth="3" strokeLinejoin="round" fill="none">
        <animate attributeName="stroke-width" values="3;5;3" dur="1.5s" repeatCount="indefinite" />
      </path>
      <circle cx="50" cy="16" r="3" fill={G}>
        <animate attributeName="opacity" values="0.2;1;0.2" dur="1.2s" repeatCount="indefinite" />
      </circle>
      <circle cx="14" cy="48" r="2" fill={OR}>
        <animate attributeName="opacity" values="0.2;1;0.2" dur="1s" begin="0.4s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}

function Gear() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-12 w-12 lg:h-20 lg:w-20">
      <g>
        <animateTransform attributeName="transform" type="rotate" from="0 32 32" to="360 32 32" dur="5s" repeatCount="indefinite" />
        <circle cx="32" cy="32" r="10" stroke={S} strokeWidth="3" />
        <circle cx="32" cy="32" r="4" fill={S} />
        <path d="M32 14 L32 20 M32 44 L32 50 M14 32 L20 32 M44 32 L50 32 M19 19 L24 24 M40 40 L45 45 M45 19 L40 24 M24 40 L19 45" stroke={S} strokeWidth="3" strokeLinecap="round" />
      </g>
    </svg>
  )
}

function Cycle() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-12 w-12 lg:h-20 lg:w-20">
      <g>
        <animateTransform attributeName="transform" type="rotate" from="0 32 32" to="360 32 32" dur="4s" repeatCount="indefinite" />
        <path d="M18 44 A 20 20 0 1 1 44 44" stroke={B} strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M18 44 L10 44 L14 36 Z" fill={B} />
        <circle cx="32" cy="12" r="5" fill={OR}>
          <animate attributeName="opacity" values="1;0.4;1" dur="1.4s" repeatCount="indefinite" />
        </circle>
      </g>
    </svg>
  )
}

function Scale() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-12 w-12 lg:h-20 lg:w-20">
      <line x1="12" y1="52" x2="52" y2="52" stroke={S} strokeWidth="3" strokeLinecap="round" />
      <line x1="32" y1="52" x2="32" y2="22" stroke={S} strokeWidth="3" />
      <g>
        <animateTransform attributeName="transform" type="rotate" values="-3 32 22;3 32 22;-3 32 22" dur="2.4s" repeatCount="indefinite" />
        <line x1="18" y1="22" x2="46" y2="22" stroke={S} strokeWidth="3" strokeLinecap="round" />
        <path d="M18 22 L14 34 L26 34 Z" stroke={B} strokeWidth="2.5" strokeLinejoin="round" fill="none" />
        <path d="M46 22 L42 34 L54 34 Z" stroke={G} strokeWidth="2.5" strokeLinejoin="round" fill="none" />
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
        <line x1="20" y1="10" x2="20" y2="20" stroke={R} strokeWidth="3" strokeLinecap="round" />
        <line x1="44" y1="10" x2="44" y2="20" stroke={R} strokeWidth="3" strokeLinecap="round" />
        <line x1="14" y1="28" x2="50" y2="28" stroke={S} strokeWidth="3" />
        <text x="32" y="44" textAnchor="middle" fontSize="14" fontWeight="bold" fill={B}>31</text>
      </g>
    </svg>
  )
}

function Megaphone() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-12 w-12 lg:h-20 lg:w-20">
      <path d="M10 26 C22 22 34 16 46 12 L52 12 L52 42 L46 42 C34 48 22 42 10 38 Z" stroke={R} strokeWidth="3" strokeLinejoin="round" fill="none" />
      <line x1="10" y1="36" x2="10" y2="48" stroke={S} strokeWidth="3" strokeLinecap="round" />
      <line x1="14" y1="42" x2="14" y2="50" stroke={S} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M54 18 C58 24 58 30 54 36" stroke={G} strokeWidth="3" strokeLinecap="round">
        <animate attributeName="opacity" values="0.2;1;0.2" dur="1s" repeatCount="indefinite" />
      </path>
      <path d="M58 14 C64 22 64 34 58 42" stroke={G} strokeWidth="2" strokeLinecap="round">
        <animate attributeName="opacity" values="0.1;0.6;0.1" dur="1s" begin="0.3s" repeatCount="indefinite" />
      </path>
    </svg>
  )
}

function Cup() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-12 w-12 lg:h-20 lg:w-20">
      <path d="M18 24 L20 50 C20 52 22 54 26 54 L38 54 C42 54 44 52 44 50 L46 24 Z" stroke={S} strokeWidth="3" strokeLinejoin="round" fill="none" />
      <path d="M46 30 C50 30 52 33 52 36 C52 39 50 42 46 42" stroke={S} strokeWidth="3" fill="none" />
      <path d="M24 16 C26 12 30 12 32 16" stroke={S} strokeWidth="2" strokeLinecap="round" fill="none">
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-3;0,0" dur="1.6s" repeatCount="indefinite" />
      </path>
      <path d="M30 14 C32 10 34 10 36 14" stroke={S} strokeWidth="2" strokeLinecap="round" fill="none">
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-4;0,0" dur="2s" begin="0.4s" repeatCount="indefinite" />
      </path>
    </svg>
  )
}

function Drop() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-12 w-12 lg:h-20 lg:w-20">
      <path d="M32 10 C38 20 46 28 46 38 C46 46 40 52 32 52 C24 52 18 46 18 38 C18 28 26 20 32 10 Z" stroke={B} strokeWidth="3" strokeLinejoin="round" fill="none">
        <animate attributeName="d" values="M32 10 C38 20 46 28 46 38 C46 46 40 52 32 52 C24 52 18 46 18 38 C18 28 26 20 32 10 Z;M32 12 C37 22 44 30 44 38 C44 44 39 49 32 49 C25 49 20 44 20 38 C20 30 27 22 32 12 Z;M32 10 C38 20 46 28 46 38 C46 46 40 52 32 52 C24 52 18 46 18 38 C18 28 26 20 32 10 Z" dur="1.6s" repeatCount="indefinite" />
      </path>
      <path d="M28 34 C30 38 34 38 36 34" stroke={B} strokeWidth="2" strokeLinecap="round" fill="none">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="1.2s" repeatCount="indefinite" />
      </path>
    </svg>
  )
}

function Gift() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-12 w-12 lg:h-20 lg:w-20">
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-4;0,0" dur="1.6s" repeatCount="indefinite" />
        <rect x="14" y="22" width="36" height="32" rx="3" stroke={R} strokeWidth="3" />
        <path d="M14 22 L14 34 L50 34 L50 22" stroke={G} strokeWidth="3" />
        <line x1="32" y1="22" x2="32" y2="54" stroke={G} strokeWidth="3" />
        <path d="M32 22 C26 14 14 16 14 24" stroke={R} strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M32 22 C38 14 50 16 50 24" stroke={R} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      </g>
    </svg>
  )
}

function Home() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-12 w-12 lg:h-20 lg:w-20">
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-3;0,0" dur="2.4s" repeatCount="indefinite" />
        <path d="M14 30 L32 14 L50 30" stroke={S} strokeWidth="3" strokeLinejoin="round" />
        <path d="M20 28 L20 52 L44 52 L44 28" stroke={S} strokeWidth="3" strokeLinejoin="round" />
        <rect x="27" y="38" width="10" height="14" stroke={B} strokeWidth="2.5" fill="none" />
        <circle cx="35" cy="46" r="1.5" fill={G} />
      </g>
    </svg>
  )
}

function Car() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-12 w-12 lg:h-20 lg:w-20">
      <g>
        <animateTransform attributeName="transform" type="translate" values="-3,0;3,0;-3,0" dur="1.8s" repeatCount="indefinite" />
        <path d="M10 34 L14 24 L42 24 L50 34 L52 34 L52 42 L10 42 Z" stroke={S} strokeWidth="3" strokeLinejoin="round" />
        <path d="M20 24 L26 16 L40 16 L46 24" stroke={S} strokeWidth="2.5" strokeLinejoin="round" fill="none" />
        <circle cx="20" cy="44" r="5" stroke={S} strokeWidth="3" />
        <circle cx="44" cy="44" r="5" stroke={S} strokeWidth="3" />
        <rect x="32" y="26" width="8" height="6" fill={B}>
          <animate attributeName="opacity" values="1;0.4;1" dur="1.2s" repeatCount="indefinite" />
        </rect>
      </g>
    </svg>
  )
}

function Land() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-12 w-12 lg:h-20 lg:w-20">
      <path d="M10 42 C18 28 30 28 38 42 M34 46 C42 34 54 34 62 48 L10 48 Z" stroke={GR} strokeWidth="3" strokeLinejoin="round" fill="none" />
      <circle cx="50" cy="18" r="6" stroke={G} strokeWidth="3">
        <animate attributeName="r" values="6;7;6" dur="1.5s" repeatCount="indefinite" />
      </circle>
      <path d="M50 8 L50 12 M44 18 L48 18 M56 18 L52 18" stroke={G} strokeWidth="2" strokeLinecap="round">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="1.2s" repeatCount="indefinite" />
      </path>
    </svg>
  )
}

function Tag() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-12 w-12 lg:h-20 lg:w-20">
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-2;0,0" dur="2s" repeatCount="indefinite" />
        <path d="M12 12 L36 12 L52 28 L36 44 L12 44 Z" stroke={OR} strokeWidth="3" strokeLinejoin="round" />
        <circle cx="20" cy="28" r="4" fill={OR} />
        <text x="40" y="34" textAnchor="middle" fontSize="14" fontWeight="bold" fill={R}>%</text>
      </g>
    </svg>
  )
}

function Envelope() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-12 w-12 lg:h-20 lg:w-20">
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-3;0,0" dur="2.2s" repeatCount="indefinite" />
        <rect x="10" y="18" width="44" height="30" rx="3" stroke={S} strokeWidth="3" />
        <path d="M10 18 L32 36 L54 18" stroke={B} strokeWidth="3" strokeLinejoin="round" />
        <path d="M10 48 L26 34" stroke={S} strokeWidth="2" strokeLinecap="round" opacity="0.4" />
        <path d="M54 48 L38 34" stroke={S} strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      </g>
    </svg>
  )
}

function Certificate() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-12 w-12 lg:h-20 lg:w-20">
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-3;0,0" dur="2.4s" repeatCount="indefinite" />
        <rect x="14" y="8" width="36" height="36" rx="3" stroke={S} strokeWidth="3" />
        <circle cx="32" cy="22" r="6" stroke={G} strokeWidth="2.5" />
        <path d="M29 22 L31 24 L35 20" stroke={GR} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="22" y1="36" x2="42" y2="36" stroke={S} strokeWidth="2" strokeLinecap="round" />
        <path d="M26 48 L32 54 L38 48" stroke={G} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="32" y1="44" x2="32" y2="54" stroke={G} strokeWidth="3" />
      </g>
    </svg>
  )
}

function Shirt() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-12 w-12 lg:h-20 lg:w-20">
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-3;0,0" dur="2s" repeatCount="indefinite" />
        <path d="M20 12 L28 12 L32 18 L36 12 L44 12 L54 22 L46 30 L46 52 L18 52 L18 30 L10 22 Z" stroke={B} strokeWidth="3" strokeLinejoin="round" fill="none" />
        <path d="M26 22 C28 26 36 26 38 22" stroke={B} strokeWidth="2" strokeLinecap="round" fill="none" />
      </g>
    </svg>
  )
}

function Key() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-12 w-12 lg:h-20 lg:w-20">
      <g>
        <animateTransform attributeName="transform" type="rotate" values="0 32 32;-8 32 32;0 32 32;8 32 32;0 32 32" dur="2s" repeatCount="indefinite" />
        <circle cx="22" cy="28" r="10" stroke={G} strokeWidth="3" />
        <line x1="32" y1="28" x2="54" y2="28" stroke={G} strokeWidth="3" strokeLinecap="round" />
        <line x1="46" y1="28" x2="46" y2="36" stroke={G} strokeWidth="3" strokeLinecap="round" />
        <line x1="52" y1="28" x2="52" y2="34" stroke={G} strokeWidth="3" strokeLinecap="round" />
      </g>
    </svg>
  )
}

const SCENES: Record<Scene, () => ReactElement> = {
  person: Person, money: Money, chartUp: ChartUp, chartDown: ChartDown, bank: Bank,
  doc: Doc, book: Book, invoice: Invoice, box: Box, building: Building, clock: Clock,
  phone: Phone, bulb: Bulb, truck: Truck, plane: Plane, shield: Shield, handshake: Handshake,
  star: Star, gear: Gear, cycle: Cycle, scale: Scale, calendar: Calendar, megaphone: Megaphone,
  cup: Cup, drop: Drop, gift: Gift, home: Home, car: Car, land: Land, tag: Tag,
  envelope: Envelope, certificate: Certificate, shirt: Shirt, key: Key,
}

const BG = [
  'bg-sky-100', 'bg-emerald-100', 'bg-amber-100', 'bg-rose-100',
  'bg-violet-100', 'bg-teal-100', 'bg-indigo-100', 'bg-orange-100',
  'bg-pink-100', 'bg-lime-100', 'bg-cyan-100', 'bg-yellow-100',
]

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