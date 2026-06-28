import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-car-placeholder',
  standalone: true,
  template: `
    <svg [attr.viewBox]="'0 0 500 220'" xmlns="http://www.w3.org/2000/svg" [style.width.%]="100" [style.height.%]="100">
      <defs>
        <linearGradient id="speedBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#ef4444" />
          <stop offset="55%" stop-color="#dc2626" />
          <stop offset="100%" stop-color="#7f1d1d" />
        </linearGradient>
        <linearGradient id="speedGlassGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#3f3f46" />
          <stop offset="100%" stop-color="#18181b" />
        </linearGradient>
        <radialGradient id="speedWheelGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#3f3f46" />
          <stop offset="70%" stop-color="#18181b" />
          <stop offset="100%" stop-color="#000" />
        </radialGradient>
      </defs>

      <ellipse cx="250" cy="195" rx="210" ry="14" fill="#000" opacity="0.45" />

      <path
        d="M40 150 Q40 120 80 112 L140 70 Q170 50 230 48 L330 48 Q380 50 410 75 L450 112 Q470 120 470 150 L470 165 Q470 178 455 178 L55 178 Q40 178 40 165 Z"
        fill="url(#speedBodyGrad)"
      />
      <path d="M150 108 L185 75 Q205 62 240 60 L300 60 Q330 62 350 78 L382 108 Z" fill="url(#speedGlassGrad)" />
      <path d="M198 108 L222 78 L240 78 L240 108 Z" fill="#27272a" opacity="0.5" />
      <path d="M300 108 L300 78 L320 78 L342 108 Z" fill="#27272a" opacity="0.5" />
      <path
        d="M185 75 Q205 62 240 60 L300 60 Q330 62 350 78"
        fill="none"
        stroke="#fca5a5"
        stroke-width="2"
        opacity="0.5"
      />
      <path d="M55 132 L455 132" stroke="#fecaca" stroke-width="2.5" opacity="0.35" />
      <path d="M55 150 L455 150" stroke="#000" stroke-width="3" opacity="0.2" />
      <path d="M440 120 L468 138 Q472 144 468 150 L455 150 L440 132 Z" fill="#991b1b" />
      <ellipse cx="450" cy="128" rx="10" ry="7" fill="#fef2f2" opacity="0.9" />
      <ellipse cx="450" cy="128" rx="5" ry="3.5" fill="#fff" />
      <rect x="42" y="118" width="9" height="16" rx="3" fill="#fca5a5" />
      <rect x="455" y="138" width="14" height="20" rx="4" fill="#18181b" />

      <circle cx="150" cy="178" r="32" fill="url(#speedWheelGrad)" />
      <circle cx="150" cy="178" r="13" fill="#52525b" />
      <circle cx="150" cy="178" r="5" fill="#27272a" />

      <circle cx="370" cy="178" r="32" fill="url(#speedWheelGrad)" />
      <circle cx="370" cy="178" r="13" fill="#52525b" />
      <circle cx="370" cy="178" r="5" fill="#27272a" />

      <rect x="255" y="115" width="18" height="4" rx="2" fill="#fef2f2" opacity="0.6" />
    </svg>
  `,
})
export class CarPlaceholderComponent {
  @Input() opacity = 1;
}
