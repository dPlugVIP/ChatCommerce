# DplugVIP Cyberleaf Brand Assets

Original raster brand exploration generated for the DplugVIP restricted-commerce interface. These files are deliberately not referenced by application code. Upload selected exports through **Admin → Settings → Brand control** to activate them.

## Recommended uploads

- **Primary logo:** `export/dplugvip-brand-mark-1024.png`
- **Compact brand mark:** `export/dplugvip-micromark-512.png`
- **Browser favicon:** `export/favicon.ico` or `export/dplugvip-micromark-64.png`
- **Apple touch icon:** `export/apple-touch-icon.png`
- **Social avatar:** `export/dplugvip-social-avatar.jpg`
- **Monochrome variants:** `export/dplugvip-micromark-black.png` and `export/dplugvip-micromark-white.png`

The `source/` directory contains the flat chroma-key generations retained for future re-extraction. The `export/` directory contains transparent, normalized production assets.

## Visual direction

The primary mark translates the supplied radial botanical silhouette into seven graphite armor blades connected to an encrypted lime core by cyan signal traces. The micro-mark reduces the system to five bold blades and three heavy signal cuts so it remains legible at favicon scale.

## Generation method

Generated with the built-in image-generation tool using the supplied image only as a composition reference. Transparency was produced with the imagegen skill's chroma-key extraction workflow, then normalized variants and multi-resolution favicon assets were derived with Pillow.

### Master prompt summary

> Create an original futuristic cyber-botanical insignia with seven sharply tapered armor panels radiating from an encrypted central node. Use graphite forms, electric-cyan circuit details, and one restrained signal-lime core. Keep it flat, geometric, symmetric, vector-friendly, and strong at small sizes; avoid copying the reference contours, photorealism, 3D effects, text, and generic shield motifs.

### Micro-mark prompt summary

> Redesign the master specifically for 16–32px legibility using five bold angular blades, a large hexagonal central node, and only three thick cyan signal cuts. Preserve the brand family while removing fine circuitry and other fragile details.
