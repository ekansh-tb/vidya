import type { ActivityDomain } from "@/lib/learning/activity";

/** Original flat illustrations. Decorative only; the named control carries meaning. */
export function ActivityArt({ domain }: { domain: ActivityDomain }) {
  return <svg viewBox="0 0 240 180" fill="none" aria-hidden="true" className={`activity-art art-${domain}`}>
    <circle cx="119" cy="91" r="72" fill="white" fillOpacity=".5" />
    {domain === "language" && <>
      <path d="M40 53Q80 37 119 57Q158 37 199 53V137Q157 121 119 140Q80 121 40 137Z" fill="white" stroke="#6554c0" strokeWidth="5" strokeLinejoin="round" />
      <path d="M119 58V138M58 76H95M58 91H90M143 108H180" stroke="#6554c0" strokeWidth="5" strokeLinecap="round" />
      <path d="M160 65L165 79L180 80L168 90L172 104L160 96L147 104L151 90L140 80L155 79Z" fill="#eaaa4d" />
      <path d="M194 29L200 19M208 44L220 43" stroke="#6554c0" strokeWidth="4" strokeLinecap="round" />
    </>}
    {domain === "numeracy" && <>
      <rect x="36" y="91" width="72" height="65" rx="13" fill="#f4ad73" transform="rotate(-8 36 91)" />
      <rect x="110" y="75" width="72" height="76" rx="13" fill="#6554c0" transform="rotate(8 110 75)" />
      <path d="M94 23L141 84H47Z" fill="#59a79a" stroke="white" strokeWidth="4" strokeLinejoin="round" />
      <circle cx="177" cy="44" r="25" fill="#eaaa4d" />
      <text x="68" y="134" fill="#582d18" fontSize="38" fontWeight="800" textAnchor="middle">1</text>
      <text x="146" y="132" fill="white" fontSize="38" fontWeight="800" textAnchor="middle">2</text>
    </>}
    {(domain === "discovery" || domain === "real-world") && <>
      <path d="M29 141Q119 112 208 141" stroke="#59a79a" strokeWidth="7" strokeLinecap="round" />
      <path d="M119 135V67" stroke="#326f61" strokeWidth="7" strokeLinecap="round" />
      <path d="M115 111Q63 111 58 60Q112 57 115 111Z" fill="#79be9d" />
      <path d="M123 90Q123 42 179 35Q183 86 123 90Z" fill="#59a79a" />
      <path d="M119 118L80 82M122 80L159 55" stroke="#326f61" strokeWidth="4" strokeLinecap="round" />
      <circle cx="48" cy="36" r="15" fill="#eaaa4d" />
      <path d="M47 11V4M23 34H15M66 17L72 11" stroke="#eaaa4d" strokeWidth="4" strokeLinecap="round" />
    </>}
    {domain === "creative" && <>
      <path d="M45 49Q68 22 113 28Q182 26 196 80Q210 138 155 148Q118 156 114 127Q111 112 94 122Q51 148 38 107Q26 73 45 49Z" fill="#ffe1cb" stroke="#ba7154" strokeWidth="4" />
      <circle cx="63" cy="72" r="12" fill="#6554c0" /><circle cx="99" cy="52" r="12" fill="#eaaa4d" /><circle cx="142" cy="57" r="12" fill="#59a79a" /><circle cx="170" cy="91" r="12" fill="#d96887" />
      <path d="M87 153L160 61" stroke="#6554c0" strokeWidth="12" strokeLinecap="round" />
      <path d="M160 60Q168 35 184 32Q185 50 166 66Z" fill="#326f61" />
    </>}
    {domain === "social" && <>
      <circle cx="92" cy="86" r="49" fill="#f4ad73" /><circle cx="159" cy="111" r="38" fill="#6554c0" />
      <path d="M73 75V78M111 75V78M76 96Q92 113 108 96" stroke="#582d18" strokeWidth="5" strokeLinecap="round" />
      <path d="M146 103V106M173 103V106M147 121Q160 133 172 121" stroke="white" strokeWidth="4" strokeLinecap="round" />
      <path d="M161 52Q136 34 144 22Q157 11 166 25Q183 9 192 26Q195 39 161 52Z" fill="#d96887" />
    </>}
  </svg>;
}
