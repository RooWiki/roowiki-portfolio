# Portfolio refinement

Preserve the existing dark palette, system sans-serif typography and square Tools/VFX artwork. Keep the lightweight fixed explosion from the preceding hero update.

- Add fixed section navigation with a current-section indicator, keyboard skip link and anchor offsets below the header. Software and Skills remain under About in the compact navigation.
- Add portfolio/contact actions to the introduction, location context and a discover-more link.
- Replace duplicated thumbnail implementations with GalleryCard: strict 1:1 aspect ratio, persistent project names, keyboard-visible focus, CSS hover animation and lazy image loading. All seven original project destinations remain unchanged.
- Use responsive galleries: four columns on large screens, two on tablets/phones and one below 381px. Cards retain square corners.
- Simplify Contact into a clear email action, phone and social links. Add back-to-top navigation in the footer.
- Remove the unused external font request; use the existing system font everywhere in the active page.

Shared App.tsx change: add a main-content anchor and programmatic focus target for the skip link. This is within the user's explicit authorization to refine the complete page.

Validation: production build and lint; Chromium checks at 320, 390, 768, 873 and 1440px for no horizontal overflow and seven 1:1 cards; section-link scrolling and active navigation, contact destination, mobile background dimming, pointer passthrough, keyboard skip link and page errors. External destinations are preserved, not newly audited.
