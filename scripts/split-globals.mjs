import fs from 'fs'

const src = fs.readFileSync('app/globals.css', 'utf8')
const lines = src.split(/\r?\n/)

const wellnessImports = lines.slice(6, 29).join('\n')
const baseHead = lines.slice(0, 6).join('\n')
const baseTokens = lines.slice(30, 480).join('\n')
const wellnessTail = lines.slice(480, 1590).join('\n')
const basePrint = lines.slice(1590).join('\n')

const base = [baseHead, '', baseTokens, '', basePrint].join('\n')
const wellness = [
  '/** Wellness / marketing / patient-app globals — not loaded on clinical triage routes. */',
  '',
  wellnessImports,
  '',
  wellnessTail,
].join('\n')

fs.writeFileSync('app/globals-base.css', base)
fs.writeFileSync('app/styles/wellness-globals.css', wellness)
fs.writeFileSync('app/globals.css', '@import "./globals-base.css";\n')
console.log('Split complete')
